import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute, Link } from '@tanstack/react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';

const localizedMeta = {
  ko: { title: '404 - 페이지를 찾을 수 없습니다 | Permissive' },
  en: { title: '404 - Page Not Found | Permissive' },
};

export const Route = createFileRoute('/$')({
  loader: () => {
    throw new Response('Not Found', { status: 404 });
  },
  head: headFactoryEn(localizedMeta, 'https://permissive.soundbluemusic.com'),
  component: NotFound,
});

function NotFound() {
  const { locale, localePath } = useI18n();

  const messages =
    locale === 'ko'
      ? {
          title: '페이지를 찾을 수 없습니다',
          description: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
          home: '홈으로',
          libraries: '라이브러리 둘러보기',
          webApi: 'Web API',
        }
      : {
          title: 'Page Not Found',
          description: 'The page you requested does not exist or has been moved.',
          home: 'Go Home',
          libraries: 'Browse Libraries',
          webApi: 'Web APIs',
        };

  return (
    <DocsLayout>
      <main className="text-center py-20">
        <div className="text-6xl mb-6" aria-hidden="true">
          🔍
        </div>
        <h1 className="text-4xl font-bold text-(--text-primary) mb-4">{messages.title}</h1>
        <p className="text-lg text-(--text-secondary) mb-8">{messages.description}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to={localePath('/')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98] no-underline"
          >
            {messages.home}
          </Link>
          <Link
            to={localePath('/libraries')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--bg-tertiary) text-(--text-primary) hover:bg-(--border-primary) no-underline"
          >
            {messages.libraries}
          </Link>
          <Link
            to={localePath('/web-api')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--bg-tertiary) text-(--text-primary) hover:bg-(--border-primary) no-underline"
          >
            {messages.webApi}
          </Link>
        </div>
      </main>
    </DocsLayout>
  );
}
