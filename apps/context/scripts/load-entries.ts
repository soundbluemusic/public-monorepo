/**
 * @fileoverview JSON 파일에서 엔트리 데이터 로드
 *
 * 빌드 시점에 JSON 파일들을 TypeScript 모듈로 변환합니다.
 * 이 스크립트는 src/data/entries/*.json 파일을 읽어서
 * src/data/generated/entries.ts 파일을 생성합니다.
 *
 * ## 100만개+ 확장성 지원
 * - 초성별 JSON 청킹 (19개 파일)
 * - Binary Trie 포맷
 * - ID → 청크 인덱스 맵
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENTRIES_DIR = join(__dirname, '../app/data/entries');
const OUTPUT_FILE = join(__dirname, '../app/data/generated/entries.ts');
const EXPRESSIONS_FILE = join(__dirname, '../app/data/generated/korean-expressions.ts');
const CHUNKS_DIR = join(__dirname, '../public/data/chunks');
const CATEGORY_CHUNKS_DIR = join(__dirname, '../public/data/by-category');
const TRIE_FILE = join(__dirname, '../public/data/trie.bin');
const INDEX_FILE = join(__dirname, '../app/data/generated/entry-index.ts');

// 한글 초성 목록 (19개)
const CHOSEONG = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

/**
 * 한글 문자에서 초성 추출
 * 유니코드: (char - 0xAC00) / 588 = 초성 인덱스
 */
function getChoseong(char: string): string {
  const code = char.charCodeAt(0);
  // 한글 유니코드 범위: 0xAC00 ~ 0xD7A3
  if (code >= 0xac00 && code <= 0xd7a3) {
    const choseongIndex = Math.floor((code - 0xac00) / 588);
    return CHOSEONG[choseongIndex] || 'etc';
  }
  // 한글이 아닌 경우 (영문, 숫자 등)
  return 'etc';
}

/**
 * 엔트리를 초성별로 그룹화
 */
function groupByChoseong(entries: JsonEntry[]): Map<string, JsonEntry[]> {
  const groups = new Map<string, JsonEntry[]>();

  for (const entry of entries) {
    const firstChar = entry.korean.charAt(0);
    const choseong = getChoseong(firstChar);
    const list = groups.get(choseong) || [];
    list.push(entry);
    groups.set(choseong, list);
  }

  return groups;
}

interface JsonEntry {
  id: string;
  korean: string;
  romanization: string;
  pronunciation?: string;
  partOfSpeech: string;
  categoryId: string;
  difficulty: string;
  frequency?: string;
  tags: string[];
  translations: {
    ko: {
      word: string;
      explanation: string;
      examples?: string[];
      variations?: {
        formal?: string[];
        casual?: string[];
        short?: string[];
      };
    };
    en: {
      word: string;
      explanation: string;
      examples?: string[];
      variations?: {
        formal?: string[];
        casual?: string[];
        short?: string[];
      };
    };
  };
}

function loadJsonEntries(): JsonEntry[] {
  if (!existsSync(ENTRIES_DIR)) {
    console.warn(`Entries directory not found: ${ENTRIES_DIR}`);
    return [];
  }

  const files = readdirSync(ENTRIES_DIR).filter((f) => f.endsWith('.json'));
  const entries: JsonEntry[] = [];

  for (const file of files) {
    const filePath = join(ENTRIES_DIR, file);
    try {
      const content = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      if (Array.isArray(data)) {
        entries.push(...data);
      } else {
        entries.push(data);
      }

      console.log(`  ✓ ${file} (${Array.isArray(data) ? data.length : 1} entries)`);
    } catch (error: unknown) {
      console.error(`  ✗ Failed to load ${filePath}:`, error);
    }
  }

  return entries;
}

