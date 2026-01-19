/**
 * @fileoverview MiniSearch 기반 검색 유틸리티 (동적 로딩)
 *
 * 검색 인덱스를 빌드 시 생성된 JSON에서 동적으로 로드합니다.
 * Layout.tsx 번들에 전체 개념 데이터가 포함되지 않도록 합니다.
 *
 * MiniSearch는 사전 인덱싱을 통해 O(log n) 검색을 제공합니다.
 * Fuse.js의 O(n) 선형 검색 대비 대용량 데이터에서 훨씬 빠릅니다.
 */

import MiniSearch from 'minisearch';
import { z } from 'zod';
import type { DifficultyLevel, Language } from '@/data/types';

/** Zod schema for runtime validation of search index items */
const SearchIndexItemSchema = z.object({
  id: z.string(),
  name: z.object({ ko: z.string(), en: z.string() }),
  field: z.string(),
  subfield: z.string(),
  difficulty: z.number(),
  tags: z.array(z.string()),
  def: z.object({ ko: z.string(), en: z.string() }),
});

const SearchIndexArraySchema = z.array(SearchIndexItemSchema);

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

/**
 * MiniSearch 검색 결과 타입
 *
 * @note data/types.ts의 SearchResult와 구분하기 위해 별도 이름 사용
 */
export interface MiniSearchResult {
  item: SearchIndexItem;
  score: number;
  matches: string[];
}

// 검색 인덱스 캐시
let searchIndex: SearchIndexItem[] | null = null;
let indexLoadPromise: Promise<SearchIndexItem[]> | null = null;

// MiniSearch 인스턴스 캐시
const searcherCache = new Map<Language, MiniSearch<SearchIndexItem>>();

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

  indexLoadPromise = (async () => {
    try {
      const res = await fetch('/search-index.json');
      if (!res.ok) {
        console.error(`[Search] Failed to load index: ${res.status} ${res.statusText}`);
        return [];
      }
      const data: unknown = await res.json();
      // Runtime validation of fetched data
      const parsed = SearchIndexArraySchema.parse(data);
      searchIndex = parsed;
      return parsed;
    } catch (error) {
      console.error('[Search] Failed to load or parse search index:', error);
      // 에러 시 캐시 초기화하여 다음 시도 가능
      indexLoadPromise = null;
      return [];
    }
  })();

  return indexLoadPromise;
}

/**
 * MiniSearch 검색 인스턴스 생성
 */
function createConceptSearcher(
  index: SearchIndexItem[],
  locale: Language,
): MiniSearch<SearchIndexItem> {
  const instance = new MiniSearch<SearchIndexItem>({
    fields: [`name.${locale}`, 'name.en', `def.${locale}`, 'def.en', 'tags'],
    storeFields: ['id', 'name', 'field', 'subfield', 'difficulty', 'tags', 'def'],
    extractField: (document, fieldName) => {
      // Handle nested fields like name.ko, def.en
      const parts = fieldName.split('.');
      let value: unknown = document;
      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = (value as Record<string, unknown>)[part];
        } else {
          return undefined;
        }
      }
      // Handle arrays (tags)
      if (Array.isArray(value)) {
        return value.join(' ');
      }
      return typeof value === 'string' ? value : undefined;
    },
    searchOptions: {
      boost: {
        [`name.${locale}`]: 3,
        'name.en': 2,
        [`def.${locale}`]: 1.5,
        'def.en': 1,
        tags: 1,
      },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  instance.addAll(index);
  return instance;
}

function getSearcher(index: SearchIndexItem[], locale: Language): MiniSearch<SearchIndexItem> {
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
): Promise<MiniSearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const index = await loadSearchIndex();
  const searcher = getSearcher(index, locale);
  const results = searcher.search(query.trim()).slice(0, limit);

  return results.map((result) => {
    const originalItem = index.find((item) => item.id === result.id);
    return {
      item: originalItem || {
        id: result.id as string,
        name: (result.name as { ko: string; en: string }) || { ko: '', en: '' },
        field: (result.field as string) || '',
        subfield: (result.subfield as string) || '',
        difficulty: (result.difficulty as number) || 1,
        tags: (result.tags as string[]) || [],
        def: (result.def as { ko: string; en: string }) || { ko: '', en: '' },
      },
      score: result.score ?? 0,
      matches: result.match ? Object.keys(result.match) : [],
    };
  });
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
