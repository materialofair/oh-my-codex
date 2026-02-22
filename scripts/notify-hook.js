#!/usr/bin/env node
/* eslint-disable no-console */

function main() {
  if (!process.argv[2]) return;
  try {
    const payload = JSON.parse(process.argv[2]);
    if (payload && payload.type === 'agent-turn-complete') {
      return;
    }
  } catch {
    // Ignore malformed payloads to keep notify hooks non-blocking.
  }
}

main();
