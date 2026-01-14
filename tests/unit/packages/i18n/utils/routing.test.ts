/**
 * @fileoverview Tests for i18n routing utilities
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
} from '@soundblue/i18n/utils';
import { describe, expect, it } from 'vitest';

describe('getLocaleFromPath', () => {
  it('should return "ko" for Korean paths', () => {
    expect(getLocaleFromPath('/ko')).toBe('ko');
    expect(getLocaleFromPath('/ko/')).toBe('ko');
    expect(getLocaleFromPath('/ko/about')).toBe('ko');
    expect(getLocaleFromPath('/ko/entry/hello')).toBe('ko');
  });

  it('should return "en" for English paths', () => {
    expect(getLocaleFromPath('/')).toBe('en');
    expect(getLocaleFromPath('/about')).toBe('en');
    expect(getLocaleFromPath('/entry/hello')).toBe('en');
  });

  it('should return "en" for paths that start with "ko" but not "/ko"', () => {
    expect(getLocaleFromPath('/korea')).toBe('en');
    expect(getLocaleFromPath('/korean-food')).toBe('en');
  });
});

describe('isKoreanPath', () => {
  it('should return true for Korean paths', () => {
    expect(isKoreanPath('/ko')).toBe(true);
    expect(isKoreanPath('/ko/')).toBe(true);
    expect(isKoreanPath('/ko/about')).toBe(true);
  });

  it('should return false for non-Korean paths', () => {
    expect(isKoreanPath('/')).toBe(false);
    expect(isKoreanPath('/about')).toBe(false);
    expect(isKoreanPath('/korea')).toBe(false);
  });
});

describe('stripLocaleFromPath', () => {
  it('should strip /ko prefix from paths', () => {
    expect(stripLocaleFromPath('/ko/about')).toBe('/about');
    expect(stripLocaleFromPath('/ko/entry/hello')).toBe('/entry/hello');
  });

  it('should return "/" for /ko path', () => {
    expect(stripLocaleFromPath('/ko')).toBe('/');
  });

  it('should return "/" for /ko/ path', () => {
    expect(stripLocaleFromPath('/ko/')).toBe('/');
  });

  it('should return path unchanged for non-Korean paths', () => {
    expect(stripLocaleFromPath('/')).toBe('/');
    expect(stripLocaleFromPath('/about')).toBe('/about');
    expect(stripLocaleFromPath('/entry/hello')).toBe('/entry/hello');
  });
});

describe('buildLocalePath', () => {
  it('should return path unchanged for English locale', () => {
    expect(buildLocalePath('/', 'en')).toBe('/');
    expect(buildLocalePath('/about', 'en')).toBe('/about');
    expect(buildLocalePath('/entry/hello', 'en')).toBe('/entry/hello');
  });

  it('should add /ko prefix for Korean locale', () => {
    expect(buildLocalePath('/', 'ko')).toBe('/ko');
    expect(buildLocalePath('/about', 'ko')).toBe('/ko/about');
    expect(buildLocalePath('/entry/hello', 'ko')).toBe('/ko/entry/hello');
  });
});

describe('generateI18nRoutes', () => {
  it('should generate English and Korean routes for items', () => {
    const items = [{ id: 'hello' }, { id: 'world' }];
    const getPath = (item: { id: string }) => `/entry/${item.id}`;

    const routes = generateI18nRoutes(items, getPath);

    expect(routes).toEqual(['/entry/hello', '/ko/entry/hello', '/entry/world', '/ko/entry/world']);
  });

  it('should handle empty items', () => {
    const routes = generateI18nRoutes([], (item) => item);
    expect(routes).toEqual([]);
  });
});

describe('generateLocalizedPaths', () => {
  it('should generate English and Korean paths', () => {
    const paths = generateLocalizedPaths(['/', '/about', '/search']);
    expect(paths).toEqual(['/', '/ko', '/about', '/ko/about', '/search', '/ko/search']);
  });

  it('should handle paths without leading slash', () => {
    const paths = generateLocalizedPaths(['about', 'search']);
    expect(paths).toEqual(['/about', '/ko/about', '/search', '/ko/search']);
  });

  it('should handle empty array', () => {
    const paths = generateLocalizedPaths([]);
    expect(paths).toEqual([]);
  });
});

describe('getLanguageFromParams', () => {
  it('should return "ko" when lang param is "ko"', () => {
    expect(getLanguageFromParams({ lang: 'ko' })).toBe('ko');
  });

  it('should return "en" when lang param is missing', () => {
    expect(getLanguageFromParams({})).toBe('en');
  });

  it('should return "en" for any other lang value', () => {
    expect(getLanguageFromParams({ lang: 'en' })).toBe('en');
    expect(getLanguageFromParams({ lang: 'fr' })).toBe('en');
    expect(getLanguageFromParams({ lang: '' })).toBe('en');
  });
});

describe('extractStaticRoutes', () => {
  it('should extract static routes with i18n variants', () => {
    const routes = [
      { index: true, file: 'routes/_index.tsx' },
      { path: 'about', file: 'routes/about.tsx' },
    ];

    const result = extractStaticRoutes(routes);
    expect(result).toContain('/');
    expect(result).toContain('/ko');
    expect(result).toContain('/about');
    expect(result).toContain('/ko/about');
  });

  it('should exclude dynamic routes with params', () => {
    const routes = [
      { index: true, file: 'routes/_index.tsx' },
      { path: 'entry/:entryId', file: 'routes/entry.$entryId.tsx' },
    ];

    const result = extractStaticRoutes(routes);
    expect(result).toContain('/');
    expect(result).toContain('/ko');
    expect(result).not.toContain('/entry/:entryId');
    expect(result).not.toContain('/ko/entry/:entryId');
  });

  it('should exclude catch-all routes', () => {
    const routes = [
      { index: true, file: 'routes/_index.tsx' },
      { path: '*', file: 'routes/$.tsx' },
    ];

    const result = extractStaticRoutes(routes);
    expect(result).not.toContain('/*');
    expect(result).not.toContain('/ko/*');
  });

  it('should handle nested routes', () => {
    const routes = [
      {
        path: 'docs',
        file: 'routes/docs.tsx',
        children: [
          { index: true, file: 'routes/docs/_index.tsx' },
          { path: 'getting-started', file: 'routes/docs/getting-started.tsx' },
        ],
      },
    ];

    const result = extractStaticRoutes(routes);
    expect(result).toContain('/docs');
    expect(result).toContain('/ko/docs');
    expect(result).toContain('/docs/getting-started');
    expect(result).toContain('/ko/docs/getting-started');
  });

  it('should handle empty routes array', () => {
    const result = extractStaticRoutes([]);
    expect(result).toEqual([]);
  });

  it('should deduplicate routes', () => {
    const routes = [
      { index: true, file: 'routes/_index.tsx' },
      { path: '', file: 'routes/_layout.tsx', children: [{ index: true }] },
    ];

    const result = extractStaticRoutes(routes);
    const slashCount = result.filter((r) => r === '/').length;
    expect(slashCount).toBe(1);
  });

  it('should handle ko routes in source', () => {
    const routes = [
      { path: 'ko', file: 'routes/ko.tsx' },
      { path: 'ko/about', file: 'routes/ko/about.tsx' },
    ];

    const result = extractStaticRoutes(routes);
    expect(result).toContain('/ko');
    expect(result).toContain('/ko/about');
  });

  it('should handle optional locale pattern (:locale)?', () => {
    const routes = [{ path: '(:locale)?/about', file: 'routes/about.tsx' }];

    const result = extractStaticRoutes(routes);
    expect(result).toContain('/about');
    expect(result).toContain('/ko/about');
  });

  it('should handle optional locale pattern at root', () => {
    const routes = [{ path: '(:locale)?', file: 'routes/_index.tsx' }];

    const result = extractStaticRoutes(routes);
    expect(result).toContain('/');
    expect(result).toContain('/ko');
  });

  it('should exclude optional locale routes with other dynamic segments', () => {
    const routes = [{ path: '(:locale)?/entry/:id', file: 'routes/entry.tsx' }];

    const result = extractStaticRoutes(routes);
    // Should not include routes with :id dynamic segment
    expect(result).not.toContain('/entry/:id');
    expect(result).not.toContain('/ko/entry/:id');
  });
});
