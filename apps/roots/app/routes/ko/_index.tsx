/**
 * @fileoverview 홈페이지 (한글) - Apple 스타일 미니멀 디자인
 */

import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { HomePage, homeMeta } from '../../components/pages';
import { APP_CONFIG } from '../../config';

export const Route = createFileRoute('/ko/_index')({
  head: headFactoryKo(homeMeta, APP_CONFIG.baseUrl),
  component: HomePage,
});
