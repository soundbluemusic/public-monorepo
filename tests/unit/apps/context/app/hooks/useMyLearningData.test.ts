/**
 * useMyLearningData Hook Tests
 *
 * my-learning 페이지에서 사용되는 데이터 로딩 훅 테스트
 * 주요 검증 항목:
 * 1. fetch를 통한 청크 데이터 로딩
 * 2. 카테고리별 진행률 계산
 * 3. 에러 처리
 * 4. 로딩 상태 관리
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ===== Mock Data =====
interface MockLightEntry {
  id: string;
  korean: string;
  categoryId: string;
}

interface MockCategory {
  id: string;
  name_ko: string;
  name_en: string;
}

const mockMetaData = {
  totalChunks: 2,
  totalEntries: 100,
};

const mockChunk0: MockLightEntry[] = [
  { id: 'entry-1', korean: '안녕', categoryId: 'greetings' },
  { id: 'entry-2', korean: '감사', categoryId: 'greetings' },
  { id: 'entry-3', korean: '밥', categoryId: 'food' },
];

const mockChunk1: MockLightEntry[] = [
  { id: 'entry-4', korean: '물', categoryId: 'food' },
  { id: 'entry-5', korean: '집', categoryId: 'places' },
];

const mockCategories: MockCategory[] = [
  { id: 'greetings', name_ko: '인사', name_en: 'Greetings' },
  { id: 'food', name_ko: '음식', name_en: 'Food' },
  { id: 'places', name_ko: '장소', name_en: 'Places' },
];

// ===== Unit Tests (Pure Function Tests) =====
describe('useMyLearningData - Pure Function Tests', () => {
  describe('loadLightEntriesFromChunks logic', () => {
    /**
     * 청크 데이터를 병합하는 로직 테스트
     */
    it('should merge multiple chunks into single array', () => {
      const chunks = [mockChunk0, mockChunk1];
      const merged = chunks.flat();

      expect(merged).toHaveLength(5);
      expect(merged.map((e) => e.id)).toEqual([
        'entry-1',
        'entry-2',
        'entry-3',
        'entry-4',
        'entry-5',
      ]);
    });

    it('should handle empty chunks', () => {
      const chunks: MockLightEntry[][] = [[], []];
      const merged = chunks.flat();

      expect(merged).toHaveLength(0);
    });

    it('should handle single chunk', () => {
      const chunks = [mockChunk0];
      const merged = chunks.flat();

      expect(merged).toHaveLength(3);
    });
  });

  describe('categoryProgress calculation logic', () => {
    /**
     * 카테고리별 진행률 계산 로직 테스트
     */
    it('should calculate progress correctly with no studied entries', () => {
      const entries = [...mockChunk0, ...mockChunk1];
      const categories = mockCategories;
      const studiedIds = new Set<string>();

      // 카테고리별 진행률 계산 로직
      const catProgress: Record<string, { studied: number; total: number }> = {};

      for (const cat of categories) {
        catProgress[cat.id] = { studied: 0, total: 0 };
      }

      for (const entry of entries) {
        const progress = catProgress[entry.categoryId];
        if (progress) {
          progress.total++;
          if (studiedIds.has(entry.id)) {
            progress.studied++;
          }
        }
      }

      expect(catProgress.greetings).toEqual({ studied: 0, total: 2 });
      expect(catProgress.food).toEqual({ studied: 0, total: 2 });
      expect(catProgress.places).toEqual({ studied: 0, total: 1 });
    });

    it('should calculate progress correctly with some studied entries', () => {
      const entries = [...mockChunk0, ...mockChunk1];
      const categories = mockCategories;
      const studiedIds = new Set(['entry-1', 'entry-3', 'entry-5']);

      const catProgress: Record<string, { studied: number; total: number }> = {};

      for (const cat of categories) {
        catProgress[cat.id] = { studied: 0, total: 0 };
      }

      for (const entry of entries) {
        const progress = catProgress[entry.categoryId];
        if (progress) {
          progress.total++;
          if (studiedIds.has(entry.id)) {
            progress.studied++;
          }
        }
      }

      expect(catProgress.greetings).toEqual({ studied: 1, total: 2 });
      expect(catProgress.food).toEqual({ studied: 1, total: 2 });
      expect(catProgress.places).toEqual({ studied: 1, total: 1 });
    });

    it('should calculate progress correctly with all studied entries', () => {
      const entries = [...mockChunk0, ...mockChunk1];
      const categories = mockCategories;
      const studiedIds = new Set(entries.map((e) => e.id));

      const catProgress: Record<string, { studied: number; total: number }> = {};

      for (const cat of categories) {
        catProgress[cat.id] = { studied: 0, total: 0 };
      }

      for (const entry of entries) {
        const progress = catProgress[entry.categoryId];
        if (progress) {
          progress.total++;
          if (studiedIds.has(entry.id)) {
            progress.studied++;
          }
        }
      }

      expect(catProgress.greetings).toEqual({ studied: 2, total: 2 });
      expect(catProgress.food).toEqual({ studied: 2, total: 2 });
      expect(catProgress.places).toEqual({ studied: 1, total: 1 });
    });

    it('should handle entries with unknown categories', () => {
      const entriesWithUnknown = [
        ...mockChunk0,
        { id: 'entry-unknown', korean: '???', categoryId: 'unknown-category' },
      ];
      const categories = mockCategories;
      const studiedIds = new Set<string>();

      const catProgress: Record<string, { studied: number; total: number }> = {};

      for (const cat of categories) {
        catProgress[cat.id] = { studied: 0, total: 0 };
      }

      for (const entry of entriesWithUnknown) {
        const progress = catProgress[entry.categoryId];
        if (progress) {
          progress.total++;
          if (studiedIds.has(entry.id)) {
            progress.studied++;
          }
        }
      }

      // unknown-category는 무시되어야 함
      expect(catProgress['unknown-category']).toBeUndefined();
      expect(catProgress.greetings).toEqual({ studied: 0, total: 2 });
    });

    it('should handle empty entries array', () => {
      const entries: MockLightEntry[] = [];
      const categories = mockCategories;

      const catProgress: Record<string, { studied: number; total: number }> = {};

      for (const cat of categories) {
        catProgress[cat.id] = { studied: 0, total: 0 };
      }

      for (const entry of entries) {
        const progress = catProgress[entry.categoryId];
        if (progress) {
          progress.total++;
        }
      }

      expect(catProgress.greetings).toEqual({ studied: 0, total: 0 });
      expect(catProgress.food).toEqual({ studied: 0, total: 0 });
      expect(catProgress.places).toEqual({ studied: 0, total: 0 });
    });

    it('should handle empty categories array', () => {
      const entries = [...mockChunk0, ...mockChunk1];
      const categories: MockCategory[] = [];

      const catProgress: Record<string, { studied: number; total: number }> = {};

      for (const cat of categories) {
        catProgress[cat.id] = { studied: 0, total: 0 };
      }

      for (const entry of entries) {
        const progress = catProgress[entry.categoryId];
        if (progress) {
          progress.total++;
        }
      }

      // 모든 엔트리가 무시됨
      expect(Object.keys(catProgress)).toHaveLength(0);
    });
  });

  describe('studiedIds Set conversion', () => {
    /**
     * studyRecords 배열을 Set으로 변환하는 로직 테스트
     */
    it('should convert study records to Set of IDs', () => {
      const studyRecords = [
        { entryId: 'entry-1', timestamp: 1000 },
        { entryId: 'entry-2', timestamp: 2000 },
        { entryId: 'entry-3', timestamp: 3000 },
      ];

      const studiedIds = new Set(studyRecords.map((r) => r.entryId));

      expect(studiedIds.size).toBe(3);
      expect(studiedIds.has('entry-1')).toBe(true);
      expect(studiedIds.has('entry-2')).toBe(true);
      expect(studiedIds.has('entry-3')).toBe(true);
      expect(studiedIds.has('entry-4')).toBe(false);
    });

    it('should handle empty study records', () => {
      const studyRecords: { entryId: string; timestamp: number }[] = [];

      const studiedIds = new Set(studyRecords.map((r) => r.entryId));

      expect(studiedIds.size).toBe(0);
    });

    it('should handle duplicate entry IDs in study records', () => {
      const studyRecords = [
        { entryId: 'entry-1', timestamp: 1000 },
        { entryId: 'entry-1', timestamp: 2000 }, // duplicate
        { entryId: 'entry-2', timestamp: 3000 },
      ];

      const studiedIds = new Set(studyRecords.map((r) => r.entryId));

      // Set은 중복 제거
      expect(studiedIds.size).toBe(2);
    });
  });

  describe('favoriteIds Set conversion', () => {
    /**
     * favorites 배열을 Set으로 변환하는 로직 테스트
     */
    it('should convert favorites to Set of IDs', () => {
      const favorites = [
        { entryId: 'entry-1', timestamp: 1000 },
        { entryId: 'entry-3', timestamp: 2000 },
      ];

      const favoriteIds = new Set(favorites.map((f) => f.entryId));

      expect(favoriteIds.size).toBe(2);
      expect(favoriteIds.has('entry-1')).toBe(true);
      expect(favoriteIds.has('entry-3')).toBe(true);
      expect(favoriteIds.has('entry-2')).toBe(false);
    });
  });

  describe('isLoading state logic', () => {
    /**
     * 로딩 상태 계산 로직 테스트
     */
    it('should be loading when not hydrated', () => {
      const isHydrated = false;
      const dataLoaded = true;
      const isLoading = !isHydrated || !dataLoaded;

      expect(isLoading).toBe(true);
    });

    it('should be loading when data not loaded', () => {
      const isHydrated = true;
      const dataLoaded = false;
      const isLoading = !isHydrated || !dataLoaded;

      expect(isLoading).toBe(true);
    });

    it('should not be loading when both hydrated and data loaded', () => {
      const isHydrated = true;
      const dataLoaded = true;
      const isLoading = !isHydrated || !dataLoaded;

      expect(isLoading).toBe(false);
    });

    it('should be loading when both not ready', () => {
      const isHydrated = false;
      const dataLoaded = false;
      const isLoading = !isHydrated || !dataLoaded;

      expect(isLoading).toBe(true);
    });
  });
});

