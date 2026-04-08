/* eslint-disable no-console */

/**
 * Skill Merger Module
 *
 * Handles multi-source skill merging with conflict detection and resolution.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Parse skill metadata from SKILL.md frontmatter
 */
function parseSkillMetadata(skillPath) {
  const skillFile = path.join(skillPath, 'SKILL.md');

  if (!fs.existsSync(skillFile)) {
    return null;
  }

  const content = fs.readFileSync(skillFile, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    return null;
  }

  const frontmatterText = match[1];
  const metadata = {};

  frontmatterText.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();
    metadata[key] = value;
  });

  return metadata;
}

/**
 * Load skills from a source directory
 */
function loadSkillsFromSource(sourceDir, sourceName) {
  if (!fs.existsSync(sourceDir)) {
    return [];
  }

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  const skills = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillPath = path.join(sourceDir, entry.name);
    const metadata = parseSkillMetadata(skillPath);

    if (metadata) {
      skills.push({
        name: entry.name,
        path: skillPath,
        source: sourceName,
        metadata,
      });
    }
  }

  return skills;
}

/**
 * Calculate Jaccard similarity between two descriptions
 */
function calculateDescriptionSimilarity(desc1, desc2) {
  if (!desc1 || !desc2) return 0;

  // Normalize and tokenize
  const words1 = new Set(desc1.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(desc2.toLowerCase().split(/\s+/).filter(w => w.length > 2));

  if (words1.size === 0 || words2.size === 0) return 0;

  // Calculate Jaccard similarity
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Detect conflicts between multiple skill sources
 */
function detectConflicts(sourcesArray) {
  const skillsByName = new Map();
  const allSkills = [];
  const conflicts = [];

  // Collect all skills
  for (const source of sourcesArray) {
    for (const skill of source.skills) {
      const enriched = {
        ...skill,
        sourceName: source.name,
      };
      allSkills.push(enriched);

      if (!skillsByName.has(skill.name)) {
        skillsByName.set(skill.name, []);
      }
      skillsByName.get(skill.name).push(enriched);
    }
  }

  // Detect exact name conflicts
  for (const [name, versions] of skillsByName.entries()) {
    if (versions.length > 1) {
      conflicts.push({
        type: 'exact_name',
        name,
        versions,
      });
    }
  }

  // Detect description similarity conflicts
  for (let i = 0; i < allSkills.length; i++) {
    for (let j = i + 1; j < allSkills.length; j++) {
      const skill1 = allSkills[i];
      const skill2 = allSkills[j];

      // Skip if same name (already detected as exact conflict)
      if (skill1.name === skill2.name) continue;

      const desc1 = skill1.metadata.description || '';
      const desc2 = skill2.metadata.description || '';

      const similarity = calculateDescriptionSimilarity(desc1, desc2);

      if (similarity > 0.8) {
        conflicts.push({
          type: 'similar_description',
          name: `${skill1.name} vs ${skill2.name}`,
          versions: [skill1, skill2],
          similarity,
        });
      }
    }
  }

  // Detect intent-based conflicts (same intent across different sources)
  const intentMap = new Map();
  for (const source of sourcesArray) {
    for (const skill of source.skills) {
      const intent = skill.metadata.intent;
      if (!intent) continue;
      if (!intentMap.has(intent)) intentMap.set(intent, []);
      intentMap.get(intent).push({
        ...skill,
        sourceName: source.name,
      });
    }
  }

  for (const [intent, versions] of intentMap.entries()) {
    const sources = new Set(versions.map((v) => v.sourceName));
    if (sources.size > 1) {
      conflicts.push({
        type: 'same_intent',
        name: `intent:${intent}`,
        intent,
        versions,
      });
    }
  }

  return conflicts;
}


/**
 * Compare semantic versions
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;

    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }

  return 0;
}

/**
 * Resolve conflicts using 4-tier strategy:
 * 1. User config preferences
 * 2. SemVer (highest version wins)
 * 3. Fork priority (fork > upstream)
 * 4. Namespace (keep both with prefixes)
 */
function resolveConflicts(conflicts, config = {}) {
  const resolutions = [];

  for (const conflict of conflicts) {
    const { name, versions, type, similarity } = conflict;

    // Handle intent-based conflicts as informational warnings
    if (type === 'same_intent') {
      resolutions.push({
        name,
        type: 'same_intent',
        resolution: 'info',
        intent: conflict.intent,
        versions,
        message: `Intent "${conflict.intent}" shared across sources: ${versions.map(v => `${v.name}[${v.sourceName}]`).join(', ')}`,
      });
      continue;
    }

    // Handle description similarity conflicts differently
    if (type === 'similar_description') {
      resolutions.push({
        name,
        type: 'similar_description',
        resolution: 'warning',
        similarity,
        versions,
        message: `Similar functionality detected (${(similarity * 100).toFixed(1)}% match)`,
      });
      continue;
    }

    // Handle exact name conflicts
    // Tier 1: User config preference
    if (config.preferences && config.preferences[name]) {
      const preferredSource = config.preferences[name];
      const preferred = versions.find(v => v.sourceName === preferredSource);

      if (preferred) {
        resolutions.push({
          name,
          type: 'exact_name',
          resolution: 'user-preference',
          winner: preferred,
          rejected: versions.filter(v => v !== preferred),
        });
        continue;
      }
    }

    // Tier 2: SemVer comparison
    const withVersions = versions.filter(v => v.metadata.version);
    if (withVersions.length === versions.length) {
      const sorted = [...versions].sort((a, b) =>
        compareVersions(b.metadata.version, a.metadata.version)
      );

      if (compareVersions(sorted[0].metadata.version, sorted[1].metadata.version) > 0) {
        resolutions.push({
          name,
          type: 'exact_name',
          resolution: 'semver',
          winner: sorted[0],
          rejected: sorted.slice(1),
        });
        continue;
      }
    }

    // Tier 3: Fork priority
    const forkVersion = versions.find(v => v.metadata.source === 'fork');
    if (forkVersion) {
      resolutions.push({
        name,
        type: 'exact_name',
        resolution: 'fork-priority',
        winner: forkVersion,
        rejected: versions.filter(v => v !== forkVersion),
      });
      continue;
    }

    // Tier 4: Namespace (if allowed)
    if (config.allow_namespacing) {
      resolutions.push({
        name,
        type: 'exact_name',
        resolution: 'namespace',
        winner: null,
        namespaced: versions.map(v => ({
          ...v,
          namespacedName: `${v.sourceName}-${name}`,
        })),
      });
    } else {
      // Default: pick first
      resolutions.push({
        name,
        type: 'exact_name',
        resolution: 'default-first',
        winner: versions[0],
        rejected: versions.slice(1),
      });
    }
  }

  return resolutions;
}


/**
 * Apply resolutions and create merged skill list
 */
function applyResolutions(sourcesArray, resolutions) {
  const merged = new Map();
  const conflictNames = new Set();

  // Collect conflict names (exact name conflicts only)
  for (const resolution of resolutions) {
    if (resolution.type === 'exact_name') {
      conflictNames.add(resolution.name);
    }
  }

  // Add all non-conflicting skills
  for (const source of sourcesArray) {
    for (const skill of source.skills) {
      if (!conflictNames.has(skill.name)) {
        merged.set(skill.name, {
          ...skill,
          sourceName: source.name,
        });
      }
    }
  }

  // Add resolved conflicts (exact name conflicts only)
  for (const resolution of resolutions) {
    if (resolution.type === 'similar_description') {
      // Warnings don't affect merging, just report them
      continue;
    }

    if (resolution.resolution === 'namespace') {
      // Add all namespaced versions
      for (const namespaced of resolution.namespaced) {
        merged.set(namespaced.namespacedName, namespaced);
      }
    } else if (resolution.winner) {
      merged.set(resolution.name, resolution.winner);
    }
  }

  return Array.from(merged.values());
}


/**
 * Generate merge report
 */
function generateReport(conflicts, resolutions) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total_conflicts: conflicts.length,
      exact_name_conflicts: conflicts.filter(c => c.type === 'exact_name').length,
      similar_description_warnings: conflicts.filter(c => c.type === 'similar_description').length,
      resolutions: {
        'user-preference': 0,
        'semver': 0,
        'fork-priority': 0,
        'namespace': 0,
        'default-first': 0,
        'warning': 0,
        'info': 0,
      },
    },
    conflicts: [],
  };

  for (const resolution of resolutions) {
    report.summary.resolutions[resolution.resolution] += 1;

    const conflictData = {
      skill: resolution.name,
      type: resolution.type,
      resolution: resolution.resolution,
    };

    if (resolution.similarity !== undefined) {
      conflictData.similarity = resolution.similarity;
      conflictData.message = resolution.message;
    }

    if (resolution.winner) {
      conflictData.winner = {
        source: resolution.winner.sourceName,
        version: resolution.winner.metadata.version,
      };
    }

    if (resolution.rejected) {
      conflictData.rejected = resolution.rejected.map(r => ({
        source: r.sourceName,
        version: r.metadata.version,
      }));
    }

    if (resolution.namespaced) {
      conflictData.namespaced = resolution.namespaced.map(n => ({
        name: n.namespacedName,
        source: n.sourceName,
        version: n.metadata.version,
      }));
    }

    if (resolution.versions) {
      conflictData.versions = resolution.versions.map(v => ({
        name: v.name,
        source: v.sourceName,
        version: v.metadata.version,
        description: v.metadata.description,
      }));
    }

    report.conflicts.push(conflictData);
  }

  return report;
}


module.exports = {
  parseSkillMetadata,
  loadSkillsFromSource,
  detectConflicts,
  resolveConflicts,
  applyResolutions,
  generateReport,
};



