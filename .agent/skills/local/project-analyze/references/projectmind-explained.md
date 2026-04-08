# ProjectMind Technical Architecture

## Overview

ProjectMind is a knowledge graph-based intelligent project analysis system that provides 40-second project understanding through automated dependency analysis and architectural pattern recognition.

---

## System Architecture

### Three-Layer Design

```
Layer 1: File Discovery & Parsing
    ↓
Layer 2: Knowledge Graph Construction
    ↓
Layer 3: Pattern Recognition & Analysis
```

### Layer 1: File Discovery & Parsing

**Purpose**: Efficiently discover and parse project files

**Components**:

1. **File Scanner**
   - Fast directory traversal (ignore `node_modules`, `.git`, etc.)
   - File type detection (extension-based + content-based)
   - Configurable ignore patterns

2. **Parsers**
   - **JSON Parser**: `package.json`, `tsconfig.json`, etc.
   - **YAML Parser**: `.gitlab-ci.yml`, `docker-compose.yml`, etc.
   - **Code Parser**: JavaScript/TypeScript AST analysis
   - **Markdown Parser**: README, docs structure

**Performance Optimizations**:
- Parallel file reading (Worker threads)
- Streaming for large files
- Caching frequently accessed files
- Skip binary files

---

### Layer 2: Knowledge Graph Construction

**Purpose**: Build interconnected knowledge graph of project structure

**Graph Schema**:

```typescript
interface ProjectNode {
  id: string;
  type: NodeType;
  properties: Record<string, any>;
  relationships: Relationship[];
}

type NodeType =
  | 'Project'
  | 'Package'
  | 'Module'
  | 'File'
  | 'Function'
  | 'Class'
  | 'Dependency'
  | 'Config';

interface Relationship {
  type: RelationType;
  from: string;  // Node ID
  to: string;    // Node ID
  properties?: Record<string, any>;
}

type RelationType =
  | 'IMPORTS'
  | 'EXPORTS'
  | 'DEPENDS_ON'
  | 'CONTAINS'
  | 'CONFIGURES'
  | 'CALLS'
  | 'EXTENDS'
  | 'IMPLEMENTS';
```

**Graph Construction Process**:

1. **Create Root Node**
   ```typescript
   const projectNode: ProjectNode = {
     id: 'project:root',
     type: 'Project',
     properties: {
       name: packageJson.name,
       version: packageJson.version,
       type: detectProjectType(),
     },
     relationships: []
   };
   ```

2. **Build Dependency Graph**
   ```typescript
   // External dependencies
   for (const [dep, version] of Object.entries(packageJson.dependencies)) {
     const depNode = createDependencyNode(dep, version);
     graph.add(depNode);
     graph.addRelationship('project:root', depNode.id, 'DEPENDS_ON');
   }

   // Internal module dependencies
   for (const file of sourceFiles) {
     const imports = parseImports(file);
     for (const imp of imports) {
       if (isInternalModule(imp)) {
         graph.addRelationship(file.id, resolveModule(imp).id, 'IMPORTS');
       }
     }
   }
   ```

3. **Extract Component Hierarchy**
   ```typescript
   // Identify layers (UI, Business Logic, Data Access)
   const layerPatterns = {
     ui: /^(components|pages|views)\//,
     logic: /^(services|models|lib)\//,
     data: /^(repositories|dao|database)\//
   };

   for (const file of sourceFiles) {
     const layer = detectLayer(file.path, layerPatterns);
     file.properties.layer = layer;
   }
   ```

**Graph Storage**:
- In-memory graph for fast queries
- Optional persistence (SQLite for large projects)
- Efficient serialization for caching

---

### Layer 3: Pattern Recognition & Analysis

**Purpose**: Recognize architectural patterns and provide insights

**Pattern Recognition Algorithms**:

1. **Architecture Pattern Detection**
   ```typescript
   function detectArchitecturePattern(graph: ProjectGraph): Pattern {
     const indicators = {
       mvc: hasMVCStructure(graph),
       microservices: hasMicroservicesStructure(graph),
       layered: hasLayeredArchitecture(graph),
       eventDriven: hasEventBusPatterns(graph),
       monorepo: hasMonorepoStructure(graph)
     };

     return findBestMatch(indicators);
   }

   function hasMVCStructure(graph: ProjectGraph): boolean {
     const dirs = graph.getDirectories();
     return dirs.includes('controllers') &&
            dirs.includes('models') &&
            (dirs.includes('views') || dirs.includes('templates'));
   }
   ```

