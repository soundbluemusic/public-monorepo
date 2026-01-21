/**
 * @soundblue/search - useSearchWorker Hook Tests
 *
 * MiniSearch 기반 검색 훅 테스트
 */

import type { SearchIndexItem } from '@soundblue/search/react';
import { useSearchWorker } from '@soundblue/search/react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockSearchIndex: SearchIndexItem[] = [
  {
    id: 'hello',
    type: 'entry',
    name: { en: 'Hello', ko: '안녕하세요' },
    description: { en: 'A greeting', ko: '인사말' },
    tags: ['greetings', 'basic'],
  },
  {
    id: 'world',
    type: 'entry',
    name: { en: 'World', ko: '세계' },
    description: { en: 'The earth', ko: '지구' },
    field: 'geography',
  },
  {
    id: 'pythagorean',
    type: 'concept',
    name: { en: 'Pythagorean Theorem', ko: '피타고라스 정리' },
    description: { en: 'A mathematical theorem', ko: '수학 정리' },
    field: 'geometry',
  },
];

describe('@soundblue/search/react - useSearchWorker', () => {
  beforeEach(() => {
    // Mock fetch to return our test data
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSearchIndex),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should start with empty query', async () => {
      const { result } = renderHook(() =>
        useSearchWorker({ indexUrl: '/search-index.json', locale: 'en' }),
      );
      await act(async () => {});

      expect(result.current.query).toBe('');
    });

    it('should start with empty results', async () => {
      const { result } = renderHook(() =>
        useSearchWorker({ indexUrl: '/search-index.json', locale: 'en' }),
      );
      await act(async () => {});

      expect(result.current.results).toEqual([]);
    });

    it('should start with no error', async () => {
      const { result } = renderHook(() =>
        useSearchWorker({ indexUrl: '/search-index.json', locale: 'en' }),
      );
      await act(async () => {});

      expect(result.current.error).toBeNull();
    });
  });

  describe('index loading', () => {
    it('should fetch index from provided URL', async () => {
      renderHook(() => useSearchWorker({ indexUrl: '/search-index.json', locale: 'en' }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/search-index.json');
      });
    });

    it('should become ready after index loads', async () => {
      const { result } = renderHook(() =>
        useSearchWorker({ indexUrl: '/search-index.json', locale: 'en' }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });
    });

    it('should set error on fetch failure', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      const { result } = renderHook(() =>
        useSearchWorker({ indexUrl: '/not-found.json', locale: 'en' }),
      );

      await waitFor(() => {
        expect(result.current.error).toContain('404');
      });
    });

    it('should set error on network failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() =>
        useSearchWorker({ indexUrl: '/search-index.json', locale: 'en' }),
      );

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });
    });
  });

  describe('setQuery', () => {
    it('should update query immediately', async () => {
      const { result } = renderHook(() =>
        useSearchWorker({ indexUrl: '/search-index.json', locale: 'en' }),
      );

      await waitFor(() => expect(result.current.isReady).toBe(true));

      act(() => {
        result.current.setQuery('hello');
      });

      expect(result.current.query).toBe('hello');
    });

    it('should clear results for short queries (< 2 chars)', async () => {
      const { result } = renderHook(() =>
        useSearchWorker({ indexUrl: '/search-index.json', locale: 'en' }),
      );

      await waitFor(() => expect(result.current.isReady).toBe(true));

      act(() => {
        result.current.setQuery('h');
      });

      expect(result.current.results).toEqual([]);
    });
  });

  describe('search results', () => {
    it('should return matching results after debounce', async () => {
      const { result } = renderHook(() =>
        useSearchWorker({
          indexUrl: '/search-index.json',
          locale: 'en',
          debounceMs: 10, // Short debounce for testing
        }),
      );

      await waitFor(() => expect(result.current.isReady).toBe(true));

      act(() => {
        result.current.setQuery('hello');
      });

      // Wait for debounce and search
      await waitFor(() => {
        expect(result.current.results.length).toBeGreaterThan(0);
      });

      expect(result.current.results[0].item.id).toBe('hello');
    });

    it('should include score in results', async () => {
      const { result } = renderHook(() =>
        useSearchWorker({
          indexUrl: '/search-index.json',
          locale: 'en',
          debounceMs: 10,
        }),
      );

      await waitFor(() => expect(result.current.isReady).toBe(true));

      act(() => {
        result.current.setQuery('hello');
      });

      await waitFor(() => {
        expect(result.current.results.length).toBeGreaterThan(0);
      });

      expect(result.current.results[0]).toHaveProperty('score');
    });

    it('should return complete item data', async () => {
      const { result } = renderHook(() =>
        useSearchWorker({
          indexUrl: '/search-index.json',
          locale: 'en',
          debounceMs: 10,
        }),
      );

      await waitFor(() => expect(result.current.isReady).toBe(true));

      act(() => {
        result.current.setQuery('hello');
      });

      await waitFor(() => {
        expect(result.current.results.length).toBeGreaterThan(0);
      });

      const item = result.current.results[0].item;
      expect(item).toHaveProperty('id', 'hello');
      expect(item).toHaveProperty('type', 'entry');
      expect(item.name).toHaveProperty('en', 'Hello');
      expect(item.name).toHaveProperty('ko', '안녕하세요');
    });

    it('should respect maxResults option', async () => {
      const { result } = renderHook(() =>
        useSearchWorker({
          indexUrl: '/search-index.json',
          locale: 'en',
          maxResults: 1,
          debounceMs: 10,
        }),
      );

      await waitFor(() => expect(result.current.isReady).toBe(true));

      // Search for a common term
      act(() => {
        result.current.setQuery('world');
      });

      await waitFor(() => {
        expect(result.current.results.length).toBeGreaterThan(0);
      });

      expect(result.current.results.length).toBeLessThanOrEqual(1);
    });
  });

  describe('locale handling', () => {
    it('should re-initialize when locale changes', async () => {
      const { result, rerender } = renderHook(
        ({ locale }) => useSearchWorker({ indexUrl: '/search-index.json', locale }),
        { initialProps: { locale: 'en' as const } },
      );

      await waitFor(() => expect(result.current.isReady).toBe(true));

      const initialFetchCount = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.length;

      // Change locale
      rerender({ locale: 'ko' });

      await waitFor(() => {
        expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(
          initialFetchCount,
        );
      });
    });
  });
});
