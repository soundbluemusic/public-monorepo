import { metaFactory } from '@soundblue/i18n';
import { Layout } from '@/components/layout';
import { useI18n } from '@/i18n';

export const meta = metaFactory(
  {
    ko: { title: '이용약관 - Context' },
    en: { title: 'Terms of Service - Context' },
  },
  'https://context.soundbluemusic.com',
);

export default function TermsPage() {
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
