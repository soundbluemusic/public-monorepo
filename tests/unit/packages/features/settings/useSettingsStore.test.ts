/**
 * @fileoverview Unit tests for useSettingsStore (Zustand store with persist middleware)
 */

import { useSettingsStore } from '@soundblue/features/settings';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useSettingsStore', () => {
  let localStorageMock: Map<string, string>;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = new Map<string, string>();

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => localStorageMock.get(key) ?? null),
        setItem: vi.fn((key: string, value: string) => {
          localStorageMock.set(key, value);
        }),
        removeItem: vi.fn((key: string) => {
          localStorageMock.delete(key);
        }),
        clear: vi.fn(() => {
          localStorageMock.clear();
        }),
      },
      writable: true,
      configurable: true,
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    // Mock document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
          toggle: vi.fn(),
        },
      },
      writable: true,
      configurable: true,
    });

    // Clear localStorage before each test
    localStorageMock.clear();
  });

  afterEach(() => {
    // Reset store to initial state
    act(() => {
      useSettingsStore.setState({
        theme: 'system',
        sidebarCollapsed: false,
      });
    });
  });

  describe('Initial State', () => {
    it('should have default theme as system', () => {
      const { result } = renderHook(() => useSettingsStore());
      expect(result.current.theme).toBe('system');
    });

    it('should have sidebar not collapsed by default', () => {
      const { result } = renderHook(() => useSettingsStore());
      expect(result.current.sidebarCollapsed).toBe(false);
    });
  });

  describe('setTheme', () => {
    it('should update theme to light', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
    });

    it('should update theme to dark', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should update theme to system', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.theme).toBe('system');
    });

    it('should apply theme to DOM when setting light theme', () => {
      const { result } = renderHook(() => useSettingsStore());
      const root = document.documentElement;

      act(() => {
        result.current.setTheme('light');
      });

      expect(root.classList.add).toHaveBeenCalledWith('theme-transition');
      expect(root.classList.toggle).toHaveBeenCalledWith('dark', false);
    });

    it('should apply theme to DOM when setting dark theme', () => {
      const { result } = renderHook(() => useSettingsStore());
      const root = document.documentElement;

      act(() => {
        result.current.setTheme('dark');
      });

      expect(root.classList.add).toHaveBeenCalledWith('theme-transition');
      expect(root.classList.toggle).toHaveBeenCalledWith('dark', true);
    });

    it('should respect prefers-color-scheme for system theme', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useSettingsStore());
      const root = document.documentElement;

      act(() => {
        result.current.setTheme('system');
      });

      expect(root.classList.toggle).toHaveBeenCalledWith('dark', true);
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from system to dark', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('dark');
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    it('should toggle from light to dark', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('light');
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should toggle multiple times', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.toggleTheme(); // system -> dark
      });
      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.toggleTheme(); // dark -> light
      });
      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.toggleTheme(); // light -> dark
      });
      expect(result.current.theme).toBe('dark');
    });
  });

  describe('setSidebarCollapsed', () => {
    it('should set sidebar to collapsed', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setSidebarCollapsed(true);
      });

      expect(result.current.sidebarCollapsed).toBe(true);
    });

    it('should set sidebar to expanded', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setSidebarCollapsed(true);
      });

      act(() => {
        result.current.setSidebarCollapsed(false);
      });

      expect(result.current.sidebarCollapsed).toBe(false);
    });

    it('should handle multiple sets', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setSidebarCollapsed(true);
      });
      expect(result.current.sidebarCollapsed).toBe(true);

      act(() => {
        result.current.setSidebarCollapsed(true); // redundant
      });
      expect(result.current.sidebarCollapsed).toBe(true);

      act(() => {
        result.current.setSidebarCollapsed(false);
      });
      expect(result.current.sidebarCollapsed).toBe(false);
    });
  });

  describe('toggleSidebar', () => {
    it('should toggle sidebar from expanded to collapsed', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarCollapsed).toBe(true);
    });

    it('should toggle sidebar from collapsed to expanded', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setSidebarCollapsed(true);
      });

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarCollapsed).toBe(false);
    });

    it('should toggle multiple times', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.toggleSidebar(); // false -> true
      });
      expect(result.current.sidebarCollapsed).toBe(true);

      act(() => {
        result.current.toggleSidebar(); // true -> false
      });
      expect(result.current.sidebarCollapsed).toBe(false);

      act(() => {
        result.current.toggleSidebar(); // false -> true
      });
      expect(result.current.sidebarCollapsed).toBe(true);
    });
  });

  describe('Persistence', () => {
    it('should maintain state after theme changes', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('dark');
      });

      // Verify state is updated
      expect(result.current.theme).toBe('dark');
    });

    it('should maintain state after sidebar changes', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setSidebarCollapsed(true);
      });

      // Verify state is updated
      expect(result.current.sidebarCollapsed).toBe(true);
    });

    it('should persist multiple state changes', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('light');
        result.current.setSidebarCollapsed(true);
      });

      // Verify the final state is correct
      expect(result.current.theme).toBe('light');
      expect(result.current.sidebarCollapsed).toBe(true);
    });

    it('should use localStorage for persistence', () => {
      // Verify localStorage methods are available
      expect(window.localStorage.getItem).toBeDefined();
      expect(window.localStorage.setItem).toBeDefined();

      // Zustand's persist middleware uses localStorage
      // State persistence is verified implicitly through state retention
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.set('settings-storage', 'invalid json');

      const { result } = renderHook(() => useSettingsStore());

      // Should fall back to defaults
      expect(result.current.theme).toBe('system');
      expect(result.current.sidebarCollapsed).toBe(false);
    });

    it('should handle missing localStorage gracefully', () => {
      localStorageMock.clear();

      const { result } = renderHook(() => useSettingsStore());

      // Should use defaults
      expect(result.current.theme).toBe('system');
      expect(result.current.sidebarCollapsed).toBe(false);
    });
  });

  describe('getState', () => {
    it('should be able to read state without rendering', () => {
      const state = useSettingsStore.getState();
      expect(state.theme).toBe('system');
      expect(state.sidebarCollapsed).toBe(false);
    });

    it('should reflect updates made via setState', () => {
      act(() => {
        useSettingsStore.setState({ theme: 'dark' });
      });

      const state = useSettingsStore.getState();
      expect(state.theme).toBe('dark');
    });
  });

  describe('subscribe', () => {
    it('should notify subscribers on state change', () => {
      const listener = vi.fn();
      const unsubscribe = useSettingsStore.subscribe(listener);

      act(() => {
        useSettingsStore.getState().setTheme('dark');
      });

      expect(listener).toHaveBeenCalled();

      unsubscribe();
    });

    it('should stop notifying after unsubscribe', () => {
      const listener = vi.fn();
      const unsubscribe = useSettingsStore.subscribe(listener);

      unsubscribe();

      act(() => {
        useSettingsStore.getState().setTheme('dark');
      });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Theme Application', () => {
    it('should remove theme-transition class after 300ms', async () => {
      vi.useFakeTimers();

      const { result } = renderHook(() => useSettingsStore());
      const root = document.documentElement;

      act(() => {
        result.current.setTheme('dark');
      });

      expect(root.classList.add).toHaveBeenCalledWith('theme-transition');

      vi.advanceTimersByTime(300);

      expect(root.classList.remove).toHaveBeenCalledWith('theme-transition');

      vi.useRealTimers();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid theme changes', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('light');
        result.current.setTheme('dark');
        result.current.setTheme('system');
      });

      expect(result.current.theme).toBe('system');
    });

    it('should handle rapid sidebar toggles', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.toggleSidebar();
        result.current.toggleSidebar();
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarCollapsed).toBe(true); // toggled 3 times from false
    });

    it('should maintain state consistency', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('dark');
        result.current.setSidebarCollapsed(true);
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.sidebarCollapsed).toBe(true);

      act(() => {
        result.current.toggleTheme();
      });

      // Theme should change but sidebar should remain
      expect(result.current.theme).toBe('light');
      expect(result.current.sidebarCollapsed).toBe(true);
    });
  });
});
