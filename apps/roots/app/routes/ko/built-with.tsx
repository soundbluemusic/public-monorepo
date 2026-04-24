/**
 * @fileoverview 오픈소스 페이지 (한글)
 */

import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { BuiltWithPage, builtWithMeta } from '../../components/pages';
import { APP_CONFIG } from '../../config';

export const Route = createFileRoute('/ko/built-with')({
  head: headFactoryKo(builtWithMeta, APP_CONFIG.baseUrl),
  component: BuiltWithPage,
});
