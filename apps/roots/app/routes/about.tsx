import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';

export function meta() {
  return [
    { title: 'About - Roots' },
    { name: 'description', content: 'About Roots - Math documentation for learners' },
  ];
}

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        {t('aboutTitle')}
      </h1>

      <div className="prose" style={{ color: 'var(--text-secondary)' }}>
        <p className="text-lg mb-4">{t('aboutDescription')}</p>

        <h2 className="text-xl font-semibold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>
          Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>18 major math fields from foundations to applied mathematics</li>
          <li>Native math rendering with Unicode and MathML</li>
          <li>Difficulty levels for all concepts (Elementary to Graduate)</li>
          <li>Related concepts navigation</li>
          <li>Multi-language support (Korean, English)</li>
          <li>Dark mode support</li>
          <li>PWA - works offline</li>
        </ul>
      </div>
    </Layout>
  );
}
