/**
 * @fileoverview Unit tests for useOnlineStatus hook
 */

import { useOnlineStatus } from '@soundblue/pwa/react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useOnlineStatus', () => {
  beforeEach(() => {
    // Reset navigator.onLine to true before each test
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    });
  });

  it('should return initial online status (true)', () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);
  });

  it('should return initial online status (false)', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false,
    });

    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(false);
  });

  it('should update isOnline when going offline', async () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    await waitFor(() => {
      expect(result.current.isOnline).toBe(false);
      expect(result.current.wasOffline).toBe(true);
    });
  });

  it('should update isOnline when going online', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false,
    });

    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.isOnline).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    await waitFor(() => {
      expect(result.current.isOnline).toBe(true);
    });
  });

  it('should set wasOffline flag when going offline', async () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.wasOffline).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    await waitFor(() => {
      expect(result.current.wasOffline).toBe(true);
    });
  });

  it('should maintain wasOffline flag after coming back online', async () => {
    const { result } = renderHook(() => useOnlineStatus());

    // Go offline
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    await waitFor(() => {
      expect(result.current.isOnline).toBe(false);
      expect(result.current.wasOffline).toBe(true);
    });

    // Go back online
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    await waitFor(() => {
      expect(result.current.isOnline).toBe(true);
      expect(result.current.wasOffline).toBe(true); // Should still be true
    });
  });

  it('should handle multiple offline/online transitions', async () => {
    const { result } = renderHook(() => useOnlineStatus());

    // Go offline
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    await waitFor(() => {
      expect(result.current.isOnline).toBe(false);
      expect(result.current.wasOffline).toBe(true);
    });

    // Go online
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    await waitFor(() => {
      expect(result.current.isOnline).toBe(true);
    });

    // Go offline again
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    await waitFor(() => {
      expect(result.current.isOnline).toBe(false);
      expect(result.current.wasOffline).toBe(true);
    });
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

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should not update state after unmount', async () => {
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
