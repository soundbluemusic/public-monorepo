import { cn } from '@soundblue/shared-react';
import {
  ChevronRight,
  Compass,
  Flame,
  Gamepad2,
  Globe,
  MessageSquare,
  Package,
  Palette,
  Radio,
  Rocket,
  Search,
  Shield,
  Sparkles,
  TestTube,
  Zap,
} from 'lucide-react';
import { type ReactNode, useMemo, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link, useNavigate } from 'react-router';
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

const trendingLibraries: { name: string; category: string; icon: ReactNode }[] = [
  { name: 'Bun', category: 'Runtime', icon: <Zap size={18} aria-hidden="true" /> },
  { name: 'Astro', category: 'Meta-framework', icon: <Rocket size={18} aria-hidden="true" /> },
  { name: 'shadcn/ui', category: 'UI', icon: <Palette size={18} aria-hidden="true" /> },
  {
    name: 'TanStack Query',
    category: 'Data Fetching',
    icon: <Radio size={18} aria-hidden="true" />,
  },
  { name: 'Vitest', category: 'Testing', icon: <TestTube size={18} aria-hidden="true" /> },
  { name: 'Zod', category: 'Type Safety', icon: <Shield size={18} aria-hidden="true" /> },
];

const trendingApis: { name: string; icon: ReactNode }[] = [
  { name: 'View Transitions API', icon: <Sparkles size={18} aria-hidden="true" /> },
  { name: 'WebGPU', icon: <Gamepad2 size={18} aria-hidden="true" /> },
  { name: 'Navigation API', icon: <Compass size={18} aria-hidden="true" /> },
  { name: 'Popover API', icon: <MessageSquare size={18} aria-hidden="true" /> },
];

