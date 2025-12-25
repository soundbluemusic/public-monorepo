import { Layout } from '@/components/layout/Layout';
import { fields } from '@/data/fields';
import { useI18n } from '@/i18n';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  const title = isKorean ? '사이트맵 - Roots' : 'Sitemap - Roots';
  const description = isKorean
    ? 'Roots 사이트의 모든 페이지와 수학 분야 목록'
    : 'Complete list of all pages and math fields on Roots';

  return [{ title }, { name: 'description', content: description }];
};

const pages = [
  { path: '/', labelEn: 'Home', labelKo: '홈', icon: '🏠' },
  { path: '/browse', labelEn: 'Browse', labelKo: '찾아보기', icon: '📚' },
  { path: '/search', labelEn: 'Search', labelKo: '검색', icon: '🔍' },
  { path: '/favorites', labelEn: 'Favorites', labelKo: '즐겨찾기', icon: '❤️' },
  { path: '/constants', labelEn: 'Constants', labelKo: '수학 상수', icon: 'π' },
  { path: '/about', labelEn: 'About', labelKo: '소개', icon: 'ℹ️' },
];

export default function SitemapPage() {
  const { locale, localePath } = useI18n();
  const isKorean = locale === 'ko';

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {isKorean ? '사이트맵' : 'Sitemap'}
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          {isKorean
            ? 'Roots 사이트의 모든 페이지를 한눈에 보세요.'
            : 'View all pages on Roots at a glance.'}
        </p>

        {/* Pages Section */}
        <section className="mb-10">
          <h2
            className="text-xl font-semibold mb-4 flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <span>📄</span>
            {isKorean ? '모든 페이지' : 'All Pages'}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pages.map((page) => (
              <li key={page.path}>
                <Link
                  to={localePath(page.path)}
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <span className="text-xl">{page.icon}</span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {isKorean ? page.labelKo : page.labelEn}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Math Fields Section */}
        <section className="mb-10">
          <h2
            className="text-xl font-semibold mb-4 flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <span>📐</span>
            {isKorean ? '수학 분야' : 'Math Fields'}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fields.map((field) => (
              <li key={field.id}>
                <Link
                  to={localePath(`/field/${field.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <span className="text-xl">{field.icon}</span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {isKorean ? field.name.ko : field.name.en}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* XML Sitemap Section */}
        <section
          className="p-6 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <h2
            className="text-lg font-semibold mb-3 flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <span>🔍</span>
            {isKorean ? '검색엔진용 사이트맵' : 'Search Engine Sitemap'}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {isKorean
              ? 'XML 형식의 사이트맵을 직접 확인할 수 있습니다.'
              : 'View the XML sitemap directly.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              sitemap.xml
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
