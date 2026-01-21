/**
 * @fileoverview Permissive App - Web API Filters Tests
 *
 * useWebApiFilters 훅의 필터링, 정렬 로직 테스트
 * 경계값 테스트, XSS/보안 테스트, Unicode 테스트 포함
 */
import { LIMITS } from '@soundblue/core/validation';
import { describe, expect, it } from 'vitest';

// Type definitions from the app
interface WebAPI {
  name: string;
  description: string;
  descriptionKo: string;
  category: string;
  support: string;
  mdnUrl: string;
  trending?: boolean;
  yearStable?: number;
}

type SortOption = 'support' | 'newest' | 'name';
type QuickFilterType = 'trending' | 'highSupport' | 'new' | null;

const SORT_OPTIONS: readonly SortOption[] = ['support', 'newest', 'name'] as const;
const HIGH_SUPPORT_THRESHOLD = 95;
const NEW_API_YEAR = 2020;

/** Type guard: SortOption validation */
function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

/** Filter APIs by search query */
function filterBySearch(apis: WebAPI[], query: string): WebAPI[] {
  const q = query.toLowerCase().slice(0, LIMITS.SEARCH_LENGTH);
  if (!q) return apis;

  return apis.filter(
    (api) =>
      api.name.toLowerCase().includes(q) ||
      api.description.toLowerCase().includes(q) ||
      api.descriptionKo.includes(q),
  );
}

/** Filter APIs by category */
function filterByCategory(apis: WebAPI[], category: string): WebAPI[] {
  if (category === 'All') return apis;
  return apis.filter((api) => api.category === category);
}

/** Filter APIs by quick filter */
function filterByQuickFilter(apis: WebAPI[], filter: QuickFilterType): WebAPI[] {
  if (!filter) return apis;

  if (filter === 'trending') {
    return apis.filter((api) => api.trending);
  }
  if (filter === 'highSupport') {
    return apis.filter((api) => Number.parseInt(api.support, 10) >= HIGH_SUPPORT_THRESHOLD);
  }
  if (filter === 'new') {
    return apis.filter((api) => api.yearStable && api.yearStable >= NEW_API_YEAR);
  }
  return apis;
}

