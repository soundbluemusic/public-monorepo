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

        const catProgress: Record<string, { studied: number; total: number }> = {};
        const studiedSet = new Set(studied);
        for (const cat of loadedCategories) {
          const catEntries = meaningEntries.filter((e) => e.categoryId === cat.id);
          const studiedInCat = catEntries.filter((e) => studiedSet.has(e.id)).length;
          catProgress[cat.id] = { studied: studiedInCat, total: catEntries.length };
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
