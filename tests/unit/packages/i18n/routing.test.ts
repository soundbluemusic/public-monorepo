/**
 * @fileoverview Unit tests for i18n routing utilities
 */

import {
  buildLocalePath,
  extractStaticRoutes,
  generateI18nRoutes,
  generateLocalizedPaths,
  getLanguageFromParams,
  getLocaleFromPath,
  isKoreanPath,
  stripLocaleFromPath,
} from '@soundblue/i18n';
import { describe, expect, it } from 'vitest';

describe('getLocaleFromPath', () => {
  it('should return ko for paths starting with /ko/', () => {
    expect(getLocaleFromPath('/ko/entry/hello')).toBe('ko');
    expect(getLocaleFromPath('/ko/concept/addition')).toBe('ko');
    expect(getLocaleFromPath('/ko/about')).toBe('ko');
  });

  it('should return ko for exact /ko path', () => {
    expect(getLocaleFromPath('/ko')).toBe('ko');
  });

  it('should return en for paths without /ko', () => {
    expect(getLocaleFromPath('/entry/hello')).toBe('en');
    expect(getLocaleFromPath('/concept/addition')).toBe('en');
    expect(getLocaleFromPath('/about')).toBe('en');
    expect(getLocaleFromPath('/')).toBe('en');
  });

  it('should return en for paths that start with ko but not /ko/', () => {
    expect(getLocaleFromPath('/korean-food')).toBe('en');
    expect(getLocaleFromPath('/koala')).toBe('en');
  });
});

describe('isKoreanPath', () => {
  it('should return true for paths starting with /ko/', () => {
    expect(isKoreanPath('/ko/entry/hello')).toBe(true);
    expect(isKoreanPath('/ko/about')).toBe(true);
  });

  it('should return true for exact /ko path', () => {
    expect(isKoreanPath('/ko')).toBe(true);
  });

  it('should return false for paths without /ko', () => {
    expect(isKoreanPath('/entry/hello')).toBe(false);
    expect(isKoreanPath('/')).toBe(false);
    expect(isKoreanPath('/about')).toBe(false);
  });

  it('should return false for paths that start with ko but not /ko/', () => {
    expect(isKoreanPath('/korean-food')).toBe(false);
    expect(isKoreanPath('/koala')).toBe(false);
  });
});

describe('stripLocaleFromPath', () => {
  it('should remove /ko/ prefix', () => {
    expect(stripLocaleFromPath('/ko/entry/hello')).toBe('/entry/hello');
    expect(stripLocaleFromPath('/ko/concept/addition')).toBe('/concept/addition');
    expect(stripLocaleFromPath('/ko/about')).toBe('/about');
  });

  it('should handle exact /ko path', () => {
    expect(stripLocaleFromPath('/ko')).toBe('/');
  });

  it('should not modify paths without /ko prefix', () => {
    expect(stripLocaleFromPath('/entry/hello')).toBe('/entry/hello');
    expect(stripLocaleFromPath('/')).toBe('/');
    expect(stripLocaleFromPath('/about')).toBe('/about');
  });

  it('should not modify paths that start with ko but not /ko/', () => {
    expect(stripLocaleFromPath('/korean-food')).toBe('/korean-food');
    expect(stripLocaleFromPath('/koala')).toBe('/koala');
  });
});

describe('buildLocalePath', () => {
  it('should add /ko prefix for Korean locale', () => {
    expect(buildLocalePath('/entry/hello', 'ko')).toBe('/ko/entry/hello');
    expect(buildLocalePath('/about', 'ko')).toBe('/ko/about');
  });

  it('should handle root path for Korean locale', () => {
    expect(buildLocalePath('/', 'ko')).toBe('/ko');
  });

  it('should not modify path for English locale', () => {
    expect(buildLocalePath('/entry/hello', 'en')).toBe('/entry/hello');
    expect(buildLocalePath('/', 'en')).toBe('/');
    expect(buildLocalePath('/about', 'en')).toBe('/about');
  });
});

describe('generateI18nRoutes', () => {
  it('should generate en and ko routes for each item', () => {
    const items = [{ id: 'hello' }, { id: 'goodbye' }];
    const routes = generateI18nRoutes(items, (item) => `/entry/${item.id}`);

    expect(routes).toEqual([
      '/entry/hello',
      '/ko/entry/hello',
      '/entry/goodbye',
      '/ko/entry/goodbye',
    ]);
  });

  it('should handle empty array', () => {
    const routes = generateI18nRoutes([], (item: { id: string }) => `/entry/${item.id}`);
    expect(routes).toEqual([]);
  });

  it('should handle complex path functions', () => {
    const items = [{ category: 'math', slug: 'addition' }];
    const routes = generateI18nRoutes(items, (item) => `/category/${item.category}/${item.slug}`);

    expect(routes).toEqual([
      '/category/math/addition',
      '/ko/category/math/addition',
    ]);
  });
});

