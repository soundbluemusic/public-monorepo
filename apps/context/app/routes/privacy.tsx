import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  return [{ title: isKorean ? '개인정보처리방침 - Context' : 'Privacy Policy - Context' }];
};

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
