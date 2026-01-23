/**
 * @fileoverview 라이선스 페이지 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import { useI18n } from '@/i18n';

export const Route = createFileRoute('/license')({
  // @ts-expect-error - TanStack Start head function type incompatibility
  head: headFactory(
    {
      ko: { title: '라이선스 - Context' },
      en: { title: 'License - Context' },
    },
    APP_CONFIG.baseUrl,
  ),
  component: LicensePage,
});

function LicensePage() {
  const { t } = useI18n();

  return (
    <Layout>
      <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-6">
        {t('licenseTitle')}
      </h1>
      <div className="text-(--text-secondary)">
        <p>{t('licenseContent')}</p>
      </div>
    </Layout>
  );
}
