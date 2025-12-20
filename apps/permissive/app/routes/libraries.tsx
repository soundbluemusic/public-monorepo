import { useMemo, useState } from 'react';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';

interface Library {
  name: string;
  description: string;
  descriptionKo: string;
  category: string;
  license: string;
  github: string;
  npm?: string;
  stars: string;
  usedHere?: boolean;
}

const libraries: Library[] = [
  // Frameworks
  {
    name: 'React',
    description: 'A JavaScript library for building user interfaces',
    descriptionKo: '사용자 인터페이스 구축을 위한 자바스크립트 라이브러리',
    category: 'Frameworks',
    license: 'MIT',
    github: 'https://github.com/facebook/react',
    npm: 'react',
    stars: '220k',
    usedHere: true,
  },
  {
    name: 'Vue',
    description: 'Progressive JavaScript framework',
    descriptionKo: '점진적 자바스크립트 프레임워크',
    category: 'Frameworks',
    license: 'MIT',
    github: 'https://github.com/vuejs/core',
    npm: 'vue',
    stars: '207k',
  },
  {
    name: 'Svelte',
    description: 'Cybernetically enhanced web apps',
    descriptionKo: '사이버네틱하게 향상된 웹 앱',
    category: 'Frameworks',
    license: 'MIT',
    github: 'https://github.com/sveltejs/svelte',
    npm: 'svelte',
    stars: '79k',
  },
  // State Management
  {
    name: 'Zustand',
    description: 'Small, fast state-management',
    descriptionKo: '작고 빠른 상태 관리',
    category: 'State',
    license: 'MIT',
    github: 'https://github.com/pmndrs/zustand',
    npm: 'zustand',
    stars: '47k',
    usedHere: true,
  },
  {
    name: 'Jotai',
    description: 'Primitive and flexible state',
    descriptionKo: '원시적이고 유연한 상태 관리',
    category: 'State',
    license: 'MIT',
    github: 'https://github.com/pmndrs/jotai',
    npm: 'jotai',
    stars: '18k',
  },
  // Styling
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
    descriptionKo: '유틸리티 우선 CSS 프레임워크',
    category: 'Styling',
    license: 'MIT',
    github: 'https://github.com/tailwindlabs/tailwindcss',
    npm: 'tailwindcss',
    stars: '82k',
    usedHere: true,
  },
  // Build Tools
  {
    name: 'Vite',
    description: 'Next generation frontend tooling',
    descriptionKo: '차세대 프론트엔드 도구',
    category: 'Build',
    license: 'MIT',
    github: 'https://github.com/vitejs/vite',
    npm: 'vite',
    stars: '68k',
    usedHere: true,
  },
  // UI Components
  {
    name: 'Radix UI',
    description: 'Unstyled, accessible components',
    descriptionKo: '스타일 없는 접근성 컴포넌트',
    category: 'UI',
    license: 'MIT',
    github: 'https://github.com/radix-ui/primitives',
    npm: '@radix-ui/react-dialog',
    stars: '16k',
    usedHere: true,
  },
  {
    name: 'shadcn/ui',
    description: 'Re-usable components built with Radix',
    descriptionKo: 'Radix로 만든 재사용 컴포넌트',
    category: 'UI',
    license: 'MIT',
    github: 'https://github.com/shadcn-ui/ui',
    stars: '74k',
  },
];

const categories = ['All', 'Frameworks', 'State', 'Styling', 'Build', 'UI'] as const;
type CategoryFilter = (typeof categories)[number];

export function meta() {
  return [
    { title: 'Libraries - Permissive' },
    { name: 'description', content: 'MIT licensed open source libraries' },
  ];
}

export default function LibrariesPage() {
  const { locale } = useI18n();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');

  const filteredLibraries = useMemo(() => {
    let libs = libraries;
    if (category !== 'All') {
      libs = libs.filter((lib) => lib.category === category);
    }
    const q = search.toLowerCase().slice(0, 100);
    if (q) {
      libs = libs.filter(
        (lib) =>
          lib.name.toLowerCase().includes(q) ||
          lib.description.toLowerCase().includes(q) ||
          lib.descriptionKo.includes(q),
      );
    }
    return libs;
  }, [search, category]);

  const groupedLibraries = useMemo(() => {
    if (category !== 'All') {
      return { [category]: filteredLibraries };
    }
    return filteredLibraries.reduce<Record<string, Library[]>>((acc, lib) => {
      if (!acc[lib.category]) acc[lib.category] = [];
      acc[lib.category].push(lib);
      return acc;
    }, {});
  }, [filteredLibraries, category]);

  return (
    <DocsLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Libraries
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ko'
            ? 'MIT 라이센스 오픈소스. 상업적 사용 가능'
            : 'MIT licensed open source. Free for commercial use'}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <svg
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--text-tertiary)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder={locale === 'ko' ? '라이브러리 검색...' : 'Search libraries...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl transition-all"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: category === cat ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: category === cat ? 'white' : 'var(--text-secondary)',
              }}
            >
              {cat === 'All' ? (locale === 'ko' ? '전체' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
        {filteredLibraries.length} {locale === 'ko' ? '개의 라이브러리' : 'libraries'}
      </div>

      {/* Library List */}
      <div className="space-y-8">
        {Object.entries(groupedLibraries).map(([categoryName, libs]) => (
          <section key={categoryName}>
            <h2
              className="text-lg font-semibold mb-4 pb-2"
              style={{
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border-primary)',
              }}
            >
              {categoryName}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {libs.map((lib) => (
                <div
                  key={lib.name}
                  className="group p-4 rounded-xl transition-all hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {lib.name}
                      </h3>
                      {lib.usedHere && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: 'rgba(176, 136, 48, 0.15)',
                            color: 'var(--color-warning)',
                          }}
                        >
                          {locale === 'ko' ? '사용 중' : 'Used here'}
                        </span>
                      )}
                    </div>
                    <div
                      className="flex items-center gap-2 text-xs"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {lib.stars}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {locale === 'ko' ? lib.descriptionKo : lib.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="badge-mit">{lib.license}</span>
                    <a
                      href={lib.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-(--accent-primary)"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      GitHub
                    </a>
                    {lib.npm && (
                      <a
                        href={`https://www.npmjs.com/package/${lib.npm}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-(--accent-primary)"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        npm
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty state */}
      {filteredLibraries.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p style={{ color: 'var(--text-tertiary)' }}>
            {locale === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
          </p>
        </div>
      )}
    </DocsLayout>
  );
}
