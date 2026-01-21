/**
 * @fileoverview Offline SQLite Storage (Browser Implementation)
 *
 * IndexedDB를 사용하여 Cloudflare D1 데이터를 로컬에 저장하는 어댑터입니다.
 * Context 앱의 PWA 오프라인 기능을 지원합니다.
 *
 * @module @soundblue/platform/sqlite
 * @environment client-only (브라우저에서만 동작)
 *
 * ## Architecture
 *
 * ```
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Browser (Client)                                           │
 * │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
 * │  │ React App    │ → │ This Adapter │ → │  IndexedDB    │  │
 * │  │ (Hooks)      │    │ (Dexie.js)   │    │  (Browser)   │  │
 * │  └──────────────┘    └──────────────┘    └──────────────┘  │
 * │         │                   │                              │
 * │         ▼                   ▼                              │
 * │  ┌──────────────────────────────────────────────────────┐  │
 * │  │  /api/offline-db (Cloudflare Workers + D1)           │  │
 * │  └──────────────────────────────────────────────────────┘  │
 * └─────────────────────────────────────────────────────────────┘
 * ```
 *
 * ## Download Flow
 *
 * ```
 * 1. fetch()          → 'fetching' (0-50%)   : 서버에서 JSON 스트리밍
 * 2. JSON.parse()     → 'parsing' (50-60%)   : JSON 파싱
 * 3. bulkAdd()        → 'storing' (60-90%)   : IndexedDB 배치 저장
 * 4. meta.put()       → 'complete' (100%)    : 메타데이터 저장
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { getOfflineSQLite } from '@soundblue/platform/sqlite';
 *
 * const sqlite = getOfflineSQLite();
 *
 * // 상태 확인
 * const status = sqlite.getStatus(); // 'not-downloaded' | 'ready' | ...
 *
 * // 다운로드 (진행률 콜백 포함)
 * await sqlite.download((progress) => {
 *   console.log(`${progress.phase}: ${progress.percent}%`);
 * });
 *
 * // 데이터 조회
 * const entry = await sqlite.getEntry('annyeong');
 * const categories = await sqlite.getCategories();
 *
 * // 업데이트 확인
 * const { hasUpdate } = await sqlite.checkForUpdate();
 * ```
 *
 * ## Why Dexie.js?
 *
 * wa-sqlite 대신 Dexie.js를 선택한 이유:
 * - **브라우저 호환성**: Safari/iOS에서 OPFS 지원 제한
 * - **번들 크기**: wa-sqlite WASM (~400KB) vs Dexie (~30KB)
 * - **안정성**: 프로덕션 검증된 IndexedDB 래퍼
 *
 * @see {@link ./types.ts} 타입 정의
 * @see {@link apps/context/app/routes/api.offline-db.tsx} 서버 API
 * @see {@link apps/context/app/services/offline-db.ts} 서비스 래퍼
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

/** IndexedDB 데이터베이스 이름 */
const DB_NAME = 'context-offline';

/** IndexedDB 스키마 버전 (마이그레이션 시 증가) */
const DB_VERSION = 1;

/** 오프라인 데이터 API 엔드포인트 */
const API_ENDPOINT = '/api/offline-db';

/**
 * Dexie 데이터베이스 스키마 정의
 *
 * IndexedDB 테이블 구조를 정의합니다. Cloudflare D1의 스키마와 동일합니다.
 *
 * @class OfflineDatabase
 * @extends {Dexie}
 *
 * @property {EntityTable<D1EntryRow, 'id'>} entries - 사전 엔트리 테이블 (인덱스: id, category_id)
 * @property {EntityTable<D1CategoryRow, 'id'>} categories - 카테고리 테이블 (인덱스: id, sort_order)
 * @property {EntityTable<D1ConversationRow, 'id'>} conversations - 대화 테이블 (인덱스: id, category_id)
 * @property {EntityTable<OfflineDBMeta & { id: string }, 'id'>} meta - 메타데이터 테이블 (단일 레코드)
 */
class OfflineDatabase extends Dexie {
  entries!: EntityTable<D1EntryRow, 'id'>;
  categories!: EntityTable<D1CategoryRow, 'id'>;
  conversations!: EntityTable<D1ConversationRow, 'id'>;
  meta!: EntityTable<OfflineDBMeta & { id: string }, 'id'>;

