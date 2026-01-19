/**
 * @fileoverview JSON 파일에서 엔트리 데이터 로드
 *
 * 빌드 시점에 JSON 파일들을 TypeScript 모듈로 변환합니다.
 * data/context/entries/*.json 파일을 읽어서
 * app/data/generated/entries.ts 파일을 생성합니다.
 *
 * ## Single Source of Truth
 * - 소스: data/context/entries/*.json (monorepo root)
 * - 출력: apps/context/app/data/generated/*.ts
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
// Single Source of Truth: data/context/entries/
const ENTRIES_DIR = join(__dirname, '../../../data/context/entries');
const OUTPUT_FILE = join(__dirname, '../app/data/generated/entries.ts');
const EXPRESSIONS_FILE = join(__dirname, '../app/data/generated/korean-expressions.ts');
const CHUNKS_DIR = join(__dirname, '../public/data/chunks');
const CATEGORY_CHUNKS_DIR = join(__dirname, '../public/data/by-category');
const TRIE_FILE = join(__dirname, '../public/data/trie.bin');
const TRIE_JSON_FILE = join(__dirname, '../public/data/expression-trie.json');
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

interface DialogueLine {
  speaker: 'A' | 'B';
  text: string;
  romanization: string;
  translation: string;
}

interface EntryDialogue {
  context: string;
  dialogue: DialogueLine[];
}

interface Examples {
  beginner: string;
  intermediate: string;
  advanced: string;
  master?: string;
}

interface JsonEntry {
  id: string;
  korean: string;
  romanization: string;
  pronunciation?: { korean: string; ipa?: string };
  partOfSpeech: string;
  categoryId: string;
  difficulty: string;
  frequency?: string;
  tags: string[];
  /** colors 카테고리 전용: 색상 코드 (hex) */
  colorCode?: string;
  translations: {
    ko: {
      word: string;
      explanation: string;
      examples?: Examples;
      dialogue?: EntryDialogue;
      variations?: {
        formal?: string[];
        casual?: string[];
        short?: string[];
      };
    };
    en: {
      word: string;
      explanation: string;
      examples?: Examples;
      dialogue?: EntryDialogue;
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
      const data: JsonEntry | JsonEntry[] = JSON.parse(content);

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

  // 번들 최적화: 전체 데이터는 카테고리별 청크에서 로드
  // jsonEntries 제거로 50MB → ~1MB 절감
  return `/**
 * @fileoverview 자동 생성된 엔트리 데이터 (경량 버전)
 *
 * 이 파일은 scripts/load-entries.ts에 의해 자동 생성됩니다.
 * 직접 수정하지 마세요. 대신 src/data/entries/*.json 파일을 수정하세요.
 *
 * ## 번들 최적화
 * - 전체 MeaningEntry 데이터는 /public/data/by-category-full/*.json에서 동적 로드
 * - 이 파일에는 경량 LightEntry만 포함 (browse 페이지용)
 *
 * @generated
 * @date 2024-01-01T00:00:00.000Z
 */

export const jsonEntriesCount = ${entries.length};

/**
 * Browse 페이지용 경량 엔트리
 * 전체 데이터 대비 ~95% 용량 절감
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
  /** 이 노드에서 끝나는 표현의 ID들 (동음이의어 지원, 없으면 null) */
  output: string[] | null;
  /** 매칭된 한국어 (output이 있을 때) */
  korean: string | null;
  /** 실패 링크 (Aho-Corasick) - 루트는 0 */
  fail: number;
}

/**
 * Aho-Corasick Trie 빌드
 * O(총 패턴 길이) 시간에 구축
 * 동음이의어 지원: 같은 korean에 여러 ID 저장
 */
function buildAhoCorasickTrie(expressions: { id: string; korean: string }[]): TrieNode[] {
  // 루트 노드
  const nodes: TrieNode[] = [{ children: {}, output: null, korean: null, fail: 0 }];

  // 1. Trie 구축 (모든 패턴 삽입)
  for (const expr of expressions) {
    let nodeIdx = 0;
    for (const char of expr.korean) {
      // biome-ignore lint/style/noNonNullAssertion: guaranteed by algorithm
      const currentNode = nodes[nodeIdx]!;
      if (!(char in currentNode.children)) {
        currentNode.children[char] = nodes.length;
        nodes.push({ children: {}, output: null, korean: null, fail: 0 });
      }
      // biome-ignore lint/style/noNonNullAssertion: guaranteed by algorithm
      nodeIdx = currentNode.children[char]!;
    }
    // 동음이의어 지원: 같은 korean에 여러 ID 수집
    // biome-ignore lint/style/noNonNullAssertion: guaranteed by algorithm
    const targetNode = nodes[nodeIdx]!;
    if (targetNode.output === null) {
      targetNode.output = [expr.id];
      targetNode.korean = expr.korean;
    } else {
      // 이미 다른 ID가 있으면 추가 (중복 방지)
      if (!targetNode.output.includes(expr.id)) {
        targetNode.output.push(expr.id);
      }
    }
  }

  // 2. Failure 링크 계산 (BFS)
  const queue: number[] = [];

  // 루트의 직접 자식들의 fail은 모두 루트(0)
  // biome-ignore lint/style/noNonNullAssertion: root always exists
  const rootNode = nodes[0]!;
  for (const char in rootNode.children) {
    // biome-ignore lint/style/noNonNullAssertion: guaranteed by loop
    const childIdx = rootNode.children[char]!;
    // biome-ignore lint/style/noNonNullAssertion: nodes exist
    const childNode = nodes[childIdx]!;
    childNode.fail = 0;
    queue.push(childIdx);
  }

  while (queue.length > 0) {
    // biome-ignore lint/style/noNonNullAssertion: queue not empty
    const current = queue.shift()!;
    // biome-ignore lint/style/noNonNullAssertion: nodes exist
    const currentNode = nodes[current]!;

    for (const char in currentNode.children) {
      // biome-ignore lint/style/noNonNullAssertion: guaranteed by loop
      const childIdx = currentNode.children[char]!;
      // biome-ignore lint/style/noNonNullAssertion: nodes exist
      const childNode = nodes[childIdx]!;
      queue.push(childIdx);

      // fail 링크 따라가며 현재 문자 찾기
      let failState = currentNode.fail;
      // biome-ignore lint/style/noNonNullAssertion: guaranteed by structure
      let failNode = nodes[failState]!;
      while (failState !== 0 && !(char in failNode.children)) {
        failState = failNode.fail;
        // biome-ignore lint/style/noNonNullAssertion: guaranteed by loop
        failNode = nodes[failState]!;
      }

      // biome-ignore lint/style/noNonNullAssertion: guaranteed by structure
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
 *
 * 번들 최적화: Trie 데이터를 별도 JSON 파일로 분리하여 동적 로딩
 * - 기존: 2.5MB가 JS 번들에 포함
 * - 개선: JSON 파일로 분리, 필요할 때만 fetch
 */
function generateKoreanExpressionsFile(entries: JsonEntry[]): string {
  // 길이순 정렬 (긴 것부터) - 긴 표현 우선 매칭
  const expressions = entries
    .map((e) => ({ id: e.id, korean: e.korean }))
    .sort((a, b) => b.korean.length - a.korean.length);

  // Aho-Corasick Trie 빌드
  const trie = buildAhoCorasickTrie(expressions);

  // Trie 데이터를 별도 JSON 파일로 저장
  writeFileSync(TRIE_JSON_FILE, JSON.stringify(trie));
  console.log(
    `   ✓ expression-trie.json (${trie.length} nodes, ${(JSON.stringify(trie).length / 1024 / 1024).toFixed(2)}MB)`,
  );

  return `/**
 * @fileoverview LinkedExample 컴포넌트용 Aho-Corasick Trie 로더
 *
 * 이 파일은 scripts/load-entries.ts에 의해 자동 생성됩니다.
 * 직접 수정하지 마세요.
 *
 * @remarks
 * Aho-Corasick 알고리즘으로 O(m) 시간에 모든 표현을 매칭합니다.
 * - 기존: O(n*m) where n=표현개수, m=텍스트길이
 * - 개선: O(m) - 표현 개수와 무관
 *
 * 번들 최적화:
 * - Trie 데이터가 별도 JSON 파일로 분리됨 (2.5MB → 0)
 * - 필요할 때만 동적으로 로드
 *
 * @generated
 * @date 2024-01-01T00:00:00.000Z
 */

/**
 * Aho-Corasick Trie 노드
 */
export interface TrieNode {
  /** 자식 노드 (문자 → 자식 인덱스) */
  children: Record<string, number>;
  /** 이 노드에서 끝나는 표현의 ID들 (동음이의어 지원) */
  output: string[] | null;
  /** 매칭된 한국어 */
  korean: string | null;
  /** 실패 링크 */
  fail: number;
}

/**
 * Trie 데이터 통계
 * ${trie.length}개 노드, ${expressions.length}개 표현
 */
export const TRIE_STATS = {
  nodeCount: ${trie.length},
  expressionCount: ${expressions.length},
} as const;

/** Trie 데이터 캐시 */
let trieCache: TrieNode[] | null = null;
let trieLoadPromise: Promise<TrieNode[]> | null = null;

/**
 * Trie 데이터 로드 (캐시됨)
 * 최초 호출 시 JSON 파일에서 로드, 이후 캐시 반환
 */
export async function loadTrie(): Promise<TrieNode[]> {
  // 이미 로드됨
  if (trieCache) return trieCache;

  // 로딩 중이면 기존 Promise 반환 (중복 요청 방지)
  if (trieLoadPromise) return trieLoadPromise;

  trieLoadPromise = (async () => {
    try {
      const response = await fetch('/data/expression-trie.json');
      if (!response.ok) {
        throw new Error(\`Failed to load trie: \${response.status}\`);
      }
      trieCache = await response.json();
      return trieCache!;
    } catch (error) {
      console.error('Failed to load expression trie:', error);
      trieCache = []; // 빈 배열로 폴백
      return trieCache;
    } finally {
      trieLoadPromise = null;
    }
  })();

  return trieLoadPromise;
}

/**
 * Trie가 로드되었는지 확인
 */
export function isTrieLoaded(): boolean {
  return trieCache !== null && trieCache.length > 0;
}

/**
 * 한글 문자인지 확인
 */
function isKorean(char: string | undefined): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  // 한글 음절 (가-힣) 또는 한글 자모 (ㄱ-ㅎ, ㅏ-ㅣ)
  return (code >= 0xAC00 && code <= 0xD7A3) || (code >= 0x3131 && code <= 0x318E);
}

/**
 * O(m) 시간에 텍스트에서 모든 표현 찾기 (비동기)
 * @param text 검색할 텍스트
 * @param excludeId 제외할 표현 ID (현재 보고 있는 항목)
 * @returns 매칭 결과 배열 [{start, end, ids, korean}] - ids는 동음이의어 지원
 */
export async function findExpressionsAsync(
  text: string,
  excludeId?: string
): Promise<Array<{ start: number; end: number; ids: string[]; korean: string }>> {
  const trie = await loadTrie();
  return findExpressionsWithTrie(trie, text, excludeId);
}

/**
 * O(m) 시간에 텍스트에서 모든 표현 찾기 (동기 - Trie가 이미 로드된 경우)
 * @param text 검색할 텍스트
 * @param excludeId 제외할 표현 ID (현재 보고 있는 항목)
 * @returns 매칭 결과 배열 또는 빈 배열 (Trie 미로드 시)
 */
export function findExpressions(
  text: string,
  excludeId?: string
): Array<{ start: number; end: number; ids: string[]; korean: string }> {
  if (!trieCache || trieCache.length === 0) {
    return [];
  }
  return findExpressionsWithTrie(trieCache, text, excludeId);
}

/**
 * Trie를 사용한 표현 찾기 (내부 함수)
 */
function findExpressionsWithTrie(
  trie: TrieNode[],
  text: string,
  excludeId?: string
): Array<{ start: number; end: number; ids: string[]; korean: string }> {
  if (trie.length === 0) return [];

  const matches: Array<{ start: number; end: number; ids: string[]; korean: string }> = [];
  let state = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (!char) continue;

    // 현재 상태에서 char로 갈 수 없으면 fail 따라감
    let currentNode = trie[state];
    while (state !== 0 && currentNode && !(char in currentNode.children)) {
      state = currentNode.fail;
      currentNode = trie[state];
    }

    // char로 전이
    if (currentNode && char in currentNode.children) {
      state = currentNode.children[char]!;
    }

    // 출력 체크 (현재 상태 + fail 체인)
    let checkState = state;
    while (checkState !== 0) {
      const node = trie[checkState];
      if (!node) break;
      if (node.output && node.korean) {
        // excludeId 필터링 (동음이의어 중 현재 항목 제외)
        const filteredIds = node.output.filter((id) => id !== excludeId);
        if (filteredIds.length > 0) {
          const koreanLen = node.korean.length;
          const start = i - koreanLen + 1;
          const end = i + 1;

          // 단어 경계 검사: 1-2글자 매칭은 앞뒤로 한글이 있으면 스킵
          // 예: "아시아"에서 "시"는 앞뒤로 "아"가 있으므로 스킵
          // 예: "아시아에"에서 "에"는 뒤가 공백이므로 매칭
          if (koreanLen <= 2) {
            const prevChar = text[start - 1];
            const nextChar = text[end];
            // 앞뒤 모두 한글이면 단어 내부로 판단하여 스킵
            if (isKorean(prevChar) && isKorean(nextChar)) {
              checkState = node.fail;
              continue;
            }
          }

          // 겹치는 매칭 찾기
          const overlappingIdx = matches.findIndex(
            (m) => (start >= m.start && start < m.end) || (m.start >= start && m.start < end)
          );

          if (overlappingIdx === -1) {
            // 겹치는 매칭이 없으면 추가
            matches.push({ start, end, ids: filteredIds, korean: node.korean });
          } else {
            // 겹치는 매칭이 있으면, 새 매칭이 더 길면 대체
            const existing = matches[overlappingIdx];
            if (existing) {
              const existingLen = existing.end - existing.start;
              if (koreanLen > existingLen) {
                matches[overlappingIdx] = { start, end, ids: filteredIds, korean: node.korean };
              }
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
    generatedAt: '2024-01-01T00:00:00.000Z',
  };
  writeFileSync(join(CHUNKS_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

  // ID → categoryId 매핑 생성
  const entryToCategory: Record<string, string> = {};
  for (const entry of entries) {
    entryToCategory[entry.id] = entry.categoryId;
  }

  // ID → 청크 인덱스 TypeScript 파일 생성
  const indexContent = `/**
 * @fileoverview 엔트리 ID → 청크/카테고리 인덱스 맵
 *
 * 이 파일은 scripts/load-entries.ts에 의해 자동 생성됩니다.
 * 100만개+ 엔트리에서도 O(1) 조회 지원
 *
 * @generated
 * @date 2024-01-01T00:00:00.000Z
 */

/** 엔트리 ID → 초성 (청크 키) */
export const entryIndex: Record<string, string> = ${JSON.stringify(entryIndex)};

/** 엔트리 ID → 카테고리 ID (entry 페이지 로딩용) */
export const entryToCategory: Record<string, string> = ${JSON.stringify(entryToCategory)};

/** 청크 메타 정보 */
export const chunkMeta = ${JSON.stringify(meta, null, 2)};

/** ID로 청크 키 조회 */
export function getChunkKey(entryId: string): string | undefined {
  return entryIndex[entryId];
}

/** ID로 카테고리 조회 */
export function getCategoryId(entryId: string): string | undefined {
  return entryToCategory[entryId];
}

/** 청크 파일 URL 생성 */
export function getChunkUrl(choseong: string): string {
  return \`/data/chunks/entries-\${choseong}.json\`;
}

/** 카테고리 전체 데이터 URL 생성 */
export function getCategoryFullUrl(categoryId: string): string {
  return \`/data/by-category-full/\${categoryId}.json\`;
}
`;
  writeFileSync(INDEX_FILE, indexContent);

  console.log(`   ✓ meta.json`);
  console.log(`✅ Generated ${groups.size} chunk files`);
  console.log(`✅ Generated ${INDEX_FILE}`);
}

/**
 * Locale별 엔트리 (번들 최적화용)
 * translations 대신 단일 translation 필드만 포함
 * dialogue는 별도 JSON으로 분리되어 lazy-load됨
 */
interface LocaleEntry {
  id: string;
  korean: string;
  romanization: string;
  pronunciation?: { korean: string; ipa?: string };
  partOfSpeech: string;
  categoryId: string;
  difficulty: string;
  frequency?: string;
  tags: string[];
  /** dialogue가 존재하는지 여부 (별도 JSON에서 lazy-load) */
  hasDialogue?: boolean;
  /** 단일 locale의 번역만 포함 (ko 또는 en) - dialogue 제외 */
  translation: {
    word: string;
    explanation: string;
    examples?: Examples;
    // dialogue는 별도 JSON으로 분리됨 (lazy-loading)
    variations?: {
      formal?: string[];
      casual?: string[];
      short?: string[];
    };
  };
}

/**
 * 카테고리별 JSON 청크 파일 생성
 * - light/: LightEntry (browse 페이지용, 경량)
 * - full/en/: 영어 전용 MeaningEntry (entry 페이지 SSG용) - dialogue 제외
 * - full/ko/: 한국어 전용 MeaningEntry (entry 페이지 SSG용) - dialogue 제외
 * - dialogues/en/: 영어 dialogue (lazy-load용)
 * - dialogues/ko/: 한국어 dialogue (lazy-load용)
 *
 * ## Locale 분리 최적화
 * 기존: translations: { ko: {...}, en: {...} } → 2,080 bytes
 * 최적화: translation: {...} → 1,040 bytes (50% 절감)
 *
 * ## Dialogue 분리 최적화
 * dialogue 데이터를 별도 JSON으로 분리하여 lazy-load
 * 초기 로딩 ~30% 절감
 */
function generateCategoryChunks(entries: JsonEntry[]): void {
  // 카테고리 청크 디렉토리 생성
  if (!existsSync(CATEGORY_CHUNKS_DIR)) {
    mkdirSync(CATEGORY_CHUNKS_DIR, { recursive: true });
  }

  const fullChunksDir = join(dirname(CATEGORY_CHUNKS_DIR), 'by-category-full');
  const fullChunksDirEn = join(fullChunksDir, 'en');
  const fullChunksDirKo = join(fullChunksDir, 'ko');
  const dialoguesDir = join(dirname(CATEGORY_CHUNKS_DIR), 'dialogues');
  const dialoguesDirEn = join(dialoguesDir, 'en');
  const dialoguesDirKo = join(dialoguesDir, 'ko');

  // locale별 디렉토리 생성
  for (const dir of [
    fullChunksDir,
    fullChunksDirEn,
    fullChunksDirKo,
    dialoguesDir,
    dialoguesDirEn,
    dialoguesDirKo,
  ]) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  console.log('\n📦 Generating JSON chunks by category (locale-separated, dialogue-separated)...');

  const dialogueFilename = (entryId: string) =>
    entryId === 'biome' ? 'biome.dialogue.json' : `${entryId}.json`;

  // 카테고리별 그룹화 (경량)
  const byCategory = new Map<string, LightEntry[]>();
  // 카테고리별 locale 분리 데이터 (dialogue 제외)
  const byCategoryEn = new Map<string, LocaleEntry[]>();
  const byCategoryKo = new Map<string, LocaleEntry[]>();
  // dialogue 데이터 (entryId → dialogue)
  const dialoguesEn = new Map<string, EntryDialogue>();
  const dialoguesKo = new Map<string, EntryDialogue>();

  for (const entry of entries) {
    // 경량 데이터 (변경 없음)
    const lightList = byCategory.get(entry.categoryId) || [];
    lightList.push({
      id: entry.id,
      korean: entry.korean,
      romanization: entry.romanization,
      categoryId: entry.categoryId,
      word: {
        ko: entry.translations.ko.word,
        en: entry.translations.en.word,
      },
    });
    byCategory.set(entry.categoryId, lightList);

    // dialogue 추출 및 저장
    const enDialogue = entry.translations.en.dialogue;
    const koDialogue = entry.translations.ko.dialogue;
    if (enDialogue) dialoguesEn.set(entry.id, enDialogue);
    if (koDialogue) dialoguesKo.set(entry.id, koDialogue);

    // 영어 전용 데이터 (dialogue 제외, hasDialogue 플래그 추가)
    const enList = byCategoryEn.get(entry.categoryId) || [];
    const { dialogue: _enDialogue, ...enTranslationWithoutDialogue } = entry.translations.en;
    enList.push({
      id: entry.id,
      korean: entry.korean,
      romanization: entry.romanization,
      pronunciation: entry.pronunciation,
      partOfSpeech: entry.partOfSpeech,
      categoryId: entry.categoryId,
      difficulty: entry.difficulty,
      frequency: entry.frequency,
      tags: entry.tags,
      hasDialogue: !!enDialogue,
      translation: enTranslationWithoutDialogue,
      // colors 카테고리 전용 필드
      ...(entry.colorCode && { colorCode: entry.colorCode }),
    });
    byCategoryEn.set(entry.categoryId, enList);

    // 한국어 전용 데이터 (dialogue 제외, hasDialogue 플래그 추가)
    const koList = byCategoryKo.get(entry.categoryId) || [];
    const { dialogue: _koDialogue, ...koTranslationWithoutDialogue } = entry.translations.ko;
    koList.push({
      id: entry.id,
      korean: entry.korean,
      romanization: entry.romanization,
      pronunciation: entry.pronunciation,
      partOfSpeech: entry.partOfSpeech,
      categoryId: entry.categoryId,
      difficulty: entry.difficulty,
      frequency: entry.frequency,
      tags: entry.tags,
      hasDialogue: !!koDialogue,
      translation: koTranslationWithoutDialogue,
      // colors 카테고리 전용 필드
      ...(entry.colorCode && { colorCode: entry.colorCode }),
    });
    byCategoryKo.set(entry.categoryId, koList);
  }

  // 각 카테고리 JSON 파일 생성 (경량)
  for (const [categoryId, catEntries] of byCategory) {
    const filename = `${categoryId}.json`;
    const filepath = join(CATEGORY_CHUNKS_DIR, filename);
    writeFileSync(filepath, JSON.stringify(catEntries));
    console.log(`   ✓ by-category/${filename} (${catEntries.length} entries)`);
  }

  // 영어 전용 JSON 생성 (dialogue 제외)
  let enTotalSize = 0;
  for (const [categoryId, catEntries] of byCategoryEn) {
    const filename = `${categoryId}.json`;
    const filepath = join(fullChunksDirEn, filename);
    const content = JSON.stringify(catEntries);
    writeFileSync(filepath, content);
    enTotalSize += content.length;
  }
  console.log(
    `   ✓ by-category-full/en/ (${byCategoryEn.size} files, ${(enTotalSize / 1024 / 1024).toFixed(1)}MB)`,
  );

  // 한국어 전용 JSON 생성 (dialogue 제외)
  let koTotalSize = 0;
  for (const [categoryId, catEntries] of byCategoryKo) {
    const filename = `${categoryId}.json`;
    const filepath = join(fullChunksDirKo, filename);
    const content = JSON.stringify(catEntries);
    writeFileSync(filepath, content);
    koTotalSize += content.length;
  }
  console.log(
    `   ✓ by-category-full/ko/ (${byCategoryKo.size} files, ${(koTotalSize / 1024 / 1024).toFixed(1)}MB)`,
  );

  // 영어 dialogue JSON 생성 (entryId별 개별 파일)
  let enDialogueSize = 0;
  for (const [entryId, dialogue] of dialoguesEn) {
    const filename = dialogueFilename(entryId);
    const filepath = join(dialoguesDirEn, filename);
    const content = JSON.stringify(dialogue);
    writeFileSync(filepath, content);
    enDialogueSize += content.length;
  }
  console.log(
    `   ✓ dialogues/en/ (${dialoguesEn.size} files, ${(enDialogueSize / 1024 / 1024).toFixed(2)}MB)`,
  );

  // 한국어 dialogue JSON 생성 (entryId별 개별 파일)
  let koDialogueSize = 0;
  for (const [entryId, dialogue] of dialoguesKo) {
    const filename = dialogueFilename(entryId);
    const filepath = join(dialoguesDirKo, filename);
    const content = JSON.stringify(dialogue);
    writeFileSync(filepath, content);
    koDialogueSize += content.length;
  }
  console.log(
    `   ✓ dialogues/ko/ (${dialoguesKo.size} files, ${(koDialogueSize / 1024 / 1024).toFixed(2)}MB)`,
  );

  // 메타 정보 저장
  const meta = {
    totalEntries: entries.length,
    locales: ['en', 'ko'],
    dialogueCount: {
      en: dialoguesEn.size,
      ko: dialoguesKo.size,
    },
    categories: Array.from(byCategory.entries()).map(([id, entries]) => ({
      id,
      count: entries.length,
      file: `${id}.json`,
    })),
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(CATEGORY_CHUNKS_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

  console.log(`   ✓ meta.json`);
  console.log(`✅ Generated ${byCategory.size} category chunk files (light + en/ko full)`);
  console.log(
    `   📊 Entry data: EN ${(enTotalSize / 1024 / 1024).toFixed(1)}MB + KO ${(koTotalSize / 1024 / 1024).toFixed(1)}MB`,
  );
  console.log(
    `   📊 Dialogue data (lazy): EN ${(enDialogueSize / 1024 / 1024).toFixed(2)}MB + KO ${(koDialogueSize / 1024 / 1024).toFixed(2)}MB`,
  );
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
    // output은 string[] | null이므로 JSON.stringify로 저장
    getStringIndex(node.output ? JSON.stringify(node.output) : null);
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

    // output (4바이트) - JSON 문자열로 저장
    const outputBuf = Buffer.alloc(4);
    outputBuf.writeUInt32LE(getStringIndex(node.output ? JSON.stringify(node.output) : null), 0);
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
