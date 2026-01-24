/**
 * @fileoverview 오픈소스 페이지 (한글)
 */

import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { BuiltWithPage } from '../../components/pages';

export const Route = createFileRoute('/ko/built-with')({
  head: headFactoryKo(
    {
      ko: {
        title: '오픈소스 - Roots',
        description: '이 사이트를 만드는 데 사용된 오픈소스 프로젝트 목록',
      },
      en: {
        title: 'Open source - Roots',
        description: 'Open source projects used to build this site',
      },
    },
    'https://roots.soundbluemusic.com',
  ),
  component: BuiltWithPage,
});
