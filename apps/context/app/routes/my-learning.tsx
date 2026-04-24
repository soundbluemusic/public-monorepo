/**
 * @fileoverview 내 학습 현황 페이지 - 영어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { MyLearningPageContent, myLearningMeta } from '@/components/pages/MyLearningPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/my-learning')({
  head: headFactory(myLearningMeta, APP_CONFIG.baseUrl),
  component: MyLearningPage,
});

function MyLearningPage() {
  return <MyLearningPageContent />;
}
