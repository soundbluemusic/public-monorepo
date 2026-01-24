/**
 * @fileoverview 공유 SearchPage 컴포넌트
 */

import { toast } from '@soundblue/features/toast';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n';
import { type MiniSearchResult, searchConcepts } from '../../lib/search';
import { Layout } from '../layout/Layout';
import { DifficultyBadge } from '../ui/DifficultyBadge';

/** 검색 결과 카드 */
function SearchResultCard({ result }: { result: MiniSearchResult }) {
  const { locale, localePath } = useI18n();
  const item = result.item;
  const name = item.name[locale] || item.name.en;
  const def = item.def[locale] || item.def.en;

  return (
    <Link
      to={localePath(`/concept/${item.id}`)}
      className="block p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-(--border-focus)"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="text-base font-medium text-(--text-primary)">{name}</h2>
        <DifficultyBadge level={item.difficulty} showLabel={false} size="sm" />
      </div>
      <p className="text-sm text-(--text-secondary) line-clamp-2 mb-2">{def}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-(--text-tertiary)">{item.field}</span>
      </div>
    </Link>
  );
}

export interface SearchPageProps {
  query: string;
}

export function SearchPage({ query }: SearchPageProps) {
  const { locale, t } = useI18n();

  const [results, setResults] = useState<MiniSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 검색 수행 (비동기)
  useEffect(() => {
    if (query.length >= 2) {
      setIsSearching(true);
      searchConcepts(query, locale, 20)
        .then((searchResults) => {
          setResults(searchResults);
          setIsSearching(false);
        })
        .catch(() => {
          setIsSearching(false);
          toast({
            message: t('toast.searchFailed'),
            type: 'error',
          });
        });
    } else {
      setResults([]);
    }
  }, [query, locale, t]);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-(--text-primary) mb-2">{t('search')}</h1>
        {query && (
          <p className="text-(--text-secondary)">
            "{query}"{t('searchResultsFor')}
          </p>
        )}
      </div>

      {/* Results */}
      {isSearching ? (
        <div className="text-center py-12">
          <div className="h-6 w-48 mx-auto rounded bg-(--bg-tertiary) animate-pulse" />
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="text-sm text-(--text-secondary) mb-4">
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
          <p className="text-xl text-(--text-primary) mb-2">{t('noResults')}</p>
          <p className="text-sm text-(--text-secondary)">{t('tryDifferentSearch')}</p>
        </div>
      ) : null}
    </Layout>
  );
}
