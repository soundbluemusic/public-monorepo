import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import DocsLayout from '../../components/layout/DocsLayout';
import { ApiGrid, QuickFilters, SearchAndSort, useWebApiFilters } from '../../components/web-api';
import { APP_CONFIG } from '../../config';
import { webApiCategories, webApis } from '../../data/web-apis';
import { webApiMeta } from '../../routes-meta';

export const Route = createFileRoute('/ko/web-api')({
  loader: async () => {
    return {
      webApis,
      categories: webApiCategories,
    };
  },
  head: headFactoryKo(webApiMeta, APP_CONFIG.baseUrl),
  component: WebApiPageKo,
});

function WebApiPageKo() {
  const { webApis: apis, categories: cats } = Route.useLoaderData();
  const locale = 'ko';

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
          브라우저에 내장된 무료 API. 설치 없이 바로 사용 가능
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
      <div className="text-sm text-(--text-tertiary) mb-4">{filteredApis.length} 개의 API</div>

      <ApiGrid locale={locale} groupedApis={groupedApis} />

      {/* Empty state */}
      {filteredApis.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-(--text-secondary)">검색 결과가 없습니다</p>
        </div>
      )}
    </DocsLayout>
  );
}
