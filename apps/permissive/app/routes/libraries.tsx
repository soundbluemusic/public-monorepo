import { metaFactory } from '@soundblue/seo/meta';
import { FadeIn } from '@soundblue/ui/animation';
import { useLoaderData } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import {
  ActiveTagDisplay,
  LibraryGrid,
  QuickFilters,
  SearchAndSort,
  useLibraryFilters,
} from '../components/libraries';
import { categories, type Library, libraries } from '../data/libraries';
import { useI18n } from '../i18n';

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 */
export async function loader() {
  return {
    libraries,
    categories,
  };
}

export const meta = metaFactory({
  ko: { title: 'Libraries - Permissive', description: 'MIT 라이센스 오픈소스 라이브러리' },
  en: { title: 'Libraries - Permissive', description: 'MIT licensed open source libraries' },
});

export default function LibrariesPage() {
  const { libraries: libs } = useLoaderData<{
    libraries: Library[];
    categories: typeof categories;
  }>();
  const { locale } = useI18n();

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
      <FadeIn>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-(--text-primary) mb-2">Libraries</h1>
          <p className="text-(--text-secondary)">
            {locale === 'ko'
              ? 'MIT 라이센스 오픈소스. 상업적 사용 가능'
              : 'MIT licensed open source. Free for commercial use'}
          </p>
        </div>
      </FadeIn>

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
        {filteredLibraries.length} {locale === 'ko' ? '개의 라이브러리' : 'libraries'}
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
          <p className="text-(--text-secondary)">
            {locale === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
          </p>
        </div>
      )}
    </DocsLayout>
  );
}
