import { metaFactory } from '@soundblue/seo/meta';
import { useLoaderData } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { ApiGrid, QuickFilters, SearchAndSort, useWebApiFilters } from '../components/web-api';
import { type WebAPI, webApiCategories, webApis } from '../data/web-apis';
import { useI18n } from '../i18n';

const categories = webApiCategories;

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 */
export async function loader() {
  return {
    webApis,
    categories,
  };
}

export const meta = metaFactory(
  {
    ko: { title: 'Web API - Permissive', description: '브라우저에 내장된 웹 표준 API' },
    en: { title: 'Web API - Permissive', description: 'Browser built-in Web Standard APIs' },
  },
  'https://permissive.soundbluemusic.com',
);

export default function WebApiPage() {
  const { webApis: apis, categories: cats } = useLoaderData<{
    webApis: WebAPI[];
    categories: typeof categories;
  }>();
  const { locale } = useI18n();

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
          {locale === 'ko'
            ? '브라우저에 내장된 무료 API. 설치 없이 바로 사용 가능'
            : 'Browser built-in APIs. Free to use, no installation required'}
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
      <div className="text-sm text-(--text-tertiary) mb-4">
        {filteredApis.length} {locale === 'ko' ? '개의 API' : 'APIs'}
      </div>

      <ApiGrid locale={locale} groupedApis={groupedApis} />

      {/* Empty state */}
      {filteredApis.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-(--text-secondary)">
            {locale === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
          </p>
        </div>
      )}
    </DocsLayout>
  );
}
