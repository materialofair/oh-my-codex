/* eslint-disable no-useless-escape */
const fs = require('fs');
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
  const includeContext7 = options.enableContext7 === true;
  const includeOpenaiDocs = options.includeOpenaiDocs !== false;

  const lines = [
    '# ============================================================',
    '# oh-my-codex managed block',
    '# ============================================================',
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

function mergeConfig(configFile, root, options = {}) {
  const dir = path.dirname(configFile);
  fs.mkdirSync(dir, { recursive: true });

  const startMarker = '# oh-my-codex managed block';
  const endMarker = '# end oh-my-codex managed block';
  const existing = fs.existsSync(configFile) ? fs.readFileSync(configFile, 'utf8') : '';
  let next = stripManagedBlock(existing, startMarker, endMarker).trim();
  next = upsertFeatureFlags(next);

  const managed = buildManagedBlock(root, {
    ...options,
    includeOpenaiDocs: !hasSection(next, 'mcp_servers.openaiDeveloperDocs'),
    includeContext7Server: !hasSection(next, 'mcp_servers.context7'),
  });
  const output = `${next.trim()}\n\n${managed}\n`;
  fs.writeFileSync(configFile, output, 'utf8');
}

module.exports = { mergeConfig };
