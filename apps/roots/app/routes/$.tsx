import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';
import { Link } from 'react-router';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const locale = location.pathname.startsWith('/ko') ? 'ko' : 'en';
  const title = locale === 'ko' ? '404 - 수리' : '404 - Roots';
  const description = locale === 'ko' ? '페이지를 찾을 수 없습니다' : 'Page not found';
  return [{ title }, { name: 'description', content: description }];
};

export default function NotFound() {
  const { t, localePath } = useI18n();

  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          404
        </h1>
        <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
          {t('pageNotFoundMsg')}
        </p>
        <Link
          to={localePath('/')}
          className="inline-block px-6 py-3 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
          }}
        >
          {t('goBackHome')}
        </Link>
      </div>
    </Layout>
  );
}