  constructor() {
    super(DB_NAME);
    // Dexie 스키마 정의
    // 형식: 'primaryKey, index1, index2, ...'
    // 참고: https://dexie.org/docs/Version/Version.stores()
    this.version(DB_VERSION).stores({
      entries: 'id, category_id', // category_id로 필터링 쿼리 지원
      categories: 'id, sort_order', // sort_order로 정렬 쿼리 지원
      conversations: 'id, category_id', // category_id로 필터링 쿼리 지원
      meta: 'id', // 단일 레코드 (id='main')
    });
  }
}

/**
 * 오프라인 SQLite 어댑터 구현
 *
 * IndexedDB를 사용하여 D1 데이터를 로컬에 저장하고 조회하는 싱글톤 어댑터입니다.
 *
 * @class OfflineSQLiteAdapterImpl
 * @implements {OfflineSQLiteAdapter}
 *
 * @example
 * ```typescript
 * // 싱글톤 인스턴스 사용 (권장)
 * import { getOfflineSQLite } from '@soundblue/platform/sqlite';
 * const adapter = getOfflineSQLite();
 *
 * // 상태 머신
 * // not-downloaded → downloading → ready
 * //                            ↘ error
 * //                    ready → updating → ready
 * ```
 */
class OfflineSQLiteAdapterImpl implements OfflineSQLiteAdapter {
  /** Dexie 데이터베이스 인스턴스 */
  private db: OfflineDatabase | null = null;

  /** 현재 상태 (상태 머신) */
  private status: OfflineDBStatus = 'not-downloaded';

  /** 초기화 Promise (중복 초기화 방지) */
  private initPromise: Promise<void> | null = null;

  /**
   * 데이터베이스 초기화 (지연 초기화 패턴)
   *
   * 첫 호출 시에만 실제 초기화가 실행되고,
   * 이후 호출은 동일한 Promise를 반환합니다.
   *
   * @returns {Promise<void>} 초기화 완료 Promise
   */
  async init(): Promise<void> {
    // 이미 초기화 중이면 기존 Promise 반환 (중복 초기화 방지)
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.doInit();
    return this.initPromise;
  }

