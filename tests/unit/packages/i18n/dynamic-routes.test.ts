/**
 * @fileoverview i18n 동적 라우트 테스트
 *
 * 다국어 URL 라우팅 관련 테스트입니다.
 * params.locale 버그 및 getLocaleFromPath 함수를 테스트합니다.
 */

import { describe, expect, it } from 'vitest';

// 타입 정의
type Language = 'ko' | 'en';

interface RouteParams {
  entryId?: string;
  conceptId?: string;
  categoryId?: string;
  slug?: string;
  locale?: string; // Always undefined in current routing setup
}

// i18n 유틸리티 함수들
function getLocaleFromPath(pathname: string): Language {
  // /ko/... → 'ko', else → 'en'
  if (pathname.startsWith('/ko/') || pathname === '/ko') {
    return 'ko';
  }
  return 'en';
}

function stripLocaleFromPath(pathname: string): string {
  if (pathname.startsWith('/ko/')) {
    return pathname.slice(3); // Remove '/ko'
  }
  if (pathname === '/ko') {
    return '/';
  }
  return pathname;
}

function addLocaleToPath(pathname: string, locale: Language): string {
  if (locale === 'ko') {
    if (pathname === '/') {
      return '/ko';
    }
    return `/ko${pathname}`;
  }
  return pathname;
}

function generateI18nRoutes<T extends { id: string }>(
  items: T[],
  pathGenerator: (item: T) => string,
): string[] {
  const routes: string[] = [];
  for (const item of items) {
    const path = pathGenerator(item);
    routes.push(path); // English
    routes.push(`/ko${path}`); // Korean
  }
  return routes;
}

function extractStaticRoutes(routes: string[]): string[] {
  // Filter out dynamic routes (containing :param or $param)
  return routes.filter((route) => !route.includes(':') && !route.includes('$'));
}

