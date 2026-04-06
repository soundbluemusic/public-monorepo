/**
 * 간단한 메모리 캐시 구현
 *
 * Cloudflare Workers 환경에서 요청 간 캐시를 유지합니다.
 * Workers는 요청마다 새 인스턴스가 아닌, 동일 인스턴스를 재사용할 수 있어
 * 전역 변수에 캐시를 저장하면 일정 시간 동안 유지됩니다.
 *
 * @see https://developers.cloudflare.com/workers/runtime-apis/cache/
 */

interface CacheEntry<T> {
  value: T;
  expiry: number;
  lastAccessed: number;
}

/** 캐시 설정 */
const CACHE_CONFIG = {
  /** 기본 TTL: 5분 */
  DEFAULT_TTL_MS: 5 * 60 * 1000,
  /** 최대 캐시 항목 수 (메모리 제한 고려) */
  MAX_ENTRIES: 500,
  /** 카테고리 캐시 TTL: 1시간 (거의 변경되지 않음) */
  CATEGORY_TTL_MS: 60 * 60 * 1000,
  /** 엔트리 수 캐시 TTL: 30분 */
  ENTRY_COUNTS_TTL_MS: 30 * 60 * 1000,
} as const;

/** 전역 캐시 저장소 */
const cache = new Map<string, CacheEntry<unknown>>();

/**
 * 캐시에서 값 조회
 */
export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  // 만료 확인
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  // LRU: 접근 시간 갱신
  entry.lastAccessed = Date.now();
  return entry.value as T;
}

/**
 * 캐시에 값 저장
 */
export function setCached<T>(key: string, value: T, ttlMs = CACHE_CONFIG.DEFAULT_TTL_MS): void {
  // 최대 항목 수 초과 시 만료 항목 정리
  if (cache.size >= CACHE_CONFIG.MAX_ENTRIES) {
    cleanupExpired();
    // LRU: 가장 오래 접근되지 않은 항목 제거
    if (cache.size >= CACHE_CONFIG.MAX_ENTRIES) {
      let oldestKey: string | undefined;
      let oldestTime = Number.POSITIVE_INFINITY;
      for (const [entryKey, entry] of cache.entries()) {
        if (entry.lastAccessed < oldestTime) {
          oldestTime = entry.lastAccessed;
          oldestKey = entryKey;
        }
      }
      if (oldestKey) cache.delete(oldestKey);
    }
  }

  const now = Date.now();
  cache.set(key, {
    value,
    expiry: now + ttlMs,
    lastAccessed: now,
  });
}

/**
 * 만료된 캐시 항목 정리
 */
function cleanupExpired(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiry) {
      cache.delete(key);
    }
  }
}

/**
 * 캐시 키 생성 헬퍼
 */
export const cacheKeys = {
  entry: (id: string, locale: string) => `entry:${id}:${locale}`,
  categoryEntries: (categoryId: string, locale: string) => `cat:${categoryId}:${locale}`,
  categories: () => 'categories',
  entryCounts: () => 'entryCounts',
  tags: () => 'tags',
} as const;

/**
 * 캐시 TTL 설정
 */
export const cacheTTL = {
  entry: CACHE_CONFIG.DEFAULT_TTL_MS,
  categoryEntries: CACHE_CONFIG.DEFAULT_TTL_MS,
  categories: CACHE_CONFIG.CATEGORY_TTL_MS,
  entryCounts: CACHE_CONFIG.ENTRY_COUNTS_TTL_MS,
  tags: CACHE_CONFIG.ENTRY_COUNTS_TTL_MS,
} as const;

/**
 * 전체 캐시 초기화 (테스트용)
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * 캐시 통계 조회 (디버깅용)
 */
export function getCacheStats(): { size: number; maxSize: number } {
  return {
    size: cache.size,
    maxSize: CACHE_CONFIG.MAX_ENTRIES,
  };
}
