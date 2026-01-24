/**
 * @fileoverview 전체 분야 및 개념 목록 페이지 (영어)
 */

import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { BrowsePage } from '../components/browse';

export const Route = createFileRoute('/browse')({
  head: headFactoryEn(
    {
      ko: { title: '찾아보기 - 수리', description: '분야별로 수학 개념 찾아보기' },
      en: { title: 'Browse - Roots', description: 'Browse math concepts by field' },
    },
    'https://roots.soundbluemusic.com',
  ),
  component: BrowsePage,
});
