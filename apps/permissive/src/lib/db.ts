import { validateId } from '@soundblue/shared';
/**
 * @fileoverview IndexedDB 데이터베이스 레이어
 *
 * Dexie.js를 사용한 클라이언트 사이드 영구 저장소.
 * 즐겨찾기, 사용자 설정, 최근 본 항목을 로컬에 저장합니다.
 *
 * @example
 * ```ts
 * import { favoriteLibraries, settings, recentViews } from '@/lib/db';
 *
 * // 즐겨찾기 토글
 * const isFavorited = await favoriteLibraries.toggle('react');
 *
 * // 설정 변경
 * await settings.setTheme('dark');
 *
 * // 최근 본 항목 추가
 * await recentViews.add('library', 'vue');
 * ```
 */
import Dexie, { type EntityTable } from 'dexie';

/**
 * 즐겨찾기 라이브러리 엔티티
 * @property id - 자동 증가 기본키 (Dexie 관리)
 * @property libraryId - 오픈소스 라이브러리 고유 식별자 (예: 'react', 'vue')
 * @property addedAt - 즐겨찾기 추가 일시
 */
export interface FavoriteLibrary {
  id?: number;
  libraryId: string;
  addedAt: Date;
}

/**
 * 즐겨찾기 Web API 엔티티
 * @property id - 자동 증가 기본키 (Dexie 관리)
 * @property apiId - Web API 고유 식별자 (예: 'fetch', 'intersection-observer')
 * @property addedAt - 즐겨찾기 추가 일시
 */
export interface FavoriteWebApi {
  id?: number;
  apiId: string;
  addedAt: Date;
}

/**
 * 사용자 설정 엔티티 (싱글톤)
 * @property id - 항상 1 (단일 레코드만 존재)
 * @property theme - 테마 설정 ('light' | 'dark' | 'system')
 * @property language - 언어 설정 ('ko' | 'en')
 * @property updatedAt - 마지막 수정 일시
 */
export interface UserSettings {
  id: number;
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en';
  updatedAt: Date;
}

/**
 * 최근 본 항목 엔티티
 * @property id - 자동 증가 기본키 (Dexie 관리)
 * @property type - 항목 유형 ('library' | 'webapi')
 * @property itemId - 라이브러리 또는 Web API의 고유 식별자
 * @property viewedAt - 조회 일시
 */
export interface RecentView {
  id?: number;
  type: 'library' | 'webapi';
  itemId: string;
  viewedAt: Date;
}

// Typed Dexie database class
class PermissiveDatabase extends Dexie {
  favoriteLibraries!: EntityTable<FavoriteLibrary, 'id'>;
  favoriteWebApis!: EntityTable<FavoriteWebApi, 'id'>;
  settings!: EntityTable<UserSettings, 'id'>;
  recentViews!: EntityTable<RecentView, 'id'>;

  constructor() {
    super('PermissiveDB');
    this.version(1).stores({
      favoriteLibraries: '++id, libraryId, addedAt',
      favoriteWebApis: '++id, apiId, addedAt',
      settings: 'id',
      recentViews: '++id, [type+itemId], viewedAt',
    });
  }
}

const db = new PermissiveDatabase();

export { db };

/**
 * 라이브러리 즐겨찾기 관리 헬퍼
 *
 * @example
 * ```ts
 * // 즐겨찾기 추가
 * await favoriteLibraries.add('react');
 *
 * // 즐겨찾기 토글 (추가/제거)
 * const isNowFavorite = await favoriteLibraries.toggle('vue');
 *
 * // 전체 목록 조회
 * const favorites = await favoriteLibraries.getAll();
 * ```
 */