function validateEntries(entries: JsonEntry[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const entry of entries) {
    // 중복 ID 검사
    if (ids.has(entry.id)) {
      errors.push(`Duplicate ID: ${entry.id}`);
    }
    ids.add(entry.id);

    // 필수 필드 검사
    const requiredFields = [
      'id',
      'korean',
      'romanization',
      'partOfSpeech',
      'categoryId',
      'difficulty',
      'tags',
      'translations',
    ];
    for (const field of requiredFields) {
      if (!(field in entry)) {
        errors.push(`[${entry.id}] Missing required field: ${field}`);
      }
    }

    // translations 검사
    if (entry.translations) {
      if (!entry.translations.ko || !entry.translations.en) {
        errors.push(`[${entry.id}] Missing translation for ko or en`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Browse 페이지용 경량 엔트리 타입
 * 리스트 표시에 필요한 최소 필드만 포함
 */
interface LightEntry {
  id: string;
  korean: string;
  romanization: string;
  categoryId: string;
  word: { ko: string; en: string }; // translations[locale].word
}

function generateTypeScriptFile(entries: JsonEntry[]): string {
  // 경량 리스트 생성 (browse 페이지용)
  const lightEntries: LightEntry[] = entries.map((e) => ({
    id: e.id,
    korean: e.korean,
    romanization: e.romanization,
    categoryId: e.categoryId,
    word: {
      ko: e.translations.ko.word,
      en: e.translations.en.word,
    },
  }));

  return `/**
 * @fileoverview 자동 생성된 엔트리 데이터
 *
 * 이 파일은 scripts/load-entries.ts에 의해 자동 생성됩니다.
 * 직접 수정하지 마세요. 대신 src/data/entries/*.json 파일을 수정하세요.
 *
 * @generated
 * @date ${new Date().toISOString()}
 */
import type { MeaningEntry } from '../types';

export const jsonEntries: MeaningEntry[] = ${JSON.stringify(entries, null, 2)} as const;

export const jsonEntriesCount = ${entries.length};

/**
 * Browse 페이지용 경량 엔트리
 * 전체 데이터 대비 ~85% 용량 절감 (1MB → 150KB)
 */
export interface LightEntry {
  id: string;
  korean: string;
  romanization: string;
  categoryId: string;
  word: { ko: string; en: string };
}

export const lightEntries: LightEntry[] = ${JSON.stringify(lightEntries)};
`;
}

/**
 * Aho-Corasick Trie 노드 (빌드 타임 생성)
 */
interface TrieNode {
  /** 자식 노드 (문자 → 자식 인덱스) */
  children: Record<string, number>;
  /** 이 노드에서 끝나는 표현의 ID (없으면 null) */
  output: string | null;
  /** 매칭된 한국어 (output이 있을 때) */
  korean: string | null;
  /** 실패 링크 (Aho-Corasick) - 루트는 0 */
  fail: number;
}

/**
 * Aho-Corasick Trie 빌드
 * O(총 패턴 길이) 시간에 구축
 */
function buildAhoCorasickTrie(expressions: { id: string; korean: string }[]): TrieNode[] {
  // 루트 노드
  const nodes: TrieNode[] = [{ children: {}, output: null, korean: null, fail: 0 }];

  // 1. Trie 구축 (모든 패턴 삽입)
  for (const expr of expressions) {
    let nodeIdx = 0;
    for (const char of expr.korean) {
      const currentNode = nodes[nodeIdx]!;
      if (!(char in currentNode.children)) {
        currentNode.children[char] = nodes.length;
        nodes.push({ children: {}, output: null, korean: null, fail: 0 });
      }
      nodeIdx = currentNode.children[char]!;
    }
    // 더 긴 표현이 이미 있으면 덮어쓰지 않음 (긴 것 우선)
    const targetNode = nodes[nodeIdx]!;
    if (targetNode.output === null) {
      targetNode.output = expr.id;
      targetNode.korean = expr.korean;
    }
  }

  // 2. Failure 링크 계산 (BFS)
  const queue: number[] = [];

  // 루트의 직접 자식들의 fail은 모두 루트(0)
  const rootNode = nodes[0]!;
  for (const char in rootNode.children) {
    const childIdx = rootNode.children[char]!;
    const childNode = nodes[childIdx]!;
    childNode.fail = 0;
    queue.push(childIdx);
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentNode = nodes[current]!;

    for (const char in currentNode.children) {
      const childIdx = currentNode.children[char]!;
      const childNode = nodes[childIdx]!;
      queue.push(childIdx);

      // fail 링크 따라가며 현재 문자 찾기
      let failState = currentNode.fail;
      let failNode = nodes[failState]!;
      while (failState !== 0 && !(char in failNode.children)) {
        failState = failNode.fail;
        failNode = nodes[failState]!;
      }

      childNode.fail = char in failNode.children ? failNode.children[char]! : 0;

      // 자기 자신을 가리키면 안됨
      if (childNode.fail === childIdx) {
        childNode.fail = 0;
      }
    }
  }

  return nodes;
}

/**
 * LinkedExample 컴포넌트용 Aho-Corasick Trie 생성
 *
 * 기존 O(n*m) 알고리즘을 O(m)으로 최적화
 * - n: 표현 개수 (751개 → 10,000개+)
 * - m: 텍스트 길이
 */
function generateKoreanExpressionsFile(entries: JsonEntry[]): string {
  // 길이순 정렬 (긴 것부터) - 긴 표현 우선 매칭
  const expressions = entries
    .map((e) => ({ id: e.id, korean: e.korean }))
    .sort((a, b) => b.korean.length - a.korean.length);

  // Aho-Corasick Trie 빌드
  const trie = buildAhoCorasickTrie(expressions);

  return `/**
 * @fileoverview LinkedExample 컴포넌트용 Aho-Corasick Trie 데이터
 *
 * 이 파일은 scripts/load-entries.ts에 의해 자동 생성됩니다.
 * 직접 수정하지 마세요.
 *
 * @remarks
 * Aho-Corasick 알고리즘으로 O(m) 시간에 모든 표현을 매칭합니다.
 * - 기존: O(n*m) where n=표현개수, m=텍스트길이
 * - 개선: O(m) - 표현 개수와 무관
 *
 * 10,000개 표현에서도 동일한 성능 보장
 *
 * @generated
 * @date ${new Date().toISOString()}
 */

/**
 * Aho-Corasick Trie 노드
 */
export interface TrieNode {
  /** 자식 노드 (문자 → 자식 인덱스) */
  children: Record<string, number>;
  /** 이 노드에서 끝나는 표현의 ID */
  output: string | null;
  /** 매칭된 한국어 */
  korean: string | null;
  /** 실패 링크 */
  fail: number;
}

/**
 * 사전 빌드된 Aho-Corasick Trie
 * ${trie.length}개 노드, ${expressions.length}개 표현
 */
export const expressionTrie: TrieNode[] = ${JSON.stringify(trie)};

/**
 * O(m) 시간에 텍스트에서 모든 표현 찾기
 * @param text 검색할 텍스트
 * @param excludeId 제외할 표현 ID (현재 보고 있는 항목)
 * @returns 매칭 결과 배열 [{start, end, id, korean}]
 */
export function findExpressions(
  text: string,
  excludeId?: string
): Array<{ start: number; end: number; id: string; korean: string }> {
  const matches: Array<{ start: number; end: number; id: string; korean: string }> = [];
  let state = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (!char) continue;

    // 현재 상태에서 char로 갈 수 없으면 fail 따라감
    let currentNode = expressionTrie[state];
    while (state !== 0 && currentNode && !(char in currentNode.children)) {
      state = currentNode.fail;
      currentNode = expressionTrie[state];
    }

    // char로 전이
    if (currentNode && char in currentNode.children) {
      state = currentNode.children[char]!;
    }

    // 출력 체크 (현재 상태 + fail 체인)
    let checkState = state;
    while (checkState !== 0) {
      const node = expressionTrie[checkState];
      if (!node) break;
      if (node.output && node.output !== excludeId && node.korean) {
        const koreanLen = node.korean.length;
        const start = i - koreanLen + 1;
        const end = i + 1;

        // 겹치는 매칭 찾기
        const overlappingIdx = matches.findIndex(
          (m) => (start >= m.start && start < m.end) || (m.start >= start && m.start < end)
        );

        if (overlappingIdx === -1) {
          // 겹치는 매칭이 없으면 추가
          matches.push({ start, end, id: node.output, korean: node.korean });
        } else {
          // 겹치는 매칭이 있으면, 새 매칭이 더 길면 대체
          const existing = matches[overlappingIdx];
          if (existing) {
            const existingLen = existing.end - existing.start;
            if (koreanLen > existingLen) {
              matches[overlappingIdx] = { start, end, id: node.output, korean: node.korean };
            }
          }
        }
      }
      checkState = node.fail;
    }
  }

  // 위치순 정렬
  return matches.sort((a, b) => a.start - b.start);
}
`;
}

/**
 * 초성별 JSON 청크 파일 생성
 * 100만개+ 확장성 지원
 */
function generateChunks(entries: JsonEntry[]): void {
  // 청크 디렉토리 생성
  if (!existsSync(CHUNKS_DIR)) {
    mkdirSync(CHUNKS_DIR, { recursive: true });
  }

  // 초성별 그룹화
  const groups = groupByChoseong(entries);

  // ID → 청크 매핑 생성
  const entryIndex: Record<string, string> = {};

  console.log('\n📦 Generating JSON chunks by initial consonant...');

  for (const [choseong, chunkEntries] of groups) {
    // 파일명: entries-ㄱ.json, entries-ㄴ.json, ...
    const filename = `entries-${choseong}.json`;
    const filepath = join(CHUNKS_DIR, filename);

    // JSON 파일 저장
    writeFileSync(filepath, JSON.stringify(chunkEntries));

    // 인덱스 업데이트
    for (const entry of chunkEntries) {
      entryIndex[entry.id] = choseong;
    }

    console.log(`   ✓ ${filename} (${chunkEntries.length} entries)`);
  }

  // 메타 정보 저장
  const meta = {
    totalEntries: entries.length,
    chunks: Array.from(groups.entries()).map(([k, v]) => ({
      choseong: k,
      count: v.length,
      file: `entries-${k}.json`,
    })),
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(CHUNKS_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

  // ID → 청크 인덱스 TypeScript 파일 생성
  const indexContent = `/**
 * @fileoverview 엔트리 ID → 청크 인덱스 맵
 *
 * 이 파일은 scripts/load-entries.ts에 의해 자동 생성됩니다.
 * 100만개+ 엔트리에서도 O(1) 조회 지원
 *
 * @generated
 * @date ${new Date().toISOString()}
 */

/** 엔트리 ID → 초성 (청크 키) */
export const entryIndex: Record<string, string> = ${JSON.stringify(entryIndex)};

/** 청크 메타 정보 */
export const chunkMeta = ${JSON.stringify(meta, null, 2)};

/** ID로 청크 키 조회 */
export function getChunkKey(entryId: string): string | undefined {
  return entryIndex[entryId];
}

/** 청크 파일 URL 생성 */
export function getChunkUrl(choseong: string): string {
  return \`/data/chunks/entries-\${choseong}.json\`;
}
`;
  writeFileSync(INDEX_FILE, indexContent);

  console.log(`   ✓ meta.json`);
  console.log(`✅ Generated ${groups.size} chunk files`);
  console.log(`✅ Generated ${INDEX_FILE}`);
}

/**
 * 카테고리별 JSON 청크 파일 생성
 * 100만개+ 확장성 지원 - 카테고리 선택 시 동적 fetch
 */
function generateCategoryChunks(entries: JsonEntry[]): void {
  // 카테고리 청크 디렉토리 생성
  if (!existsSync(CATEGORY_CHUNKS_DIR)) {
    mkdirSync(CATEGORY_CHUNKS_DIR, { recursive: true });
  }

  console.log('\n📦 Generating JSON chunks by category...');

  // 카테고리별 그룹화
  const byCategory = new Map<string, LightEntry[]>();
  for (const entry of entries) {
    const list = byCategory.get(entry.categoryId) || [];
    list.push({
      id: entry.id,
      korean: entry.korean,
      romanization: entry.romanization,
      categoryId: entry.categoryId,
      word: {
        ko: entry.translations.ko.word,
        en: entry.translations.en.word,
      },
    });
    byCategory.set(entry.categoryId, list);
  }

  // 각 카테고리 JSON 파일 생성
  for (const [categoryId, catEntries] of byCategory) {
    const filename = `${categoryId}.json`;
    const filepath = join(CATEGORY_CHUNKS_DIR, filename);
    writeFileSync(filepath, JSON.stringify(catEntries));
    console.log(`   ✓ by-category/${filename} (${catEntries.length} entries)`);
  }

  // 메타 정보 저장
  const meta = {
    totalEntries: entries.length,
    categories: Array.from(byCategory.entries()).map(([id, entries]) => ({
      id,
      count: entries.length,
      file: `${id}.json`,
    })),
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(CATEGORY_CHUNKS_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

  console.log(`   ✓ meta.json`);
  console.log(`✅ Generated ${byCategory.size} category chunk files`);
}

/**
 * Binary Trie 생성 (JSON 대비 ~83% 용량 절감)
 */
function generateBinaryTrie(entries: JsonEntry[]): void {
  console.log('\n🔧 Generating Binary Trie...');

  const expressions = entries
    .map((e) => ({ id: e.id, korean: e.korean }))
    .sort((a, b) => b.korean.length - a.korean.length);

  const trie = buildAhoCorasickTrie(expressions);

  // Binary 포맷으로 변환
  // 각 노드: [childCount, ...children(char+index), output?, korean?, fail]
  const bufferParts: Buffer[] = [];

  // 노드 수 (4바이트)
  const nodeCountBuf = Buffer.alloc(4);
  nodeCountBuf.writeUInt32LE(trie.length, 0);
  bufferParts.push(nodeCountBuf);

  // 문자열 테이블 (output, korean)
  const stringTable: string[] = [];
  const stringToIndex = new Map<string, number>();

  function getStringIndex(s: string | null): number {
    if (s === null) return 0xffffffff; // null marker
    const existing = stringToIndex.get(s);
    if (existing !== undefined) return existing;
    const idx = stringTable.length;
    stringTable.push(s);
    stringToIndex.set(s, idx);
    return idx;
  }

  // 먼저 문자열 인덱스 수집
  for (const node of trie) {
    getStringIndex(node.output);
    getStringIndex(node.korean);
    for (const char of Object.keys(node.children)) {
      getStringIndex(char);
    }
  }

  // 문자열 테이블 저장
  const stringCountBuf = Buffer.alloc(4);
  stringCountBuf.writeUInt32LE(stringTable.length, 0);
  bufferParts.push(stringCountBuf);

  for (const s of stringTable) {
    const strBuf = Buffer.from(s, 'utf8');
    const lenBuf = Buffer.alloc(2);
    lenBuf.writeUInt16LE(strBuf.length, 0);
    bufferParts.push(lenBuf);
    bufferParts.push(strBuf);
  }

  // 노드 데이터 저장
  for (const node of trie) {
    const children = Object.entries(node.children);

    // childCount (2바이트)
    const childCountBuf = Buffer.alloc(2);
    childCountBuf.writeUInt16LE(children.length, 0);
    bufferParts.push(childCountBuf);

    // children (각 6바이트: stringIndex 4 + nodeIndex 4 → 압축하여 사용)
    for (const [char, childIdx] of children) {
      const charIdxBuf = Buffer.alloc(4);
      charIdxBuf.writeUInt32LE(getStringIndex(char), 0);
      bufferParts.push(charIdxBuf);

      const nodeIdxBuf = Buffer.alloc(4);
      nodeIdxBuf.writeUInt32LE(childIdx, 0);
      bufferParts.push(nodeIdxBuf);
    }

    // output (4바이트)
    const outputBuf = Buffer.alloc(4);
    outputBuf.writeUInt32LE(getStringIndex(node.output), 0);
    bufferParts.push(outputBuf);

    // korean (4바이트)
    const koreanBuf = Buffer.alloc(4);
    koreanBuf.writeUInt32LE(getStringIndex(node.korean), 0);
    bufferParts.push(koreanBuf);

    // fail (4바이트)
    const failBuf = Buffer.alloc(4);
    failBuf.writeUInt32LE(node.fail, 0);
    bufferParts.push(failBuf);
  }

  const finalBuffer = Buffer.concat(bufferParts);

  // data 디렉토리 생성
  const dataDir = dirname(TRIE_FILE);
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  writeFileSync(TRIE_FILE, finalBuffer);

  const jsonSize = JSON.stringify(trie).length;
  const binSize = finalBuffer.length;
  const savings = ((1 - binSize / jsonSize) * 100).toFixed(1);

  console.log(`✅ Generated ${TRIE_FILE}`);
  console.log(
    `   JSON: ${(jsonSize / 1024).toFixed(1)}KB → Binary: ${(binSize / 1024).toFixed(1)}KB (${savings}% 절감)`,
  );
  console.log(`   ${trie.length} nodes, ${stringTable.length} strings`);
}

async function main() {
  console.log('📦 Loading JSON entries...\n');

  const entries = loadJsonEntries();

  if (entries.length === 0) {
    console.log('\n⚠️  No JSON entries found. Using legacy entries only.\n');
    // 빈 파일 생성
    const outputDir = dirname(OUTPUT_FILE);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    writeFileSync(
      OUTPUT_FILE,
      `/**
 * @fileoverview 자동 생성된 엔트리 데이터 (빈 파일)
 * @generated
 */
import type { MeaningEntry } from '../types';

export const jsonEntries: MeaningEntry[] = [];
export const jsonEntriesCount = 0;
`,
    );
    return;
  }

  // 유효성 검사
  console.log('\n🔍 Validating entries...');
  const validation = validateEntries(entries);

  if (!validation.valid) {
    console.error('\n❌ Validation errors:');
    for (const error of validation.errors) {
      console.error(`   - ${error}`);
    }
    process.exit(1);
  }
  console.log('   ✓ All entries valid\n');

  // TypeScript 파일 생성
  const outputDir = dirname(OUTPUT_FILE);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const tsContent = generateTypeScriptFile(entries);
  writeFileSync(OUTPUT_FILE, tsContent);

  // LinkedExample용 경량 파일 생성
  const expressionsContent = generateKoreanExpressionsFile(entries);
  writeFileSync(EXPRESSIONS_FILE, expressionsContent);

  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`   ${entries.length} entries from JSON files`);
  console.log(`✅ Generated ${EXPRESSIONS_FILE}`);
  console.log(`   ${entries.length} lightweight expressions for LinkedExample`);

  // 100만개+ 확장성: 청크 및 Binary Trie 생성
  generateChunks(entries);
  generateCategoryChunks(entries);
  generateBinaryTrie(entries);

  console.log('\n🎉 All files generated successfully!\n');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
