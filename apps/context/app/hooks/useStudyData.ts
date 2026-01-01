/**
 * @fileoverview 학습 데이터 로딩을 위한 커스텀 훅
 *
 * Zustand store (useUserDataStore)를 기반으로 학습 데이터를 제공합니다.
 * SSG 호환: isHydrated 상태를 통해 로딩 상태를 관리합니다.
 *
 * - _index.tsx: overallProgress, categoryProgress
 * - browse.tsx: studiedIds, favoriteIds, overallProgress, todayStudied
 * - category.$categoryId.tsx: studiedIds
 */

import { useMemo } from 'react';
import type { Category } from '@/data/types';
import { useIsHydrated, useUserDataStore } from '@/stores/user-data-store';

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
  /** 엔트리 ID -> 카테고리 ID 매핑 (카테고리별 진행률 계산용, 선택적) */
  entryCategoryMap?: Map<string, string>;
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
 *   entryCategoryMap,
 * });
 * ```
 */
export function useStudyData({
  totalEntries,
  categories,
  categoryCounts,
  entryCategoryMap,
}: UseStudyDataOptions): UseStudyDataResult {
  const isHydrated = useIsHydrated();

  // Zustand store에서 직접 데이터 가져오기
  const studiedIds = useUserDataStore((state) => state.getStudiedIds());
  const favoriteIds = useUserDataStore((state) => state.getFavoriteIds());
  const favorites = useUserDataStore((state) => state.favorites);
  const todayStudied = useUserDataStore((state) => state.getTodayStudiedCount());

  // 전체 진행률 계산
  const overallProgress = useMemo<ProgressData>(() => {
    const studied = studiedIds.size;
    return {
      studied,
      total: totalEntries,
      percentage: totalEntries > 0 ? (studied / totalEntries) * 100 : 0,
    };
  }, [studiedIds.size, totalEntries]);

  // 카테고리별 진행률 계산
  const categoryProgress = useMemo<Record<string, ProgressData>>(() => {
    if (!categories || !categoryCounts || !entryCategoryMap) {
      return {};
    }

    // 단일 패스로 카테고리별 학습 수 집계 (O(n))
    const studiedByCategory: Record<string, number> = {};
    for (const studiedId of studiedIds) {
      const categoryId = entryCategoryMap.get(studiedId);
      if (categoryId) {
        studiedByCategory[categoryId] = (studiedByCategory[categoryId] ?? 0) + 1;
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
    return catProgress;
  }, [categories, categoryCounts, entryCategoryMap, studiedIds]);

  return {
    studiedIds,
    favoriteIds,
    overallProgress,
    todayStudied,
    bookmarkCount: favorites.length,
    categoryProgress,
    isLoading: !isHydrated,
  };
}
