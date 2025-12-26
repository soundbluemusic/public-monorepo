import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';

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
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
          {locale === 'ko' ? '페이지를 찾을 수 없습니다' : 'Page Not Found'}
        </h1>
        <p className="text-lg text-[var(--text-secondary)] mb-8">
          {locale === 'ko'
            ? '요청하신 페이지가 존재하지 않거나 이동되었습니다.'
            : 'The page you requested does not exist or has been moved.'}
        </p>
        <Link
          to={localePath('/')}
          className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-[var(--accent-primary)] text-white hover:brightness-110 active:scale-[0.98]"
        >
          {locale === 'ko' ? '홈으로 돌아가기' : 'Go Home'}
        </Link>
      </div>
    </DocsLayout>
  );
}
