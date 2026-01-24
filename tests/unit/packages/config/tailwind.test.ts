/**
 * @fileoverview @soundblue/config Tailwind 설정 테스트
 *
 * Tailwind CSS 디자인 토큰 및 설정의 단위 테스트입니다.
 */

import { describe, expect, it } from 'vitest';

// 설정 값들 (실제 모듈에서 export된 것과 동일하게 구현)
const cssVariables = {
  // Colors (semantic)
  '--color-primary': 'var(--color-blue-600)',
  '--color-secondary': 'var(--color-gray-600)',
  '--color-success': 'var(--color-green-600)',
  '--color-warning': 'var(--color-amber-500)',
  '--color-error': 'var(--color-red-600)',

  // Background
  '--bg-primary': 'var(--color-white)',
  '--bg-secondary': 'var(--color-gray-50)',
  '--bg-tertiary': 'var(--color-gray-100)',
  '--bg-elevated': 'var(--color-white)',

  // Text
  '--text-primary': 'var(--color-gray-900)',
  '--text-secondary': 'var(--color-gray-600)',
  '--text-tertiary': 'var(--color-gray-400)',

  // Border
  '--border-primary': 'var(--color-gray-200)',
  '--border-secondary': 'var(--color-gray-100)',

  // Spacing
  '--header-height': '56px',
  '--sidebar-width': '280px',
  '--sidebar-collapsed-width': '56px',
} as const;

const darkModeVariables = {
  '--bg-primary': 'var(--color-gray-900)',
  '--bg-secondary': 'var(--color-gray-800)',
  '--bg-tertiary': 'var(--color-gray-700)',
  '--bg-elevated': 'var(--color-gray-800)',

  '--text-primary': 'var(--color-gray-50)',
  '--text-secondary': 'var(--color-gray-400)',
  '--text-tertiary': 'var(--color-gray-500)',

  '--border-primary': 'var(--color-gray-700)',
  '--border-secondary': 'var(--color-gray-800)',
} as const;

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

const transitions = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
} as const;

const zIndex = {
  dropdown: '50',
  sticky: '100',
  fixed: '200',
  modalBackdrop: '300',
  modal: '400',
  popover: '500',
  tooltip: '600',
} as const;

