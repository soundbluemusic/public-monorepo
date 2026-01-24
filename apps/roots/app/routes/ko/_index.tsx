/**
 * @fileoverview 홈페이지 (한글) - Apple 스타일 미니멀 디자인
 */

import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '../../components/pages';

export const Route = createFileRoute('/ko/_index')({
  head: headFactoryKo(
    {
      ko: {
        title: '수리 - 수학 문서',
        description: '누구나 쉽게 배우는 수학 개념 사전',
        keywords: ['수학 개념', '수학 공식', '수학 용어', '수학 사전', '수학 문서'],
      },
      en: {
        title: 'Roots - Math Documentation',
        description: 'Learn math concepts easily',
        keywords: [
          'math concepts',
          'math formulas',
          'math dictionary',
          'math documentation',
          'learn math',
        ],
      },
    },
    'https://roots.soundbluemusic.com',
  ),
  component: HomePage,
});
