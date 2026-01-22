import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ExternalLink, FileText, Globe, Home, Package, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import DocsLayout from '../../components/layout/DocsLayout';

const localizedMeta = {
  ko: { title: '사이트맵 - Permissive', description: 'Permissive 사이트의 모든 페이지 목록' },
  en: { title: 'Sitemap - Permissive', description: 'Complete list of all pages on Permissive' },
};

export const Route = createFileRoute('/ko/sitemap')({
  head: headFactoryKo(localizedMeta, 'https://permissive.soundbluemusic.com'),
  component: SitemapPageKo,
});

const pages: { path: string; labelEn: string; labelKo: string; icon: ReactNode }[] = [
  { path: '/ko', labelEn: 'Home', labelKo: '홈', icon: <Home size={18} aria-hidden="true" /> },
  {
    path: '/ko/web-api',
    labelEn: 'Web API',
    labelKo: 'Web API',
    icon: <Globe size={18} aria-hidden="true" />,
  },
  {
    path: '/ko/libraries',
    labelEn: 'Libraries',
    labelKo: 'Libraries',
    icon: <Package size={18} aria-hidden="true" />,
  },
];

function SitemapPageKo() {
  const _locale = 'ko';
  const _localePath = (path: string) => `/ko${path}`;
  const _isKorean = true;

  return (
    <DocsLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-(--text-primary) mb-2">사이트맵</h1>
        <p className="text-(--text-secondary) mb-8">
          Permissive 사이트의 모든 페이지를 한눈에 보세요.
        </p>

        {/* Pages Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
            <FileText size={20} aria-hidden="true" />
            모든 페이지
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {pages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="flex items-center gap-3 p-3 rounded-lg bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:border-(--border-focus) hover:shadow-sm"
              >
                <span className="text-(--accent-primary)">{page.icon}</span>
                <span className="text-(--text-primary) font-medium">{page.labelKo}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* XML Sitemap Section */}
        <section className="p-6 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-2 flex items-center gap-2">
            <Search size={20} aria-hidden="true" />
            검색엔진용 사이트맵
          </h2>
          <p className="text-sm text-(--text-secondary) mb-4">
            검색엔진이 사이트를 색인하는 데 사용하는 XML 사이트맵입니다.
          </p>
          <ul className="space-y-3">
            {[
              { path: '/sitemap.xml', labelEn: 'Sitemap Index', labelKo: '사이트맵 인덱스' },
              { path: '/sitemap-pages.xml', labelEn: 'Pages Sitemap', labelKo: '페이지 사이트맵' },
              {
                path: '/sitemap-libraries.xml',
                labelEn: 'Libraries Sitemap',
                labelKo: '라이브러리 사이트맵',
              },
              {
                path: '/sitemap-webapi.xml',
                labelEn: 'Web API Sitemap',
                labelKo: 'Web API 사이트맵',
              },
            ].map((sitemap) => (
              <li key={sitemap.path}>
                <a
                  href={sitemap.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-(--accent-primary) hover:underline"
                >
                  {sitemap.labelKo}
                  <ExternalLink size={14} className="opacity-60" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DocsLayout>
  );
}
