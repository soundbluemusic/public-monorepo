/**
 * @fileoverview Shared Biome Configuration
 * @environment build-only
 *
 * Common linting and formatting rules.
 * The actual biome.json extends these programmatically.
 */

/**
 * Ignored paths for linting
 */
export const ignorePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.cache/**',
  '**/coverage/**',
  '**/*.min.js',
  '**/generated/**',
  '**/paraglide/**',
] as const;

/**
 * TypeScript-specific rules
 */
export const typescriptRules = {
  // Prefer const assertions
  preferConstAssertions: true,

  // Require explicit return types on public methods
  explicitReturnTypes: 'public-methods',

  // No any type
  noExplicitAny: true,
} as const;

/**
 * Import organization rules
 */
export const importRules = {
  // Sort imports
  sortImports: true,

  // Group by type (external, internal, relative)
  groupByType: true,

  // Newline between groups
  newlineBetweenGroups: true,
} as const;

/**
 * Formatting rules
 */
export const formatRules = {
  indentStyle: 'space' as const,
  indentWidth: 2,
  lineWidth: 100,
  quoteStyle: 'single' as const,
  trailingComma: 'all' as const,
} as const;
