/**
 * @fileoverview 즐겨찾기 페이지 (영어)
 */

import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { FavoritesPage } from '../components/pages';

export const Route = createFileRoute('/favorites')({
  head: () => {
    const config = headFactoryEn(
      {
        ko: { title: '즐겨찾기 - 수리', description: '즐겨찾는 수학 개념' },
        en: { title: 'Favorites - Roots', description: 'Your favorite math concepts' },
      },
      'https://roots.soundbluemusic.com',
    )();
    return {
      ...config,
      meta: [...(config.meta ?? []), { name: 'robots', content: 'noindex' }],
    };
  },
  component: FavoritesPage,
});
