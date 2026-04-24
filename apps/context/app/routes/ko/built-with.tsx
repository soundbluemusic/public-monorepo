/**
 * @fileoverview 오픈소스 페이지 - 한국어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { BuiltWithPageContent, builtWithMeta } from '@/components/pages/BuiltWithPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/ko/built-with')({
  head: headFactory(builtWithMeta, APP_CONFIG.baseUrl),
  component: BuiltWithPageContent,
});