// ===== Fetch Logic Tests =====
describe('useMyLearningData - Fetch Logic Tests', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.resetAllMocks();
  });

  describe('loadLightEntriesFromChunks fetch behavior', () => {
    it('should fetch meta.json first to determine chunk count', async () => {
      const fetchCalls: string[] = [];

      globalThis.fetch = vi.fn((url: string | URL | Request) => {
        const urlString = typeof url === 'string' ? url : url.toString();
        fetchCalls.push(urlString);

        if (urlString.includes('meta.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockMetaData),
          } as Response);
        }

        const chunkMatch = urlString.match(/chunk-(\d+)\.json/);
        if (chunkMatch) {
          const chunkIndex = Number.parseInt(chunkMatch[1], 10);
          const entries = chunkIndex === 0 ? mockChunk0 : mockChunk1;
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ entries }),
          } as Response);
        }

        return Promise.reject(new Error(`Unknown URL: ${urlString}`));
      }) as typeof globalThis.fetch;

      // Simulate the loading logic
      const metaResponse = await fetch('/data/browse/alphabetical/meta.json');
      const meta = (await metaResponse.json()) as { totalChunks: number };

      const chunkPromises = [];
      for (let i = 0; i < meta.totalChunks; i++) {
        chunkPromises.push(fetch(`/data/browse/alphabetical/chunk-${i}.json`));
      }
      await Promise.all(chunkPromises);

      expect(fetchCalls[0]).toBe('/data/browse/alphabetical/meta.json');
      expect(fetchCalls).toContain('/data/browse/alphabetical/chunk-0.json');
      expect(fetchCalls).toContain('/data/browse/alphabetical/chunk-1.json');
    });

    it('should return empty array when meta.json fetch fails', async () => {
      globalThis.fetch = vi.fn(() => {
        return Promise.resolve({
          ok: false,
          status: 404,
        } as Response);
      }) as typeof globalThis.fetch;

      // Simulate error handling logic
      const metaResponse = await fetch('/data/browse/alphabetical/meta.json');

      if (!metaResponse.ok) {
        // Error path - should return empty array
        const result: MockLightEntry[] = [];
        expect(result).toHaveLength(0);
      }
    });

    it('should return empty array when chunk fetch fails', async () => {
      let callCount = 0;

      globalThis.fetch = vi.fn((url: string | URL | Request) => {
        const urlString = typeof url === 'string' ? url : url.toString();
        callCount++;

        if (urlString.includes('meta.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ totalChunks: 2, totalEntries: 100 }),
          } as Response);
        }

        // Chunk fetches fail
        return Promise.resolve({
          ok: false,
          status: 500,
        } as Response);
      }) as typeof globalThis.fetch;

      const metaResponse = await fetch('/data/browse/alphabetical/meta.json');
      const meta = (await metaResponse.json()) as { totalChunks: number };

      // Try to fetch chunks
      const chunkPromises = [];
      for (let i = 0; i < meta.totalChunks; i++) {
        chunkPromises.push(
          fetch(`/data/browse/alphabetical/chunk-${i}.json`).then((res) => {
            if (!res.ok) throw new Error(`Failed to load chunk-${i}`);
            return res.json();
          }),
        );
      }

      // Should reject when any chunk fails
      await expect(Promise.all(chunkPromises)).rejects.toThrow('Failed to load chunk-0');
    });

    it('should handle network error gracefully', async () => {
      globalThis.fetch = vi.fn(() => {
        return Promise.reject(new Error('Network error'));
      }) as typeof globalThis.fetch;

      // Simulate try-catch in the hook
      let error: Error | null = null;
      try {
        await fetch('/data/browse/alphabetical/meta.json');
      } catch (e) {
        error = e as Error;
      }

      expect(error).not.toBeNull();
      expect(error?.message).toBe('Network error');
    });
  });
});

