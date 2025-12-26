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
        <h1 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">{t('pageNotFound')}</h1>
        <p className="text-[var(--text-secondary)] mb-8">{t('pageNotFoundDescription')}</p>
        <Link
          to={localePath('/')}
          className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-[var(--accent-primary)] text-white hover:brightness-110 active:scale-[0.98]"
        >
          {t('goHome')}
        </Link>
      </div>
    </Layout>
  );
}
