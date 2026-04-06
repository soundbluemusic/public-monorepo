/**
 * @fileoverview 내 학습 현황 페이지 - 한국어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { MyLearningPageContent } from '@/components/pages/MyLearningPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/ko/my-learning')({
  head: headFactory(
    {
      ko: { title: '내 학습 현황 - Context', description: '학습 진행도와 북마크한 단어 확인' },
      en: {
        title: 'My Learning - Context',
        description: 'Track your learning progress and bookmarks',
      },
    },
    APP_CONFIG.baseUrl,
  ),
  component: MyLearningPage,
});

function MyLearningPage() {
  return <MyLearningPageContent />;
}
