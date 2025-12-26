import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';
import styles from '@/styles/pages.module.scss';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');

  if (isKorean) {
    return [
      { title: '소개 - Context' },
      { name: 'description', content: 'Context 한국어 사전 소개' },
    ];
  }

  return [
    { title: 'About - Context' },
    { name: 'description', content: 'About Context Korean Dictionary' },
  ];
};

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <Layout>
      <div>
        <h1 className={`${styles.pageTitle} ${styles.mb4}`}>{t('aboutTitle')}</h1>
        <p className={`${styles.textSecondary} ${styles.mb6}`}>{t('aboutDescription')}</p>
        <div className={`${styles.spaceY3} ${styles.textSecondary}`}>
          <p>{t('aboutContent')}</p>
          <p>{t('aboutContentExtra')}</p>
        </div>
      </div>
    </Layout>
  );
}
