/**
 * Query Key 팩토리
 *
 * 타입 안전한 Query Key를 생성합니다.
 * 캐시 무효화 및 prefetch에서 일관된 키를 사용할 수 있습니다.
 *
 * @example
 * ```ts
 * // 단일 entry 조회
 * useQuery({ queryKey: queryKeys.entry('annyeong', 'ko') })
 *
 * // 카테고리 목록 조회
 * useQuery({ queryKey: queryKeys.categories('ko') })
 *
 * // 특정 카테고리의 모든 entries 무효화
 * queryClient.invalidateQueries({ queryKey: queryKeys.entriesByCategory('greetings') })
 * ```
 */

export const queryKeys = {
  // Entry 관련
  entries: {
    all: ['entries'] as const,
    lists: () => [...queryKeys.entries.all, 'list'] as const,
    list: (locale: string, categoryId?: string) =>
      [...queryKeys.entries.lists(), { locale, categoryId }] as const,
    details: () => [...queryKeys.entries.all, 'detail'] as const,
    detail: (entryId: string, locale: string) =>
      [...queryKeys.entries.details(), entryId, locale] as const,
  },

  // Category 관련
  categories: {
    all: ['categories'] as const,
    list: (locale: string) => [...queryKeys.categories.all, 'list', locale] as const,
    detail: (categoryId: string, locale: string) =>
      [...queryKeys.categories.all, 'detail', categoryId, locale] as const,
  },

  // Conversation 관련
  conversations: {
    all: ['conversations'] as const,
    list: (locale: string) => [...queryKeys.conversations.all, 'list', locale] as const,
    detail: (conversationId: string, locale: string) =>
      [...queryKeys.conversations.all, 'detail', conversationId, locale] as const,
  },

  // Search 관련
  search: {
    all: ['search'] as const,
    results: (query: string, locale: string) =>
      [...queryKeys.search.all, 'results', query, locale] as const,
  },

  // Homonym 관련 (동음이의어)
  homonyms: {
    all: ['homonyms'] as const,
    byKorean: (korean: string) => [...queryKeys.homonyms.all, korean] as const,
  },

  // Browse 관련 (청크 기반 목록)
  browse: {
    all: ['browse'] as const,
    chunks: () => [...queryKeys.browse.all, 'chunk'] as const,
    chunk: (sortType: string, chunkIndex: number) =>
      [...queryKeys.browse.chunks(), sortType, chunkIndex] as const,
    byCategory: (categoryId: string) => [...queryKeys.browse.all, 'category', categoryId] as const,
  },

  // Roots Concepts 관련
  concepts: {
    all: ['concepts'] as const,
    list: (locale: string) => [...queryKeys.concepts.all, 'list', locale] as const,
    detail: (conceptId: string, locale: string) =>
      [...queryKeys.concepts.all, 'detail', conceptId, locale] as const,
    byField: (fieldId: string, locale: string) =>
      [...queryKeys.concepts.all, 'field', fieldId, locale] as const,
  },

  // Permissive Libraries 관련
  libraries: {
    all: ['libraries'] as const,
    list: (locale: string) => [...queryKeys.libraries.all, 'list', locale] as const,
    detail: (libraryId: string, locale: string) =>
      [...queryKeys.libraries.all, 'detail', libraryId, locale] as const,
    byCategory: (categoryId: string, locale: string) =>
      [...queryKeys.libraries.all, 'category', categoryId, locale] as const,
  },

  // Web APIs 관련
  webApis: {
    all: ['webApis'] as const,
    list: (locale: string) => [...queryKeys.webApis.all, 'list', locale] as const,
    detail: (apiId: string, locale: string) =>
      [...queryKeys.webApis.all, 'detail', apiId, locale] as const,
  },
} as const;

/**
 * Query Key 타입 추출 헬퍼
 */
export type QueryKeys = typeof queryKeys;
