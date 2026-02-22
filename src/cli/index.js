/* eslint-disable no-console */
const { setup } = require('./setup');
const { doctor } = require('./doctor');
const { team } = require('./team');
const { notify } = require('./notify');

const HELP = `oh-my-codex CLI (omx)

Usage:
  omx setup [--scope user|project-local|project] [--force] [--dry-run] [--verbose] [--no-prompts]
  omx doctor
  omx team start \"<task>\"
  omx team status
  omx team advance <phase> [reason]
  omx team cancel
  omx team clear
  omx notify init|status|validate|test [event]
  omx help
`;

function parseScope(args) {
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--scope') {
      const next = args[i + 1];
      if (!next) throw new Error('Missing value for --scope');
      return next;
    }
    if (arg.startsWith('--scope=')) {
      return arg.slice('--scope='.length);
    }
  }
  return undefined;
}

async function main(args) {
  const command = args[0] || 'help';
  const flags = new Set(args);

  if (command === 'help' || command === '--help' || command === '-h') {
    console.log(HELP);
    return;
  }

  if (command === 'setup') {
    await setup({
      scope: parseScope(args.slice(1)),
      force: flags.has('--force'),
      dryRun: flags.has('--dry-run'),
      verbose: flags.has('--verbose'),
      enableContext7: flags.has('--enable-context7'),
      installSkills: !flags.has('--no-skills'),
      installPrompts: !flags.has('--no-prompts'),
      installRules: !flags.has('--no-rules'),
      installConfig: !flags.has('--no-config'),
    });
    return;
  }

  if (command === 'doctor') {
    await doctor();
    return;
  }

  if (command === 'team') {
    await team(args.slice(1));
    return;
  }

  if (command === 'notify') {
    await notify(args.slice(1));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

module.exports = { main };
