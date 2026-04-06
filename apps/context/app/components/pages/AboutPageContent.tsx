/**
 * @fileoverview About 페이지 공유 컴포넌트
 *
 * 영어/한국어 라우트 파일에서 공통으로 사용하는 UI 컴포넌트입니다.
 * useI18n()을 통해 locale에 따라 자동으로 번역된 텍스트를 표시합니다.
 */

import { Layout } from '@/components/layout';
import { useI18n } from '@/i18n';

export function AboutPageContent() {
  const { t } = useI18n();

  return (
    <Layout>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-4">
          {t('aboutTitle')}
        </h1>
        <p className="text-(--text-secondary) mb-6">{t('aboutDescription')}</p>
        <div className="space-y-3 text-(--text-secondary)">
          <p>{t('aboutContent')}</p>
          <p>{t('aboutContentExtra')}</p>
        </div>
      </div>
    </Layout>
  );
}
