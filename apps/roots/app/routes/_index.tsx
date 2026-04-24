/**
 * @fileoverview 홈페이지 (영어) - Apple 스타일 미니멀 디자인
 */

import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { HomePage, homeMeta } from '../components/pages';
import { APP_CONFIG } from '../config';

export const Route = createFileRoute('/_index')({
  head: headFactoryEn(homeMeta, APP_CONFIG.baseUrl),
  component: HomePage,
});
