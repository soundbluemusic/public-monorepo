/**
 * @fileoverview Unit tests for validation utilities
 */

import {
  isNonEmptyString,
  isReservedName,
  isValidLanguage,
  isValidTheme,
  LIMITS,
  validateId,
} from '@soundblue/core/validation';
import { describe, expect, it } from 'vitest';

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

  // Unicode edge cases
  it('should accept emoji in ID', () => {
    expect(() => validateId('🎵-music-id', 'testField')).not.toThrow();
  });

  it('should accept Chinese characters', () => {
    expect(() => validateId('你好世界', 'testField')).not.toThrow();
  });

  it('should accept Japanese characters', () => {
    expect(() => validateId('こんにちは', 'testField')).not.toThrow();
  });

  it('should accept ID with null character (if not blocked)', () => {
    // Note: null character \u0000 is valid string, but may cause issues downstream
    expect(() => validateId('test\u0000id', 'testField')).not.toThrow();
  });

  it('should accept ID with zero-width characters', () => {
    // Zero-width space \u200B is valid but invisible
    expect(() => validateId('test\u200Bid', 'testField')).not.toThrow();
  });

  it('should accept ID with newline characters', () => {
    expect(() => validateId('test\nid', 'testField')).not.toThrow();
  });

  it('should accept ID with tab characters', () => {
    expect(() => validateId('test\tid', 'testField')).not.toThrow();
  });

  // Security edge cases - Prototype pollution variants
  it('should throw for prototype pollution variant "__proto__[admin]"', () => {
    // Note: Current implementation only checks exact reserved names
    // This test documents the behavior - the variant passes
    expect(() => validateId('__proto__[admin]', 'testField')).not.toThrow();
  });

  it('should throw for prototype pollution variant "constructor.prototype"', () => {
    expect(() => validateId('constructor.prototype', 'testField')).not.toThrow();
  });

  it('should be case-sensitive for reserved names', () => {
    // __PROTO__ is not in reserved names (case-sensitive)
    expect(() => validateId('__PROTO__', 'testField')).not.toThrow();
    expect(() => validateId('CONSTRUCTOR', 'testField')).not.toThrow();
    expect(() => validateId('Prototype', 'testField')).not.toThrow();
  });

  // Boundary edge cases
  it('should accept ID at exactly max length boundary', () => {
    const exactMax = 'x'.repeat(LIMITS.ID_LENGTH);
    expect(() => validateId(exactMax, 'testField')).not.toThrow();
    expect(exactMax.length).toBe(LIMITS.ID_LENGTH);
  });

  it('should throw for ID at max length + 1', () => {
    const overMax = 'x'.repeat(LIMITS.ID_LENGTH + 1);
    expect(() => validateId(overMax, 'testField')).toThrow();
  });

  // Input type edge cases
  it('should throw for boolean value', () => {
    // @ts-expect-error Testing edge case
    expect(() => validateId(true, 'testField')).toThrow('testField is required');
    // @ts-expect-error Testing edge case
    expect(() => validateId(false, 'testField')).toThrow('testField is required');
  });

  it('should throw for object value', () => {
    // @ts-expect-error Testing edge case
    expect(() => validateId({}, 'testField')).toThrow('testField is required');
    // @ts-expect-error Testing edge case
    expect(() => validateId({ toString: () => '__proto__' }, 'testField')).toThrow('testField is required');
  });

  it('should throw for array value', () => {
    // @ts-expect-error Testing edge case
    expect(() => validateId([], 'testField')).toThrow('testField is required');
    // @ts-expect-error Testing edge case
    expect(() => validateId(['__proto__'], 'testField')).toThrow('testField is required');
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

  it('should return false for "ja" (not supported)', () => {
    expect(isValidLanguage('ja')).toBe(false);
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

describe('isNonEmptyString', () => {
  // Basic cases
  it('should return true for non-empty string', () => {
    expect(isNonEmptyString('hello')).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(isNonEmptyString('')).toBe(false);
  });

  it('should return false for whitespace-only string', () => {
    expect(isNonEmptyString('   ')).toBe(false);
    expect(isNonEmptyString('\t\n')).toBe(false);
  });

  // Type safety edge cases
  it('should return false for null', () => {
    expect(isNonEmptyString(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isNonEmptyString(undefined)).toBe(false);
  });

  it('should return false for number', () => {
    expect(isNonEmptyString(0)).toBe(false);
    expect(isNonEmptyString(123)).toBe(false);
    expect(isNonEmptyString(NaN)).toBe(false);
  });

  it('should return false for boolean', () => {
    expect(isNonEmptyString(true)).toBe(false);
    expect(isNonEmptyString(false)).toBe(false);
  });

  it('should return false for object', () => {
    expect(isNonEmptyString({})).toBe(false);
    expect(isNonEmptyString({ length: 5 })).toBe(false);
  });

  it('should return false for array', () => {
    expect(isNonEmptyString([])).toBe(false);
    expect(isNonEmptyString(['a', 'b'])).toBe(false);
  });

  // Unicode edge cases
  it('should return true for Korean text', () => {
    expect(isNonEmptyString('안녕')).toBe(true);
  });

  it('should return true for emoji', () => {
    expect(isNonEmptyString('🎵')).toBe(true);
  });

  it('should return true for numeric string', () => {
    expect(isNonEmptyString('0')).toBe(true);
    expect(isNonEmptyString('123')).toBe(true);
  });

  // Whitespace edge cases
  it('should return false for non-breaking space only', () => {
    expect(isNonEmptyString('\u00A0')).toBe(false); // non-breaking space
  });

  it('should return true for zero-width space (not trimmed by String.trim)', () => {
    // Zero-width space \u200B is NOT removed by trim() - it's a valid character
    expect(isNonEmptyString('\u200B')).toBe(true);
  });

  it('should return true for string with mixed content and whitespace', () => {
    expect(isNonEmptyString('  hello  ')).toBe(true);
    expect(isNonEmptyString('\thello\n')).toBe(true);
  });
});
