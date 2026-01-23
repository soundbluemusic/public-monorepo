/**
 * @fileoverview 개인정보처리방침 페이지 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import { useI18n } from '@/i18n';

export const Route = createFileRoute('/privacy')({
  // @ts-expect-error - TanStack Start head function type incompatibility
  head: headFactory(
    {
      ko: { title: '개인정보처리방침 - Context' },
      en: { title: 'Privacy Policy - Context' },
    },
    APP_CONFIG.baseUrl,
  ),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useI18n();

  return (
    <Layout>
      <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-6">
        {t('privacyTitle')}
      </h1>
      <div className="text-(--text-secondary)">
        <p>{t('privacyContent')}</p>
      </div>
    </Layout>
  );
}
