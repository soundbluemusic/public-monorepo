import { metaFactory } from '@soundblue/seo/meta';
import { Link } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';

/**
 * loader: HTTP 404 상태 코드 반환
 * catch-all 라우트에서 검색 엔진이 404를 인식하도록 함
 */
export function loader() {
  throw new Response('Not Found', { status: 404 });
}

export const meta = metaFactory(
  {
    ko: { title: '404 - 페이지를 찾을 수 없습니다 | Permissive' },
    en: { title: '404 - Page Not Found | Permissive' },
  },
  'https://permissive.soundbluemusic.com',
);

export default function NotFound() {
  const { locale, localePath } = useI18n();

  return (
    <DocsLayout>
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-(--text-primary) mb-4">
          {locale === 'ko' ? '페이지를 찾을 수 없습니다' : 'Page Not Found'}
        </h1>
        <p className="text-lg text-(--text-secondary) mb-8">
          {locale === 'ko'
            ? '요청하신 페이지가 존재하지 않거나 이동되었습니다.'
            : 'The page you requested does not exist or has been moved.'}
        </p>
        <Link
          to={localePath('/')}
          className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
        >
          {locale === 'ko' ? '홈으로 돌아가기' : 'Go Home'}
        </Link>
      </div>
    </DocsLayout>
  );
}
