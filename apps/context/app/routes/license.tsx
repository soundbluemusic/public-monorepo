/**
 * @fileoverview 라이선스 페이지 - 영어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { LegalPageContent } from '@/components/pages/LegalPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/license')({
  head: headFactory(
    {
      ko: { title: '라이선스 - Context' },
      en: { title: 'License - Context' },
    },
    APP_CONFIG.baseUrl,
  ),
  component: () => <LegalPageContent titleKey="licenseTitle" contentKey="licenseContent" />,
});
