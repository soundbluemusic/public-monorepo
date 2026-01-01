/**
 * Validation Utilities
 *
 * ID 검증, 타입 가드 등
 */
import { LIMITS, RESERVED_NAMES } from './limits';

// 검증용 Set (O(1) lookup)
const VALID_THEMES = new Set<string>(['light', 'dark', 'system']);
const VALID_LANGUAGES = new Set<string>(['ko', 'en']);
const RESERVED_NAMES_SET = new Set<string>(RESERVED_NAMES);

/**
 * Validates an ID string to prevent abuse and prototype pollution
 * @param id - The ID to validate
 * @param fieldName - Name of the field for error messages
 * @throws Error if validation fails
 */
export function validateId(id: string, fieldName: string): void {
  if (!id || typeof id !== 'string') {
    throw new Error(`${fieldName} is required`);
  }
  if (id.length > LIMITS.ID_LENGTH) {
    throw new Error(`${fieldName} exceeds maximum length of ${LIMITS.ID_LENGTH}`);
  }
  // Prevent prototype pollution attempts
  if (RESERVED_NAMES_SET.has(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
}

/**
 * Checks if a value is a reserved JavaScript property name
 */
export function isReservedName(value: string): boolean {
  return RESERVED_NAMES_SET.has(value);
}

/**
 * Type guard for validating theme values
 */
export function isValidTheme(value: string | null): value is 'light' | 'dark' | 'system' {
  return value !== null && VALID_THEMES.has(value);
}

/**
 * Type guard for validating language values
 */
export function isValidLanguage(value: string | null): value is 'ko' | 'en' {
  return value !== null && VALID_LANGUAGES.has(value);
}

/**
 * Validates that a string is not empty
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
