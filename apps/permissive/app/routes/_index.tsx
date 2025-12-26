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
import styles from '../styles/app.module.scss';

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
      {/* Hero Section - Enhanced */}
      <div className={styles.heroSection}>
        <div className={styles.heroBadge}>
          <Flame size={16} aria-hidden="true" className={styles.heroBadgeEmoji} />
          <span className={styles.heroBadgeText}>
            {locale === 'ko' ? '2025년 최신 기술 업데이트' : '2025 Latest Tech Updated'}
          </span>
        </div>

        <h1 className={styles.heroTitle}>
          {locale === 'ko' ? '무료 웹개발 도구 모음' : 'Free Web Dev Tools'}
        </h1>

        <p className={styles.heroSubtitle}>
          {locale === 'ko'
            ? '100개 이상의 MIT 라이브러리와 58개 웹표준 API를 한눈에'
            : '100+ MIT licensed libraries and 58 Web Standard APIs at a glance'}
        </p>

        {/* Stats */}
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>100+</div>
            <div className={styles.statLabel}>
              {locale === 'ko' ? 'OSS 라이브러리' : 'OSS Libraries'}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>58</div>
            <div className={styles.statLabel}>{locale === 'ko' ? '웹 표준 API' : 'Web APIs'}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>13</div>
            <div className={styles.statLabel}>{locale === 'ko' ? '카테고리' : 'Categories'}</div>
          </div>
        </div>

        {/* Quick Search */}
        <div className={styles.searchContainer}>
          <form
            onSubmit={handleSearchSubmit}
            action={localePath('/libraries')}
            method="get"
            className={styles.searchForm}
          >
            <svg
              aria-hidden="true"
              className={styles.searchIcon}
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
              className={styles.searchInput}
            />
            {/* Search Results Dropdown */}
            {showResults && filteredResults.length > 0 && (
              <div className={styles.searchResults}>
                {filteredResults.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleResultClick(item)}
                    className={styles.searchResultItem}
                  >
                    <span className={styles.searchResultEmoji}>
                      {item.type === 'library' ? (
                        <Package size={16} aria-hidden="true" />
                      ) : (
                        <Globe size={16} aria-hidden="true" />
                      )}
                    </span>
                    <span className={styles.searchResultName}>{item.name}</span>
                    <span className={styles.searchResultType}>
                      {item.type === 'library' ? 'Library' : 'Web API'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>
          <p className={styles.searchHint}>
            {locale === 'ko' ? '실시간으로 검색됩니다' : 'Search results appear as you type'}
          </p>
        </div>
      </div>

      {/* Trending Section */}
      <div className={styles.sectionLarge}>
        <h2 className={styles.sectionTitle}>
          <Flame size={20} aria-hidden="true" style={{ marginRight: '0.5rem' }} />
          {locale === 'ko' ? '2025년 트렌딩' : 'Trending 2025'}
        </h2>

        <div className={styles.trendingGrid}>
          {/* Trending Libraries */}
          <div>
            <h3 className={styles.sectionSubtitle}>Libraries</h3>
            <div className={styles.spaceY2}>
              {trendingLibraries.map((lib) => (
                <Link
                  key={lib.name}
                  to={`${localePath('/libraries')}?trending=true`}
                  className={styles.trendingItem}
                >
                  <span className={styles.trendingEmoji}>{lib.icon}</span>
                  <div className={styles.trendingContent}>
                    <div className={styles.trendingName}>{lib.name}</div>
                    <div className={styles.trendingCategory}>{lib.category}</div>
                  </div>
                  <ChevronRight size={16} aria-hidden="true" className={styles.trendingArrow} />
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Web APIs */}
          <div>
            <h3 className={styles.sectionSubtitle}>Web APIs</h3>
            <div className={styles.spaceY2}>
              {trendingApis.map((api) => (
                <Link
                  key={api.name}
                  to={`${localePath('/web-api')}?trending=true`}
                  className={styles.trendingItem}
                >
                  <span className={styles.trendingEmoji}>{api.icon}</span>
                  <div className={styles.trendingContent}>
                    <div className={styles.trendingName}>{api.name}</div>
                  </div>
                  <ChevronRight size={16} aria-hidden="true" className={styles.trendingArrow} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Main Cards */}
      <div className={styles.cardsGrid}>
        {/* Web API Card */}
        <Link to={localePath('/web-api')} className={styles.card}>
          <div className={styles.cardEmoji}>
            <Globe size={32} aria-hidden="true" />
          </div>
          <h2 className={styles.cardTitle}>Web API</h2>
          <p className={styles.cardDescription}>
            {locale === 'ko'
              ? '브라우저 내장 API. 설치 없이 무료로 사용'
              : 'Browser built-in APIs. Free to use, no installation'}
          </p>
          <div className={styles.cardFooter}>
            <div className={styles.cardNumber}>58</div>
            <div className={styles.cardLink}>
              {locale === 'ko' ? '둘러보기' : 'Browse'}
              <ChevronRight size={16} aria-hidden="true" className={styles.cardLinkArrow} />
            </div>
          </div>
        </Link>

        {/* Libraries Card */}
        <Link to={localePath('/libraries')} className={styles.card}>
          <div className={styles.cardEmoji}>
            <Package size={32} aria-hidden="true" />
          </div>
          <h2 className={styles.cardTitle}>Libraries</h2>
          <p className={styles.cardDescription}>
            {locale === 'ko'
              ? 'MIT 라이센스 오픈소스. 상업적 사용 가능'
              : 'MIT licensed open source. Free for commercial use'}
          </p>
          <div className={styles.cardFooter}>
            <div className={styles.cardNumber}>100+</div>
            <div className={styles.cardLink}>
              {locale === 'ko' ? '둘러보기' : 'Browse'}
              <ChevronRight size={16} aria-hidden="true" className={styles.cardLinkArrow} />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Categories */}
      <div className={`${styles.sectionLarge} ${styles.textCenter}`}>
        <h3 className={`${styles.sectionSubtitle} ${styles.mb6}`}>
          {locale === 'ko' ? '카테고리로 탐색' : 'Browse by Category'}
        </h3>
        <div className={styles.categoryPills}>
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
              className={styles.categoryPill}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Built with section */}
      <div className={styles.builtWith}>
        <p className={styles.builtWithLabel}>
          {locale === 'ko'
            ? '이 사이트도 여기 있는 도구로 만들었어요'
            : 'This site is built with tools listed here'}
        </p>
        <div className={styles.builtWithTags}>
          <span className={styles.builtWithTag}>React Router v7</span>
          <span className={styles.builtWithTag}>React</span>
          <span className={styles.builtWithTag}>SCSS Modules</span>
          <span className={styles.builtWithTag}>TypeScript</span>
          <span className={styles.builtWithTag}>Vite</span>
        </div>
      </div>
    </DocsLayout>
  );
}
