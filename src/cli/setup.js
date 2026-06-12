/* eslint-disable no-console */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const os = require('os');
const {
  codexHome,
  codexConfigPath,
  codexPromptsPath,
  skillsSource,
  promptsSource,
} = require('../utils/paths');
const {
  mergeConfig,
  mergeUpstreamMcpBlock,
  mergeUpstreamAgentsBlock,
} = require('../config/generator');
const { getCatalogHeadlineCounts } = require('../catalog/reader');
const {
  loadSkillsFromSource,
  detectConflicts,
  resolveConflicts,
  applyResolutions,
  generateReport,
} = require('../merge/skill-merger');

const SETUP_SCOPES = new Set(['user', 'project-local', 'project']);

function readPersistedScope(cwd) {
  const scopeFile = path.join(cwd, '.omcodex', 'setup-scope.json');
  if (!fs.existsSync(scopeFile)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(scopeFile, 'utf8'));
    if (SETUP_SCOPES.has(parsed.scope)) return parsed.scope;
  } catch {}
  return null;
}

async function persistScope(cwd, scope, dryRun) {
  const scopeFile = path.join(cwd, '.omcodex', 'setup-scope.json');
  if (dryRun) return;
  await fsp.mkdir(path.dirname(scopeFile), { recursive: true });
  await fsp.writeFile(scopeFile, `${JSON.stringify({ scope }, null, 2)}\n`, 'utf8');
}

async function copyDirectory(src, dest, options) {
  if (!fs.existsSync(src)) return 0;
  if (!options.dryRun) {
    await fsp.mkdir(dest, { recursive: true });
  }
  const entries = await fsp.readdir(src, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += await copyDirectory(from, to, options);
      continue;
    }

    if (!entry.isFile()) continue;

    if (!options.force && fs.existsSync(to)) continue;
    if (!options.dryRun) {
      await fsp.mkdir(path.dirname(to), { recursive: true });
      await fsp.copyFile(from, to);
    }
    count += 1;
  }

  return count;
}

async function copyFile(src, dest, options) {
  if (!fs.existsSync(src)) return false;
  if (!options.force && fs.existsSync(dest)) return false;
  if (!options.dryRun) {
    await fsp.mkdir(path.dirname(dest), { recursive: true });
    await fsp.copyFile(src, dest);
  }
  return true;
}

