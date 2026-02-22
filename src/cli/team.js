/* eslint-disable no-console */
const { createTeamState, transitionPhase } = require('../team/orchestrator');
const { readTeamState, writeTeamState, clearTeamState } = require('../team/state-store');

function usage() {
  console.log('Usage: omcodex team start "<task>" | status | advance <phase> [reason] | cancel | clear');
}

async function team(args) {
  const sub = args[0];
  const cwd = process.cwd();

  if (!sub || sub === 'help') {
    usage();
    return;
  }

  if (sub === 'start') {
    const task = args.slice(1).join(' ').trim();
    if (!task) throw new Error('Usage: omcodex team start "<task>"');
    const state = createTeamState(task, 3);
    writeTeamState(cwd, state);
    console.log(`team started: phase=${state.phase}`);
    return;
  }

  if (sub === 'status') {
    const state = readTeamState(cwd);
    if (!state) {
      console.log('No team state found.');
      return;
    }
    console.log(`phase=${state.phase} active=${state.active}`);
    console.log(`fix_attempt=${state.current_fix_attempt}/${state.max_fix_attempts}`);
    console.log(`task=${state.task_description}`);
    return;
  }

  if (sub === 'advance') {
    const nextPhase = args[1];
    const reason = args.slice(2).join(' ').trim() || undefined;
    if (!nextPhase) throw new Error('Usage: omcodex team advance <phase> [reason]');

    const state = readTeamState(cwd);
    if (!state) throw new Error('No team state found. Start first with `omcodex team start`');
    const next = transitionPhase(state, nextPhase, reason);
    writeTeamState(cwd, next);
    console.log(`phase advanced: ${state.phase} -> ${next.phase}`);
    return;
  }

  if (sub === 'cancel') {
    const state = readTeamState(cwd);
    if (!state) {
      console.log('No team state found.');
      return;
    }
    const next = {
      ...state,
      active: false,
      phase: 'cancelled',
      phase_transitions: [
        ...state.phase_transitions,
        {
          from: state.phase,
          to: 'cancelled',
          at: new Date().toISOString(),
          reason: 'manual_cancel',
        },
      ],
    };
    writeTeamState(cwd, next);
    console.log('team cancelled');
    return;
  }

  if (sub === 'clear') {
    clearTeamState(cwd);
    console.log('team state cleared');
    return;
  }

  usage();
}

module.exports = { team };
