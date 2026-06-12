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

  console.log('Route tests passed.');
}

main();
