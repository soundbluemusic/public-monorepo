/**
 * @fileoverview Sitemap 페이지 - 한국어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { SitemapPageContent } from '@/components/pages/SitemapPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/ko/sitemap')({
  head: headFactory(
    {
      ko: {
        title: '사이트맵 - Context',
        description: 'Context 사이트의 모든 페이지 목록',
      },
      en: {
        title: 'Sitemap - Context',
        description: 'Complete list of all pages on Context',
      },
    },
    APP_CONFIG.baseUrl,
  ),
  component: SitemapPageContent,
});
