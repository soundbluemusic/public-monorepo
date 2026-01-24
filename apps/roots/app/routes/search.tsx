/**
 * @fileoverview 검색 결과 페이지 (영어)
 */

import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { SearchPage } from '../components/pages';

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q : '',
  }),
  head: headFactoryEn(
    {
      ko: { title: '검색 - 수리', description: '수학 개념 검색' },
      en: { title: 'Search - Roots', description: 'Search math concepts' },
    },
    'https://roots.soundbluemusic.com',
  ),
  component: SearchPageWrapper,
});

function SearchPageWrapper() {
  const { q: query } = useSearch({ from: '/search' });
  return <SearchPage query={query} />;
}