export const favoriteLibraries = {
  /**
   * 라이브러리를 즐겨찾기에 추가
   * @param libraryId - 라이브러리 고유 식별자
   * @returns 생성된 레코드의 ID (이미 존재하면 기존 ID 반환)
   * @throws {Error} libraryId가 빈 문자열이거나 유효하지 않은 경우
   */
  async add(libraryId: string) {
    validateId(libraryId, 'libraryId');
    const exists = await db.favoriteLibraries.where('libraryId').equals(libraryId).first();
    if (exists) return exists.id;
    return db.favoriteLibraries.add({ libraryId, addedAt: new Date() });
  },

  /**
   * 라이브러리를 즐겨찾기에서 제거
   * @param libraryId - 라이브러리 고유 식별자
   * @returns 삭제된 레코드 수
   * @throws {Error} libraryId가 빈 문자열이거나 유효하지 않은 경우
   */
  async remove(libraryId: string) {
    validateId(libraryId, 'libraryId');
    return db.favoriteLibraries.where('libraryId').equals(libraryId).delete();
  },

  /**
   * 라이브러리 즐겨찾기 상태 토글
   * @param libraryId - 라이브러리 고유 식별자
   * @returns 토글 후 즐겨찾기 상태 (true: 추가됨, false: 제거됨)
   * @throws {Error} libraryId가 빈 문자열이거나 유효하지 않은 경우
   */
  async toggle(libraryId: string) {
    validateId(libraryId, 'libraryId');
    const exists = await db.favoriteLibraries.where('libraryId').equals(libraryId).first();
    if (exists?.id) {
      await db.favoriteLibraries.delete(exists.id);
      return false;
    }
    await db.favoriteLibraries.add({ libraryId, addedAt: new Date() });
    return true;
  },

  /**
   * 라이브러리가 즐겨찾기에 있는지 확인
   * @param libraryId - 라이브러리 고유 식별자
   * @returns 즐겨찾기 여부
   * @throws {Error} libraryId가 빈 문자열이거나 유효하지 않은 경우
   */
  async isFavorite(libraryId: string) {
    validateId(libraryId, 'libraryId');
    const exists = await db.favoriteLibraries.where('libraryId').equals(libraryId).first();
    return !!exists;
  },

  /**
   * 모든 즐겨찾기 라이브러리 조회
   * @returns 추가 일시 기준 내림차순 정렬된 즐겨찾기 목록
   */
  async getAll() {
    return db.favoriteLibraries.orderBy('addedAt').reverse().toArray();
  },

  /**
   * 즐겨찾기 라이브러리 총 개수
   * @returns 즐겨찾기 개수
   */
  async count() {
    return db.favoriteLibraries.count();
  },
};

/**
 * Web API 즐겨찾기 관리 헬퍼
 *
 * @example
 * ```ts
 * // 즐겨찾기 추가
 * await favoriteWebApis.add('fetch');
 *
 * // 즐겨찾기 토글 (추가/제거)
 * const isNowFavorite = await favoriteWebApis.toggle('intersection-observer');
 *
 * // 전체 목록 조회
 * const favorites = await favoriteWebApis.getAll();
 * ```
 */
export const favoriteWebApis = {
  /**
   * Web API를 즐겨찾기에 추가
   * @param apiId - Web API 고유 식별자
   * @returns 생성된 레코드의 ID (이미 존재하면 기존 ID 반환)
   * @throws {Error} apiId가 빈 문자열이거나 유효하지 않은 경우
   */
  async add(apiId: string) {
    validateId(apiId, 'apiId');
    const exists = await db.favoriteWebApis.where('apiId').equals(apiId).first();
    if (exists) return exists.id;
    return db.favoriteWebApis.add({ apiId, addedAt: new Date() });
  },

  /**
   * Web API를 즐겨찾기에서 제거
   * @param apiId - Web API 고유 식별자
   * @returns 삭제된 레코드 수
   * @throws {Error} apiId가 빈 문자열이거나 유효하지 않은 경우
   */
  async remove(apiId: string) {
    validateId(apiId, 'apiId');
    return db.favoriteWebApis.where('apiId').equals(apiId).delete();
  },

  /**
   * Web API 즐겨찾기 상태 토글
   * @param apiId - Web API 고유 식별자
   * @returns 토글 후 즐겨찾기 상태 (true: 추가됨, false: 제거됨)
   * @throws {Error} apiId가 빈 문자열이거나 유효하지 않은 경우
   */
  async toggle(apiId: string) {
    validateId(apiId, 'apiId');
    const exists = await db.favoriteWebApis.where('apiId').equals(apiId).first();
    if (exists?.id) {
      await db.favoriteWebApis.delete(exists.id);
      return false;
    }
    await db.favoriteWebApis.add({ apiId, addedAt: new Date() });
    return true;
  },

  /**
   * Web API가 즐겨찾기에 있는지 확인
   * @param apiId - Web API 고유 식별자
   * @returns 즐겨찾기 여부
   * @throws {Error} apiId가 빈 문자열이거나 유효하지 않은 경우
   */
  async isFavorite(apiId: string) {
    validateId(apiId, 'apiId');
    const exists = await db.favoriteWebApis.where('apiId').equals(apiId).first();
    return !!exists;
  },

  /**
   * 모든 즐겨찾기 Web API 조회
   * @returns 추가 일시 기준 내림차순 정렬된 즐겨찾기 목록
   */
  async getAll() {
    return db.favoriteWebApis.orderBy('addedAt').reverse().toArray();
  },

  /**
   * 즐겨찾기 Web API 총 개수
   * @returns 즐겨찾기 개수
   */
  async count() {
    return db.favoriteWebApis.count();
  },
};

