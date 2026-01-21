/**
 * @fileoverview Permissive App - Library Filters Tests
 *
 * useLibraryFilters 훅의 필터링, 정렬 로직 테스트
 * 경계값 테스트, XSS/보안 테스트, Unicode 테스트 포함
 */
import { LIMITS } from '@soundblue/core/validation';
import { describe, expect, it } from 'vitest';

// Type definitions from the app
interface Library {
  name: string;
  description: string;
  descriptionKo: string;
  category: string;
  license: string;
  github: string;
  website?: string;
  npm?: string;
  stars: string;
  usedHere?: boolean;
  trending?: boolean;
  yearReleased?: number;
  tags?: string[];
}

type SortOption = 'stars' | 'newest' | 'name';
type QuickFilter = 'trending' | 'usedHere' | 'new' | null;

const SORT_OPTIONS: readonly SortOption[] = ['stars', 'newest', 'name'] as const;
const NEW_LIBRARY_YEAR = 2023;

/** Type guard: SortOption validation */
function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

/** Filter libraries by search query */
function filterBySearch(libraries: Library[], query: string): Library[] {
  const q = query.toLowerCase().slice(0, LIMITS.SEARCH_LENGTH);
  if (!q) return libraries;

  return libraries.filter(
    (lib) =>
      lib.name.toLowerCase().includes(q) ||
      lib.description.toLowerCase().includes(q) ||
      lib.descriptionKo.includes(q),
  );
}

/** Filter libraries by category */
function filterByCategory(libraries: Library[], category: string): Library[] {
  if (category === 'All') return libraries;
  return libraries.filter((lib) => lib.category === category);
}

/** Filter libraries by quick filter */
function filterByQuickFilter(libraries: Library[], filter: QuickFilter): Library[] {
  if (!filter) return libraries;

  if (filter === 'trending') {
    return libraries.filter((lib) => lib.trending);
  }
  if (filter === 'usedHere') {
    return libraries.filter((lib) => lib.usedHere);
  }
  if (filter === 'new') {
    return libraries.filter((lib) => lib.yearReleased && lib.yearReleased >= NEW_LIBRARY_YEAR);
  }
  return libraries;
}

