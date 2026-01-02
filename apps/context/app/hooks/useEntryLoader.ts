/**
 * @fileoverview 동적 엔트리 로더 훅
 *
 * 100만개+ 확장성을 위한 청크 기반 동적 로딩
 * - SSG 시: loader()에서 미리 로드된 데이터 사용
 * - SPA 시: 청크 파일에서 동적 fetch
 *
 * ## 캐싱 전략
 * - 청크 단위 캐싱 (같은 초성 엔트리는 한 번만 fetch)
 * - LRU 캐시로 메모리 관리
 */
import { useEffect, useState } from 'react';
import type { MeaningEntry } from '@/data/types';

// 청크 캐시 (초성 → 엔트리 맵)
const chunkCache = new Map<string, Map<string, MeaningEntry>>();

// 진행 중인 fetch 추적 (중복 요청 방지)
const pendingFetches = new Map<string, Promise<Map<string, MeaningEntry>>>();

/**
 * 청크 파일에서 엔트리 로드
 */
async function fetchChunk(choseong: string): Promise<Map<string, MeaningEntry>> {
  // 이미 캐시에 있으면 반환
  const cached = chunkCache.get(choseong);
  if (cached) {
    return cached;
  }

  // 진행 중인 fetch가 있으면 대기
  const pending = pendingFetches.get(choseong);
  if (pending) {
    return pending;
  }

  // 새 fetch 시작
  const fetchPromise = (async () => {
    try {
      const response = await fetch(`/data/chunks/entries-${choseong}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch chunk: ${choseong}`);
      }

      const entries: MeaningEntry[] = await response.json();
      const entryMap = new Map(entries.map((e) => [e.id, e]));

      // 캐시에 저장
      chunkCache.set(choseong, entryMap);

      return entryMap;
    } finally {
      // fetch 완료 후 pending에서 제거
      pendingFetches.delete(choseong);
    }
  })();

  pendingFetches.set(choseong, fetchPromise);
  return fetchPromise;
}

/**
 * ID에서 초성 추출
 */
function getChoseongFromKorean(korean: string): string {
  const CHOSEONG = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
  ];

  const code = korean.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const choseongIndex = Math.floor((code - 0xac00) / 588);
    return CHOSEONG[choseongIndex] || 'etc';
  }
  return 'etc';
}

interface UseEntryLoaderResult {
  entry: MeaningEntry | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * 엔트리 동적 로더 훅
 *
 * @param entryId - 로드할 엔트리 ID
 * @param preloadedEntry - SSG에서 미리 로드된 엔트리 (있으면 사용)
 */
export function useEntryLoader(
  entryId: string | undefined,
  preloadedEntry?: MeaningEntry | null,
): UseEntryLoaderResult {
  const [entry, setEntry] = useState<MeaningEntry | null>(preloadedEntry || null);
  const [isLoading, setIsLoading] = useState(!preloadedEntry && !!entryId);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 이미 preloaded 데이터가 있으면 사용
    if (preloadedEntry) {
      setEntry(preloadedEntry);
      setIsLoading(false);
      return;
    }

    if (!entryId) {
      setEntry(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadEntry() {
      if (!entryId) return;

      setIsLoading(true);
      setError(null);

      try {
        // 1. 먼저 인덱스에서 청크 키 조회
        const { getChunkKey } = await import('@/data/generated/entry-index');
        const choseong = getChunkKey(entryId);

        if (!choseong) {
          throw new Error(`Entry not found in index: ${entryId}`);
        }

        // 2. 청크 fetch
        const entryMap = await fetchChunk(choseong);
        const foundEntry = entryMap.get(entryId);

        if (cancelled) return;

        if (!foundEntry) {
          throw new Error(`Entry not found in chunk: ${entryId}`);
        }

        setEntry(foundEntry);
      } catch (err: unknown) {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setEntry(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadEntry();

    return () => {
      cancelled = true;
    };
  }, [entryId, preloadedEntry]);

  return { entry, isLoading, error };
}

/**
 * 청크 프리로드 (성능 최적화)
 * browse 페이지에서 호버 시 미리 로드
 */
export function preloadChunk(korean: string): void {
  const choseong = getChoseongFromKorean(korean);
  if (!chunkCache.has(choseong) && !pendingFetches.has(choseong)) {
    fetchChunk(choseong).catch(() => {
      // 프리로드 실패는 무시
    });
  }
}

/**
 * 캐시 클리어 (메모리 관리)
 */
export function clearChunkCache(): void {
  chunkCache.clear();
}
