/**
 * @fileoverview 이용약관 페이지 - 영어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { LegalPageContent } from '@/components/pages/LegalPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/terms')({
  head: headFactory(
    {
      ko: { title: '이용약관 - Context' },
      en: { title: 'Terms of Service - Context' },
    },
    APP_CONFIG.baseUrl,
  ),
  component: () => <LegalPageContent titleKey="termsTitle" contentKey="termsContent" />,
});
