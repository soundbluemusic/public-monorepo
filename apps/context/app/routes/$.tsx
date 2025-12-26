import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';
import styles from '@/styles/app.module.scss';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  return [
    {
      title: isKorean
        ? '404 - 페이지를 찾을 수 없습니다 | Context'
        : '404 - Page Not Found | Context',
    },
  ];
};

export default function NotFound() {
  const { t, localePath } = useI18n();

  return (
    <Layout>
      <div className={`${styles.textCenter}`} style={{ padding: '5rem 0' }}>
        <div className={`${styles.mb6}`} style={{ fontSize: '3.75rem' }}>
          🔍
        </div>
        <h1 className={`${styles.text3xl} ${styles.fontBold} ${styles.mb4} ${styles.textPrimary}`}>
          {t('pageNotFound')}
        </h1>
        <p className={`${styles.textSecondary} ${styles.mb8}`}>{t('pageNotFoundDescription')}</p>
        <Link to={localePath('/')} className={styles.buttonPrimary}>
          {t('goHome')}
        </Link>
      </div>
    </Layout>
  );
}
