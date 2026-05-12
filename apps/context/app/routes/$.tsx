import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import { useI18n } from '@/i18n';

export const Route = createFileRoute('/$')({
  loader: () => {
    throw notFound();
  },
  head: headFactory(
    {
      ko: {
        title: '404 - 페이지를 찾을 수 없습니다 | Context',
        description: '페이지를 찾을 수 없습니다',
      },
      en: { title: '404 - Page Not Found | Context', description: 'Page not found' },
    },
    APP_CONFIG.baseUrl,
  ),
  component: NotFound,
});

function NotFound() {
  const { t, localePath, locale } = useI18n();

  return (
    <Layout>
      <main className="text-center py-20">
        <div className="text-6xl mb-6" aria-hidden="true">
          🔍
        </div>
        <h1 className="text-3xl font-bold mb-4 text-(--text-primary)">{t('pageNotFound')}</h1>
        <p className="text-(--text-secondary) mb-8">{t('pageNotFoundDescription')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to={localePath('/')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98] no-underline"
          >
            {t('goHome')}
          </Link>
          <Link
            to={localePath('/browse')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--bg-tertiary) text-(--text-primary) hover:bg-(--border-primary) no-underline"
          >
            {locale === 'ko' ? '단어 둘러보기' : 'Browse Words'}
          </Link>
          <Link
            to={localePath('/categories')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--bg-tertiary) text-(--text-primary) hover:bg-(--border-primary) no-underline"
          >
            {locale === 'ko' ? '카테고리' : 'Categories'}
          </Link>
        </div>
      </main>
    </Layout>
  );
}
