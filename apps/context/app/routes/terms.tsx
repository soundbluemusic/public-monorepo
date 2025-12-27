import { Layout } from '@/components/layout';
import { useI18n } from '@/i18n';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  return [{ title: isKorean ? '이용약관 - Context' : 'Terms of Service - Context' }];
};

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
