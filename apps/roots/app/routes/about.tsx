/**
 * @fileoverview 소개 페이지 (영어)
 */

import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '../components/pages';

export const Route = createFileRoute('/about')({
  head: headFactoryEn(
    {
      ko: { title: '소개 - 수리', description: '수리 소개 - 학습자를 위한 수학 문서' },
      en: { title: 'About - Roots', description: 'About Roots - Math documentation for learners' },
    },
    'https://roots.soundbluemusic.com',
  ),
  component: AboutPage,
});
