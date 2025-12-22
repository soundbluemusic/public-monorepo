/**
 * @fileoverview Unit tests for validation utilities
 */

import { describe, expect, it } from 'vitest';
import { LIMITS } from '@soundblue/shared';
import {
  isReservedName,
  isValidLanguage,
  isValidTheme,
  validateId,
} from '@soundblue/shared';

describe('validateId', () => {
  it('should pass for valid ID', () => {
    expect(() => validateId('valid-id', 'testField')).not.toThrow();
  });

  it('should throw for empty string', () => {
    expect(() => validateId('', 'testField')).toThrow('testField is required');
  });

  it('should throw for null', () => {
    // @ts-expect-error Testing edge case
    expect(() => validateId(null, 'testField')).toThrow('testField is required');
  });

  it('should throw for undefined', () => {
    // @ts-expect-error Testing edge case
    expect(() => validateId(undefined, 'testField')).toThrow('testField is required');
  });

  it('should throw for non-string value', () => {
    // @ts-expect-error Testing edge case
    expect(() => validateId(123, 'testField')).toThrow('testField is required');
  });

  it('should throw for ID exceeding max length', () => {
    const longId = 'a'.repeat(LIMITS.ID_LENGTH + 1);
    expect(() => validateId(longId, 'testField')).toThrow(
      `testField exceeds maximum length of ${LIMITS.ID_LENGTH}`,
    );
  });

  it('should pass for ID at max length', () => {
    const maxLengthId = 'a'.repeat(LIMITS.ID_LENGTH);
    expect(() => validateId(maxLengthId, 'testField')).not.toThrow();
  });

  it('should throw for reserved name "__proto__"', () => {
    expect(() => validateId('__proto__', 'testField')).toThrow('Invalid testField');
  });

  it('should throw for reserved name "constructor"', () => {
    expect(() => validateId('constructor', 'testField')).toThrow('Invalid testField');
  });

  it('should throw for reserved name "prototype"', () => {
    expect(() => validateId('prototype', 'testField')).toThrow('Invalid testField');
  });

  it('should pass for similar but not reserved name', () => {
    expect(() => validateId('__proto', 'testField')).not.toThrow();
    expect(() => validateId('proto__', 'testField')).not.toThrow();
    expect(() => validateId('my-constructor', 'testField')).not.toThrow();
  });

  it('should accept alphanumeric with hyphens and underscores', () => {
    expect(() => validateId('valid-id_123', 'testField')).not.toThrow();
  });

  it('should accept Korean characters', () => {
    expect(() => validateId('한글-아이디', 'testField')).not.toThrow();
  });

  it('should accept special characters', () => {
    expect(() => validateId('id@example.com', 'testField')).not.toThrow();
  });

  // Edge cases
  it('should handle whitespace-only string', () => {
    expect(() => validateId('   ', 'testField')).not.toThrow(); // Whitespace is valid
  });

  it('should preserve case sensitivity', () => {
    expect(() => validateId('CamelCaseId', 'testField')).not.toThrow();
  });
});

describe('isReservedName', () => {
  it('should return true for "__proto__"', () => {
    expect(isReservedName('__proto__')).toBe(true);
  });

  it('should return true for "constructor"', () => {
    expect(isReservedName('constructor')).toBe(true);
  });

  it('should return true for "prototype"', () => {
    expect(isReservedName('prototype')).toBe(true);
  });

  it('should return false for non-reserved name', () => {
    expect(isReservedName('valid-name')).toBe(false);
  });

  it('should return false for similar but not reserved name', () => {
    expect(isReservedName('__proto')).toBe(false);
    expect(isReservedName('proto__')).toBe(false);
    expect(isReservedName('my-constructor')).toBe(false);
    expect(isReservedName('Prototype')).toBe(false); // Case-sensitive
  });

  it('should return false for empty string', () => {
    expect(isReservedName('')).toBe(false);
  });

  // Edge cases
  it('should be case-sensitive', () => {
    expect(isReservedName('__PROTO__')).toBe(false);
    expect(isReservedName('Constructor')).toBe(false);
  });
});

describe('isValidTheme', () => {
  it('should return true for "light"', () => {
    expect(isValidTheme('light')).toBe(true);
  });

  it('should return true for "dark"', () => {
    expect(isValidTheme('dark')).toBe(true);
  });

  it('should return true for "system"', () => {
    expect(isValidTheme('system')).toBe(true);
  });

  it('should return false for null', () => {
    expect(isValidTheme(null)).toBe(false);
  });

  it('should return false for invalid theme', () => {
    expect(isValidTheme('invalid')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidTheme('')).toBe(false);
  });

  it('should return false for uppercase', () => {
    expect(isValidTheme('LIGHT')).toBe(false);
    expect(isValidTheme('Dark')).toBe(false);
  });

  it('should return false for numeric string', () => {
    expect(isValidTheme('123')).toBe(false);
  });

  // Edge cases
  it('should be case-sensitive', () => {
    expect(isValidTheme('Light')).toBe(false);
    expect(isValidTheme('DARK')).toBe(false);
    expect(isValidTheme('System')).toBe(false);
  });

  it('should not accept similar values', () => {
    expect(isValidTheme('light-mode')).toBe(false);
    expect(isValidTheme('dark-theme')).toBe(false);
  });
});

describe('isValidLanguage', () => {
  it('should return true for "ko"', () => {
    expect(isValidLanguage('ko')).toBe(true);
  });

  it('should return true for "en"', () => {
    expect(isValidLanguage('en')).toBe(true);
  });

  it('should return true for "ja"', () => {
    expect(isValidLanguage('ja')).toBe(true);
  });

  it('should return false for null', () => {
    expect(isValidLanguage(null)).toBe(false);
  });

  it('should return false for invalid language', () => {
    expect(isValidLanguage('fr')).toBe(false);
    expect(isValidLanguage('de')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidLanguage('')).toBe(false);
  });

  it('should return false for uppercase', () => {
    expect(isValidLanguage('KO')).toBe(false);
    expect(isValidLanguage('EN')).toBe(false);
  });

  it('should return false for full language names', () => {
    expect(isValidLanguage('korean')).toBe(false);
    expect(isValidLanguage('english')).toBe(false);
  });

  // Edge cases
  it('should be case-sensitive', () => {
    expect(isValidLanguage('Ko')).toBe(false);
    expect(isValidLanguage('EN')).toBe(false);
    expect(isValidLanguage('Ja')).toBe(false);
  });

  it('should not accept locale codes', () => {
    expect(isValidLanguage('ko-KR')).toBe(false);
    expect(isValidLanguage('en-US')).toBe(false);
  });

  it('should not accept three-letter codes', () => {
    expect(isValidLanguage('kor')).toBe(false);
    expect(isValidLanguage('eng')).toBe(false);
    expect(isValidLanguage('jpn')).toBe(false);
  });
});
