import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Package, Scale, Star } from 'lucide-react';
import DocsLayout from '../../components/layout/DocsLayout';
import {
  type CategoryMeta,
  getCategoryBySlug,
  getLibrariesByCategorySlug,
  getLibrarySlug,
  type Library,
} from '../../data/libraries';

type LoaderData = { category: CategoryMeta; libraries: Library[] };

export const Route = createFileRoute('/category/$categoryId')({
  loader: async ({ params }) => {
    const category = getCategoryBySlug(params.categoryId);
    if (!category) {
      throw new Response('Not Found', { status: 404 });
    }
    const libraries = getLibrariesByCategorySlug(params.categoryId);
    return { category, libraries };
  },
  head: dynamicHeadFactoryEn<LoaderData>((data) => {
    if (!data?.category) {
      return {
        ko: { title: 'Not Found - Permissive' },
        en: { title: 'Not Found - Permissive' },
      };
    }
    const cat = data.category;
    return {
      ko: {
        title: `${cat.name.ko} 라이브러리 - Permissive`,
        description: cat.description.ko,
      },
      en: {
        title: `${cat.name.en} Libraries - Permissive`,
        description: cat.description.en,
      },
    };
  }, 'https://permissive.soundbluemusic.com'),
  component: CategoryPage,
});

function CategoryPage() {
  const { category, libraries } = Route.useLoaderData();
  const _locale = 'en';
  const _localePath = (path: string) => path;
  const _isKorean = false;

  return (
    <DocsLayout>
      <div>
        {/* Back link */}
        <Link
          to="/libraries"
          className="inline-flex items-center gap-2 text-(--text-secondary) hover:text-(--text-primary) transition-colors mb-6"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Libraries
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-3">
            {category.name.en}
          </h1>
          <p className="text-lg text-(--text-secondary)">{category.description.en}</p>
          <div className="mt-4 text-sm text-(--text-tertiary)">
            {`${libraries.length} ${libraries.length === 1 ? 'library' : 'libraries'}`}
          </div>
        </div>

        {/* Library Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {libraries.map((lib) => (
            <Link
              key={lib.name}
              to="/library/$slug"
              params={{ slug: getLibrarySlug(lib.name) }}
              className="group p-5 rounded-xl bg-(--bg-elevated) border border-(--border-primary) hover:border-(--border-focus) transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-(--text-primary) group-hover:text-(--accent-primary) transition-colors truncate">
                    {lib.name}
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-sm text-(--text-tertiary) shrink-0">
                  <Star size={14} aria-hidden="true" className="fill-current text-yellow-500" />
                  {lib.stars}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-(--text-secondary) line-clamp-2 mb-3">{lib.description}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {lib.wasmBased && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-500">
                    WASM
                  </span>
                )}
                {lib.trending && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-500/10 text-orange-500">
                    🔥
                  </span>
                )}
                {lib.usedHere && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-500">
                    ✨
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 text-xs text-(--text-tertiary)">
                <span className="inline-flex items-center gap-1">
                  <Scale size={12} aria-hidden="true" />
                  {lib.license}
                </span>
                {lib.npm && (
                  <span className="inline-flex items-center gap-1">
                    <Package size={12} aria-hidden="true" />
                    npm
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {libraries.length === 0 && (
          <div className="text-center py-12 text-(--text-secondary)">
            No libraries in this category.
          </div>
        )}

        {/* Related Categories Section */}
        <div className="mt-12 pt-8 border-t border-(--border-primary)">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-4">
            Explore Other Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/libraries"
              className="px-4 py-2 rounded-lg bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary) transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
