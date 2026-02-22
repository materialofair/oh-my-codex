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

  const skillsRoot = fs.existsSync(path.join(root, '.agent', 'skills'))
    ? path.join(root, '.agent', 'skills')
    : path.join(root, '.codex', 'skills');
  checks.push({
    name: 'Skills source',
    pass: fs.existsSync(skillsRoot),
    msg: skillsRoot,
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

  const teamStatePath = path.join(process.cwd(), '.omx', 'state', 'team-state.json');
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
