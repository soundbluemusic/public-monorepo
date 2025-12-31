/**
 * @fileoverview Browser Storage Implementation
 * @environment client-only
 *
 * IndexedDB 기반 영구 저장소 구현.
 * Dexie.js를 사용하여 즐겨찾기, 최근 본 항목, 설정을 저장합니다.
 *
 * **특징:**
 * - 앱별 독립된 IndexedDB 데이터베이스
 * - 비동기 CRUD 작업
 * - 최근 본 항목 자동 정리 (maxItems 초과 시)
 * - 타입 안전 StorageAdapter 인터페이스
 *
 * @example
 * ```typescript
 * import { storage } from '@soundblue/platform/storage';
 *
 * // 즐겨찾기 스토리지 생성
 * const favoritesStorage = storage.createFavoritesStorage('context-app');
 *
 * // 즐겨찾기 추가
 * await favoritesStorage.set('entry-123', {
 *   id: 'entry-123',
 *   title: 'Hello',
 *   addedAt: Date.now(),
 * });
 *
 * // 모든 즐겨찾기 가져오기
 * const favorites = await favoritesStorage.getAll();
 * ```
 */

import Dexie, { type EntityTable } from 'dexie';
import type {
  FavoriteItem,
  RecentViewItem,
  SettingsData,
  StorageAdapter,
  StorageFactory,
} from './types';

// Re-export types
export type { FavoriteItem, RecentViewItem, SettingsData, StorageAdapter } from './types';

/**
 * 즐겨찾기 IndexedDB 데이터베이스
 * @internal
 */
class FavoritesDB extends Dexie {
  favorites!: EntityTable<FavoriteItem, 'id'>;

  constructor(dbName: string) {
    super(`${dbName}-favorites`);
    this.version(1).stores({
      favorites: 'id, addedAt',
    });
  }
}

/**
 * 최근 본 항목 IndexedDB 데이터베이스
 * @internal
 */
class RecentViewsDB extends Dexie {
  recentViews!: EntityTable<RecentViewItem, 'id'>;

  constructor(dbName: string) {
    super(`${dbName}-recent`);
    this.version(1).stores({
      recentViews: 'id, viewedAt',
    });
  }
}

/**
 * 설정 IndexedDB 데이터베이스
 * @internal
 */
class SettingsDB extends Dexie {
  settings!: EntityTable<SettingsData & { id: string }, 'id'>;

  constructor(dbName: string) {
    super(`${dbName}-settings`);
    this.version(1).stores({
      settings: 'id',
    });
  }
}

/**
 * 즐겨찾기 저장소를 생성합니다.
 *
 * IndexedDB에 즐겨찾기 항목을 저장합니다.
 * 각 앱은 독립된 데이터베이스를 사용합니다 (`{dbName}-favorites`).
 *
 * @param dbName - 데이터베이스 이름 접두어 (예: 'context-app')
 * @returns 즐겨찾기용 StorageAdapter
 *
 * @example
 * ```typescript
 * const favorites = createBrowserFavoritesStorage('context-app');
 *
 * // 즐겨찾기 추가
 * await favorites.set('word-hello', {
 *   id: 'word-hello',
 *   title: 'Hello',
 *   addedAt: Date.now(),
 * });
 *
 * // 특정 항목 조회
 * const item = await favorites.get('word-hello');
 *
 * // 모든 즐겨찾기 (최신순)
 * const all = await favorites.getAll();
 *
 * // 삭제
 * await favorites.delete('word-hello');
 * ```
 */
function createBrowserFavoritesStorage(dbName: string): StorageAdapter<FavoriteItem> {
  const db = new FavoritesDB(dbName);

  return {
    async get(id: string) {
      return db.favorites.get(id);
    },
    async set(id: string, value: FavoriteItem) {
      await db.favorites.put({ ...value, id });
    },
    async delete(id: string) {
      await db.favorites.delete(id);
    },
    async getAll() {
      return db.favorites.orderBy('addedAt').reverse().toArray();
    },
    async clear() {
      await db.favorites.clear();
    },
  };
}

