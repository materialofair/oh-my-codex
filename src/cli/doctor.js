/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { tryReadCatalogManifest } = require('../catalog/reader');

function checkCodexCli() {
  const result = spawnSync('codex', ['--version'], { encoding: 'utf8' });
  return !result.error && result.status === 0;
}

async function doctor() {
  const root = path.resolve(__dirname, '..', '..');
  const checks = [];
  const codexCliInstalled = checkCodexCli();

  checks.push({ name: 'Codex CLI', pass: codexCliInstalled, msg: codexCliInstalled ? 'installed' : 'not found' });

  const localSkillsRoot = path.join(root, '.agent', 'skills', 'local');
  const upstreamSkillsRoot = path.join(root, '.agent', 'skills', 'upstream');
  const skillsRoot = fs.existsSync(localSkillsRoot)
    ? localSkillsRoot
    : fs.existsSync(path.join(root, '.agent', 'skills'))
      ? path.join(root, '.agent', 'skills')
      : path.join(root, '.codex', 'skills');
  checks.push({
    name: 'Skills source (local)',
    pass: fs.existsSync(skillsRoot),
    msg: skillsRoot,
  });
  checks.push({
    name: 'Skills source (upstream)',
    pass: fs.existsSync(upstreamSkillsRoot),
    msg: fs.existsSync(upstreamSkillsRoot)
      ? fs.readdirSync(upstreamSkillsRoot).join(', ')
      : 'not found (run npm run source:skills:sync)',
  });

  const promptsRoot = path.join(root, 'prompts');
  checks.push({
    name: 'Prompts source',
    pass: fs.existsSync(promptsRoot),
    msg: fs.existsSync(promptsRoot) ? promptsRoot : 'missing (optional)',
  });

  const manifest = tryReadCatalogManifest(root);
  checks.push({
    name: 'Catalog manifest',
    pass: !!manifest,
    msg: manifest ? `ok (${manifest.skills.length} skills)` : 'missing or invalid',
  });

  const teamStatePath = path.join(process.cwd(), '.omcodex', 'state', 'team-state.json');
  checks.push({
    name: 'Team state file',
    pass: true,
    msg: fs.existsSync(teamStatePath) ? teamStatePath : 'not initialized yet',
  });

  let passCount = 0;
  for (const check of checks) {
    const icon = check.pass ? '[OK]' : '[XX]';
    if (check.pass) passCount += 1;
    console.log(`${icon} ${check.name}: ${check.msg}`);
  }

  console.log(`\nResult: ${passCount}/${checks.length} checks passed.`);
  if (passCount !== checks.length) {
    process.exitCode = 1;
  }
}

module.exports = { doctor };
