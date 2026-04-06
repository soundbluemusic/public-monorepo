/**
 * @fileoverview 오픈소스 페이지 - 영어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { BuiltWithPageContent } from '@/components/pages/BuiltWithPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/built-with')({
  head: headFactory(
    {
      ko: {
        title: '오픈소스 - Context',
        description: '이 프로젝트에서 사용된 오픈소스 라이브러리',
      },
      en: {
        title: 'Open Source - Context',
        description: 'Open source libraries used in this project',
      },
    },
    APP_CONFIG.baseUrl,
  ),
  component: BuiltWithPageContent,
});
