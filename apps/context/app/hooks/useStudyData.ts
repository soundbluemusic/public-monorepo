/**
 * @fileoverview 학습 데이터 로딩을 위한 커스텀 훅
 *
 * Context 앱의 여러 페이지에서 중복되던 학습 데이터 로딩 로직을 통합합니다.
 * - _index.tsx: overallProgress, categoryProgress
 * - browse.tsx: studiedIds, favoriteIds, overallProgress, todayStudied
 * - category.$categoryId.tsx: studiedIds
 */

import { useEffect, useState } from 'react';
import type { Category } from '@/data/types';
import { favorites, studyRecords } from '@/lib/db';

/** 진행률 데이터 구조 */
export interface ProgressData {
  studied: number;
  total: number;
  percentage: number;
}

/** useStudyData 훅의 반환값 */
export interface UseStudyDataResult {
  /** 학습 완료된 엔트리 ID Set */
  studiedIds: Set<string>;
  /** 즐겨찾기된 엔트리 ID Set */
  favoriteIds: Set<string>;
  /** 전체 진행률 */
  overallProgress: ProgressData;
  /** 오늘 학습한 단어 수 */
  todayStudied: number;
  /** 북마크 수 */
  bookmarkCount: number;
  /** 카테고리별 진행률 */
  categoryProgress: Record<string, ProgressData>;
  /** 로딩 상태 */
  isLoading: boolean;
}

/** useStudyData 훅 옵션 */
export interface UseStudyDataOptions {
  /** 전체 엔트리 수 (진행률 계산용) */
  totalEntries: number;
  /** 카테고리 목록 (카테고리별 진행률 계산용, 선택적) */
  categories?: Category[];
  /** 카테고리별 엔트리 수 (선택적) */
  categoryCounts?: Record<string, number>;
}

/**
 * 학습 데이터 로딩 훅
 *
 * @example
 * ```tsx
 * // 기본 사용 (studiedIds, favoriteIds만 필요한 경우)
 * const { studiedIds, favoriteIds } = useStudyData({ totalEntries: 751 });
 *
 * // 전체 진행률 포함
 * const { overallProgress, todayStudied } = useStudyData({ totalEntries: 751 });
 *
 * // 카테고리별 진행률 포함
 * const { categoryProgress } = useStudyData({
 *   totalEntries: 751,
 *   categories,
 *   categoryCounts,
 * });
 * ```
 */
export function useStudyData({
  totalEntries,
  categories,
  categoryCounts,
}: UseStudyDataOptions): UseStudyDataResult {
  const [isLoading, setIsLoading] = useState(true);
  const [studiedIds, setStudiedIds] = useState<Set<string>>(new Set());
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [overallProgress, setOverallProgress] = useState<ProgressData>({
    studied: 0,
    total: totalEntries,
    percentage: 0,
  });
  const [todayStudied, setTodayStudied] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, ProgressData>>({});

  useEffect(() => {
    async function loadData() {
      try {
        // 학습 완료 ID 목록
        const ids = await studyRecords.getStudiedEntryIds();
        setStudiedIds(new Set(ids));

        // 전체 진행률
        const overall = await studyRecords.getOverallProgress(totalEntries);
        setOverallProgress(overall);

        // 오늘 학습한 단어 수
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const allRecords = await studyRecords.getRecent(totalEntries);
        const todayRecords = allRecords.filter((r) => {
          const recordDate = new Date(r.studiedAt);
          recordDate.setHours(0, 0, 0, 0);
          return recordDate.getTime() === today.getTime();
        });
        const uniqueTodayIds = new Set(todayRecords.map((r) => r.entryId));
        setTodayStudied(uniqueTodayIds.size);

        // 즐겨찾기
        const favs = await favorites.getAll();
        setFavoriteIds(new Set(favs.map((f) => f.entryId)));
        setBookmarkCount(favs.length);

        // 카테고리별 진행률 (옵션으로 제공된 경우만)
        if (categories && categoryCounts) {
          // 엔트리 데이터를 로드하여 실제 categoryId 매핑
          const { entriesById } = await import('@/data/entries');
          const studiedSet = new Set(ids);

          // 단일 패스로 카테고리별 학습 수 집계 (O(n) instead of O(n*m))
          const studiedByCategory: Record<string, number> = {};
          for (const studiedId of studiedSet) {
            const entry = entriesById.get(studiedId);
            if (entry) {
              studiedByCategory[entry.categoryId] = (studiedByCategory[entry.categoryId] ?? 0) + 1;
            }
          }

          const catProgress: Record<string, ProgressData> = {};
          for (const cat of categories) {
            const count = categoryCounts[cat.id] ?? 0;
            const studiedInCategory = studiedByCategory[cat.id] ?? 0;
            catProgress[cat.id] = {
              studied: studiedInCategory,
              total: count,
              percentage: count > 0 ? (studiedInCategory / count) * 100 : 0,
            };
          }
          setCategoryProgress(catProgress);
        }
      } catch (error: unknown) {
        console.error('Failed to load study data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [totalEntries, categories, categoryCounts]);

  return {
    studiedIds,
    favoriteIds,
    overallProgress,
    todayStudied,
    bookmarkCount,
    categoryProgress,
    isLoading,
  };
}
