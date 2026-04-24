/**
 * @fileoverview About 페이지 - 영어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { AboutPageContent, aboutMeta } from '@/components/pages/AboutPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/about')({
  head: headFactory(aboutMeta, APP_CONFIG.baseUrl),
  component: AboutPageContent,
});
