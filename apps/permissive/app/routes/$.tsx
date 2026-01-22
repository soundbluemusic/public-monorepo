import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute, Link } from '@tanstack/react-router';
import DocsLayout from '../components/layout/DocsLayout';

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
  const _locale = 'en';
  const _localePath = (path: string) => path;

  return (
    <DocsLayout>
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-(--text-primary) mb-4">Page Not Found</h1>
        <p className="text-lg text-(--text-secondary) mb-8">
          The page you requested does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
        >
          Go Home
        </Link>
      </div>
    </DocsLayout>
  );
}
