import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { ApiGrid, QuickFilters, SearchAndSort, useWebApiFilters } from '../components/web-api';
import { webApiCategories, webApis } from '../data/web-apis';

const localizedMeta = {
  ko: { title: 'Web API - Permissive', description: '브라우저에 내장된 웹 표준 API' },
  en: { title: 'Web API - Permissive', description: 'Browser built-in Web Standard APIs' },
};

export const Route = createFileRoute('/web-api')({
  loader: async () => {
    return {
      webApis,
      categories: webApiCategories,
    };
  },
  head: headFactoryEn(localizedMeta, 'https://permissive.soundbluemusic.com'),
  component: WebApiPage,
});

function WebApiPage() {
  const { webApis: apis, categories: cats } = Route.useLoaderData();
  const locale = 'en';

  const {
    search,
    category,
    quickFilter,
    sortBy,
    filteredApis,
    groupedApis,
    setSearch,
    setCategory,
    setSortBy,
    handleQuickFilter,
    clearFilters,
  } = useWebApiFilters({ apis, categories: cats });

  return (
    <DocsLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-(--text-primary) mb-2">Web API</h1>
        <p className="text-(--text-secondary)">
          Browser built-in APIs. Free to use, no installation required
        </p>
      </div>

      <QuickFilters
        locale={locale}
        quickFilter={quickFilter}
        onQuickFilter={handleQuickFilter}
        onClearFilters={clearFilters}
      />

      <SearchAndSort
        locale={locale}
        search={search}
        sortBy={sortBy}
        category={category}
        categories={cats}
        onSearchChange={setSearch}
        onSortChange={setSortBy}
        onCategoryChange={setCategory}
      />

      {/* Results count */}
      <div className="text-sm text-(--text-tertiary) mb-4">{filteredApis.length} APIs</div>

      <ApiGrid locale={locale} groupedApis={groupedApis} />

      {/* Empty state */}
      {filteredApis.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-(--text-secondary)">No results found</p>
        </div>
      )}
    </DocsLayout>
  );
}
