/**
 * User Data Store - Zustand + localStorage
 *
 * SSG 호환: 서버에서는 빈 상태, 클라이언트에서 hydration 후 로드
 * dialogue 앱의 chat-store.ts 패턴을 따름
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ========================================
// Types
// ========================================

export interface FavoriteEntry {
  entryId: string;
  addedAt: number; // timestamp
}

export interface StudyRecord {
  entryId: string;
  studiedAt: number; // timestamp
  correct: boolean;
}

interface UserDataState {
  favorites: FavoriteEntry[];
  studyRecords: StudyRecord[];
  isHydrated: boolean;
}

interface UserDataActions {
  setHydrated: () => void;
  pruneLegacyEntries: () => void;
  pruneOldStudyRecords: () => void;

  // Favorites
  addFavorite: (entryId: string) => void;
  removeFavorite: (entryId: string) => void;
  toggleFavorite: (entryId: string) => boolean;
  isFavorite: (entryId: string) => boolean;
  getFavoriteIds: () => Set<string>;
  getFavorites: () => FavoriteEntry[];

  // Study Records
  markAsStudied: (entryId: string, correct?: boolean) => void;
  isStudied: (entryId: string) => boolean;
  getStudiedIds: () => Set<string>;
  getStudyRecords: () => StudyRecord[];
  getTodayStudiedCount: () => number;

  // Stats
  getOverallProgress: (totalEntries: number) => {
    studied: number;
    total: number;
    percentage: number;
  };
}

// ========================================
// Constants
// ========================================

/**
 * 학습 기록 보존 기간 (일)
 * 90일 이전의 기록은 자동 정리됨
 */
const STUDY_RECORD_RETENTION_DAYS = 90;

/**
 * 엔트리당 최대 학습 기록 수
 * 같은 엔트리의 기록이 이 수를 초과하면 오래된 것부터 삭제
 */
const MAX_RECORDS_PER_ENTRY = 10;

// ========================================
// Store
// ========================================

