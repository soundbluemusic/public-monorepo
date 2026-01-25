/**
 * @fileoverview Permissive 앱 WebAPI 데이터 테스트
 *
 * Web API 데이터 조회 및 필터링 함수들의 단위 테스트입니다.
 */

import { describe, expect, it } from 'vitest';

// 타입 정의
interface WebAPI {
  name: string;
  description: string;
  descriptionKo: string;
  category: string;
  status: 'stable' | 'experimental' | 'deprecated';
  mdnUrl: string;
  caniuseUrl?: string;
  browserSupport: {
    chrome: string;
    firefox: string;
    safari: string;
    edge: string;
  };
  tags?: string[];
  useCases?: { en: string; ko: string };
  codeExample?: string;
}

// Mock 데이터
const mockWebAPIs: WebAPI[] = [
  {
    name: 'Fetch API',
    description: 'Interface for fetching resources',
    descriptionKo: '리소스를 가져오기 위한 인터페이스',
    category: 'Network',
    status: 'stable',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
    caniuseUrl: 'https://caniuse.com/fetch',
    browserSupport: {
      chrome: '42+',
      firefox: '39+',
      safari: '10.1+',
      edge: '14+',
    },
    tags: ['Network', 'HTTP', 'Promise'],
  },
  {
    name: 'Web Storage API',
    description: 'Mechanisms for storing key-value pairs',
    descriptionKo: '키-값 쌍을 저장하는 메커니즘',
    category: 'Storage',
    status: 'stable',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API',
    browserSupport: {
      chrome: '4+',
      firefox: '3.5+',
      safari: '4+',
      edge: '12+',
    },
    tags: ['Storage', 'localStorage', 'sessionStorage'],
  },
  {
    name: 'IndexedDB API',
    description: 'Low-level API for client-side storage',
    descriptionKo: '클라이언트 측 저장을 위한 저수준 API',
    category: 'Storage',
    status: 'stable',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API',
    caniuseUrl: 'https://caniuse.com/indexeddb',
    browserSupport: {
      chrome: '24+',
      firefox: '16+',
      safari: '10+',
      edge: '12+',
    },
    tags: ['Storage', 'Database', 'Async'],
  },
  {
    name: 'Intersection Observer API',
    description: 'Observe changes in intersection of elements',
    descriptionKo: '요소의 교차점 변화를 관찰',
    category: 'DOM',
    status: 'stable',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API',
    caniuseUrl: 'https://caniuse.com/intersectionobserver',
    browserSupport: {
      chrome: '51+',
      firefox: '55+',
      safari: '12.1+',
      edge: '15+',
    },
    tags: ['DOM', 'Performance', 'Lazy Loading'],
  },
  {
    name: 'Web Animations API',
    description: 'Animate DOM elements programmatically',
    descriptionKo: 'DOM 요소를 프로그래밍 방식으로 애니메이션',
    category: 'Animation',
    status: 'stable',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API',
    browserSupport: {
      chrome: '36+',
      firefox: '48+',
      safari: '13.1+',
      edge: '79+',
    },
    tags: ['Animation', 'DOM', 'Performance'],
  },
  {
    name: 'WebGPU API',
    description: 'Modern graphics API for the web',
    descriptionKo: '웹을 위한 현대적인 그래픽 API',
    category: 'Graphics',
    status: 'experimental',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API',
    browserSupport: {
      chrome: '113+',
      firefox: 'behind flag',
      safari: 'behind flag',
      edge: '113+',
    },
    tags: ['Graphics', '3D', 'GPU'],
  },
];

// 데이터 조회 함수들 (테스트용 구현)
function getWebAPIBySlug(slug: string): WebAPI | undefined {
  return mockWebAPIs.find((api) => getWebAPISlug(api.name) === slug);
}

function getWebAPISlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getWebAPIsByCategory(category: string): WebAPI[] {
  return mockWebAPIs.filter((api) => api.category === category);
}

function getWebAPIsByStatus(status: WebAPI['status']): WebAPI[] {
  return mockWebAPIs.filter((api) => api.status === status);
}

function getWebAPIsByTag(tag: string): WebAPI[] {
  return mockWebAPIs.filter((api) => api.tags?.includes(tag));
}

function getStableAPIs(): WebAPI[] {
  return getWebAPIsByStatus('stable');
}

function getExperimentalAPIs(): WebAPI[] {
  return getWebAPIsByStatus('experimental');
}

