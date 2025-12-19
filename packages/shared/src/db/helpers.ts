/**
 * @fileoverview DB 헬퍼 팩토리 함수
 *
 * 각 앱에서 공통적으로 사용하는 DB 헬퍼 패턴을 제공합니다.
 *
 * @example
 * ```ts
 * import { createFavoritesHelper, createSettingsHelper } from '@soundblue/shared/db';
 *
 * export const favorites = createFavoritesHelper(db.favorites, 'entryId');
 * export const settings = createSettingsHelper(db.settings, defaultSettings);
 * ```
 */
import type { EntityTable, Table } from 'dexie';
import { validateId } from '../validation';
import type { BaseFavorite, BaseRecentView, BaseSettings } from './types';

// Dexie EntityTable의 strict 타입 체크를 우회하기 위한 헬퍼
type AnyTable<T> = Table<T, number>;

/**
 * 즐겨찾기 헬퍼 팩토리
 *
 * @param table - Dexie 테이블
 * @param idFieldName - ID 필드명 (예: 'entryId', 'conceptId', 'libraryId')
 * @returns 즐겨찾기 CRUD 헬퍼 객체
 *
 * @example
 * ```ts
 * const favorites = createFavoritesHelper(db.favorites, 'entryId');
 * await favorites.add('my-entry-id');
 * await favorites.toggle('my-entry-id');
 * ```
 */
export function createFavoritesHelper<T extends BaseFavorite & Record<K, string>, K extends string>(
  table: EntityTable<T, 'id'>,
  idFieldName: K,
) {
  const t = table as unknown as AnyTable<T>;
  return {
    async add(itemId: string) {
      validateId(itemId, idFieldName);
      const exists = await t.where(idFieldName).equals(itemId).first();
      if (exists) return exists.id;
      return t.add({ [idFieldName]: itemId, addedAt: new Date() } as unknown as T);
    },

    async remove(itemId: string) {
      validateId(itemId, idFieldName);
      return t.where(idFieldName).equals(itemId).delete();
    },

    async toggle(itemId: string) {
      validateId(itemId, idFieldName);
      const exists = await t.where(idFieldName).equals(itemId).first();
      if (exists?.id) {
        await t.delete(exists.id);
        return false;
      }
      await t.add({ [idFieldName]: itemId, addedAt: new Date() } as unknown as T);
      return true;
    },

    async isFavorite(itemId: string) {
      validateId(itemId, idFieldName);
      const exists = await t.where(idFieldName).equals(itemId).first();
      return !!exists;
    },

    async getAll() {
      return t.orderBy('addedAt').reverse().toArray();
    },

    async count() {
      return t.count();
    },
  };
}

/**
 * 설정 헬퍼 팩토리
 *
 * @param table - Dexie 테이블
 * @param defaultSettings - 기본 설정값
 * @returns 설정 CRUD 헬퍼 객체
 *
 * @example
 * ```ts
 * const settings = createSettingsHelper(db.settings, {
 *   id: 1,
 *   theme: 'system',
 *   language: 'ko',
 *   updatedAt: new Date(),
 * });
 * ```
 */
export function createSettingsHelper<T extends BaseSettings>(
  table: EntityTable<T, 'id'>,
  defaultSettings: T,
) {
  const t = table as unknown as AnyTable<T>;
  const helper = {
    async get(): Promise<T> {
      const s = await t.get(1);
      return s || { ...defaultSettings, updatedAt: new Date() };
    },

    async update(updates: Partial<Omit<T, 'id'>>) {
      const current = await helper.get();
      return t.put({
        ...current,
        ...updates,
        id: 1,
        updatedAt: new Date(),
      } as T);
    },

    async setTheme(theme: T['theme']) {
      return helper.update({ theme } as Partial<Omit<T, 'id'>>);
    },

    async setLanguage(language: T['language']) {
      return helper.update({ language } as Partial<Omit<T, 'id'>>);
    },
  };

  return helper;
}

/**
 * 최근 조회 헬퍼 팩토리
 *
 * @param table - Dexie 테이블
 * @param idFieldName - ID 필드명 (예: 'conceptId', 'itemId')
 * @param maxItems - 최대 보관 개수 (기본값: 100)
 * @returns 최근 조회 CRUD 헬퍼 객체
 *
 * @example
 * ```ts
 * const recentViews = createRecentViewsHelper(db.recentViews, 'conceptId', 100);
 * await recentViews.add('my-concept-id');
 * ```
 */
export function createRecentViewsHelper<
  T extends BaseRecentView & Record<K, string>,
  K extends string,
>(table: EntityTable<T, 'id'>, idFieldName: K, maxItems = 100) {
  const t = table as unknown as AnyTable<T>;
  return {
    async add(itemId: string) {
      validateId(itemId, idFieldName);
      // 기존 기록 삭제 후 새로 추가 (최신으로 업데이트)
      await t.where(idFieldName).equals(itemId).delete();
      const id = await t.add({
        [idFieldName]: itemId,
        viewedAt: new Date(),
      } as unknown as T);

      // 최대 개수 초과 시 오래된 항목 삭제
      const count = await t.count();
      if (count > maxItems) {
        const oldest = await t.orderBy('viewedAt').first();
        if (oldest?.id !== undefined) {
          await t.delete(oldest.id);
        }
      }

      return id;
    },

    async getRecent(limit = 20) {
      return t.orderBy('viewedAt').reverse().limit(limit).toArray();
    },

    async clear() {
      return t.clear();
    },
  };
}
