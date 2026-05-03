import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { Layout } from '../components/layout/Layout';
import { useI18n } from '../i18n';

const buildHead = headFactory(
  {
    ko: { title: '404 - 수리', description: '페이지를 찾을 수 없습니다' },
    en: { title: '404 - Roots', description: 'Page not found' },
  },
  'https://roots.soundbluemusic.com',
);

export const Route = createFileRoute('/$')({
  loader: () => {
    throw notFound();
  },
  // ctx에는 location이 포함되어 있어 한/영 메타가 올바르게 분기됨
  head: (ctx) => {
    const config = buildHead(ctx);
    return {
      ...config,
      // 검색 엔진 인덱싱 차단
      meta: [...(config.meta ?? []), { name: 'robots', content: 'noindex, nofollow' }],
    };
  },
  component: NotFound,
});

function NotFound() {
  const { t, locale, localePath } = useI18n();

  return (
    <Layout>
      <main className="text-center py-20">
        <div className="text-6xl mb-6" aria-hidden="true">
          🔍
        </div>
        <h1 className="text-4xl font-bold text-(--text-primary) mb-4">404</h1>
        <p className="text-lg text-(--text-secondary) mb-8">{t('pageNotFoundMsg')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to={localePath('/')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-bg) text-white hover:brightness-110 active:scale-[0.98] no-underline"
          >
            {t('goBackHome')}
          </Link>
          <Link
            to={localePath('/browse')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--bg-tertiary) text-(--text-primary) hover:bg-(--border-primary) no-underline"
          >
            {locale === 'ko' ? '개념 둘러보기' : 'Browse Concepts'}
          </Link>
        </div>
      </main>
    </Layout>
  );
}
