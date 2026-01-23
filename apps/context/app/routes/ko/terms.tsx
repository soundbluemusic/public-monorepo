/**
 * @fileoverview 이용약관 페이지 - 한국어 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import { useI18n } from '@/i18n';

export const Route = createFileRoute('/ko/terms')({
  // @ts-expect-error - TanStack Start head function type incompatibility
  head: headFactory(
    {
      ko: { title: '이용약관 - Context' },
      en: { title: 'Terms of Service - Context' },
    },
    APP_CONFIG.baseUrl,
  ),
  component: TermsPage,
});

function TermsPage() {
  const { t } = useI18n();

  return (
    <Layout>
      <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-6">
        {t('termsTitle')}
      </h1>
      <div className="text-(--text-secondary)">
        <p>{t('termsContent')}</p>
      </div>
    </Layout>
  );
}
