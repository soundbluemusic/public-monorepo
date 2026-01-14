/**
 * @soundblue/ui - Utils Tests
 *
 * cn() 유틸리티 함수 테스트
 */
import { cn } from '@soundblue/ui/utils';
import { describe, expect, it } from 'vitest';

describe('@soundblue/ui/utils', () => {
  describe('cn()', () => {
    it('should merge class names', () => {
      const result = cn('px-4', 'py-2');
      expect(result).toBe('px-4 py-2');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toBe('base active');
    });

    it('should handle false conditions', () => {
      const isActive = false;
      const result = cn('base', isActive && 'active');
      expect(result).toBe('base');
    });

    it('should merge conflicting tailwind classes', () => {
      const result = cn('px-2', 'px-4');
      expect(result).toBe('px-4');
    });

    it('should merge conflicting color classes', () => {
      const result = cn('bg-red-500', 'bg-blue-500');
      expect(result).toBe('bg-blue-500');
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle undefined and null', () => {
      const result = cn('base', undefined, null, 'extra');
      expect(result).toBe('base extra');
    });

    it('should handle array of classes', () => {
      const result = cn(['px-2', 'py-2']);
      expect(result).toBe('px-2 py-2');
    });

    it('should handle object syntax', () => {
      const result = cn({
        'bg-red-500': true,
        'text-white': true,
        hidden: false,
      });
      expect(result).toBe('bg-red-500 text-white');
    });

    it('should handle complex combinations', () => {
      const variant = 'primary';
      const size = 'lg';
      const result = cn(
        'base-class',
        variant === 'primary' && 'bg-blue-500',
        variant === 'secondary' && 'bg-gray-500',
        { 'text-lg': size === 'lg', 'text-sm': size === 'sm' },
      );
      expect(result).toBe('base-class bg-blue-500 text-lg');
    });
  });
});
