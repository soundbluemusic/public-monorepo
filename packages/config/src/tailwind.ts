/**
 * @fileoverview Shared Tailwind CSS Configuration
 * @environment build-only
 *
 * Base Tailwind configuration shared across all apps.
 * Apps can extend this with their own customizations.
 */

/**
 * Design tokens as CSS custom properties
 */
export const cssVariables = {
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
  '--sidebar-collapsed-width': '64px',
} as const;

/**
 * Dark mode CSS variables
 */
export const darkModeVariables = {
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

/**
 * Shared breakpoints
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Animation durations
 */
export const transitions = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
} as const;

/**
 * Z-index scale
 */
export const zIndex = {
  dropdown: '50',
  sticky: '100',
  fixed: '200',
  modalBackdrop: '300',
  modal: '400',
  popover: '500',
  tooltip: '600',
} as const;
