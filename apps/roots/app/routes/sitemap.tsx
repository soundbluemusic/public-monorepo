import { BookOpen, FileText, Heart, Home, Info, Pi, Ruler, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import { Layout } from '@/components/layout/Layout';
import { fields } from '@/data/fields';
import { useI18n } from '@/i18n';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  const title = isKorean ? '사이트맵 - Roots' : 'Sitemap - Roots';
  const description = isKorean
    ? 'Roots 사이트의 모든 페이지와 수학 분야 목록'
    : 'Complete list of all pages and math fields on Roots';

  return [{ title }, { name: 'description', content: description }];
};

const pages: { path: string; labelEn: string; labelKo: string; icon: ReactNode }[] = [
  { path: '/', labelEn: 'Home', labelKo: '홈', icon: <Home size={18} aria-hidden="true" /> },
  {
    path: '/browse',
    labelEn: 'Browse',
    labelKo: '찾아보기',
    icon: <BookOpen size={18} aria-hidden="true" />,
  },
  {
    path: '/search',
    labelEn: 'Search',
    labelKo: '검색',
    icon: <Search size={18} aria-hidden="true" />,
  },
  {
    path: '/favorites',
    labelEn: 'Favorites',
    labelKo: '즐겨찾기',
    icon: <Heart size={18} aria-hidden="true" />,
  },
  {
    path: '/constants',
    labelEn: 'Constants',
    labelKo: '수학 상수',
    icon: <Pi size={18} aria-hidden="true" />,
  },
  {
    path: '/about',
    labelEn: 'About',
    labelKo: '소개',
    icon: <Info size={18} aria-hidden="true" />,
  },
];

export default function SitemapPage() {
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
            ? 'Roots 사이트의 모든 페이지를 한눈에 보세요.'
            : 'View all pages on Roots at a glance.'}
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

        {/* Math Fields Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
            <Ruler size={20} aria-hidden="true" />
            {isKorean ? '수학 분야' : 'Math Fields'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {fields.map((field) => (
              <Link
                key={field.id}
                to={localePath(`/field/${field.id}`)}
                className="flex items-center gap-3 p-3 rounded-lg bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:border-(--border-focus) hover:shadow-sm"
              >
                <span className="text-2xl">{field.icon}</span>
                <span className="text-(--text-primary) font-medium">
                  {isKorean ? field.name.ko : field.name.en}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* XML Sitemap Section */}
        <section className="p-6 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-2 flex items-center gap-2">
            <Search size={20} aria-hidden="true" />
            {isKorean ? '검색엔진용 사이트맵' : 'Search Engine Sitemap'}
          </h2>
          <p className="text-sm text-(--text-secondary) mb-4">
            {isKorean
              ? 'XML 형식의 사이트맵을 직접 확인할 수 있습니다.'
              : 'View the XML sitemap directly.'}
          </p>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
          >
            sitemap.xml
          </a>
        </section>
      </div>
    </Layout>
  );
}
