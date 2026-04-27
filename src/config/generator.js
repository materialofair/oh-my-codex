/* eslint-disable no-useless-escape */
const fs = require('fs');
const os = require('os');
const path = require('path');

function stripManagedBlock(content, startMarker, endMarker) {
  const start = content.indexOf(startMarker);
  if (start < 0) return content;
  const end = content.indexOf(endMarker, start);
  if (end < 0) return content;
  const tailIndex = end + endMarker.length;
  const before = content.slice(0, start).trimEnd();
  const after = content.slice(tailIndex).trimStart();
  return [before, after].filter(Boolean).join('\n\n');
}

function upsertFeatureFlags(config) {
  const lines = config.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\s*\[features\]\s*$/.test(line));

  if (start < 0) {
    const append = [
      '[features]',
      'multi_agent = true',
      'child_agents_md = true',
      'collaboration_modes = true',
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
    ['child_agents_md', 'child_agents_md = true'],
    ['collaboration_modes', 'collaboration_modes = true'],
  ]);

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

function hasSection(config, sectionName) {
  const escaped = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^\\s*\\[${escaped}\\]\\s*$`, 'm');
  return pattern.test(config);
}

function stripLegacySkillsSection(config) {
  const lines = config.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\s*\[mcp_servers\.skills\]\s*$/.test(line));
  if (start < 0) return config;

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^\s*\[[^\]]+\]\s*$/.test(lines[i])) {
      end = i;
      break;
    }
  }

  const section = lines.slice(start, end).join('\n');
  const isLegacyUniversalSkills = section.includes('universal-skills') && !section.includes('--skill-dir');
  if (!isLegacyUniversalSkills) return config;

  lines.splice(start, end - start);
  return lines.join('\n').trim();
}

function stripSections(config, sectionNames = []) {
  if (!config || sectionNames.length === 0) return config;

  const escapedNames = sectionNames.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const sectionPatterns = escapedNames.map((escaped) => new RegExp(`^\\s*\\[${escaped}\\]\\s*$`));
  const isSectionHeader = (line) => /^\s*\[[^\]]+\]\s*$/.test(line);

  const lines = config.split(/\r?\n/);
  const nextLines = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const shouldStripSection = sectionPatterns.some((pattern) => pattern.test(line));
    if (!shouldStripSection) {
      nextLines.push(line);
      continue;
    }

    // Skip current section until next TOML section header.
    while (i + 1 < lines.length && !isSectionHeader(lines[i + 1])) {
      i += 1;
    }
  }

  return nextLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Slice out one or more TOML sections by exact name from a source config
 * string. Sections are returned in source order joined by blank lines,
 * including their header line and all lines up to (but not including) the
 * next section header or end-of-file. Limitations:
 *  - Only `[name]` and `[name.subname]` headers — array-of-tables `[[name]]`
 *    are intentionally skipped (and treated as a delimiter).
 *  - Trailing whitespace and `#` line comments after a header are tolerated.
 *  - Sections not present in the source are silently skipped.
 */
function extractTomlSections(sourceConfig, sectionNames = []) {
  if (!sourceConfig || sectionNames.length === 0) return '';

  const lines = sourceConfig.split(/\r?\n/);
  const isSectionHeader = (line) => /^\s*\[[^[\]]+\]\s*(#.*)?$/.test(line);
  const isArrayHeader = (line) => /^\s*\[\[[^\]]+\]\]/.test(line);
  const matchSection = (line) => {
    const m = line.match(/^\s*\[([^[\]]+)\]\s*(#.*)?$/);
    if (!m) return null;
    return sectionNames.find((name) => m[1].trim() === name) || null;
  };

  const blocks = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (!matchSection(lines[i])) continue;
    const start = i;
    let end = lines.length;
    for (let j = i + 1; j < lines.length; j += 1) {
      if (isSectionHeader(lines[j]) || isArrayHeader(lines[j])) {
        end = j;
        break;
      }
    }
    blocks.push(lines.slice(start, end).join('\n').trimEnd());
    i = end - 1;
  }

  return blocks.join('\n\n');
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
  const extracted = extractTomlSections(sourceConfig, sectionNames);

  const existing = fs.existsSync(configFile) ? fs.readFileSync(configFile, 'utf8') : '';
  const stripped = stripManagedBlock(existing, startMarker, endMarker).trim();

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
  next = stripSections(next, [
    'mcp_servers.omcodex_state',
    'mcp_servers.omcodex_memory',
    'mcp_servers.omcodex_trace',
  ]);
  next = upsertFeatureFlags(next);

  const managed = buildManagedBlock(root, {
    ...options,
    includeSkillsServer: !hasSection(next, 'mcp_servers.skills'),
    includeOpenaiDocs: !hasSection(next, 'mcp_servers.openaiDeveloperDocs'),
    includeContext7Server: !hasSection(next, 'mcp_servers.context7'),
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
