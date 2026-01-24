/**
 * @fileoverview PWA 오프라인 동작 테스트
 *
 * 서비스 워커 및 오프라인 기능 관련 테스트입니다.
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

// Mock Service Worker 관련 타입
interface MockCache {
  put: (request: Request | string, response: Response) => Promise<void>;
  match: (request: Request | string) => Promise<Response | undefined>;
  delete: (request: Request | string) => Promise<boolean>;
  keys: () => Promise<Request[]>;
}

interface MockCacheStorage {
  open: (cacheName: string) => Promise<MockCache>;
  delete: (cacheName: string) => Promise<boolean>;
  keys: () => Promise<string[]>;
  has: (cacheName: string) => Promise<boolean>;
}

// Mock Cache 구현
function createMockCacheStorage(): MockCacheStorage {
  const caches = new Map<string, Map<string, Response>>();

  return {
    open: async (cacheName: string): Promise<MockCache> => {
      if (!caches.has(cacheName)) {
        caches.set(cacheName, new Map());
      }
      const cache = caches.get(cacheName)!;

      return {
        put: async (request: Request | string, response: Response) => {
          const url = typeof request === 'string' ? request : request.url;
          cache.set(url, response.clone());
        },
        match: async (request: Request | string) => {
          const url = typeof request === 'string' ? request : request.url;
          const response = cache.get(url);
          return response?.clone();
        },
        delete: async (request: Request | string) => {
          const url = typeof request === 'string' ? request : request.url;
          return cache.delete(url);
        },
        keys: async () => {
          return Array.from(cache.keys()).map((url) => new Request(url));
        },
      };
    },
    delete: async (cacheName: string) => {
      return caches.delete(cacheName);
    },
    keys: async () => {
      return Array.from(caches.keys());
    },
    has: async (cacheName: string) => {
      return caches.has(cacheName);
    },
  };
}

// 캐싱 전략 구현
type CacheStrategy = 'cache-first' | 'network-first' | 'stale-while-revalidate';

async function fetchWithStrategy(
  request: Request,
  strategy: CacheStrategy,
  cache: MockCache,
  fetchFn: typeof fetch,
): Promise<Response> {
  switch (strategy) {
    case 'cache-first': {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetchFn(request);
      if (response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    }

    case 'network-first': {
      try {
        const response = await fetchFn(request);
        if (response.ok) {
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        throw new Error('Network and cache both failed');
      }
    }

    case 'stale-while-revalidate': {
      const cached = await cache.match(request);

      // Start network fetch in background
      const networkPromise = fetchFn(request).then(async (response) => {
        if (response.ok) {
          await cache.put(request, response.clone());
        }
        return response;
      });

      // Return cached if available, otherwise wait for network
      if (cached) {
        // Fire-and-forget the network request for revalidation
        networkPromise.catch(() => {});
        return cached;
      }

      return networkPromise;
    }
  }
}

// 오프라인 감지 유틸리티
function createOnlineStatusTracker() {
  let isOnline = true;
  const listeners: Array<(online: boolean) => void> = [];

  return {
    get isOnline() {
      return isOnline;
    },
    setOnline: (online: boolean) => {
      isOnline = online;
      for (const listener of listeners) {
        listener(online);
      }
    },
    addListener: (listener: (online: boolean) => void) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      };
    },
  };
}

// 테스트 시작
describe('PWA Offline', () => {
  let cacheStorage: MockCacheStorage;

  beforeEach(() => {
    cacheStorage = createMockCacheStorage();
  });

  describe('Cache Storage', () => {
    it('should create and open cache', async () => {
      const cache = await cacheStorage.open('test-cache');
      expect(cache).toBeDefined();
    });

    it('should store and retrieve response', async () => {
      const cache = await cacheStorage.open('test-cache');
      const response = new Response('Hello World', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });

      await cache.put('https://example.com/data', response);
      const cached = await cache.match('https://example.com/data');

      expect(cached).toBeDefined();
      expect(await cached?.text()).toBe('Hello World');
    });

    it('should delete cached response', async () => {
      const cache = await cacheStorage.open('test-cache');
      await cache.put('https://example.com/data', new Response('data'));

      const deleted = await cache.delete('https://example.com/data');
      const cached = await cache.match('https://example.com/data');

      expect(deleted).toBe(true);
      expect(cached).toBeUndefined();
    });

    it('should list cached requests', async () => {
      const cache = await cacheStorage.open('test-cache');
      await cache.put('https://example.com/1', new Response('1'));
      await cache.put('https://example.com/2', new Response('2'));

      const keys = await cache.keys();
      expect(keys).toHaveLength(2);
    });

    it('should delete entire cache', async () => {
      await cacheStorage.open('to-delete');
      const deleted = await cacheStorage.delete('to-delete');
      const exists = await cacheStorage.has('to-delete');

      expect(deleted).toBe(true);
      expect(exists).toBe(false);
    });

    it('should list all cache names', async () => {
      await cacheStorage.open('cache-1');
      await cacheStorage.open('cache-2');

      const names = await cacheStorage.keys();
      expect(names).toContain('cache-1');
      expect(names).toContain('cache-2');
    });
  });

  describe('Cache-First Strategy', () => {
    it('should return cached response if available', async () => {
      const cache = await cacheStorage.open('cache-first');
      await cache.put(
        'https://example.com/data',
        new Response('cached data', { status: 200 }),
      );

      const mockFetch = vi.fn();
      const response = await fetchWithStrategy(
        new Request('https://example.com/data'),
        'cache-first',
        cache,
        mockFetch,
      );

      expect(await response.text()).toBe('cached data');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should fetch from network if not cached', async () => {
      const cache = await cacheStorage.open('cache-first');
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('network data', { status: 200 }),
      );

      const response = await fetchWithStrategy(
        new Request('https://example.com/data'),
        'cache-first',
        cache,
        mockFetch,
      );

      expect(await response.text()).toBe('network data');
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should cache network response', async () => {
      const cache = await cacheStorage.open('cache-first');
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('network data', { status: 200 }),
      );

      await fetchWithStrategy(
        new Request('https://example.com/data'),
        'cache-first',
        cache,
        mockFetch,
      );

      const cached = await cache.match('https://example.com/data');
      expect(await cached?.text()).toBe('network data');
    });

    it('should not cache error responses', async () => {
      const cache = await cacheStorage.open('cache-first');
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('error', { status: 500 }),
      );

      await fetchWithStrategy(
        new Request('https://example.com/data'),
        'cache-first',
        cache,
        mockFetch,
      );

      const cached = await cache.match('https://example.com/data');
      expect(cached).toBeUndefined();
    });
  });

  describe('Network-First Strategy', () => {
    it('should fetch from network first', async () => {
      const cache = await cacheStorage.open('network-first');
      await cache.put(
        'https://example.com/data',
        new Response('stale cached', { status: 200 }),
      );

      const mockFetch = vi.fn().mockResolvedValue(
        new Response('fresh network', { status: 200 }),
      );

      const response = await fetchWithStrategy(
        new Request('https://example.com/data'),
        'network-first',
        cache,
        mockFetch,
      );

      expect(await response.text()).toBe('fresh network');
    });

    it('should fall back to cache on network failure', async () => {
      const cache = await cacheStorage.open('network-first');
      await cache.put(
        'https://example.com/data',
        new Response('cached fallback', { status: 200 }),
      );

      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const response = await fetchWithStrategy(
        new Request('https://example.com/data'),
        'network-first',
        cache,
        mockFetch,
      );

      expect(await response.text()).toBe('cached fallback');
    });

    it('should throw when both network and cache fail', async () => {
      const cache = await cacheStorage.open('network-first');
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(
        fetchWithStrategy(
          new Request('https://example.com/data'),
          'network-first',
          cache,
          mockFetch,
        ),
      ).rejects.toThrow('Network and cache both failed');
    });

    it('should update cache with network response', async () => {
      const cache = await cacheStorage.open('network-first');
      await cache.put(
        'https://example.com/data',
        new Response('old data', { status: 200 }),
      );

      const mockFetch = vi.fn().mockResolvedValue(
        new Response('new data', { status: 200 }),
      );

      await fetchWithStrategy(
        new Request('https://example.com/data'),
        'network-first',
        cache,
        mockFetch,
      );

      const cached = await cache.match('https://example.com/data');
      expect(await cached?.text()).toBe('new data');
    });
  });

  describe('Stale-While-Revalidate Strategy', () => {
    it('should return cached immediately and update in background', async () => {
      const cache = await cacheStorage.open('swr');
      await cache.put(
        'https://example.com/data',
        new Response('stale', { status: 200 }),
      );

      const mockFetch = vi.fn().mockResolvedValue(
        new Response('fresh', { status: 200 }),
      );

      const response = await fetchWithStrategy(
        new Request('https://example.com/data'),
        'stale-while-revalidate',
        cache,
        mockFetch,
      );

      expect(await response.text()).toBe('stale');
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should fetch from network if not cached', async () => {
      const cache = await cacheStorage.open('swr');
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('network', { status: 200 }),
      );

      const response = await fetchWithStrategy(
        new Request('https://example.com/data'),
        'stale-while-revalidate',
        cache,
        mockFetch,
      );

      expect(await response.text()).toBe('network');
    });
  });

  describe('Online Status Tracker', () => {
    it('should track online status', () => {
      const tracker = createOnlineStatusTracker();
      expect(tracker.isOnline).toBe(true);
    });

    it('should update online status', () => {
      const tracker = createOnlineStatusTracker();
      tracker.setOnline(false);
      expect(tracker.isOnline).toBe(false);
    });

    it('should notify listeners on status change', () => {
      const tracker = createOnlineStatusTracker();
      const listener = vi.fn();
      tracker.addListener(listener);

      tracker.setOnline(false);

      expect(listener).toHaveBeenCalledWith(false);
    });

    it('should remove listener', () => {
      const tracker = createOnlineStatusTracker();
      const listener = vi.fn();
      const unsubscribe = tracker.addListener(listener);

      unsubscribe();
      tracker.setOnline(false);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should notify multiple listeners', () => {
      const tracker = createOnlineStatusTracker();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      tracker.addListener(listener1);
      tracker.addListener(listener2);
      tracker.setOnline(false);

      expect(listener1).toHaveBeenCalledWith(false);
      expect(listener2).toHaveBeenCalledWith(false);
    });
  });

  describe('Offline Scenarios', () => {
    it('should serve cached page when offline', async () => {
      const cache = await cacheStorage.open('pages');
      await cache.put(
        'https://example.com/',
        new Response('<html>Cached Home</html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        }),
      );

      const mockFetch = vi.fn().mockRejectedValue(new Error('Offline'));

      const response = await fetchWithStrategy(
        new Request('https://example.com/'),
        'network-first',
        cache,
        mockFetch,
      );

      expect(await response.text()).toBe('<html>Cached Home</html>');
    });

    it('should serve cached API response when offline', async () => {
      const cache = await cacheStorage.open('api');
      await cache.put(
        'https://api.example.com/entries',
        new Response(JSON.stringify([{ id: 1 }]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const mockFetch = vi.fn().mockRejectedValue(new Error('Offline'));

      const response = await fetchWithStrategy(
        new Request('https://api.example.com/entries'),
        'network-first',
        cache,
        mockFetch,
      );

      const data = await response.json();
      expect(data).toEqual([{ id: 1 }]);
    });

    it('should handle transition from online to offline', async () => {
      const cache = await cacheStorage.open('dynamic');
      const tracker = createOnlineStatusTracker();

      // Online: fetch and cache
      const onlineFetch = vi.fn().mockResolvedValue(
        new Response('online data', { status: 200 }),
      );

      await fetchWithStrategy(
        new Request('https://example.com/data'),
        'network-first',
        cache,
        onlineFetch,
      );

      // Go offline
      tracker.setOnline(false);
      const offlineFetch = vi.fn().mockRejectedValue(new Error('Offline'));

      const response = await fetchWithStrategy(
        new Request('https://example.com/data'),
        'network-first',
        cache,
        offlineFetch,
      );

      expect(await response.text()).toBe('online data');
    });
  });

  describe('Cache Versioning', () => {
    it('should handle cache version upgrade', async () => {
      // Old cache
      const oldCache = await cacheStorage.open('app-v1');
      await oldCache.put('https://example.com/data', new Response('old'));

      // Upgrade to new version
      const newCache = await cacheStorage.open('app-v2');
      await newCache.put('https://example.com/data', new Response('new'));

      // Delete old cache
      await cacheStorage.delete('app-v1');

      const cacheNames = await cacheStorage.keys();
      expect(cacheNames).not.toContain('app-v1');
      expect(cacheNames).toContain('app-v2');
    });

    it('should clean up old caches', async () => {
      const currentVersion = 'app-v3';
      await cacheStorage.open('app-v1');
      await cacheStorage.open('app-v2');
      await cacheStorage.open(currentVersion);

      const cacheNames = await cacheStorage.keys();
      for (const name of cacheNames) {
        if (name !== currentVersion && name.startsWith('app-')) {
          await cacheStorage.delete(name);
        }
      }

      const remainingCaches = await cacheStorage.keys();
      expect(remainingCaches.filter((n) => n.startsWith('app-'))).toEqual([currentVersion]);
    });
  });

  describe('Resource Types', () => {
    it('should cache static assets with cache-first', async () => {
      const cache = await cacheStorage.open('assets');
      const cssResponse = new Response('body { color: red }', {
        headers: { 'Content-Type': 'text/css' },
      });

      await cache.put('https://example.com/style.css', cssResponse);

      const cached = await cache.match('https://example.com/style.css');
      expect(await cached?.text()).toBe('body { color: red }');
    });

    it('should cache fonts', async () => {
      const cache = await cacheStorage.open('fonts');
      // Simulate font file
      const fontData = new Uint8Array([0, 1, 2, 3]);
      const fontResponse = new Response(fontData, {
        headers: { 'Content-Type': 'font/woff2' },
      });

      await cache.put('https://example.com/font.woff2', fontResponse);

      const cached = await cache.match('https://example.com/font.woff2');
      expect(cached).toBeDefined();
    });

    it('should handle images', async () => {
      const cache = await cacheStorage.open('images');
      // Simulate image
      const imageData = new Uint8Array([137, 80, 78, 71]); // PNG header
      const imageResponse = new Response(imageData, {
        headers: { 'Content-Type': 'image/png' },
      });

      await cache.put('https://example.com/image.png', imageResponse);

      const cached = await cache.match('https://example.com/image.png');
      expect(cached).toBeDefined();
    });
  });
});
