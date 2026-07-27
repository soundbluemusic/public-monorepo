/**
 * 문서 통계 동기화 스크립트
 *
 * 실제 데이터를 기반으로 README.md, CLAUDE.md, metadata.json의 통계 숫자를 자동 업데이트합니다.
 * Single Source of Truth: packages/data/src/metadata.ts
 *
 * @example
 * ```bash
 * pnpm sync:stats              # 통계 동기화 (metadata.ts → 문서)
 * pnpm sync:stats --fetch-d1   # D1에서 통계 조회 후 전체 동기화 (D1 → metadata.ts → 문서)
 * pnpm sync:stats --check      # 동기화 필요 여부만 확인 (CI용)
 * ```
 */

import { execSync } from 'node:child_process';
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

// ============================================================================
// D1 Database Functions
// ============================================================================

interface D1Stats {
  entries: number;
  categories: number;
  conversations: number;
}

/**
 * Cloudflare D1에서 실제 통계 조회
 *
 * wrangler d1 execute 명령어를 사용하여 프로덕션 D1에서 직접 통계를 가져옵니다.
 */
function fetchD1Stats(): D1Stats {
  console.log('🔄 Fetching stats from Cloudflare D1...\n');

  const runD1Query = (query: string): number => {
    try {
      const result = execSync(
        `npx wrangler d1 execute context-db --remote --command "${query}" --json`,
        { cwd: ROOT_DIR, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] },
      );
      const parsed = JSON.parse(result);
      return parsed[0]?.results?.[0]?.count ?? 0;
    } catch (error) {
      console.error(`❌ D1 query failed: ${query}`);
      throw error;
    }
  };

  const entries = runD1Query('SELECT COUNT(*) as count FROM entries');
  const categories = runD1Query('SELECT COUNT(*) as count FROM categories');
  const conversations = runD1Query('SELECT COUNT(*) as count FROM conversations');

  console.log(`  D1 entries: ${entries}`);
  console.log(`  D1 categories: ${categories}`);
  console.log(`  D1 conversations: ${conversations}\n`);

  return { entries, categories, conversations };
}

/**
 * metadata.ts 파일 업데이트
 *
 * D1에서 가져온 통계로 SSoT 파일을 업데이트합니다.
 */