export const useUserDataStore = create<UserDataState & UserDataActions>()(
  persist(
    (set, get) => ({
      // Initial state
      favorites: [],
      studyRecords: [],
      isHydrated: false,

      // Actions
      setHydrated: () => set({ isHydrated: true }),
      pruneLegacyEntries: () => {
        // Only run in the browser; legacy entries can linger in localStorage.
        if (typeof window === 'undefined') return;

        void (async () => {
          try {
            const { entryIndex } = await import('@/data/generated/entry-index');
            const isValid = (id: string) => Boolean(entryIndex[id]);

            const favorites = get().favorites.filter((f) => isValid(f.entryId));
            const studyRecords = get().studyRecords.filter((r) => isValid(r.entryId));

            if (
              favorites.length !== get().favorites.length ||
              studyRecords.length !== get().studyRecords.length
            ) {
              set({ favorites, studyRecords });
            }
          } catch (error) {
            console.error('[UserDataStore] Failed to prune legacy entries:', error);
          }
        })();
      },

      /**
       * 오래된 학습 기록 정리
       *
       * 1. STUDY_RECORD_RETENTION_DAYS(90일) 이전 기록 삭제
       * 2. 엔트리당 MAX_RECORDS_PER_ENTRY(10개) 초과 시 오래된 것 삭제
       *
       * 이 함수는 hydration 시 자동 호출됨
       */
      pruneOldStudyRecords: () => {
        if (typeof window === 'undefined') return;

        const records = get().studyRecords;
        if (records.length === 0) return;

        const now = Date.now();
        const retentionMs = STUDY_RECORD_RETENTION_DAYS * 24 * 60 * 60 * 1000;
        const cutoffTime = now - retentionMs;

        // 1단계: 오래된 기록 필터링
        const recentRecords = records.filter((r) => r.studiedAt >= cutoffTime);

        // 2단계: 엔트리당 최대 기록 수 제한
        // 최신 기록부터 유지하므로 배열은 이미 최신순 정렬되어 있음
        const entryRecordCount = new Map<string, number>();
        const prunedRecords: StudyRecord[] = [];

        for (const record of recentRecords) {
          const count = entryRecordCount.get(record.entryId) || 0;
          if (count < MAX_RECORDS_PER_ENTRY) {
            prunedRecords.push(record);
            entryRecordCount.set(record.entryId, count + 1);
          }
        }

        // 변경이 있을 때만 업데이트
        if (prunedRecords.length !== records.length) {
          set({ studyRecords: prunedRecords });
        }
      },

      // ========================================
      // Favorites
      // ========================================
      addFavorite: (entryId) => {
        const state = get();
        if (state.favorites.some((f) => f.entryId === entryId)) return;

        set({
          favorites: [{ entryId, addedAt: Date.now() }, ...state.favorites],
        });
      },

      removeFavorite: (entryId) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.entryId !== entryId),
        }));
      },

      toggleFavorite: (entryId) => {
        const state = get();
        const exists = state.favorites.some((f) => f.entryId === entryId);

        if (exists) {
          set({ favorites: state.favorites.filter((f) => f.entryId !== entryId) });
          return false;
        }
        set({ favorites: [{ entryId, addedAt: Date.now() }, ...state.favorites] });
        return true;
      },

      isFavorite: (entryId) => {
        return get().favorites.some((f) => f.entryId === entryId);
      },

      getFavoriteIds: () => {
        return new Set(get().favorites.map((f) => f.entryId));
      },

      getFavorites: () => {
        return get().favorites;
      },

      // ========================================
      // Study Records
      // ========================================
      markAsStudied: (entryId, correct = true) => {
        const state = get();
        // 이미 학습한 경우에도 새 기록 추가 (학습 횟수 추적)
        set({
          studyRecords: [{ entryId, studiedAt: Date.now(), correct }, ...state.studyRecords],
        });
      },

      isStudied: (entryId) => {
        return get().studyRecords.some((r) => r.entryId === entryId);
      },

      getStudiedIds: () => {
        const ids = new Set<string>();
        for (const r of get().studyRecords) {
          ids.add(r.entryId);
        }
        return ids;
      },

      getStudyRecords: () => {
        return get().studyRecords;
      },

      getTodayStudiedCount: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        const todayIds = new Set<string>();
        for (const r of get().studyRecords) {
          if (r.studiedAt >= todayTimestamp) {
            todayIds.add(r.entryId);
          }
        }
        return todayIds.size;
      },

      // ========================================
      // Stats
      // ========================================
      getOverallProgress: (totalEntries) => {
        const studied = get().getStudiedIds().size;
        return {
          studied,
          total: totalEntries,
          percentage: totalEntries > 0 ? (studied / totalEntries) * 100 : 0,
        };
      },
    }),
    {
      name: 'context-user-data',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        studyRecords: state.studyRecords,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[UserDataStore] Rehydration error:', error);
        }
        state?.setHydrated();
        state?.pruneLegacyEntries();
        state?.pruneOldStudyRecords();
      },
    },
  ),
);

// ========================================
// Selector Hooks (Performance Optimization)
// ========================================
// 각 selector hook은 해당 상태만 구독하여 불필요한 리렌더 방지

/**
 * Hydration 상태 확인
 * SSG 페이지에서 로딩 상태 렌더링 방지용
 */
export const useIsHydrated = () => useUserDataStore((s) => s.isHydrated);

/**
 * 즐겨찾기 목록 (배열)
 */
export const useFavorites = () => useUserDataStore((s) => s.favorites);

/**
 * 학습 기록 목록 (배열)
 */
export const useStudyRecords = () => useUserDataStore((s) => s.studyRecords);

/**
 * 즐겨찾기 액션들만 구독
 */
export const useFavoriteActions = () =>
  useUserDataStore((s) => ({
    addFavorite: s.addFavorite,
    removeFavorite: s.removeFavorite,
    toggleFavorite: s.toggleFavorite,
    isFavorite: s.isFavorite,
  }));

/**
 * 학습 액션들만 구독
 */
export const useStudyActions = () =>
  useUserDataStore((s) => ({
    markAsStudied: s.markAsStudied,
    isStudied: s.isStudied,
    getStudiedIds: s.getStudiedIds,
    getTodayStudiedCount: s.getTodayStudiedCount,
  }));

/**
 * 진행률 계산 함수만 구독
 */
export const useProgressCalculator = () => useUserDataStore((s) => s.getOverallProgress);
