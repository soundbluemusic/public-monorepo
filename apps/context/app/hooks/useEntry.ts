/**
 * Entry Query Hooks
 *
 * D1에서 entry 데이터를 가져오는 Query 훅입니다.
 * 클라이언트 사이드 네비게이션 시 캐시를 활용합니다.
 *
 * @example
 * ```tsx
 * const { data: entry, isPending } = useEntry('annyeong', 'ko');
 * ```
 */

import { queryKeys, useQuery, useQueryClient } from '@soundblue/features/query';
import type { Language, LocaleEntry } from '@/data/types';
import { fetchEntryFromD1 } from '@/services/d1-server';

/**
 * 단일 Entry 조회 훅
 *
 * @param entryId - Entry ID
 * @param locale - 언어 ('ko' | 'en')
 * @param initialData - SSR에서 미리 로드된 데이터 (hydration용)
 */
export function useEntry(entryId: string, locale: Language, initialData?: LocaleEntry | null) {
  return useQuery({
    queryKey: queryKeys.entries.detail(entryId, locale),
    queryFn: () => fetchEntryFromD1({ data: { entryId, locale } }),
    initialData,
    // SSR에서 로드된 데이터가 있으면 stale 처리하지 않음
    staleTime: initialData ? Infinity : 5 * 60 * 1000,
  });
}

/**
 * Entry Prefetch 함수
 *
 * 호버 시 미리 로드하여 클릭 시 즉시 표시합니다.
 *
 * @example
 * ```tsx
 * const prefetch = usePrefetchEntry();
 * <Link onMouseEnter={() => prefetch('annyeong', 'ko')}>안녕</Link>
 * ```
 */
export function usePrefetchEntry() {
  const queryClient = useQueryClient();

  return (entryId: string, locale: Language) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.entries.detail(entryId, locale),
      queryFn: () => fetchEntryFromD1({ data: { entryId, locale } }),
      staleTime: 5 * 60 * 1000,
    });
  };
}
