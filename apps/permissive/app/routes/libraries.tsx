import { headFactoryEn } from '@soundblue/seo/meta';
import { generateItemListSchema, serializeSchema } from '@soundblue/seo/structured-data';
import { createFileRoute } from '@tanstack/react-router';
import DocsLayout from '../components/layout/DocsLayout';
import {
  ActiveTagDisplay,
  LibraryGrid,
  QuickFilters,
  SearchAndSort,
  useLibraryFilters,
} from '../components/libraries';
import { APP_CONFIG } from '../config';
import { categories, getLibrarySlug, libraries } from '../data/libraries';
import { librariesMeta } from '../routes-meta';

export const Route = createFileRoute('/libraries')({
  loader: async () => {
    return {
      libraries,
      categories,
    };
  },
  head: headFactoryEn(librariesMeta, APP_CONFIG.baseUrl),
  component: LibrariesPage,
});

const PERMISSIVE_BASE_URL = APP_CONFIG.baseUrl;

function LibrariesPage() {
  const { libraries: libs } = Route.useLoaderData();
  const locale = 'en';

  const libraryListSchema = generateItemListSchema({
    name: 'Open Source Web Libraries',
    description: 'Open-source libraries for web development with license details',
    url: `${PERMISSIVE_BASE_URL}/libraries`,
    items: libs.map((lib) => ({
      name: lib.name,
      url: `${PERMISSIVE_BASE_URL}/library/${getLibrarySlug(lib.name)}`,
      description: lib.description,
    })),
  });

  const {
    search,
    category,
    selectedTag,
    quickFilter,
    sortBy,
    filteredLibraries,
    groupedLibraries,
    setSearch,
    setCategory,
    setSortBy,
    handleTagClick,
    handleQuickFilter,
    clearFilters,
    handleClearTag,
  } = useLibraryFilters({ libraries: libs });

  return (
    <DocsLayout>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: serializeSchema(libraryListSchema) }}
      />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-(--text-primary) mb-2">Libraries</h1>
        <p className="text-(--text-secondary)">
          Open-source libraries with license details from npm and GitHub
        </p>
      </div>

      <QuickFilters
        locale={locale}
        quickFilter={quickFilter}
        selectedTag={selectedTag}
        onQuickFilter={handleQuickFilter}
        onClearFilters={clearFilters}
      />

      {selectedTag && (
        <ActiveTagDisplay locale={locale} selectedTag={selectedTag} onClear={handleClearTag} />
      )}

      <SearchAndSort
        locale={locale}
        search={search}
        sortBy={sortBy}
        category={category}
        onSearchChange={setSearch}
        onSortChange={setSortBy}
        onCategoryChange={setCategory}
      />

      {/* Results count */}
      <div className="mb-4 text-sm text-(--text-tertiary)">
        {filteredLibraries.length} libraries
      </div>

      {/* Library Grid */}
      <LibraryGrid
        locale={locale}
        groupedLibraries={groupedLibraries}
        selectedTag={selectedTag}
        onTagClick={handleTagClick}
      />

      {/* Empty state */}
      {filteredLibraries.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-(--text-secondary)">No results found</p>
        </div>
      )}
    </DocsLayout>
  );
}
