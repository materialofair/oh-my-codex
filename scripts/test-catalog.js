#!/usr/bin/env node
/* eslint-disable no-console */

const assert = require('assert');
const { buildManifest } = require('./generate-catalog-docs');

function main() {
  const manifest = buildManifest({ catalogVersion: 'test' });
  const architectureReview = manifest.skills.find((skill) => skill.name === 'architecture-review');

  assert(architectureReview, 'architecture-review should be present in the catalog');
  assert.strictEqual(architectureReview.category, 'shortcut');
  assert.strictEqual(architectureReview.layer, 'quality');
  assert.strictEqual(architectureReview.intent, 'code-review');

  console.log('Catalog tests passed.');
}

main();
