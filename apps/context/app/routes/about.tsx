import { metaFactory } from '@soundblue/i18n';
import { Layout } from '@/components/layout';
import { useI18n } from '@/i18n';

export const meta = metaFactory({
  ko: { title: '소개 - Context', description: 'Context 한국어 사전 소개' },
  en: { title: 'About - Context', description: 'About Context Korean Dictionary' },
});

export default function AboutPage() {
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
