/**
 * @fileoverview About 페이지 - 영어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { AboutPageContent } from '@/components/pages/AboutPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/about')({
  head: headFactory(
    {
      ko: { title: '소개 - Context', description: 'Context 한국어 사전 소개' },
      en: { title: 'About - Context', description: 'About Context Korean Dictionary' },
    },
    APP_CONFIG.baseUrl,
  ),
  component: AboutPageContent,
});
