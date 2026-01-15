/**
 * @fileoverview Unit tests for i18n Configuration
 *
 * 지원 언어, 기본 언어, 언어 검증 함수 등을 테스트합니다.
 */

import {
  DEFAULT_LANGUAGE,
  isValidLanguage,
  languageFlags,
  languageNames,
  SUPPORTED_LANGUAGES,
  type Language,
  type Messages,
  type TranslationParams,
} from '@soundblue/i18n/core/config';
import { describe, expect, it } from 'vitest';

describe('i18n Configuration', () => {
  describe('SUPPORTED_LANGUAGES', () => {
    it('should include English and Korean', () => {
      expect(SUPPORTED_LANGUAGES).toContain('en');
      expect(SUPPORTED_LANGUAGES).toContain('ko');
    });

    it('should have exactly 2 languages', () => {
      expect(SUPPORTED_LANGUAGES).toHaveLength(2);
    });

    it('should be a readonly array', () => {
      // TypeScript prevents mutation at compile time
      // This test verifies the runtime values
      expect(Array.isArray(SUPPORTED_LANGUAGES)).toBe(true);
    });
  });

  describe('DEFAULT_LANGUAGE', () => {
    it('should be English', () => {
      expect(DEFAULT_LANGUAGE).toBe('en');
    });

    it('should be a valid language', () => {
      expect(isValidLanguage(DEFAULT_LANGUAGE)).toBe(true);
    });
  });

  describe('isValidLanguage', () => {
    it('should return true for supported languages', () => {
      expect(isValidLanguage('en')).toBe(true);
      expect(isValidLanguage('ko')).toBe(true);
    });

    it('should return false for unsupported languages', () => {
      expect(isValidLanguage('ja')).toBe(false);
      expect(isValidLanguage('zh')).toBe(false);
      expect(isValidLanguage('fr')).toBe(false);
      expect(isValidLanguage('de')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidLanguage('')).toBe(false);
    });

    it('should return false for invalid input types', () => {
      expect(isValidLanguage('invalid')).toBe(false);
      expect(isValidLanguage('EN')).toBe(false); // case sensitive
      expect(isValidLanguage('KO')).toBe(false); // case sensitive
      expect(isValidLanguage(' en ')).toBe(false); // with spaces
    });

    it('should be case sensitive', () => {
      expect(isValidLanguage('en')).toBe(true);
      expect(isValidLanguage('EN')).toBe(false);
      expect(isValidLanguage('En')).toBe(false);
      expect(isValidLanguage('ko')).toBe(true);
      expect(isValidLanguage('KO')).toBe(false);
      expect(isValidLanguage('Ko')).toBe(false);
    });

    it('should work as a type guard', () => {
      const lang: string = 'ko';
      if (isValidLanguage(lang)) {
        // TypeScript should narrow the type to Language
        const typedLang: Language = lang;
        expect(typedLang).toBe('ko');
      }
    });
  });

  describe('languageNames', () => {
    it('should have entries for all supported languages', () => {
      for (const lang of SUPPORTED_LANGUAGES) {
        expect(languageNames[lang]).toBeDefined();
      }
    });

    it('should have native and english names for Korean', () => {
      expect(languageNames.ko.native).toBe('한국어');
      expect(languageNames.ko.english).toBe('Korean');
    });

    it('should have native and english names for English', () => {
      expect(languageNames.en.native).toBe('English');
      expect(languageNames.en.english).toBe('English');
    });

    it('should have non-empty strings for all names', () => {
      for (const lang of SUPPORTED_LANGUAGES) {
        expect(languageNames[lang].native).toBeTruthy();
        expect(languageNames[lang].english).toBeTruthy();
        expect(typeof languageNames[lang].native).toBe('string');
        expect(typeof languageNames[lang].english).toBe('string');
      }
    });
  });

  describe('languageFlags', () => {
    it('should have entries for all supported languages', () => {
      for (const lang of SUPPORTED_LANGUAGES) {
        expect(languageFlags[lang]).toBeDefined();
      }
    });

    it('should have correct flag codes', () => {
      expect(languageFlags.ko).toBe('KR');
      expect(languageFlags.en).toBe('EN');
    });

    it('should have uppercase flag codes', () => {
      for (const lang of SUPPORTED_LANGUAGES) {
        expect(languageFlags[lang]).toBe(languageFlags[lang].toUpperCase());
      }
    });
  });

  describe('Type exports', () => {
    it('should export Language type correctly', () => {
      const validLang: Language = 'en';
      const anotherValidLang: Language = 'ko';
      expect(validLang).toBeDefined();
      expect(anotherValidLang).toBeDefined();
    });

    it('should export Messages type correctly', () => {
      const messages: Messages = {
        hello: 'Hello',
        world: 'World',
        greeting: 'Hello, World!',
      };
      expect(Object.keys(messages)).toHaveLength(3);
    });

    it('should export TranslationParams type correctly', () => {
      const params: TranslationParams = {
        name: 'John',
        count: '5',
      };
      expect(params.name).toBe('John');
      expect(params.count).toBe('5');
    });
  });

  describe('Edge cases', () => {
    it('should handle language code with special characters', () => {
      expect(isValidLanguage('en-US')).toBe(false);
      expect(isValidLanguage('ko-KR')).toBe(false);
      expect(isValidLanguage('en_US')).toBe(false);
    });

    it('should handle null and undefined-like strings', () => {
      expect(isValidLanguage('null')).toBe(false);
      expect(isValidLanguage('undefined')).toBe(false);
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      expect(isValidLanguage(longString)).toBe(false);
    });
  });
});
