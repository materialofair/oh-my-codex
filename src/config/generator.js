const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  extractTomlSections,
  hasTomlSection,
  parseTomlSections,
  removeTomlSections,
} = require('./toml-sections');

function stripManagedBlock(content, startMarker, endMarker) {
  const lines = String(content || '').split(/\r?\n/);
  let start = lines.findIndex((line) => line.includes(startMarker));
  if (start < 0) return content;
  let end = lines.findIndex((line, index) => index >= start && line.includes(endMarker));
  if (end < 0) return content;

  const isBlockChrome = (line) => /^\s*# =+\s*$/.test(line) || /^\s*$/.test(line);
  while (start > 0 && isBlockChrome(lines[start - 1])) start -= 1;
  while (end + 1 < lines.length && isBlockChrome(lines[end + 1])) end += 1;

  const before = lines.slice(0, start).join('\n').trimEnd();
  const after = lines.slice(end + 1).join('\n').trimStart();
  return [before, after].filter(Boolean).join('\n\n');
}

function upsertFeatureFlags(config) {
  const lines = config.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\s*\[features\]\s*$/.test(line));

  if (start < 0) {
    const append = [
      '[features]',
      'multi_agent = true',
      '',
    ].join('\n');
    return `${config.trimEnd()}\n\n${append}`.trim() + '\n';
  }

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^\s*\[[^\]]+\]\s*$/.test(lines[i])) {
      end = i;
      break;
    }
  }

  const featureKeys = new Map([
    ['multi_agent', 'multi_agent = true'],
  ]);

  for (let i = end - 1; i > start; i -= 1) {
    if (/^\s*(child_agents_md|collaboration_modes)\s*=/.test(lines[i])) {
      lines.splice(i, 1);
      end -= 1;
    }
  }

  for (const [key, value] of featureKeys.entries()) {
    let found = false;
    for (let i = start + 1; i < end; i += 1) {
      if (new RegExp(`^\\s*${key}\\s*=`).test(lines[i])) {
        lines[i] = value;
        found = true;
        break;
      }
    }
    if (!found) {
      lines.splice(end, 0, value);
      end += 1;
    }
  }

  return `${lines.join('\n').trim()}\n`;
}

function buildManagedBlock(root, options = {}) {
  const stateServer = path.join(root, 'src', 'mcp', 'state-server.js').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const memoryServer = path.join(root, 'src', 'mcp', 'memory-server.js').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const traceServer = path.join(root, 'src', 'mcp', 'trace-server.js').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const skillsDir = (options.skillsDir || path.join(os.homedir(), '.codex', 'skills'))
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
  const includeContext7 = options.enableContext7 === true;
  const includeOpenaiDocs = options.includeOpenaiDocs !== false;
  const includeSkillsServer = options.includeSkillsServer !== false;

  const lines = [
    '# ============================================================',
    '# oh-my-codex managed block',
    '# ============================================================',
    ...(includeSkillsServer
      ? [
        '[mcp_servers.skills]',
        'command = "npx"',
        `args = ["universal-skills", "mcp", "--skill-dir", "${skillsDir}"]`,
        'enabled = true',
        '',
      ]
      : []),
    '[mcp_servers.omcodex_state]',
    'command = "node"',
    `args = ["${stateServer}"]`,
    'enabled = true',
    '',
    '[mcp_servers.omcodex_memory]',
    'command = "node"',
    `args = ["${memoryServer}"]`,
    'enabled = true',
    '',
    '[mcp_servers.omcodex_trace]',
    'command = "node"',
    `args = ["${traceServer}"]`,
    'enabled = true',
  ];

  if (includeOpenaiDocs) {
    lines.push('', '[mcp_servers.openaiDeveloperDocs]', 'url = "https://developers.openai.com/mcp"', 'enabled = true');
  }

  if (includeContext7 && options.includeContext7Server !== false) {
    lines.push('', '[mcp_servers.context7]', 'command = "npx"', 'args = ["-y", "@upstash/context7-mcp"]', 'enabled = true');
  }

  lines.push('', '# ============================================================', '# end oh-my-codex managed block', '# ============================================================');
  return lines.join('\n');
}

function stripLegacySkillsSection(config) {
  const section = extractTomlSections(config, ['mcp_servers.skills']);
  if (!section) return config;
  const isLegacyUniversalSkills = section.includes('universal-skills') && !section.includes('--skill-dir');
  if (!isLegacyUniversalSkills) return config;

  return removeTomlSections(config, ['mcp_servers.skills']);
}

/**
 * Inject an upstream-sourced TOML block as a separate managed region,
 * idempotently. Block is rebuilt from the upstream source's own config.toml
 * so we never silently drift. Generic over what sections it pulls — see
 * mergeUpstreamMcpBlock and mergeUpstreamAgentsBlock for callers.
 */
