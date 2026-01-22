import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import DocsLayout from '../components/layout/DocsLayout';
import {
  ActiveTagDisplay,
  LibraryGrid,
  QuickFilters,
  SearchAndSort,
  useLibraryFilters,
} from '../components/libraries';
import { categories, libraries } from '../data/libraries';

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

function LibrariesPage() {
  const { libraries: libs } = Route.useLoaderData();
  const locale = 'en';

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
      <div className="text-sm text-(--text-tertiary) mb-4">
        {filteredLibraries.length} libraries
      </div>

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
