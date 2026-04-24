/**
 * @fileoverview 수학 상수 페이지 (영어)
 */

import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { ConstantsPage, constantsMeta } from '../components/pages';
import { APP_CONFIG } from '../config';

export const Route = createFileRoute('/constants')({
  head: headFactoryEn(constantsMeta, APP_CONFIG.baseUrl),
  component: ConstantsPage,
});
