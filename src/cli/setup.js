/* eslint-disable no-console */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const os = require('os');
const {
  codexHome,
  codexConfigPath,
  codexPromptsPath,
  skillsSource,
  promptsSource,
} = require('../utils/paths');
const { mergeConfig } = require('../config/generator');
const { getCatalogHeadlineCounts } = require('../catalog/reader');
const {
  loadSkillsFromSource,
  detectConflicts,
  resolveConflicts,
  applyResolutions,
  generateReport,
} = require('../merge/skill-merger');

const SETUP_SCOPES = new Set(['user', 'project-local', 'project']);

function readPersistedScope(cwd) {
  const scopeFile = path.join(cwd, '.omcodex', 'setup-scope.json');
  if (!fs.existsSync(scopeFile)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(scopeFile, 'utf8'));
    if (SETUP_SCOPES.has(parsed.scope)) return parsed.scope;
  } catch {}
  return null;
}

async function persistScope(cwd, scope, dryRun) {
  const scopeFile = path.join(cwd, '.omcodex', 'setup-scope.json');
  if (dryRun) return;
  await fsp.mkdir(path.dirname(scopeFile), { recursive: true });
  await fsp.writeFile(scopeFile, `${JSON.stringify({ scope }, null, 2)}\n`, 'utf8');
}

async function copyDirectory(src, dest, options) {
  if (!fs.existsSync(src)) return 0;
  if (!options.dryRun) {
    await fsp.mkdir(dest, { recursive: true });
  }
  const entries = await fsp.readdir(src, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += await copyDirectory(from, to, options);
      continue;
    }

    if (!entry.isFile()) continue;

    if (!options.force && fs.existsSync(to)) continue;
    if (!options.dryRun) {
      await fsp.mkdir(path.dirname(to), { recursive: true });
      await fsp.copyFile(from, to);
    }
    count += 1;
  }

  return count;
}

async function copyFile(src, dest, options) {
  if (!fs.existsSync(src)) return false;
  if (!options.force && fs.existsSync(dest)) return false;
  if (!options.dryRun) {
    await fsp.mkdir(path.dirname(dest), { recursive: true });
    await fsp.copyFile(src, dest);
  }
  return true;
}

