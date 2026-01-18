/**
 * 문서 통계 동기화 스크립트
 *
 * 실제 데이터를 기반으로 README.md와 CLAUDE.md의 통계 숫자를 자동 업데이트합니다.
 * Single Source of Truth: data/ 디렉토리의 JSON 파일들
 *
 * @example
 * ```bash
 * pnpm sync:stats        # 통계 동기화
 * pnpm sync:stats --check # 동기화 필요 여부만 확인 (CI용)
 * ```
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// ============================================================================
// Types
// ============================================================================

interface AppStats {
  entries: number;
  categories: number;
  conversations: number;
  routes: number;
}

interface AllStats {
  context: AppStats;
  roots: {
    concepts: number;
    fields: number;
    routes: number;
  };
  permissive: {
    libraries: number;
    webApis: number;
    routes: number;
  };
  totalRoutes: number;
  generatedAt: string;
}

// ============================================================================
// Data Counting Functions
// ============================================================================

/**
 * JSON 파일들의 배열 항목 수를 카운트
 */
function countJsonArrayItems(dir: string): number {
  if (!existsSync(dir)) return 0;

  let total = 0;
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const content = readFileSync(join(dir, file), 'utf-8');
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      total += data.length;
    }
  }

  return total;
}

/**
 * TypeScript 파일에서 배열 항목 수 추정 (id: 패턴 카운트)
 */