/**
 * 사용자 설정 관리 헬퍼 (싱글톤)
 *
 * 앱 전체에서 단일 설정 레코드(id=1)를 공유합니다.
 *
 * @example
 * ```ts
 * // 현재 설정 조회
 * const { theme, language } = await settings.get();
 *
 * // 테마 변경
 * await settings.setTheme('dark');
 *
 * // 여러 설정 동시 업데이트
 * await settings.update({ theme: 'light', language: 'en' });
 * ```
 */
export const settings = {
  /**
   * 현재 사용자 설정 조회
   * @returns 사용자 설정 객체 (없으면 기본값 반환: theme='system', language='ko')
   */
  async get(): Promise<UserSettings> {
    const s = await db.settings.get(1);
    return (
      s || {
        id: 1,
        theme: 'system',
        language: 'ko',
        updatedAt: new Date(),
      }
    );
  },

  /**
   * 사용자 설정 부분 업데이트
   * @param updates - 업데이트할 설정 필드 (theme, language, updatedAt)
   * @returns 업데이트된 레코드의 키
   */
  async update(updates: Partial<Omit<UserSettings, 'id'>>) {
    const current = await this.get();
    return db.settings.put({
      ...current,
      ...updates,
      id: 1,
      updatedAt: new Date(),
    });
  },

  /**
   * 테마 설정 변경
   * @param theme - 'light' | 'dark' | 'system'
   * @returns 업데이트된 레코드의 키
   */
  async setTheme(theme: UserSettings['theme']) {
    return this.update({ theme });
  },

  /**
   * 언어 설정 변경
   * @param language - 'ko' | 'en'
   * @returns 업데이트된 레코드의 키
   */
  async setLanguage(language: UserSettings['language']) {
    return this.update({ language });
  },
};

/**
 * 최근 본 항목 관리 헬퍼
 *
 * 라이브러리 및 Web API 조회 기록을 관리합니다.
 * 동일 항목 재조회 시 기존 기록을 삭제하고 최신으로 업데이트합니다.
 *
 * @example
 * ```ts
 * // 조회 기록 추가
 * await recentViews.add('library', 'react');
 * await recentViews.add('webapi', 'fetch');
 *
 * // 최근 본 라이브러리만 조회 (최대 10개)
 * const recentLibs = await recentViews.getRecent('library', 10);
 *
 * // 전체 조회 기록 삭제
 * await recentViews.clear();
 * ```
 */
export const recentViews = {
  /**
   * 조회 기록 추가
   *
   * 동일 항목이 이미 존재하면 삭제 후 최신 일시로 다시 추가합니다.
   *
   * @param type - 항목 유형 ('library' | 'webapi')
   * @param itemId - 라이브러리 또는 Web API 고유 식별자
   * @returns 생성된 레코드의 ID
   * @throws {Error} itemId가 빈 문자열이거나 유효하지 않은 경우
   */
  async add(type: RecentView['type'], itemId: string) {
    validateId(itemId, 'itemId');
    // 기존 기록 삭제 후 새로 추가 (최신으로 업데이트)
    await db.recentViews.where({ type, itemId }).delete();
    return db.recentViews.add({ type, itemId, viewedAt: new Date() });
  },

  /**
   * 최근 본 항목 조회
   * @param type - 필터링할 항목 유형 (생략 시 전체 조회)
   * @param limit - 최대 조회 개수 (기본값: 20)
   * @returns 조회 일시 기준 내림차순 정렬된 항목 목록
   */
  async getRecent(type?: RecentView['type'], limit = 20) {
    const query = db.recentViews.orderBy('viewedAt').reverse();
    if (type) {
      const items = await query.toArray();
      return items.filter((item) => item.type === type).slice(0, limit);
    }
    return query.limit(limit).toArray();
  },

  /**
   * 조회 기록 삭제
   * @param type - 삭제할 항목 유형 (생략 시 전체 삭제)
   * @returns 삭제 작업 결과 (타입별 삭제: 삭제된 개수, 전체 삭제: void)
   */
  async clear(type?: RecentView['type']) {
    if (type) {
      const items = await db.recentViews.toArray();
      const idsToDelete = items
        .filter((item) => item.type === type && item.id != null)
        .map((item) => item.id as number);
      return db.recentViews.bulkDelete(idsToDelete);
    }
    return db.recentViews.clear();
  },
};
