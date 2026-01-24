/**
 * @fileoverview 사이트맵 페이지 (영어)
 */

import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { SitemapPage } from '../components/pages';

export const Route = createFileRoute('/sitemap')({
  head: headFactoryEn(
    {
      ko: { title: '사이트맵 - Roots', description: 'Roots 사이트의 모든 페이지와 수학 분야 목록' },
      en: {
        title: 'Sitemap - Roots',
        description: 'Complete list of all pages and math fields on Roots',
      },
    },
    'https://roots.soundbluemusic.com',
  ),
  component: SitemapPage,
});
