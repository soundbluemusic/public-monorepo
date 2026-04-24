/**
 * @fileoverview 소개 페이지 (한글)
 */

import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { AboutPage, aboutMeta } from '../../components/pages';
import { APP_CONFIG } from '../../config';

export const Route = createFileRoute('/ko/about')({
  head: headFactoryKo(aboutMeta, APP_CONFIG.baseUrl),
  component: AboutPage,
});
