import { Layout } from '@/components/layout/Layout';
/**
 * @fileoverview 검색 결과 페이지
 */
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import type { DifficultyLevel } from '@/data/types';
import { useI18n } from '@/i18n';
import { type SearchResult, searchConcepts } from '@/lib/search';
import { Meta, Title } from '@solidjs/meta';
import { A, useSearchParams } from '@solidjs/router';
import { For, Show, createEffect, createSignal } from 'solid-js';

/** 검색 결과 카드 (SearchIndexItem용) */
function SearchResultCard(props: { result: SearchResult }) {
  const { locale, localePath } = useI18n();
  const item = () => props.result.item;
  const name = () => item().name[locale()] || item().name.en;
  const def = () => item().def[locale()] || item().def.en;

  return (
    <A
      href={localePath(`/concept/${item().id}`)}
      class="card card-field hover:scale-[1.01] transition-transform block"
    >
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {name()}
        </h3>
        <DifficultyBadge level={item().difficulty as DifficultyLevel} showLabel={false} size="sm" />
      </div>
      <p class="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
        {def()}
      </p>
      <div class="flex items-center gap-2">
        <span class="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {item().field}
        </span>
      </div>
    </A>
  );
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const { locale, t } = useI18n();

  const [results, setResults] = createSignal<SearchResult[]>([]);
  const [isSearching, setIsSearching] = createSignal(false);

  const query = () => {
    const q = searchParams.q;
    return typeof q === 'string' ? q : '';
  };

  // 검색 수행 (비동기)
  createEffect(() => {
    const q = query();
    if (q.length >= 2) {
      setIsSearching(true);
      searchConcepts(q, locale(), 20).then((searchResults) => {
        setResults(searchResults);
        setIsSearching(false);
      });
    } else {
      setResults([]);
    }
  });

  return (
    <Layout>
      <Title>{query() ? `"${query()}" - ${t('search')}` : t('search')} - Suri</Title>
      <Meta name="description" content={`Search results for "${query()}"`} />

      {/* Header */}
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('search')}
        </h1>
        <Show when={query()}>
          <p style={{ color: 'var(--text-secondary)' }}>
            {locale() === 'ko'
              ? `"${query()}"에 대한 검색 결과`
              : `Search results for "${query()}"`}
          </p>
        </Show>
      </div>

      {/* Results */}
      <Show
        when={!isSearching()}
        fallback={
          <div class="text-center py-12">
            <div class="skeleton h-8 w-32 mx-auto rounded" />
          </div>
        }
      >
        <Show
          when={results().length > 0}
          fallback={
            <Show when={query().length >= 2}>
              <div class="text-center py-12" style={{ color: 'var(--text-tertiary)' }}>
                <p class="text-xl mb-2">{t('noResults')}</p>
                <p class="text-sm">
                  {locale() === 'ko'
                    ? '다른 검색어를 시도해보세요.'
                    : 'Try a different search term.'}
                </p>
              </div>
            </Show>
          }
        >
          <div class="mb-4" style={{ color: 'var(--text-tertiary)' }}>
            {results().length}
            {locale() === 'ko' ? '개의 결과' : ' results'}
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={results()}>{(result) => <SearchResultCard result={result} />}</For>
          </div>
        </Show>
      </Show>
    </Layout>
  );
}