/**
 * 최근 본 항목 저장소를 생성합니다.
 *
 * IndexedDB에 최근 본 항목을 저장합니다.
 * maxItems를 초과하면 가장 오래된 항목이 자동으로 삭제됩니다.
 *
 * @param dbName - 데이터베이스 이름 접두어 (예: 'context-app')
 * @param maxItems - 저장할 최대 항목 수 (기본값: 50)
 * @returns 최근 본 항목용 StorageAdapter
 *
 * @example
 * ```typescript
 * // 최대 30개 항목만 저장
 * const recentViews = createBrowserRecentViewsStorage('context-app', 30);
 *
 * // 항목 조회 기록
 * await recentViews.set('word-hello', {
 *   id: 'word-hello',
 *   title: 'Hello',
 *   viewedAt: Date.now(),
 * });
 *
 * // 최근 본 항목 목록 (최신순)
 * const history = await recentViews.getAll();
 * ```
 */
function createBrowserRecentViewsStorage(
  dbName: string,
  maxItems = 50,
): StorageAdapter<RecentViewItem> {
  const db = new RecentViewsDB(dbName);

  return {
    async get(id: string) {
      return db.recentViews.get(id);
    },
    async set(id: string, value: RecentViewItem) {
      await db.recentViews.put({ ...value, id });
      // Trim old entries
      const count = await db.recentViews.count();
      if (count > maxItems) {
        const oldest = await db.recentViews
          .orderBy('viewedAt')
          .limit(count - maxItems)
          .toArray();
        const idsToDelete = oldest.map((item) => item.id);
        await db.recentViews.bulkDelete(idsToDelete);
      }
    },
    async delete(id: string) {
      await db.recentViews.delete(id);
    },
    async getAll() {
      return db.recentViews.orderBy('viewedAt').reverse().toArray();
    },
    async clear() {
      await db.recentViews.clear();
    },
  };
}

/**
 * 설정 저장소를 생성합니다.
 *
 * IndexedDB에 앱 설정을 저장합니다.
 * 단일 설정 객체만 저장되며, 키 파라미터는 무시됩니다.
 *
 * @param dbName - 데이터베이스 이름 접두어 (예: 'context-app')
 * @returns 설정용 StorageAdapter
 *
 * @example
 * ```typescript
 * const settingsStorage = createBrowserSettingsStorage('context-app');
 *
 * // 설정 저장
 * await settingsStorage.set('_', {
 *   theme: 'dark',
 *   language: 'ko',
 *   fontSize: 'medium',
 * });
 *
 * // 설정 조회
 * const settings = await settingsStorage.get('_');
 * console.log(settings?.theme); // 'dark'
 * ```
 */
function createBrowserSettingsStorage(dbName: string): StorageAdapter<SettingsData> {
  const db = new SettingsDB(dbName);
  const SETTINGS_KEY = 'app-settings';

  return {
    async get(_key: string) {
      const result = await db.settings.get(SETTINGS_KEY);
      if (result) {
        const { id: _id, ...settings } = result;
        return settings as SettingsData;
      }
      return undefined;
    },
    async set(_key: string, value: SettingsData) {
      await db.settings.put({ ...value, id: SETTINGS_KEY });
    },
    async delete(_key: string) {
      await db.settings.delete(SETTINGS_KEY);
    },
    async getAll() {
      const result = await db.settings.get(SETTINGS_KEY);
      if (result) {
        const { id: _id, ...settings } = result;
        return [settings as SettingsData];
      }
      return [];
    },
    async clear() {
      await db.settings.clear();
    },
  };
}

/**
 * 브라우저 저장소 팩토리
 *
 * IndexedDB 기반 저장소 인스턴스를 생성하는 팩토리 객체입니다.
 * 각 앱에서 이 팩토리를 사용하여 독립된 저장소를 생성합니다.
 *
 * @example
 * ```typescript
 * import { storage } from '@soundblue/platform/storage';
 *
 * // 앱 초기화 시 저장소 생성
 * const appStorage = {
 *   favorites: storage.createFavoritesStorage('my-app'),
 *   recentViews: storage.createRecentViewsStorage('my-app', 100),
 *   settings: storage.createSettingsStorage('my-app'),
 * };
 *
 * // 컴포넌트에서 사용
 * async function toggleFavorite(id: string, item: FavoriteItem) {
 *   const existing = await appStorage.favorites.get(id);
 *   if (existing) {
 *     await appStorage.favorites.delete(id);
 *   } else {
 *     await appStorage.favorites.set(id, item);
 *   }
 * }
 * ```
 */
export const storage: StorageFactory = {
  /** 즐겨찾기 저장소 생성 */
  createFavoritesStorage: createBrowserFavoritesStorage,
  /** 최근 본 항목 저장소 생성 */
  createRecentViewsStorage: createBrowserRecentViewsStorage,
  /** 설정 저장소 생성 */
  createSettingsStorage: createBrowserSettingsStorage,
};

export default storage;