function searchWebAPIs(query: string): WebAPI[] {
  const lowerQuery = query.toLowerCase();
  return mockWebAPIs.filter((api) => {
    return (
      api.name.toLowerCase().includes(lowerQuery) ||
      api.description.toLowerCase().includes(lowerQuery) ||
      api.descriptionKo.includes(query) ||
      api.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

function getAllCategories(): string[] {
  const categories = new Set<string>();
  for (const api of mockWebAPIs) {
    categories.add(api.category);
  }
  return Array.from(categories).sort();
}

function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const api of mockWebAPIs) {
    if (api.tags) {
      for (const tag of api.tags) {
        tags.add(tag);
      }
    }
  }
  return Array.from(tags).sort();
}

function checkBrowserSupport(api: WebAPI, browser: keyof WebAPI['browserSupport']): boolean {
  const support = api.browserSupport[browser];
  return !support.includes('flag') && support !== 'No';
}

function getAPIsWithFullSupport(): WebAPI[] {
  return mockWebAPIs.filter((api) => {
    return (
      checkBrowserSupport(api, 'chrome') &&
      checkBrowserSupport(api, 'firefox') &&
      checkBrowserSupport(api, 'safari') &&
      checkBrowserSupport(api, 'edge')
    );
  });
}

// 테스트 시작
describe('WebAPI Data', () => {
  describe('getWebAPIBySlug', () => {
    it('should return API for valid slug', () => {
      const api = getWebAPIBySlug('fetch-api');

      expect(api).not.toBeUndefined();
      expect(api?.name).toBe('Fetch API');
    });

    it('should return undefined for non-existent slug', () => {
      const api = getWebAPIBySlug('nonexistent');
      expect(api).toBeUndefined();
    });

    it('should handle slug with multiple hyphens', () => {
      const api = getWebAPIBySlug('intersection-observer-api');

      expect(api?.name).toBe('Intersection Observer API');
    });
  });

  describe('getWebAPISlug', () => {
    it('should convert API name to slug', () => {
      expect(getWebAPISlug('Fetch API')).toBe('fetch-api');
      expect(getWebAPISlug('Web Storage API')).toBe('web-storage-api');
      expect(getWebAPISlug('IndexedDB API')).toBe('indexeddb-api');
    });

    it('should remove special characters', () => {
      expect(getWebAPISlug('API (Beta)')).toBe('api-beta');
      expect(getWebAPISlug('Test@API')).toBe('test-api');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(getWebAPISlug('-Test API-')).toBe('test-api');
    });
  });

  describe('getWebAPIsByCategory', () => {
    it('should return APIs for valid category', () => {
      const apis = getWebAPIsByCategory('Storage');

      expect(apis.length).toBe(2);
      expect(apis.every((api) => api.category === 'Storage')).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      const apis = getWebAPIsByCategory('Nonexistent');
      expect(apis).toEqual([]);
    });
  });

  describe('getWebAPIsByStatus', () => {
    it('should return stable APIs', () => {
      const apis = getWebAPIsByStatus('stable');

      expect(apis.length).toBe(5);
      expect(apis.every((api) => api.status === 'stable')).toBe(true);
    });

    it('should return experimental APIs', () => {
      const apis = getWebAPIsByStatus('experimental');

      expect(apis.length).toBe(1);
      expect(apis[0]?.name).toBe('WebGPU API');
    });

    it('should return empty for deprecated (none in mock)', () => {
      const apis = getWebAPIsByStatus('deprecated');
      expect(apis).toEqual([]);
    });
  });

  describe('getWebAPIsByTag', () => {
    it('should return APIs with matching tag', () => {
      const apis = getWebAPIsByTag('Storage');

      expect(apis.length).toBe(2);
      expect(apis.every((api) => api.tags?.includes('Storage'))).toBe(true);
    });

    it('should return APIs with Performance tag', () => {
      const apis = getWebAPIsByTag('Performance');

      expect(apis.length).toBe(2);
    });

    it('should return empty array for non-existent tag', () => {
      const apis = getWebAPIsByTag('Nonexistent');
      expect(apis).toEqual([]);
    });
  });

  describe('getStableAPIs', () => {
    it('should return only stable APIs', () => {
      const apis = getStableAPIs();

      expect(apis.every((api) => api.status === 'stable')).toBe(true);
      expect(apis.length).toBe(5);
    });
  });

  describe('getExperimentalAPIs', () => {
    it('should return only experimental APIs', () => {
      const apis = getExperimentalAPIs();

      expect(apis.every((api) => api.status === 'experimental')).toBe(true);
      expect(apis.length).toBe(1);
    });
  });

  describe('searchWebAPIs', () => {
    it('should find APIs by name', () => {
      const results = searchWebAPIs('Fetch');

      expect(results.length).toBe(1);
      expect(results[0]?.name).toBe('Fetch API');
    });

    it('should find APIs by description', () => {
      const results = searchWebAPIs('storage');

      expect(results.length).toBeGreaterThan(0);
    });

    it('should find APIs by Korean description', () => {
      const results = searchWebAPIs('저장');

      expect(results.length).toBeGreaterThan(0);
    });

    it('should find APIs by tag', () => {
      const results = searchWebAPIs('database');

      expect(results.some((api) => api.name === 'IndexedDB API')).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const results = searchWebAPIs('xyz123nonexistent');
      expect(results).toEqual([]);
    });

    it('should be case-insensitive', () => {
      const upper = searchWebAPIs('FETCH');
      const lower = searchWebAPIs('fetch');

      expect(upper.length).toBe(lower.length);
    });
  });

  describe('getAllCategories', () => {
    it('should return all unique categories sorted', () => {
      const categories = getAllCategories();

      expect(categories).toContain('Network');
      expect(categories).toContain('Storage');
      expect(categories).toContain('DOM');
      expect(categories).toContain('Animation');
      expect(categories).toContain('Graphics');
      // Should be sorted
      expect(categories[0]).toBe('Animation');
    });
  });

  describe('getAllTags', () => {
    it('should return all unique tags sorted', () => {
      const tags = getAllTags();

      expect(tags).toContain('Network');
      expect(tags).toContain('Storage');
      expect(tags).toContain('Performance');
      expect(tags).toContain('DOM');
    });
  });

  describe('checkBrowserSupport', () => {
    it('should return true for supported browser', () => {
      const fetchAPI = mockWebAPIs[0]!;

      expect(checkBrowserSupport(fetchAPI, 'chrome')).toBe(true);
      expect(checkBrowserSupport(fetchAPI, 'firefox')).toBe(true);
    });

    it('should return false for behind flag', () => {
      const webgpu = mockWebAPIs.find((api) => api.name === 'WebGPU API')!;

      expect(checkBrowserSupport(webgpu, 'firefox')).toBe(false);
      expect(checkBrowserSupport(webgpu, 'safari')).toBe(false);
    });
  });

  describe('getAPIsWithFullSupport', () => {
    it('should return APIs supported in all browsers', () => {
      const apis = getAPIsWithFullSupport();

      expect(apis.every((api) => api.status === 'stable')).toBe(true);
      expect(apis.some((api) => api.name === 'WebGPU API')).toBe(false);
    });
  });

  describe('WebAPI data integrity', () => {
    it('all APIs should have required fields', () => {
      for (const api of mockWebAPIs) {
        expect(api.name).toBeDefined();
        expect(api.description).toBeDefined();
        expect(api.descriptionKo).toBeDefined();
        expect(api.category).toBeDefined();
        expect(api.status).toBeDefined();
        expect(api.mdnUrl).toBeDefined();
        expect(api.browserSupport).toBeDefined();
      }
    });

    it('MDN URLs should be valid', () => {
      for (const api of mockWebAPIs) {
        expect(api.mdnUrl).toMatch(/^https:\/\/developer\.mozilla\.org\//);
      }
    });

    it('caniuse URLs should be valid when present', () => {
      for (const api of mockWebAPIs) {
        if (api.caniuseUrl) {
          expect(api.caniuseUrl).toMatch(/^https:\/\/caniuse\.com\//);
        }
      }
    });

    it('status should be valid enum value', () => {
      const validStatuses = ['stable', 'experimental', 'deprecated'];

      for (const api of mockWebAPIs) {
        expect(validStatuses).toContain(api.status);
      }
    });

    it('browserSupport should have all major browsers', () => {
      const browsers = ['chrome', 'firefox', 'safari', 'edge'];

      for (const api of mockWebAPIs) {
        for (const browser of browsers) {
          expect(api.browserSupport[browser as keyof typeof api.browserSupport]).toBeDefined();
        }
      }
    });
  });

  describe('Browser support format', () => {
    it('should parse version number format', () => {
      const fetchAPI = mockWebAPIs[0]!;

      expect(fetchAPI.browserSupport.chrome).toMatch(/^\d+\+$/);
    });

    it('should recognize behind flag format', () => {
      const webgpu = mockWebAPIs.find((api) => api.name === 'WebGPU API')!;

      expect(webgpu.browserSupport.firefox).toBe('behind flag');
    });
  });

  describe('edge cases', () => {
    it('should handle API names with multiple words', () => {
      const api = getWebAPIBySlug('web-animations-api');
      expect(api?.name).toBe('Web Animations API');
    });

    it('should handle empty search query', () => {
      const results = searchWebAPIs('');
      expect(results.length).toBe(6); // All APIs match empty string
    });

    it('should handle APIs without optional fields', () => {
      const storageAPI = mockWebAPIs.find((api) => api.name === 'Web Storage API');

      expect(storageAPI?.caniuseUrl).toBeUndefined();
      expect(storageAPI?.useCases).toBeUndefined();
      expect(storageAPI?.codeExample).toBeUndefined();
    });
  });
});
