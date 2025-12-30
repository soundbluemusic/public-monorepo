/**
 * @fileoverview Tests for toast notification system
 */

import { clearToasts, removeToast, toast, useToast } from '@soundblue/features/toast';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Toast Store Functions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearToasts();
  });

  afterEach(() => {
    vi.useRealTimers();
    clearToasts();
  });

  describe('toast', () => {
    it('should add a toast with default values', () => {
      const id = toast({ message: 'Test message' });
      expect(id).toMatch(/^toast-/);
    });

    it('should add toast with custom type', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ message: 'Success!', type: 'success' });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]?.type).toBe('success');
    });

    it('should add toast with custom duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ message: 'Long toast', duration: 5000 });
      });

      expect(result.current.toasts[0]?.duration).toBe(5000);
    });

    it('should auto-remove toast after duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ message: 'Auto remove', duration: 1000 });
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should not auto-remove if duration is 0', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ message: 'Persistent toast', duration: 0 });
      });

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.toasts).toHaveLength(1);
    });

    it('should handle multiple toasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ message: 'First' });
        toast({ message: 'Second' });
        toast({ message: 'Third' });
      });

      expect(result.current.toasts).toHaveLength(3);
    });
  });

  describe('removeToast', () => {
    it('should remove specific toast by id', () => {
      const { result } = renderHook(() => useToast());

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

    it('should handle removing non-existent toast', () => {
      const { result } = renderHook(() => useToast());

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
    it('should remove all toasts', () => {
      const { result } = renderHook(() => useToast());

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

    it('should handle clearing empty store', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        clearToasts();
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });
});

describe('useToast hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearToasts();
  });

  afterEach(() => {
    vi.useRealTimers();
    clearToasts();
  });

  it('should return toast function', () => {
    const { result } = renderHook(() => useToast());
    expect(typeof result.current.toast).toBe('function');
  });

  it('should return toasts array', () => {
    const { result } = renderHook(() => useToast());
    expect(Array.isArray(result.current.toasts)).toBe(true);
  });

  it('should return removeToast function', () => {
    const { result } = renderHook(() => useToast());
    expect(typeof result.current.removeToast).toBe('function');
  });

  it('should return clearToasts function', () => {
    const { result } = renderHook(() => useToast());
    expect(typeof result.current.clearToasts).toBe('function');
  });

  it('should add toast via hook toast function', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ message: 'Via hook' });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]?.message).toBe('Via hook');
  });

  it('should share state between multiple hooks', () => {
    const { result: result1 } = renderHook(() => useToast());
    const { result: result2 } = renderHook(() => useToast());

    act(() => {
      result1.current.toast({ message: 'Shared toast', duration: 0 });
    });

    expect(result1.current.toasts).toHaveLength(1);
    expect(result2.current.toasts).toHaveLength(1);
  });

  it('should support all toast types', () => {
    const { result } = renderHook(() => useToast());
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
