/**
 * @fileoverview Sitemap page - Context
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  BookMarked,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  Home,
  Info,
  MessageSquareText,
  Search,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import { useI18n } from '@/i18n';

export const Route = createFileRoute('/sitemap')({
  // @ts-expect-error - TanStack Start head function type incompatibility
  head: headFactory(
    {
      ko: {
        title: '사이트맵 - Context',
        description: 'Context 사이트의 모든 페이지 목록',
      },
      en: {
        title: 'Sitemap - Context',
        description: 'Complete list of all pages on Context',
      },
    },
    APP_CONFIG.baseUrl,
  ),
  component: SitemapPage,
});

const pages: { path: string; labelEn: string; labelKo: string; icon: ReactNode }[] = [
  { path: '/', labelEn: 'Home', labelKo: '홈', icon: <Home size={18} aria-hidden="true" /> },
  {
    path: '/browse',
    labelEn: 'Browse',
    labelKo: '둘러보기',
    icon: <FolderOpen size={18} aria-hidden="true" />,
  },
  {
    path: '/conversations',
    labelEn: 'Conversations',
    labelKo: '회화',
    icon: <MessageSquareText size={18} aria-hidden="true" />,
  },
  {
    path: '/bookmarks',
    labelEn: 'Bookmarks',
    labelKo: '북마크',
    icon: <BookMarked size={18} aria-hidden="true" />,
  },
  {
    path: '/download',
    labelEn: 'Download',
    labelKo: '다운로드',
    icon: <Download size={18} aria-hidden="true" />,
  },
  {
    path: '/about',
    labelEn: 'About',
    labelKo: '소개',
    icon: <Info size={18} aria-hidden="true" />,
  },
];

function SitemapPage() {
  const { locale, localePath } = useI18n();
  const isKorean = locale === 'ko';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-(--text-primary) mb-2">
          {isKorean ? '사이트맵' : 'Sitemap'}
        </h1>
        <p className="text-(--text-secondary) mb-8">
          {isKorean
            ? 'Context의 모든 페이지를 한눈에 확인하세요.'
            : 'View all pages on Context at a glance.'}
        </p>

        {/* Pages Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
            <FileText size={20} aria-hidden="true" />
            {isKorean ? '모든 페이지' : 'All Pages'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {pages.map((page) => (
              <Link
                key={page.path}
                to={localePath(page.path)}
                className="flex items-center gap-3 p-3 rounded-lg bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:border-(--border-focus) hover:shadow-sm"
              >
                <span className="text-(--accent-primary)">{page.icon}</span>
                <span className="text-(--text-primary) font-medium">
                  {isKorean ? page.labelKo : page.labelEn}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* XML Sitemap Section */}
        <section className="p-6 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-2 flex items-center gap-2">
            <Search size={20} aria-hidden="true" />
            {isKorean ? '검색 엔진 사이트맵' : 'Search Engine Sitemap'}
          </h2>
          <p className="text-sm text-(--text-secondary) mb-4">
            {isKorean
              ? '검색 엔진이 이 사이트를 색인하는 데 사용하는 XML 사이트맵입니다.'
              : 'XML sitemaps used by search engines to index this site.'}
          </p>
          <ul className="space-y-3">
            {[
              {
                path: '/sitemap.xml',
                labelEn: 'Sitemap Index',
                labelKo: '사이트맵 인덱스',
              },
              {
                path: '/sitemap-pages.xml',
                labelEn: 'Pages Sitemap',
                labelKo: '페이지 사이트맵',
              },
              {
                path: '/sitemap-categories.xml',
                labelEn: 'Categories Sitemap',
                labelKo: '카테고리 사이트맵',
              },
            ].map((sitemap) => (
              <li key={sitemap.path}>
                <a
                  href={sitemap.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-(--accent-primary) hover:underline"
                >
                  {isKorean ? sitemap.labelKo : sitemap.labelEn}
                  <ExternalLink size={14} className="opacity-60" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
}
