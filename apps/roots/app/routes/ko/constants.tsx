/**
 * @fileoverview 수학 상수 페이지 (한글)
 */

import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { ConstantsPage, constantsMeta } from '../../components/pages';
import { APP_CONFIG } from '../../config';

export const Route = createFileRoute('/ko/constants')({
  head: headFactoryKo(constantsMeta, APP_CONFIG.baseUrl),
  component: ConstantsPage,
});
