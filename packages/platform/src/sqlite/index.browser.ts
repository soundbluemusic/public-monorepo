/**
 * 오프라인 SQLite 저장소 (브라우저 구현)
 *
 * IndexedDB를 사용하여 D1 데이터를 로컬에 저장합니다.
 * wa-sqlite 대신 Dexie를 사용하여 더 넓은 브라우저 호환성을 제공합니다.
 *
 * @environment client-only
 */

import Dexie, { type EntityTable } from 'dexie';
import type {
  D1CategoryRow,
  D1ConversationRow,
  D1DumpResponse,
  D1EntryRow,
  DownloadProgress,
  OfflineDBMeta,
  OfflineDBStatus,
  OfflineSQLiteAdapter,
} from './types';

const DB_NAME = 'context-offline';
const DB_VERSION = 1;
const API_ENDPOINT = '/api/offline-db';

/**
 * Dexie 데이터베이스 스키마
 */
class OfflineDatabase extends Dexie {
  entries!: EntityTable<D1EntryRow, 'id'>;
  categories!: EntityTable<D1CategoryRow, 'id'>;
  conversations!: EntityTable<D1ConversationRow, 'id'>;
  meta!: EntityTable<OfflineDBMeta & { id: string }, 'id'>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores({
      entries: 'id, category_id',
      categories: 'id, sort_order',
      conversations: 'id, category_id',
      meta: 'id',
    });
  }
}

/**
 * 오프라인 SQLite 어댑터 구현
 */
class OfflineSQLiteAdapterImpl implements OfflineSQLiteAdapter {
  private db: OfflineDatabase | null = null;
  private status: OfflineDBStatus = 'not-downloaded';
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.doInit();
    return this.initPromise;
  }

  private async doInit(): Promise<void> {
    try {
      this.db = new OfflineDatabase();
      await this.db.open();

      // 메타데이터 확인하여 상태 결정
      const meta = await this.db.meta.get('main');
      if (meta && meta.entriesCount > 0) {
        this.status = 'ready';
      } else {
        this.status = 'not-downloaded';
      }
    } catch (error) {
      console.error('Failed to initialize offline database:', error);
      this.status = 'error';
      throw error;
    }
  }

  getStatus(): OfflineDBStatus {
    return this.status;
  }

  async getMeta(): Promise<OfflineDBMeta | null> {
    await this.init();
    if (!this.db) return null;

    const meta = await this.db.meta.get('main');
    if (!meta) return null;

    // id 필드 제거하고 반환
    const { id: _, ...rest } = meta;
    return rest;
  }

  async download(onProgress?: (progress: DownloadProgress) => void): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    this.status = 'downloading';

    try {
      // 1. 데이터 가져오기
      onProgress?.({ phase: 'fetching', percent: 0 });

      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? Number.parseInt(contentLength, 10) : 0;

      // 스트림으로 진행률 추적
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const chunks: Uint8Array[] = [];
      let loaded = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;

        if (total > 0) {
          onProgress?.({
            phase: 'fetching',
            percent: Math.round((loaded / total) * 50),
            bytesLoaded: loaded,
            bytesTotal: total,
          });
        }
      }

      // 2. JSON 파싱
      onProgress?.({ phase: 'parsing', percent: 50 });

      const decoder = new TextDecoder();
      const jsonString = chunks.map((chunk) => decoder.decode(chunk, { stream: true })).join('');
      const data: D1DumpResponse = JSON.parse(jsonString);

      // 3. IndexedDB에 저장
      onProgress?.({ phase: 'storing', percent: 60 });

      // 기존 데이터 삭제
      await Promise.all([
        this.db.entries.clear(),
        this.db.categories.clear(),
        this.db.conversations.clear(),
      ]);

      // 배치로 데이터 삽입 (성능 최적화)
      const BATCH_SIZE = 1000;
      const entries = data.tables.entries;
      const totalEntries = entries.length;

      for (let i = 0; i < totalEntries; i += BATCH_SIZE) {
        const batch = entries.slice(i, i + BATCH_SIZE);
        await this.db.entries.bulkAdd(batch);

        const progress = 60 + Math.round(((i + batch.length) / totalEntries) * 30);
        onProgress?.({ phase: 'storing', percent: progress });
      }

      // 카테고리와 대화 저장
      await this.db.categories.bulkAdd(data.tables.categories);
      await this.db.conversations.bulkAdd(data.tables.conversations);

      // 메타데이터 저장
      const meta: OfflineDBMeta & { id: string } = {
        id: 'main',
        version: data.version,
        downloadedAt: Date.now(),
        entriesCount: data.meta.entriesCount,
        categoriesCount: data.meta.categoriesCount,
        conversationsCount: data.meta.conversationsCount,
      };
      await this.db.meta.put(meta);

      onProgress?.({ phase: 'complete', percent: 100 });
      this.status = 'ready';
    } catch (error) {
      this.status = 'error';
      throw error;
    }
  }

  async getEntry(id: string): Promise<D1EntryRow | null> {
    await this.init();
    if (!this.db || this.status !== 'ready') return null;

    return (await this.db.entries.get(id)) ?? null;
  }

  async getEntriesByCategory(categoryId: string): Promise<D1EntryRow[]> {
    await this.init();
    if (!this.db || this.status !== 'ready') return [];

    return this.db.entries.where('category_id').equals(categoryId).toArray();
  }

  async getCategories(): Promise<D1CategoryRow[]> {
    await this.init();
    if (!this.db || this.status !== 'ready') return [];

    return this.db.categories.orderBy('sort_order').toArray();
  }

  async getConversationsByCategory(categoryId: string): Promise<D1ConversationRow[]> {
    await this.init();
    if (!this.db || this.status !== 'ready') return [];

    return this.db.conversations.where('category_id').equals(categoryId).toArray();
  }

  async clear(): Promise<void> {
    await this.init();
    if (!this.db) return;

    await Promise.all([
      this.db.entries.clear(),
      this.db.categories.clear(),
      this.db.conversations.clear(),
      this.db.meta.clear(),
    ]);

    this.status = 'not-downloaded';
  }

  async checkForUpdate(): Promise<{ hasUpdate: boolean; serverVersion: number }> {
    await this.init();

    try {
      // HEAD 요청으로 버전만 확인
      const response = await fetch(API_ENDPOINT, { method: 'HEAD' });
      const serverVersion = Number.parseInt(response.headers.get('X-Data-Version') || '0', 10);

      const meta = await this.getMeta();
      const localVersion = meta?.version || 0;

      return {
        hasUpdate: serverVersion > localVersion,
        serverVersion,
      };
    } catch {
      return { hasUpdate: false, serverVersion: 0 };
    }
  }
}

// 싱글톤 인스턴스
let instance: OfflineSQLiteAdapter | null = null;

/**
 * 오프라인 SQLite 어댑터 인스턴스 가져오기
 */
export function getOfflineSQLite(): OfflineSQLiteAdapter {
  if (!instance) {
    instance = new OfflineSQLiteAdapterImpl();
  }
  return instance;
}

// 타입 재내보내기
export type {
  DownloadProgress,
  OfflineDBMeta,
  OfflineDBStatus,
  OfflineSQLiteAdapter,
} from './types';