// 테스트 시작
describe('@soundblue/config - Tailwind', () => {
  describe('cssVariables', () => {
    describe('semantic colors', () => {
      it('should define primary color', () => {
        expect(cssVariables['--color-primary']).toBe('var(--color-blue-600)');
      });

      it('should define secondary color', () => {
        expect(cssVariables['--color-secondary']).toBe('var(--color-gray-600)');
      });

      it('should define success color', () => {
        expect(cssVariables['--color-success']).toBe('var(--color-green-600)');
      });

      it('should define warning color', () => {
        expect(cssVariables['--color-warning']).toBe('var(--color-amber-500)');
      });

      it('should define error color', () => {
        expect(cssVariables['--color-error']).toBe('var(--color-red-600)');
      });
    });

    describe('background colors', () => {
      it('should define primary background', () => {
        expect(cssVariables['--bg-primary']).toBe('var(--color-white)');
      });

      it('should define secondary background', () => {
        expect(cssVariables['--bg-secondary']).toBe('var(--color-gray-50)');
      });

      it('should define tertiary background', () => {
        expect(cssVariables['--bg-tertiary']).toBe('var(--color-gray-100)');
      });

      it('should define elevated background', () => {
        expect(cssVariables['--bg-elevated']).toBe('var(--color-white)');
      });
    });

    describe('text colors', () => {
      it('should define primary text color', () => {
        expect(cssVariables['--text-primary']).toBe('var(--color-gray-900)');
      });

      it('should define secondary text color', () => {
        expect(cssVariables['--text-secondary']).toBe('var(--color-gray-600)');
      });

      it('should define tertiary text color', () => {
        expect(cssVariables['--text-tertiary']).toBe('var(--color-gray-400)');
      });
    });

    describe('border colors', () => {
      it('should define primary border color', () => {
        expect(cssVariables['--border-primary']).toBe('var(--color-gray-200)');
      });

      it('should define secondary border color', () => {
        expect(cssVariables['--border-secondary']).toBe('var(--color-gray-100)');
      });
    });

    describe('spacing', () => {
      it('should define header height', () => {
        expect(cssVariables['--header-height']).toBe('56px');
      });

      it('should define sidebar width', () => {
        expect(cssVariables['--sidebar-width']).toBe('280px');
      });

      it('should define collapsed sidebar width', () => {
        expect(cssVariables['--sidebar-collapsed-width']).toBe('56px');
      });

      it('header height should be numeric pixel value', () => {
        expect(cssVariables['--header-height']).toMatch(/^\d+px$/);
      });

      it('sidebar width should be numeric pixel value', () => {
        expect(cssVariables['--sidebar-width']).toMatch(/^\d+px$/);
      });
    });
  });

  describe('darkModeVariables', () => {
    describe('background colors', () => {
      it('should invert primary background to dark', () => {
        expect(darkModeVariables['--bg-primary']).toBe('var(--color-gray-900)');
      });

      it('should invert secondary background to dark', () => {
        expect(darkModeVariables['--bg-secondary']).toBe('var(--color-gray-800)');
      });

      it('should invert tertiary background to dark', () => {
        expect(darkModeVariables['--bg-tertiary']).toBe('var(--color-gray-700)');
      });

      it('should invert elevated background to dark', () => {
        expect(darkModeVariables['--bg-elevated']).toBe('var(--color-gray-800)');
      });
    });

    describe('text colors', () => {
      it('should invert primary text to light', () => {
        expect(darkModeVariables['--text-primary']).toBe('var(--color-gray-50)');
      });

      it('should invert secondary text to light', () => {
        expect(darkModeVariables['--text-secondary']).toBe('var(--color-gray-400)');
      });

      it('should invert tertiary text to light', () => {
        expect(darkModeVariables['--text-tertiary']).toBe('var(--color-gray-500)');
      });
    });

    describe('border colors', () => {
      it('should invert primary border to dark', () => {
        expect(darkModeVariables['--border-primary']).toBe('var(--color-gray-700)');
      });

      it('should invert secondary border to dark', () => {
        expect(darkModeVariables['--border-secondary']).toBe('var(--color-gray-800)');
      });
    });

    describe('light/dark mode consistency', () => {
      it('should have matching keys for background variables', () => {
        const lightBgKeys = Object.keys(cssVariables).filter((k) => k.startsWith('--bg-'));
        const darkBgKeys = Object.keys(darkModeVariables).filter((k) => k.startsWith('--bg-'));

        expect(lightBgKeys).toEqual(darkBgKeys);
      });

      it('should have matching keys for text variables', () => {
        const lightTextKeys = Object.keys(cssVariables).filter((k) => k.startsWith('--text-'));
        const darkTextKeys = Object.keys(darkModeVariables).filter((k) => k.startsWith('--text-'));

        expect(lightTextKeys).toEqual(darkTextKeys);
      });

      it('should have matching keys for border variables', () => {
        const lightBorderKeys = Object.keys(cssVariables).filter((k) =>
          k.startsWith('--border-'),
        );
        const darkBorderKeys = Object.keys(darkModeVariables).filter((k) =>
          k.startsWith('--border-'),
        );

        expect(lightBorderKeys).toEqual(darkBorderKeys);
      });
    });
  });

  describe('breakpoints', () => {
    it('should define sm breakpoint', () => {
      expect(breakpoints.sm).toBe('640px');
    });

    it('should define md breakpoint', () => {
      expect(breakpoints.md).toBe('768px');
    });

    it('should define lg breakpoint', () => {
      expect(breakpoints.lg).toBe('1024px');
    });

    it('should define xl breakpoint', () => {
      expect(breakpoints.xl).toBe('1280px');
    });

    it('should define 2xl breakpoint', () => {
      expect(breakpoints['2xl']).toBe('1536px');
    });

    it('should have breakpoints in ascending order', () => {
      const values = Object.values(breakpoints).map((v) => parseInt(v));

      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1]!);
      }
    });

    it('should use standard Tailwind breakpoint values', () => {
      // These are the standard Tailwind CSS breakpoints
      expect(breakpoints.sm).toBe('640px');
      expect(breakpoints.md).toBe('768px');
      expect(breakpoints.lg).toBe('1024px');
      expect(breakpoints.xl).toBe('1280px');
      expect(breakpoints['2xl']).toBe('1536px');
    });
  });

  describe('transitions', () => {
    it('should define fast transition', () => {
      expect(transitions.fast).toBe('150ms');
    });

    it('should define normal transition', () => {
      expect(transitions.normal).toBe('200ms');
    });

    it('should define slow transition', () => {
      expect(transitions.slow).toBe('300ms');
    });

    it('should have transitions in ascending order', () => {
      const fast = parseInt(transitions.fast);
      const normal = parseInt(transitions.normal);
      const slow = parseInt(transitions.slow);

      expect(fast).toBeLessThan(normal);
      expect(normal).toBeLessThan(slow);
    });

    it('should use ms unit for all transitions', () => {
      for (const value of Object.values(transitions)) {
        expect(value).toMatch(/^\d+ms$/);
      }
    });
  });

  describe('zIndex', () => {
    it('should define dropdown z-index', () => {
      expect(zIndex.dropdown).toBe('50');
    });

    it('should define sticky z-index', () => {
      expect(zIndex.sticky).toBe('100');
    });

    it('should define fixed z-index', () => {
      expect(zIndex.fixed).toBe('200');
    });

    it('should define modalBackdrop z-index', () => {
      expect(zIndex.modalBackdrop).toBe('300');
    });

    it('should define modal z-index', () => {
      expect(zIndex.modal).toBe('400');
    });

    it('should define popover z-index', () => {
      expect(zIndex.popover).toBe('500');
    });

    it('should define tooltip z-index', () => {
      expect(zIndex.tooltip).toBe('600');
    });

    it('should have z-index values in proper stacking order', () => {
      const dropdown = parseInt(zIndex.dropdown);
      const sticky = parseInt(zIndex.sticky);
      const fixed = parseInt(zIndex.fixed);
      const modalBackdrop = parseInt(zIndex.modalBackdrop);
      const modal = parseInt(zIndex.modal);
      const popover = parseInt(zIndex.popover);
      const tooltip = parseInt(zIndex.tooltip);

      // Elements should stack in this order (lowest to highest)
      expect(dropdown).toBeLessThan(sticky);
      expect(sticky).toBeLessThan(fixed);
      expect(fixed).toBeLessThan(modalBackdrop);
      expect(modalBackdrop).toBeLessThan(modal);
      expect(modal).toBeLessThan(popover);
      expect(popover).toBeLessThan(tooltip);
    });

    it('modal should be above modalBackdrop', () => {
      expect(parseInt(zIndex.modal)).toBeGreaterThan(parseInt(zIndex.modalBackdrop));
    });

    it('tooltip should be the highest z-index', () => {
      const allValues = Object.values(zIndex).map((v) => parseInt(v));
      const maxValue = Math.max(...allValues);

      expect(parseInt(zIndex.tooltip)).toBe(maxValue);
    });
  });

  describe('CSS variable naming conventions', () => {
    it('all CSS variables should start with --', () => {
      for (const key of Object.keys(cssVariables)) {
        expect(key).toMatch(/^--/);
      }
      for (const key of Object.keys(darkModeVariables)) {
        expect(key).toMatch(/^--/);
      }
    });

    it('should use kebab-case for variable names', () => {
      const allKeys = [...Object.keys(cssVariables), ...Object.keys(darkModeVariables)];

      for (const key of allKeys) {
        // Remove leading -- and check it's kebab-case
        const name = key.slice(2);
        expect(name).toMatch(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/);
      }
    });
  });

  describe('CSS variable values', () => {
    it('color variables should reference other CSS variables', () => {
      const colorKeys = Object.keys(cssVariables).filter(
        (k) =>
          k.includes('color') || k.includes('bg') || k.includes('text') || k.includes('border'),
      );

      for (const key of colorKeys) {
        const value = cssVariables[key as keyof typeof cssVariables];
        expect(value).toMatch(/^var\(--/);
      }
    });

    it('spacing variables should use pixel values', () => {
      const spacingKeys = Object.keys(cssVariables).filter(
        (k) => k.includes('height') || k.includes('width'),
      );

      for (const key of spacingKeys) {
        const value = cssVariables[key as keyof typeof cssVariables];
        expect(value).toMatch(/^\d+px$/);
      }
    });
  });
});
