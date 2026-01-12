import { metaFactory } from '@soundblue/i18n';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { Layout } from '@/components/layout';
import { categories } from '@/data/categories';
import { useI18n } from '@/i18n';

export const meta = metaFactory(
  {
    ko: { title: '사이트맵 - Context' },
    en: { title: 'Sitemap - Context' },
  },
  'https://context.soundbluemusic.com',
);

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

  const xmlSitemaps = [
    { path: '/sitemap.xml', label: locale === 'ko' ? '사이트맵 인덱스' : 'Sitemap Index' },
    { path: '/sitemap-pages.xml', label: locale === 'ko' ? '페이지 사이트맵' : 'Pages Sitemap' },
    {
      path: '/sitemap-categories.xml',
      label: locale === 'ko' ? '카테고리 사이트맵' : 'Categories Sitemap',
    },
    {
      path: '/sitemap-entries.xml',
      label: locale === 'ko' ? '단어 사이트맵' : 'Entries Sitemap',
    },
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

      <section className="mb-8">
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

      <section>
        <h2 className="text-lg font-semibold text-(--text-primary) mb-4">
          {t('searchEngineIndex')}
        </h2>
        <p className="text-sm text-(--text-secondary) mb-4">
          {locale === 'ko'
            ? '검색엔진이 사이트를 색인하는 데 사용하는 XML 사이트맵입니다.'
            : 'XML sitemaps used by search engines to index this site.'}
        </p>
        <ul className="space-y-3">
          {xmlSitemaps.map((sitemap) => (
            <li key={sitemap.path}>
              <a
                href={sitemap.path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-(--accent-primary) hover:underline"
              >
                {sitemap.label}
                <ExternalLink size={14} className="opacity-60" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
