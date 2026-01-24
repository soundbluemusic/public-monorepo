/**
 * @fileoverview Unit tests for useAutoAnimate hook
 *
 * Tests the @formkit/auto-animate wrapper hook functionality:
 * - Returns [setRef, setEnabled] tuple
 * - Applies autoAnimate when ref is set
 * - Disables/enables animation via setEnabled
 * - Passes options to autoAnimate
 */

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Create mock controller functions in module scope
const mockDisable = vi.fn();
const mockEnable = vi.fn();

// Mock @formkit/auto-animate before importing useAutoAnimate
vi.mock('@formkit/auto-animate', () => ({
  default: vi.fn(() => ({ disable: mockDisable, enable: mockEnable })),
}));

// Import after mock setup
import { useAutoAnimate } from '@soundblue/ui/hooks';
import autoAnimate from '@formkit/auto-animate';

const mockAutoAnimate = vi.mocked(autoAnimate);

describe('useAutoAnimate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return [setRef, setEnabled] tuple', () => {
    const { result } = renderHook(() => useAutoAnimate());

    expect(result.current).toHaveLength(2);
    expect(typeof result.current[0]).toBe('function');
    expect(typeof result.current[1]).toBe('function');
  });

  it('should apply autoAnimate when ref is set with a node', () => {
    const { result } = renderHook(() => useAutoAnimate());
    const [setRef] = result.current;

    const mockNode = document.createElement('div');
    act(() => {
      setRef(mockNode);
    });

    expect(mockAutoAnimate).toHaveBeenCalledWith(mockNode, undefined);
  });

  it('should pass options to autoAnimate', () => {
    const options = { duration: 300, easing: 'ease-in-out' as const };
    const { result } = renderHook(() => useAutoAnimate(options));
    const [setRef] = result.current;

    const mockNode = document.createElement('div');
    act(() => {
      setRef(mockNode);
    });

    expect(mockAutoAnimate).toHaveBeenCalledWith(mockNode, options);
  });

  it('should not call autoAnimate when ref is set to null', () => {
    const { result } = renderHook(() => useAutoAnimate());
    const [setRef] = result.current;

    act(() => {
      setRef(null);
    });

    expect(mockAutoAnimate).not.toHaveBeenCalled();
  });

  it('should disable animation when setRef is called with null after node', () => {
    const { result } = renderHook(() => useAutoAnimate());
    const [setRef] = result.current;

    const mockNode = document.createElement('div');
    act(() => {
      setRef(mockNode);
    });

    expect(mockAutoAnimate).toHaveBeenCalledTimes(1);

    // Get fresh reference after state update
    const [setRefUpdated] = result.current;
    act(() => {
      setRefUpdated(null);
    });

    expect(mockDisable).toHaveBeenCalled();
  });

  it('should disable animation when setEnabled(false) is called', () => {
    const { result } = renderHook(() => useAutoAnimate());
    const [setRef] = result.current;

    const mockNode = document.createElement('div');
    act(() => {
      setRef(mockNode);
    });

    const [, setEnabled] = result.current;
    act(() => {
      setEnabled(false);
    });

    expect(mockDisable).toHaveBeenCalled();
  });

  it('should enable animation when setEnabled(true) is called after disable', () => {
    const { result } = renderHook(() => useAutoAnimate());
    const [setRef] = result.current;

    const mockNode = document.createElement('div');
    act(() => {
      setRef(mockNode);
    });

    // Disable first
    let [, setEnabled] = result.current;
    act(() => {
      setEnabled(false);
    });

    expect(mockDisable).toHaveBeenCalled();

    // Re-enable
    [, setEnabled] = result.current;
    act(() => {
      setEnabled(true);
    });

    expect(mockEnable).toHaveBeenCalled();
  });

  it('should handle setEnabled without node being set', () => {
    const { result } = renderHook(() => useAutoAnimate());
    const [, setEnabled] = result.current;

    // Should not throw when called without node
    expect(() => {
      act(() => {
        setEnabled(false);
      });
    }).not.toThrow();

    expect(() => {
      act(() => {
        setEnabled(true);
      });
    }).not.toThrow();
  });

  it('should work with different HTML element types', () => {
    const { result: ulResult } = renderHook(() => useAutoAnimate<HTMLUListElement>());
    const { result: divResult } = renderHook(() => useAutoAnimate<HTMLDivElement>());

    const ulNode = document.createElement('ul');
    const divNode = document.createElement('div');

    act(() => {
      ulResult.current[0](ulNode);
      divResult.current[0](divNode);
    });

    expect(mockAutoAnimate).toHaveBeenCalledWith(ulNode, undefined);
    expect(mockAutoAnimate).toHaveBeenCalledWith(divNode, undefined);
  });

  it('should create new animation controller when options change', () => {
    const { result, rerender } = renderHook(
      ({ options }) => useAutoAnimate(options),
      { initialProps: { options: { duration: 200 } } },
    );

    const mockNode = document.createElement('div');
    act(() => {
      result.current[0](mockNode);
    });

    expect(mockAutoAnimate).toHaveBeenCalledWith(mockNode, { duration: 200 });

    // Change options
    rerender({ options: { duration: 400 } });

    // Re-attach with new options
    act(() => {
      result.current[0](mockNode);
    });

    expect(mockAutoAnimate).toHaveBeenLastCalledWith(mockNode, { duration: 400 });
  });

  it('should not apply animation when disabled before ref is set', () => {
    const { result } = renderHook(() => useAutoAnimate());
    const [, setEnabled] = result.current;

    // Disable first
    act(() => {
      setEnabled(false);
    });

    // Now set ref - should not animate because disabled
    const mockNode = document.createElement('div');
    const [setRef] = result.current;
    act(() => {
      setRef(mockNode);
    });

    // autoAnimate should not be called when disabled
    expect(mockAutoAnimate).not.toHaveBeenCalled();
  });
});
