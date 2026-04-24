import { headFactoryEn } from '@soundblue/seo/meta';
import { generateItemListSchema, serializeSchema } from '@soundblue/seo/structured-data';
import { createFileRoute } from '@tanstack/react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { ApiGrid, QuickFilters, SearchAndSort, useWebApiFilters } from '../components/web-api';
import { APP_CONFIG } from '../config';
import { getWebApiSlug, webApiCategories, webApis } from '../data/web-apis';
import { webApiMeta } from '../routes-meta';

export const Route = createFileRoute('/web-api')({
  loader: async () => {
    return {
      webApis,
      categories: webApiCategories,
    };
  },
  head: headFactoryEn(webApiMeta, APP_CONFIG.baseUrl),
  component: WebApiPage,
});

const PERMISSIVE_BASE_URL = APP_CONFIG.baseUrl;

function WebApiPage() {
  const { webApis: apis, categories: cats } = Route.useLoaderData();
  const locale = 'en';

  const webApiListSchema = generateItemListSchema({
    name: 'Browser Web Standard APIs',
    description: 'Browser built-in APIs - Free to use, no installation required',
    url: `${PERMISSIVE_BASE_URL}/web-api`,
    items: apis.map((api) => ({
      name: api.name,
      url: `${PERMISSIVE_BASE_URL}/web-api/${getWebApiSlug(api.name)}`,
      description: api.description,
    })),
  });

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
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: serializeSchema(webApiListSchema) }}
      />
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
