import { FadeIn } from '@soundblue/ui/animation';
import { ArrowLeft, Calendar, ExternalLink, Github, Package, Scale, Star } from 'lucide-react';
import type { MetaFunction } from 'react-router';
import { Link, useLoaderData } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import {
  getLibraryBySlug,
  getLibrarySlug,
  getRelatedLibraries,
  type Library,
} from '../data/libraries';
import { useI18n } from '../i18n';

export async function loader({ params }: { params: { slug: string } }) {
  const library = getLibraryBySlug(params.slug);
  if (!library) {
    throw new Response('Not Found', { status: 404 });
  }
  const related = getRelatedLibraries(library);
  return { library, related };
}

type LoaderData = { library: Library; related: Library[] };

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  const loaderData = data as LoaderData | undefined;
  if (!loaderData?.library) {
    return [{ title: 'Not Found - Permissive' }];
  }
  const isKorean = location.pathname.startsWith('/ko');
  const lib = loaderData.library;
  return [
    { title: `${lib.name} - Permissive` },
    {
      name: 'description',
      content: isKorean ? lib.descriptionKo : lib.description,
    },
  ];
};

export default function LibraryDetailPage() {
  const { library: lib, related } = useLoaderData<{ library: Library; related: Library[] }>();
  const { locale, localePath } = useI18n();
  const isKorean = locale === 'ko';

  return (
    <DocsLayout>
      <FadeIn>
        {/* Back link */}
        <Link
          to={localePath('/libraries')}
          className="inline-flex items-center gap-2 text-(--text-secondary) hover:text-(--text-primary) transition-colors mb-6"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {isKorean ? '라이브러리 목록' : 'Back to Libraries'}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary)">{lib.name}</h1>
            <div className="flex items-center gap-1 text-(--text-secondary)">
              <Star size={18} aria-hidden="true" className="fill-current text-yellow-500" />
              <span className="font-medium">{lib.stars}</span>
            </div>
          </div>
          <p className="text-lg text-(--text-secondary)">
            {isKorean ? lib.descriptionKo : lib.description}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {lib.trending && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-orange-500/10 text-orange-500">
              🔥 {isKorean ? '트렌딩' : 'Trending'}
            </span>
          )}
          {lib.usedHere && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-500">
              ✨ {isKorean ? '이 사이트에서 사용 중' : 'Used in this site'}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-(--bg-tertiary) text-(--text-secondary)">
            {lib.category}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
            <div className="flex items-center gap-2 text-(--text-tertiary) text-sm mb-1">
              <Scale size={16} aria-hidden="true" />
              {isKorean ? '라이선스' : 'License'}
            </div>
            <div className="font-semibold text-(--text-primary)">{lib.license}</div>
          </div>
          {lib.yearReleased && (
            <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
              <div className="flex items-center gap-2 text-(--text-tertiary) text-sm mb-1">
                <Calendar size={16} aria-hidden="true" />
                {isKorean ? '출시년도' : 'Released'}
              </div>
              <div className="font-semibold text-(--text-primary)">{lib.yearReleased}</div>
            </div>
          )}
          <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
            <div className="flex items-center gap-2 text-(--text-tertiary) text-sm mb-1">
              <Star size={16} aria-hidden="true" />
              {isKorean ? '스타' : 'Stars'}
            </div>
            <div className="font-semibold text-(--text-primary)">{lib.stars}</div>
          </div>
        </div>

        {/* Tags */}
        {lib.tags && lib.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-(--text-tertiary) mb-3">
              {isKorean ? '태그' : 'Tags'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {lib.tags.map((tag) => (
                <Link
                  key={tag}
                  to={localePath(`/libraries?tag=${encodeURIComponent(tag)}`)}
                  className="px-3 py-1 rounded-full text-sm bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary) transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-(--text-tertiary) mb-3">
            {isKorean ? '링크' : 'Links'}
          </h2>
          <div className="flex flex-wrap gap-3">
            <a
              href={lib.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) hover:border-(--border-focus) transition-colors"
            >
              <Github size={18} aria-hidden="true" />
              GitHub
            </a>
            {lib.website && (
              <a
                href={lib.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) hover:border-(--border-focus) transition-colors"
              >
                <ExternalLink size={18} aria-hidden="true" />
                Website
              </a>
            )}
            {lib.npm && (
              <a
                href={`https://www.npmjs.com/package/${lib.npm}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) hover:border-(--border-focus) transition-colors"
              >
                <Package size={18} aria-hidden="true" />
                npm
              </a>
            )}
          </div>
        </div>

        {/* Related Libraries */}
        {related.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-(--text-primary) mb-4">
              {isKorean ? '관련 라이브러리' : 'Related Libraries'}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relLib) => (
                <Link
                  key={relLib.name}
                  to={localePath(`/library/${getLibrarySlug(relLib.name)}`)}
                  className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) hover:border-(--border-focus) transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-medium text-(--text-primary)">{relLib.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-(--text-tertiary)">
                      <Star size={14} aria-hidden="true" className="fill-current" />
                      {relLib.stars}
                    </div>
                  </div>
                  <p className="text-sm text-(--text-secondary) line-clamp-2">
                    {isKorean ? relLib.descriptionKo : relLib.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </FadeIn>
    </DocsLayout>
  );
}
