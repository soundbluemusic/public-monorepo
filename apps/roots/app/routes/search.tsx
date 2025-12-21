import { Layout } from '@/components/layout/Layout';
/**
 * @fileoverview 검색 결과 페이지
 */
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import type { DifficultyLevel } from '@/data/types';
import { useI18n } from '@/i18n';
import { type SearchResult, searchConcepts } from '@/lib/search';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

/** 검색 결과 카드 (SearchIndexItem용) */
function SearchResultCard({ result }: { result: SearchResult }) {
  const { locale, localePath } = useI18n();
  const item = result.item;
  const name = item.name[locale] || item.name.en;
  const def = item.def[locale] || item.def.en;

  return (
    <Link
      to={localePath(`/concept/${item.id}`)}
      className="card card-field hover:scale-[1.01] transition-transform block"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {name}
        </h3>
        <DifficultyBadge level={item.difficulty as DifficultyLevel} showLabel={false} size="sm" />
      </div>
      <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
        {def}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {item.field}
        </span>
      </div>
    </Link>
  );
}

import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const locale = location.pathname.startsWith('/ko') ? 'ko' : 'en';
  const title = locale === 'ko' ? '검색 - 수리' : 'Search - Roots';
  const description = locale === 'ko' ? '수학 개념 검색' : 'Search math concepts';
  return [{ title }, { name: 'description', content: description }];
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const { locale, t } = useI18n();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const query = searchParams.get('q') || '';

  // 검색 수행 (비동기)
  useEffect(() => {
    if (query.length >= 2) {
      setIsSearching(true);
      searchConcepts(query, locale, 20).then((searchResults) => {
        setResults(searchResults);
        setIsSearching(false);
      });
    } else {
      setResults([]);
    }
  }, [query, locale]);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('search')}
        </h1>
        {query && (
          <p style={{ color: 'var(--text-secondary)' }}>
            "{query}"{t('searchResultsFor')}
          </p>
        )}
      </div>

      {/* Results */}
      {isSearching ? (
        <div className="text-center py-12">
          <div className="skeleton h-8 w-32 mx-auto rounded" />
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="mb-4" style={{ color: 'var(--text-tertiary)' }}>
            {results.length}
            {t('resultsCount')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result) => (
              <SearchResultCard key={result.item.id} result={result} />
            ))}
          </div>
        </>
      ) : query.length >= 2 ? (
        <div className="text-center py-12" style={{ color: 'var(--text-tertiary)' }}>
          <p className="text-xl mb-2">{t('noResults')}</p>
          <p className="text-sm">{t('tryDifferentSearch')}</p>
        </div>
      ) : null}
    </Layout>
  );
}
