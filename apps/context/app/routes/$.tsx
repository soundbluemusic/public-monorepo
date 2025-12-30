import { metaFactory } from '@soundblue/i18n';
import { Link } from 'react-router';
import { Layout } from '@/components/layout';
import { useI18n } from '@/i18n';

export const meta = metaFactory({
  ko: { title: '404 - 페이지를 찾을 수 없습니다 | Context' },
  en: { title: '404 - Page Not Found | Context' },
});

export default function NotFound() {
  const { t, localePath } = useI18n();

  return (
    <Layout>
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold mb-4 text-(--text-primary)">{t('pageNotFound')}</h1>
        <p className="text-(--text-secondary) mb-8">{t('pageNotFoundDescription')}</p>
        <Link
          to={localePath('/')}
          className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
        >
          {t('goHome')}
        </Link>
      </div>
    </Layout>
  );
}
