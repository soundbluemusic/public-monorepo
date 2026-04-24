/**
 * @fileoverview 즐겨찾기 페이지 (영어)
 */

import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { FavoritesPage, favoritesMeta } from '../components/pages';
import { APP_CONFIG } from '../config';

export const Route = createFileRoute('/favorites')({
  head: () => {
    const config = headFactoryEn(favoritesMeta, APP_CONFIG.baseUrl)();
    return {
      ...config,
      meta: [...(config.meta ?? []), { name: 'robots', content: 'noindex' }],
    };
  },
  component: FavoritesPage,
});
