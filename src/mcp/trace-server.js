#!/usr/bin/env node
const { Server } = require('@modelcontextprotocol/sdk/server');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');
const { ListToolsRequestSchema, CallToolRequestSchema } = require('@modelcontextprotocol/sdk/types');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

function text(data) {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

async function readJsonl(logDir, last) {
  if (!fs.existsSync(logDir)) return [];
  const files = (await fsp.readdir(logDir)).filter((file) => file.endsWith('.jsonl')).sort();
  const entries = [];

  for (const file of files) {
    const raw = await fsp.readFile(path.join(logDir, file), 'utf8');
    for (const line of raw.split('\n')) {
      if (!line.trim()) continue;
      try {
        entries.push(JSON.parse(line));
      } catch {}
    }
  }

  if (typeof last === 'number' && last > 0) return entries.slice(-last);
  return entries;
}

const server = new Server({ name: 'omcodex-trace', version: '0.1.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'trace_timeline',
      description: 'Read recent trace entries',
      inputSchema: { type: 'object', properties: { last: { type: 'number' }, workingDirectory: { type: 'string' } } },
    },
    {
      name: 'trace_summary',
      description: 'Get trace summary counters',
      inputSchema: { type: 'object', properties: { workingDirectory: { type: 'string' } } },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = args || {};
  const wd = typeof a.workingDirectory === 'string' ? a.workingDirectory : process.cwd();
  const logsDir = path.join(wd, '.omcodex', 'logs');

  if (name === 'trace_timeline') {
    const entries = await readJsonl(logsDir, a.last);
    return text({ count: entries.length, entries });
  }

  if (name === 'trace_summary') {
    const entries = await readJsonl(logsDir);
    const byType = {};
    for (const item of entries) {
      const type = item.type || 'unknown';
      byType[type] = (byType[type] || 0) + 1;
    }
    return text({ total: entries.length, byType });
  }

  return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
