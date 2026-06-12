#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Skill Management CLI
 *
 * Commands for managing skills from multiple sources
 */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const os = require('os');

const {
  loadSkillsFromSource,
  detectConflicts,
  resolveConflicts,
  parseSkillMetadata,
} = require('../merge/skill-merger');

function expandHome(input, home) {
  if (!input) return null;
  if (input === '~') return home;
  if (input.startsWith('~/')) return path.join(home, input.slice(2));
  return input;
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function candidateSkillRoots(options = {}) {
  const cwd = options.cwd || process.cwd();
  const home = options.home || os.homedir();
  const env = options.env || process.env;
  const codexHome = expandHome(env.CODEX_HOME, home);

  return unique([
    path.join(cwd, '.codex', 'skills'),
    path.join(cwd, '.agents', 'skills'),
    codexHome ? path.join(codexHome, 'skills') : null,
    path.join(home, '.codex', 'skills'),
    path.join(home, '.agents', 'skills'),
  ]).map((candidate) => path.resolve(candidate));
}

function resolveSkillPath(skillName, options = {}) {
  if (!skillName || /[/\\]/.test(skillName)) return null;

  for (const root of candidateSkillRoots(options)) {
    const skillDir = path.join(root, skillName);
    const skillFile = path.join(skillDir, 'SKILL.md');
    if (fs.existsSync(skillFile)) return skillDir;
  }

  return null;
}

/**
 * List all installed skills with their sources
 */
async function listSkills(options = {}) {
  const skillsDir = options.skillsDir || path.join(os.homedir(), '.codex', 'skills');

  if (!fs.existsSync(skillsDir)) {
    console.log('No skills directory found');
    return;
  }

  const skills = loadSkillsFromSource(skillsDir, 'installed');

  console.log(`Skills (${skills.length} total)`);
  console.log('='.repeat(60));

  for (const skill of skills) {
    const { name, metadata } = skill;
    const version = metadata.version || 'unknown';
    const source = metadata.source || 'unknown';

    console.log(`${name.padEnd(30)} v${version.padEnd(10)} [${source}]`);

    if (options.verbose) {
      console.log(`  Description: ${metadata.description || 'N/A'}`);
      console.log(`  Updated: ${metadata.updated_at || 'N/A'}`);
      console.log('');
    }
  }
}

/**
 * Set preference for a specific skill
 */
async function setPreference(skillName, source, options = {}) {
  const configPath = options.configPath || path.join(process.cwd(), '.codex', 'merge-config.json');

  let config = {
    merge_strategy: 'version-priority',
    allow_namespacing: false,
    auto_merge: true,
    preferences: {},
  };

  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (err) {
      console.error(`Error reading config: ${err.message}`);
      return;
    }
  }

  config.preferences = config.preferences || {};
  config.preferences[skillName] = source;

  await fsp.mkdir(path.dirname(configPath), { recursive: true });
  await fsp.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');

  console.log(`✓ Set preference for '${skillName}' to source '${source}'`);
  console.log(`  Config saved to: ${configPath}`);
}

/**
 * Show conflict report
 */
async function showConflicts(options = {}) {
  const reportPath = options.reportPath || path.join(process.cwd(), '.omcodex', 'merge-report.json');

  if (!fs.existsSync(reportPath)) {
    console.log('No merge report found. Run setup to generate one.');
    return;
  }

  try {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    console.log('Skill Merge Report');
    console.log('==================');
    console.log(`Generated: ${report.timestamp}`);
    console.log(`Total conflicts: ${report.summary.total_conflicts}\n`);

    if (report.conflicts.length === 0) {
      console.log('No conflicts detected.');
      return;
    }

    console.log('Resolutions:');
    for (const [strategy, count] of Object.entries(report.summary.resolutions)) {
      if (count > 0) {
        console.log(`  ${strategy}: ${count}`);
      }
    }

    console.log('\nConflict Details:');
    console.log('='.repeat(60));

    for (const conflict of report.conflicts) {
      console.log(`\n${conflict.skill}`);
      console.log(`  Resolution: ${conflict.resolution}`);

      if (conflict.type) {
        console.log(`  Type: ${conflict.type}`);
      }

      if (conflict.similarity) {
        console.log(`  Similarity: ${(conflict.similarity * 100).toFixed(1)}%`);
      }

      if (conflict.winner) {
        console.log(`  Winner: ${conflict.winner.source} (v${conflict.winner.version})`);
      }

      if (conflict.rejected && conflict.rejected.length > 0) {
        console.log(`  Rejected: ${conflict.rejected.map(r => `${r.source} (v${r.version})`).join(', ')}`);
      }

      if (conflict.namespaced && conflict.namespaced.length > 0) {
        console.log('  Namespaced versions:');
        for (const ns of conflict.namespaced) {
          console.log(`    - ${ns.name}: ${ns.source} (v${ns.version})`);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading report: ${err.message}`);
  }
}

async function printSkillPath(skillName, options = {}) {
  const skillPath = resolveSkillPath(skillName, options);
  if (!skillPath) {
    console.error(`Skill not found: ${skillName}`);
    process.exit(1);
  }
  console.log(skillPath);
}

module.exports = {
  listSkills,
  printSkillPath,
  resolveSkillPath,
  setPreference,
  showConflicts,
};
