/**
 * @fileoverview 북마크 페이지 - 영어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { BookmarksPageContent, bookmarksMeta } from '@/components/pages/BookmarksPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/bookmarks')({
  head: headFactory(bookmarksMeta, APP_CONFIG.baseUrl),
  component: BookmarksPage,
});

function BookmarksPage() {
  return <BookmarksPageContent />;
}
