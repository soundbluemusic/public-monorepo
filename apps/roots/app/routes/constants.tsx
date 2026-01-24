/**
 * @fileoverview 수학 상수 페이지 (영어)
 */

import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { ConstantsPage } from '../components/pages';

export const Route = createFileRoute('/constants')({
  head: headFactoryEn(
    {
      ko: { title: '수학 상수 - 수리', description: '수학 상수' },
      en: { title: 'Constants - Roots', description: 'Mathematical constants' },
    },
    'https://roots.soundbluemusic.com',
  ),
  component: ConstantsPage,
});
