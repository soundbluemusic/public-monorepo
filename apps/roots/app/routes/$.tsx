import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';
import { Link } from 'react-router';

export function meta() {
  return [{ title: '404 - Roots' }, { name: 'description', content: 'Page not found' }];
}

export default function NotFound() {
  const { locale, localePath } = useI18n();

  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          404
        </h1>
        <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ko' ? '페이지를 찾을 수 없습니다' : 'Page not found'}
        </p>
        <Link
          to={localePath('/')}
          className="inline-block px-6 py-3 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
          }}
        >
          {locale === 'ko' ? '홈으로 돌아가기' : 'Go back home'}
        </Link>
      </div>
    </Layout>
  );
}
