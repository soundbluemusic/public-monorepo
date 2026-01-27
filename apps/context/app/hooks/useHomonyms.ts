/**
 * Homonym Query Hooks
 *
 * 동음이의어(같은 한글, 다른 ID)를 조회하는 Query 훅입니다.
 *
 * @example
 * ```tsx
 * const { data: homonyms } = useHomonyms('안녕', 'annyeong-1');
 * ```
 */

import { queryKeys, useQuery } from '@soundblue/features/query';
import { fetchHomonyms } from '@/services/d1-server';

/**
 * 동음이의어 조회 훅
 *
 * @param korean - 한글 단어
 * @param currentId - 현재 entry ID (제외)
 */
export function useHomonyms(korean: string, currentId: string) {
  return useQuery({
    queryKey: queryKeys.homonyms.byKorean(korean),
    queryFn: () => fetchHomonyms({ data: { korean } }),
    select: (data) => data?.filter((entry) => entry.id !== currentId) ?? [],
    // 동음이의어는 자주 변경되지 않으므로 길게 캐시
    staleTime: 30 * 60 * 1000,
  });
}