function updateMetadataTs(stats: D1Stats): boolean {
  const metadataPath = join(ROOT_DIR, 'packages/data/src/metadata.ts');
  let content = readFileSync(metadataPath, 'utf-8');
  const originalContent = content;

  // stats 블록 내의 값들만 업데이트 (context.stats 블록)
  content = content.replace(
    /(context:[\s\S]*?stats:\s*\{[\s\S]*?entries:\s*)\d+/,
    `$1${stats.entries}`,
  );
  content = content.replace(
    /(context:[\s\S]*?stats:\s*\{[\s\S]*?categories:\s*)\d+/,
    `$1${stats.categories}`,
  );
  content = content.replace(
    /(context:[\s\S]*?stats:\s*\{[\s\S]*?conversations:\s*)\d+/,
    `$1${stats.conversations}`,
  );

  if (content !== originalContent) {
    writeFileSync(metadataPath, content, 'utf-8');
    return true;
  }

  return false;
}

/**
 * Context 앱 통계 수집
 *
 * Context는 D1에서 데이터를 가져오므로, SSoT 파일(packages/data/src/metadata.ts)에서 값을 읽습니다.
 * D1 데이터 변경 시 --fetch-d1 플래그를 사용하거나 metadata.ts를 먼저 업데이트하세요.
 */
function getContextStats(): AppStats {
  // SSoT: packages/data/src/metadata.ts에서 값 읽기
  const metadataPath = join(ROOT_DIR, 'packages/data/src/metadata.ts');
  const metadataContent = readFileSync(metadataPath, 'utf-8');

  // entries: 16836 형식에서 추출
  const entriesMatch = metadataContent.match(/entries:\s*(\d+)/);
  const entries = entriesMatch ? Number(entriesMatch[1]) : 0;

  // categories: 52 형식에서 추출
  const categoriesMatch = metadataContent.match(/categories:\s*(\d+)/);
  const categories = categoriesMatch ? Number(categoriesMatch[1]) : 0;

  // conversations: 53 형식에서 추출
  const conversationsMatch = metadataContent.match(/conversations:\s*(\d+)/);
  const conversations = conversationsMatch ? Number(conversationsMatch[1]) : 0;

  // 라우트 계산: (entries * 2) + (categories * 2) + (conversations_categories * 2) + static
  // conversation categories는 약 7개로 고정 (대화 카테고리 수)
  const staticRoutes = 8;
  const conversationCategories = 7; // greetings, food, shopping, directions, emergencies, etc.
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
 * Permissive 앱 통계 수집.
 * SSoT는 apps/permissive/app/data/*.ts (TypeScript in-memory).
 * dynamic import는 빌드 부담이 크므로, 정규식으로 라이브러리/Web API
 * 항목을 카운트합니다.
 */
function getPermissiveStats() {
  const libraryOrderFile = join(
    ROOT_DIR,
    'apps/permissive/app/data/libraries/library-order.ts',
  );
  const webApisFile = join(ROOT_DIR, 'apps/permissive/app/data/web-apis.ts');

  const libraries = countTsArrayItems(libraryOrderFile, /^ {2}'[^']+',?$/gm);
  let webApis = 0;

  if (existsSync(webApisFile)) {
    const content = readFileSync(webApisFile, 'utf-8');
    const matches = content.match(/^ {4}name: '/gm);
    webApis = matches ? matches.length : 0;
  }

  // 라우트: 정적 페이지만 (홈, libraries, web-api, tags, built-with x EN/KO + 404)
  const routes = 9;

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
  const entriesFormatted = stats.context.entries.toLocaleString();
  return [
    // 엔트리 수 테이블 (| 엔트리 수 | 16,836 entries + 52 categories |)
    {
      pattern: /\| 엔트리 수 \| [\d,]+ entries \+ \d+ categories \|/g,
      replacement: `| 엔트리 수 | ${entriesFormatted} entries + ${stats.context.categories} categories |`,
    },
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
 * ARCHITECTURE.md 업데이트를 위한 치환 규칙 생성
 */
function getArchitectureMdReplacements(stats: AllStats): Replacement[] {
  return [
    // Context entries in table (| **Context** | **SSR** | 16836 entries | Cloudflare D1 |)
    {
      pattern: /\| \*\*Context\*\* \| \*\*SSR\*\* \| \d+ entries \| Cloudflare D1 \|/g,
      replacement: `| **Context** | **SSR** | ${stats.context.entries} entries | Cloudflare D1 |`,
    },
  ];
}

/**
 * apps/context/README.md 업데이트를 위한 치환 규칙 생성
 */
function getContextReadmeReplacements(stats: AllStats): Replacement[] {
  const entries = stats.context.entries;
  const categories = stats.context.categories;
  const conversations = stats.context.conversations;
  const ssg = stats.context.routes;
  const enRoutes = Math.floor(ssg / 2);
  const koRoutes = ssg - enRoutes;

  return [
    // Entries Badge (Entries-16836-blue)
    {
      pattern: /Entries-\d+-blue/g,
      replacement: `Entries-${entries}-blue`,
    },
    // Routes Badge
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
    // D1 Database entries rows (├── entries (16836 rows))
    {
      pattern: /├── entries \(\d+ rows\)/g,
      replacement: `├── entries (${entries} rows)`,
    },
    // D1 Database categories rows
    {
      pattern: /├── categories \(\d+ rows\)/g,
      replacement: `├── categories (${categories} rows)`,
    },
    // D1 Database conversations rows
    {
      pattern: /└── conversations \(\d+ rows\)/g,
      replacement: `└── conversations (${conversations} rows)`,
    },
    // Route table entry count
    {
      pattern: /\| `\/entry\/:entryId` \| ✓ \| ✓ \| \d+ \| Word entry page \|/g,
      replacement: `| \`/entry/:entryId\` | ✓ | ✓ | ${entries} | Word entry page |`,
    },
    // Data summary line (**Data:** 16836 entries + 25 categories)
    {
      pattern: /\*\*Data:\*\* \d+ entries \+ \d+ categories/g,
      replacement: `**Data:** ${entries} entries + ${categories} categories`,
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
  const shouldFetchD1 = process.argv.includes('--fetch-d1');

  // --fetch-d1: D1에서 통계를 가져와 metadata.ts 업데이트
  if (shouldFetchD1) {
    console.log('🗄️  Fetching stats from Cloudflare D1 (production)...\n');

    const d1Stats = fetchD1Stats();
    const metadataUpdated = updateMetadataTs(d1Stats);

    if (metadataUpdated) {
      console.log('✅ packages/data/src/metadata.ts updated with D1 stats\n');
    } else {
      console.log('ℹ️  packages/data/src/metadata.ts already in sync with D1\n');
    }
  }

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

  if (isCheckOnly) {
    console.log('\n🔍 Check mode: verifying docs are in sync...');

    const mismatches: string[] = [];

    // README.md 검증
    const readmePath = join(ROOT_DIR, 'README.md');
    const readmeContent = readFileSync(readmePath, 'utf-8');

    // Context entries 검증
    const contextEntriesMatch = readmeContent.match(/\| \*\*Features\*\* \| (\d+) entries/);
    if (contextEntriesMatch && Number(contextEntriesMatch[1]) !== stats.context.entries) {
      mismatches.push(
        `README.md: Context entries (${contextEntriesMatch[1]} → ${stats.context.entries})`,
      );
    }

    // metadata.json 검증
    const metadataPath = join(ROOT_DIR, 'docs/docs-site/src/data/metadata.json');
    let metadataContent: string | undefined;
    try {
      metadataContent = readFileSync(metadataPath, 'utf-8');
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
        throw error;
      }
    }
    if (metadataContent) {
      const metadata = JSON.parse(metadataContent);

      if (metadata.apps.context.entries !== stats.context.entries) {
        mismatches.push(
          `metadata.json: Context entries (${metadata.apps.context.entries} → ${stats.context.entries})`,
        );
      }
      if (metadata.apps.context.categories !== stats.context.categories) {
        mismatches.push(
          `metadata.json: Context categories (${metadata.apps.context.categories} → ${stats.context.categories})`,
        );
      }
      if (metadata.apps.roots.concepts !== stats.roots.concepts) {
        mismatches.push(
          `metadata.json: Roots concepts (${metadata.apps.roots.concepts} → ${stats.roots.concepts})`,
        );
      }
      if (metadata.apps.permissive.libraries !== stats.permissive.libraries) {
        mismatches.push(
          `metadata.json: Permissive libraries (${metadata.apps.permissive.libraries} → ${stats.permissive.libraries})`,
        );
      }
    }

    if (mismatches.length > 0) {
      console.log('\n❌ Found mismatches:\n');
      for (const mismatch of mismatches) {
        console.log(`  - ${mismatch}`);
      }
      console.log('\nRun `pnpm sync:stats` to fix these issues.\n');
      process.exit(1);
    }

    console.log('✅ All documentation is in sync with data sources.\n');
    process.exit(0);
  }

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

  // 문서 업데이트
  console.log('\n📝 Updating documentation...\n');

  const readmePath = join(ROOT_DIR, 'README.md');
  const claudeMdPath = join(ROOT_DIR, 'CLAUDE.md');
  const architectureMdPath = join(ROOT_DIR, 'ARCHITECTURE.md');
  const contextReadmePath = join(ROOT_DIR, 'apps/context/README.md');
  const rootsReadmePath = join(ROOT_DIR, 'apps/roots/README.md');
  const permissiveReadmePath = join(ROOT_DIR, 'apps/permissive/README.md');

  const readmeUpdated = updateFile(readmePath, getReadmeReplacements(stats));
  const claudeMdUpdated = updateFile(claudeMdPath, getClaudeMdReplacements(stats));
  const architectureMdUpdated = updateFile(
    architectureMdPath,
    getArchitectureMdReplacements(stats),
  );
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

  if (architectureMdUpdated) {
    console.log('✅ ARCHITECTURE.md updated');
  } else {
    console.log('ℹ️  ARCHITECTURE.md already in sync');
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

  // GitHub Pages metadata.json 업데이트
  const metadataJsonPath = join(ROOT_DIR, 'docs/docs-site/src/data/metadata.json');
  const metadataUpdated = updateMetadataJson(metadataJsonPath, stats);
  if (metadataUpdated) {
    console.log('✅ docs/docs-site/src/data/metadata.json updated');
  } else {
    console.log('ℹ️  docs/docs-site/src/data/metadata.json already in sync');
  }

  console.log('\n✨ Stats sync complete!');
}

/**
 * GitHub Pages metadata.json 업데이트
 */
function updateMetadataJson(filePath: string, stats: AllStats): boolean {
  if (!existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return false;
  }

  const content = readFileSync(filePath, 'utf-8');
  const metadata = JSON.parse(content);
  const originalContent = JSON.stringify(metadata, null, 2);

  // Context 통계 업데이트
  metadata.apps.context.entries = stats.context.entries;
  metadata.apps.context.categories = stats.context.categories;
  metadata.apps.context.conversations = stats.context.conversations;

  // Permissive 통계 업데이트
  metadata.apps.permissive.libraries = stats.permissive.libraries;
  metadata.apps.permissive.webAPIs = stats.permissive.webApis;

  // Roots 통계 업데이트
  metadata.apps.roots.concepts = stats.roots.concepts;
  metadata.apps.roots.fields = stats.roots.fields;

  // i18n.appDetails.context 업데이트
  if (metadata.i18n?.appDetails?.context) {
    const entries = stats.context.entries.toLocaleString();
    const categories = stats.context.categories;
    const conversations = stats.context.conversations;

    // description 업데이트
    if (metadata.i18n.appDetails.context.description) {
      metadata.i18n.appDetails.context.description.en = `${entries} entries served via SSR + Cloudflare D1 with context-based definitions, examples, and related expressions. Supports both English and Korean UI.`;
      metadata.i18n.appDetails.context.description.ko = `맥락 기반 정의, 예문, 관련 표현이 포함된 ${entries}개 엔트리를 SSR + Cloudflare D1로 제공. 영어와 한국어 UI 지원.`;
      metadata.i18n.appDetails.context.description.ja = `文脈ベースの定義、例文、関連表現を含む${entries}エントリをSSR + Cloudflare D1で提供。英語と韓国語UIをサポート。`;
    }

    // features 업데이트
    if (metadata.i18n.appDetails.context.features) {
      metadata.i18n.appDetails.context.features.en = [
        `${entries} dictionary entries`,
        `${categories} categories`,
        `${conversations} example conversations`,
      ];
      metadata.i18n.appDetails.context.features.ko = [
        `${entries}개 사전 항목`,
        `${categories}개 카테고리`,
        `${conversations}개 예문 대화`,
      ];
      metadata.i18n.appDetails.context.features.ja = [
        `${entries}辞書エントリ`,
        `${categories}カテゴリ`,
        `${conversations}例文会話`,
      ];
    }
  }

  const newContent = `${JSON.stringify(metadata, null, 2)}\n`;

  if (newContent !== `${originalContent}\n` && newContent !== originalContent) {
    writeFileSync(filePath, newContent, 'utf-8');
    return true;
  }

  return false;
}

main();
