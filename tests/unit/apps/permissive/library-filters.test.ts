import type { Library } from '../../../../apps/permissive/app/data/libraries';
import { filterLibraries } from '../../../../apps/permissive/app/lib/library-filters';
import { LIMITS } from '@soundblue/core/validation';
import { describe, expect, it } from 'vitest';

const libraries: Library[] = [
  {
    name: 'React Router',
    description: 'Declarative routing for React',
    descriptionKo: 'React를 위한 선언적 라우팅',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/remix-run/react-router',
    stars: '53k',
    tags: ['React', 'SSR'],
  },
  {
    name: 'Vite',
    description: 'Next generation frontend tooling',
    descriptionKo: '차세대 프론트엔드 도구',
    categories: ['Build Tools'],
    license: 'MIT',
    github: 'https://github.com/vitejs/vite',
    stars: '70k',
    tags: ['Build', 'ESM'],
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
    descriptionKo: '유틸리티 우선 CSS 프레임워크',
    categories: ['CSS & Styling', 'Build Tools'],
    license: 'MIT',
    github: 'https://github.com/tailwindlabs/tailwindcss',
    stars: '85k',
    tags: ['CSS', 'Utility'],
  },
];

describe('filterLibraries', () => {
  it('returns all libraries without filters', () => {
    expect(filterLibraries(libraries, {})).toEqual(libraries);
  });

  it('matches English and Korean text without case sensitivity', () => {
    expect(filterLibraries(libraries, { query: 'REACT' }).map(({ name }) => name)).toEqual([
      'React Router',
    ]);
    expect(filterLibraries(libraries, { query: '프레임워크' }).map(({ name }) => name)).toEqual([
      'Tailwind CSS',
    ]);
  });

  it('matches tags and all assigned categories', () => {
    expect(filterLibraries(libraries, { query: 'esm' }).map(({ name }) => name)).toEqual(['Vite']);
    expect(
      filterLibraries(libraries, { category: 'Build Tools' }).map(({ name }) => name),
    ).toEqual(['Vite', 'Tailwind CSS']);
  });

  it('combines category and search filters', () => {
    expect(
      filterLibraries(libraries, { category: 'Build Tools', query: 'css' }).map(
        ({ name }) => name,
      ),
    ).toEqual(['Tailwind CSS']);
  });

  it('trims and bounds untrusted search input', () => {
    expect(filterLibraries(libraries, { query: '  vite  ' }).map(({ name }) => name)).toEqual([
      'Vite',
    ]);
    expect(() =>
      filterLibraries(libraries, { query: 'a'.repeat(LIMITS.SEARCH_LENGTH + 100) }),
    ).not.toThrow();
    expect(filterLibraries(libraries, { query: '<script>alert(1)</script>' })).toEqual([]);
  });

  it('does not mutate the source array', () => {
    const original = [...libraries];
    filterLibraries(libraries, { query: 'react' });
    expect(libraries).toEqual(original);
  });
});
