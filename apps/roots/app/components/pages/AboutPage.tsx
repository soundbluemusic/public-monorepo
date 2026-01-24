/**
 * @fileoverview 공유 AboutPage 컴포넌트
 */

import { useI18n } from '../../i18n';
import { Layout } from '../layout/Layout';

export function AboutPage() {
  const { t } = useI18n();

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-(--text-primary) mb-8">{t('aboutTitle')}</h1>

      <div className="prose prose-lg max-w-none text-(--text-secondary)">
        <p className="text-lg leading-relaxed mb-6">{t('aboutDescription')}</p>

        <h2 className="text-xl font-semibold text-(--text-primary) mt-8 mb-4">{t('features')}</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>{t('feature1')}</li>
          <li>{t('feature2')}</li>
          <li>{t('feature3')}</li>
          <li>{t('feature4')}</li>
          <li>{t('feature5')}</li>
          <li>{t('feature6')}</li>
          <li>{t('feature7')}</li>
          <li>{t('feature8')}</li>
        </ul>
      </div>
    </Layout>
  );
}
