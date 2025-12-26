import { Layout } from '@/components/Layout';
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
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6">
        {t('termsTitle')}
      </h1>
      <div className="text-[var(--text-secondary)]">
        <p>{t('termsContent')}</p>
      </div>
    </Layout>
  );
}
