import { metaFactory } from '@soundblue/i18n';
import { Layout } from '@/components/layout';
import { useI18n } from '@/i18n';

export const meta = metaFactory(
  {
    ko: { title: '개인정보처리방침 - Context' },
    en: { title: 'Privacy Policy - Context' },
  },
  'https://context.soundbluemusic.com',
);

export default function PrivacyPage() {
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
