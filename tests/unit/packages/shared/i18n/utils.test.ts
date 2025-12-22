/**
 * @fileoverview Unit tests for i18n utilities
 */

import { describe, expect, it } from 'vitest';
import { buildLocalePath, getLocaleFromPath, stripLocaleFromPath } from '@soundblue/shared';

describe('getLocaleFromPath', () => {
  it('should return "ko" for Korean paths starting with /ko/', () => {
    expect(getLocaleFromPath('/ko/browse')).toBe('ko');
    expect(getLocaleFromPath('/ko/about')).toBe('ko');
    expect(getLocaleFromPath('/ko/search')).toBe('ko');
  });

  it('should return "ko" for exact /ko path', () => {
    expect(getLocaleFromPath('/ko')).toBe('ko');
  });

  it('should return "en" for paths without locale prefix', () => {
    expect(getLocaleFromPath('/browse')).toBe('en');
    expect(getLocaleFromPath('/about')).toBe('en');
    expect(getLocaleFromPath('/search')).toBe('en');
  });

  it('should return "en" for root path', () => {
    expect(getLocaleFromPath('/')).toBe('en');
  });

  it('should return "en" for paths starting with /en/', () => {
    expect(getLocaleFromPath('/en/browse')).toBe('en');
    expect(getLocaleFromPath('/en')).toBe('en');
  });

  it('should handle nested paths correctly', () => {
    expect(getLocaleFromPath('/ko/concept/matrices')).toBe('ko');
    expect(getLocaleFromPath('/concept/matrices')).toBe('en');
  });

  it('should not be confused by "ko" in path segments', () => {
    expect(getLocaleFromPath('/word/koreana')).toBe('en');
    expect(getLocaleFromPath('/korea')).toBe('en');
  });

  // Edge cases
  it('should handle empty string', () => {
    expect(getLocaleFromPath('')).toBe('en');
  });

  it('should handle paths with query strings', () => {
    expect(getLocaleFromPath('/ko/search?q=test')).toBe('ko');
    expect(getLocaleFromPath('/search?q=test')).toBe('en');
  });

  it('should handle paths with hash fragments', () => {
    expect(getLocaleFromPath('/ko/about#section')).toBe('ko');
    expect(getLocaleFromPath('/about#section')).toBe('en');
  });
});

describe('stripLocaleFromPath', () => {
  it('should remove /ko/ prefix from paths', () => {
    expect(stripLocaleFromPath('/ko/browse')).toBe('/browse');
    expect(stripLocaleFromPath('/ko/about')).toBe('/about');
    expect(stripLocaleFromPath('/ko/search')).toBe('/search');
  });

  it('should convert /ko to /', () => {
    expect(stripLocaleFromPath('/ko')).toBe('/');
  });

  it('should keep paths without locale prefix unchanged', () => {
    expect(stripLocaleFromPath('/browse')).toBe('/browse');
    expect(stripLocaleFromPath('/about')).toBe('/about');
    expect(stripLocaleFromPath('/')).toBe('/');
  });

  it('should handle nested paths correctly', () => {
    expect(stripLocaleFromPath('/ko/concept/matrices')).toBe('/concept/matrices');
    expect(stripLocaleFromPath('/concept/matrices')).toBe('/concept/matrices');
  });

  it('should not strip /ko from middle of path', () => {
    expect(stripLocaleFromPath('/word/ko')).toBe('/word/ko');
    expect(stripLocaleFromPath('/koreana')).toBe('/koreana');
  });

  // Edge cases
  it('should handle empty string', () => {
    expect(stripLocaleFromPath('')).toBe('');
  });

  it('should handle paths with query strings', () => {
    expect(stripLocaleFromPath('/ko/search?q=test')).toBe('/search?q=test');
  });

  it('should handle paths with hash fragments', () => {
    expect(stripLocaleFromPath('/ko/about#section')).toBe('/about#section');
  });

  it('should handle /ko/ followed by slash', () => {
    expect(stripLocaleFromPath('/ko/')).toBe('/');
  });

  it('should preserve trailing slash in non-locale paths', () => {
    expect(stripLocaleFromPath('/browse/')).toBe('/browse/');
  });
});

describe('buildLocalePath', () => {
  it('should add /ko prefix for Korean locale', () => {
    expect(buildLocalePath('/browse', 'ko')).toBe('/ko/browse');
    expect(buildLocalePath('/about', 'ko')).toBe('/ko/about');
    expect(buildLocalePath('/search', 'ko')).toBe('/ko/search');
  });

  it('should convert / to /ko for Korean locale', () => {
    expect(buildLocalePath('/', 'ko')).toBe('/ko');
  });

  it('should keep paths unchanged for English locale', () => {
    expect(buildLocalePath('/browse', 'en')).toBe('/browse');
    expect(buildLocalePath('/about', 'en')).toBe('/about');
    expect(buildLocalePath('/', 'en')).toBe('/');
  });

  it('should handle nested paths correctly', () => {
    expect(buildLocalePath('/concept/matrices', 'ko')).toBe('/ko/concept/matrices');
    expect(buildLocalePath('/concept/matrices', 'en')).toBe('/concept/matrices');
  });

  // Edge cases
  it('should handle paths with query strings', () => {
    expect(buildLocalePath('/search?q=test', 'ko')).toBe('/ko/search?q=test');
    expect(buildLocalePath('/search?q=test', 'en')).toBe('/search?q=test');
  });

  it('should handle paths with hash fragments', () => {
    expect(buildLocalePath('/about#section', 'ko')).toBe('/ko/about#section');
    expect(buildLocalePath('/about#section', 'en')).toBe('/about#section');
  });

  it('should handle empty string path', () => {
    expect(buildLocalePath('', 'ko')).toBe('/ko');
    expect(buildLocalePath('', 'en')).toBe('');
  });

  it('should preserve trailing slash', () => {
    expect(buildLocalePath('/browse/', 'ko')).toBe('/ko/browse/');
    expect(buildLocalePath('/browse/', 'en')).toBe('/browse/');
  });
});

describe('i18n utilities - round trip', () => {
  it('should be able to round trip Korean paths', () => {
    const originalPath = '/ko/browse';
    const locale = getLocaleFromPath(originalPath);
    const stripped = stripLocaleFromPath(originalPath);
    const rebuilt = buildLocalePath(stripped, locale);

    expect(rebuilt).toBe(originalPath);
  });

  it('should be able to round trip English paths', () => {
    const originalPath = '/browse';
    const locale = getLocaleFromPath(originalPath);
    const stripped = stripLocaleFromPath(originalPath);
    const rebuilt = buildLocalePath(stripped, locale);

    expect(rebuilt).toBe(originalPath);
  });

  it('should be able to round trip root paths', () => {
    const originalPathKo = '/ko';
    const localeKo = getLocaleFromPath(originalPathKo);
    const strippedKo = stripLocaleFromPath(originalPathKo);
    const rebuiltKo = buildLocalePath(strippedKo, localeKo);
    expect(rebuiltKo).toBe(originalPathKo);

    const originalPathEn = '/';
    const localeEn = getLocaleFromPath(originalPathEn);
    const strippedEn = stripLocaleFromPath(originalPathEn);
    const rebuiltEn = buildLocalePath(strippedEn, localeEn);
    expect(rebuiltEn).toBe(originalPathEn);
  });
});
