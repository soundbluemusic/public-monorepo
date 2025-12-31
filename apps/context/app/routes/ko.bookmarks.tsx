import { Bookmark, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import { Layout } from '@/components/layout';
import { entriesById } from '@/data/entries';
import type { MeaningEntry } from '@/data/types';
import { useI18n } from '@/i18n';
import { favorites } from '@/lib/db';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');

  if (isKorean) {
    return [
      { title: '북마크 - Context' },
      { name: 'description', content: '북마크한 단어 모아보기' },
    ];
  }

  return [
    { title: 'Bookmarks - Context' },
    { name: 'description', content: 'View your bookmarked words' },
  ];
};

export default function BookmarksPage() {
  const { locale, t, localePath } = useI18n();
  const [bookmarkedEntries, setBookmarkedEntries] = useState<MeaningEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 북마크 데이터 로드
  useEffect(() => {
    async function loadBookmarks() {
      try {
        const favs = await favorites.getAll();
        const entries: MeaningEntry[] = [];
        for (const fav of favs) {
          const entry = entriesById.get(fav.entryId);
          if (entry) {
            entries.push(entry);
          }
        }
        setBookmarkedEntries(entries);
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadBookmarks();
  }, []);

  // 북마크 제거
  const handleRemoveBookmark = useCallback(async (entryId: string) => {
    try {
      await favorites.remove(entryId);
      setBookmarkedEntries((prev) => prev.filter((e) => e.id !== entryId));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  }, []);

  // 검색 필터링
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return bookmarkedEntries;

    const query = searchQuery.toLowerCase();
    return bookmarkedEntries.filter((entry) => {
      const translation = entry.translations[locale];
      return (
        entry.korean.toLowerCase().includes(query) ||
        entry.romanization.toLowerCase().includes(query) ||
        translation.word.toLowerCase().includes(query)
      );
    });
  }, [bookmarkedEntries, searchQuery, locale]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-(--accent-primary) border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) flex items-center gap-2">
          <Bookmark size={24} className="text-(--accent-primary)" aria-hidden="true" />
          {t('bookmarks')}
        </h1>
        <p className="text-(--text-secondary) mt-1">
          {locale === 'ko'
            ? `${bookmarkedEntries.length}개의 단어가 북마크됨`
            : `${bookmarkedEntries.length} words bookmarked`}
        </p>
      </div>

      {/* Search */}
      {bookmarkedEntries.length > 0 && (
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'ko' ? '북마크 내 검색...' : 'Search bookmarks...'}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-(--bg-tertiary) border border-(--border-primary) text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-none focus:border-(--border-focus) transition-colors [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
      )}

      {/* Empty State */}
      {bookmarkedEntries.length === 0 && (
        <div className="text-center py-16 px-4">
          <Bookmark size={48} className="mx-auto mb-4 text-(--text-tertiary)" aria-hidden="true" />
          <p className="text-lg text-(--text-secondary) mb-2">
            {locale === 'ko' ? '북마크한 단어가 없습니다' : 'No bookmarked words yet'}
          </p>
          <p className="text-sm text-(--text-tertiary) mb-6">
            {locale === 'ko'
              ? '단어 페이지에서 북마크 아이콘을 눌러 저장하세요'
              : 'Tap the bookmark icon on word pages to save them'}
          </p>
          <Link
            to={localePath('/browse')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110"
          >
            {locale === 'ko' ? '단어 찾아보기' : 'Browse Words'}
          </Link>
        </div>
      )}

      {/* No Search Results */}
      {bookmarkedEntries.length > 0 && filteredEntries.length === 0 && searchQuery && (
        <div className="text-center py-12 px-4">
          <p className="text-(--text-secondary)">{t('noResults')}</p>
        </div>
      )}

      {/* Bookmark List */}
      {filteredEntries.length > 0 && (
        <div className="space-y-1">
          {filteredEntries.map((entry) => {
            const translation = entry.translations[locale];
            return (
              <div
                key={entry.id}
                className="flex items-center gap-2 py-3 px-2 -mx-2 rounded-lg border-b border-(--border-primary) hover:bg-(--bg-tertiary) transition-colors group"
              >
                <Link
                  to={localePath(`/entry/${entry.id}`)}
                  className="flex-1 flex items-center justify-between no-underline min-w-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg font-medium text-(--text-primary) shrink-0">
                      {entry.korean}
                    </span>
                    <span className="text-sm text-(--text-tertiary) truncate">
                      {entry.romanization}
                    </span>
                  </div>
                  <span className="text-sm text-(--text-secondary) shrink-0 ml-2">
                    {translation.word}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemoveBookmark(entry.id)}
                  className="min-h-9 min-w-9 flex items-center justify-center rounded-lg text-(--text-tertiary) hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label={locale === 'ko' ? '북마크 제거' : 'Remove bookmark'}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
