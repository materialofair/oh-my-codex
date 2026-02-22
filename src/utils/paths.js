const os = require('os');
const path = require('path');

function codexHome(scope, cwd) {
  if (scope === 'user') return path.join(os.homedir(), '.codex');
  return path.join(cwd, '.codex');
}

function codexConfigPath(scope, cwd) {
  return path.join(codexHome(scope, cwd), 'config.toml');
}

function skillsSource(root) {
  const agentSkills = path.join(root, '.agent', 'skills');
  const codexSkills = path.join(root, '.codex', 'skills');
  return { agentSkills, codexSkills };
}

module.exports = {
  codexHome,
  codexConfigPath,
  skillsSource,
};
