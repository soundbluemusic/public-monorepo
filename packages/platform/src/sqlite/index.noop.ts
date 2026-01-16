/**
 * 오프라인 SQLite 저장소 (Noop 구현)
 *
 * SSR/빌드 환경에서 사용되는 빈 구현입니다.
 *
 * @environment build-only
 */

import type {
  D1CategoryRow,
  D1ConversationRow,
  D1EntryRow,
  DownloadProgress,
  OfflineDBMeta,
  OfflineDBStatus,
  OfflineSQLiteAdapter,
} from './types';

/**
 * Noop 오프라인 SQLite 어댑터
 */
class NoopOfflineSQLiteAdapter implements OfflineSQLiteAdapter {
  async init(): Promise<void> {
    // noop
  }

  getStatus(): OfflineDBStatus {
    return 'not-downloaded';
  }

  async getMeta(): Promise<OfflineDBMeta | null> {
    return null;
  }

  async download(_onProgress?: (progress: DownloadProgress) => void): Promise<void> {
    throw new Error('Offline SQLite is not available in server environment');
  }

  async getEntry(_id: string): Promise<D1EntryRow | null> {
    return null;
  }

  async getEntriesByCategory(_categoryId: string): Promise<D1EntryRow[]> {
    return [];
  }

  async getCategories(): Promise<D1CategoryRow[]> {
    return [];
  }

  async getConversationsByCategory(_categoryId: string): Promise<D1ConversationRow[]> {
    return [];
  }

  async clear(): Promise<void> {
    // noop
  }

  async checkForUpdate(): Promise<{ hasUpdate: boolean; serverVersion: number }> {
    return { hasUpdate: false, serverVersion: 0 };
  }
}

// 싱글톤 인스턴스
const instance: OfflineSQLiteAdapter = new NoopOfflineSQLiteAdapter();

/**
 * 오프라인 SQLite 어댑터 인스턴스 가져오기
 */
export function getOfflineSQLite(): OfflineSQLiteAdapter {
  return instance;
}

// 타입 재내보내기
export type {
  DownloadProgress,
  OfflineDBMeta,
  OfflineDBStatus,
  OfflineSQLiteAdapter,
} from './types';
