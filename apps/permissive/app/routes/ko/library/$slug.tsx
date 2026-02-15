import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import {
  type BreadcrumbItem,
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema,
} from '@soundblue/seo/structured-data';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  Calendar,
  Code,
  ExternalLink,
  Github,
  Lightbulb,
  Package,
  Scale,
  Star,
} from 'lucide-react';
import DocsLayout from '../../../components/layout/DocsLayout';
import { APP_CONFIG } from '../../../config';
import {
  getCategorySlug,
  getLibraryBySlug,
  getLibrarySlug,
  getRelatedLibraries,
  type Library,
} from '../../../data/libraries';

type LoaderData = { library: Library; related: Library[] };

export const Route = createFileRoute('/ko/library/$slug')({
  loader: async ({ params }) => {
    const library = getLibraryBySlug(params.slug);
    if (!library) {
      throw new Response('Not Found', { status: 404 });
    }
    const related = getRelatedLibraries(library);
    return { library, related };
  },
  head: dynamicHeadFactoryKo<LoaderData>(
    (data) => {
      if (!data?.library) {
        return {
          ko: { title: 'Not Found - Permissive' },
          en: { title: 'Not Found - Permissive' },
        };
      }
      const lib = data.library;
      const tags = lib.tags || [];
      return {
        ko: {
          title: `${lib.name} - Permissive`,
          description: lib.descriptionKo,
          keywords: [
            lib.name,
            `${lib.name} 라이브러리`,
            lib.license,
            lib.category,
            '오픈소스',
            '무료 라이브러리',
            ...tags.slice(0, 3),
          ],
        },
        en: {
          title: `${lib.name} - Permissive`,
          description: lib.description,
          keywords: [
            lib.name,
            `${lib.name} library`,
            lib.license,
            lib.category,
            'open source',
            'free library',
            ...tags.slice(0, 3),
          ],
        },
      };
    },
    'https://permissive.soundbluemusic.com',
    (data) => `/library/${getLibrarySlug(data.library.name)}`,
    { trailingSlash: true },
  ),
  component: LibraryDetailPageKo,
});

function LibraryDetailPageKo() {
  const { library: lib, related } = Route.useLoaderData();
  const _locale = 'ko';
  const _localePath = (path: string) => `/ko${path}`;
  const _isKorean = true;

  // JSON-LD 구조화 데이터
  const { baseUrl } = APP_CONFIG;
  const localePrefix = '/ko';

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: '홈', url: `${baseUrl}${localePrefix}` },
    { name: '라이브러리', url: `${baseUrl}${localePrefix}/libraries` },
    { name: lib.name, url: `${baseUrl}${localePrefix}/library/${getLibrarySlug(lib.name)}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const softwareSchema = generateSoftwareApplicationSchema({
    name: lib.name,
    description: lib.descriptionKo,
    url: `${baseUrl}${localePrefix}/library/${getLibrarySlug(lib.name)}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    license: lib.license,
    codeRepository: lib.github,
    programmingLanguage: 'JavaScript',
    author: {
      name: lib.name,
      url: lib.website || lib.github,
    },
  });

  return (
    <DocsLayout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <div>
        {/* Back link */}
        <Link
          to="/ko/libraries"
          className="inline-flex items-center gap-2 text-(--text-secondary) hover:text-(--text-primary) transition-colors mb-6"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          라이브러리 목록
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
          <p className="text-lg text-(--text-secondary)">{lib.descriptionKo}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {lib.wasmBased && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500">
              ⚡ WASM
            </span>
          )}
          {lib.trending && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-orange-500/10 text-orange-500">
              🔥 트렌딩
            </span>
          )}
          {lib.usedHere && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-500">
              ✨ 이 사이트에서 사용 중
            </span>
          )}
          <Link
            to="/ko/category/$categoryId"
            params={{ categoryId: getCategorySlug(lib.category) }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary) transition-colors"
          >
            {lib.category}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
            <div className="flex items-center gap-2 text-(--text-tertiary) text-sm mb-1">
              <Scale size={16} aria-hidden="true" />
              라이선스
            </div>
            <div className="font-semibold text-(--text-primary)">{lib.license}</div>
          </div>
          {lib.yearReleased && (
            <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
              <div className="flex items-center gap-2 text-(--text-tertiary) text-sm mb-1">
                <Calendar size={16} aria-hidden="true" />
                출시년도
              </div>
              <div className="font-semibold text-(--text-primary)">{lib.yearReleased}</div>
            </div>
          )}
          <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
            <div className="flex items-center gap-2 text-(--text-tertiary) text-sm mb-1">
              <Star size={16} aria-hidden="true" />
              스타
            </div>
            <div className="font-semibold text-(--text-primary)">{lib.stars}</div>
          </div>
        </div>

        {/* Tags */}
        {lib.tags && lib.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-(--text-tertiary) mb-3">태그</h2>
            <div className="flex flex-wrap gap-2">
              {lib.tags.map((tag) => (
                <Link
                  key={tag}
                  to="/ko/libraries"
                  search={{ tag }}
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
          <h2 className="text-sm font-medium text-(--text-tertiary) mb-3">링크</h2>
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

        {/* Use Cases */}
        {lib.useCases && (
          <div className="mb-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-(--text-primary) mb-3">
              <Lightbulb size={20} aria-hidden="true" className="text-yellow-500" />
              용도 및 활용
            </h2>
            <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
              <p className="text-(--text-secondary) leading-relaxed">{lib.useCases.ko}</p>
            </div>
          </div>
        )}

        {/* Code Example */}
        {lib.codeExample && (
          <div className="mb-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-(--text-primary) mb-3">
              <Code size={20} aria-hidden="true" className="text-green-500" />
              코드 예시
            </h2>
            <div className="rounded-xl bg-(--bg-elevated) border border-(--border-primary) overflow-hidden">
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-(--text-secondary) whitespace-pre">{lib.codeExample}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Related Libraries */}
        {related.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-(--text-primary) mb-4">관련 라이브러리</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relLib) => (
                <Link
                  key={relLib.name}
                  to="/ko/library/$slug"
                  params={{ slug: getLibrarySlug(relLib.name) }}
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
                    {relLib.descriptionKo}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DocsLayout>
  );
}
