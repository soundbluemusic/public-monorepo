import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { useI18n } from '@/i18n';
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
      <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-6">{t('sitemap')}</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-(--text-primary) mb-4">{t('allPages')}</h2>
        <ul className="space-y-3">
          {pages.map((page) => (
            <li key={page.path}>
              <Link to={localePath(page.path)} className="text-(--accent-primary) hover:underline">
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-(--text-primary) mb-4">{t('allCategories')}</h2>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={localePath(`/category/${category.id}`)}
                className="flex items-center gap-2 text-(--accent-primary) hover:underline"
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
