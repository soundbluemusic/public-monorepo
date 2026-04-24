/**
 * @fileoverview 라이선스 페이지 - 한국어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { LegalPageContent, licenseMeta } from '@/components/pages/LegalPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/ko/license')({
  head: headFactory(licenseMeta, APP_CONFIG.baseUrl),
  component: () => <LegalPageContent titleKey="licenseTitle" contentKey="licenseContent" />,
});
