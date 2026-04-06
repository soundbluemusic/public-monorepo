/**
 * @fileoverview 북마크 페이지 - 한국어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { BookmarksPageContent } from '@/components/pages/BookmarksPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/ko/bookmarks')({
  head: headFactory(
    {
      ko: { title: '북마크 - Context', description: '북마크한 단어 모아보기' },
      en: { title: 'Bookmarks - Context', description: 'View your bookmarked words' },
    },
    APP_CONFIG.baseUrl,
  ),
  component: BookmarksPage,
});

function BookmarksPage() {
  return <BookmarksPageContent />;
}
