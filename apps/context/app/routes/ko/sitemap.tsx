/**
 * @fileoverview Sitemap 페이지 - 한국어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { SitemapPageContent, sitemapMeta } from '@/components/pages/SitemapPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/ko/sitemap')({
  head: headFactory(sitemapMeta, APP_CONFIG.baseUrl),
  component: SitemapPageContent,
});