2. **Complexity Analysis**
   ```typescript
   function analyzeComplexity(graph: ProjectGraph): ComplexityMetrics {
     return {
       fileCount: graph.nodes.filter(n => n.type === 'File').length,
       avgFileSize: calculateAverageFileSize(graph),
       maxNestingDepth: findMaxNestingDepth(graph),
       cyclomaticComplexity: calculateCyclomaticComplexity(graph),
       dependencyDepth: calculateDependencyDepth(graph)
     };
   }
   ```

3. **Hotspot Detection**
   ```typescript
   function findHotspots(graph: ProjectGraph, gitHistory: GitLog[]): Hotspot[] {
     // Files changed most frequently
     const changeFrequency = calculateChangeFrequency(gitHistory);

     // Files with most dependencies
     const dependencyCount = graph.nodes.map(node => ({
       file: node,
       deps: graph.getRelationships(node.id, 'DEPENDS_ON').length
     }));

     // Combine metrics
     return combineMetrics(changeFrequency, dependencyCount);
   }
   ```

4. **Technical Debt Identification**
   ```typescript
   function identifyTechnicalDebt(graph: ProjectGraph): TechnicalDebt[] {
     const debt: TechnicalDebt[] = [];

     // Outdated dependencies
     debt.push(...findOutdatedDependencies(graph));

     // Circular dependencies
     debt.push(...findCircularDependencies(graph));

     // Dead code
     debt.push(...findDeadCode(graph));

     // Code duplication
     debt.push(...findDuplicatedCode(graph));

     return debt.sort((a, b) => b.severity - a.severity);
   }
   ```

---

## Key Algorithms

### 1. Dependency Resolution

**Challenge**: Resolve relative imports to absolute module paths

**Algorithm**:
```typescript
function resolveImport(
  importPath: string,
  fromFile: string,
  tsConfig: TSConfig
): string {
  // Check if it's a path alias (e.g., '@/components/Button')
  if (tsConfig.paths) {
    for (const [alias, targets] of Object.entries(tsConfig.paths)) {
      if (importPath.startsWith(alias)) {
        return resolveAlias(importPath, alias, targets);
      }
    }
  }

  // Resolve relative path
  if (importPath.startsWith('.')) {
    return path.resolve(path.dirname(fromFile), importPath);
  }

  // External module
  return importPath;
}
```

**Performance**: O(1) with path alias cache

---

### 2. Circular Dependency Detection

**Challenge**: Detect cycles in module dependency graph

**Algorithm**: Depth-First Search with cycle detection
```typescript
function findCircularDependencies(graph: ProjectGraph): Cycle[] {
  const cycles: Cycle[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(nodeId: string, path: string[] = []): void {
    if (recursionStack.has(nodeId)) {
      // Found cycle
      const cycleStart = path.indexOf(nodeId);
      cycles.push(path.slice(cycleStart));
      return;
    }

    if (visited.has(nodeId)) return;

    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const deps = graph.getRelationships(nodeId, 'IMPORTS');
    for (const dep of deps) {
      dfs(dep.to, [...path]);
    }

    recursionStack.delete(nodeId);
  }

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  }

  return cycles;
}
```

**Performance**: O(V + E) where V = nodes, E = edges

---

### 3. Layer Detection

**Challenge**: Automatically detect architectural layers

**Algorithm**: Pattern matching + heuristics
```typescript
function detectLayers(graph: ProjectGraph): LayerMap {
  const layers: LayerMap = {
    presentation: [],
    business: [],
    data: [],
    infrastructure: []
  };

  for (const node of graph.nodes.filter(n => n.type === 'File')) {
    const layer = classifyByPath(node.properties.path) ||
                  classifyByDependencies(node, graph) ||
                  classifyByNamingConvention(node);

    layers[layer].push(node);
  }

  return layers;
}

function classifyByPath(filePath: string): Layer | null {
  const patterns = {
    presentation: /\/(components|pages|views|ui)\//,
    business: /\/(services|models|domain|logic)\//,
    data: /\/(repositories|dao|models|entities)\//,
    infrastructure: /\/(config|utils|helpers|lib)\//
  };

  for (const [layer, pattern] of Object.entries(patterns)) {
    if (pattern.test(filePath)) return layer as Layer;
  }

  return null;
}
```

---

## Performance Characteristics

### Analysis Speed

