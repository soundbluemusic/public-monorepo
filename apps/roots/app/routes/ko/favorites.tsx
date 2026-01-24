/**
 * @fileoverview 즐겨찾기 페이지 (한글)
 */

import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { FavoritesPage } from '../../components/pages';

export const Route = createFileRoute('/ko/favorites')({
  head: headFactoryKo(
    {
      ko: { title: '즐겨찾기 - 수리', description: '즐겨찾는 수학 개념' },
      en: { title: 'Favorites - Roots', description: 'Your favorite math concepts' },
    },
    'https://roots.soundbluemusic.com',
  ),
  component: FavoritesPage,
});
