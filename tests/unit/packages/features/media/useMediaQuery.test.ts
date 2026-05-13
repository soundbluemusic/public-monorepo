/**
 * @fileoverview Unit tests for useMediaQuery and useIsMobile hooks
 */

import {
  __INTERNAL_RESET_MEDIA_QUERY_CACHE_FOR_TESTS__,
  useIsMobile,
  useMediaQuery,
} from '@soundblue/features/media';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useMediaQuery', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>;
  let listeners: ((event: MediaQueryListEvent) => void)[] = [];

  beforeEach(() => {
    // Hook caches `MediaQueryList` instances by query for performance; clear
    // the cache so each test sees a fresh `window.matchMedia` mock instead of
    // a `MediaQueryList` from a previous case.
    __INTERNAL_RESET_MEDIA_QUERY_CACHE_FOR_TESTS__();
    listeners = [];

    mockMatchMedia = vi.fn((query: string) => {
      // Mutable `matches`: the hook reads it on every snapshot, so when a test
      // fires a 'change' event with { matches: true }, the wrapped handler
      // first updates this flag, then forwards to the registered listener.
      let matches = false;
      const mediaQuery = {
        get matches() {
          return matches;
        },
        media: query,
        addEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
          if (event === 'change') {
            listeners.push((e: MediaQueryListEvent) => {
              matches = e.matches;
              handler(e);
            });
          }
        }),
        removeEventListener: vi.fn(
          (event: string, _handler: (event: MediaQueryListEvent) => void) => {
            if (event === 'change') {
              listeners.length = 0;
            }
          },
        ),
      };
      return mediaQuery as unknown as MediaQueryList;
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia,
    });
  });

  it('should return initial match state (false)', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('should return initial match state (true)', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('should update when media query changes', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      for (const listener of listeners) {
        listener({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });

  it('should cleanup event listener on unmount', () => {
    const removeEventListener = vi.fn();
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener,
    }));

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should handle query changes', () => {
    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: '(min-width: 768px)' },
    });

    expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)');

    rerender({ query: '(min-width: 1024px)' });
    expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
  });

  it('should work with different media queries', () => {
    const queries = [
      '(prefers-color-scheme: dark)',
      '(orientation: portrait)',
      '(max-width: 640px)',
    ];

    for (const query of queries) {
      const { result } = renderHook(() => useMediaQuery(query));
      expect(mockMatchMedia).toHaveBeenCalledWith(query);
      expect(typeof result.current).toBe('boolean');
    }
  });
});

describe('useIsMobile', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    __INTERNAL_RESET_MEDIA_QUERY_CACHE_FOR_TESTS__();
    mockMatchMedia = vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia,
    });
  });

  it('should use default breakpoint (768px)', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    expect(typeof result.current).toBe('boolean');
  });

  it('should respect custom breakpoint', () => {
    const { result } = renderHook(() => useIsMobile(1024));
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 1023px)');
    expect(typeof result.current).toBe('boolean');
  });

  it('should return true for mobile viewport', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return false for desktop viewport', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should handle common mobile breakpoints', () => {
    const breakpoints = [320, 480, 640, 768, 1024];

    for (const bp of breakpoints) {
      // Each breakpoint produces a unique query, but the module-level cache
      // would otherwise hold a `MediaQueryList` from a previous breakpoint
      // and skip re-calling `mockMatchMedia` for already-seen queries.
      __INTERNAL_RESET_MEDIA_QUERY_CACHE_FOR_TESTS__();
      const { result } = renderHook(() => useIsMobile(bp));
      expect(mockMatchMedia).toHaveBeenCalledWith(`(max-width: ${bp - 1}px)`);
      expect(typeof result.current).toBe('boolean');
    }
  });
});
