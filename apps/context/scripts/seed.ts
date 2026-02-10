/**
 * D1 Seed Script — JSON 데이터를 Cloudflare D1에 투입
 *
 * 사용법:
 *   pnpm seed:prod          # 프로덕션 D1에 전체 시드
 *   pnpm seed:prod --dry-run # SQL 생성만 (실행 안 함)
 *
 * 동작:
 *   1. data/context/ 의 JSON 파일을 읽음
 *   2. 50개씩 배치로 INSERT OR REPLACE SQL 생성
 *   3. wrangler d1 execute --remote --file 로 순차 실행
 */

import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── 설정 ───────────────────────────────────────────────
const DB_NAME = 'context-db';
const BATCH_SIZE = 50;
const DATA_DIR = path.resolve(import.meta.dirname, '../../../data/context');
const ENTRIES_DIR = path.join(DATA_DIR, 'entries');
const TMP_DIR = path.join(import.meta.dirname, '../.seed-tmp');

const isDryRun = process.argv.includes('--dry-run');
const isLocal = process.argv.includes('--local');
const remoteFlag = isLocal ? '' : '--remote';

// ─── 유틸리티 ──────────────────────────────────────────
function escapeSQL(value: string): string {
  return value.replace(/'/g, "''");
}

function toSQLValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'string') return `'${escapeSQL(value)}'`;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '1' : '0';
  // Arrays and objects → JSON string
  return `'${escapeSQL(JSON.stringify(value))}'`;
}

function executeSQL(filePath: string, label: string): void {
  if (isDryRun) {
    console.log(`  [DRY-RUN] ${label}: ${filePath}`);
    return;
  }
  try {
    execSync(`npx wrangler d1 execute ${DB_NAME} ${remoteFlag} --file="${filePath}"`, {
      stdio: 'pipe',
      timeout: 60_000,
    });
    console.log(`  ✅ ${label}`);
  } catch (error) {
    const stderr = (error as { stderr?: Buffer }).stderr?.toString() ?? '';
    console.error(`  ❌ ${label}`);
    // ERROR 줄만 출력
    for (const line of stderr.split('\n')) {
      if (line.includes('ERROR')) {
        console.error(`     ${line.trim()}`);
      }
    }
    process.exit(1);
  }
}

// ─── 1. Categories 시드 ─────────────────────────────────
function seedCategories(): void {
  console.log('\n📂 Categories 시드...');

  const categoriesPath = path.join(DATA_DIR, 'categories.json');
  const categories: Array<{
    id: string;
    name: { ko: string; en: string };
    description?: { ko: string; en: string };
    icon?: string;
    color?: string;
    order?: number;
  }> = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));

  const batches = chunk(categories, BATCH_SIZE);

  for (const [i, batch] of batches.entries()) {
    const statements = batch.map((cat) => {
      const values = [
        toSQLValue(cat.id),
        toSQLValue(cat.name.ko),
        toSQLValue(cat.name.en),
        toSQLValue(cat.description?.ko ?? null),
        toSQLValue(cat.description?.en ?? null),
        toSQLValue(cat.icon ?? null),
        toSQLValue(cat.color ?? null),
        toSQLValue(cat.order ?? 0),
      ].join(', ');
      return `INSERT OR REPLACE INTO categories (id, name_ko, name_en, description_ko, description_en, icon, color, sort_order) VALUES (${values});`;
    });

    const filePath = path.join(TMP_DIR, `categories_${i}.sql`);
    fs.writeFileSync(filePath, statements.join('\n'));
    executeSQL(filePath, `categories batch ${i + 1}/${batches.length} (${batch.length}개)`);
  }

  console.log(`  총 ${categories.length}개 카테고리 완료`);
}

