/**
 * @fileoverview DB 헬퍼 모듈 진입점
 *
 * IndexedDB 헬퍼 팩토리 함수들을 내보냅니다.
 *
 * @example
 * ```ts
 * import { createFavoritesHelper, createSettingsHelper, createRecentViewsHelper } from '@soundblue/shared/db';
 * ```
 */

// Types
export type {
  BaseFavorite,
  BaseSettings,
  BaseRecentView,
  FavoritesHelper,
  SettingsHelper,
  RecentViewsHelper,
} from './types';

// Helpers
export { createFavoritesHelper, createSettingsHelper, createRecentViewsHelper } from './helpers';
