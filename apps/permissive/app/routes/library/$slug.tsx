import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import {
  type BreadcrumbItem,
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema,
} from '@soundblue/seo/structured-data';
import {
  Breadcrumb,
  CodeBlock,
  FeedbackButton,
  RelatedContent,
  ShareButton,
  TagList,
} from '@soundblue/ui/components';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Calendar,
  Code,
  ExternalLink,
  Github,
  Lightbulb,
  Package,
  Scale,
  Star,
} from 'lucide-react';
import DocsLayout from '../../components/layout/DocsLayout';
import { APP_CONFIG } from '../../config';
import {
  getCategorySlug,
  getLibraryBySlug,
  getLibrarySlug,
  getRelatedLibraries,
  type Library,
} from '../../data/libraries';

type LoaderData = { library: Library; related: Library[] };

export const Route = createFileRoute('/library/$slug')({
  loader: async ({ params }) => {
    const library = getLibraryBySlug(params.slug);
    if (!library) {
      throw new Response('Not Found', { status: 404 });
    }
    const related = getRelatedLibraries(library);
    return { library, related };
  },
  head: dynamicHeadFactoryEn<LoaderData>((data) => {
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
  }, 'https://permissive.soundbluemusic.com'),
  component: LibraryDetailPage,
});

function LibraryDetailPage() {
  const { library: lib, related } = Route.useLoaderData();
  const _locale = 'en';
  const _localePath = (path: string) => path;
  const _isKorean = false;

  // JSON-LD 구조화 데이터
  const { baseUrl } = APP_CONFIG;
  const localePrefix = '';

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', url: `${baseUrl}${localePrefix}` },
    { name: 'Libraries', url: `${baseUrl}${localePrefix}/libraries` },
    { name: lib.name, url: `${baseUrl}${localePrefix}/library/${getLibrarySlug(lib.name)}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const softwareSchema = generateSoftwareApplicationSchema({
    name: lib.name,
    description: lib.description,
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
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Libraries', href: '/libraries' }, { label: lib.name }]}
          showHome
          homeLabel="Home"
          homePath="/"
          LinkComponent={Link}
          className="mb-6"
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary)">{lib.name}</h1>
            <div className="flex items-center gap-2">
              <ShareButton
                url={`${baseUrl}/library/${getLibrarySlug(lib.name)}`}
                title={lib.name}
                description={lib.description}
                variant="ghost"
                iconOnly
                size="md"
              />
              <div className="flex items-center gap-1 text-(--text-secondary)">
                <Star size={18} aria-hidden="true" className="fill-current text-yellow-500" />
                <span className="font-medium">{lib.stars}</span>
              </div>
            </div>
          </div>
          <p className="text-lg text-(--text-secondary)">{lib.description}</p>
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
              🔥 Trending
            </span>
          )}
          {lib.usedHere && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-500">
              ✨ Used in this site
            </span>
          )}
          <Link
            to="/category/$categoryId"
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
              License
            </div>
            <div className="font-semibold text-(--text-primary)">{lib.license}</div>
          </div>
          {lib.yearReleased && (
            <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
              <div className="flex items-center gap-2 text-(--text-tertiary) text-sm mb-1">
                <Calendar size={16} aria-hidden="true" />
                Released
              </div>
              <div className="font-semibold text-(--text-primary)">{lib.yearReleased}</div>
            </div>
          )}
          <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
            <div className="flex items-center gap-2 text-(--text-tertiary) text-sm mb-1">
              <Star size={16} aria-hidden="true" />
              Stars
            </div>
            <div className="font-semibold text-(--text-primary)">{lib.stars}</div>
          </div>
        </div>

        {/* Tags */}
        {lib.tags && lib.tags.length > 0 && (
          <div className="mb-8">
            <TagList
              tags={lib.tags}
              label="Tags:"
              getTagHref={(tag) => `/tag/${encodeURIComponent(tag)}`}
            />
          </div>
        )}

        {/* Links */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-(--text-tertiary) mb-3">Links</h2>
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
              Use Cases
            </h2>
            <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
              <p className="text-(--text-secondary) leading-relaxed">{lib.useCases.en}</p>
            </div>
          </div>
        )}

        {/* Code Example */}
        {lib.codeExample && (
          <div className="mb-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-(--text-primary) mb-3">
              <Code size={20} aria-hidden="true" className="text-green-500" />
              Code Example
            </h2>
            <CodeBlock
              code={lib.codeExample}
              language="javascript"
              className="rounded-xl border border-(--border-primary) overflow-hidden"
            />
          </div>
        )}

        {/* Related Libraries */}
        {related.length > 0 && (
          <RelatedContent
            title="Related Libraries"
            items={related.map((relLib) => ({
              id: relLib.name,
              title: relLib.name,
              description: relLib.description,
              href: `/library/${getLibrarySlug(relLib.name)}`,
              meta: `★ ${relLib.stars}`,
            }))}
            variant="cards"
            maxItems={6}
            LinkComponent={Link}
            className="mb-8"
          />
        )}

        {/* Feedback */}
        <div className="pt-8 border-t border-(--border-primary)">
          <FeedbackButton
            contentId={lib.name}
            question="Was this page helpful?"
            positiveLabel="Yes"
            negativeLabel="No"
            thankYouMessage="Thanks for your feedback!"
            variant="default"
          />
        </div>
      </div>
    </DocsLayout>
  );
}