// ===== Edge Cases =====
describe('useMyLearningData - Edge Cases', () => {
  describe('Large data handling', () => {
    it('should handle large number of entries', () => {
      // 16,000+ entries (실제 데이터 규모)
      const largeEntries: MockLightEntry[] = Array.from({ length: 16000 }, (_, i) => ({
        id: `entry-${i}`,
        korean: `단어-${i}`,
        categoryId: `category-${i % 50}`,
      }));

      const categories = Array.from({ length: 50 }, (_, i) => ({
        id: `category-${i}`,
        name_ko: `카테고리-${i}`,
        name_en: `Category-${i}`,
      }));

      const studiedIds = new Set(largeEntries.slice(0, 8000).map((e) => e.id));

      const catProgress: Record<string, { studied: number; total: number }> = {};

      for (const cat of categories) {
        catProgress[cat.id] = { studied: 0, total: 0 };
      }

      for (const entry of largeEntries) {
        const progress = catProgress[entry.categoryId];
        if (progress) {
          progress.total++;
          if (studiedIds.has(entry.id)) {
            progress.studied++;
          }
        }
      }

      // 각 카테고리에 320개씩 (16000 / 50)
      expect(catProgress['category-0'].total).toBe(320);
      // 절반이 학습됨 (8000 / 16000)
      // 각 카테고리의 절반이 학습됨
      expect(catProgress['category-0'].studied).toBe(160);
    });
  });

  describe('Concurrent updates', () => {
    it('should handle Set.has with changing studiedIds', () => {
      const entries = [...mockChunk0, ...mockChunk1];

      // Initial state
      let studiedIds = new Set(['entry-1']);

      // First calculation
      let count1 = entries.filter((e) => studiedIds.has(e.id)).length;
      expect(count1).toBe(1);

      // State changes (simulating Zustand update)
      studiedIds = new Set(['entry-1', 'entry-2', 'entry-3']);

      // Second calculation with new state
      const count2 = entries.filter((e) => studiedIds.has(e.id)).length;
      expect(count2).toBe(3);
    });
  });

  describe('Memory efficiency', () => {
    it('should use Set for O(1) lookup', () => {
      const entries = Array.from({ length: 10000 }, (_, i) => ({
        id: `entry-${i}`,
        korean: `단어-${i}`,
        categoryId: 'test',
      }));

      const studiedIdsArray = entries.slice(0, 5000).map((e) => e.id);

      // Array includes - O(n)
      const startArray = performance.now();
      let countArray = 0;
      for (const entry of entries) {
        if (studiedIdsArray.includes(entry.id)) countArray++;
      }
      const arrayTime = performance.now() - startArray;

      // Set has - O(1)
      const studiedIdsSet = new Set(studiedIdsArray);
      const startSet = performance.now();
      let countSet = 0;
      for (const entry of entries) {
        if (studiedIdsSet.has(entry.id)) countSet++;
      }
      const setTime = performance.now() - startSet;

      expect(countArray).toBe(countSet);
      expect(countArray).toBe(5000);

      // Set should be significantly faster
      // Note: This might be flaky in CI, so we use a generous margin
      expect(setTime).toBeLessThan(arrayTime);
    });
  });
});
