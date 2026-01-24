/**
 * @fileoverview Unit tests for i18n config
 */

import {
  DEFAULT_LANGUAGE,
  isValidLanguage,
  languageFlags,
  languageNames,
  SUPPORTED_LANGUAGES,
} from '@soundblue/i18n';
import { describe, expect, it } from 'vitest';

describe('SUPPORTED_LANGUAGES', () => {
  it('should include en and ko', () => {
    expect(SUPPORTED_LANGUAGES).toContain('en');
    expect(SUPPORTED_LANGUAGES).toContain('ko');
  });

  it('should have exactly 2 languages', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(2);
  });
});

describe('DEFAULT_LANGUAGE', () => {
  it('should be en', () => {
    expect(DEFAULT_LANGUAGE).toBe('en');
  });
});

describe('isValidLanguage', () => {
  it('should return true for en', () => {
    expect(isValidLanguage('en')).toBe(true);
  });

  it('should return true for ko', () => {
    expect(isValidLanguage('ko')).toBe(true);
  });

  it('should return false for unsupported languages', () => {
    expect(isValidLanguage('ja')).toBe(false);
    expect(isValidLanguage('zh')).toBe(false);
    expect(isValidLanguage('fr')).toBe(false);
    expect(isValidLanguage('')).toBe(false);
  });

  it('should return false for invalid input', () => {
    expect(isValidLanguage('korean')).toBe(false);
    expect(isValidLanguage('EN')).toBe(false);
    expect(isValidLanguage('KO')).toBe(false);
  });
});

describe('languageNames', () => {
  it('should have names for all supported languages', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(languageNames[lang]).toBeDefined();
      expect(languageNames[lang].native).toBeDefined();
      expect(languageNames[lang].english).toBeDefined();
    }
  });

  it('should have correct Korean language names', () => {
    expect(languageNames.ko.native).toBe('한국어');
    expect(languageNames.ko.english).toBe('Korean');
  });

  it('should have correct English language names', () => {
    expect(languageNames.en.native).toBe('English');
    expect(languageNames.en.english).toBe('English');
  });
});

describe('languageFlags', () => {
  it('should have flags for all supported languages', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(languageFlags[lang]).toBeDefined();
    }
  });

  it('should have correct flags', () => {
    expect(languageFlags.ko).toBe('KR');
    expect(languageFlags.en).toBe('EN');
  });
});
