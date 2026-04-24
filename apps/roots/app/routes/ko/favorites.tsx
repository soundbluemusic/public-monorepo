/**
 * @fileoverview 즐겨찾기 페이지 (한글)
 */

import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { FavoritesPage, favoritesMeta } from '../../components/pages';
import { APP_CONFIG } from '../../config';

export const Route = createFileRoute('/ko/favorites')({
  head: () => {
    const config = headFactoryKo(favoritesMeta, APP_CONFIG.baseUrl)();
    return {
      ...config,
      meta: [...(config.meta ?? []), { name: 'robots', content: 'noindex' }],
    };
  },
  component: FavoritesPage,
});
