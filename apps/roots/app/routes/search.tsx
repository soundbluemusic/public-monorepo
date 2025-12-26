/**
 * @fileoverview 검색 결과 페이지
 */
import { Layout } from '@/components/layout/Layout';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import type { DifficultyLevel } from '@/data/types';
import { useI18n } from '@/i18n';
import { type FuseSearchResult, searchConcepts } from '@/lib/search';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { MetaFunction } from 'react-router';

/** 검색 결과 카드 (SearchIndexItem용) */
function SearchResultCard({ result }: { result: FuseSearchResult }) {
  const { locale, localePath } = useI18n();
  const item = result.item;
  const name = item.name[locale] || item.name.en;
  const def = item.def[locale] || item.def.en;

  return (
    <Link
      to={localePath(`/concept/${item.id}`)}
      className="block p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] no-underline transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--border-focus)]"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-medium text-[var(--text-primary)]">{name}</h3>
        <DifficultyBadge level={item.difficulty as DifficultyLevel} showLabel={false} size="sm" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">{def}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-tertiary)]">{item.field}</span>
      </div>
    </Link>
  );
}

export const meta: MetaFunction = ({ location }) => {
  const locale = location.pathname.startsWith('/ko') ? 'ko' : 'en';
  const title = locale === 'ko' ? '검색 - 수리' : 'Search - Roots';
  const description = locale === 'ko' ? '수학 개념 검색' : 'Search math concepts';
  return [{ title }, { name: 'description', content: description }];
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const { locale, t } = useI18n();

  const [results, setResults] = useState<FuseSearchResult[]>([]);
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
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('search')}</h1>
        {query && (
          <p className="text-[var(--text-secondary)]">
            "{query}"{t('searchResultsFor')}
          </p>
        )}
      </div>

      {/* Results */}
      {isSearching ? (
        <div className="text-center py-12">
          <div className="h-6 w-48 mx-auto rounded bg-[var(--bg-tertiary)] animate-pulse" />
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="text-sm text-[var(--text-secondary)] mb-4">
            {results.length}
            {t('resultsCount')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result) => (
              <SearchResultCard key={result.item.id} result={result} />
            ))}
          </div>
        </>
      ) : query.length >= 2 ? (
        <div className="text-center py-12">
          <p className="text-xl text-[var(--text-primary)] mb-2">{t('noResults')}</p>
          <p className="text-sm text-[var(--text-secondary)]">{t('tryDifferentSearch')}</p>
        </div>
      ) : null}
    </Layout>
  );
}
