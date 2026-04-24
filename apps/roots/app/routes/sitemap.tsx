/**
 * @fileoverview 사이트맵 페이지 (영어)
 */

import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { SitemapPage, sitemapMeta } from '../components/pages';
import { APP_CONFIG } from '../config';

export const Route = createFileRoute('/sitemap')({
  head: headFactoryEn(sitemapMeta, APP_CONFIG.baseUrl),
  component: SitemapPage,
});