| Project Size | File Count | Analysis Time | Memory Usage |
|--------------|------------|---------------|--------------|
| Small | < 100 files | < 5s | < 50MB |
| Medium | 100-1000 files | 5-20s | 50-200MB |
| Large | 1000-10000 files | 20-60s | 200-500MB |
| Very Large | > 10000 files | 60-120s | 500MB-1GB |

**Optimization Techniques**:
- Parallel file processing (Worker threads)
- Incremental analysis (cache previous results)
- Smart file filtering (skip `node_modules`, etc.)
- Lazy evaluation (compute metrics on demand)

---

### Memory Optimization

1. **Streaming Large Files**
   ```typescript
   async function parselargeFile(filePath: string): Promise<AST> {
     const stream = fs.createReadStream(filePath);
     return await parseStream(stream);  // Don't load entire file
   }
   ```

2. **Lazy Graph Construction**
   ```typescript
   class LazyProjectGraph {
     private nodeCache = new Map<string, ProjectNode>();

     getNode(id: string): ProjectNode {
       if (!this.nodeCache.has(id)) {
         this.nodeCache.set(id, this.loadNode(id));  // Load on demand
       }
       return this.nodeCache.get(id)!;
     }
   }
   ```

3. **Garbage Collection Optimization**
   ```typescript
   // Clear cache after analysis
   function analyzeAndCleanup(projectPath: string): Analysis {
     const graph = buildGraph(projectPath);
     const analysis = runAnalysis(graph);

     graph.clear();  // Free memory
     global.gc();    // Hint to GC

     return analysis;
   }
   ```

---

## Caching Strategy

### Three-Level Cache

1. **Level 1: In-Memory Cache** (Session lifetime)
   - Parsed ASTs
   - Dependency maps
   - Current analysis results

2. **Level 2: Disk Cache** (Project lifetime)
   - File metadata (mtimes, sizes)
   - Dependency graph serialization
   - Previous analysis results

3. **Level 3: Global Cache** (Cross-project)
   - npm package metadata
   - Common pattern definitions
   - Shared configurations

### Cache Invalidation

```typescript
function shouldInvalidateCache(file: FileInfo, cache: CacheEntry): boolean {
  // File modified
  if (file.mtime > cache.mtime) return true;

  // Dependencies changed
  if (cache.dependencies.some(dep => hasChanged(dep))) return true;

  // Analysis version changed
  if (cache.version !== CURRENT_VERSION) return true;

  return false;
}
```

---

## API Usage Examples

### Basic Analysis

```typescript
import { analyzeProject } from 'project-mind';

const analysis = await analyzeProject('/path/to/project');

console.log(analysis.summary);
// {
//   type: 'React SPA',
//   fileCount: 450,
//   complexity: 'Medium',
//   technicalDebt: 'Low'
// }
```

### Dependency Graph

```typescript
const graph = await buildDependencyGraph('/path/to/project');

// Find all files that depend on a module
const dependents = graph.getDependents('src/utils/api.ts');

// Find circular dependencies
const cycles = graph.findCycles();

// Export graph for visualization
const graphData = graph.exportForVisualization();
```

### Pattern Detection

```typescript
const patterns = await detectPatterns('/path/to/project');

console.log(patterns.architecture);
// 'MVC with Service Layer'

console.log(patterns.designPatterns);
// ['Singleton', 'Factory', 'Observer']
```

---

## Integration Points

### VS Code Extension

```typescript
// Provide IntelliSense based on project graph
vscode.languages.registerCompletionItemProvider('typescript', {
  provideCompletionItems(document, position) {
    const graph = getProjectGraph(document.uri);
    const availableModules = graph.getAvailableImports(document.uri);
    return availableModules.map(toCompletionItem);
  }
});
```

### CI/CD Pipeline

```yaml
# GitHub Actions
- name: Analyze Project
  run: project-mind analyze --json > analysis.json

- name: Check Technical Debt
  run: |
    if [ $(jq '.technicalDebt.score' analysis.json) -gt 50 ]; then
      echo "Technical debt too high!"
      exit 1
    fi
```

---

## Future Enhancements

1. **Real-time Analysis**: Watch mode for incremental updates
2. **ML-Based Patterns**: Learn project-specific patterns
3. **Cross-Project Insights**: Compare with similar projects
4. **Refactoring Suggestions**: Automated code improvements
5. **Dependency Upgrade Path**: Safe upgrade recommendations
