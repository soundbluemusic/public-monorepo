import { useEffect, useMemo, useState } from 'react';
import type { categories } from '@/data/categories';
import type { LightEntry } from '@/data/entries';
import {
  useFavorites,
  useIsHydrated,
  useReviewEntries,
  useStudyRecords,
} from '@/stores/user-data-store';

/**
 * 클라이언트에서 browse 청크 데이터를 fetch로 로드
 * lightEntries가 deprecated되어 빈 배열이므로, 직접 fetch 필요
 */
async function loadLightEntriesFromChunks(): Promise<LightEntry[]> {
  try {
    // 먼저 메타 정보를 로드하여 청크 수 확인
    const metaResponse = await fetch('/data/browse/alphabetical/meta.json');
    if (!metaResponse.ok) {
      throw new Error('Failed to load meta.json');
    }
    const meta = (await metaResponse.json()) as { totalChunks: number; totalEntries: number };

    // 모든 청크를 병렬로 로드
    const chunkPromises: Promise<LightEntry[]>[] = [];
    for (let i = 0; i < meta.totalChunks; i++) {
      chunkPromises.push(
        fetch(`/data/browse/alphabetical/chunk-${i}.json`)
          .then((res) => {
            if (!res.ok) throw new Error(`Failed to load chunk-${i}`);
            return res.json() as Promise<{ entries: LightEntry[] }>;
          })
          .then((data) => data.entries),
      );
    }

    const chunks = await Promise.all(chunkPromises);
    return chunks.flat();
  } catch (error) {
    console.error('Failed to load lightEntries from chunks:', error);
    return [];
  }
}

export function useMyLearningData() {
  const [entries, setEntries] = useState<LightEntry[]>([]);
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
  const reviewEntries = useReviewEntries();

  // 배열에서 Set으로 변환 (메모이제이션으로 무한 루프 방지)
  const studiedIds = useMemo(() => new Set(studyRecords.map((r) => r.entryId)), [studyRecords]);
  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.entryId)), [favorites]);
  const reviewIds = useMemo(() => new Set(reviewEntries.map((r) => r.entryId)), [reviewEntries]);

  // 엔트리 데이터 로드 (한 번만) - fetch로 청크 데이터 로드
  useEffect(() => {
    async function loadData() {
      try {
        // 카테고리는 정적 import, 엔트리는 fetch로 로드
        const [loadedEntries, { categories: loadedCategories }] = await Promise.all([
          loadLightEntriesFromChunks(),
          import('@/data/categories'),
        ]);

        setEntries(loadedEntries);
        setCats(loadedCategories);
        setTotalEntries(loadedEntries.length);
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
    reviewIds: Array.from(reviewIds),
    categoryProgress,
    isLoading: !isHydrated || !dataLoaded,
    error,
  };
}
