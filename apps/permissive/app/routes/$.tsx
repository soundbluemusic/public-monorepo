import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';
import styles from '../styles/pages.module.scss';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  const title = isKorean
    ? '404 - 페이지를 찾을 수 없습니다 | Permissive'
    : '404 - Page Not Found | Permissive';

  return [{ title }];
};

export default function NotFound() {
  const { locale, localePath } = useI18n();

  return (
    <DocsLayout>
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundEmoji}>🔍</div>
        <h1 className={styles.notFoundTitle}>
          {locale === 'ko' ? '페이지를 찾을 수 없습니다' : 'Page Not Found'}
        </h1>
        <p className={styles.notFoundDescription}>
          {locale === 'ko'
            ? '요청하신 페이지가 존재하지 않거나 이동되었습니다.'
            : 'The page you requested does not exist or has been moved.'}
        </p>
        <Link to={localePath('/')} className={styles.notFoundButton}>
          {locale === 'ko' ? '홈으로 돌아가기' : 'Go Home'}
        </Link>
      </div>
    </DocsLayout>
  );
}
