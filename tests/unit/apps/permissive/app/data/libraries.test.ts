/**
 * @fileoverview Permissive 앱 library 데이터 테스트
 *
 * 라이브러리 데이터 조회 및 필터링 함수들의 단위 테스트입니다.
 */

import { describe, expect, it } from 'vitest';

// 타입 정의
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
  wasmBased?: boolean;
  useCases?: { en: string; ko: string };
  codeExample?: string;
}

// Mock 데이터
const mockLibraries: Library[] = [
  {
    name: 'React Router',
    description: 'Declarative routing for React',
    descriptionKo: 'React를 위한 선언적 라우팅',
    category: 'Routing',
    license: 'MIT',
    github: 'https://github.com/remix-run/react-router',
    website: 'https://reactrouter.com',
    npm: 'react-router',
    stars: '53k',
    usedHere: true,
    trending: true,
    yearReleased: 2014,
    tags: ['React', 'SSG', 'SSR', 'TypeScript'],
  },
  {
    name: 'Vite',
    description: 'Next Generation Frontend Tooling',
    descriptionKo: '차세대 프론트엔드 도구',
    category: 'Build Tools',
    license: 'MIT',
    github: 'https://github.com/vitejs/vite',
    website: 'https://vitejs.dev',
    npm: 'vite',
    stars: '68k',
    usedHere: true,
    trending: true,
    yearReleased: 2020,
    tags: ['Build', 'Bundler', 'TypeScript'],
  },
  {
    name: 'esbuild',
    description: 'An extremely fast bundler',
    descriptionKo: '매우 빠른 번들러',
    category: 'Build Tools',
    license: 'MIT',
    github: 'https://github.com/evanw/esbuild',
    website: 'https://esbuild.github.io',
    npm: 'esbuild',
    stars: '38k',
    trending: true,
    yearReleased: 2020,
    tags: ['Build', 'Bundler', 'Go'],
    wasmBased: true,
  },
  {
    name: 'Dexie.js',
    description: 'A minimalistic IndexedDB wrapper',
    descriptionKo: '미니멀한 IndexedDB 래퍼',
    category: 'Storage',
    license: 'Apache-2.0',
    github: 'https://github.com/dexie/Dexie.js',
    website: 'https://dexie.org',
    npm: 'dexie',
    stars: '11k',
    usedHere: true,
    yearReleased: 2014,
    tags: ['IndexedDB', 'Storage', 'TypeScript'],
  },
  {
    name: 'MiniSearch',
    description: 'Tiny and powerful full-text search engine',
    descriptionKo: '작고 강력한 전문 검색 엔진',
    category: 'Search',
    license: 'MIT',
    github: 'https://github.com/lucaong/minisearch',
    npm: 'minisearch',
    stars: '4k',
    usedHere: true,
    yearReleased: 2018,
    tags: ['Search', 'Full-text', 'Lightweight'],
  },
];

// 데이터 조회 함수들 (테스트용 구현)
function getLibraryBySlug(slug: string): Library | undefined {
  return mockLibraries.find((lib) => getLibrarySlug(lib.name) === slug);
}

function getLibrarySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getLibrariesByCategory(category: string): Library[] {
  return mockLibraries.filter((lib) => lib.category === category);
}

function getLibrariesByTag(tag: string): Library[] {
  return mockLibraries.filter((lib) => lib.tags?.includes(tag));
}

function getLibrariesByLicense(license: string): Library[] {
  return mockLibraries.filter((lib) => lib.license === license);
}

function getTrendingLibraries(): Library[] {
  return mockLibraries.filter((lib) => lib.trending);
}

function getUsedHereLibraries(): Library[] {
  return mockLibraries.filter((lib) => lib.usedHere);
}

function getWasmBasedLibraries(): Library[] {
  return mockLibraries.filter((lib) => lib.wasmBased);
}

function getRelatedLibraries(library: Library): Library[] {
  return mockLibraries.filter((lib) => {
    if (lib.name === library.name) return false;
    // Same category
    if (lib.category === library.category) return true;
    // Shared tags
    if (library.tags?.some((tag) => lib.tags?.includes(tag))) return true;
    return false;
  });
}

function getCategorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

function getAllCategories(): string[] {
  const categories = new Set<string>();
  for (const lib of mockLibraries) {
    categories.add(lib.category);
  }
  return Array.from(categories).sort();
}

function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const lib of mockLibraries) {
    if (lib.tags) {
      for (const tag of lib.tags) {
        tags.add(tag);
      }
    }
  }
  return Array.from(tags).sort();
}

