/**
 * @fileoverview 오픈소스 페이지 (영어)
 */

import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { BuiltWithPage, builtWithMeta } from '../components/pages';
import { APP_CONFIG } from '../config';

export const Route = createFileRoute('/built-with')({
  head: headFactoryEn(builtWithMeta, APP_CONFIG.baseUrl),
  component: BuiltWithPage,
});
