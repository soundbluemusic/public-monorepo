/**
 * 기본 즐겨찾기 엔티티 인터페이스
 */
export interface BaseFavorite {
  id?: number;
  addedAt: Date;
}

/**
 * 기본 설정 엔티티 인터페이스
 */
export interface BaseSettings {
  id: number; // 항상 1 (싱글톤)
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  updatedAt: Date;
}

/**
 * 기본 최근 조회 엔티티 인터페이스
 */
export interface BaseRecentView {
  id?: number;
  viewedAt: Date;
}

/**
 * 즐겨찾기 헬퍼 타입
 */
export interface FavoritesHelper<T extends BaseFavorite, _K extends keyof T> {
  add: (itemId: string) => Promise<number | undefined>;
  remove: (itemId: string) => Promise<number>;
  toggle: (itemId: string) => Promise<boolean>;
  isFavorite: (itemId: string) => Promise<boolean>;
  getAll: () => Promise<T[]>;
  count: () => Promise<number>;
}

/**
 * 설정 헬퍼 타입
 */
export interface SettingsHelper<T extends BaseSettings> {
  get: () => Promise<T>;
  update: (updates: Partial<Omit<T, 'id'>>) => Promise<number>;
  setTheme: (theme: T['theme']) => Promise<number>;
  setLanguage: (language: T['language']) => Promise<number>;
  setFontSize: (fontSize: T['fontSize']) => Promise<number>;
}

/**
 * 최근 조회 헬퍼 타입
 */
export interface RecentViewsHelper<T extends BaseRecentView> {
  add: (itemId: string) => Promise<number | undefined>;
  getRecent: (limit?: number) => Promise<T[]>;
  clear: () => Promise<void>;
}
