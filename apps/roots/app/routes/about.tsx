/**
 * @fileoverview 소개 페이지 (영어)
 */

import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { AboutPage, aboutMeta } from '../components/pages';
import { APP_CONFIG } from '../config';

export const Route = createFileRoute('/about')({
  head: headFactoryEn(aboutMeta, APP_CONFIG.baseUrl),
  component: AboutPage,
});
