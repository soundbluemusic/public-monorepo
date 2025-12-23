import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import type { MeaningEntry } from '@/data/types';
import { useI18n } from '@/i18n';
import { favorites, studyRecords } from '@/lib/db';
import { Check, Shuffle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';

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
      const overall = await studyRecords.getOverallProgress(meaningEntries.length);
      setOverallProgress(overall);

      // Studied IDs
      const ids = await studyRecords.getStudiedEntryIds();
      setStudiedIds(new Set(ids));

      // Today's studied count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const allRecords = await studyRecords.getRecent(meaningEntries.length);
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
  }, []);

  // Filter and sort logic
  const getFilteredAndSortedEntries = (): MeaningEntry[] => {
    let filtered = meaningEntries;

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
    const randomIndex = Math.floor(Math.random() * meaningEntries.length);
    const randomEntry = meaningEntries[randomIndex];
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
        <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {locale === 'ko' ? '전체 단어 찾아보기' : 'Browse All Words'}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ko' ? '모든 단어를 검색하고 필터링하세요' : 'Search and filter all words'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <div className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>
            {locale === 'ko' ? '전체 진행률' : 'Overall Progress'}
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {overallProgress.percentage.toFixed(0)}%
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {overallProgress.studied}/{overallProgress.total} {locale === 'ko' ? '단어' : 'words'}
          </div>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <div className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>
            {locale === 'ko' ? '오늘 학습' : 'Today Studied'}
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {todayStudied}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {locale === 'ko' ? '단어' : 'words'}
          </div>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <div className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>
            {locale === 'ko' ? '북마크' : 'Bookmarks'}
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {bookmarkCount}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {locale === 'ko' ? '단어' : 'words'}
          </div>
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleRandomWord}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
          }}
        >
          <Shuffle size={16} />
          <span>{locale === 'ko' ? '🎲 랜덤 단어' : '🎲 Random Word'}</span>
        </button>

        <button
          type="button"
          onClick={handleShowBookmarksOnly}
          className="px-4 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor:
              filterStatus === 'bookmarked' ? 'var(--accent-primary)' : 'var(--bg-elevated)',
            color: filterStatus === 'bookmarked' ? 'white' : 'var(--text-primary)',
            border: filterStatus === 'bookmarked' ? 'none' : '1px solid var(--border-primary)',
          }}
        >
          {locale === 'ko' ? '⭐ 북마크만' : '⭐ Bookmarks Only'}
        </button>

        <button
          type="button"
          onClick={handleShowUnstudiedOnly}
          className="px-4 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor:
              filterStatus === 'unstudied' ? 'var(--accent-primary)' : 'var(--bg-elevated)',
            color: filterStatus === 'unstudied' ? 'white' : 'var(--text-primary)',
            border: filterStatus === 'unstudied' ? 'none' : '1px solid var(--border-primary)',
          }}
        >
          {locale === 'ko' ? '📖 미학습만' : '📖 Unstudied Only'}
        </button>
      </div>

      {/* Filter & Sort Controls */}
      <div className="mb-6 flex flex-wrap gap-3">
        {/* Category Filter */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="category-filter"
            className="block text-sm mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {locale === 'ko' ? '카테고리' : 'Category'}
          </label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
            className="w-full px-3 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <option value="all">{locale === 'ko' ? '전체' : 'All'}</option>
            {categories.map((cat) => (
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
            className="block text-sm mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {locale === 'ko' ? '학습 상태' : 'Study Status'}
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="w-full px-3 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <option value="all">{locale === 'ko' ? '전체' : 'All'}</option>
            <option value="studied">{locale === 'ko' ? '학습 완료' : 'Studied'}</option>
            <option value="unstudied">{locale === 'ko' ? '미학습' : 'Unstudied'}</option>
            <option value="bookmarked">{locale === 'ko' ? '북마크' : 'Bookmarked'}</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="sort-by"
            className="block text-sm mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {locale === 'ko' ? '정렬' : 'Sort By'}
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full px-3 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <option value="alphabetical">{locale === 'ko' ? '가나다순' : 'Alphabetical'}</option>
            <option value="category">{locale === 'ko' ? '카테고리별' : 'By Category'}</option>
            <option value="recent">{locale === 'ko' ? '최근 추가' : 'Recently Added'}</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
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
          const category = categories.find((c) => c.id === entry.categoryId);

          return (
            <Link
              key={entry.id}
              to={localePath(`/entry/${entry.id}`)}
              className="flex items-center justify-between py-3 -mx-2 px-2 rounded transition-colors hover:bg-[var(--bg-tertiary)]"
              style={{ borderBottom: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Checkmark */}
                <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                  {isStudied && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                      <Check size={14} style={{ color: 'white' }} />
                    </div>
                  )}
                </div>

                {/* Word info */}
                <div className="flex items-baseline gap-3 flex-1 min-w-0">
                  <span
                    className="text-lg font-medium"
                    style={{
                      color: isStudied ? 'var(--text-secondary)' : 'var(--text-primary)',
                      textDecoration: isStudied ? 'line-through' : 'none',
                      opacity: isStudied ? 0.7 : 1,
                    }}
                  >
                    {entry.korean}
                  </span>
                  <span
                    className="text-sm hidden sm:inline"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {entry.romanization}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Category badge (desktop only) */}
                {category && (
                  <span
                    className="hidden md:inline text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {category.icon} {category.name[locale]}
                  </span>
                )}

                {/* Translation */}
                <span className="text-sm ml-2" style={{ color: 'var(--text-secondary)' }}>
                  {translation.word}
                </span>

                {/* Bookmark indicator */}
                {isFavorite && (
                  <span className="text-sm" title={locale === 'ko' ? '북마크됨' : 'Bookmarked'}>
                    ⭐
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-tertiary)' }}>
            {locale === 'ko' ? '단어가 없습니다' : 'No words found'}
          </p>
        </div>
      )}
    </Layout>
  );
}
