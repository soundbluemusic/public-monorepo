import { useEffect, useMemo, useState } from 'react';
import type { categories } from '@/data/categories';
import type { MeaningEntry } from '@/data/types';
import { useFavorites, useIsHydrated, useStudyRecords } from '@/stores/user-data-store';

export function useMyLearningData() {
  const [entries, setEntries] = useState<MeaningEntry[]>([]);
  const [cats, setCats] = useState<typeof categories>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [categoryProgress, setCategoryProgress] = useState<
    Record<string, { studied: number; total: number }>
  >({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand store에서 원시 배열 데이터 가져오기 (안정적인 참조)
  const isHydrated = useIsHydrated();
  const favorites = useFavorites();
  const studyRecords = useStudyRecords();

  // 배열에서 Set으로 변환 (메모이제이션으로 무한 루프 방지)
  const studiedIds = useMemo(() => new Set(studyRecords.map((r) => r.entryId)), [studyRecords]);
  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.entryId)), [favorites]);

  // 엔트리 데이터 로드 (한 번만)
  useEffect(() => {
    async function loadData() {
      try {
        const [{ meaningEntries }, { categories: loadedCategories }] = await Promise.all([
          import('@/data/entries'),
          import('@/data/categories'),
        ]);

        setEntries(meaningEntries);
        setCats(loadedCategories);
        setTotalEntries(meaningEntries.length);
        setDataLoaded(true);
      } catch (err: unknown) {
        console.error('Failed to load my-learning data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      }
    }
    loadData();
  }, []);

  // 카테고리별 진행률 계산 (studiedIds 또는 entries 변경 시)
  useEffect(() => {
    if (!dataLoaded || entries.length === 0 || cats.length === 0) return;

    // 단일 패스로 카테고리별 진행 상황 계산 (O(n))
    const catProgress: Record<string, { studied: number; total: number }> = {};

    // 카테고리별 초기화
    for (const cat of cats) {
      catProgress[cat.id] = { studied: 0, total: 0 };
    }

    // 단일 패스로 집계
    for (const entry of entries) {
      const progress = catProgress[entry.categoryId];
      if (progress) {
        progress.total++;
        if (studiedIds.has(entry.id)) {
          progress.studied++;
        }
      }
    }
    setCategoryProgress(catProgress);
  }, [dataLoaded, entries, cats, studiedIds]);

  return {
    entries,
    cats,
    totalEntries,
    studiedIds: Array.from(studiedIds),
    favoriteIds: Array.from(favoriteIds),
    categoryProgress,
    isLoading: !isHydrated || !dataLoaded,
    error,
  };
}