describe('generateLocalizedPaths', () => {
  it('should generate en and ko paths', () => {
    const paths = ['/about', '/contact'];
    const routes = generateLocalizedPaths(paths);

    expect(routes).toEqual(['/about', '/ko/about', '/contact', '/ko/contact']);
  });

  it('should handle root path', () => {
    const paths = ['/'];
    const routes = generateLocalizedPaths(paths);

    expect(routes).toEqual(['/', '/ko']);
  });

  it('should handle empty array', () => {
    const routes = generateLocalizedPaths([]);
    expect(routes).toEqual([]);
  });

  it('should add leading slash if missing', () => {
    const paths = ['about', 'contact'];
    const routes = generateLocalizedPaths(paths);

    expect(routes).toEqual(['/about', '/ko/about', '/contact', '/ko/contact']);
  });
});

describe('getLanguageFromParams', () => {
  it('should return ko when params.lang is ko', () => {
    expect(getLanguageFromParams({ lang: 'ko' })).toBe('ko');
  });

  it('should return en when params.lang is undefined', () => {
    expect(getLanguageFromParams({})).toBe('en');
  });

  it('should return en when params.lang is en', () => {
    expect(getLanguageFromParams({ lang: 'en' })).toBe('en');
  });

  it('should return en for any other value', () => {
    expect(getLanguageFromParams({ lang: 'ja' })).toBe('en');
    expect(getLanguageFromParams({ lang: 'invalid' })).toBe('en');
  });
});

describe('extractStaticRoutes', () => {
  it('should extract static routes', () => {
    const routes = [
      { path: 'about', file: 'routes/about.tsx' },
      { path: 'contact', file: 'routes/contact.tsx' },
    ];
    const result = extractStaticRoutes(routes);

    expect(result).toContain('/about');
    expect(result).toContain('/ko/about');
    expect(result).toContain('/contact');
    expect(result).toContain('/ko/contact');
  });

  it('should handle index routes', () => {
    const routes = [{ index: true, file: 'routes/_index.tsx' }];
    const result = extractStaticRoutes(routes);

    expect(result).toContain('/');
    expect(result).toContain('/ko');
  });

  it('should exclude dynamic routes', () => {
    const routes = [
      { path: 'entry/:entryId', file: 'routes/entry.$entryId.tsx' },
      { path: 'about', file: 'routes/about.tsx' },
    ];
    const result = extractStaticRoutes(routes);

    expect(result).not.toContain('/entry/:entryId');
    expect(result).not.toContain('/ko/entry/:entryId');
    expect(result).toContain('/about');
  });

  it('should exclude catch-all routes', () => {
    const routes = [
      { path: '*', file: 'routes/$.tsx' },
      { path: 'about', file: 'routes/about.tsx' },
    ];
    const result = extractStaticRoutes(routes);

    expect(result).not.toContain('/*');
    expect(result).toContain('/about');
  });

  it('should handle nested routes', () => {
    const routes = [
      {
        path: 'dashboard',
        file: 'routes/dashboard.tsx',
        children: [
          { path: 'settings', file: 'routes/dashboard/settings.tsx' },
          { path: 'profile', file: 'routes/dashboard/profile.tsx' },
        ],
      },
    ];
    const result = extractStaticRoutes(routes);

    expect(result).toContain('/dashboard');
    expect(result).toContain('/dashboard/settings');
    expect(result).toContain('/dashboard/profile');
  });

  it('should handle (:locale)? optional pattern', () => {
    const routes = [{ path: '(:locale)?/about', file: 'routes/($locale).about.tsx' }];
    const result = extractStaticRoutes(routes);

    expect(result).toContain('/about');
    expect(result).toContain('/ko/about');
  });

  it('should not duplicate routes', () => {
    const routes = [
      { path: 'about', file: 'routes/about.tsx' },
      { path: 'ko/about', file: 'routes/ko.about.tsx' },
    ];
    const result = extractStaticRoutes(routes);

    // Should deduplicate
    const aboutCount = result.filter((r) => r === '/about').length;
    const koAboutCount = result.filter((r) => r === '/ko/about').length;

    expect(aboutCount).toBe(1);
    expect(koAboutCount).toBe(1);
  });

  it('should handle routes without path', () => {
    const routes = [
      {
        file: 'routes/_layout.tsx',
        children: [{ path: 'about', file: 'routes/about.tsx' }],
      },
    ];
    const result = extractStaticRoutes(routes);

    expect(result).toContain('/about');
  });

  it('should return empty array for empty routes', () => {
    const result = extractStaticRoutes([]);
    expect(result).toEqual([]);
  });
});
