/**
 * @fileoverview 개인정보처리방침 페이지 - 영어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { LegalPageContent } from '@/components/pages/LegalPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/privacy')({
  head: headFactory(
    {
      ko: { title: '개인정보처리방침 - Context' },
      en: { title: 'Privacy Policy - Context' },
    },
    APP_CONFIG.baseUrl,
  ),
  component: () => <LegalPageContent titleKey="privacyTitle" contentKey="privacyContent" />,
});
