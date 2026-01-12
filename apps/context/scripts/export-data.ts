/**
 * @fileoverview 외부 프로젝트용 데이터 내보내기
 *
 * Context 앱의 데이터를 JSON 형식으로 data/context/에 내보냅니다.
 * 다른 프로젝트에서 raw GitHub URL로 fetch할 수 있도록 합니다.
 *
 * ## Single Source of Truth
 * - entries: data/context/entries/*.json (이미 SSoT, 복사 불필요)
 * - categories/conversations: TypeScript에서 JSON으로 내보내기
 *
 * @example
 * ```bash
 * pnpm export:data
 * ```
 *
 * 출력 파일:
 * - data/context/categories.json
 * - data/context/conversations.json
 * - data/context/meta.json
 * - data/context/context-data.zip (전체 데이터 ZIP)
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DATA_DIR = join(__dirname, '../../../data/context');

// 출력 디렉토리 생성
if (!existsSync(REPO_DATA_DIR)) {
  mkdirSync(REPO_DATA_DIR, { recursive: true });
}

const entriesDir = join(REPO_DATA_DIR, 'entries');
if (!existsSync(entriesDir)) {
  mkdirSync(entriesDir, { recursive: true });
}

console.log('📦 Exporting Context data for external use...\n');

// ============================================================================
// 1. Categories 내보내기
// ============================================================================
async function exportCategories() {
  const { categories } = await import('../app/data/categories.js');

  // 순수 데이터만 추출 (함수 제외)
  const categoriesData = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    icon: cat.icon,
    color: cat.color,
    order: cat.order,
  }));

  const outPath = join(REPO_DATA_DIR, 'categories.json');
  writeFileSync(outPath, JSON.stringify(categoriesData, null, 2));
  console.log(`  ✓ categories.json (${categoriesData.length} categories)`);
}

// ============================================================================
// 2. Conversations 내보내기
// ============================================================================
async function exportConversations() {
  const { conversations } = await import('../app/data/conversations.js');

  const outPath = join(REPO_DATA_DIR, 'conversations.json');
  writeFileSync(outPath, JSON.stringify(conversations, null, 2));
  console.log(`  ✓ conversations.json (${conversations.length} conversations)`);
}

// ============================================================================
// 3. 메타데이터 생성 (콘텐츠 변경 시에만 타임스탬프 업데이트)
// ============================================================================
async function generateMeta() {
  const { categories } = await import('../app/data/categories.js');
  const { conversations } = await import('../app/data/conversations.js');

  const files = readdirSync(entriesDir).filter((f) => f.endsWith('.json'));
  const metaPath = join(REPO_DATA_DIR, 'meta.json');

  // 새 메타데이터 (타임스탬프 제외)
  const newMetaContent = {
    version: '1.0.0',
    baseUrl: 'https://raw.githubusercontent.com/soundbluemusic/public-monorepo/main/data/context',
    files: {
      categories: 'categories.json',
      conversations: 'conversations.json',
      entries: files.map((f) => `entries/${f}`),
    },
    counts: {
      categories: categories.length,
      conversations: conversations.length,
      entryFiles: files.length,
    },
  };

  // 기존 메타데이터 읽기
  let existingTimestamp = new Date().toISOString();
  if (existsSync(metaPath)) {
    try {
      const existingMeta = JSON.parse(readFileSync(metaPath, 'utf-8'));
      // 타임스탬프 제외하고 비교
      const { generatedAt, ...existingContent } = existingMeta;

      // 콘텐츠가 동일하면 기존 타임스탬프 유지
      if (JSON.stringify(existingContent) === JSON.stringify(newMetaContent)) {
        existingTimestamp = generatedAt;
      }
    } catch {
      // 파일 읽기 실패 시 새 타임스탬프 사용
    }
  }

  const meta = {
    ...newMetaContent,
    generatedAt: existingTimestamp,
  };

  // JSON 속성 순서 보장 (generatedAt이 version 다음에 오도록)
  const orderedMeta = {
    version: meta.version,
    generatedAt: meta.generatedAt,
    baseUrl: meta.baseUrl,
    files: meta.files,
    counts: meta.counts,
  };

  writeFileSync(metaPath, JSON.stringify(orderedMeta, null, 2));
  console.log(`  ✓ meta.json`);
}

// ============================================================================
// 4. ZIP 파일 생성 (일반 사용자 다운로드용)
// ============================================================================
function generateZip() {
  const zipPath = join(REPO_DATA_DIR, 'context-data.zip');

  // 기존 ZIP 삭제
  if (existsSync(zipPath)) {
    execSync(`rm "${zipPath}"`);
  }

  // ZIP 생성 (data/context/ 디렉토리 내용 전체)
  // -j: 경로 없이 파일만, -r: 재귀적으로 폴더 포함
  try {
    execSync(
      `cd "${REPO_DATA_DIR}" && zip -r context-data.zip categories.json conversations.json meta.json entries/`,
      {
        stdio: 'pipe',
      },
    );

    const stats = statSync(zipPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`  ✓ context-data.zip (${sizeMB} MB)`);
  } catch {
    console.error('  ⚠ ZIP 생성 실패 (zip 명령어가 설치되어 있지 않을 수 있습니다)');
  }
}

// ============================================================================
// Main
// ============================================================================
async function main() {
  try {
    await exportCategories();
    await exportConversations();
    // entries는 data/context/entries/가 SSoT이므로 복사 불필요
    console.log(`  ✓ entries/*.json (SSoT: data/context/entries/)`);
    await generateMeta();
    generateZip();

    console.log('\n✅ Export complete!');
    console.log(`   Output: ${REPO_DATA_DIR}`);
    console.log(
      '\n   Raw URL: https://raw.githubusercontent.com/soundbluemusic/public-monorepo/main/data/context/',
    );
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

main();
