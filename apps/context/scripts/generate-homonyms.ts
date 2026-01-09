/**
 * @fileoverview 다의어(Homonym) 인덱스 생성 스크립트
 *
 * 같은 한글(korean)을 가진 서로 다른 의미의 단어들을 그룹화합니다.
 * 빌드 타임에 실행되어 homonyms.ts 파일을 생성합니다.
 *
 * ## 다의어란?
 * - 같은 발음/철자이지만 다른 의미를 가진 단어
 * - 예: 배 (ship), 배 (pear), 배 (belly)
 *
 * ## 출력 형식
 * Record<korean, Array<{id, word}>>
 *
 * Usage:
 *   pnpm tsx scripts/generate-homonyms.ts
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// generated/entries.ts에서 lightEntries 가져오기
import { type LightEntry, lightEntries } from '../app/data/generated/entries';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = join(__dirname, '../app/data/generated/homonyms.ts');

/**
 * 다의어 엔트리 정보 (경량)
 */
interface HomonymEntry {
  id: string;
  word: { ko: string; en: string };
  categoryId: string;
}

/**
 * 다의어 인덱스 타입
 * korean → 해당 korean을 가진 엔트리들
 */
type HomonymIndex = Record<string, HomonymEntry[]>;

/**
 * lightEntries에서 다의어 인덱스 생성
 *
 * 1. korean 값으로 그룹화
 * 2. 2개 이상인 그룹만 필터 (다의어 조건)
 * 3. 같은 의미 중복 제거 (word.en 기준)
 */
function buildHomonymIndex(entries: LightEntry[]): HomonymIndex {
  // 1. korean 값으로 그룹화
  const grouped = new Map<string, HomonymEntry[]>();

  for (const entry of entries) {
    const list = grouped.get(entry.korean) || [];
    list.push({
      id: entry.id,
      word: entry.word,
      categoryId: entry.categoryId,
    });
    grouped.set(entry.korean, list);
  }

  // 2. 다의어만 필터 (2개 이상)
  const homonyms: HomonymIndex = {};

  for (const [korean, entryList] of grouped) {
    if (entryList.length < 2) continue;

    // 3. 같은 의미 중복 제거 (word.en 기준으로 첫 번째만 유지)
    const uniqueByMeaning = new Map<string, HomonymEntry>();
    for (const entry of entryList) {
      const meaningKey = entry.word.en.toLowerCase();
      if (!uniqueByMeaning.has(meaningKey)) {
        uniqueByMeaning.set(meaningKey, entry);
      }
    }

    // 중복 제거 후에도 2개 이상인 경우만 다의어로 인정
    const uniqueEntries = Array.from(uniqueByMeaning.values());
    if (uniqueEntries.length >= 2) {
      homonyms[korean] = uniqueEntries;
    }
  }

  return homonyms;
}

/**
 * TypeScript 파일 생성
 */
function generateTypeScriptFile(homonyms: HomonymIndex): string {
  const count = Object.keys(homonyms).length;
  const totalEntries = Object.values(homonyms).reduce((sum, arr) => sum + arr.length, 0);

  return `/**
 * @fileoverview 다의어(Homonym) 인덱스
 *
 * 이 파일은 scripts/generate-homonyms.ts에 의해 자동 생성됩니다.
 * 직접 수정하지 마세요.
 *
 * ## 다의어 통계
 * - 다의어 단어 수: ${count}개
 * - 총 엔트리 수: ${totalEntries}개
 *
 * @generated
 */

/**
 * 다의어 엔트리 정보
 */
export interface HomonymEntry {
  /** 엔트리 ID */
  id: string;
  /** 번역 (ko/en) */
  word: { ko: string; en: string };
  /** 카테고리 ID */
  categoryId: string;
}

/**
 * 다의어 인덱스
 * korean → 해당 korean을 가진 엔트리들
 *
 * @example
 * homonymIndex['배'] = [
 *   { id: 'bae-transport', word: { ko: '배', en: 'ship' }, categoryId: 'transportation' },
 *   { id: 'd-foo-bae', word: { ko: '배', en: 'pear' }, categoryId: 'food' },
 *   { id: 'd-bod-bae', word: { ko: '배', en: 'belly' }, categoryId: 'body' },
 * ]
 */
export const homonymIndex: Record<string, HomonymEntry[]> = ${JSON.stringify(homonyms, null, 2)};

/**
 * 다의어 조회 함수
 *
 * @param korean - 한글 단어
 * @param excludeId - 제외할 엔트리 ID (현재 보고 있는 항목)
 * @returns 다의어 목록 (현재 항목 제외)
 */
export function getHomonyms(korean: string, excludeId?: string): HomonymEntry[] {
  const homonyms = homonymIndex[korean];
  if (!homonyms) return [];
  if (!excludeId) return homonyms;
  return homonyms.filter((h) => h.id !== excludeId);
}

/**
 * 다의어인지 확인
 *
 * @param korean - 한글 단어
 * @returns 다의어 여부
 */
export function isHomonym(korean: string): boolean {
  return korean in homonymIndex;
}

/**
 * 다의어 통계
 */
export const homonymStats = {
  /** 다의어 단어 수 */
  wordCount: ${count},
  /** 총 엔트리 수 */
  entryCount: ${totalEntries},
} as const;
`;
}

async function main() {
  console.log('🔤 Generating homonym index...\n');

  // 다의어 인덱스 생성
  const homonyms = buildHomonymIndex(lightEntries);

  const wordCount = Object.keys(homonyms).length;
  const entryCount = Object.values(homonyms).reduce((sum, arr) => sum + arr.length, 0);

  console.log(`   📊 Found ${wordCount} homonym words with ${entryCount} total entries`);

  // 상위 10개 예시 출력
  console.log('\n   📝 Top 10 examples:');
  const topHomonyms = Object.entries(homonyms)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10);

  for (const [korean, entries] of topHomonyms) {
    const meanings = entries.map((e) => e.word.en).join(', ');
    console.log(`      ${korean}: ${meanings}`);
  }

  // 출력 디렉토리 생성
  const outputDir = dirname(OUTPUT_FILE);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // TypeScript 파일 생성
  const content = generateTypeScriptFile(homonyms);
  writeFileSync(OUTPUT_FILE, content);

  console.log(`\n✅ Generated ${OUTPUT_FILE}`);
  console.log(`   ${wordCount} homonym words, ${entryCount} entries`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