/** Sort APIs */
function sortApis(apis: WebAPI[], sortBy: SortOption): WebAPI[] {
  return [...apis].sort((a, b) => {
    if (sortBy === 'support') {
      const aSupport = Number.parseInt(a.support, 10);
      const bSupport = Number.parseInt(b.support, 10);
      return bSupport - aSupport;
    }
    if (sortBy === 'newest') {
      return (b.yearStable || 0) - (a.yearStable || 0);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
}

// Test data
const testApis: WebAPI[] = [
  {
    name: 'View Transitions API',
    description: 'Smooth page transitions',
    descriptionKo: '부드러운 페이지 전환',
    category: 'Modern Web Platform',
    support: '72%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API',
    trending: true,
    yearStable: 2023,
  },
  {
    name: 'IntersectionObserver',
    description: 'Detect element visibility',
    descriptionKo: '엘리먼트 가시성 감지',
    category: 'DOM & Observers',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver',
    yearStable: 2019,
  },
  {
    name: 'Web Storage API',
    description: 'Store data in the browser',
    descriptionKo: '브라우저에 데이터 저장',
    category: 'Storage & Data',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API',
    yearStable: 2009,
  },
  {
    name: 'WebGPU',
    description: 'Next-gen 3D graphics and compute',
    descriptionKo: '차세대 3D 그래픽 및 컴퓨팅',
    category: 'Modern Web Platform',
    support: '68%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API',
    trending: true,
    yearStable: 2023,
  },
];

describe('Permissive App - Web API Filters', () => {
  describe('isSortOption', () => {
    it('should return true for valid sort options', () => {
      expect(isSortOption('support')).toBe(true);
      expect(isSortOption('newest')).toBe(true);
      expect(isSortOption('name')).toBe(true);
    });

    it('should return false for invalid sort options', () => {
      expect(isSortOption('invalid')).toBe(false);
      expect(isSortOption('')).toBe(false);
      expect(isSortOption('stars')).toBe(false); // Library sort option, not WebAPI
    });

    // Security edge cases
    it('should handle XSS attempt', () => {
      expect(isSortOption('<script>alert(1)</script>')).toBe(false);
    });

    it('should handle prototype pollution', () => {
      expect(isSortOption('__proto__')).toBe(false);
      expect(isSortOption('constructor')).toBe(false);
    });

    // Unicode edge cases
    it('should return false for Korean text', () => {
      expect(isSortOption('지원율')).toBe(false);
    });

    it('should return false for emoji', () => {
      expect(isSortOption('📊')).toBe(false);
    });
  });

  describe('filterBySearch', () => {
    it('should return all APIs for empty query', () => {
      expect(filterBySearch(testApis, '')).toEqual(testApis);
    });

    it('should filter by name (case-insensitive)', () => {
      const results = filterBySearch(testApis, 'web');
      expect(results.length).toBe(2);
      expect(results.map((r) => r.name)).toContain('Web Storage API');
      expect(results.map((r) => r.name)).toContain('WebGPU');
    });

    it('should filter by Korean description', () => {
      const results = filterBySearch(testApis, '전환');
      expect(results.length).toBe(1);
      expect(results[0]?.name).toBe('View Transitions API');
    });

    // Boundary value tests
    it('should truncate query at LIMITS.SEARCH_LENGTH', () => {
      const longQuery = 'a'.repeat(LIMITS.SEARCH_LENGTH + 100);
      expect(() => filterBySearch(testApis, longQuery)).not.toThrow();
    });

    // Security edge cases
    it('should handle XSS attempt safely', () => {
      const results = filterBySearch(testApis, '<img src=x onerror=alert(1)>');
      expect(results).toHaveLength(0);
    });

    it('should handle SQL injection safely', () => {
      const results = filterBySearch(testApis, "'; DELETE FROM apis; --");
      expect(results).toHaveLength(0);
    });

    // Unicode edge cases
    it('should handle emoji in query', () => {
      const results = filterBySearch(testApis, '🔥');
      expect(results).toHaveLength(0);
    });

    it('should handle Chinese characters', () => {
      const results = filterBySearch(testApis, '中文');
      expect(results).toHaveLength(0);
    });
  });

  describe('filterByCategory', () => {
    it('should return all APIs for "All" category', () => {
      expect(filterByCategory(testApis, 'All')).toEqual(testApis);
    });

    it('should filter by specific category', () => {
      const results = filterByCategory(testApis, 'Modern Web Platform');
      expect(results.length).toBe(2);
    });

    it('should return empty for non-existent category', () => {
      expect(filterByCategory(testApis, 'NonExistent')).toHaveLength(0);
    });

    // Security edge cases
    it('should handle XSS in category', () => {
      expect(filterByCategory(testApis, '<script>')).toHaveLength(0);
    });
  });

  describe('filterByQuickFilter', () => {
    it('should return all APIs for null filter', () => {
      expect(filterByQuickFilter(testApis, null)).toEqual(testApis);
    });

    it('should filter trending APIs', () => {
      const results = filterByQuickFilter(testApis, 'trending');
      expect(results.every((api) => api.trending)).toBe(true);
      expect(results.length).toBe(2);
    });

    it('should filter high support APIs (>= 95%)', () => {
      const results = filterByQuickFilter(testApis, 'highSupport');
      expect(results.length).toBe(2); // 97% and 99%
      expect(results.every((api) => Number.parseInt(api.support, 10) >= HIGH_SUPPORT_THRESHOLD)).toBe(true);
    });

    it('should filter new APIs (>= NEW_API_YEAR)', () => {
      const results = filterByQuickFilter(testApis, 'new');
      expect(results.every((api) => api.yearStable && api.yearStable >= NEW_API_YEAR)).toBe(true);
    });

    // Boundary value tests
    it('should include API with exactly threshold support', () => {
      const apisWithBoundary: WebAPI[] = [
        { ...testApis[0]!, support: '95%' },
        { ...testApis[1]!, support: '94%' },
      ];
      const results = filterByQuickFilter(apisWithBoundary, 'highSupport');
      expect(results.length).toBe(1);
      expect(results[0]?.support).toBe('95%');
    });

    it('should include API with exactly boundary year', () => {
      const apisWithBoundary: WebAPI[] = [
        { ...testApis[0]!, yearStable: NEW_API_YEAR },
        { ...testApis[1]!, yearStable: NEW_API_YEAR - 1 },
      ];
      const results = filterByQuickFilter(apisWithBoundary, 'new');
      expect(results.length).toBe(1);
    });
  });

  describe('sortApis', () => {
    it('should sort by support descending', () => {
      const sorted = sortApis(testApis, 'support');
      expect(sorted[0]?.name).toBe('Web Storage API'); // 99%
      expect(sorted[1]?.name).toBe('IntersectionObserver'); // 97%
    });

    it('should sort by newest first', () => {
      const sorted = sortApis(testApis, 'newest');
      expect(sorted[0]?.yearStable).toBe(2023);
    });

    it('should sort by name alphabetically', () => {
      const sorted = sortApis(testApis, 'name');
      expect(sorted[0]?.name).toBe('IntersectionObserver');
      expect(sorted[sorted.length - 1]?.name).toBe('WebGPU');
    });

    // Boundary value tests
    it('should handle support without % suffix', () => {
      const apis: WebAPI[] = [
        { ...testApis[0]!, support: '99' },
        { ...testApis[1]!, support: '50' },
      ];
      const sorted = sortApis(apis, 'support');
      expect(Number.parseInt(sorted[0]!.support, 10)).toBe(99);
    });

    it('should handle support = "0%"', () => {
      const apis: WebAPI[] = [
        { ...testApis[0]!, support: '0%' },
        { ...testApis[1]!, support: '50%' },
      ];
      const sorted = sortApis(apis, 'support');
      expect(sorted[0]?.support).toBe('50%');
    });

    it('should handle support = "100%"', () => {
      const apis: WebAPI[] = [
        { ...testApis[0]!, support: '100%' },
        { ...testApis[1]!, support: '99%' },
      ];
      const sorted = sortApis(apis, 'support');
      expect(sorted[0]?.support).toBe('100%');
    });

    it('should handle negative support value', () => {
      const apis: WebAPI[] = [
        { ...testApis[0]!, support: '-10%' },
        { ...testApis[1]!, support: '50%' },
      ];
      const sorted = sortApis(apis, 'support');
      expect(sorted[0]?.support).toBe('50%');
    });

    // Boundary value tests for yearStable
    it('should handle undefined yearStable', () => {
      const apis: WebAPI[] = [
        { ...testApis[0]!, yearStable: undefined },
        { ...testApis[1]!, yearStable: 2023 },
      ];
      const sorted = sortApis(apis, 'newest');
      expect(sorted[0]?.yearStable).toBe(2023);
    });

    it('should handle yearStable = 0', () => {
      const apis: WebAPI[] = [
        { ...testApis[0]!, yearStable: 0 },
        { ...testApis[1]!, yearStable: 2023 },
      ];
      const sorted = sortApis(apis, 'newest');
      expect(sorted[0]?.yearStable).toBe(2023);
    });
  });

  describe('boundary value - Infinity/NaN', () => {
    it('should handle Infinity support', () => {
      const apis: WebAPI[] = [
        { ...testApis[0]!, support: 'Infinity' },
        { ...testApis[1]!, support: '99%' },
      ];
      expect(() => sortApis(apis, 'support')).not.toThrow();
    });

    it('should handle NaN in yearStable', () => {
      const apis: WebAPI[] = [
        { ...testApis[0]!, yearStable: Number.NaN },
        { ...testApis[1]!, yearStable: 2023 },
      ];
      expect(() => sortApis(apis, 'newest')).not.toThrow();
    });

    it('should handle MAX_SAFE_INTEGER in yearStable', () => {
      const apis: WebAPI[] = [
        { ...testApis[0]!, yearStable: Number.MAX_SAFE_INTEGER },
        { ...testApis[1]!, yearStable: 2023 },
      ];
      const sorted = sortApis(apis, 'newest');
      expect(sorted[0]?.yearStable).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should handle support with decimal', () => {
      const apis: WebAPI[] = [
        { ...testApis[0]!, support: '99.5%' },
        { ...testApis[1]!, support: '99.4%' },
      ];
      // parseInt truncates decimals
      const sorted = sortApis(apis, 'support');
      expect(Number.parseInt(sorted[0]!.support, 10)).toBe(99);
    });
  });

  describe('edge cases - empty arrays', () => {
    it('should handle empty API array', () => {
      expect(filterBySearch([], 'test')).toEqual([]);
      expect(filterByCategory([], 'Modern Web Platform')).toEqual([]);
      expect(filterByQuickFilter([], 'trending')).toEqual([]);
      expect(sortApis([], 'support')).toEqual([]);
    });

    it('should not mutate original array', () => {
      const original = [...testApis];
      sortApis(testApis, 'name');
      expect(testApis).toEqual(original);
    });
  });

  describe('security - MDN URL validation', () => {
    it('should contain only valid MDN URLs in test data', () => {
      for (const api of testApis) {
        expect(api.mdnUrl.startsWith('https://developer.mozilla.org/')).toBe(true);
      }
    });

    it('should handle API with malicious mdnUrl gracefully', () => {
      const maliciousApi: WebAPI = {
        ...testApis[0]!,
        mdnUrl: 'javascript:alert(1)',
      };
      // The filter functions don't validate URLs, they just filter
      // URL validation should happen at render time
      expect(() => filterBySearch([maliciousApi], 'test')).not.toThrow();
    });
  });
});
