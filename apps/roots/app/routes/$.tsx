import { metaFactory } from '@soundblue/i18n';
import { Link } from 'react-router';
import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';

export const meta = metaFactory({
  ko: { title: '404 - 수리', description: '페이지를 찾을 수 없습니다' },
  en: { title: '404 - Roots', description: 'Page not found' },
});

export default function NotFound() {
  const { t, localePath } = useI18n();

  return (
    <Layout>
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-(--text-primary) mb-4">404</h1>
        <p className="text-lg text-(--text-secondary) mb-8">{t('pageNotFoundMsg')}</p>
        <Link
          to={localePath('/')}
          className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-bg) text-white hover:brightness-110 active:scale-[0.98]"
        >
          {t('goBackHome')}
        </Link>
      </div>
    </Layout>
  );
}
