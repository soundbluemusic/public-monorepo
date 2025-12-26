import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';
import styles from '@/styles/app.module.scss';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  return [{ title: isKorean ? '이용약관 - Context' : 'Terms of Service - Context' }];
};

export default function TermsPage() {
  const { t } = useI18n();

  return (
    <Layout>
      <h1 className={`${styles.pageTitle} ${styles.mb6}`}>{t('termsTitle')}</h1>
      <div className={styles.textSecondary}>
        <p>{t('termsContent')}</p>
      </div>
    </Layout>
  );
}
