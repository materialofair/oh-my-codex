const os = require('os');
const path = require('path');

function codexHome(scope, cwd) {
  if (scope === 'user') return path.join(os.homedir(), '.codex');
  return path.join(cwd, '.codex');
}

function codexConfigPath(scope, cwd) {
  return path.join(codexHome(scope, cwd), 'config.toml');
}

function codexPromptsPath(scope, cwd) {
  return path.join(codexHome(scope, cwd), 'prompts');
}

function skillsSource(root) {
  const localSkills = path.join(root, '.agent', 'skills', 'local');
  const upstreamDir = path.join(root, '.agent', 'skills', 'upstream');
  const codexSkills = path.join(root, '.codex', 'skills');
  // Legacy alias for backward compatibility
  const agentSkills = localSkills;
  return { localSkills, upstreamDir, agentSkills, codexSkills };
}

function promptsSource(root) {
  return path.join(root, 'prompts');
}

module.exports = {
  codexHome,
  codexConfigPath,
  codexPromptsPath,
  skillsSource,
  promptsSource,
};
