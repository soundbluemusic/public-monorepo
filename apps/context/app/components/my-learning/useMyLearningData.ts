import { useEffect, useState } from 'react';
import type { categories } from '@/data/categories';
import type { MeaningEntry } from '@/data/types';
import { favorites, studyRecords } from '@/lib/db';

export function useMyLearningData() {
  const [entries, setEntries] = useState<MeaningEntry[]>([]);
  const [cats, setCats] = useState<typeof categories>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [studiedIds, setStudiedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [categoryProgress, setCategoryProgress] = useState<
    Record<string, { studied: number; total: number }>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // 클라이언트에서 데이터 로드
        const [{ meaningEntries }, { categories: loadedCategories }] = await Promise.all([
          import('@/data/entries'),
          import('@/data/categories'),
        ]);

        setEntries(meaningEntries);
        setCats(loadedCategories);
        setTotalEntries(meaningEntries.length);

        const studied = await studyRecords.getStudiedEntryIds();
        setStudiedIds(studied);

        const favs = await favorites.getAll();
        setFavoriteIds(favs.map((f) => f.entryId));

        // 단일 패스로 카테고리별 진행 상황 계산 (O(n) instead of O(n*m))
        const catProgress: Record<string, { studied: number; total: number }> = {};
        const studiedSet = new Set(studied);

        // 카테고리별 초기화
        for (const cat of loadedCategories) {
          catProgress[cat.id] = { studied: 0, total: 0 };
        }

        // 단일 패스로 집계
        for (const entry of meaningEntries) {
          const progress = catProgress[entry.categoryId];
          if (progress) {
            progress.total++;
            if (studiedSet.has(entry.id)) {
              progress.studied++;
            }
          }
        }
        setCategoryProgress(catProgress);
      } catch (err) {
        console.error('Failed to load my-learning data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return {
    entries,
    cats,
    totalEntries,
    studiedIds,
    favoriteIds,
    categoryProgress,
    isLoading,
    error,
  };
}