function evaluateSkillQuality(skill) {
  const skillDoc = path.join(skill.path, 'SKILL.md');
  if (!fs.existsSync(skillDoc)) {
    return { score: 0, signals: ['missing_skill_doc'] };
  }

  const content = fs.readFileSync(skillDoc, 'utf8');
  const signals = [];
  let score = 100;

  if (!/^---\n[\s\S]*?\n---\n?/m.test(content)) {
    score -= 30;
    signals.push('missing_frontmatter');
  }
  if (!/name:\s*[^\n]+/.test(content)) {
    score -= 15;
    signals.push('missing_name');
  }
  if (!/description:\s*[^\n]+/.test(content)) {
    score -= 15;
    signals.push('missing_description');
  }
  if (/(?:`|^\s*)\/[a-z][a-z-]*(?=(?:\s|`|:|$))/m.test(content)) {
    score -= 30;
    signals.push('legacy_slash_command');
  }
  if (/\bTask\s*\(|\bdelegate\s*\(/.test(content)) {
    score -= 20;
    signals.push('legacy_delegate_or_task_api');
  }
  if (/cc\s+--plugin-dir|\/plugin|HUD|omx_state/.test(content)) {
    score -= 20;
    signals.push('non_codex_runtime_reference');
  }
  if (!/\$[\w-]+|[a-z-]+:\s+[^\n]+/i.test(content)) {
    score -= 8;
    signals.push('missing_codex_invocation');
  }
  if (!/usage|when to use|instructions|workflow|步骤|用法/i.test(content)) {
    score -= 8;
    signals.push('missing_structure');
  }

  score = Math.max(0, Math.min(100, score));
  return { score, signals };
}

async function mergeSkillsFromSources(root, options = {}) {
  const sources = [];
  let forkSkills = [];
  let upstreamSkillsRaw = [];
  const qualityWinners = [];

  // Load local skills from .agent/skills/local/
  const localPath = path.join(root, '.agent', 'skills', 'local');
  const legacyForkPath = path.join(root, '.agent', 'skills');
  const forkPath = fs.existsSync(localPath) ? localPath : legacyForkPath;
  if (fs.existsSync(forkPath)) {
    forkSkills = loadSkillsFromSource(forkPath, 'fork');
    sources.push({
      name: 'fork',
      skills: forkSkills,
    });
  }

  // Load upstream skills from .agent/skills/upstream/<source>/
  const upstreamBaseDir = path.join(root, '.agent', 'skills', 'upstream');
  const legacyUpstreamCandidates = [
    path.join(root, '.upstream', 'skills'),
    path.join(root, '.upstream', '.agent', 'skills'),
    path.join(root, '.upstream', '.codex', 'skills'),
  ];

  if (fs.existsSync(upstreamBaseDir)) {
    // New multi-source layout: each subdirectory is an upstream source
    const upstreamSources = fs.readdirSync(upstreamBaseDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());
    for (const srcDir of upstreamSources) {
      const srcPath = path.join(upstreamBaseDir, srcDir.name);
      const srcSkills = loadSkillsFromSource(srcPath, srcDir.name);
      if (srcSkills.length > 0) {
        upstreamSkillsRaw.push(...srcSkills);
        sources.push({
          name: srcDir.name,
          skills: srcSkills,
        });
      }
    }
  } else {
    // Legacy: single .upstream/ directory
    const upstreamPath = legacyUpstreamCandidates.find((candidate) => fs.existsSync(candidate));
    if (upstreamPath) {
      upstreamSkillsRaw = loadSkillsFromSource(upstreamPath, 'upstream');
      sources.push({
        name: 'upstream',
        skills: upstreamSkillsRaw,
      });
    }
  }

  // Load merge config
  const mergeConfigPath = path.join(root, '.codex', 'merge-config.json');
  const defaultMergeConfigPath = path.join(root, 'templates', 'merge-config.json');
  let mergeConfig = { allow_namespacing: false, preferences: {} };

  const effectiveMergeConfigPath = fs.existsSync(mergeConfigPath)
    ? mergeConfigPath
    : defaultMergeConfigPath;

  if (fs.existsSync(effectiveMergeConfigPath)) {
    try {
      mergeConfig = JSON.parse(fs.readFileSync(effectiveMergeConfigPath, 'utf8'));
    } catch (err) {
      console.warn(`Warning: Failed to load merge config (${effectiveMergeConfigPath}): ${err.message}`);
    }
  }

  // Build auto quality preferences for overlap skills.
  const forkByName = new Map(forkSkills.map((item) => [item.name, item]));
  const upstreamByName = new Map(upstreamSkillsRaw.map((item) => [item.name, item]));
  const overlapNames = Array.from(forkByName.keys())
    .filter((name) => upstreamByName.has(name))
    .sort((a, b) => a.localeCompare(b));
  const autoPreferences = {};

  for (const name of overlapNames) {
    const forkQuality = evaluateSkillQuality(forkByName.get(name));
    const upstreamSkill = upstreamByName.get(name);
    const upstreamQuality = evaluateSkillQuality(upstreamSkill);
    const upstreamSourceName = upstreamSkill.source || 'upstream';
    const winner = forkQuality.score >= upstreamQuality.score ? 'fork' : upstreamSourceName;
    autoPreferences[name] = winner;
    qualityWinners.push({
      skill: name,
      winner,
      forkScore: forkQuality.score,
      upstreamScore: upstreamQuality.score,
      forkSignals: forkQuality.signals,
      upstreamSignals: upstreamQuality.signals,
    });
  }

  const mergedPreferences = {
    ...autoPreferences,
    ...(mergeConfig.preferences || {}),
  };
  const mergeConfigWithAuto = {
    ...mergeConfig,
    preferences: mergedPreferences,
  };

  // Detect conflicts
  const conflicts = detectConflicts(sources);

  // Resolve conflicts
  const resolutions = resolveConflicts(conflicts, mergeConfigWithAuto);

  // Apply resolutions
  const merged = applyResolutions(sources, resolutions);

  // Generate report
  const report = generateReport(conflicts, resolutions);

  const sourceStats = {
    forkCount: forkSkills.length,
    upstreamRawCount: upstreamSkillsRaw.length,
    overlapCount: overlapNames.length,
    qualityWinnerFork: qualityWinners.filter((row) => row.winner === 'fork').length,
    qualityWinnerUpstream: qualityWinners.filter((row) => row.winner === 'upstream').length,
    qualityWinners,
  };

  return { merged, report, conflicts, resolutions, sourceStats };
}

async function copyMergedSkills(merged, dest, options) {
  if (!options.dryRun) {
    await fsp.mkdir(dest, { recursive: true });
  }

  let count = 0;

  for (const skill of merged) {
    const skillDest = path.join(dest, skill.name);
    count += await copyDirectory(skill.path, skillDest, options);
  }

  return count;
}


async function setup(options = {}) {
  const cwd = process.cwd();
  const root = path.resolve(__dirname, '..', '..');
  const scope = options.scope || readPersistedScope(cwd) || 'user';

  if (!SETUP_SCOPES.has(scope)) {
    throw new Error(`Invalid scope: ${scope}. Expected one of user, project-local, project.`);
  }

  console.log('oh-my-codex setup');
  console.log('=================');
  console.log(`Scope: ${scope}`);

  const baseCodexHome = codexHome(scope, cwd);
  const configPath = codexConfigPath(scope, cwd);
  const rulesSource = path.join(root, 'templates', 'rules');
  const rulesDest = scope === 'user'
    ? path.join(os.homedir(), '.codex', 'rules')
    : path.join(cwd, '.codex', 'rules');
  const globalAgentsSources = [
    path.join(root, 'templates', 'AGENTS.global.md'),
    path.join(root, 'templates', 'AGENTS.md'),
  ];
  const globalAgentsSource = globalAgentsSources.find((candidate) => fs.existsSync(candidate)) || null;
  const globalAgentsDest = path.join(os.homedir(), '.codex', 'AGENTS.md');
  const promptsSrc = promptsSource(root);
  const promptsDest = codexPromptsPath(scope, cwd);

  const skillSrc = (() => {
    const src = skillsSource(root);
    if (fs.existsSync(src.localSkills)) return src.localSkills;
    if (fs.existsSync(src.agentSkills)) return src.agentSkills;
    if (fs.existsSync(src.codexSkills)) return src.codexSkills;
    throw new Error('No skills source found (.agent/skills/local or .codex/skills)');
  })();

  const skillsDest = scope === 'user'
    ? path.join(os.homedir(), '.codex', 'skills')
    : path.join(cwd, '.codex', 'skills');

  await persistScope(cwd, scope, options.dryRun);

  console.log('[1/6] Installing skills...');
  const shouldInstallSkills = options.installSkills !== false && scope !== 'project';

  let skillCount = 0;
  let mergeReport = null;

  if (shouldInstallSkills) {
    // Use multi-source merge if enabled
    if (options.mergeSkills !== false) {
      try {
        const { merged, report, sourceStats } = await mergeSkillsFromSources(root, options);
        skillCount = await copyMergedSkills(merged, skillsDest, options);
        mergeReport = report;

        const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
        console.log(`  ${label} ${skillCount} files from ${merged.length} skills -> ${skillsDest}`);
        if (sourceStats && sourceStats.overlapCount > 0) {
          console.log(`  Overlap quality winners: fork=${sourceStats.qualityWinnerFork}, upstream=${sourceStats.qualityWinnerUpstream}`);
        }

        if (report.conflicts.length > 0) {
          console.log(`  Resolved ${report.conflicts.length} conflicts`);

          // Save merge report
          if (!options.dryRun) {
            const reportPath = path.join(cwd, '.omcodex', 'merge-report.json');
            await fsp.mkdir(path.dirname(reportPath), { recursive: true });
            await fsp.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
            console.log(`  Merge report saved to: ${reportPath}`);
          }
        }
      } catch (err) {
        console.warn(`  Warning: Merge failed (${err.message}), falling back to direct copy`);
        skillCount = await copyDirectory(skillSrc, skillsDest, options);
        const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
        console.log(`  ${label} ${skillCount} files -> ${skillsDest}`);
      }
    } else {
      // Direct copy without merge
      skillCount = await copyDirectory(skillSrc, skillsDest, options);
      const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
      console.log(`  ${label} ${skillCount} files -> ${skillsDest}`);
    }
  } else {
    console.log('  Skipped for project scope');
  }

  console.log('[2/6] Installing prompts...');
  const shouldInstallPrompts = options.installPrompts !== false && scope !== 'project';
  if (!shouldInstallPrompts) {
    console.log('  Skipped (--no-prompts or project scope)');
  } else if (!fs.existsSync(promptsSrc)) {
    console.log(`  Skipped (missing prompts source: ${promptsSrc})`);
  } else {
    const promptCount = await copyDirectory(promptsSrc, promptsDest, options);
    const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
    console.log(`  ${label} ${promptCount} files -> ${promptsDest}`);
  }

  console.log('[3/6] Installing rules...');
  if (options.installRules !== false) {
    const ruleCount = await copyDirectory(rulesSource, rulesDest, options);
    const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
    console.log(`  ${label} ${ruleCount} files -> ${rulesDest}`);
  } else {
    console.log('  Skipped (--no-rules)');
  }

  console.log('[4/6] Installing global AGENTS.md...');
  if (options.installAgents === false) {
    console.log('  Skipped (--no-agents)');
  } else if (scope !== 'user') {
    console.log('  Skipped (only applies to user scope)');
  } else if (!globalAgentsSource) {
    console.log('  Skipped (missing templates/AGENTS.global.md and templates/AGENTS.md)');
  } else {
    const installed = await copyFile(globalAgentsSource, globalAgentsDest, options);
    const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
    if (installed || options.force || options.dryRun) {
      console.log(`  ${label} ${globalAgentsDest}`);
      console.log(`  Source: ${path.relative(root, globalAgentsSource)}`);
    } else {
      console.log(`  Skipped (already exists): ${globalAgentsDest}`);
    }
  }

  console.log('[5/6] Merging config.toml...');
  if (options.installConfig !== false && !options.dryRun) {
    mergeConfig(configPath, root, {
      enableContext7: options.enableContext7,
      skillsDir: skillsDest,
    });
  }
  if (options.installConfig !== false) {
    const label = options.dryRun ? 'Would update' : 'Updated';
    console.log(`  ${label} ${configPath}`);
  } else {
    console.log('  Skipped (--no-config)');
  }

  console.log('[6/6] Catalog check...');
  const headline = getCatalogHeadlineCounts(root);
  if (headline) {
    console.log(`  Catalog baseline: ${headline.skills} skills, ${headline.prompts} prompts`);
  } else {
    console.log('  Catalog manifest missing (run npm run catalog:generate)');
  }

  console.log('\nDone.');
}

module.exports = { setup };