function mergeUpstreamSectionBlock(configFile, options = {}) {
  const {
    sourceName,
    sourceConfigPath,
    sectionNames = [],
    blockLabel,
    sourceLabel,
  } = options;

  if (!sourceName || !sourceConfigPath || sectionNames.length === 0) return false;
  if (!blockLabel) return false;
  if (!fs.existsSync(sourceConfigPath)) return false;

  const startMarker = `# ${sourceName} managed ${blockLabel} block`;
  const endMarker = `# end ${sourceName} managed ${blockLabel} block`;

  const sourceConfig = fs.readFileSync(sourceConfigPath, 'utf8');

  const existing = fs.existsSync(configFile) ? fs.readFileSync(configFile, 'utf8') : '';
  const stripped = stripManagedBlock(existing, startMarker, endMarker).trim();

  const existingSectionNames = new Set(
    parseTomlSections(stripped).sections.map((section) => section.name),
  );
  const filteredSectionNames = sectionNames.filter((name) => !existingSectionNames.has(name));
  const extracted = extractTomlSections(sourceConfig, filteredSectionNames);

  if (!extracted) {
    if (stripped !== existing.trim()) {
      fs.writeFileSync(configFile, `${stripped}\n`, 'utf8');
    }
    return false;
  }

  const provenance = sourceLabel
    || `Sourced from ${path.basename(sourceConfigPath)} — keep in sync via the source's sync script`;

  const managed = [
    '# ============================================================',
    startMarker,
    `# ${provenance}`,
    '# ============================================================',
    extracted,
    '# ============================================================',
    endMarker,
    '# ============================================================',
  ].join('\n');

  const output = stripped ? `${stripped}\n\n${managed}\n` : `${managed}\n`;
  fs.writeFileSync(configFile, output, 'utf8');
  return true;
}

function mergeUpstreamMcpBlock(configFile, options = {}) {
  const allowedServers = options.allowedServers || [];
  return mergeUpstreamSectionBlock(configFile, {
    sourceName: options.sourceName,
    sourceConfigPath: options.sourceConfigPath,
    sectionNames: allowedServers.map((name) => `mcp_servers.${name}`),
    blockLabel: 'mcp',
  });
}

/**
 * Inject the upstream's [agents] root + [agents.<name>] declarations.
 * Without these, copied .codex/agents/*.toml files are not discoverable
 * by the codex CLI. Agent name normalization (hyphen <-> underscore)
 * matches both spellings to ECC's actual section keys.
 */
function mergeUpstreamAgentsBlock(configFile, options = {}) {
  const allowedAgents = options.allowedAgents || [];
  if (allowedAgents.length === 0) return false;

  const variants = new Set();
  for (const name of allowedAgents) {
    variants.add(`agents.${name}`);
    variants.add(`agents.${name.replace(/-/g, '_')}`);
    variants.add(`agents.${name.replace(/_/g, '-')}`);
  }

  return mergeUpstreamSectionBlock(configFile, {
    sourceName: options.sourceName,
    sourceConfigPath: options.sourceConfigPath,
    sectionNames: ['agents', ...variants],
    blockLabel: 'agents',
  });
}

function mergeConfig(configFile, root, options = {}) {
  const dir = path.dirname(configFile);
  fs.mkdirSync(dir, { recursive: true });

  const startMarker = '# oh-my-codex managed block';
  const endMarker = '# end oh-my-codex managed block';
  const existing = fs.existsSync(configFile) ? fs.readFileSync(configFile, 'utf8') : '';
  let next = stripManagedBlock(existing, startMarker, endMarker).trim();
  next = stripLegacySkillsSection(next);
  next = removeTomlSections(next, [
    'mcp_servers.omcodex_state',
    'mcp_servers.omcodex_memory',
    'mcp_servers.omcodex_trace',
  ]);
  next = upsertFeatureFlags(next);

  const managed = buildManagedBlock(root, {
    ...options,
    includeSkillsServer: !hasTomlSection(next, 'mcp_servers.skills'),
    includeOpenaiDocs: !hasTomlSection(next, 'mcp_servers.openaiDeveloperDocs'),
    includeContext7Server: !hasTomlSection(next, 'mcp_servers.context7'),
  });
  const output = `${next.trim()}\n\n${managed}\n`;
  fs.writeFileSync(configFile, output, 'utf8');
}

module.exports = {
  mergeConfig,
  mergeUpstreamMcpBlock,
  mergeUpstreamAgentsBlock,
  mergeUpstreamSectionBlock,
  extractTomlSections,
};
