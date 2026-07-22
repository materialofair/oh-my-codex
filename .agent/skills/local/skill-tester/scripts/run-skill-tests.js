#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '../../../../..');
const { routeTaskToSkills } = require(path.join(root, 'src/router/skill-router'));

function getFlag(args, name) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === name && args[index + 1]) return args[index + 1];
    if (arg.startsWith(`${name}=`)) return arg.slice(name.length + 1);
  }
  return '';
}

function loadCases(casesPath) {
  if (!fs.existsSync(casesPath)) throw new Error(`skill_test_cases_not_found:${casesPath}`);
  const parsed = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
  const cases = Array.isArray(parsed) ? parsed : parsed.cases;
  if (!Array.isArray(cases) || cases.length === 0) {
    throw new Error(`skill_test_cases_empty:${casesPath}`);
  }
  return cases;
}

function containsText(haystack, needle) {
  return String(haystack).toLowerCase().includes(String(needle).toLowerCase());
}

function testRoute(caseItem) {
  const routed = routeTaskToSkills(caseItem.query, {
    root,
    limit: Number(caseItem.limit) || 5,
  });
  const names = routed.recommendations.map((item) => item.skill);
  const failures = [];

  if (caseItem.expectedTopSkill && names[0] !== caseItem.expectedTopSkill) {
    failures.push(`expected top ${caseItem.expectedTopSkill}, got ${names[0] || '(none)'}`);
  }
  const expectedAnySkills = caseItem.expectedAnySkills || [];
  if (expectedAnySkills.length > 0 && !expectedAnySkills.some((expected) => names.includes(expected))) {
    failures.push(`missing any expected skill: ${expectedAnySkills.join(', ')}`);
  }
  for (const forbidden of caseItem.forbiddenSkills || []) {
    if (names.includes(forbidden)) failures.push(`included forbidden skill ${forbidden}`);
  }
  if (caseItem.minConfidence != null && routed.confidence < Number(caseItem.minConfidence)) {
    failures.push(`confidence ${routed.confidence} below ${caseItem.minConfidence}`);
  }

  return {
    pass: failures.length === 0,
    failures,
    actual: {
      confidence: routed.confidence,
      skills: names,
    },
  };
}

function testContent(caseItem, skillPath) {
  const files = caseItem.files || ['SKILL.md'];
  const parts = [];
  const failures = [];

  for (const relative of files) {
    const resolved = path.resolve(skillPath, relative);
    const relativeToSkill = path.relative(skillPath, resolved);
    if (relativeToSkill.startsWith('..') || path.isAbsolute(relativeToSkill)) {
      failures.push(`file escapes skill path: ${relative}`);
      continue;
    }
    if (!fs.existsSync(resolved)) {
      failures.push(`missing file: ${relative}`);
      continue;
    }
    parts.push(fs.readFileSync(resolved, 'utf8'));
  }

  const content = parts.join('\n');
  for (const required of caseItem.mustContain || []) {
    if (!containsText(content, required)) failures.push(`missing content: ${required}`);
  }
  for (const forbidden of caseItem.mustNotContain || []) {
    if (containsText(content, forbidden)) failures.push(`forbidden content: ${forbidden}`);
  }

  return {
    pass: failures.length === 0,
    failures,
    actual: { files },
  };
}

function runBehavior(caseItem, options) {
  const instruction = [
    `Use the skill at ${options.skillPath}.`,
    'Perform a read-only test. Do not modify files or external state.',
    caseItem.prompt,
  ].join('\n\n');

  let result;
  if (options.runnerCmd) {
    result = spawnSync(options.runnerCmd, {
      cwd: root,
      encoding: 'utf8',
      input: instruction,
      shell: true,
      timeout: options.timeoutMs,
      maxBuffer: 10 * 1024 * 1024,
    });
  } else if (options.runner === 'codex') {
    const args = ['exec', '--ephemeral', '--sandbox', 'read-only', '--cd', root];
    if (options.llmModel) args.push('--model', options.llmModel);
    args.push(instruction);
    result = spawnSync('codex', args, {
      cwd: root,
      encoding: 'utf8',
      timeout: options.timeoutMs,
      maxBuffer: 10 * 1024 * 1024,
    });
  } else {
    return { skipped: true, reason: 'runner not configured' };
  }

  const output = `${result.stdout || ''}${result.stderr || ''}`;
  const failures = [];
  if (result.error || result.status !== 0) {
    failures.push(result.error ? result.error.message : `runner exited ${result.status}`);
  }
  for (const required of caseItem.expectedContains || []) {
    if (!containsText(output, required)) failures.push(`output missing: ${required}`);
  }
  for (const forbidden of caseItem.expectedNotContains || []) {
    if (containsText(output, forbidden)) failures.push(`output contained forbidden text: ${forbidden}`);
  }

  return {
    pass: failures.length === 0,
    failures,
    actual: { output: output.slice(0, 4000) },
  };
}

function main() {
  const args = process.argv.slice(2);
  const rawSkillPath = getFlag(args, '--skill-path');
  if (!rawSkillPath) throw new Error('Usage: run-skill-tests.js --skill-path <dir> [--cases <file>]');

  const skillPath = path.resolve(root, rawSkillPath);
  if (!fs.existsSync(path.join(skillPath, 'SKILL.md'))) {
    throw new Error(`skill_not_found:${skillPath}`);
  }

  const casesPath = path.resolve(root, getFlag(args, '--cases') || path.join(skillPath, 'evals/evals.json'));
  const mode = getFlag(args, '--mode') || 'auto';
  if (!['auto', 'static', 'runner'].includes(mode)) throw new Error(`invalid_test_mode:${mode}`);

  const options = {
    skillPath,
    runner: getFlag(args, '--runner'),
    runnerCmd: getFlag(args, '--runner-cmd'),
    llmModel: getFlag(args, '--llm-model'),
    timeoutMs: Number(getFlag(args, '--timeout-ms')) || 45000,
  };
  const cases = loadCases(casesPath);
  const startedAt = Date.now();
  const results = [];

  for (const caseItem of cases) {
    let outcome;
    if (caseItem.type === 'route') {
      outcome = testRoute(caseItem);
    } else if (caseItem.type === 'content') {
      outcome = testContent(caseItem, skillPath);
    } else if (caseItem.type === 'behavior') {
      if (mode === 'static') {
        outcome = { skipped: true, reason: 'static mode' };
      } else {
        outcome = runBehavior(caseItem, options);
        if (mode === 'runner' && outcome.skipped) {
          outcome = { pass: false, failures: ['runner mode requires --runner or --runner-cmd'] };
        }
      }
    } else {
      outcome = { pass: false, failures: [`unknown case type: ${caseItem.type}`] };
    }

    results.push({ id: caseItem.id, type: caseItem.type, ...outcome });
  }

  const passed = results.filter((item) => item.pass === true).length;
  const failed = results.filter((item) => item.pass === false).length;
  const skipped = results.filter((item) => item.skipped === true).length;
  const summary = {
    skill: path.basename(skillPath),
    mode,
    casesPath,
    pass: failed === 0,
    total: results.length,
    passed,
    failed,
    skipped,
    durationMs: Date.now() - startedAt,
    results,
  };

  console.log(JSON.stringify(summary, null, 2));
  if (!summary.pass) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
