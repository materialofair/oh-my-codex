const { tryReadCatalogManifest } = require('../catalog/reader');

const ROUTE_RULES = [
  { skill: 'plan', weight: 3, keywords: ['plan', '规划', '设计', 'architecture', '架构', '方案', 'roadmap'] },
  { skill: 'research', weight: 3, keywords: ['research', '调研', 'compare', '对比', 'benchmark'] },
  { skill: 'code-review', weight: 4, keywords: ['review', 'code review', '审查', '评审'] },
  { skill: 'conductor', weight: 5, keywords: ['conductor', 'track', 'spec.md', 'plan.md', 'tracks.md', 'long-lived project context', '长期项目上下文'] },
  { skill: 'de-ai-writing', weight: 4, keywords: ['去ai味', '去 ai 味', 'ai味', '机器感', '机器味', '像人写的', '自然中文', 'humanize', 'remove ai tone', '像真人讲出来', '讲道稿去 ai 味', '保留经文', '牧养语气', '代码块不能动', '配置项不能动', '保留术语'] },
  { skill: 'security-review', weight: 4, keywords: ['security', 'auth', '鉴权', '漏洞', '安全'] },
  { skill: 'build-fix', weight: 4, keywords: ['build error', 'compile', 'type error', 'lint', '失败', '报错'] },
  { skill: 'verify', weight: 3, keywords: ['verify', '验证', 'check', '检查'] },
  { skill: 'tdd', weight: 3, keywords: ['tdd', 'test first', '测试先行'] },
  { skill: 'tdd-workflow', weight: 2, keywords: ['unit test', 'integration test', 'e2e', 'coverage'] },
  { skill: 'ultraqa', weight: 3, keywords: ['qa', '回归', 'quality loop', '质量闭环'] },
  { skill: 'de-ai-writing', weight: 4, keywords: ['去ai味', 'ai味', 'ai 感', '降低ai感', '像真人写的', '像人写的', '太像chatgpt', '模板腔', '像模型写的', 'humanize this article', '神学分享去掉机器感', '别改掉经文', '保留神学立场', '技术博客润色', '命令和术语都别动'] },
  { skill: 'autopilot', weight: 3, keywords: ['implement', '实现', '开发', 'build feature', '交付'] },
  { skill: 'start-dev', weight: 3, keywords: ['start', 'kickoff', '开始开发', '新功能'] },
  { skill: 'swarm', weight: 2, keywords: ['parallel', '并行', 'multi-agent', '多代理'] },
  { skill: 'ultrawork', weight: 2, keywords: ['batch', '批量', 'high throughput', '大量'] },
  { skill: 'backend-patterns', weight: 2, keywords: ['api', 'backend', '数据库', 'service'] },
  { skill: 'frontend-patterns', weight: 2, keywords: ['frontend', 'ui', '组件', '页面'] },
  { skill: 'frontend-ui-ux', weight: 2, keywords: ['ux', '视觉', '交互', '界面设计'] },
  { skill: 'debug-analysis', weight: 3, keywords: ['debug', '定位问题', '根因', 'trace'] },
];

function normalizeText(input) {
  return String(input || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function countHits(text, keywords) {
  let hits = 0;
  for (const keyword of keywords) {
    const token = normalizeText(keyword);
    if (!token) continue;
    if (text.includes(token)) hits += 1;
  }
  return hits;
}

function catalogSkills(root) {
  const manifest = tryReadCatalogManifest(root);
  if (!manifest) return null;
  return new Set(manifest.skills.filter((skill) => skill.status === 'active').map((skill) => skill.name));
}

function routeTaskToSkills(taskDescription, options = {}) {
  const text = normalizeText(taskDescription);
  const limit = Math.max(1, Number(options.limit) || 5);
  const root = options.root;
  const available = catalogSkills(root);

  const scored = [];
  for (const rule of ROUTE_RULES) {
    if (available && !available.has(rule.skill)) continue;
    const hits = countHits(text, rule.keywords);
    if (hits === 0) continue;
    scored.push({
      skill: rule.skill,
      score: hits * rule.weight,
      hits,
      rationale: `matched ${hits} keyword(s)`,
    });
  }

  scored.sort((a, b) => b.score - a.score || a.skill.localeCompare(b.skill));

  const unique = [];
  const seen = new Set();
  for (const item of scored) {
    if (seen.has(item.skill)) continue;
    seen.add(item.skill);
    unique.push(item);
  }

  if (unique.length === 0) {
    if (!available || available.has('autopilot')) unique.push({ skill: 'autopilot', score: 1, hits: 0, rationale: 'default execution fallback' });
    if (!available || available.has('plan')) unique.push({ skill: 'plan', score: 1, hits: 0, rationale: 'default planning fallback' });
  }

  const top = unique.slice(0, limit);
  const totalScore = top.reduce((sum, item) => sum + item.score, 0);
  const confidence = Math.min(1, totalScore / 12);

  return {
    task: String(taskDescription || ''),
    confidence,
    recommendations: top,
  };
}

module.exports = {
  routeTaskToSkills,
};