export default function Home() {
  const { locale, localePath } = useI18n();
  const navigate = useNavigate();
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
    navigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${localePath('/libraries')}?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <DocsLayout>
      {/* Hero Section */}
      <div className="text-center py-12 md:py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium mb-6">
          <Flame size={16} aria-hidden="true" />
          <span>{locale === 'ko' ? '2025년 최신 기술 업데이트' : '2025 Latest Tech Updated'}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
          {locale === 'ko' ? '무료 웹개발 도구 모음' : 'Free Web Dev Tools'}
        </h1>

        <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
          {locale === 'ko'
            ? '100개 이상의 MIT 라이브러리와 58개 웹표준 API를 한눈에'
            : '100+ MIT licensed libraries and 58 Web Standard APIs at a glance'}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 md:gap-12 mb-8">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-[var(--accent-primary)]">100+</div>
            <div className="text-sm text-[var(--text-tertiary)]">
              {locale === 'ko' ? 'OSS 라이브러리' : 'OSS Libraries'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-[var(--accent-primary)]">58</div>
            <div className="text-sm text-[var(--text-tertiary)]">
              {locale === 'ko' ? '웹 표준 API' : 'Web APIs'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-[var(--accent-primary)]">13</div>
            <div className="text-sm text-[var(--text-tertiary)]">
              {locale === 'ko' ? '카테고리' : 'Categories'}
            </div>
          </div>
        </div>

        {/* Quick Search */}
        <div className="max-w-md mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            action={localePath('/libraries')}
            method="get"
            className="relative"
          >
            <Search
              size={18}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
            />
            <input
              type="text"
              name="q"
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
                if (e.key === 'Escape') {
                  setShowResults(false);
                }
              }}
              className="w-full min-h-12 pl-11 pr-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-focus)] transition-colors"
            />
            {/* Search Results Dropdown */}
            {showResults && filteredResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl shadow-lg z-50">
                {filteredResults.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleResultClick(item)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                  >
                    <span className="text-[var(--text-tertiary)]">
                      {item.type === 'library' ? (
                        <Package size={16} aria-hidden="true" />
                      ) : (
                        <Globe size={16} aria-hidden="true" />
                      )}
                    </span>
                    <span className="flex-1 text-[var(--text-primary)]">{item.name}</span>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        item.type === 'library'
                          ? 'bg-purple-500/10 text-purple-500'
                          : 'bg-blue-500/10 text-blue-500',
                      )}
                    >
                      {item.type === 'library' ? 'Library' : 'Web API'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>
          <p className="text-sm text-[var(--text-tertiary)] mt-2">
            {locale === 'ko' ? '실시간으로 검색됩니다' : 'Search results appear as you type'}
          </p>
        </div>
      </div>

      {/* Trending Section */}
      <div className="py-8">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <Flame size={20} aria-hidden="true" className="text-orange-500" />
          {locale === 'ko' ? '2025년 트렌딩' : 'Trending 2025'}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Trending Libraries */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
              Libraries
            </h3>
            <div className="space-y-2">
              {trendingLibraries.map((lib) => (
                <Link
                  key={lib.name}
                  to={`${localePath('/libraries')}?trending=true`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-primary)] no-underline transition-all hover:border-[var(--border-focus)] hover:shadow-sm group"
                >
                  <span className="text-[var(--accent-primary)]">{lib.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--text-primary)]">{lib.name}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">{lib.category}</div>
                  </div>
                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className="text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Web APIs */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
              Web APIs
            </h3>
            <div className="space-y-2">
              {trendingApis.map((api) => (
                <Link
                  key={api.name}
                  to={`${localePath('/web-api')}?trending=true`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-primary)] no-underline transition-all hover:border-[var(--border-focus)] hover:shadow-sm group"
                >
                  <span className="text-[var(--accent-primary)]">{api.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--text-primary)]">{api.name}</div>
                  </div>
                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className="text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Main Cards */}
      <div className="grid md:grid-cols-2 gap-4 py-8">
        {/* Web API Card */}
        <Link
          to={localePath('/web-api')}
          className="p-6 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] no-underline transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[var(--border-focus)] group"
        >
          <div className="text-blue-500 mb-4">
            <Globe size={32} aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Web API</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            {locale === 'ko'
              ? '브라우저 내장 API. 설치 없이 무료로 사용'
              : 'Browser built-in APIs. Free to use, no installation'}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-[var(--accent-primary)]">58</div>
            <div className="flex items-center gap-1 text-sm text-[var(--accent-primary)] font-medium">
              {locale === 'ko' ? '둘러보기' : 'Browse'}
              <ChevronRight
                size={16}
                aria-hidden="true"
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </Link>

        {/* Libraries Card */}
        <Link
          to={localePath('/libraries')}
          className="p-6 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] no-underline transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[var(--border-focus)] group"
        >
          <div className="text-purple-500 mb-4">
            <Package size={32} aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Libraries</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            {locale === 'ko'
              ? 'MIT 라이센스 오픈소스. 상업적 사용 가능'
              : 'MIT licensed open source. Free for commercial use'}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-[var(--accent-primary)]">100+</div>
            <div className="flex items-center gap-1 text-sm text-[var(--accent-primary)] font-medium">
              {locale === 'ko' ? '둘러보기' : 'Browse'}
              <ChevronRight
                size={16}
                aria-hidden="true"
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Categories */}
      <div className="py-8 text-center">
        <h3 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
          {locale === 'ko' ? '카테고리로 탐색' : 'Browse by Category'}
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
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
              className="px-4 py-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-sm font-medium no-underline transition-colors hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)]"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Built with section */}
      <div className="py-8 text-center border-t border-[var(--border-primary)]">
        <p className="text-sm text-[var(--text-tertiary)] mb-3">
          {locale === 'ko'
            ? '이 사이트도 여기 있는 도구로 만들었어요'
            : 'This site is built with tools listed here'}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {['React Router v7', 'React', 'Tailwind CSS', 'TypeScript', 'Vite'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </DocsLayout>
  );
}