  /**
   * 실제 초기화 로직
   *
   * 1. Dexie 데이터베이스 생성 및 열기
   * 2. 메타데이터 확인하여 기존 데이터 존재 여부 판단
   * 3. 상태를 'ready' 또는 'not-downloaded'로 설정
   *
   * @private
   * @throws {Error} IndexedDB 접근 불가 시
   */
  private async doInit(): Promise<void> {
    try {
      this.db = new OfflineDatabase();
      await this.db.open();

      // 메타데이터 확인하여 상태 결정
      // 이전에 다운로드된 데이터가 있으면 'ready', 없으면 'not-downloaded'
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

  /**
   * 서버에서 데이터를 다운로드하여 IndexedDB에 저장
   *
   * 4단계로 진행되며, 각 단계마다 진행률을 콜백으로 알립니다:
   *
   * | Phase | Percent | Description |
   * |-------|---------|-------------|
   * | `fetching` | 0-50% | 서버에서 JSON 스트리밍 |
   * | `parsing` | 50-60% | JSON 문자열 파싱 |
   * | `storing` | 60-90% | IndexedDB 배치 저장 |
   * | `complete` | 100% | 메타데이터 저장 완료 |
   *
   * @async
   * @param {function} [onProgress] - 진행률 콜백 함수
   * @returns {Promise<void>}
   *
   * @throws {Error} 네트워크 오류 또는 파싱 실패 시
   *
   * @example
   * ```typescript
   * await adapter.download((progress) => {
   *   switch (progress.phase) {
   *     case 'fetching':
   *       console.log(`다운로드 중... ${progress.bytesLoaded}/${progress.bytesTotal}`);
   *       break;
   *     case 'storing':
   *       console.log(`저장 중... ${progress.percent}%`);
   *       break;
   *   }
   * });
   * ```
   */
  async download(onProgress?: (progress: DownloadProgress) => void): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    this.status = 'downloading';

    try {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // Phase 1: FETCHING (0-50%)
      // 서버에서 JSON 데이터를 스트림으로 가져옵니다.
      // ReadableStream을 사용하여 다운로드 진행률을 추적합니다.
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      onProgress?.({ phase: 'fetching', percent: 0 });

      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      // Content-Length 헤더로 전체 크기 추출
      // 참고: gzip 압축 시 실제 전송 크기와 다를 수 있음
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? Number.parseInt(contentLength, 10) : 0;

      // ReadableStream으로 청크 단위 읽기
      // 장점: 메모리 효율적, 진행률 추적 가능
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const chunks: Uint8Array[] = [];
      let loaded = 0;

      // 스트림에서 청크를 순차적으로 읽어 배열에 저장
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;

        // 다운로드 단계는 전체의 50%를 차지
        if (total > 0) {
          onProgress?.({
            phase: 'fetching',
            percent: Math.round((loaded / total) * 50),
            bytesLoaded: loaded,
            bytesTotal: total,
          });
        }
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // Phase 2: PARSING (50-60%)
      // Uint8Array 청크들을 합쳐서 JSON으로 파싱합니다.
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      onProgress?.({ phase: 'parsing', percent: 50 });

      // TextDecoder로 바이너리를 문자열로 변환
      // stream: true로 멀티바이트 문자 처리 (한글 깨짐 방지)
      const decoder = new TextDecoder();
      const jsonString = chunks.map((chunk) => decoder.decode(chunk, { stream: true })).join('');
      const data: D1DumpResponse = JSON.parse(jsonString);

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // Phase 3: STORING (60-90%)
      // IndexedDB에 배치로 데이터를 저장합니다.
      // 대량 삽입 시 배치 처리로 UI 블로킹 방지.
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      onProgress?.({ phase: 'storing', percent: 60 });

      // 기존 데이터 삭제 (전체 교체 방식)
      // 참고: 증분 업데이트는 복잡도가 높아 전체 교체 사용
      await Promise.all([
        this.db.entries.clear(),
        this.db.categories.clear(),
        this.db.conversations.clear(),
      ]);

      // 배치로 데이터 삽입 (성능 최적화)
      // 이유: 16,000+ 레코드를 한 번에 삽입하면 UI 블로킹
      // BATCH_SIZE=1000: 성능과 응답성의 균형점
      const BATCH_SIZE = 1000;
      const entries = data.tables.entries;
      const totalEntries = entries.length;

      for (let i = 0; i < totalEntries; i += BATCH_SIZE) {
        const batch = entries.slice(i, i + BATCH_SIZE);
        await this.db.entries.bulkAdd(batch);

        // 저장 단계는 60-90% (30% 범위)
        const progress = 60 + Math.round(((i + batch.length) / totalEntries) * 30);
        onProgress?.({ phase: 'storing', percent: progress });
      }

      // 카테고리와 대화는 수가 적어 배치 불필요
      await this.db.categories.bulkAdd(data.tables.categories);
      await this.db.conversations.bulkAdd(data.tables.conversations);

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // Phase 4: COMPLETE (100%)
      // 메타데이터 저장 및 상태 업데이트
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      const meta: OfflineDBMeta & { id: string } = {
        id: 'main', // 단일 레코드 식별자
        version: data.version, // 서버 데이터 버전 (업데이트 확인용)
        downloadedAt: Date.now(), // 다운로드 완료 시점
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

  /**
   * ID로 엔트리 조회
   *
   * @async
   * @param {string} id - 엔트리 ID (예: 'annyeong')
   * @returns {Promise<D1EntryRow | null>} 엔트리 데이터 또는 null
   *
   * @example
   * ```typescript
   * const entry = await adapter.getEntry('annyeong');
   * if (entry) {
   *   console.log(entry.korean); // '안녕'
   * }
   * ```
   */
  async getEntry(id: string): Promise<D1EntryRow | null> {
    await this.init();
    if (!this.db || this.status !== 'ready') return null;

    return (await this.db.entries.get(id)) ?? null;
  }

  /**
   * 카테고리별 엔트리 목록 조회
   *
   * @async
   * @param {string} categoryId - 카테고리 ID (예: 'greetings')
   * @returns {Promise<D1EntryRow[]>} 엔트리 배열 (없으면 빈 배열)
   *
   * @example
   * ```typescript
   * const entries = await adapter.getEntriesByCategory('greetings');
   * console.log(`${entries.length} entries found`);
   * ```
   */
  async getEntriesByCategory(categoryId: string): Promise<D1EntryRow[]> {
    await this.init();
    if (!this.db || this.status !== 'ready') return [];

    // Dexie 인덱스 쿼리: category_id 인덱스 사용
    return this.db.entries.where('category_id').equals(categoryId).toArray();
  }

  /**
   * 모든 카테고리 조회 (정렬 순서대로)
   *
   * @async
   * @returns {Promise<D1CategoryRow[]>} 카테고리 배열 (sort_order 오름차순)
   *
   * @example
   * ```typescript
   * const categories = await adapter.getCategories();
   * categories.forEach((cat) => console.log(cat.name_ko));
   * ```
   */
  async getCategories(): Promise<D1CategoryRow[]> {
    await this.init();
    if (!this.db || this.status !== 'ready') return [];

    // sort_order 인덱스로 정렬
    return this.db.categories.orderBy('sort_order').toArray();
  }

  /**
   * 카테고리별 대화 조회
   *
   * @async
   * @param {string} categoryId - 카테고리 ID
   * @returns {Promise<D1ConversationRow[]>} 대화 배열
   */
  async getConversationsByCategory(categoryId: string): Promise<D1ConversationRow[]> {
    await this.init();
    if (!this.db || this.status !== 'ready') return [];

    return this.db.conversations.where('category_id').equals(categoryId).toArray();
  }

  /**
   * 모든 오프라인 데이터 삭제
   *
   * 모든 테이블의 데이터를 삭제하고 상태를 'not-downloaded'로 초기화합니다.
   * 사용자가 오프라인 데이터를 삭제할 때 호출합니다.
   *
   * @async
   * @returns {Promise<void>}
   *
   * @example
   * ```typescript
   * await adapter.clear();
   * console.log(adapter.getStatus()); // 'not-downloaded'
   * ```
   */
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

  /**
   * 서버에 새 버전이 있는지 확인
   *
   * HEAD 요청으로 서버의 X-Data-Version 헤더만 확인하여
   * 네트워크 사용량을 최소화합니다.
   *
   * @async
   * @returns {Promise<{hasUpdate: boolean, serverVersion: number}>}
   *
   * @example
   * ```typescript
   * const { hasUpdate, serverVersion } = await adapter.checkForUpdate();
   * if (hasUpdate) {
   *   console.log(`새 버전 발견: ${serverVersion}`);
   *   await adapter.download();
   * }
   * ```
   */
  async checkForUpdate(): Promise<{ hasUpdate: boolean; serverVersion: number }> {
    await this.init();

    try {
      // HEAD 요청: 바디 없이 헤더만 가져옴 (네트워크 절약)
      const response = await fetch(API_ENDPOINT, { method: 'HEAD' });
      const serverVersion = Number.parseInt(response.headers.get('X-Data-Version') || '0', 10);

      const meta = await this.getMeta();
      const localVersion = meta?.version || 0;

      return {
        hasUpdate: serverVersion > localVersion,
        serverVersion,
      };
    } catch {
      // 네트워크 오류 시 업데이트 없음으로 처리 (오프라인 상태)
      return { hasUpdate: false, serverVersion: 0 };
    }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Singleton Instance
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** 싱글톤 인스턴스 (모듈 레벨 캐시) */
let instance: OfflineSQLiteAdapter | null = null;

/**
 * 오프라인 SQLite 어댑터 싱글톤 인스턴스 반환
 *
 * 애플리케이션 전체에서 동일한 IndexedDB 연결을 공유합니다.
 * 첫 호출 시 인스턴스가 생성되고, 이후 호출은 동일한 인스턴스를 반환합니다.
 *
 * @function getOfflineSQLite
 * @returns {OfflineSQLiteAdapter} 오프라인 SQLite 어댑터 인스턴스
 *
 * @example
 * ```typescript
 * import { getOfflineSQLite } from '@soundblue/platform/sqlite';
 *
 * // 어디서든 동일한 인스턴스 사용
 * const adapter = getOfflineSQLite();
 *
 * // 상태 확인
 * if (adapter.getStatus() === 'ready') {
 *   const entry = await adapter.getEntry('annyeong');
 * }
 *
 * // 다운로드
 * await adapter.download((p) => console.log(p.percent));
 * ```
 *
 * @see {@link OfflineSQLiteAdapter} 인터페이스 정의
 * @see {@link ./types.ts} 타입 정의
 */
export function getOfflineSQLite(): OfflineSQLiteAdapter {
  if (!instance) {
    instance = new OfflineSQLiteAdapterImpl();
  }
  return instance;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Type Re-exports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 타입 재내보내기
 *
 * 사용자가 `@soundblue/platform/sqlite`에서 타입도 함께 import할 수 있도록 합니다.
 *
 * @example
 * ```typescript
 * import type { DownloadProgress, OfflineDBStatus } from '@soundblue/platform/sqlite';
 * ```
 */
export type {
  DownloadProgress,
  OfflineDBMeta,
  OfflineDBStatus,
  OfflineSQLiteAdapter,
} from './types';
