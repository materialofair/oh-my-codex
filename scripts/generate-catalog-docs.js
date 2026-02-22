#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { validateCatalogManifest, summarizeCatalogCounts } = require('../src/catalog/schema');

const root = path.resolve(__dirname, '..');
const skillsRoot = fs.existsSync(path.join(root, '.agent', 'skills'))
  ? path.join(root, '.agent', 'skills')
  : path.join(root, '.codex', 'skills');
const promptsRoot = path.join(root, 'prompts');

const CATEGORY_MAP = new Map([
  ['autopilot', 'execution'],
  ['ralph', 'execution'],
  ['team', 'execution'],
  ['ultrawork', 'execution'],
  ['ultraqa', 'execution'],
  ['swarm', 'execution'],
  ['ralplan', 'planning'],
  ['plan', 'planning'],
  ['code-review', 'shortcut'],
  ['security-review', 'shortcut'],
  ['tdd', 'shortcut'],
  ['build-fix', 'shortcut'],
]);

const CORE = new Set(['autopilot', 'ralph', 'ultrawork', 'swarm', 'plan']);

function detectSkills() {
  if (!fs.existsSync(skillsRoot)) return [];
  return fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function detectPrompts() {
  if (!fs.existsSync(promptsRoot)) return [];
  return fs.readdirSync(promptsRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name.replace(/\.md$/i, ''))
    .sort();
}

function buildManifest() {
  const skillNames = detectSkills();
  const promptNames = detectPrompts();

  const skills = skillNames.map((name) => ({
    name,
    category: CATEGORY_MAP.get(name) || 'utility',
    status: 'active',
    core: CORE.has(name),
  }));

  const agents = promptNames.map((name) => ({
    name,
    category: 'role',
    status: 'active',
    core: ['architect', 'planner', 'executor'].includes(name),
  }));

  return {
    schemaVersion: 1,
    catalogVersion: new Date().toISOString().slice(0, 10),
    skills,
    agents,
  };
}

function main() {
  const manifest = validateCatalogManifest(buildManifest());
  const counts = summarizeCatalogCounts(manifest);

  const templatePath = path.join(root, 'templates', 'catalog-manifest.json');
  const sourcePath = path.join(root, 'src', 'catalog', 'manifest.json');
  const generatedPath = path.join(root, 'src', 'catalog', 'generated', 'public-catalog.json');

  fs.mkdirSync(path.dirname(templatePath), { recursive: true });
  fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
  fs.mkdirSync(path.dirname(generatedPath), { recursive: true });

  fs.writeFileSync(templatePath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  fs.writeFileSync(sourcePath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  fs.writeFileSync(
    generatedPath,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), counts, skills: manifest.skills, agents: manifest.agents }, null, 2)}\n`,
    'utf8',
  );

  console.log(`Catalog generated: ${counts.skillCount} skills, ${counts.promptCount} prompts`);
}

main();
