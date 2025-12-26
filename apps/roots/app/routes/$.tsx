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
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">404</h1>
        <p className="text-lg text-[var(--text-secondary)] mb-8">{t('pageNotFoundMsg')}</p>
        <Link
          to={localePath('/')}
          className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-[var(--accent-primary)] text-white hover:brightness-110 active:scale-[0.98]"
        >
          {t('goBackHome')}
        </Link>
      </div>
    </Layout>
  );
}
