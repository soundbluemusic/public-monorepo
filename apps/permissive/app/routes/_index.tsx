import { useMemo, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  const title = isKorean ? 'Permissive - 무료 웹개발 도구 모음' : 'Permissive - Free Web Dev Tools';
  const description = isKorean
    ? '웹표준 API와 MIT 라이센스 라이브러리를 한눈에 보세요'
    : 'Web Standard APIs and MIT licensed libraries at a glance';

  return [{ title }, { name: 'description', content: description }];
};

// 검색용 데이터
const searchItems = [
  { name: 'React', type: 'library' as const },
  { name: 'Vue', type: 'library' as const },
  { name: 'Svelte', type: 'library' as const },
  { name: 'Next.js', type: 'library' as const },
  { name: 'Astro', type: 'library' as const },
  { name: 'Vite', type: 'library' as const },
  { name: 'Tailwind CSS', type: 'library' as const },
  { name: 'TypeScript', type: 'library' as const },
  { name: 'Zustand', type: 'library' as const },
  { name: 'TanStack Query', type: 'library' as const },
  { name: 'Zod', type: 'library' as const },
  { name: 'Vitest', type: 'library' as const },
  { name: 'Playwright', type: 'library' as const },
  { name: 'Framer Motion', type: 'library' as const },
  { name: 'shadcn/ui', type: 'library' as const },
  { name: 'Radix UI', type: 'library' as const },
  { name: 'Bun', type: 'library' as const },
  { name: 'Deno', type: 'library' as const },
  { name: 'esbuild', type: 'library' as const },
  { name: 'SWC', type: 'library' as const },
  { name: 'View Transitions API', type: 'api' as const },
  { name: 'WebGPU', type: 'api' as const },
  { name: 'Navigation API', type: 'api' as const },
  { name: 'Popover API', type: 'api' as const },
  { name: 'Fetch API', type: 'api' as const },
  { name: 'Web Storage', type: 'api' as const },
  { name: 'IndexedDB', type: 'api' as const },
  { name: 'Web Workers', type: 'api' as const },
  { name: 'Intersection Observer', type: 'api' as const },
  { name: 'Resize Observer', type: 'api' as const },
  { name: 'Canvas API', type: 'api' as const },
  { name: 'Web Audio', type: 'api' as const },
  { name: 'Geolocation', type: 'api' as const },
  { name: 'Clipboard API', type: 'api' as const },
];

const trendingLibraries = [
  { name: 'Bun', category: 'Runtime', emoji: '⚡' },
  { name: 'Astro', category: 'Meta-framework', emoji: '🚀' },
  { name: 'shadcn/ui', category: 'UI', emoji: '🎨' },
  { name: 'TanStack Query', category: 'Data Fetching', emoji: '📡' },
  { name: 'Vitest', category: 'Testing', emoji: '🧪' },
  { name: 'Zod', category: 'Type Safety', emoji: '🛡️' },
];

const trendingApis = [
  { name: 'View Transitions API', emoji: '✨' },
  { name: 'WebGPU', emoji: '🎮' },
  { name: 'Navigation API', emoji: '🧭' },
  { name: 'Popover API', emoji: '💬' },
];

