/**
 * @fileoverview Tests for cn (class name) utility
 */

import { cn } from '@soundblue/core/utils';
import { describe, expect, it } from 'vitest';

describe('cn', () => {
  it('should merge class names', () => {
    const result = cn('px-4', 'py-2');
    expect(result).toBe('px-4 py-2');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isDisabled = false;
    const result = cn('base', isActive && 'active', isDisabled && 'disabled');
    expect(result).toBe('base active');
  });

  it('should handle false and undefined values', () => {
    const result = cn('base', false, undefined, null, 'end');
    expect(result).toBe('base end');
  });

  it('should merge conflicting Tailwind classes', () => {
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toBe('bg-blue-500');
  });

  it('should handle padding conflicts', () => {
    const result = cn('p-4', 'px-2');
    expect(result).toBe('p-4 px-2');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['px-4', 'py-2'], 'bg-white');
    expect(result).toBe('px-4 py-2 bg-white');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'bg-red-500': true,
      'text-white': true,
      'opacity-50': false,
    });
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle mixed inputs', () => {
    const result = cn('base', ['array-class'], { 'object-class': true }, true && 'conditional');
    expect(result).toBe('base array-class object-class conditional');
  });

  it('should properly merge margin classes', () => {
    const result = cn('m-4', 'mt-2');
    expect(result).toBe('m-4 mt-2');
  });

  it('should handle text size conflicts', () => {
    const result = cn('text-sm', 'text-lg');
    expect(result).toBe('text-lg');
  });

  it('should handle hover states', () => {
    const result = cn('hover:bg-blue-500', 'hover:bg-red-500');
    expect(result).toBe('hover:bg-red-500');
  });
});