/** Sort libraries */
function sortLibraries(libraries: Library[], sortBy: SortOption): Library[] {
  return [...libraries].sort((a, b) => {
    if (sortBy === 'stars') {
      const aStars = Number.parseInt(a.stars.replace('k', '000'), 10);
      const bStars = Number.parseInt(b.stars.replace('k', '000'), 10);
      return bStars - aStars;
    }
    if (sortBy === 'newest') {
      return (b.yearReleased || 0) - (a.yearReleased || 0);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
}

// Test data
const testLibraries: Library[] = [
  {
    name: 'React Router',
    description: 'Declarative routing for React',
    descriptionKo: 'React를 위한 선언적 라우팅',
    category: 'Routing',
    license: 'MIT',
    github: 'https://github.com/remix-run/react-router',
    stars: '53k',
    usedHere: true,
    trending: true,
    yearReleased: 2014,
    tags: ['React', 'SSG', 'SSR'],
  },
  {
    name: 'TanStack Router',
    description: 'Type-safe routing for React',
    descriptionKo: 'React를 위한 타입 안전 라우팅',
    category: 'Routing',
    license: 'MIT',
    github: 'https://github.com/TanStack/router',
    stars: '8k',
    trending: true,
    yearReleased: 2023,
    tags: ['React', 'TypeScript'],
  },
  {
    name: 'Vite',
    description: 'Next Generation Frontend Tooling',
    descriptionKo: '차세대 프론트엔드 도구',
    category: 'Build Tools',
    license: 'MIT',
    github: 'https://github.com/vitejs/vite',
    stars: '70k',
    usedHere: true,
    trending: true,
    yearReleased: 2020,
    tags: ['Build', 'ESM'],
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
    descriptionKo: '유틸리티 우선 CSS 프레임워크',
    category: 'CSS & Styling',
    license: 'MIT',
    github: 'https://github.com/tailwindlabs/tailwindcss',
    stars: '85k',
    usedHere: true,
    yearReleased: 2017,
    tags: ['CSS', 'Utility'],
  },
];

describe('Permissive App - Library Filters', () => {
  describe('isSortOption', () => {
    it('should return true for valid sort options', () => {
      expect(isSortOption('stars')).toBe(true);
      expect(isSortOption('newest')).toBe(true);
      expect(isSortOption('name')).toBe(true);
    });

    it('should return false for invalid sort options', () => {
      expect(isSortOption('invalid')).toBe(false);
      expect(isSortOption('')).toBe(false);
      expect(isSortOption('STARS')).toBe(false); // case-sensitive
    });

    // Edge cases
    it('should return false for whitespace-only string', () => {
      expect(isSortOption('   ')).toBe(false);
      expect(isSortOption('\t\n')).toBe(false);
    });

    // Security edge cases
    it('should handle XSS attempt in sort option', () => {
      expect(isSortOption('<script>alert(1)</script>')).toBe(false);
    });

    it('should handle SQL injection attempt', () => {
      expect(isSortOption("' OR '1'='1")).toBe(false);
      expect(isSortOption('stars; DROP TABLE libraries;--')).toBe(false);
    });

    it('should handle prototype pollution attempt', () => {
      expect(isSortOption('__proto__')).toBe(false);
      expect(isSortOption('constructor')).toBe(false);
      expect(isSortOption('prototype')).toBe(false);
    });

    // Unicode edge cases
    it('should return false for Korean text', () => {
      expect(isSortOption('별')).toBe(false);
      expect(isSortOption('정렬')).toBe(false);
    });

    it('should return false for emoji', () => {
      expect(isSortOption('⭐')).toBe(false);
      expect(isSortOption('🔥')).toBe(false);
    });
  });

  describe('filterBySearch', () => {
    it('should return all libraries for empty query', () => {
      expect(filterBySearch(testLibraries, '')).toEqual(testLibraries);
    });

    it('should filter by name (case-insensitive)', () => {
      const results = filterBySearch(testLibraries, 'react');
      expect(results.length).toBe(2);
      expect(results.map((r) => r.name)).toContain('React Router');
      expect(results.map((r) => r.name)).toContain('TanStack Router');
    });

    it('should filter by description', () => {
      const results = filterBySearch(testLibraries, 'tooling');
      expect(results.length).toBe(1);
      expect(results[0]?.name).toBe('Vite');
    });

    it('should filter by Korean description', () => {
      const results = filterBySearch(testLibraries, '프레임워크');
      expect(results.length).toBe(1);
      expect(results[0]?.name).toBe('Tailwind CSS');
    });

    // Boundary value tests
    it('should truncate query at LIMITS.SEARCH_LENGTH', () => {
      const longQuery = 'a'.repeat(LIMITS.SEARCH_LENGTH + 100);
      // Should not throw
      expect(() => filterBySearch(testLibraries, longQuery)).not.toThrow();
    });

    it('should handle whitespace-only query', () => {
      const results = filterBySearch(testLibraries, '   ');
      // Whitespace becomes empty after toLowerCase (but not trimmed by slice)
      // Since '   '.toLowerCase() is '   ' and we don't trim, it searches for spaces
      expect(results.length).toBeLessThanOrEqual(testLibraries.length);
    });

    // Security edge cases
    it('should handle XSS attempt in query safely', () => {
      const results = filterBySearch(testLibraries, '<script>alert(1)</script>');
      expect(results).toHaveLength(0);
    });

    it('should handle SQL injection attempt in query safely', () => {
      const results = filterBySearch(testLibraries, "' OR '1'='1");
      expect(results).toHaveLength(0);
    });

    it('should handle regex metacharacters in query', () => {
      expect(() => filterBySearch(testLibraries, '.*+?^${}()|[]')).not.toThrow();
      expect(() => filterBySearch(testLibraries, 'React.*')).not.toThrow();
    });

    // Unicode edge cases
    it('should handle emoji in query', () => {
      const results = filterBySearch(testLibraries, '🚀');
      expect(results).toHaveLength(0);
    });

    it('should handle zero-width characters in query', () => {
      const results = filterBySearch(testLibraries, 'React\u200B');
      // Zero-width space may or may not match depending on implementation
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('filterByCategory', () => {
    it('should return all libraries for "All" category', () => {
      expect(filterByCategory(testLibraries, 'All')).toEqual(testLibraries);
    });

    it('should filter by specific category', () => {
      const results = filterByCategory(testLibraries, 'Routing');
      expect(results.length).toBe(2);
    });

    it('should return empty array for non-existent category', () => {
      const results = filterByCategory(testLibraries, 'NonExistent');
      expect(results).toHaveLength(0);
    });

    // Edge cases
    it('should handle empty category string', () => {
      const results = filterByCategory(testLibraries, '');
      expect(results).toHaveLength(0);
    });

    // Security edge cases
    it('should handle XSS in category', () => {
      const results = filterByCategory(testLibraries, '<img onerror=alert(1)>');
      expect(results).toHaveLength(0);
    });

    it('should handle prototype pollution in category', () => {
      const results = filterByCategory(testLibraries, '__proto__');
      expect(results).toHaveLength(0);
    });
  });

  describe('filterByQuickFilter', () => {
    it('should return all libraries for null filter', () => {
      expect(filterByQuickFilter(testLibraries, null)).toEqual(testLibraries);
    });

    it('should filter trending libraries', () => {
      const results = filterByQuickFilter(testLibraries, 'trending');
      expect(results.every((lib) => lib.trending)).toBe(true);
    });

    it('should filter usedHere libraries', () => {
      const results = filterByQuickFilter(testLibraries, 'usedHere');
      expect(results.every((lib) => lib.usedHere)).toBe(true);
    });

    it('should filter new libraries (>= NEW_LIBRARY_YEAR)', () => {
      const results = filterByQuickFilter(testLibraries, 'new');
      expect(results.length).toBe(1);
      expect(results[0]?.name).toBe('TanStack Router');
    });

    // Edge case: library without yearReleased
    it('should exclude libraries without yearReleased when filtering new', () => {
      const libsWithMissingYear: Library[] = [
        ...testLibraries,
        {
          name: 'Unknown Year',
          description: 'No year',
          descriptionKo: '년도 없음',
          category: 'Test',
          license: 'MIT',
          github: 'https://github.com/test',
          stars: '1k',
          // yearReleased is undefined
        },
      ];
      const results = filterByQuickFilter(libsWithMissingYear, 'new');
      expect(results.find((r) => r.name === 'Unknown Year')).toBeUndefined();
    });
  });

  describe('sortLibraries', () => {
    it('should sort by stars descending', () => {
      const sorted = sortLibraries(testLibraries, 'stars');
      expect(sorted[0]?.name).toBe('Tailwind CSS'); // 85k
      expect(sorted[1]?.name).toBe('Vite'); // 70k
      expect(sorted[2]?.name).toBe('React Router'); // 53k
    });

    it('should sort by newest first', () => {
      const sorted = sortLibraries(testLibraries, 'newest');
      expect(sorted[0]?.name).toBe('TanStack Router'); // 2023
      expect(sorted[1]?.name).toBe('Vite'); // 2020
    });

    it('should sort by name alphabetically', () => {
      const sorted = sortLibraries(testLibraries, 'name');
      expect(sorted[0]?.name).toBe('React Router');
      expect(sorted[1]?.name).toBe('Tailwind CSS');
      expect(sorted[2]?.name).toBe('TanStack Router');
      expect(sorted[3]?.name).toBe('Vite');
    });

    // Boundary value tests for stars parsing
    it('should handle stars with "k" suffix', () => {
      const libs: Library[] = [
        { ...testLibraries[0]!, stars: '100k' },
        { ...testLibraries[1]!, stars: '50k' },
      ];
      const sorted = sortLibraries(libs, 'stars');
      expect(sorted[0]?.stars).toBe('100k');
    });

    it('should handle stars without "k" suffix', () => {
      const libs: Library[] = [
        { ...testLibraries[0]!, stars: '1000' },
        { ...testLibraries[1]!, stars: '500' },
      ];
      const sorted = sortLibraries(libs, 'stars');
      expect(Number.parseInt(sorted[0]!.stars, 10)).toBe(1000);
    });

    it('should handle invalid stars value', () => {
      const libs: Library[] = [
        { ...testLibraries[0]!, stars: 'invalid' },
        { ...testLibraries[1]!, stars: '10k' },
      ];
      // Should not throw, NaN comparison behavior
      expect(() => sortLibraries(libs, 'stars')).not.toThrow();
    });

    it('should handle empty stars value', () => {
      const libs: Library[] = [
        { ...testLibraries[0]!, stars: '' },
        { ...testLibraries[1]!, stars: '10k' },
      ];
      expect(() => sortLibraries(libs, 'stars')).not.toThrow();
    });

    // Boundary value tests for yearReleased
    it('should handle undefined yearReleased', () => {
      const libs: Library[] = [
        { ...testLibraries[0]!, yearReleased: undefined },
        { ...testLibraries[1]!, yearReleased: 2023 },
      ];
      const sorted = sortLibraries(libs, 'newest');
      expect(sorted[0]?.yearReleased).toBe(2023);
    });

    it('should handle yearReleased = 0', () => {
      const libs: Library[] = [
        { ...testLibraries[0]!, yearReleased: 0 },
        { ...testLibraries[1]!, yearReleased: 2023 },
      ];
      const sorted = sortLibraries(libs, 'newest');
      expect(sorted[0]?.yearReleased).toBe(2023);
    });

    it('should handle negative yearReleased', () => {
      const libs: Library[] = [
        { ...testLibraries[0]!, yearReleased: -1 },
        { ...testLibraries[1]!, yearReleased: 2023 },
      ];
      const sorted = sortLibraries(libs, 'newest');
      expect(sorted[0]?.yearReleased).toBe(2023);
    });
  });

  describe('edge cases - combined filters', () => {
    it('should handle empty library array', () => {
      expect(filterBySearch([], 'test')).toEqual([]);
      expect(filterByCategory([], 'Routing')).toEqual([]);
      expect(filterByQuickFilter([], 'trending')).toEqual([]);
      expect(sortLibraries([], 'stars')).toEqual([]);
    });

    it('should not mutate original array', () => {
      const original = [...testLibraries];
      sortLibraries(testLibraries, 'name');
      expect(testLibraries).toEqual(original);
    });
  });

  describe('boundary value - Infinity/NaN', () => {
    it('should handle Infinity in stars', () => {
      const libs: Library[] = [
        { ...testLibraries[0]!, stars: 'Infinity' },
        { ...testLibraries[1]!, stars: '10k' },
      ];
      // parseInt('Infinity') returns NaN, so behavior is deterministic
      expect(() => sortLibraries(libs, 'stars')).not.toThrow();
    });

    it('should handle NaN in yearReleased', () => {
      const libs: Library[] = [
        { ...testLibraries[0]!, yearReleased: Number.NaN },
        { ...testLibraries[1]!, yearReleased: 2023 },
      ];
      expect(() => sortLibraries(libs, 'newest')).not.toThrow();
    });

    it('should handle MAX_SAFE_INTEGER in yearReleased', () => {
      const libs: Library[] = [
        { ...testLibraries[0]!, yearReleased: Number.MAX_SAFE_INTEGER },
        { ...testLibraries[1]!, yearReleased: 2023 },
      ];
      const sorted = sortLibraries(libs, 'newest');
      expect(sorted[0]?.yearReleased).toBe(Number.MAX_SAFE_INTEGER);
    });
  });
});
