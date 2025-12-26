import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';
import { Link } from 'react-router';
import type { MetaFunction } from 'react-router';
import styles from '../styles/pages.module.scss';

export const meta: MetaFunction = ({ location }) => {
  const locale = location.pathname.startsWith('/ko') ? 'ko' : 'en';
  const title = locale === 'ko' ? '404 - 수리' : '404 - Roots';
  const description = locale === 'ko' ? '페이지를 찾을 수 없습니다' : 'Page not found';
  return [{ title }, { name: 'description', content: description }];
};

export default function NotFound() {
  const { t, localePath } = useI18n();

  return (
    <Layout>
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundEmoji}>🔍</div>
        <h1 className={styles.notFoundTitle}>404</h1>
        <p className={styles.notFoundDescription}>{t('pageNotFoundMsg')}</p>
        <Link to={localePath('/')} className={styles.notFoundButton}>
          {t('goBackHome')}
        </Link>
      </div>
    </Layout>
  );
}
