/**
 * @fileoverview About 페이지 - 한국어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import { useI18n } from '@/i18n';

export const Route = createFileRoute('/ko/about')({
  // @ts-expect-error - TanStack Start head function type incompatibility
  head: headFactory(
    {
      ko: { title: '소개 - Context', description: 'Context 한국어 사전 소개' },
      en: { title: 'About - Context', description: 'About Context Korean Dictionary' },
    },
    APP_CONFIG.baseUrl,
  ),
  component: AboutPage,
});

function AboutPage() {
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
