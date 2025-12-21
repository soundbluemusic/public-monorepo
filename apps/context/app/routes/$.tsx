import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  return [
    {
      title: isKorean
        ? '404 - 페이지를 찾을 수 없습니다 | Context'
        : '404 - Page Not Found | Context',
    },
  ];
};

export default function NotFound() {
  const { t, localePath } = useI18n();

  return (
    <Layout>
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('pageNotFound')}
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          {t('pageNotFoundDescription')}
        </p>
        <Link
          to={localePath('/')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors"
          style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
        >
          {t('goHome')}
        </Link>
      </div>
    </Layout>
  );
}
