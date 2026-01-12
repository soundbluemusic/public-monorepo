import { metaFactory } from '@soundblue/i18n';
import { Layout } from '@/components/layout';
import { useI18n } from '@/i18n';

export const meta = metaFactory(
  {
    ko: { title: '라이선스 - Context' },
    en: { title: 'License - Context' },
  },
  'https://context.soundbluemusic.com',
);

export default function LicensePage() {
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
