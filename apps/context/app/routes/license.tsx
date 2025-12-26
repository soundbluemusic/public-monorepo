import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';
import styles from '@/styles/app.module.scss';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  return [{ title: isKorean ? '라이선스 - Context' : 'License - Context' }];
};

export default function LicensePage() {
  const { t } = useI18n();

  return (
    <Layout>
      <h1 className={`${styles.pageTitle} ${styles.mb6}`}>{t('licenseTitle')}</h1>
      <div className={styles.textSecondary}>
        <p>{t('licenseContent')}</p>
      </div>
    </Layout>
  );
}
