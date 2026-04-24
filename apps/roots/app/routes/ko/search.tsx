/**
 * @fileoverview 검색 결과 페이지 (한글)
 */

import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { SearchPage, searchMeta } from '../../components/pages';
import { APP_CONFIG } from '../../config';

export const Route = createFileRoute('/ko/search')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q : '',
  }),
  head: () => {
    const config = headFactoryKo(searchMeta, APP_CONFIG.baseUrl)();
    return {
      ...config,
      meta: [...(config.meta ?? []), { name: 'robots', content: 'noindex' }],
    };
  },
  component: SearchPageWrapper,
});

function SearchPageWrapper() {
  const { q: query } = useSearch({ from: '/ko/search' });
  return <SearchPage query={query} />;
}
