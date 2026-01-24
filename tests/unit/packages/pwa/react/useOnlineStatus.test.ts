/**
 * @fileoverview Unit tests for useOnlineStatus hook
 *
 * Note: The hook has hydration-safe behavior:
 * - Returns `isOnline: true` before mount to prevent SSR/client mismatch
 * - Only responds to actual online/offline events (does NOT check navigator.onLine on load)
 * - This avoids false "offline" detection during SSR hydration or network initialization
 */

import { useOnlineStatus } from '@soundblue/pwa/react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useOnlineStatus', () => {
  beforeEach(() => {
    // Reset navigator.onLine to true before each test
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true before mount (hydration safety)', () => {
    const { result } = renderHook(() => useOnlineStatus());
    // Before mount completes, always returns true for hydration safety
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);
  });

  it('should return isOnline: true after mount (default state)', () => {
    const { result } = renderHook(() => useOnlineStatus());

    // After mount, should still be true (we don't check navigator.onLine)
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);
  });

  it('should NOT read navigator.onLine on initial load', () => {
    // Even if navigator.onLine is false, we don't check it on initial load
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false,
    });

    const { result } = renderHook(() => useOnlineStatus());

    // Should still report online because we don't check navigator.onLine
    // This prevents false "offline" detection during page load/hydration
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);
  });

  it('should update isOnline when going offline', () => {
    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(true);
  });

  it('should update isOnline when going online', () => {
    const { result } = renderHook(() => useOnlineStatus());

    // Go offline first
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);

    // Then go online
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
  });

  it('should set wasOffline flag when going offline', () => {
    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current.wasOffline).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.wasOffline).toBe(true);
  });

  it('should maintain wasOffline flag after coming back online (sticky flag)', () => {
    const { result } = renderHook(() => useOnlineStatus());

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
    expect(result.current.wasOffline).toBe(true); // Should still be true (sticky)
  });

  it('should handle multiple offline/online transitions', () => {
    const { result } = renderHook(() => useOnlineStatus());

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
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useOnlineStatus());

    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  it('should not update state after unmount', () => {
    const { result, unmount } = renderHook(() => useOnlineStatus());

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
});
