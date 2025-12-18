import { allConcepts } from '@/data/concepts';
import type { DifficultyLevel, Language, MathConcept } from '@/data/types';
/**
 * @fileoverview Fuse.js 기반 검색 유틸리티
 */
import Fuse from 'fuse.js';

export interface SearchResult {
  item: MathConcept;
  score: number;
  matches: string[];
}

/**
 * 개념 검색을 위한 Fuse 인스턴스 생성
 */
function createConceptSearcher(locale: Language) {
  const options: Fuse.IFuseOptions<MathConcept> = {
    keys: [
      { name: `name.${locale}`, weight: 3 },
      { name: 'name.en', weight: 2 },
      { name: `content.${locale}.definition`, weight: 1.5 },
      { name: 'content.en.definition', weight: 1 },
      { name: 'tags', weight: 1 },
    ],
    threshold: 0.4,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
  };

  return new Fuse(allConcepts, options);
}

// 캐시된 검색 인스턴스
const searcherCache = new Map<Language, Fuse<MathConcept>>();

function getSearcher(locale: Language): Fuse<MathConcept> {
  const cached = searcherCache.get(locale);
  if (cached) {
    return cached;
  }
  const searcher = createConceptSearcher(locale);
  searcherCache.set(locale, searcher);
  return searcher;
}

/**
 * 개념 검색
 *
 * @param query 검색어
 * @param locale 현재 로케일
 * @param limit 최대 결과 수
 * @returns 검색 결과 배열
 */
export function searchConcepts(query: string, locale: Language, limit = 10): SearchResult[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searcher = getSearcher(locale);
  const results = searcher.search(query.trim(), { limit });

  return results.map((result) => ({
    item: result.item,
    score: result.score ?? 0,
    matches: result.matches?.map((m) => m.key || '') || [],
  }));
}

/**
 * 태그로 개념 검색
 */
export function searchByTag(tag: string): MathConcept[] {
  return allConcepts.filter((c) => c.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())));
}

/**
 * 난이도로 개념 필터링
 */
export function filterByDifficulty(
  concepts: MathConcept[],
  minLevel: DifficultyLevel,
  maxLevel: DifficultyLevel,
): MathConcept[] {
  return concepts.filter((c) => c.difficulty >= minLevel && c.difficulty <= maxLevel);
}
