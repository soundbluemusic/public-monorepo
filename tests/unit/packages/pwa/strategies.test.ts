/**
 * @soundblue/pwa - Service Worker Strategies Tests
 *
 * 서비스 워커 캐시 전략 테스트
 */
import {
  API_STRATEGY,
  BUNDLE_STRATEGY,
  type CacheStrategy,
  createDefaultServiceWorkerConfig,
  createSSGServiceWorkerConfig, // deprecated alias
  DATA_STRATEGY,
  getDefaultCachingRules,
  getSSGCachingRules, // deprecated alias
  PAGE_STRATEGY,
  type RuntimeCaching,
  STATIC_ASSETS_STRATEGY,
} from '@soundblue/pwa/service-worker';
import { describe, expect, it } from 'vitest';

describe('@soundblue/pwa/service-worker', () => {
  describe('STATIC_ASSETS_STRATEGY', () => {
    it('should use CacheFirst handler', () => {
      expect(STATIC_ASSETS_STRATEGY.handler).toBe('CacheFirst');
    });

    it('should match image files', () => {
      const pattern = STATIC_ASSETS_STRATEGY.urlPattern as RegExp;
      expect(pattern.test('image.png')).toBe(true);
      expect(pattern.test('image.jpg')).toBe(true);
      expect(pattern.test('image.jpeg')).toBe(true);
      expect(pattern.test('image.svg')).toBe(true);
      expect(pattern.test('image.gif')).toBe(true);
      expect(pattern.test('image.webp')).toBe(true);
      expect(pattern.test('favicon.ico')).toBe(true);
    });

    it('should match font files', () => {
      const pattern = STATIC_ASSETS_STRATEGY.urlPattern as RegExp;
      expect(pattern.test('font.woff')).toBe(true);
      expect(pattern.test('font.woff2')).toBe(true);
      expect(pattern.test('font.ttf')).toBe(true);
      expect(pattern.test('font.eot')).toBe(true);
    });

    it('should have cache name', () => {
      expect(STATIC_ASSETS_STRATEGY.options?.cacheName).toBe('static-assets');
    });

    it('should have expiration settings', () => {
      expect(STATIC_ASSETS_STRATEGY.options?.expiration?.maxEntries).toBe(100);
      expect(STATIC_ASSETS_STRATEGY.options?.expiration?.maxAgeSeconds).toBe(60 * 60 * 24 * 365); // 1 year
    });

    it('should cache status 0 and 200', () => {
      expect(STATIC_ASSETS_STRATEGY.options?.cacheableResponse?.statuses).toEqual([0, 200]);
    });
  });

  describe('BUNDLE_STRATEGY', () => {
    it('should use StaleWhileRevalidate handler', () => {
      expect(BUNDLE_STRATEGY.handler).toBe('StaleWhileRevalidate');
    });

    it('should match JS and CSS files', () => {
      const pattern = BUNDLE_STRATEGY.urlPattern as RegExp;
      expect(pattern.test('app.js')).toBe(true);
      expect(pattern.test('styles.css')).toBe(true);
      expect(pattern.test('bundle.min.js')).toBe(true);
    });

    it('should not match other files', () => {
      const pattern = BUNDLE_STRATEGY.urlPattern as RegExp;
      expect(pattern.test('image.png')).toBe(false);
      expect(pattern.test('data.json')).toBe(false);
    });

    it('should have cache name', () => {
      expect(BUNDLE_STRATEGY.options?.cacheName).toBe('bundles');
    });

    it('should have 30 day expiration', () => {
      expect(BUNDLE_STRATEGY.options?.expiration?.maxAgeSeconds).toBe(60 * 60 * 24 * 30);
    });
  });

  describe('PAGE_STRATEGY', () => {
    it('should use NetworkFirst handler', () => {
      expect(PAGE_STRATEGY.handler).toBe('NetworkFirst');
    });

    it('should have network timeout', () => {
      expect(PAGE_STRATEGY.options?.networkTimeoutSeconds).toBe(3);
    });

    it('should have cache name', () => {
      expect(PAGE_STRATEGY.options?.cacheName).toBe('pages');
    });

    it('should have 7 day expiration', () => {
      expect(PAGE_STRATEGY.options?.expiration?.maxAgeSeconds).toBe(60 * 60 * 24 * 7);
    });
  });

  describe('API_STRATEGY', () => {
    it('should use NetworkFirst handler', () => {
      expect(API_STRATEGY.handler).toBe('NetworkFirst');
    });

    it('should match /api/ paths', () => {
      const pattern = API_STRATEGY.urlPattern as RegExp;
      expect(pattern.test('/api/users')).toBe(true);
      expect(pattern.test('https://example.com/api/data')).toBe(true);
    });

    it('should have 5 second network timeout', () => {
      expect(API_STRATEGY.options?.networkTimeoutSeconds).toBe(5);
    });

    it('should have 1 hour expiration', () => {
      expect(API_STRATEGY.options?.expiration?.maxAgeSeconds).toBe(60 * 60);
    });
  });

  describe('DATA_STRATEGY', () => {
    it('should use StaleWhileRevalidate handler', () => {
      expect(DATA_STRATEGY.handler).toBe('StaleWhileRevalidate');
    });

    it('should match .data and .json files', () => {
      const pattern = DATA_STRATEGY.urlPattern as RegExp;
      expect(pattern.test('file.data')).toBe(true);
      expect(pattern.test('config.json')).toBe(true);
    });

    it('should have cache name', () => {
      expect(DATA_STRATEGY.options?.cacheName).toBe('data-cache');
    });

    it('should have 24 hour expiration', () => {
      expect(DATA_STRATEGY.options?.expiration?.maxAgeSeconds).toBe(60 * 60 * 24);
    });

    it('should allow 200 entries', () => {
      expect(DATA_STRATEGY.options?.expiration?.maxEntries).toBe(200);
    });
  });

  describe('getDefaultCachingRules', () => {
    it('should return array of caching rules', () => {
      const rules = getDefaultCachingRules();
      expect(Array.isArray(rules)).toBe(true);
    });

    it('should include all relevant strategies', () => {
      const rules = getDefaultCachingRules();

      expect(rules).toContain(STATIC_ASSETS_STRATEGY);
      expect(rules).toContain(BUNDLE_STRATEGY);
      expect(rules).toContain(DATA_STRATEGY);
      expect(rules).toContain(PAGE_STRATEGY);
    });

    it('should not include API strategy by default', () => {
      const rules = getDefaultCachingRules();
      expect(rules).not.toContain(API_STRATEGY);
    });

    it('should have 4 rules', () => {
      const rules = getDefaultCachingRules();
      expect(rules).toHaveLength(4);
    });

    it('should have deprecated alias getSSGCachingRules', () => {
      expect(getSSGCachingRules).toBe(getDefaultCachingRules);
    });
  });

  describe('createDefaultServiceWorkerConfig', () => {
    it('should create config with correct globDirectory', () => {
      const config = createDefaultServiceWorkerConfig('./build/client', './build/sw.js');
      expect(config.globDirectory).toBe('./build/client');
    });

    it('should create config with correct swDest', () => {
      const config = createDefaultServiceWorkerConfig('./build/client', './build/sw.js');
      expect(config.swDest).toBe('./build/sw.js');
    });

    it('should include comprehensive glob patterns', () => {
      const config = createDefaultServiceWorkerConfig('./dist', './dist/sw.js');
      expect(config.globPatterns).toContain(
        '**/*.{html,js,css,png,jpg,jpeg,svg,gif,webp,ico,woff2,data,json}',
      );
    });

    it('should include runtime caching rules', () => {
      const config = createDefaultServiceWorkerConfig('./dist', './dist/sw.js');
      expect(config.runtimeCaching).toBeDefined();
      expect(config.runtimeCaching).toEqual(getDefaultCachingRules());
    });

    it('should enable skipWaiting', () => {
      const config = createDefaultServiceWorkerConfig('./dist', './dist/sw.js');
      expect(config.skipWaiting).toBe(true);
    });

    it('should enable clientsClaim', () => {
      const config = createDefaultServiceWorkerConfig('./dist', './dist/sw.js');
      expect(config.clientsClaim).toBe(true);
    });

    it('should have deprecated alias createSSGServiceWorkerConfig', () => {
      expect(createSSGServiceWorkerConfig).toBe(createDefaultServiceWorkerConfig);
    });
  });

  describe('CacheStrategy type', () => {
    it('should accept all valid strategies', () => {
      const strategies: CacheStrategy[] = [
        'CacheFirst',
        'NetworkFirst',
        'StaleWhileRevalidate',
        'NetworkOnly',
        'CacheOnly',
      ];

      expect(strategies).toHaveLength(5);
    });
  });

  describe('RuntimeCaching interface', () => {
    it('should create valid runtime caching object', () => {
      const config: RuntimeCaching = {
        urlPattern: /\.json$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'test-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 3600,
          },
        },
      };

      expect(config.handler).toBe('NetworkFirst');
      expect(config.options?.cacheName).toBe('test-cache');
    });

    it('should allow string urlPattern', () => {
      const config: RuntimeCaching = {
        urlPattern: 'https://api.example.com/*',
        handler: 'NetworkOnly',
      };

      expect(config.urlPattern).toBe('https://api.example.com/*');
    });

    it('should allow minimal config without options', () => {
      const config: RuntimeCaching = {
        urlPattern: /\.*/,
        handler: 'CacheFirst',
      };

      expect(config.options).toBeUndefined();
    });
  });
});