function evaluateSkillQuality(skill) {
  const skillDoc = path.join(skill.path, 'SKILL.md');
  if (!fs.existsSync(skillDoc)) {
    return { score: 0, signals: ['missing_skill_doc'] };
  }

  const content = fs.readFileSync(skillDoc, 'utf8');
  const signals = [];
  let score = 100;

  if (!/^---\n[\s\S]*?\n---\n?/m.test(content)) {
    score -= 30;
    signals.push('missing_frontmatter');
  }
  if (!/name:\s*[^\n]+/.test(content)) {
    score -= 15;
    signals.push('missing_name');
  }
  if (!/description:\s*[^\n]+/.test(content)) {
    score -= 15;
    signals.push('missing_description');
  }
  if (/(?:`|^\s*)\/[a-z][a-z-]*(?=(?:\s|`|:|$))/m.test(content)) {
    score -= 30;
    signals.push('legacy_slash_command');
  }
  if (/\bTask\s*\(|\bdelegate\s*\(/.test(content)) {
    score -= 20;
    signals.push('legacy_delegate_or_task_api');
  }
  if (/cc\s+--plugin-dir|\/plugin|HUD|omx_state/.test(content)) {
    score -= 20;
    signals.push('non_codex_runtime_reference');
  }
  if (!/\$[\w-]+|[a-z-]+:\s+[^\n]+/i.test(content)) {
    score -= 8;
    signals.push('missing_codex_invocation');
  }
  if (!/usage|when to use|instructions|workflow|步骤|用法/i.test(content)) {
    score -= 8;
    signals.push('missing_structure');
  }

  score = Math.max(0, Math.min(100, score));
  return { score, signals };
}

async function mergeSkillsFromSources(root, options = {}) {
  const sources = [];
  let forkSkills = [];
  let upstreamSkillsRaw = [];
  const qualityWinners = [];

  // Load local skills from .agent/skills/local/
  const localPath = path.join(root, '.agent', 'skills', 'local');
  const legacyForkPath = path.join(root, '.agent', 'skills');
  const forkPath = fs.existsSync(localPath) ? localPath : legacyForkPath;
  if (fs.existsSync(forkPath)) {
    forkSkills = loadSkillsFromSource(forkPath, 'fork');
    sources.push({
      name: 'fork',
      skills: forkSkills,
    });
  }

  // Load upstream skills from .agent/skills/upstream/<source>/
  const upstreamBaseDir = path.join(root, '.agent', 'skills', 'upstream');
  const legacyUpstreamCandidates = [
    path.join(root, '.upstream', 'skills'),
    path.join(root, '.upstream', '.agent', 'skills'),
    path.join(root, '.upstream', '.codex', 'skills'),
  ];

  if (fs.existsSync(upstreamBaseDir)) {
    // New multi-source layout: each subdirectory is an upstream source
    const upstreamSources = fs.readdirSync(upstreamBaseDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());
    for (const srcDir of upstreamSources) {
      const srcPath = path.join(upstreamBaseDir, srcDir.name);
      const srcSkills = loadSkillsFromSource(srcPath, srcDir.name);
      if (srcSkills.length > 0) {
        upstreamSkillsRaw.push(...srcSkills);
        sources.push({
          name: srcDir.name,
          skills: srcSkills,
        });
      }
    }
  } else {
    // Legacy: single .upstream/ directory
    const upstreamPath = legacyUpstreamCandidates.find((candidate) => fs.existsSync(candidate));
    if (upstreamPath) {
      upstreamSkillsRaw = loadSkillsFromSource(upstreamPath, 'upstream');
      sources.push({
        name: 'upstream',
        skills: upstreamSkillsRaw,
      });
    }
  }

  // Load merge config
  const mergeConfigPath = path.join(root, '.codex', 'merge-config.json');
  const defaultMergeConfigPath = path.join(root, 'templates', 'merge-config.json');
  let mergeConfig = { allow_namespacing: false, preferences: {} };

  const effectiveMergeConfigPath = fs.existsSync(mergeConfigPath)
    ? mergeConfigPath
    : defaultMergeConfigPath;

  if (fs.existsSync(effectiveMergeConfigPath)) {
    try {
      mergeConfig = JSON.parse(fs.readFileSync(effectiveMergeConfigPath, 'utf8'));
    } catch (err) {
      console.warn(`Warning: Failed to load merge config (${effectiveMergeConfigPath}): ${err.message}`);
    }
  }

  // Build auto quality preferences for overlap skills.
  const forkByName = new Map(forkSkills.map((item) => [item.name, item]));
  const upstreamByName = new Map(upstreamSkillsRaw.map((item) => [item.name, item]));
  const overlapNames = Array.from(forkByName.keys())
    .filter((name) => upstreamByName.has(name))
    .sort((a, b) => a.localeCompare(b));
  const autoPreferences = {};

  for (const name of overlapNames) {
    const forkQuality = evaluateSkillQuality(forkByName.get(name));
    const upstreamSkill = upstreamByName.get(name);
    const upstreamQuality = evaluateSkillQuality(upstreamSkill);
    const upstreamSourceName = upstreamSkill.source || 'upstream';
    const winner = forkQuality.score >= upstreamQuality.score ? 'fork' : upstreamSourceName;
    autoPreferences[name] = winner;
    qualityWinners.push({
      skill: name,
      winner,
      forkScore: forkQuality.score,
      upstreamScore: upstreamQuality.score,
      forkSignals: forkQuality.signals,
      upstreamSignals: upstreamQuality.signals,
    });
  }

  const mergedPreferences = {
    ...autoPreferences,
    ...(mergeConfig.preferences || {}),
  };
  const mergeConfigWithAuto = {
    ...mergeConfig,
    preferences: mergedPreferences,
  };

  // Detect conflicts
  const conflicts = detectConflicts(sources);

  // Resolve conflicts
  const resolutions = resolveConflicts(conflicts, mergeConfigWithAuto);

  // Apply resolutions
  const merged = applyResolutions(sources, resolutions);

  // Generate report
  const report = generateReport(conflicts, resolutions);

  const sourceStats = {
    forkCount: forkSkills.length,
    upstreamRawCount: upstreamSkillsRaw.length,
    overlapCount: overlapNames.length,
    qualityWinnerFork: qualityWinners.filter((row) => row.winner === 'fork').length,
    qualityWinnerUpstream: qualityWinners.filter((row) => row.winner === 'upstream').length,
    qualityWinners,
  };

  return { merged, report, conflicts, resolutions, sourceStats };
}

async function copyMergedSkills(merged, dest, options) {
  if (!options.dryRun) {
    await fsp.mkdir(dest, { recursive: true });
  }

  let count = 0;

  for (const skill of merged) {
    const skillDest = path.join(dest, skill.name);
    count += await copyDirectory(skill.path, skillDest, options);
  }

  return count;
}


/**
 * Resolve a manifest-declared path. Paths starting with "/" anchor at the
 * project root; everything else resolves relative to the upstream source
 * directory (e.g. .agent/skills/upstream/ecc/), which matches how the
 * manifest writer naturally describes its own assets.
 * Returns the absolute path (or null on falsy input).
 */
function resolveManifestPath(root, sourceDir, declared) {
  if (!declared) return null;
  if (declared.startsWith('/')) {
    return path.join(root, declared.slice(1));
  }
  return path.resolve(sourceDir, declared);
}

/**
 * Walk .agent/skills/upstream/* looking for sources that ship Codex-native
 * assets (declared in .omc-source/manifest.json). Returns one entry per
 * source describing its agents dir, config.toml, agents supplement, and
 * selection-derived allowlists. Sources without a manifest or codexAssets
 * block are skipped. A declared-but-missing selectionFile throws.
 */
function discoverUpstreamCodexAssets(root) {
  const upstreamBase = path.join(root, '.agent', 'skills', 'upstream');
  if (!fs.existsSync(upstreamBase)) return [];

  const results = [];
  const sources = fs.readdirSync(upstreamBase, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const src of sources) {
    const sourceDir = path.join(upstreamBase, src.name);
    const manifestPath = path.join(sourceDir, '.omc-source', 'manifest.json');
    if (!fs.existsSync(manifestPath)) continue;

    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (err) {
      throw new Error(`Invalid manifest at ${manifestPath}: ${err.message}`);
    }
    if (!manifest.codexAssets) continue;

    let selection = null;
    if (manifest.selectionFile) {
      const selectionPath = resolveManifestPath(root, sourceDir, manifest.selectionFile);
      if (!fs.existsSync(selectionPath)) {
        throw new Error(
          `Manifest ${manifestPath} declares selectionFile "${manifest.selectionFile}" `
          + `but the resolved path does not exist: ${selectionPath}. `
          + 'Use a project-root anchored path ("/.agent/curation/...") or a source-relative path that exists.'
        );
      }
      try {
        selection = JSON.parse(fs.readFileSync(selectionPath, 'utf8'));
      } catch (err) {
        throw new Error(`Invalid selection at ${selectionPath}: ${err.message}`);
      }
    }

    results.push({
      name: src.name,
      sourceDir,
      manifest,
      selection,
      agentsDir: resolveManifestPath(root, sourceDir, manifest.codexAssets.agentsDir),
      configToml: resolveManifestPath(root, sourceDir, manifest.codexAssets.configToml),
      agentsSupplement: resolveManifestPath(root, sourceDir, manifest.codexAssets.agentsSupplement),
    });
  }

  return results;
}

/**
 * Append upstream AGENTS.md supplements to the global AGENTS.md as an
 * idempotent managed block. Each source contributes one labeled section.
 */
async function mergeUpstreamAgentsSupplements(globalAgentsDest, assets, options) {
  const eligible = assets.filter((a) => a.agentsSupplement && fs.existsSync(a.agentsSupplement));
  if (eligible.length === 0) return 0;

  const startMarker = '<!-- omcodex upstream AGENTS supplements -->';
  const endMarker = '<!-- end omcodex upstream AGENTS supplements -->';

  const existing = fs.existsSync(globalAgentsDest)
    ? fs.readFileSync(globalAgentsDest, 'utf8')
    : '';

  const start = existing.indexOf(startMarker);
  let stripped = existing;
  if (start >= 0) {
    const end = existing.indexOf(endMarker, start);
    if (end >= 0) {
      stripped = (existing.slice(0, start) + existing.slice(end + endMarker.length)).trimEnd() + '\n';
    }
  }

  const sections = eligible.map((asset) => {
    const body = fs.readFileSync(asset.agentsSupplement, 'utf8').trim();
    return [
      `## Upstream supplement: ${asset.name}`,
      `<!-- source: ${path.basename(asset.agentsSupplement)} from .agent/skills/upstream/${asset.name}/ -->`,
      '',
      body,
    ].join('\n');
  });

  const block = [startMarker, '', ...sections, '', endMarker].join('\n');
  const next = `${stripped.trimEnd()}\n\n${block}\n`;

  if (!options.dryRun) {
    await fsp.mkdir(path.dirname(globalAgentsDest), { recursive: true });
    await fsp.writeFile(globalAgentsDest, next, 'utf8');
  }
  return eligible.length;
}

async function mergeFrontierModelAdapterSupplement(globalAgentsDest, options) {
  const startMarker = '<!-- omcodex frontier model adapter -->';
  const endMarker = '<!-- end omcodex frontier model adapter -->';
  const heading = '## Frontier Model Adapter';
  const existing = fs.existsSync(globalAgentsDest)
    ? fs.readFileSync(globalAgentsDest, 'utf8')
    : '';

  const start = existing.indexOf(startMarker);
  let stripped = existing;
  if (start >= 0) {
    const end = existing.indexOf(endMarker, start);
    if (end >= 0) {
      stripped = (existing.slice(0, start) + existing.slice(end + endMarker.length)).trimEnd() + '\n';
    }
  } else if (existing.includes(heading)) {
    return 0;
  }

  const section = [
    startMarker,
    '',
    heading,
    '',
    'Apply this lightweight adapter for frontier OpenAI Codex models such as GPT-5.4, GPT-5.5, and later successors:',
    '',
    '- Treat newer models as capable but still subject to behavior drift.',
    '- Prefer repository evidence over model memory, especially before using skills or changing files.',
    '- Ask only when blocked by a decision that cannot be inferred from user intent or local context.',
    '- Keep changes small, reversible, and scoped to the requested outcome.',
    '- Use skills as on-demand workflows, not as permanent context bloat.',
    '- Verify before claiming completion; report commands, results, changed paths, and remaining risk.',
    '- Add version-specific model guidance only after repeated eval-backed failures.',
    '',
    endMarker,
  ].join('\n');
  const next = `${stripped.trimEnd()}\n\n${section}\n`;

  if (!options.dryRun) {
    await fsp.mkdir(path.dirname(globalAgentsDest), { recursive: true });
    await fsp.writeFile(globalAgentsDest, next, 'utf8');
  }
  return 1;
}

async function installUpstreamCodexAgents(asset, agentsDest, options) {
  if (!asset.agentsDir || !fs.existsSync(asset.agentsDir)) return 0;

  const allowed = asset.selection && Array.isArray(asset.selection.agents)
    ? new Set(asset.selection.agents)
    : null;

  const entries = await fsp.readdir(asset.agentsDir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.toml')) continue;

    const baseName = entry.name.replace(/\.toml$/, '');
    // Tolerate explorer / docs-researcher / docs_researcher cross-spellings.
    const normalized = baseName.replace(/_/g, '-');
    if (allowed && !allowed.has(baseName) && !allowed.has(normalized)) continue;

    const from = path.join(asset.agentsDir, entry.name);
    const to = path.join(agentsDest, entry.name);
    if (!options.force && fs.existsSync(to)) continue;
    if (!options.dryRun) {
      await fsp.mkdir(agentsDest, { recursive: true });
      await fsp.copyFile(from, to);
    }
    count += 1;
  }

  return count;
}

async function setup(options = {}) {
  const cwd = process.cwd();
  const root = path.resolve(__dirname, '..', '..');
  const scope = options.scope || readPersistedScope(cwd) || 'user';

  if (!SETUP_SCOPES.has(scope)) {
    throw new Error(`Invalid scope: ${scope}. Expected one of user, project-local, project.`);
  }

  console.log('oh-my-codex setup');
  console.log('=================');
  console.log(`Scope: ${scope}`);

  const baseCodexHome = codexHome(scope, cwd);
  const configPath = codexConfigPath(scope, cwd);
  const rulesSource = path.join(root, 'templates', 'rules');
  const rulesDest = scope === 'user'
    ? path.join(os.homedir(), '.codex', 'rules')
    : path.join(cwd, '.codex', 'rules');
  const globalAgentsSources = [
    path.join(root, 'templates', 'AGENTS.global.md'),
    path.join(root, 'templates', 'AGENTS.md'),
  ];
  const globalAgentsSource = globalAgentsSources.find((candidate) => fs.existsSync(candidate)) || null;
  const globalAgentsDest = path.join(os.homedir(), '.codex', 'AGENTS.md');
  const promptsSrc = promptsSource(root);
  const promptsDest = codexPromptsPath(scope, cwd);

  const skillSrc = (() => {
    const src = skillsSource(root);
    if (fs.existsSync(src.localSkills)) return src.localSkills;
    if (fs.existsSync(src.agentSkills)) return src.agentSkills;
    if (fs.existsSync(src.codexSkills)) return src.codexSkills;
    throw new Error('No skills source found (.agent/skills/local or .codex/skills)');
  })();

  const skillsDest = scope === 'user'
    ? path.join(os.homedir(), '.codex', 'skills')
    : path.join(cwd, '.codex', 'skills');

  await persistScope(cwd, scope, options.dryRun);

  console.log('[1/7] Installing skills...');
  const shouldInstallSkills = options.installSkills !== false && scope !== 'project';

  let skillCount = 0;
  let mergeReport = null;

  if (shouldInstallSkills) {
    // Use multi-source merge if enabled
    if (options.mergeSkills !== false) {
      try {
        const { merged, report, sourceStats } = await mergeSkillsFromSources(root, options);
        skillCount = await copyMergedSkills(merged, skillsDest, options);
        mergeReport = report;

        const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
        console.log(`  ${label} ${skillCount} files from ${merged.length} skills -> ${skillsDest}`);
        if (sourceStats && sourceStats.overlapCount > 0) {
          console.log(`  Overlap quality winners: fork=${sourceStats.qualityWinnerFork}, upstream=${sourceStats.qualityWinnerUpstream}`);
        }

        if (report.conflicts.length > 0) {
          console.log(`  Resolved ${report.conflicts.length} conflicts`);

          // Save merge report
          if (!options.dryRun) {
            const reportPath = path.join(cwd, '.omcodex', 'merge-report.json');
            await fsp.mkdir(path.dirname(reportPath), { recursive: true });
            await fsp.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
            console.log(`  Merge report saved to: ${reportPath}`);
          }
        }
      } catch (err) {
        if (!options.allowMergeFallback) {
          throw new Error(
            `Skill merge failed: ${err.message}. `
            + 'Refusing partial install; rerun with --allow-merge-fallback to copy only the direct skill source.'
          );
        }
        console.warn(`  Warning: Merge failed (${err.message}), falling back to direct copy`);
        skillCount = await copyDirectory(skillSrc, skillsDest, options);
        const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
        console.log(`  ${label} ${skillCount} files -> ${skillsDest}`);
      }
    } else {
      // Direct copy without merge
      skillCount = await copyDirectory(skillSrc, skillsDest, options);
      const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
      console.log(`  ${label} ${skillCount} files -> ${skillsDest}`);
    }
  } else {
    console.log('  Skipped for project scope');
  }

  console.log('[2/7] Installing prompts...');
  const shouldInstallPrompts = options.installPrompts !== false && scope !== 'project';
  if (!shouldInstallPrompts) {
    console.log('  Skipped (--no-prompts or project scope)');
  } else if (!fs.existsSync(promptsSrc)) {
    console.log(`  Skipped (missing prompts source: ${promptsSrc})`);
  } else {
    const promptCount = await copyDirectory(promptsSrc, promptsDest, options);
    const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
    console.log(`  ${label} ${promptCount} files -> ${promptsDest}`);
  }

  console.log('[3/7] Installing rules...');
  if (options.installRules !== false) {
    const ruleCount = await copyDirectory(rulesSource, rulesDest, options);
    const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
    console.log(`  ${label} ${ruleCount} files -> ${rulesDest}`);
  } else {
    console.log('  Skipped (--no-rules)');
  }

  console.log('[4/7] Installing global AGENTS.md...');
  if (options.installAgents === false) {
    console.log('  Skipped (--no-agents)');
  } else if (scope !== 'user') {
    console.log('  Skipped (only applies to user scope)');
  } else if (!globalAgentsSource) {
    console.log('  Skipped (missing templates/AGENTS.global.md and templates/AGENTS.md)');
  } else {
    const installed = await copyFile(globalAgentsSource, globalAgentsDest, options);
    const label = options.dryRun ? 'Would install/update' : 'Installed/updated';
    if (installed || options.force || options.dryRun) {
      console.log(`  ${label} ${globalAgentsDest}`);
      console.log(`  Source: ${path.relative(root, globalAgentsSource)}`);
    } else {
      console.log(`  Skipped (already exists): ${globalAgentsDest}`);
    }

    // Append upstream AGENTS.md supplements (e.g. ECC's .codex/AGENTS.md) as
    // an idempotent managed block. Only meaningful at user scope where a
    // global AGENTS.md exists.
    if (fs.existsSync(globalAgentsDest) || options.dryRun) {
      const adapterAppended = await mergeFrontierModelAdapterSupplement(globalAgentsDest, options);
      if (adapterAppended > 0) {
        const verb = options.dryRun ? 'Would append' : 'Appended';
        console.log(`  ${verb} frontier model adapter -> ${globalAgentsDest}`);
      }

      const supplementAssets = discoverUpstreamCodexAssets(root);
      const appended = await mergeUpstreamAgentsSupplements(globalAgentsDest, supplementAssets, options);
      if (appended > 0) {
        const verb = options.dryRun ? 'Would append' : 'Appended';
        console.log(`  ${verb} ${appended} upstream AGENTS supplement(s) -> ${globalAgentsDest}`);
      }
    }
  }

  console.log('[5/7] Merging config.toml...');
  if (options.installConfig !== false && !options.dryRun) {
    mergeConfig(configPath, root, {
      enableContext7: options.enableContext7,
      skillsDir: skillsDest,
    });
  }
  if (options.installConfig !== false) {
    const label = options.dryRun ? 'Would update' : 'Updated';
    console.log(`  ${label} ${configPath}`);
  } else {
    console.log('  Skipped (--no-config)');
  }

  console.log('[6/7] Installing upstream Codex assets...');
  if (options.installUpstreamCodex === false) {
    console.log('  Skipped (--no-upstream-codex)');
  } else {
    const upstreamAssets = discoverUpstreamCodexAssets(root);
    if (upstreamAssets.length === 0) {
      console.log('  No upstream sources declare codexAssets');
    } else {
      const agentsDest = scope === 'user'
        ? path.join(os.homedir(), '.codex', 'agents')
        : path.join(cwd, '.codex', 'agents');

      for (const asset of upstreamAssets) {
        const agentCount = await installUpstreamCodexAgents(asset, agentsDest, options);
        const label = options.dryRun ? 'Would install' : 'Installed';
        if (agentCount > 0) {
          console.log(`  ${label} ${agentCount} agents from ${asset.name} -> ${agentsDest}`);
        }

        const allowedAgents = asset.selection && Array.isArray(asset.selection.agents)
          ? asset.selection.agents
          : [];
        const allowedServers = asset.selection && Array.isArray(asset.selection.mcpServers)
          ? asset.selection.mcpServers
          : [];
        const canTouchConfig = options.installConfig !== false && asset.configToml;

        if (canTouchConfig && allowedAgents.length > 0) {
          if (!options.dryRun) {
            const wired = mergeUpstreamAgentsBlock(configPath, {
              sourceName: asset.name,
              sourceConfigPath: asset.configToml,
              allowedAgents,
            });
            if (wired) {
              console.log(`  Registered ${allowedAgents.length} agents from ${asset.name} -> ${configPath}`);
            }
          } else {
            console.log(`  Would register ${allowedAgents.length} agents from ${asset.name} -> ${configPath}`);
          }
        }

        if (canTouchConfig && allowedServers.length > 0) {
          if (!options.dryRun) {
            const merged = mergeUpstreamMcpBlock(configPath, {
              sourceName: asset.name,
              sourceConfigPath: asset.configToml,
              allowedServers,
            });
            if (merged) {
              console.log(`  Merged ${allowedServers.length} MCP servers from ${asset.name} -> ${configPath}`);
            }
          } else {
            console.log(`  Would merge ${allowedServers.length} MCP servers from ${asset.name} -> ${configPath}`);
          }
        }
      }
    }
  }

  console.log('[7/7] Catalog check...');
  const headline = getCatalogHeadlineCounts(root);
  if (headline) {
    console.log(`  Catalog baseline: ${headline.skills} skills, ${headline.prompts} prompts`);
  } else {
    console.log('  Catalog manifest missing (run npm run catalog:generate)');
  }

  console.log('\nDone.');
}

module.exports = { setup };
