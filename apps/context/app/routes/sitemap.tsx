import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { useI18n } from '@/i18n';
import styles from '@/styles/app.module.scss';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  return [{ title: isKorean ? '사이트맵 - Context' : 'Sitemap - Context' }];
};

export default function SitemapPage() {
  const { locale, t, localePath } = useI18n();

  const pages = [
    { path: '/', label: t('home') },
    { path: '/browse', label: t('browse') },
    { path: '/about', label: t('about') },
    { path: '/privacy', label: t('privacy') },
    { path: '/terms', label: t('terms') },
    { path: '/license', label: t('license') },
  ];

  return (
    <Layout>
      <h1 className={`${styles.pageTitle} ${styles.mb6}`}>{t('sitemap')}</h1>

      <section className={styles.sectionLarge}>
        <h2 className={`${styles.sectionTitle} ${styles.mb4}`}>{t('allPages')}</h2>
        <ul className={styles.spaceY3}>
          {pages.map((page) => (
            <li key={page.path}>
              <Link to={localePath(page.path)} className={styles.link}>
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className={`${styles.sectionTitle} ${styles.mb4}`}>{t('allCategories')}</h2>
        <ul className={styles.spaceY3}>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={localePath(`/category/${category.id}`)}
                className={`${styles.flexStart} ${styles.flexGap2} ${styles.link}`}
              >
                <span>{category.icon}</span>
                {category.name[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
