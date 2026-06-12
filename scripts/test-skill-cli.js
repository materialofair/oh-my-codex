#!/usr/bin/env node
/* eslint-disable no-console */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { resolveSkillPath } = require('../src/cli/skill');

function writeSkill(root, name) {
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: ${name}\ndescription: Test skill\n---\n`, 'utf8');
  return dir;
}

function main() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'omcodex-skill-cli-'));
  const cwd = path.join(tmpRoot, 'project');
  const home = path.join(tmpRoot, 'home');
  const codexHome = path.join(tmpRoot, 'custom-codex');

  const projectSkill = writeSkill(path.join(cwd, '.codex', 'skills'), 'project-only');
  const codexHomeSkill = writeSkill(path.join(codexHome, 'skills'), 'impeccable');
  const homeSkill = writeSkill(path.join(home, '.codex', 'skills'), 'fallback-skill');

  assert.strictEqual(resolveSkillPath('project-only', {
    cwd,
    home,
    env: { CODEX_HOME: codexHome },
  }), projectSkill);

  assert.strictEqual(resolveSkillPath('impeccable', {
    cwd,
    home,
    env: { CODEX_HOME: codexHome },
  }), codexHomeSkill);

  assert.strictEqual(resolveSkillPath('fallback-skill', {
    cwd,
    home,
    env: {},
  }), homeSkill);

  assert.strictEqual(resolveSkillPath('missing', {
    cwd,
    home,
    env: { CODEX_HOME: codexHome },
  }), null);

  console.log('Skill CLI tests passed.');
}

main();
