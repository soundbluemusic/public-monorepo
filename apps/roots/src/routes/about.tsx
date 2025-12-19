import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';
import { Meta, Title } from '@solidjs/meta';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <Layout>
      <Title>{t('aboutTitle')} - Suri</Title>
      <Meta name="description" content={t('aboutDescription')} />

      <h1 class="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        {t('aboutTitle')}
      </h1>

      <div class="prose" style={{ color: 'var(--text-secondary)' }}>
        <p class="text-lg mb-4">{t('aboutDescription')}</p>

        <h2 class="text-xl font-semibold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>
          Features
        </h2>
        <ul class="list-disc list-inside space-y-2">
          <li>18 major math fields from foundations to applied mathematics</li>
          <li>LaTeX formula rendering with KaTeX</li>
          <li>Difficulty levels for all concepts (Elementary to Graduate)</li>
          <li>Related concepts navigation</li>
          <li>Multi-language support (Korean, English, Japanese)</li>
          <li>Dark mode support</li>
          <li>PWA - works offline</li>
        </ul>
      </div>
    </Layout>
  );
}
