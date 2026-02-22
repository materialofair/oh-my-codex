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
  const promptsSrc = promptsSource(root);
  const promptsDest = codexPromptsPath(scope, cwd);

  const skillSrc = (() => {
    const src = skillsSource(root);
    if (fs.existsSync(src.agentSkills)) return src.agentSkills;
    if (fs.existsSync(src.codexSkills)) return src.codexSkills;
    throw new Error('No skills source found (.agent/skills or .codex/skills)');
  })();

  const skillsDest = scope === 'user'
    ? path.join(os.homedir(), '.codex', 'skills')
    : path.join(cwd, '.codex', 'skills');

  await persistScope(cwd, scope, options.dryRun);

  console.log('[1/5] Installing skills...');
  const shouldInstallSkills = options.installSkills !== false && scope !== 'project';
  const skillCount = shouldInstallSkills
    ? await copyDirectory(skillSrc, skillsDest, options)
    : 0;
  if (shouldInstallSkills) {
    const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
    console.log(`  ${label} ${skillCount} files -> ${skillsDest}`);
  } else {
    console.log('  Skipped for project scope');
  }

  console.log('[2/5] Installing prompts...');
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

  console.log('[3/5] Installing rules...');
  if (options.installRules !== false) {
    const ruleCount = await copyDirectory(rulesSource, rulesDest, options);
    const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
    console.log(`  ${label} ${ruleCount} files -> ${rulesDest}`);
  } else {
    console.log('  Skipped (--no-rules)');
  }

  console.log('[4/5] Merging config.toml...');
  if (options.installConfig !== false && !options.dryRun) {
    mergeConfig(configPath, root, { enableContext7: options.enableContext7 });
  }
  if (options.installConfig !== false) {
    const label = options.dryRun ? 'Would update' : 'Updated';
    console.log(`  ${label} ${configPath}`);
  } else {
    console.log('  Skipped (--no-config)');
  }

  console.log('[5/5] Catalog check...');
  const headline = getCatalogHeadlineCounts(root);
  if (headline) {
    console.log(`  Catalog baseline: ${headline.skills} skills, ${headline.prompts} prompts`);
  } else {
    console.log('  Catalog manifest missing (run npm run catalog:generate)');
  }

  console.log('\nDone.');
}

module.exports = { setup };
