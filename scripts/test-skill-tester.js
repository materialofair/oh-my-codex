#!/usr/bin/env node
/* eslint-disable no-console */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

function run(args) {
  return spawnSync(process.execPath, args, {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8',
    timeout: 30000,
  });
}

function main() {
  const root = path.resolve(__dirname, '..');
  const runnerPath = path.join(root, '.agent/skills/local/skill-tester/scripts/run-skill-tests.js');
  const skillPath = path.join(root, '.agent/skills/local/architecture-review');

  assert(fs.existsSync(runnerPath), 'skill test runner should exist');

  const staticResult = run([
    runnerPath,
    '--skill-path', skillPath,
    '--mode', 'static',
  ]);
  assert.strictEqual(staticResult.status, 0, staticResult.stderr || staticResult.stdout);
  const staticSummary = JSON.parse(staticResult.stdout);
  assert.strictEqual(staticSummary.pass, true);
  assert(staticSummary.passed >= 1, 'static suite should execute cases');
  assert(staticSummary.skipped >= 1, 'static suite should report runner-only cases as skipped');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'omcodex-skill-tester-'));
  const fakeRunnerPath = path.join(tempDir, 'fake-runner.js');
  const casesPath = path.join(tempDir, 'cases.json');
  fs.writeFileSync(fakeRunnerPath, [
    '#!/usr/bin/env node',
    "process.stdin.resume();",
    "process.stdin.on('end', () => console.log('Mode: design\\nStatus: CLEAR\\nScenario Checks'));",
  ].join('\n'));
  fs.chmodSync(fakeRunnerPath, 0o755);
  fs.writeFileSync(casesPath, JSON.stringify({
    schemaVersion: 1,
    cases: [{
      id: 'runner-contract',
      type: 'behavior',
      prompt: 'Review this architecture proposal.',
      expectedContains: ['Mode: design', 'Status: CLEAR', 'Scenario Checks'],
    }],
  }));

  const behaviorResult = run([
    runnerPath,
    '--skill-path', skillPath,
    '--cases', casesPath,
    '--mode', 'runner',
    '--runner-cmd', `${process.execPath} ${fakeRunnerPath}`,
  ]);
  assert.strictEqual(behaviorResult.status, 0, behaviorResult.stderr || behaviorResult.stdout);
  const behaviorSummary = JSON.parse(behaviorResult.stdout);
  assert.strictEqual(behaviorSummary.pass, true);
  assert.strictEqual(behaviorSummary.passed, 1);
  assert.strictEqual(behaviorSummary.skipped, 0);

  console.log('Skill tester tests passed.');
}

main();
