const REQUIRED_CORE_SKILLS = new Set(['autopilot', 'ralph', 'ultrawork', 'swarm', 'plan']);
const STATUSES = new Set(['active', 'alias', 'merged', 'deprecated', 'internal']);

function assertString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`catalog_manifest_invalid:${field}`);
  }
}

function validateCatalogManifest(input) {
  if (!input || typeof input !== 'object') throw new Error('catalog_manifest_invalid:root');
  if (!Array.isArray(input.skills)) throw new Error('catalog_manifest_invalid:skills');
  if (!Array.isArray(input.agents)) throw new Error('catalog_manifest_invalid:agents');

  const seen = new Set();
  const skills = input.skills.map((entry, index) => {
    if (!entry || typeof entry !== 'object') throw new Error(`catalog_manifest_invalid:skills[${index}]`);
    assertString(entry.name, `skills[${index}].name`);
    const status = entry.status || 'active';
    if (!STATUSES.has(status)) {
      throw new Error(`catalog_manifest_invalid:skills[${index}].status`);
    }
    if (seen.has(entry.name)) throw new Error(`catalog_manifest_invalid:duplicate_skill:${entry.name}`);
    seen.add(entry.name);

    return {
      name: entry.name,
      category: entry.category || 'utility',
      status,
      canonical: typeof entry.canonical === 'string' ? entry.canonical : undefined,
      core: entry.core === true,
    };
  });

  for (const coreSkill of REQUIRED_CORE_SKILLS) {
    const found = skills.find((skill) => skill.name === coreSkill && skill.status === 'active');
    if (!found) throw new Error(`catalog_manifest_invalid:missing_core_skill:${coreSkill}`);
  }

  return {
    schemaVersion: Number(input.schemaVersion || 1),
    catalogVersion: String(input.catalogVersion || '0.1.0'),
    skills,
    agents: input.agents,
  };
}

function summarizeCatalogCounts(manifest) {
  return {
    skillCount: manifest.skills.length,
    promptCount: manifest.agents.length,
    activeSkillCount: manifest.skills.filter((skill) => skill.status === 'active').length,
    activeAgentCount: manifest.agents.filter((agent) => agent.status === 'active').length,
  };
}

module.exports = {
  validateCatalogManifest,
  summarizeCatalogCounts,
};
