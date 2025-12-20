import { LIMITS, RESERVED_NAMES } from './constants';

/**
 * Validates an ID string to prevent abuse and prototype pollution
 */
export function validateId(id: string, fieldName: string): void {
  if (!id || typeof id !== 'string') {
    throw new Error(`${fieldName} is required`);
  }
  if (id.length > LIMITS.ID_LENGTH) {
    throw new Error(`${fieldName} exceeds maximum length of ${LIMITS.ID_LENGTH}`);
  }
  if ((RESERVED_NAMES as readonly string[]).includes(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
}

/**
 * Checks if a value is a reserved JavaScript property name
 */
export function isReservedName(value: string): boolean {
  return (RESERVED_NAMES as readonly string[]).includes(value);
}

/**
 * Type guard for validating theme values
 */
export function isValidTheme(value: string | null): value is 'light' | 'dark' | 'system' {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Type guard for validating language values
 */
export function isValidLanguage(value: string | null): value is 'ko' | 'en' {
  return value === 'ko' || value === 'en';
}
