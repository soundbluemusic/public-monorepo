/**
 * @fileoverview Unit tests for useOnlineStatus hook
 *
 * Note: The hook has hydration-safe behavior:
 * - Returns `isOnline: true` before mount to prevent SSR/client mismatch
 * - Reads `navigator.onLine` after 100ms delay to avoid browser quirks
 */

import { useOnlineStatus } from '@soundblue/pwa/react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useOnlineStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset navigator.onLine to true before each test
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return true before mount (hydration safety)', () => {
    const { result } = renderHook(() => useOnlineStatus());
    // Before mount completes, always returns true for hydration safety
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);
  });

  it('should return initial online status (true) after mount', async () => {
    const { result } = renderHook(() => useOnlineStatus());

    // Advance timers to trigger the 100ms delay check
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);
  });

  it('should return initial online status (false) after mount delay', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false,
    });

    const { result } = renderHook(() => useOnlineStatus());

    // Before delay, should still be true (hydration safety)
    expect(result.current.isOnline).toBe(true);

    // Advance timers past the 100ms delay
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Now should reflect actual navigator.onLine value
    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(false);
  });

  it('should update isOnline when going offline', async () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(true);
  });

  it('should update isOnline when going online', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false,
    });

    const { result } = renderHook(() => useOnlineStatus());

    // Wait for mount + delay
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.isOnline).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
  });

  it('should set wasOffline flag when going offline', async () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.wasOffline).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.wasOffline).toBe(true);
  });

  it('should maintain wasOffline flag after coming back online', async () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Go offline
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(true);

    // Go back online
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(true); // Should still be true
  });

  it('should handle multiple offline/online transitions', async () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Go offline
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(true);

    // Go online
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);

    // Go offline again
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(true);
  });

  it('should cleanup event listeners on unmount', () => {
    vi.useRealTimers(); // Use real timers for this test
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useOnlineStatus());

    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should not update state after unmount', async () => {
    const { result, unmount } = renderHook(() => useOnlineStatus());

    act(() => {
      vi.advanceTimersByTime(150);
    });

    unmount();

    // Try to trigger events after unmount (should not cause errors)
    act(() => {
      window.dispatchEvent(new Event('offline'));
      window.dispatchEvent(new Event('online'));
    });

    // Should still have the last value before unmount
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);
  });

  it('should clear timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useOnlineStatus());

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
