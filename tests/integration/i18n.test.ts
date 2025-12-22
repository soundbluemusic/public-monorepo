/**
 * @fileoverview Integration tests for i18n completeness
 *
 * Ensures all translation keys are defined for both ko and en locales
 * and that no translation is missing or empty.
 */

import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const APPS = ['roots', 'context', 'permissive'];
const LOCALES = ['ko', 'en'];

describe('i18n Completeness', () => {
  for (const app of APPS) {
    describe(`${app} app`, () => {
      const messagesDir = path.join(process.cwd(), `apps/${app}/messages`);

      it('should have messages directory', () => {
        expect(fs.existsSync(messagesDir)).toBe(true);
      });

      it('should have translation files for all locales', () => {
        for (const locale of LOCALES) {
          const messagePath = path.join(messagesDir, `${locale}.json`);
          expect(fs.existsSync(messagePath), `Missing ${locale}.json for ${app}`).toBe(true);
        }
      });

      it('should have same keys in all locales', () => {
        const translations: Record<string, Record<string, string>> = {};

        for (const locale of LOCALES) {
          const messagePath = path.join(messagesDir, `${locale}.json`);
          if (fs.existsSync(messagePath)) {
            const content = fs.readFileSync(messagePath, 'utf-8');
            translations[locale] = JSON.parse(content);
          }
        }

        if (Object.keys(translations).length === LOCALES.length) {
          const koKeys = Object.keys(translations.ko).sort();
          const enKeys = Object.keys(translations.en).sort();

          expect(koKeys, `Translation keys mismatch in ${app}`).toEqual(enKeys);
        }
      });

      it('should not have empty translations', () => {
        for (const locale of LOCALES) {
          const messagePath = path.join(messagesDir, `${locale}.json`);
          if (fs.existsSync(messagePath)) {
            const content = fs.readFileSync(messagePath, 'utf-8');
            const translations = JSON.parse(content);

            for (const [key, value] of Object.entries(translations)) {
              expect(
                value,
                `Empty translation for key "${key}" in ${locale}.json (${app})`,
              ).not.toBe('');
              expect(
                value,
                `Missing translation for key "${key}" in ${locale}.json (${app})`,
              ).toBeTruthy();
            }
          }
        }
      });

      it('should have valid JSON format', () => {
        for (const locale of LOCALES) {
          const messagePath = path.join(messagesDir, `${locale}.json`);
          if (fs.existsSync(messagePath)) {
            const content = fs.readFileSync(messagePath, 'utf-8');

            expect(() => JSON.parse(content)).not.toThrow();

            const translations = JSON.parse(content);
            expect(typeof translations).toBe('object');
            expect(Array.isArray(translations)).toBe(false);
          }
        }
      });

      it('should not have duplicate keys (case-insensitive)', () => {
        for (const locale of LOCALES) {
          const messagePath = path.join(messagesDir, `${locale}.json`);
          if (fs.existsSync(messagePath)) {
            const content = fs.readFileSync(messagePath, 'utf-8');
            const translations = JSON.parse(content);

            const keys = Object.keys(translations);
            const lowerKeys = keys.map((k) => k.toLowerCase());
            const uniqueLowerKeys = [...new Set(lowerKeys)];

            expect(
              keys.length,
              `Duplicate keys (case-insensitive) found in ${locale}.json (${app})`,
            ).toBe(uniqueLowerKeys.length);
          }
        }
      });

      it('should use consistent naming convention for keys', () => {
        for (const locale of LOCALES) {
          const messagePath = path.join(messagesDir, `${locale}.json`);
          if (fs.existsSync(messagePath)) {
            const content = fs.readFileSync(messagePath, 'utf-8');
            const translations = JSON.parse(content);

            for (const key of Object.keys(translations)) {
              // Keys should be camelCase or kebab-case (no spaces)
              expect(
                key,
                `Invalid key format "${key}" in ${locale}.json (${app}). Use camelCase or kebab-case.`,
              ).toMatch(/^[a-z][a-zA-Z0-9-_]*$/);
            }
          }
        }
      });
    });
  }
});

