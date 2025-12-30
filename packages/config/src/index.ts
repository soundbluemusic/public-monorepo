/**
 * @fileoverview Config Package - Shared Configuration
 * @environment build-only
 *
 * Centralized configuration for all apps:
 * - Tailwind CSS design tokens
 * - Vite build settings
 * - Biome linting rules
 *
 * @example
 * ```typescript
 * import { cssVariables, breakpoints } from '@soundblue/config/tailwind';
 * import { appPorts } from '@soundblue/config/vite';
 * ```
 */

export * from './biome';
// Re-export all configs
export * from './tailwind';
export * from './vite';
