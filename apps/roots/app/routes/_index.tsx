/**
 * @fileoverview 홈페이지 컴포넌트 - Apple 스타일 미니멀 디자인
 */

import { cn, type SearchResult, useSearchWorker } from '@soundblue/shared-react';
import { BookOpen, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link, useNavigate } from 'react-router';
import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';
import { preloadSearchIndex } from '@/lib/search';

export const meta: MetaFunction = ({ location }) => {
  const locale = location.pathname.startsWith('/ko') ? 'ko' : 'en';
  const title = locale === 'ko' ? '수리 - 수학 문서' : 'Roots - Math Documentation';
  const description =
    locale === 'ko' ? '누구나 쉽게 배우는 수학 개념 사전' : 'Learn math concepts easily';
  return [{ title }, { name: 'description', content: description }];
};

// Featured card color classes mapping
const featuredCardColors = {
  blue: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20',
  purple: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20',
  green: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20',
  orange: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20',
  red: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20',
  pink: 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20',
  teal: 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/20',
  indigo: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20',
} as const;

type FeaturedCardColor = keyof typeof featuredCardColors;

// 대표 개념 (Featured Concepts)
const FEATURED_CONCEPTS: ReadonlyArray<{
  id: string;
  icon: string;
  nameKo: string;
  nameEn: string;
  descKo: string;
  descEn: string;
  colorClass: FeaturedCardColor;
}> = [
  {
    id: 'pythagorean-theorem',
    icon: '△',
    nameKo: '피타고라스 정리',
    nameEn: 'Pythagorean Theorem',
    descKo: '직각삼각형의 세 변의 관계',
    descEn: 'Relationship between sides of right triangles',
    colorClass: 'blue',
  },
  {
    id: 'derivative',
    icon: '∂',
    nameKo: '미분',
    nameEn: 'Derivative',
    descKo: '변화율과 접선의 기울기',
    descEn: 'Rate of change and slope of tangent',
    colorClass: 'purple',
  },
  {
    id: 'limit',
    icon: '→',
    nameKo: '극한',
    nameEn: 'Limit',
    descKo: '무한히 가까워지는 값',
    descEn: 'Value approached infinitely',
    colorClass: 'green',
  },
  {
    id: 'matrices-basics',
    icon: '⊗',
    nameKo: '행렬',
    nameEn: 'Matrix',
    descKo: '수를 직사각형 배열로 나타낸 구조',
    descEn: 'Rectangular array of numbers',
    colorClass: 'orange',
  },
  {
    id: 'prime-numbers',
    icon: 'ℕ',
    nameKo: '소수',
    nameEn: 'Prime Numbers',
    descKo: '1과 자기 자신만으로 나누어지는 수',
    descEn: 'Numbers divisible only by 1 and itself',
    colorClass: 'red',
  },
  {
    id: 'complex-numbers',
    icon: 'ℂ',
    nameKo: '복소수',
    nameEn: 'Complex Numbers',
    descKo: '실수와 허수의 합',
    descEn: 'Sum of real and imaginary numbers',
    colorClass: 'pink',
  },
  {
    id: 'vectors-basics',
    icon: '➡',
    nameKo: '벡터',
    nameEn: 'Vectors',
    descKo: '크기와 방향을 가진 양',
    descEn: 'Quantity with magnitude and direction',
    colorClass: 'teal',
  },
  {
    id: 'probability-basics',
    icon: '⁝',
    nameKo: '확률',
    nameEn: 'Probability',
    descKo: '사건이 일어날 가능성',
    descEn: 'Likelihood of an event occurring',
    colorClass: 'indigo',
  },
];

export default function HomePage() {
  const { locale, localePath, t } = useI18n();
  const navigate = useNavigate();

  // Search state
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Real-time search with Fuse.js
  const { query, setQuery, results, isLoading } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: 8,
  });

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      const item = result.item;
      navigate(localePath(`/concept/${item.id}`));
      setShowResults(false);
      setQuery('');
    },
    [navigate, localePath, setQuery],
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleResultClick(results[selectedIndex]);
    } else if (query.trim()) {
      navigate(`${localePath('/browse')}?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // 검색 인덱스 프리로드
  useEffect(() => {
    preloadSearchIndex();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center py-12 mb-8">
        <h1 className="text-4xl font-bold text-(--text-primary) mb-3">{t('logoText')}</h1>
        <p className="text-lg text-(--text-secondary) mb-8">{t('heroSubtitle')}</p>

        {/* Quick Search */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={18}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder={
                locale === 'ko'
                  ? '개념 검색... (예: 미분, 행렬)'
                  : 'Search concepts... (e.g., derivative, matrix)'
              }
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
                setSelectedIndex(-1);
              }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-12 pl-11 pr-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-none focus:border-(--border-focus) transition-colors"
              aria-expanded={showResults && results.length > 0}
              aria-haspopup="listbox"
              aria-controls="search-results"
              role="combobox"
              autoComplete="off"
            />
            {/* Loading indicator */}
            {isLoading && query.trim() && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-(--text-tertiary) border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {/* Search Results Dropdown */}
            {showResults && results.length > 0 && (
              <ul
                id="search-results"
                className="absolute top-full left-0 right-0 mt-2 py-2 bg-(--bg-elevated) border border-(--border-primary) rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto text-left"
              >
                {results.map((result, index) => {
                  const item = result.item;
                  const name = locale === 'ko' ? item.name.ko : item.name.en;
                  const isSelected = index === selectedIndex;
                  return (
                    <li key={item.id} aria-selected={isSelected}>
                      <button
                        type="button"
                        onClick={() => handleResultClick(result)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer',
                          isSelected ? 'bg-(--bg-tertiary)' : 'hover:bg-(--bg-tertiary)',
                        )}
                      >
                        <span className="text-(--text-tertiary)">
                          <BookOpen size={16} aria-hidden="true" />
                        </span>
                        <span className="flex-1 text-(--text-primary) font-medium">{name}</span>
                        {item.field && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-(--accent-primary)/10 text-(--accent-primary)">
                            {item.field}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {/* No results message */}
            {showResults && query.trim() && !isLoading && results.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 py-4 px-4 bg-(--bg-elevated) border border-(--border-primary) rounded-xl shadow-lg z-50 text-center text-(--text-tertiary)">
                {locale === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Featured Concepts Grid */}
      <section aria-labelledby="featured-concepts-heading">
        <h2 id="featured-concepts-heading" className="sr-only">
          {locale === 'ko' ? '주요 개념' : 'Featured Concepts'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURED_CONCEPTS.map((concept) => (
            <Link
              key={concept.id}
              to={localePath(`/concept/${concept.id}`)}
              className={`block p-4 rounded-xl border no-underline transition-all hover:-translate-y-0.5 hover:shadow-md ${featuredCardColors[concept.colorClass]}`}
            >
              <div className="text-3xl mb-2">{concept.icon}</div>
              <h3 className="text-base font-medium text-(--text-primary) mb-1">
                {locale === 'ko' ? concept.nameKo : concept.nameEn}
              </h3>
              <p className="text-sm text-(--text-secondary) leading-snug">
                {locale === 'ko' ? concept.descKo : concept.descEn}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse All Link */}
      <div className="text-center mt-12">
        <Link
          to={localePath('/browse')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-(--accent-primary) font-medium transition-colors hover:bg-(--bg-tertiary)"
        >
          {t('browseAllConcepts')}
          <span>→</span>
        </Link>
      </div>
    </Layout>
  );
}