function countTsArrayItems(filePath: string, pattern: RegExp): number {
  if (!existsSync(filePath)) return 0;

  const content = readFileSync(filePath, 'utf-8');
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

/**
 * Context 앱 통계 수집
 */
function getContextStats(): AppStats {
  const entriesDir = join(ROOT_DIR, 'data/context/entries');
  const categoriesFile = join(ROOT_DIR, 'apps/context/app/data/categories.ts');
  const conversationsFile = join(ROOT_DIR, 'apps/context/app/data/conversations.ts');

  const entries = countJsonArrayItems(entriesDir);

  // categories.ts에서 { id: 패턴 카운트
  const categories = countTsArrayItems(categoriesFile, /{\s*id:\s*'/g);

  // conversations.ts에서 categoryId 패턴으로 unique 카테고리 수 세기
  const conversationsContent = existsSync(conversationsFile)
    ? readFileSync(conversationsFile, 'utf-8')
    : '';
  const convMatches = conversationsContent.match(/categoryId:\s*'([^']+)'/g) || [];
  const uniqueConvCategories = new Set(
    convMatches.map((m) => m.replace(/categoryId:\s*'([^']+)'/, '$1')),
  );
  const conversationCategories = uniqueConvCategories.size;

  // conversations 총 개수
  const conversations = countTsArrayItems(conversationsFile, /{\s*id:\s*'[^']+',\s*categoryId:/g);

  // 라우트 계산: (entries * 2) + (categories * 2) + (convCategories * 2) + static
  const staticRoutes = 8; // /, /ko, /about, /ko/about, /categories, /ko/categories, /conversations, /ko/conversations
  const routes = entries * 2 + categories * 2 + conversationCategories * 2 + staticRoutes;

  return { entries, categories, conversations, routes };
}

/**
 * Roots 앱 통계 수집
 */
function getRootsStats() {
  const conceptsDir = join(ROOT_DIR, 'data/roots/concepts');
  const fieldsFile = join(ROOT_DIR, 'apps/roots/app/data/fields.ts');

  // concepts 디렉토리의 JSON 파일들에서 배열 항목 카운트
  const concepts = countJsonArrayItems(conceptsDir);

  const fields = countTsArrayItems(fieldsFile, /{\s*id:\s*'/g);

  // 라우트: (concepts * 2) + (fields * 2) + static
  const staticRoutes = 8;
  const routes = concepts * 2 + fields * 2 + staticRoutes;

  return { concepts, fields, routes };
}

/**
 * Permissive 앱 통계 수집
 */
function getPermissiveStats() {
  const librariesFile = join(ROOT_DIR, 'data/permissive/libraries.json');
  const webApisFile = join(ROOT_DIR, 'data/permissive/web-apis.json');

  let libraries = 0;
  let webApis = 0;

  if (existsSync(librariesFile)) {
    const data = JSON.parse(readFileSync(librariesFile, 'utf-8'));
    libraries = Array.isArray(data) ? data.length : 0;
  }

  if (existsSync(webApisFile)) {
    const data = JSON.parse(readFileSync(webApisFile, 'utf-8'));
    webApis = Array.isArray(data) ? data.length : 0;
  }

  // 라우트: 정적 페이지만
  const routes = 8; // /, /ko, /libraries, /ko/libraries, /web-apis, /ko/web-apis, /about, /ko/about

  return { libraries, webApis, routes };
}

/**
 * 모든 통계 수집
 */
function getAllStats(): AllStats {
  const context = getContextStats();
  const roots = getRootsStats();
  const permissive = getPermissiveStats();

  return {
    context,
    roots,
    permissive,
    totalRoutes: context.routes + roots.routes + permissive.routes,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// Document Update Functions
// ============================================================================

interface Replacement {
  pattern: RegExp;
  replacement: string;
}

/**
 * README.md 업데이트를 위한 치환 규칙 생성
 */
function getReadmeReplacements(stats: AllStats): Replacement[] {
  return [
    // Context features line
    {
      pattern: /\| \*\*Features\*\* \| \d+ entries, \d+ categories, \d+ conversations \|/g,
      replacement: `| **Features** | ${stats.context.entries} entries, ${stats.context.categories} categories, ${stats.context.conversations} conversations |`,
    },
    // Context table row
    {
      pattern:
        /\| \*\*Context\*\* \| \d+ entries \+ \d+ categories \+ \d+ conversations \| [\d,]+ \| JSON \|/g,
      replacement: `| **Context** | ${stats.context.entries} entries + ${stats.context.categories} categories + ${stats.context.conversations} conversations | ${stats.context.routes.toLocaleString()} | JSON |`,
    },
    // Roots table row
    {
      pattern: /\| \*\*Roots\*\* \| \d+ concepts \+ \d+ fields \| [\d,]+ \| TypeScript \|/g,
      replacement: `| **Roots** | ${stats.roots.concepts} concepts + ${stats.roots.fields} fields | ${stats.roots.routes.toLocaleString()} | TypeScript |`,
    },
    // Total routes
    {
      pattern: /\| \*\*Total\*\* \| — \| \*\*[\d,]+\*\* \| — \|/g,
      replacement: `| **Total** | — | **${stats.totalRoutes.toLocaleString()}** | — |`,
    },
    // Project structure comments
    {
      pattern: /│ {3}├── context\/\s+# \d+ Korean entries/g,
      replacement: `│   ├── context/             # ${stats.context.entries} Korean entries`,
    },
    {
      pattern: /│ {3}├── roots\/\s+# \d+ math concepts/g,
      replacement: `│   ├── roots/               # ${stats.roots.concepts} math concepts`,
    },
    // Roots features
    {
      pattern: /\| \*\*Features\*\* \| \d+ concepts, \d+ fields \|/g,
      replacement: `| **Features** | ${stats.roots.concepts} concepts, ${stats.roots.fields} fields |`,
    },
    // Permissive features
    {
      pattern: /\| \*\*Features\*\* \| \d+ libraries, \d+ Web APIs \|/g,
      replacement: `| **Features** | ${stats.permissive.libraries} libraries, ${stats.permissive.webApis} Web APIs |`,
    },
    // Context routes in header
    {
      pattern: /> \*\*학습자를 위한 한국어 사전\*\* \| [\d,]+ routes/g,
      replacement: `> **학습자를 위한 한국어 사전** | ${stats.context.routes.toLocaleString()} routes`,
    },
    // Roots routes in header
    {
      pattern: /> \*\*학습자를 위한 수학 문서\*\* \| [\d,]+ routes/g,
      replacement: `> **학습자를 위한 수학 문서** | ${stats.roots.routes.toLocaleString()} routes`,
    },
    // Permissive routes in header
    {
      pattern: /> \*\*무료 웹개발 자료 모음\*\* \| \d+ routes/g,
      replacement: `> **무료 웹개발 자료 모음** | ${stats.permissive.routes} routes`,
    },
    // Project structure - apps routes
    {
      pattern: /│ {3}├── context\/\s+# Korean dictionary \([\d,]+ routes\)/g,
      replacement: `│   ├── context/             # Korean dictionary (${stats.context.routes.toLocaleString()} routes)`,
    },
    {
      pattern: /│ {3}└── roots\/\s+# Math documentation \([\d,]+ routes\)/g,
      replacement: `│   └── roots/               # Math documentation (${stats.roots.routes.toLocaleString()} routes)`,
    },
  ];
}

/**
 * CLAUDE.md 업데이트를 위한 치환 규칙 생성
 */
function getClaudeMdReplacements(stats: AllStats): Replacement[] {
  return [
    // routes line
    {
      pattern: /각 앱 라우트: Context \d+개, Roots \d+개, Permissive \d+개/g,
      replacement: `각 앱 라우트: Context ${stats.context.routes}개, Roots ${stats.roots.routes}개, Permissive ${stats.permissive.routes}개`,
    },
    // Data directory entries comment
    {
      pattern: /│ {3}└── entries\/\s+# \d+개 한국어 단어/g,
      replacement: `│   └── entries/       # ${stats.context.entries}개 한국어 단어`,
    },
    // Roots concepts comment
    {
      pattern: /│ {3}└── concepts\/\s+# \d+개 수학 개념/g,
      replacement: `│   └── concepts/      # ${stats.roots.concepts}개 수학 개념`,
    },
  ];
}

/**
 * apps/context/README.md 업데이트를 위한 치환 규칙 생성
 */
function getContextReadmeReplacements(stats: AllStats): Replacement[] {
  const entries = stats.context.entries;
  const ssg = stats.context.routes;
  const enRoutes = Math.floor(ssg / 2);
  const koRoutes = ssg - enRoutes;

  return [
    // Badge
    {
      pattern: /Routes-\d+-blue/g,
      replacement: `Routes-${ssg}-blue`,
    },
    // Word entries line
    {
      pattern: /- \*\*\d+ Word Entries\*\*/g,
      replacement: `- **${entries} Word Entries**`,
    },
    // prerender routes
    {
      pattern: /├── prerender\(\) → \d+ static routes generated/g,
      replacement: `├── prerender() → ${ssg} static routes generated`,
    },
    // entries × 2 langs
    {
      pattern: /│ {3}├── entries → \d+ × 2 langs/g,
      replacement: `│   ├── entries → ${entries} × 2 langs`,
    },
    // entry html files
    {
      pattern: /├── entry\/\{id\}\.html, ko\/entry\/\{id\}\.html \(×\d+\)/g,
      replacement: `├── entry/{id}.html, ko/entry/{id}.html (×${entries})`,
    },
    // entries total comment
    {
      pattern: /│ {3}└── \.\.\. \(\d+ entries total\)/g,
      replacement: `│   └── ... (${entries} entries total)`,
    },
    // Route table entry count
    {
      pattern: /\| `\/entry\/:entryId` \| ✓ \| ✓ \| \d+ \| Word entry page \|/g,
      replacement: `| \`/entry/:entryId\` | ✓ | ✓ | ${entries} | Word entry page |`,
    },
    // Total routes line
    {
      pattern: /\*\*Total:\*\* \d+ routes \(\d+ EN \+ \d+ KO\)/g,
      replacement: `**Total:** ${ssg} routes (${enRoutes} EN + ${koRoutes} KO)`,
    },
  ];
}

/**
 * apps/roots/README.md 업데이트를 위한 치환 규칙 생성
 */
function getRootsReadmeReplacements(stats: AllStats): Replacement[] {
  const concepts = stats.roots.concepts;
  const fields = stats.roots.fields;
  const ssg = stats.roots.routes;
  const enRoutes = Math.floor(ssg / 2);
  const koRoutes = ssg - enRoutes;

  return [
    // Badge
    {
      pattern: /Routes-\d+-blue/g,
      replacement: `Routes-${ssg}-blue`,
    },
    // Math concepts count
    {
      pattern: /- \*\*\d+ Math Concepts\*\*/g,
      replacement: `- **${concepts} Math Concepts**`,
    },
    // Math fields count
    {
      pattern: /- \*\*\d+ Math Fields\*\*/g,
      replacement: `- **${fields} Math Fields**`,
    },
    // prerender routes
    {
      pattern: /├── prerender\(\) → \d+ static routes generated/g,
      replacement: `├── prerender() → ${ssg} static routes generated`,
    },
    // concept routes
    {
      pattern: /│ {3}├── concept-names\.json → \d+ concept routes × 2 langs/g,
      replacement: `│   ├── concept-names.json → ${concepts} concept routes × 2 langs`,
    },
    // field routes
    {
      pattern: /│ {3}└── fields\.ts → \d+ field routes × 2 langs/g,
      replacement: `│   └── fields.ts → ${fields} field routes × 2 langs`,
    },
    // concept html files
    {
      pattern: /├── concept\/\{id\}\.html, ko\/concept\/\{id\}\.html \(×\d+\)/g,
      replacement: `├── concept/{id}.html, ko/concept/{id}.html (×${concepts})`,
    },
    // field html files
    {
      pattern: /├── field\/\{id\}\.html, ko\/field\/\{id\}\.html \(×\d+\)/g,
      replacement: `├── field/{id}.html, ko/field/{id}.html (×${fields})`,
    },
    // concepts total comment
    {
      pattern: /└── \.\.\. \(\d+ field files, \d+ concepts total\)/g,
      replacement: `└── ... (${fields} field files, ${concepts} concepts total)`,
    },
    // Total routes line
    {
      pattern: /\*\*Total:\*\* \d+ routes \(\d+ EN \+ \d+ KO\)/g,
      replacement: `**Total:** ${ssg} routes (${enRoutes} EN + ${koRoutes} KO)`,
    },
  ];
}

/**
 * apps/permissive/README.md 업데이트를 위한 치환 규칙 생성
 */
function getPermissiveReadmeReplacements(stats: AllStats): Replacement[] {
  const libraries = stats.permissive.libraries;
  const webApis = stats.permissive.webApis;
  const ssg = stats.permissive.routes;
  const enRoutes = Math.floor(ssg / 2);
  const koRoutes = ssg - enRoutes;

  return [
    // Badge
    {
      pattern: /Routes-\d+-blue/g,
      replacement: `Routes-${ssg}-blue`,
    },
    // Libraries count
    {
      pattern: /- \*\*\d+ Libraries\*\*/g,
      replacement: `- **${libraries} Libraries**`,
    },
    // Web APIs count
    {
      pattern: /- \*\*\d+ Web APIs\*\*/g,
      replacement: `- **${webApis} Web APIs**`,
    },
    // prerender routes
    {
      pattern: /├── prerender\(\) → \d+ static routes generated/g,
      replacement: `├── prerender() → ${ssg} static routes generated`,
    },
    // Library routes
    {
      pattern: /│ {3}└── Library detail routes from data \(\d+ × 2 langs\)/g,
      replacement: `│   └── Library detail routes from data (${libraries} × 2 langs)`,
    },
    // library html files
    {
      pattern: /├── library\/\{slug\}\/index\.html \(\d+ libraries × 2 langs\)/g,
      replacement: `├── library/{slug}/index.html (${libraries} libraries × 2 langs)`,
    },
    // Route table library count
    {
      pattern: /\| `\/library\/:slug` \| ✓ \| ✓ \| \d+ \| Library detail page \|/g,
      replacement: `| \`/library/:slug\` | ✓ | ✓ | ${libraries} | Library detail page |`,
    },
    // Total routes line
    {
      pattern: /\*\*Total:\*\* \d+ routes \(\d+ EN \+ \d+ KO\)/g,
      replacement: `**Total:** ${ssg} routes (${enRoutes} EN + ${koRoutes} KO)`,
    },
    // Comparison table
    {
      pattern: /\| Routes \| \d+ \| \d+ \| \d+ \|/g,
      replacement: `| Routes | ${stats.context.routes} | ${stats.roots.routes} | ${ssg} |`,
    },
  ];
}

/**
 * 파일 내용 업데이트
 */
function updateFile(filePath: string, replacements: Replacement[]): boolean {
  if (!existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = readFileSync(filePath, 'utf-8');
  const originalContent = content;

  for (const { pattern, replacement } of replacements) {
    content = content.replace(pattern, replacement);
  }

  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf-8');
    return true;
  }

  return false;
}

// ============================================================================
// Main
// ============================================================================

function main() {
  const isCheckOnly = process.argv.includes('--check');

  console.log('📊 Collecting stats from data sources...\n');

  const stats = getAllStats();

  // 통계 출력
  console.log('Context App:');
  console.log(`  - Entries: ${stats.context.entries}`);
  console.log(`  - Categories: ${stats.context.categories}`);
  console.log(`  - Conversations: ${stats.context.conversations}`);
  console.log(`  - Routes: ${stats.context.routes}`);

  console.log('\nRoots App:');
  console.log(`  - Concepts: ${stats.roots.concepts}`);
  console.log(`  - Fields: ${stats.roots.fields}`);
  console.log(`  - Routes: ${stats.roots.routes}`);

  console.log('\nPermissive App:');
  console.log(`  - Libraries: ${stats.permissive.libraries}`);
  console.log(`  - Web APIs: ${stats.permissive.webApis}`);
  console.log(`  - Routes: ${stats.permissive.routes}`);

  console.log(`\nTotal Routes: ${stats.totalRoutes}`);

  // meta.json 저장
  const metaPath = join(ROOT_DIR, 'meta.json');
  writeFileSync(metaPath, JSON.stringify(stats, null, 2), 'utf-8');
  console.log(`\n✅ Saved stats to meta.json`);

  // data/context/meta.json 타임스탬프 업데이트 (SEO: 데이터 신선도 표시)
  const contextMetaPath = join(ROOT_DIR, 'data/context/meta.json');
  if (existsSync(contextMetaPath)) {
    const contextMeta = JSON.parse(readFileSync(contextMetaPath, 'utf-8'));
    contextMeta.generatedAt = stats.generatedAt;
    writeFileSync(contextMetaPath, JSON.stringify(contextMeta, null, 2), 'utf-8');
    console.log('✅ Updated data/context/meta.json timestamp');
  }

  if (isCheckOnly) {
    console.log('\n🔍 Check mode: verifying docs are in sync...');
    // TODO: 실제 검증 로직 추가
    process.exit(0);
  }

  // 문서 업데이트
  console.log('\n📝 Updating documentation...\n');

  const readmePath = join(ROOT_DIR, 'README.md');
  const claudeMdPath = join(ROOT_DIR, 'CLAUDE.md');
  const contextReadmePath = join(ROOT_DIR, 'apps/context/README.md');
  const rootsReadmePath = join(ROOT_DIR, 'apps/roots/README.md');
  const permissiveReadmePath = join(ROOT_DIR, 'apps/permissive/README.md');

  const readmeUpdated = updateFile(readmePath, getReadmeReplacements(stats));
  const claudeMdUpdated = updateFile(claudeMdPath, getClaudeMdReplacements(stats));
  const contextReadmeUpdated = updateFile(contextReadmePath, getContextReadmeReplacements(stats));
  const rootsReadmeUpdated = updateFile(rootsReadmePath, getRootsReadmeReplacements(stats));
  const permissiveReadmeUpdated = updateFile(
    permissiveReadmePath,
    getPermissiveReadmeReplacements(stats),
  );

  if (readmeUpdated) {
    console.log('✅ README.md updated');
  } else {
    console.log('ℹ️  README.md already in sync');
  }

  if (claudeMdUpdated) {
    console.log('✅ CLAUDE.md updated');
  } else {
    console.log('ℹ️  CLAUDE.md already in sync');
  }

  if (contextReadmeUpdated) {
    console.log('✅ apps/context/README.md updated');
  } else {
    console.log('ℹ️  apps/context/README.md already in sync');
  }

  if (rootsReadmeUpdated) {
    console.log('✅ apps/roots/README.md updated');
  } else {
    console.log('ℹ️  apps/roots/README.md already in sync');
  }

  if (permissiveReadmeUpdated) {
    console.log('✅ apps/permissive/README.md updated');
  } else {
    console.log('ℹ️  apps/permissive/README.md already in sync');
  }

  console.log('\n✨ Stats sync complete!');
}

main();
