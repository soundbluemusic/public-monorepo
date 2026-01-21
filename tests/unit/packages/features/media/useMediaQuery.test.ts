/**
 * @fileoverview Unit tests for useMediaQuery and useIsMobile hooks
 */

import { useIsMobile, useMediaQuery } from '@soundblue/features/media';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useMediaQuery', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>;
  let listeners: ((event: MediaQueryListEvent) => void)[] = [];

  beforeEach(() => {
    listeners = [];

    mockMatchMedia = vi.fn((query: string) => {
      const mediaQuery = {
        matches: false,
        media: query,
        addEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
          if (event === 'change') {
            listeners.push(handler);
          }
        }),
        removeEventListener: vi.fn(
          (event: string, handler: (event: MediaQueryListEvent) => void) => {
            if (event === 'change') {
              const index = listeners.indexOf(handler);
              if (index !== -1) {
                listeners.splice(index, 1);
              }
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
      const { result } = renderHook(() => useIsMobile(bp));
      expect(mockMatchMedia).toHaveBeenCalledWith(`(max-width: ${bp - 1}px)`);
      expect(typeof result.current).toBe('boolean');
    }
  });
});
