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
import { categories, getLibrarySlug, libraries } from '../data/libraries';

const localizedMeta = {
  ko: { title: 'Libraries - Permissive', description: 'MIT 라이센스 오픈소스 라이브러리' },
  en: { title: 'Libraries - Permissive', description: 'MIT licensed open source libraries' },
};

export const Route = createFileRoute('/libraries')({
  loader: async () => {
    return {
      libraries,
      categories,
    };
  },
  head: headFactoryEn(localizedMeta, 'https://permissive.soundbluemusic.com'),
  component: LibrariesPage,
});

const PERMISSIVE_BASE_URL = 'https://permissive.soundbluemusic.com';

function LibrariesPage() {
  const { libraries: libs } = Route.useLoaderData();
  const locale = 'en';

  const libraryListSchema = generateItemListSchema({
    name: 'MIT Licensed Open Source Libraries',
    description: 'Free open-source libraries for web development',
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
        <p className="text-(--text-secondary)">MIT licensed open source. Free for commercial use</p>
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