export default function Home() {
  const { locale, localePath } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return searchItems.filter((item) => item.name.toLowerCase().includes(query)).slice(0, 8);
  }, [searchQuery]);

  const handleResultClick = (item: (typeof searchItems)[0]) => {
    const path =
      item.type === 'library'
        ? `${localePath('/libraries')}?q=${encodeURIComponent(item.name)}`
        : `${localePath('/web-api')}?q=${encodeURIComponent(item.name)}`;
    window.location.href = path;
  };

  return (
    <DocsLayout>
      {/* Hero Section - Enhanced */}
      <div className="text-center py-12 sm:py-16">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b' }}
        >
          <span className="text-xl">🔥</span>
          <span className="text-sm font-medium">
            {locale === 'ko' ? '2025년 최신 기술 업데이트' : '2025 Latest Tech Updated'}
          </span>
        </div>

        <h1
          className="text-4xl sm:text-6xl font-bold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {locale === 'ko' ? '무료 웹개발 도구 모음' : 'Free Web Dev Tools'}
        </h1>

        <p className="text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ko'
            ? '100개 이상의 MIT 라이브러리와 58개 웹표준 API를 한눈에'
            : '100+ MIT licensed libraries and 58 Web Standard APIs at a glance'}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: 'var(--accent-primary)' }}>
              100+
            </div>
            <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {locale === 'ko' ? 'OSS 라이브러리' : 'OSS Libraries'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: 'var(--accent-primary)' }}>
              58
            </div>
            <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {locale === 'ko' ? '웹 표준 API' : 'Web APIs'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: 'var(--accent-primary)' }}>
              13
            </div>
            <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {locale === 'ko' ? '카테고리' : 'Categories'}
            </div>
          </div>
        </div>

        {/* Quick Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <svg
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
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
              placeholder={
                locale === 'ko'
                  ? 'React, Vite, View Transitions... 검색'
                  : 'Search React, Vite, View Transitions...'
              }
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  window.location.href = `${localePath('/libraries')}?q=${encodeURIComponent(searchQuery)}`;
                }
                if (e.key === 'Escape') {
                  setShowResults(false);
                }
              }}
              className="w-full pl-12 pr-4 py-4 text-lg rounded-xl transition-all"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '2px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            />
            {/* Search Results Dropdown */}
            {showResults && filteredResults.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg overflow-hidden z-50"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                {filteredResults.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleResultClick(item)}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors hover:bg-[var(--bg-tertiary)]"
                  >
                    <span className="text-lg">{item.type === 'library' ? '📦' : '🌐'}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                    <span
                      className="ml-auto text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {item.type === 'library' ? 'Library' : 'Web API'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
            {locale === 'ko' ? '실시간으로 검색됩니다' : 'Search results appear as you type'}
          </p>
        </div>
      </div>

      {/* Trending Section */}
      <div className="mb-16">
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: 'var(--text-primary)' }}
        >
          <span className="mr-2">🔥</span>
          {locale === 'ko' ? '2025년 트렌딩' : 'Trending 2025'}
        </h2>

        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Trending Libraries */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
              Libraries
            </h3>
            <div className="space-y-2">
              {trendingLibraries.map((lib) => (
                <Link
                  key={lib.name}
                  to={`${localePath('/libraries')}?trending=true`}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <span className="text-2xl">{lib.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {lib.name}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      {lib.category}
                    </div>
                  </div>
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    style={{ color: 'var(--text-tertiary)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Web APIs */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
              Web APIs
            </h3>
            <div className="space-y-2">
              {trendingApis.map((api) => (
                <Link
                  key={api.name}
                  to={`${localePath('/web-api')}?trending=true`}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <span className="text-2xl">{api.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {api.name}
                    </div>
                  </div>
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    style={{ color: 'var(--text-tertiary)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Main Cards */}
      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
        {/* Web API Card */}
        <Link
          to={localePath('/web-api')}
          className="group relative p-8 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '2px solid var(--border-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
          }}
        >
          <div className="text-5xl mb-4">🌐</div>
          <h2
            className="text-2xl font-bold mb-2 transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            Web API
          </h2>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            {locale === 'ko'
              ? '브라우저 내장 API. 설치 없이 무료로 사용'
              : 'Browser built-in APIs. Free to use, no installation'}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
              58
            </div>
            <div
              className="flex items-center text-sm font-medium"
              style={{ color: 'var(--accent-primary)' }}
            >
              {locale === 'ko' ? '둘러보기' : 'Browse'}
              <svg
                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>

        {/* Libraries Card */}
        <Link
          to={localePath('/libraries')}
          className="group relative p-8 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '2px solid var(--border-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
          }}
        >
          <div className="text-5xl mb-4">📦</div>
          <h2
            className="text-2xl font-bold mb-2 transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            Libraries
          </h2>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            {locale === 'ko'
              ? 'MIT 라이센스 오픈소스. 상업적 사용 가능'
              : 'MIT licensed open source. Free for commercial use'}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
              100+
            </div>
            <div
              className="flex items-center text-sm font-medium"
              style={{ color: 'var(--accent-primary)' }}
            >
              {locale === 'ko' ? '둘러보기' : 'Browse'}
              <svg
                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Categories */}
      <div className="text-center mb-16">
        <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          {locale === 'ko' ? '카테고리로 탐색' : 'Browse by Category'}
        </h3>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {[
            'Meta-frameworks',
            'Build Tools',
            'State Management',
            'UI Components',
            'Testing',
            'Animation',
          ].map((cat) => (
            <Link
              key={cat}
              to={`${localePath('/libraries')}?category=${encodeURIComponent(cat)}`}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-secondary)',
              }}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Built with section */}
      <div className="mt-16 text-center">
        <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
          {locale === 'ko'
            ? '이 사이트도 여기 있는 도구로 만들었어요'
            : 'This site is built with tools listed here'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span
            className="px-3 py-1.5 rounded-full text-sm"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            React Router v7
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-sm"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            React
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-sm"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            Tailwind CSS
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-sm"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            TypeScript
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-sm"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            Vite
          </span>
        </div>
      </div>
    </DocsLayout>
  );
}
