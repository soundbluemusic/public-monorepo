import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  const title = isKorean ? 'Permissive - 무료 웹개발 도구 모음' : 'Permissive - Free Web Dev Tools';
  const description = isKorean
    ? '웹표준 API와 MIT 라이센스 라이브러리를 한눈에 보세요'
    : 'Web Standard APIs and MIT licensed libraries at a glance';

  return [{ title }, { name: 'description', content: description }];
};

export default function Home() {
  const { locale, localePath } = useI18n();

  return (
    <DocsLayout>
      {/* Hero */}
      <div className="text-center py-12 sm:py-20">
        <h1
          className="text-4xl sm:text-5xl font-bold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          {locale === 'ko' ? '무료 웹개발 도구 모음' : 'Free Web Dev Tools'}
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ko'
            ? '웹표준 API와 MIT 라이센스 라이브러리를 한눈에 보세요'
            : 'Web Standard APIs and MIT licensed libraries at a glance'}
        </p>
      </div>

      {/* Two Main Cards */}
      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Web API Card */}
        <Link
          to={localePath('/web-api')}
          className="group relative p-8 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '2px solid var(--border-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
          }}
        >
          <div className="text-5xl mb-4">🌐</div>
          <h2
            className="text-2xl font-bold mb-2 transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            Web API
          </h2>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            {locale === 'ko'
              ? '브라우저 내장 API. 설치 없이 무료로 사용'
              : 'Browser built-in APIs. Free to use, no installation'}
          </p>
          <div
            className="flex items-center text-sm font-medium"
            style={{ color: 'var(--accent-primary)' }}
          >
            {locale === 'ko' ? '둘러보기' : 'Browse'}
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Libraries Card */}
        <Link
          to={localePath('/libraries')}
          className="group relative p-8 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '2px solid var(--border-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
          }}
        >
          <div className="text-5xl mb-4">📦</div>
          <h2
            className="text-2xl font-bold mb-2 transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            Libraries
          </h2>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            {locale === 'ko'
              ? 'MIT 라이센스 오픈소스. 상업적 사용 가능'
              : 'MIT licensed open source. Free for commercial use'}
          </p>
          <div
            className="flex items-center text-sm font-medium"
            style={{ color: 'var(--accent-primary)' }}
          >
            {locale === 'ko' ? '둘러보기' : 'Browse'}
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Built with section */}
      <div className="mt-16 text-center">
        <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
          {locale === 'ko'
            ? '이 사이트도 여기 있는 도구로 만들었어요'
            : 'This site is built with tools listed here'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span
            className="px-3 py-1.5 rounded-full text-sm"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            React
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-sm"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            Tailwind CSS
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-sm"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            TypeScript
          </span>
        </div>
      </div>
    </DocsLayout>
  );
}