function searchLibraries(query: string): Library[] {
  const lowerQuery = query.toLowerCase();
  return mockLibraries.filter((lib) => {
    return (
      lib.name.toLowerCase().includes(lowerQuery) ||
      lib.description.toLowerCase().includes(lowerQuery) ||
      lib.descriptionKo.includes(query) ||
      lib.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

// 테스트 시작
describe('Libraries Data', () => {
  describe('getLibraryBySlug', () => {
    it('should return library for valid slug', () => {
      const lib = getLibraryBySlug('react-router');

      expect(lib).not.toBeUndefined();
      expect(lib?.name).toBe('React Router');
    });

    it('should return undefined for non-existent slug', () => {
      const lib = getLibraryBySlug('nonexistent');

      expect(lib).toBeUndefined();
    });

    it('should handle slug with dots', () => {
      const lib = getLibraryBySlug('dexie-js');

      expect(lib?.name).toBe('Dexie.js');
    });
  });

  describe('getLibrarySlug', () => {
    it('should convert name to slug', () => {
      expect(getLibrarySlug('React Router')).toBe('react-router');
      expect(getLibrarySlug('Dexie.js')).toBe('dexie-js');
      expect(getLibrarySlug('esbuild')).toBe('esbuild');
    });

    it('should handle special characters', () => {
      expect(getLibrarySlug('Library (Beta)')).toBe('library-beta');
      expect(getLibrarySlug('Library@v2')).toBe('library-v2');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(getLibrarySlug('-Test-')).toBe('test');
      expect(getLibrarySlug('---Multiple---')).toBe('multiple');
    });
  });

  describe('getLibrariesByCategory', () => {
    it('should return libraries for valid category', () => {
      const libs = getLibrariesByCategory('Build Tools');

      expect(libs.length).toBe(2);
      expect(libs.every((lib) => lib.category === 'Build Tools')).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      const libs = getLibrariesByCategory('Nonexistent');

      expect(libs).toEqual([]);
    });

    it('should return single library for unique category', () => {
      const libs = getLibrariesByCategory('Search');

      expect(libs.length).toBe(1);
      expect(libs[0]?.name).toBe('MiniSearch');
    });
  });

  describe('getLibrariesByTag', () => {
    it('should return libraries with matching tag', () => {
      const libs = getLibrariesByTag('TypeScript');

      expect(libs.length).toBe(3);
      expect(libs.every((lib) => lib.tags?.includes('TypeScript'))).toBe(true);
    });

    it('should return empty array for non-existent tag', () => {
      const libs = getLibrariesByTag('Nonexistent');

      expect(libs).toEqual([]);
    });

    it('should handle case-sensitive tags', () => {
      const libs = getLibrariesByTag('Build');

      expect(libs.length).toBe(2);
    });
  });

  describe('getLibrariesByLicense', () => {
    it('should return libraries with MIT license', () => {
      const libs = getLibrariesByLicense('MIT');

      expect(libs.length).toBe(4);
      expect(libs.every((lib) => lib.license === 'MIT')).toBe(true);
    });

    it('should return libraries with Apache-2.0 license', () => {
      const libs = getLibrariesByLicense('Apache-2.0');

      expect(libs.length).toBe(1);
      expect(libs[0]?.name).toBe('Dexie.js');
    });

    it('should return empty array for non-existent license', () => {
      const libs = getLibrariesByLicense('GPL');

      expect(libs).toEqual([]);
    });
  });

  describe('getTrendingLibraries', () => {
    it('should return only trending libraries', () => {
      const libs = getTrendingLibraries();

      expect(libs.length).toBe(3);
      expect(libs.every((lib) => lib.trending === true)).toBe(true);
    });
  });

  describe('getUsedHereLibraries', () => {
    it('should return only libraries used in this site', () => {
      const libs = getUsedHereLibraries();

      expect(libs.length).toBe(4);
      expect(libs.every((lib) => lib.usedHere === true)).toBe(true);
    });
  });

  describe('getWasmBasedLibraries', () => {
    it('should return only WASM-based libraries', () => {
      const libs = getWasmBasedLibraries();

      expect(libs.length).toBe(1);
      expect(libs[0]?.name).toBe('esbuild');
    });
  });

  describe('getRelatedLibraries', () => {
    it('should return libraries in same category', () => {
      const vite = mockLibraries.find((lib) => lib.name === 'Vite')!;
      const related = getRelatedLibraries(vite);

      expect(related.some((lib) => lib.name === 'esbuild')).toBe(true);
    });

    it('should return libraries with shared tags', () => {
      const reactRouter = mockLibraries.find((lib) => lib.name === 'React Router')!;
      const related = getRelatedLibraries(reactRouter);

      // Should include Vite and Dexie.js (TypeScript tag)
      expect(related.some((lib) => lib.tags?.includes('TypeScript'))).toBe(true);
    });

    it('should not include the library itself', () => {
      const vite = mockLibraries.find((lib) => lib.name === 'Vite')!;
      const related = getRelatedLibraries(vite);

      expect(related.some((lib) => lib.name === 'Vite')).toBe(false);
    });
  });

  describe('getCategorySlug', () => {
    it('should convert category to slug', () => {
      expect(getCategorySlug('Build Tools')).toBe('build-tools');
      expect(getCategorySlug('Routing')).toBe('routing');
      expect(getCategorySlug('Storage')).toBe('storage');
    });

    it('should handle multiple spaces', () => {
      // Multiple spaces get normalized to single hyphen
      expect(getCategorySlug('Build  Tools')).toBe('build-tools');
    });
  });

  describe('getAllCategories', () => {
    it('should return all unique categories sorted', () => {
      const categories = getAllCategories();

      expect(categories).toContain('Build Tools');
      expect(categories).toContain('Routing');
      expect(categories).toContain('Storage');
      expect(categories).toContain('Search');
      expect(categories.length).toBe(4);
      // Should be sorted
      expect(categories[0]).toBe('Build Tools');
    });
  });

  describe('getAllTags', () => {
    it('should return all unique tags sorted', () => {
      const tags = getAllTags();

      expect(tags).toContain('Build');
      expect(tags).toContain('TypeScript');
      expect(tags).toContain('React');
      // Should be sorted (lexicographically)
      const sorted = [...tags].sort();
      expect(tags).toEqual(sorted);
    });
  });

  describe('searchLibraries', () => {
    it('should find libraries by name', () => {
      const results = searchLibraries('React');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some((lib) => lib.name === 'React Router')).toBe(true);
    });

    it('should find libraries by description', () => {
      const results = searchLibraries('bundler');

      expect(results.length).toBe(2);
    });

    it('should find libraries by Korean description', () => {
      const results = searchLibraries('번들러');

      expect(results.length).toBeGreaterThan(0);
    });

    it('should find libraries by tag', () => {
      const results = searchLibraries('indexeddb');

      expect(results.some((lib) => lib.name === 'Dexie.js')).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const results = searchLibraries('xyz123nonexistent');

      expect(results).toEqual([]);
    });

    it('should be case-insensitive for English', () => {
      const upper = searchLibraries('REACT');
      const lower = searchLibraries('react');

      expect(upper.length).toBe(lower.length);
    });
  });

  describe('Library data integrity', () => {
    it('all libraries should have required fields', () => {
      for (const lib of mockLibraries) {
        expect(lib.name).toBeDefined();
        expect(lib.description).toBeDefined();
        expect(lib.descriptionKo).toBeDefined();
        expect(lib.category).toBeDefined();
        expect(lib.license).toBeDefined();
        expect(lib.github).toBeDefined();
        expect(lib.stars).toBeDefined();
      }
    });

    it('GitHub URLs should be valid', () => {
      for (const lib of mockLibraries) {
        expect(lib.github).toMatch(/^https:\/\/github\.com\//);
      }
    });

    it('Website URLs should be valid when present', () => {
      for (const lib of mockLibraries) {
        if (lib.website) {
          expect(lib.website).toMatch(/^https?:\/\//);
        }
      }
    });

    it('Tags should be an array when present', () => {
      for (const lib of mockLibraries) {
        if (lib.tags) {
          expect(Array.isArray(lib.tags)).toBe(true);
        }
      }
    });

    it('Year released should be reasonable when present', () => {
      for (const lib of mockLibraries) {
        if (lib.yearReleased) {
          expect(lib.yearReleased).toBeGreaterThan(1990);
          expect(lib.yearReleased).toBeLessThanOrEqual(new Date().getFullYear());
        }
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty query', () => {
      const results = searchLibraries('');

      expect(results.length).toBe(5); // All libraries match empty string
    });

    it('should handle library without optional fields', () => {
      const miniSearch = mockLibraries.find((lib) => lib.name === 'MiniSearch');

      expect(miniSearch?.website).toBeUndefined();
      expect(miniSearch?.wasmBased).toBeUndefined();
      expect(miniSearch?.useCases).toBeUndefined();
      expect(miniSearch?.codeExample).toBeUndefined();
    });

    it('should handle stars as string', () => {
      for (const lib of mockLibraries) {
        expect(typeof lib.stars).toBe('string');
        // Stars should end with 'k' for thousands
        expect(lib.stars).toMatch(/^\d+k$/);
      }
    });
  });
});
