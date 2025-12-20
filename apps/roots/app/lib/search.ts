/**
 * @fileoverview Fuse.js 기반 검색 유틸리티 (동적 로딩)
 *
 * 검색 인덱스를 빌드 시 생성된 JSON에서 동적으로 로드합니다.
 * Layout.tsx 번들에 전체 개념 데이터가 포함되지 않도록 합니다.
 */
import type { DifficultyLevel, Language } from '@/data/types';
import Fuse from 'fuse.js';

/** 검색 인덱스 아이템 (경량) */
export interface SearchIndexItem {
  id: string;
  name: { ko: string; en: string };
  field: string;
  subfield: string;
  difficulty: number;
  tags: string[];
  def: { ko: string; en: string };
}

export interface SearchResult {
  item: SearchIndexItem;
  score: number;
  matches: string[];
}

// 검색 인덱스 캐시
let searchIndex: SearchIndexItem[] | null = null;
let indexLoadPromise: Promise<SearchIndexItem[]> | null = null;

// Fuse 인스턴스 캐시
const searcherCache = new Map<Language, Fuse<SearchIndexItem>>();

/**
 * 검색 인덱스 로드 (lazy, 클라이언트 전용)
 */
async function loadSearchIndex(): Promise<SearchIndexItem[]> {
  // SSR에서는 빈 배열 반환 (fetch 불가)
  if (typeof window === 'undefined') {
    return [];
  }

  if (searchIndex) {
    return searchIndex;
  }

  if (indexLoadPromise) {
    return indexLoadPromise;
  }

  indexLoadPromise = fetch('/search-index.json')
    .then((res) => res.json())
    .then((data: SearchIndexItem[]) => {
      searchIndex = data;
      return data;
    });

  return indexLoadPromise;
}

/**
 * Fuse 검색 인스턴스 생성
 */
function createConceptSearcher(index: SearchIndexItem[], locale: Language): Fuse<SearchIndexItem> {
  return new Fuse(index, {
    keys: [
      { name: `name.${locale}`, weight: 3 },
      { name: 'name.en', weight: 2 },
      { name: `def.${locale}`, weight: 1.5 },
      { name: 'def.en', weight: 1 },
      { name: 'tags', weight: 1 },
    ],
    threshold: 0.4,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
  });
}

function getSearcher(index: SearchIndexItem[], locale: Language): Fuse<SearchIndexItem> {
  const cached = searcherCache.get(locale);
  if (cached) {
    return cached;
  }
  const searcher = createConceptSearcher(index, locale);
  searcherCache.set(locale, searcher);
  return searcher;
}

/**
 * 검색 인덱스 프리로드 (검색창 focus 시 호출)
 */
export function preloadSearchIndex(): void {
  loadSearchIndex();
}

/**
 * 검색 인덱스 로드 여부
 */
export function isSearchIndexLoaded(): boolean {
  return searchIndex !== null;
}

/**
 * 개념 검색 (비동기)
 */
export async function searchConcepts(
  query: string,
  locale: Language,
  limit = 10,
): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const index = await loadSearchIndex();
  const searcher = getSearcher(index, locale);
  const results = searcher.search(query.trim(), { limit });

  return results.map((result) => ({
    item: result.item,
    score: result.score ?? 0,
    matches: result.matches?.map((m) => m.key || '') || [],
  }));
}

/**
 * 태그로 개념 검색 (비동기)
 */
export async function searchByTag(tag: string): Promise<SearchIndexItem[]> {
  const index = await loadSearchIndex();
  return index.filter((c) => c.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())));
}

/**
 * 난이도로 개념 필터링 (비동기)
 */
export async function filterByDifficulty(
  minLevel: DifficultyLevel,
  maxLevel: DifficultyLevel,
): Promise<SearchIndexItem[]> {
  const index = await loadSearchIndex();
  return index.filter((c) => c.difficulty >= minLevel && c.difficulty <= maxLevel);
}
