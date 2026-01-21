/**
 * @fileoverview Tests for toast notification system
 */

import { clearToasts, removeToast, toast, useToast } from '@soundblue/features/toast';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Toast Store Functions', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    await act(async () => {
      clearToasts();
    });
  });

  afterEach(async () => {
    await act(async () => {
      clearToasts();
    });
    vi.useRealTimers();
  });

  describe('toast', () => {
    it('should add a toast with default values', () => {
      const id = toast({ message: 'Test message' });
      expect(id).toMatch(/^toast-/);
    });

    it('should add toast with custom type', async () => {
      const { result } = renderHook(() => useToast());
      await act(async () => {});

      act(() => {
        toast({ message: 'Success!', type: 'success' });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]?.type).toBe('success');
    });

    it('should add toast with custom duration', async () => {
      const { result } = renderHook(() => useToast());
      await act(async () => {});

      act(() => {
        toast({ message: 'Long toast', duration: 5000 });
      });

      expect(result.current.toasts[0]?.duration).toBe(5000);
    });

    it('should auto-remove toast after duration', async () => {
      const { result } = renderHook(() => useToast());
      await act(async () => {});

      act(() => {
        toast({ message: 'Auto remove', duration: 1000 });
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should not auto-remove if duration is 0', async () => {
      const { result } = renderHook(() => useToast());
      await act(async () => {});

      act(() => {
        toast({ message: 'Persistent toast', duration: 0 });
      });

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.toasts).toHaveLength(1);
    });

    it('should handle multiple toasts', async () => {
      const { result } = renderHook(() => useToast());
      await act(async () => {});

      act(() => {
        toast({ message: 'First' });
        toast({ message: 'Second' });
        toast({ message: 'Third' });
      });

      expect(result.current.toasts).toHaveLength(3);
    });
  });

  describe('removeToast', () => {
    it('should remove specific toast by id', async () => {
      const { result } = renderHook(() => useToast());
      await act(async () => {});

      let id: string;
      act(() => {
        id = toast({ message: 'To be removed', duration: 0 });
        toast({ message: 'To stay', duration: 0 });
      });

      expect(result.current.toasts).toHaveLength(2);

      act(() => {
        removeToast(id);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]?.message).toBe('To stay');
    });

    it('should handle removing non-existent toast', async () => {
      const { result } = renderHook(() => useToast());
      await act(async () => {});

      act(() => {
        toast({ message: 'Test', duration: 0 });
      });

      act(() => {
        removeToast('non-existent-id');
      });

      expect(result.current.toasts).toHaveLength(1);
    });
  });

  describe('clearToasts', () => {
    it('should remove all toasts', async () => {
      const { result } = renderHook(() => useToast());
      await act(async () => {});

      act(() => {
        toast({ message: 'First', duration: 0 });
        toast({ message: 'Second', duration: 0 });
        toast({ message: 'Third', duration: 0 });
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        clearToasts();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should handle clearing empty store', async () => {
      const { result } = renderHook(() => useToast());
      await act(async () => {});

      act(() => {
        clearToasts();
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });
});

describe('useToast hook', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    await act(async () => {
      clearToasts();
    });
  });

  afterEach(async () => {
    await act(async () => {
      clearToasts();
    });
    vi.useRealTimers();
  });

  it('should return toast function', async () => {
    const { result } = renderHook(() => useToast());
    await act(async () => {});
    expect(typeof result.current.toast).toBe('function');
  });

  it('should return toasts array', async () => {
    const { result } = renderHook(() => useToast());
    await act(async () => {});
    expect(Array.isArray(result.current.toasts)).toBe(true);
  });

  it('should return removeToast function', async () => {
    const { result } = renderHook(() => useToast());
    await act(async () => {});
    expect(typeof result.current.removeToast).toBe('function');
  });

  it('should return clearToasts function', async () => {
    const { result } = renderHook(() => useToast());
    await act(async () => {});
    expect(typeof result.current.clearToasts).toBe('function');
  });

  it('should add toast via hook toast function', async () => {
    const { result } = renderHook(() => useToast());
    await act(async () => {});

    act(() => {
      result.current.toast({ message: 'Via hook' });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]?.message).toBe('Via hook');
  });

  it('should share state between multiple hooks', async () => {
    const { result: result1 } = renderHook(() => useToast());
    const { result: result2 } = renderHook(() => useToast());
    await act(async () => {});

    act(() => {
      result1.current.toast({ message: 'Shared toast', duration: 0 });
    });

    expect(result1.current.toasts).toHaveLength(1);
    expect(result2.current.toasts).toHaveLength(1);
  });

  it('should support all toast types', async () => {
    const { result } = renderHook(() => useToast());
    await act(async () => {});
    const types: Array<'success' | 'error' | 'info' | 'warning'> = [
      'success',
      'error',
      'info',
      'warning',
    ];

    act(() => {
      for (const type of types) {
        result.current.toast({ message: type, type, duration: 0 });
      }
    });

    expect(result.current.toasts).toHaveLength(4);
    expect(result.current.toasts.map((t) => t.type)).toEqual(types);
  });
});
