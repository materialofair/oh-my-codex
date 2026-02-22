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

function memoryPath(cwd) {
  return path.join(cwd, '.omx', 'project-memory.json');
}

function notepadPath(cwd) {
  return path.join(cwd, '.omx', 'notepad.md');
}

const server = new Server({ name: 'omx-memory', version: '0.1.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'project_memory_read',
      description: 'Read project memory',
      inputSchema: { type: 'object', properties: { workingDirectory: { type: 'string' } } },
    },
    {
      name: 'project_memory_write',
      description: 'Write project memory',
      inputSchema: {
        type: 'object',
        properties: { memory: { type: 'object' }, workingDirectory: { type: 'string' } },
        required: ['memory'],
      },
    },
    {
      name: 'notepad_read',
      description: 'Read notepad',
      inputSchema: { type: 'object', properties: { workingDirectory: { type: 'string' } } },
    },
    {
      name: 'notepad_write',
      description: 'Append notepad entry',
      inputSchema: {
        type: 'object',
        properties: { content: { type: 'string' }, workingDirectory: { type: 'string' } },
        required: ['content'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = args || {};
  const wd = typeof a.workingDirectory === 'string' ? a.workingDirectory : process.cwd();

  if (name === 'project_memory_read') {
    const file = memoryPath(wd);
    if (!fs.existsSync(file)) return text({ exists: false });
    const content = JSON.parse(await fsp.readFile(file, 'utf8'));
    return text({ exists: true, memory: content });
  }

  if (name === 'project_memory_write') {
    const file = memoryPath(wd);
    await fsp.mkdir(path.dirname(file), { recursive: true });
    await fsp.writeFile(file, `${JSON.stringify(a.memory, null, 2)}\n`, 'utf8');
    return text({ success: true });
  }

  if (name === 'notepad_read') {
    const file = notepadPath(wd);
    if (!fs.existsSync(file)) return text({ exists: false, content: '' });
    const content = await fsp.readFile(file, 'utf8');
    return text({ exists: true, content });
  }

  if (name === 'notepad_write') {
    const file = notepadPath(wd);
    await fsp.mkdir(path.dirname(file), { recursive: true });
    const entry = `\n[${new Date().toISOString()}] ${String(a.content)}\n`;
    await fsp.appendFile(file, entry, 'utf8');
    return text({ success: true });
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
