/**
 * @fileoverview 전체 분야 및 개념 목록 페이지 (한글)
 */

import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { BrowsePage, browseMeta } from '../../components/browse';
import { APP_CONFIG } from '../../config';

export const Route = createFileRoute('/ko/browse')({
  head: headFactoryKo(browseMeta, APP_CONFIG.baseUrl),
  component: BrowsePage,
});
