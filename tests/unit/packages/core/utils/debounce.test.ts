/**
 * @fileoverview Tests for debounce utility functions
 */

import { debounce, debounceWithCancel } from '@soundblue/core/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay function execution', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should only execute last call when called multiple times', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('first');
    debounced('second');
    debounced('third');

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('third');
  });

  it('should reset timer on each call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass all arguments to the function', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('arg1', 'arg2', 'arg3');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
  });

  it('should allow multiple independent debounced calls after delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('first');
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);

    debounced('second');
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  // Edge cases
  it('should handle delay of 0 (executes immediately after microtask)', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 0);

    debounced('test');
    expect(fn).not.toHaveBeenCalled(); // Still async

    vi.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('test');
  });

  it('should handle negative delay (treated as 0)', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, -100);

    debounced('test');
    vi.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should handle rapid successive calls without memory leak', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    // Simulate 1000 rapid calls
    for (let i = 0; i < 1000; i++) {
      debounced(i);
    }

    // Only last call should execute
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(999);
  });

  it('should handle very large delay', () => {
    const fn = vi.fn();
    // Use a large but reasonable delay (1 hour)
    const debounced = debounce(fn, 3600000);

    debounced('test');
    vi.advanceTimersByTime(10000); // Only advance 10 seconds
    expect(fn).not.toHaveBeenCalled();

    // Advance the rest to complete
    vi.advanceTimersByTime(3590000);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('debounceWithCancel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay function execution', () => {
    const fn = vi.fn();
    const { call } = debounceWithCancel(fn, 100);

    call();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should cancel pending execution', () => {
    const fn = vi.fn();
    const { call, cancel } = debounceWithCancel(fn, 100);

    call();
    vi.advanceTimersByTime(50);
    cancel();
    vi.advanceTimersByTime(100);

    expect(fn).not.toHaveBeenCalled();
  });

  it('should allow calling after cancel', () => {
    const fn = vi.fn();
    const { call, cancel } = debounceWithCancel(fn, 100);

    call('first');
    cancel();
    call('second');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('second');
  });

  it('should handle multiple cancels gracefully', () => {
    const fn = vi.fn();
    const { cancel } = debounceWithCancel(fn, 100);

    cancel();
    cancel();
    cancel();

    expect(fn).not.toHaveBeenCalled();
  });

  it('should pass arguments correctly', () => {
    const fn = vi.fn();
    const { call } = debounceWithCancel(fn, 100);

    call('a', 'b', 'c');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('a', 'b', 'c');
  });
});
