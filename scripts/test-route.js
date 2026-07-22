#!/usr/bin/env node
/* eslint-disable no-console */

const assert = require('assert');
const path = require('path');

const { parseLimit, parseTask } = require('../src/cli/route');
const { routeTaskToSkills } = require('../src/router/skill-router');

function main() {
  const args = ['polish this frontend dashboard UI', '--limit', '5', '--json'];
  assert.strictEqual(parseLimit(args), 5);
  assert.strictEqual(parseTask(args), 'polish this frontend dashboard UI');

  const result = routeTaskToSkills('polish this frontend dashboard UI', {
    root: path.resolve(__dirname, '..'),
    limit: 5,
  });

  assert.strictEqual(result.recommendations[0].skill, 'impeccable');

  const architectureDesign = routeTaskToSkills('architecture review for this service boundary design', {
    root: path.resolve(__dirname, '..'),
    limit: 5,
  });
  assert.strictEqual(architectureDesign.recommendations[0].skill, 'architecture-review');

  const architectureHealth = routeTaskToSkills('对整个项目做一次架构健康审查', {
    root: path.resolve(__dirname, '..'),
    limit: 5,
  });
  assert.strictEqual(architectureHealth.recommendations[0].skill, 'architecture-review');

  const architectureCases = [
    '检查这个功能的分层是否合理',
    '对支付模块进行解耦分析',
    '审查这个模块的扩展性',
    'review module boundaries and change amplification',
  ];
  for (const query of architectureCases) {
    const routed = routeTaskToSkills(query, {
      root: path.resolve(__dirname, '..'),
      limit: 5,
    });
    assert.strictEqual(routed.recommendations[0].skill, 'architecture-review', query);
  }

  const newArchitecture = routeTaskToSkills('design a new system architecture from scratch', {
    root: path.resolve(__dirname, '..'),
    limit: 5,
  });
  assert.strictEqual(newArchitecture.recommendations[0].skill, 'architect-planner');

  const ordinaryCodeReview = routeTaskToSkills('review this code for correctness and bugs', {
    root: path.resolve(__dirname, '..'),
    limit: 5,
  });
  assert.strictEqual(ordinaryCodeReview.recommendations[0].skill, 'code-review');

  console.log('Route tests passed.');
}

main();
