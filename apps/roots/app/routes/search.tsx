import { Layout } from '@/components/layout/Layout';
/**
 * @fileoverview 검색 결과 페이지
 */
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import type { DifficultyLevel } from '@/data/types';
import { useI18n } from '@/i18n';
import { type FuseSearchResult, searchConcepts } from '@/lib/search';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { MetaFunction } from 'react-router';
import styles from '../styles/app.module.scss';

/** 검색 결과 카드 (SearchIndexItem용) */
function SearchResultCard({ result }: { result: FuseSearchResult }) {
  const { locale, localePath } = useI18n();
  const item = result.item;
  const name = item.name[locale] || item.name.en;
  const def = item.def[locale] || item.def.en;

  return (
    <Link to={localePath(`/concept/${item.id}`)} className={styles.conceptCard}>
      <div className={styles.conceptCardHeader}>
        <h3 className={styles.conceptCardTitle}>{name}</h3>
        <DifficultyBadge level={item.difficulty as DifficultyLevel} showLabel={false} size="sm" />
      </div>
      <p className={styles.conceptCardDescription}>{def}</p>
      <div className={styles.conceptCardMeta}>
        <span className={styles.conceptCardField}>{item.field}</span>
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
      <div className={styles.browseHeader}>
        <h1 className={styles.browseTitle}>{t('search')}</h1>
        {query && (
          <p className={styles.textSecondary}>
            "{query}"{t('searchResultsFor')}
          </p>
        )}
      </div>

      {/* Results */}
      {isSearching ? (
        <div className={styles.noResults}>
          <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        </div>
      ) : results.length > 0 ? (
        <>
          <div className={styles.searchResultsTitle}>
            {results.length}
            {t('resultsCount')}
          </div>
          <div className={styles.grid3}>
            {results.map((result) => (
              <SearchResultCard key={result.item.id} result={result} />
            ))}
          </div>
        </>
      ) : query.length >= 2 ? (
        <div className={styles.noResults}>
          <p className={styles.textXl}>{t('noResults')}</p>
          <p className={styles.textSm}>{t('tryDifferentSearch')}</p>
        </div>
      ) : null}
    </Layout>
  );
}
