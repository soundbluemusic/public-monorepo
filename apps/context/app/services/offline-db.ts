/**
 * 오프라인 DB 서비스
 *
 * D1과 동일한 인터페이스로 로컬 IndexedDB 데이터를 조회합니다.
 * 오프라인 상태에서 이 서비스를 사용하여 엔트리를 조회합니다.
 *
 * @environment client-only
 */

import { getOfflineSQLite } from '@soundblue/platform/sqlite';
import type {
  DownloadProgress,
  OfflineDBMeta,
  OfflineDBStatus,
} from '@soundblue/platform/sqlite/types';
import type { Language, LocaleEntry } from '@/data/types';
import { rowToLocaleEntry } from './entry-converter';

/**
 * 오프라인 DB 상태 확인
 */
export function getOfflineDBStatus(): OfflineDBStatus {
  return getOfflineSQLite().getStatus();
}

/**
 * 오프라인 DB 메타데이터 조회
 */
export async function getOfflineDBMeta(): Promise<OfflineDBMeta | null> {
  return getOfflineSQLite().getMeta();
}

/**
 * 오프라인 DB 다운로드
 */
export async function downloadOfflineDB(
  onProgress?: (progress: DownloadProgress) => void,
): Promise<void> {
  return getOfflineSQLite().download(onProgress);
}

/**
 * 오프라인 DB 삭제
 */
export async function clearOfflineDB(): Promise<void> {
  return getOfflineSQLite().clear();
}

/**
 * 업데이트 확인
 */
export async function checkOfflineDBUpdate(): Promise<{
  hasUpdate: boolean;
  serverVersion: number;
}> {
  return getOfflineSQLite().checkForUpdate();
}

/**
 * 오프라인 DB에서 ID로 엔트리 조회
 */
export async function getEntryByIdFromOffline(
  id: string,
  locale: Language,
): Promise<LocaleEntry | null> {
  const sqlite = getOfflineSQLite();
  if (sqlite.getStatus() !== 'ready') return null;

  const row = await sqlite.getEntry(id);
  if (!row) return null;

  return rowToLocaleEntry(row, locale);
}

/**
 * 오프라인 DB에서 카테고리별 엔트리 조회
 */
export async function getEntriesByCategoryFromOffline(
  categoryId: string,
  locale: Language,
): Promise<LocaleEntry[]> {
  const sqlite = getOfflineSQLite();
  if (sqlite.getStatus() !== 'ready') return [];

  const rows = await sqlite.getEntriesByCategory(categoryId);
  return rows
    .map((row) => rowToLocaleEntry(row, locale))
    .filter((entry): entry is LocaleEntry => entry !== null);
}

/**
 * 오프라인 DB에서 모든 카테고리 조회
 */
export async function getCategoriesFromOffline() {
  const sqlite = getOfflineSQLite();
  if (sqlite.getStatus() !== 'ready') return [];

  const rows = await sqlite.getCategories();
  return rows.map((row) => ({
    id: row.id,
    name: {
      ko: row.name_ko,
      en: row.name_en,
    },
    description: {
      ko: row.description_ko || '',
      en: row.description_en || '',
    },
    icon: row.icon || '',
    color: row.color || 'blue',
    order: row.sort_order,
  }));
}

/**
 * 오프라인 DB에서 대화 조회
 */
export async function getConversationsByCategoryFromOffline(categoryId: string) {
  const sqlite = getOfflineSQLite();
  if (sqlite.getStatus() !== 'ready') return [];

  const rows = await sqlite.getConversationsByCategory(categoryId);
  return rows.map((row) => ({
    id: row.id,
    categoryId: row.category_id || '',
    title: {
      ko: row.title_ko,
      en: row.title_en,
    },
    dialogue: JSON.parse(row.dialogue),
  }));
}

/**
 * 오프라인 모드 사용 가능 여부
 */
export function isOfflineReady(): boolean {
  return getOfflineSQLite().getStatus() === 'ready';
}
