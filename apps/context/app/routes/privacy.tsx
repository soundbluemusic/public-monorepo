import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';
import styles from '@/styles/pages.module.scss';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  return [{ title: isKorean ? '개인정보처리방침 - Context' : 'Privacy Policy - Context' }];
};

export default function PrivacyPage() {
  const { t } = useI18n();

  return (
    <Layout>
      <h1 className={`${styles.pageTitle} ${styles.mb6}`}>{t('privacyTitle')}</h1>
      <div className={styles.textSecondary}>
        <p>{t('privacyContent')}</p>
      </div>
    </Layout>
  );
}
