import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import type { MeaningEntry } from '@/data/types';
import { useI18n } from '@/i18n';
import { favorites, studyRecords } from '@/lib/db';
import { cn } from '@soundblue/shared-react';
import { Check, Shuffle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link, useLoaderData } from 'react-router';

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 */
export async function loader() {
  return {
    entries: meaningEntries,
    categories,
    totalEntries: meaningEntries.length,
  };
}

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');

  if (isKorean) {
    return [
      { title: '찾아보기 - Context' },
      { name: 'description', content: '모든 한국어 단어 찾아보기 및 필터링' },
    ];
  }

  return [
    { title: 'Browse - Context' },
    { name: 'description', content: 'Browse and filter all Korean words' },
  ];
};

type FilterCategory = 'all' | string;
type FilterStatus = 'all' | 'studied' | 'unstudied' | 'bookmarked';
type SortOption = 'alphabetical' | 'category' | 'recent';

export default function BrowsePage() {
  const {
    entries,
    categories: cats,
    totalEntries,
  } = useLoaderData<{
    entries: MeaningEntry[];
    categories: typeof categories;
    totalEntries: number;
  }>();
  const { locale, localePath } = useI18n();

  // Progress data
  const [overallProgress, setOverallProgress] = useState({ studied: 0, total: 0, percentage: 0 });
  const [todayStudied, setTodayStudied] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // Filter & Sort state
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');

  // Data state
  const [studiedIds, setStudiedIds] = useState<Set<string>>(new Set());
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Load progress and favorites
  useEffect(() => {
    async function loadData() {
      // Overall progress
      const overall = await studyRecords.getOverallProgress(totalEntries);
      setOverallProgress(overall);

      // Studied IDs
      const ids = await studyRecords.getStudiedEntryIds();
      setStudiedIds(new Set(ids));

      // Today's studied count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const allRecords = await studyRecords.getRecent(totalEntries);
      const todayRecords = allRecords.filter((r) => {
        const recordDate = new Date(r.studiedAt);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === today.getTime();
      });
      const uniqueTodayIds = new Set(todayRecords.map((r) => r.entryId));
      setTodayStudied(uniqueTodayIds.size);

      // Favorites
      const favs = await favorites.getAll();
      setFavoriteIds(new Set(favs.map((f) => f.entryId)));
      setBookmarkCount(favs.length);
    }
    loadData();
  }, [totalEntries]);

  // Filter and sort logic
  const getFilteredAndSortedEntries = (): MeaningEntry[] => {
    let filtered = entries;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter((e) => e.categoryId === filterCategory);
    }

    // Filter by status
    if (filterStatus === 'studied') {
      filtered = filtered.filter((e) => studiedIds.has(e.id));
    } else if (filterStatus === 'unstudied') {
      filtered = filtered.filter((e) => !studiedIds.has(e.id));
    } else if (filterStatus === 'bookmarked') {
      filtered = filtered.filter((e) => favoriteIds.has(e.id));
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.korean.localeCompare(b.korean, 'ko'));
    } else if (sortBy === 'category') {
      sorted.sort((a, b) => {
        if (a.categoryId === b.categoryId) {
          return a.korean.localeCompare(b.korean, 'ko');
        }
        return a.categoryId.localeCompare(b.categoryId);
      });
    } else if (sortBy === 'recent') {
      // Most recently added first (reverse order)
      sorted.reverse();
    }

    return sorted;
  };

  const filteredEntries = getFilteredAndSortedEntries();

  const handleRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * entries.length);
    const randomEntry = entries[randomIndex];
    window.location.href = localePath(`/entry/${randomEntry.id}`);
  };

  const handleShowBookmarksOnly = () => {
    setFilterStatus('bookmarked');
    setFilterCategory('all');
  };

  const handleShowUnstudiedOnly = () => {
    setFilterStatus('unstudied');
    setFilterCategory('all');
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
          {locale === 'ko' ? '전체 단어 찾아보기' : 'Browse All Words'}
        </h1>
        <p className="text-[var(--text-secondary)]">
          {locale === 'ko' ? '모든 단어를 검색하고 필터링하세요' : 'Search and filter all words'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
          <div className="text-sm text-[var(--text-tertiary)] mb-1">
            {locale === 'ko' ? '전체 진행률' : 'Overall Progress'}
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {overallProgress.percentage.toFixed(0)}%
          </div>
          <div className="text-xs text-[var(--text-secondary)]">
            {overallProgress.studied}/{overallProgress.total} {locale === 'ko' ? '단어' : 'words'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
          <div className="text-sm text-[var(--text-tertiary)] mb-1">
            {locale === 'ko' ? '오늘 학습' : 'Today Studied'}
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{todayStudied}</div>
          <div className="text-xs text-[var(--text-secondary)]">
            {locale === 'ko' ? '단어' : 'words'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
          <div className="text-sm text-[var(--text-tertiary)] mb-1">
            {locale === 'ko' ? '북마크' : 'Bookmarks'}
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{bookmarkCount}</div>
          <div className="text-xs text-[var(--text-secondary)]">
            {locale === 'ko' ? '단어' : 'words'}
          </div>
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleRandomWord}
          className="min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-[var(--accent-primary)] text-white hover:brightness-110 active:scale-[0.98]"
        >
          <Shuffle size={16} aria-hidden="true" />
          <span>{locale === 'ko' ? '랜덤 단어' : 'Random Word'}</span>
        </button>

        <button
          type="button"
          onClick={handleShowBookmarksOnly}
          className={cn(
            'min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
            filterStatus === 'bookmarked'
              ? 'bg-[var(--accent-primary)] text-white'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-primary)]',
          )}
        >
          {locale === 'ko' ? '북마크만' : 'Bookmarks Only'}
        </button>

        <button
          type="button"
          onClick={handleShowUnstudiedOnly}
          className={cn(
            'min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
            filterStatus === 'unstudied'
              ? 'bg-[var(--accent-primary)] text-white'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-primary)]',
          )}
        >
          {locale === 'ko' ? '미학습만' : 'Unstudied Only'}
        </button>
      </div>

      {/* Filter & Sort Controls */}
      <div className="mb-6 flex flex-wrap gap-3">
        {/* Category Filter */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="category-filter"
            className="block text-sm mb-1 text-[var(--text-secondary)]"
          >
            {locale === 'ko' ? '카테고리' : 'Category'}
          </label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
            className="w-full min-h-10 px-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-primary)]"
          >
            <option value="all">{locale === 'ko' ? '전체' : 'All'}</option>
            {cats.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name[locale]}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="status-filter"
            className="block text-sm mb-1 text-[var(--text-secondary)]"
          >
            {locale === 'ko' ? '학습 상태' : 'Study Status'}
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="w-full min-h-10 px-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-primary)]"
          >
            <option value="all">{locale === 'ko' ? '전체' : 'All'}</option>
            <option value="studied">{locale === 'ko' ? '학습 완료' : 'Studied'}</option>
            <option value="unstudied">{locale === 'ko' ? '미학습' : 'Unstudied'}</option>
            <option value="bookmarked">{locale === 'ko' ? '북마크' : 'Bookmarked'}</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="sort-by" className="block text-sm mb-1 text-[var(--text-secondary)]">
            {locale === 'ko' ? '정렬' : 'Sort By'}
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full min-h-10 px-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-primary)]"
          >
            <option value="alphabetical">{locale === 'ko' ? '가나다순' : 'Alphabetical'}</option>
            <option value="category">{locale === 'ko' ? '카테고리별' : 'By Category'}</option>
            <option value="recent">{locale === 'ko' ? '최근 추가' : 'Recently Added'}</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-[var(--text-secondary)]">
          {locale === 'ko'
            ? `${filteredEntries.length}개의 단어`
            : `${filteredEntries.length} words`}
        </p>
      </div>

      {/* Word List */}
      <div className="space-y-1">
        {filteredEntries.map((entry) => {
          const translation = entry.translations[locale];
          const isStudied = studiedIds.has(entry.id);
          const isFavorite = favoriteIds.has(entry.id);
          const category = cats.find((c) => c.id === entry.categoryId);

          return (
            <Link
              key={entry.id}
              to={localePath(`/entry/${entry.id}`)}
              className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg border-b border-[var(--border-primary)] transition-colors no-underline hover:bg-[var(--bg-tertiary)]"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Checkmark */}
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                    isStudied ? 'bg-[var(--accent-primary)]' : '',
                  )}
                >
                  {isStudied && <Check size={14} className="text-white" />}
                </div>

                {/* Word info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={cn(
                      'text-lg font-medium',
                      isStudied
                        ? 'text-[var(--text-secondary)] line-through opacity-70'
                        : 'text-[var(--text-primary)]',
                    )}
                  >
                    {entry.korean}
                  </span>
                  <span className="text-sm text-[var(--text-tertiary)] hidden sm:inline">
                    {entry.romanization}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Category badge (desktop only) */}
                {category && (
                  <span className="hidden md:inline px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">
                    {category.icon} {category.name[locale]}
                  </span>
                )}

                {/* Translation */}
                <span className="text-sm text-[var(--text-secondary)] ml-2">
                  {translation.word}
                </span>

                {/* Bookmark indicator */}
                {isFavorite && (
                  <span className="text-sm" title={locale === 'ko' ? '북마크됨' : 'Bookmarked'}>
                    <Star size={14} aria-hidden="true" fill="currentColor" />
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12 px-4 text-[var(--text-tertiary)]">
          <p>{locale === 'ko' ? '단어가 없습니다' : 'No words found'}</p>
        </div>
      )}
    </Layout>
  );
}
