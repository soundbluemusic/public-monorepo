import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';
import { Link } from 'react-router';

export function meta() {
  return [{ title: '404 - Page Not Found | Context' }];
}

export default function NotFound() {
  const { locale, localePath } = useI18n();

  return (
    <Layout>
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          {locale === 'ko' ? '페이지를 찾을 수 없습니다' : 'Page Not Found'}
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ko'
            ? '요청하신 페이지가 존재하지 않거나 이동되었습니다.'
            : 'The page you requested does not exist or has been moved.'}
        </p>
        <Link
          to={localePath('/')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors"
          style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
        >
          {locale === 'ko' ? '홈으로 돌아가기' : 'Go Home'}
        </Link>
      </div>
    </Layout>
  );
}
