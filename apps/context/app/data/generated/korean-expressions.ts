/**
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
 * 34269개 노드, 16394개 표현
 */
export const TRIE_STATS = {
  nodeCount: 34269,
  expressionCount: 16394,
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
        throw new Error(`Failed to load trie: ${response.status}`);
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
