import { cn, type SearchResult, useSearchWorker } from '@soundblue/shared-react';
import { BookOpen, FolderOpen, Search, Sparkles, TrendingUp } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link, useLoaderData, useNavigate } from 'react-router';
import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import type { Category, MeaningEntry } from '@/data/types';
import { type Language, useI18n } from '@/i18n';
import { studyRecords } from '@/lib/db';

const getPronunciation = (entry: MeaningEntry, locale: Language): string | undefined => {
  switch (locale) {
    case 'en':
      return entry.romanization;
    case 'ko':
      return entry.pronunciation?.korean;
  }
};

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 */
export async function loader() {
  // 오늘의 단어 계산 (빌드 시점)
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const randomIndex = dayOfYear % meaningEntries.length;
  const dailyWord = meaningEntries[randomIndex];

  // 카테고리별 엔트리 수 계산
  const categoryCounts: Record<string, number> = {};
  for (const cat of categories) {
    categoryCounts[cat.id] = meaningEntries.filter((e) => e.categoryId === cat.id).length;
  }

  return {
    dailyWord,
    categories,
    categoryCounts,
    totalEntries: meaningEntries.length,
  };
}

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');

  if (isKorean) {
    return [
      { title: 'Context - 한국어 사전' },
      { name: 'description', content: '한국어 학습자를 위한 의미 사전' },
    ];
  }

  return [
    { title: 'Context - Korean Dictionary' },
    { name: 'description', content: 'Meaning dictionary for Korean learners' },
  ];
};

export default function HomePage() {
  const {
    dailyWord,
    categories: cats,
    categoryCounts,
    totalEntries,
  } = useLoaderData<{
    dailyWord: MeaningEntry;
    categories: Category[];
    categoryCounts: Record<string, number>;
    totalEntries: number;
  }>();
  const { locale, t, localePath } = useI18n();
  const navigate = useNavigate();
  const [overallProgress, setOverallProgress] = useState({ studied: 0, total: 0, percentage: 0 });
  const [categoryProgress, setCategoryProgress] = useState<
    Record<string, { studied: number; total: number; percentage: number }>
  >({});

  // Search state
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = 'homepage-search-listbox';

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
      navigate(localePath(`/entry/${item.id}`));
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
    const len = results.length;
    if (!showResults || len === 0) {
      if (e.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % len); // Wrap around
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + len) % len); // Wrap around
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Click-outside to close dropdown (fixes mobile touch race condition)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load progress data (클라이언트 전용 - IndexedDB)
  useEffect(() => {
    async function loadProgress() {
      const overall = await studyRecords.getOverallProgress(totalEntries);
      setOverallProgress(overall);

      const catProgress: Record<string, { studied: number; total: number; percentage: number }> =
        {};
      for (const cat of cats) {
        const count = categoryCounts[cat.id] ?? 0;
        const progress = await studyRecords.getCategoryProgress(cat.id, count);
        catProgress[cat.id] = progress;
      }
      setCategoryProgress(catProgress);
    }
    loadProgress();
  }, [cats, categoryCounts, totalEntries]);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-2">
          {t('heroTitle')}
        </h1>
        <p className="text-(--text-secondary) mb-6">{t('heroSubtitle')}</p>

        {/* Quick Search */}
        <div className="max-w-md" ref={containerRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={18}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
            />
            <input
              ref={inputRef}
              type="search"
              placeholder={
                locale === 'ko'
                  ? '단어 검색... (예: 사랑, 행복)'
                  : 'Search words... (e.g., love, happy)'
              }
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
                setSelectedIndex(-1);
              }}
              onFocus={() => setShowResults(true)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-12 pl-11 pr-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-none focus:border-(--border-focus) transition-colors [&::-webkit-search-cancel-button]:hidden"
              aria-expanded={showResults && results.length > 0}
              aria-haspopup="listbox"
              aria-controls={listboxId}
              aria-activedescendant={
                selectedIndex >= 0 ? `search-option-${selectedIndex}` : undefined
              }
              role="combobox"
              aria-autocomplete="list"
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
              <div
                id={listboxId}
                role="listbox"
                className="absolute top-full left-0 right-0 mt-2 py-2 bg-(--bg-elevated) border border-(--border-primary) rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
              >
                {results.map((result, index) => {
                  const item = result.item;
                  const name = locale === 'ko' ? item.name.ko : item.name.en;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      id={`search-option-${index}`}
                      role="option"
                      tabIndex={-1}
                      aria-selected={isSelected}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => handleResultClick(result)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleResultClick(result);
                      }}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer',
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
                    </div>
                  );
                })}
              </div>
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

      {/* Overall Progress */}
      {overallProgress.studied > 0 && (
        <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-(--text-primary) flex items-center gap-2">
              <TrendingUp size={18} aria-hidden="true" />
              {locale === 'ko' ? '내 학습 현황' : 'My Progress'}
            </h2>
            <span className="text-sm text-(--text-secondary)">
              {overallProgress.studied}/{overallProgress.total} {locale === 'ko' ? '단어' : 'words'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden bg-(--bg-secondary)">
            <div
              className="h-full bg-(--accent-primary) transition-all duration-300"
              style={{ width: `${overallProgress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Daily Word */}
      {dailyWord && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-3 flex items-center gap-2">
            <Sparkles size={20} aria-hidden="true" />
            {locale === 'ko' ? '오늘의 단어' : 'Word of the Day'}
          </h2>
          <Link
            to={localePath(`/entry/${dailyWord.id}`)}
            className="block p-6 rounded-xl bg-(--bg-elevated) border-2 border-(--accent-primary) no-underline"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-2 text-(--text-primary)">{dailyWord.korean}</h3>
              <p className="text-lg text-(--text-tertiary) mb-3">
                {getPronunciation(dailyWord, locale)}
              </p>
              <p className="text-xl text-(--accent-primary)">
                {dailyWord.translations[locale].word}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Categories Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-(--text-primary) flex items-center gap-2">
            <FolderOpen size={20} aria-hidden="true" />
            {locale === 'ko' ? '카테고리별 학습' : 'Learn by Category'}
          </h2>
          <Link to={localePath('/browse')} className="text-sm text-(--accent-primary)">
            {t('viewAll')} →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {cats.map((category) => {
            const count = categoryCounts[category.id];
            const progress = categoryProgress[category.id] || {
              studied: 0,
              total: count,
              percentage: 0,
            };

            return (
              <Link
                key={category.id}
                to={localePath(`/category/${category.id}`)}
                className="block p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-(--border-focus)"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-(--text-primary)">{category.name[locale]}</h3>
                    <p className="text-xs text-(--text-tertiary)">
                      {progress.studied}/{count} {locale === 'ko' ? '단어' : 'words'}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                {progress.studied > 0 && (
                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-(--bg-secondary)">
                    <div
                      className="h-full bg-(--accent-primary) transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
