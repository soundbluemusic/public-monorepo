/**
 * @fileoverview 검색 결과 페이지
 */
import { createSignal, createEffect, Show, For } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { useI18n } from "@/i18n";
import { Layout } from "@/components/layout/Layout";
import { ConceptCard } from "@/components/concept/ConceptCard";
import { searchConcepts, type SearchResult } from "@/lib/search";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const { locale, t } = useI18n();

  const [results, setResults] = createSignal<SearchResult[]>([]);
  const [isSearching, setIsSearching] = createSignal(false);

  const query = () => searchParams.q || "";

  // 검색 수행
  createEffect(() => {
    const q = query();
    if (q.length >= 2) {
      setIsSearching(true);
      // 약간의 디바운스 효과
      setTimeout(() => {
        const searchResults = searchConcepts(q, locale(), 20);
        setResults(searchResults);
        setIsSearching(false);
      }, 100);
    } else {
      setResults([]);
    }
  });

  return (
    <Layout>
      <Title>
        {query() ? `"${query()}" - ${t("search")}` : t("search")} - Suri
      </Title>
      <Meta name="description" content={`Search results for "${query()}"`} />

      {/* Header */}
      <div class="mb-8">
        <h1
          class="text-3xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {t("search")}
        </h1>
        <Show when={query()}>
          <p style={{ color: "var(--text-secondary)" }}>
            {locale() === "ko"
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
              <div
                class="text-center py-12"
                style={{ color: "var(--text-tertiary)" }}
              >
                <p class="text-xl mb-2">{t("noResults")}</p>
                <p class="text-sm">
                  {locale() === "ko"
                    ? "다른 검색어를 시도해보세요."
                    : "Try a different search term."}
                </p>
              </div>
            </Show>
          }
        >
          <div class="mb-4" style={{ color: "var(--text-tertiary)" }}>
            {results().length}
            {locale() === "ko"
              ? "개의 결과"
              : " results"}
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={results()}>
              {(result) => <ConceptCard concept={result.item} />}
            </For>
          </div>
        </Show>
      </Show>
    </Layout>
  );
}
