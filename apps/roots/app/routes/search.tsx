/**
 * @fileoverview 검색 결과 페이지
 */

import { toast } from '@soundblue/features/toast';
import { metaFactory } from '@soundblue/i18n';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Layout } from '@/components/layout/Layout';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import type { DifficultyLevel } from '@/data/types';
import { useI18n } from '@/i18n';
import { type MiniSearchResult, searchConcepts } from '@/lib/search';

/** 검색 결과 카드 (SearchIndexItem용) */
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
        <DifficultyBadge level={item.difficulty as DifficultyLevel} showLabel={false} size="sm" />
      </div>
      <p className="text-sm text-(--text-secondary) line-clamp-2 mb-2">{def}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-(--text-tertiary)">{item.field}</span>
      </div>
    </Link>
  );
}

export const meta = metaFactory(
  {
    ko: { title: '검색 - 수리', description: '수학 개념 검색' },
    en: { title: 'Search - Roots', description: 'Search math concepts' },
  },
  'https://roots.soundbluemusic.com',
);

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const { locale, t } = useI18n();

  const [results, setResults] = useState<MiniSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const query = searchParams.get('q') || '';

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
            message: locale === 'ko' ? '검색 중 오류가 발생했습니다' : 'Search failed',
            type: 'error',
          });
        });
    } else {
      setResults([]);
    }
  }, [query, locale]);

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