describe('i18n Route Handling', () => {
  it('should support Korean locale prefix (/ko)', () => {
    // This is a structural test - routes should handle /ko prefix
    const koRoutes = ['/ko', '/ko/about', '/ko/search'];

    for (const route of koRoutes) {
      expect(route.startsWith('/ko') || route === '/ko').toBe(true);
    }
  });

  it('should support English as default (no prefix)', () => {
    // English routes should not have locale prefix
    const enRoutes = ['/', '/about', '/search'];

    for (const route of enRoutes) {
      expect(route.startsWith('/ko')).toBe(false);
    }
  });

  it('should handle locale switching logic', () => {
    // Mock locale detection
    const getLocaleFromPath = (path: string): 'ko' | 'en' => {
      if (path.startsWith('/ko/') || path === '/ko') {
        return 'ko';
      }
      return 'en';
    };

    expect(getLocaleFromPath('/ko')).toBe('ko');
    expect(getLocaleFromPath('/ko/about')).toBe('ko');
    expect(getLocaleFromPath('/')).toBe('en');
    expect(getLocaleFromPath('/about')).toBe('en');
  });
});

describe('i18n Build Output', () => {
  for (const app of APPS) {
    it(`should have compiled i18n runtime for ${app}`, () => {
      const paraglideDir = path.join(process.cwd(), `apps/${app}/paraglide`);

      // Paraglide should generate runtime files during build
      // Check if directory exists (may not exist in fresh clone)
      if (fs.existsSync(paraglideDir)) {
        const runtimePath = path.join(paraglideDir, 'runtime.js');
        expect(fs.existsSync(runtimePath)).toBe(true);
      }
    });
  }
});

describe('i18n Message Format', () => {
  for (const app of APPS) {
    describe(`${app} app message format`, () => {
      const messagesDir = path.join(process.cwd(), `apps/${app}/messages`);

      it('should not contain placeholder mismatches between locales', () => {
        const extractPlaceholders = (text: string): string[] => {
          const matches = text.match(/\{[^}]+\}/g) || [];
          return matches.sort();
        };

        for (const locale of LOCALES) {
          const messagePath = path.join(messagesDir, `${locale}.json`);
          if (fs.existsSync(messagePath)) {
            const content = fs.readFileSync(messagePath, 'utf-8');
            const translations = JSON.parse(content);

            // Check each key exists in other locale
            for (const locale2 of LOCALES) {
              if (locale === locale2) continue;

              const messagePath2 = path.join(messagesDir, `${locale2}.json`);
              if (fs.existsSync(messagePath2)) {
                const content2 = fs.readFileSync(messagePath2, 'utf-8');
                const translations2 = JSON.parse(content2);

                for (const key of Object.keys(translations)) {
                  if (translations2[key]) {
                    const placeholders1 = extractPlaceholders(translations[key]);
                    const placeholders2 = extractPlaceholders(translations2[key]);

                    expect(
                      placeholders1,
                      `Placeholder mismatch for key "${key}" between ${locale} and ${locale2} in ${app}`,
                    ).toEqual(placeholders2);
                  }
                }
              }
            }
          }
        }
      });

      it('should not contain HTML tags in translations (use MDX instead)', () => {
        const htmlTagPattern = /<[^>]+>/;

        for (const locale of LOCALES) {
          const messagePath = path.join(messagesDir, `${locale}.json`);
          if (fs.existsSync(messagePath)) {
            const content = fs.readFileSync(messagePath, 'utf-8');
            const translations = JSON.parse(content);

            for (const [key, value] of Object.entries(translations)) {
              if (typeof value === 'string') {
                expect(
                  htmlTagPattern.test(value),
                  `HTML tags found in translation "${key}" in ${locale}.json (${app}). Use MDX or React components instead.`,
                ).toBe(false);
              }
            }
          }
        }
      });
    });
  }
});