// ─── 2. Entries 시드 ────────────────────────────────────
function seedEntries(): void {
  console.log('\n📖 Entries 시드...');

  const jsonFiles = fs.readdirSync(ENTRIES_DIR).filter((f) => f.endsWith('.json'));
  let totalEntries = 0;

  for (const file of jsonFiles) {
    const categoryName = file.replace('.json', '');
    const filePath = path.join(ENTRIES_DIR, file);
    const entries: Array<{
      id: string;
      korean: string;
      romanization?: string;
      partOfSpeech?: string;
      categoryId?: string;
      difficulty?: string;
      frequency?: string;
      tags?: string[];
      translations?: Record<string, unknown>;
    }> = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const batches = chunk(entries, BATCH_SIZE);

    for (const [i, batch] of batches.entries()) {
      const statements = batch.map((entry) => {
        const values = [
          toSQLValue(entry.id),
          toSQLValue(entry.korean),
          toSQLValue(entry.romanization ?? null),
          toSQLValue(entry.partOfSpeech ?? null),
          toSQLValue(entry.categoryId ?? categoryName),
          toSQLValue(entry.difficulty ?? null),
          toSQLValue(entry.frequency ?? null),
          toSQLValue(entry.tags ?? null),
          toSQLValue(entry.translations ?? null),
        ].join(', ');
        return `INSERT OR REPLACE INTO entries (id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations) VALUES (${values});`;
      });

      const sqlPath = path.join(TMP_DIR, `entries_${categoryName}_${i}.sql`);
      fs.writeFileSync(sqlPath, statements.join('\n'));
      executeSQL(sqlPath, `${categoryName} batch ${i + 1}/${batches.length} (${batch.length}개)`);
    }

    totalEntries += entries.length;
  }

  console.log(`  총 ${totalEntries}개 엔트리 (${jsonFiles.length}개 카테고리) 완료`);
}

// ─── 3. Conversations 시드 ──────────────────────────────
function seedConversations(): void {
  console.log('\n💬 Conversations 시드...');

  const conversationsPath = path.join(DATA_DIR, 'conversations.json');
  if (!fs.existsSync(conversationsPath)) {
    console.log('  conversations.json 없음, 건너뜀');
    return;
  }

  const conversations: Array<{
    id: string;
    categoryId?: string;
    title: { ko: string; en: string };
    dialogue: unknown;
  }> = JSON.parse(fs.readFileSync(conversationsPath, 'utf-8'));

  const batches = chunk(conversations, BATCH_SIZE);

  for (const [i, batch] of batches.entries()) {
    const statements = batch.map((conv) => {
      const values = [
        toSQLValue(conv.id),
        toSQLValue(conv.categoryId ?? null),
        toSQLValue(conv.title.ko),
        toSQLValue(conv.title.en),
        toSQLValue(conv.dialogue),
      ].join(', ');
      return `INSERT OR REPLACE INTO conversations (id, category_id, title_ko, title_en, dialogue) VALUES (${values});`;
    });

    const filePath = path.join(TMP_DIR, `conversations_${i}.sql`);
    fs.writeFileSync(filePath, statements.join('\n'));
    executeSQL(filePath, `conversations batch ${i + 1}/${batches.length} (${batch.length}개)`);
  }

  console.log(`  총 ${conversations.length}개 대화 완료`);
}

// ─── 헬퍼 ───────────────────────────────────────────────
function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// ─── 메인 ───────────────────────────────────────────────
function main(): void {
  console.log('🌱 D1 Seed Script');
  console.log(`  DB: ${DB_NAME}`);
  console.log(`  모드: ${isDryRun ? 'DRY-RUN' : isLocal ? 'LOCAL' : 'PRODUCTION'}`);
  console.log(`  배치 크기: ${BATCH_SIZE}`);
  console.log(`  데이터: ${DATA_DIR}`);

  // tmp 디렉토리 생성
  if (fs.existsSync(TMP_DIR)) {
    fs.rmSync(TMP_DIR, { recursive: true });
  }
  fs.mkdirSync(TMP_DIR, { recursive: true });

  seedCategories();
  seedEntries();
  seedConversations();

  // tmp 정리
  fs.rmSync(TMP_DIR, { recursive: true });

  console.log('\n✅ 시드 완료!');
}

main();
