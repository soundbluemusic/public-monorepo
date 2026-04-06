/**
 * @fileoverview 법적 페이지 (라이선스, 개인정보처리방침, 이용약관) 공유 컴포넌트
 *
 * license, privacy, terms 라우트에서 공통으로 사용하는 UI 컴포넌트입니다.
 * titleKey와 contentKey를 받아 해당 번역 텍스트를 표시합니다.
 */

import { Layout } from '@/components/layout';
import { type MessageKey, useI18n } from '@/i18n';

interface LegalPageContentProps {
  titleKey: MessageKey;
  contentKey: MessageKey;
}

export function LegalPageContent({ titleKey, contentKey }: LegalPageContentProps) {
  const { t } = useI18n();

  return (
    <Layout>
      <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-6">
        {t(titleKey)}
      </h1>
      <div className="text-(--text-secondary)">
        <p>{t(contentKey)}</p>
      </div>
    </Layout>
  );
}