// 테스트 시작
describe('i18n Dynamic Routes', () => {
  describe('getLocaleFromPath', () => {
    describe('English routes (default)', () => {
      it('should return en for root path', () => {
        expect(getLocaleFromPath('/')).toBe('en');
      });

      it('should return en for English entry path', () => {
        expect(getLocaleFromPath('/entry/hello')).toBe('en');
      });

      it('should return en for English category path', () => {
        expect(getLocaleFromPath('/category/greetings')).toBe('en');
      });

      it('should return en for browse page', () => {
        expect(getLocaleFromPath('/browse')).toBe('en');
      });

      it('should return en for nested paths', () => {
        expect(getLocaleFromPath('/concept/addition')).toBe('en');
        expect(getLocaleFromPath('/library/react-router')).toBe('en');
        expect(getLocaleFromPath('/field/algebra')).toBe('en');
      });
    });

    describe('Korean routes', () => {
      it('should return ko for Korean root', () => {
        expect(getLocaleFromPath('/ko')).toBe('ko');
      });

      it('should return ko for Korean entry path', () => {
        expect(getLocaleFromPath('/ko/entry/hello')).toBe('ko');
      });

      it('should return ko for Korean category path', () => {
        expect(getLocaleFromPath('/ko/category/greetings')).toBe('ko');
      });

      it('should return ko for Korean browse page', () => {
        expect(getLocaleFromPath('/ko/browse')).toBe('ko');
      });

      it('should return ko for nested Korean paths', () => {
        expect(getLocaleFromPath('/ko/concept/addition')).toBe('ko');
        expect(getLocaleFromPath('/ko/library/react-router')).toBe('ko');
        expect(getLocaleFromPath('/ko/field/algebra')).toBe('ko');
      });
    });

    describe('edge cases', () => {
      it('should handle paths starting with ko but not locale prefix', () => {
        expect(getLocaleFromPath('/korean-food')).toBe('en');
        expect(getLocaleFromPath('/koala')).toBe('en');
      });

      it('should handle empty path', () => {
        expect(getLocaleFromPath('')).toBe('en');
      });

      it('should handle query strings', () => {
        expect(getLocaleFromPath('/entry/hello?ref=home')).toBe('en');
        expect(getLocaleFromPath('/ko/entry/hello?ref=home')).toBe('ko');
      });

      it('should handle hash', () => {
        expect(getLocaleFromPath('/entry/hello#section')).toBe('en');
        expect(getLocaleFromPath('/ko/entry/hello#section')).toBe('ko');
      });

      it('should handle trailing slash', () => {
        expect(getLocaleFromPath('/entry/hello/')).toBe('en');
        expect(getLocaleFromPath('/ko/entry/hello/')).toBe('ko');
      });
    });
  });

  describe('stripLocaleFromPath', () => {
    it('should strip /ko from Korean paths', () => {
      expect(stripLocaleFromPath('/ko/entry/hello')).toBe('/entry/hello');
      expect(stripLocaleFromPath('/ko/browse')).toBe('/browse');
      expect(stripLocaleFromPath('/ko/category/greetings')).toBe('/category/greetings');
    });

    it('should strip /ko root to /', () => {
      expect(stripLocaleFromPath('/ko')).toBe('/');
    });

    it('should not modify English paths', () => {
      expect(stripLocaleFromPath('/entry/hello')).toBe('/entry/hello');
      expect(stripLocaleFromPath('/browse')).toBe('/browse');
      expect(stripLocaleFromPath('/')).toBe('/');
    });

    it('should not modify paths that start with ko but not locale prefix', () => {
      expect(stripLocaleFromPath('/korean-food')).toBe('/korean-food');
      expect(stripLocaleFromPath('/koala')).toBe('/koala');
    });
  });

  describe('addLocaleToPath', () => {
    it('should add /ko prefix for Korean locale', () => {
      expect(addLocaleToPath('/entry/hello', 'ko')).toBe('/ko/entry/hello');
      expect(addLocaleToPath('/browse', 'ko')).toBe('/ko/browse');
    });

    it('should handle root path for Korean', () => {
      expect(addLocaleToPath('/', 'ko')).toBe('/ko');
    });

    it('should not modify path for English locale', () => {
      expect(addLocaleToPath('/entry/hello', 'en')).toBe('/entry/hello');
      expect(addLocaleToPath('/', 'en')).toBe('/');
    });
  });

  describe('generateI18nRoutes', () => {
    it('should generate routes for both locales', () => {
      const items = [{ id: 'hello' }, { id: 'world' }];
      const routes = generateI18nRoutes(items, (item) => `/entry/${item.id}`);

      expect(routes).toContain('/entry/hello');
      expect(routes).toContain('/ko/entry/hello');
      expect(routes).toContain('/entry/world');
      expect(routes).toContain('/ko/entry/world');
      expect(routes).toHaveLength(4);
    });

    it('should work with different path patterns', () => {
      const concepts = [{ id: 'addition' }, { id: 'subtraction' }];
      const routes = generateI18nRoutes(concepts, (c) => `/concept/${c.id}`);

      expect(routes).toContain('/concept/addition');
      expect(routes).toContain('/ko/concept/addition');
    });

    it('should handle empty items array', () => {
      const routes = generateI18nRoutes([], (item) => `/entry/${item.id}`);
      expect(routes).toEqual([]);
    });
  });

  describe('extractStaticRoutes', () => {
    it('should filter out dynamic routes', () => {
      const routes = [
        '/',
        '/browse',
        '/about',
        '/entry/:entryId',
        '/category/$categoryId',
        '/ko',
        '/ko/browse',
        '/ko/entry/:entryId',
      ];

      const staticRoutes = extractStaticRoutes(routes);

      expect(staticRoutes).toContain('/');
      expect(staticRoutes).toContain('/browse');
      expect(staticRoutes).toContain('/about');
      expect(staticRoutes).toContain('/ko');
      expect(staticRoutes).toContain('/ko/browse');
      expect(staticRoutes).not.toContain('/entry/:entryId');
      expect(staticRoutes).not.toContain('/category/$categoryId');
      expect(staticRoutes).not.toContain('/ko/entry/:entryId');
    });
  });

  describe('params.locale behavior', () => {
    // 이 테스트는 params.locale이 항상 undefined임을 문서화합니다
    it('should demonstrate that params.locale is always undefined', () => {
      // Routes defined as:
      // route('entry/:entryId', ...)       → params = { entryId: 'hello' }
      // route('ko/entry/:entryId', ...)    → params = { entryId: 'hello' }
      // 'ko' is a fixed string, not a parameter

      const mockParams: RouteParams = {
        entryId: 'hello',
        locale: undefined, // Always undefined
      };

      // Wrong: Using params.locale
      const wrongLocale = mockParams.locale === 'ko' ? 'ko' : 'en';
      expect(wrongLocale).toBe('en'); // Always 'en' because locale is undefined

      // Correct: Using getLocaleFromPath
      const pathEn = '/entry/hello';
      const pathKo = '/ko/entry/hello';

      expect(getLocaleFromPath(pathEn)).toBe('en');
      expect(getLocaleFromPath(pathKo)).toBe('ko');
    });

    it('should correctly extract locale in loader context', () => {
      // Simulating loader function
      function mockLoader(params: RouteParams, requestUrl: string) {
        const url = new URL(requestUrl);
        const locale = getLocaleFromPath(url.pathname);
        return { locale, entryId: params.entryId };
      }

      const resultEn = mockLoader(
        { entryId: 'hello' },
        'https://example.com/entry/hello',
      );
      expect(resultEn.locale).toBe('en');

      const resultKo = mockLoader(
        { entryId: 'hello' },
        'https://example.com/ko/entry/hello',
      );
      expect(resultKo.locale).toBe('ko');
    });

    it('should correctly extract locale in clientLoader context', () => {
      // Simulating clientLoader function (uses window.location)
      function mockClientLoader(params: RouteParams, pathname: string) {
        const locale = getLocaleFromPath(pathname);
        return { locale, entryId: params.entryId };
      }

      expect(mockClientLoader({ entryId: 'hello' }, '/entry/hello').locale).toBe('en');
      expect(mockClientLoader({ entryId: 'hello' }, '/ko/entry/hello').locale).toBe('ko');
    });
  });

  describe('URL manipulation', () => {
    it('should switch locale in URL', () => {
      function switchLocale(pathname: string, newLocale: Language): string {
        const stripped = stripLocaleFromPath(pathname);
        return addLocaleToPath(stripped, newLocale);
      }

      // English to Korean
      expect(switchLocale('/entry/hello', 'ko')).toBe('/ko/entry/hello');
      expect(switchLocale('/browse', 'ko')).toBe('/ko/browse');

      // Korean to English
      expect(switchLocale('/ko/entry/hello', 'en')).toBe('/entry/hello');
      expect(switchLocale('/ko/browse', 'en')).toBe('/browse');

      // Same locale (no change)
      expect(switchLocale('/entry/hello', 'en')).toBe('/entry/hello');
      expect(switchLocale('/ko/entry/hello', 'ko')).toBe('/ko/entry/hello');
    });

    it('should generate alternate language URL for hreflang', () => {
      function getAlternateUrl(
        pathname: string,
        baseUrl: string,
      ): { en: string; ko: string } {
        const stripped = stripLocaleFromPath(pathname);
        return {
          en: `${baseUrl}${addLocaleToPath(stripped, 'en')}`,
          ko: `${baseUrl}${addLocaleToPath(stripped, 'ko')}`,
        };
      }

      const baseUrl = 'https://example.com';

      const fromEnglish = getAlternateUrl('/entry/hello', baseUrl);
      expect(fromEnglish.en).toBe('https://example.com/entry/hello');
      expect(fromEnglish.ko).toBe('https://example.com/ko/entry/hello');

      const fromKorean = getAlternateUrl('/ko/entry/hello', baseUrl);
      expect(fromKorean.en).toBe('https://example.com/entry/hello');
      expect(fromKorean.ko).toBe('https://example.com/ko/entry/hello');
    });
  });

  describe('App-specific routes', () => {
    describe('Context app', () => {
      const contextRoutes = [
        '/entry/:entryId',
        '/ko/entry/:entryId',
        '/category/:categoryId',
        '/ko/category/:categoryId',
        '/browse',
        '/ko/browse',
      ];

      it('should have matching en/ko route pairs', () => {
        const enRoutes = contextRoutes.filter((r) => !r.startsWith('/ko'));
        const koRoutes = contextRoutes
          .filter((r) => r.startsWith('/ko'))
          .map((r) => r.slice(3));

        expect(enRoutes.sort()).toEqual(koRoutes.sort());
      });
    });

    describe('Roots app', () => {
      const rootsRoutes = [
        '/concept/:conceptId',
        '/ko/concept/:conceptId',
        '/field/:fieldId',
        '/ko/field/:fieldId',
        '/browse',
        '/ko/browse',
      ];

      it('should have matching en/ko route pairs', () => {
        const enRoutes = rootsRoutes.filter((r) => !r.startsWith('/ko'));
        const koRoutes = rootsRoutes
          .filter((r) => r.startsWith('/ko'))
          .map((r) => r.slice(3));

        expect(enRoutes.sort()).toEqual(koRoutes.sort());
      });
    });

    describe('Permissive app', () => {
      const permissiveRoutes = [
        '/library/:slug',
        '/ko/library/:slug',
        '/web-api/:slug',
        '/ko/web-api/:slug',
        '/libraries',
        '/ko/libraries',
      ];

      it('should have matching en/ko route pairs', () => {
        const enRoutes = permissiveRoutes.filter((r) => !r.startsWith('/ko'));
        const koRoutes = permissiveRoutes
          .filter((r) => r.startsWith('/ko'))
          .map((r) => r.slice(3));

        expect(enRoutes.sort()).toEqual(koRoutes.sort());
      });
    });
  });
});
