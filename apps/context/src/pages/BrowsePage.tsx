import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For, createSignal, createMemo, Show } from "solid-js";
import { Layout } from "@/components/Layout";
import { categories, getCategoryById } from "@/data/categories";
import { meaningEntries } from "@/data/entries";
import type { MeaningEntry, Language } from "@/data/types";
import { useI18n } from "@/i18n";

// Get pronunciation based on locale
const getPronunciation = (entry: MeaningEntry, locale: Language): string | undefined => {
  switch (locale) {
    case "en": return entry.romanization;
    case "ko": return entry.pronunciation;
  }
};

export default function BrowsePage() {
  const { locale, t, localePath } = useI18n();
  const [filter, setFilter] = createSignal<string>("all");
  const [searchQuery, setSearchQuery] = createSignal<string>("");

  const filteredEntries = createMemo(() => {
    let entries = [...meaningEntries];

    // Filter by category
    if (filter() !== "all") {
      entries = entries.filter((e) => e.categoryId === filter());
    }

    // Filter by search query
    const query = searchQuery().toLowerCase().trim();
    if (query) {
      entries = entries.filter((e) =>
        e.korean.toLowerCase().includes(query) ||
        e.romanization.toLowerCase().includes(query) ||
        e.translations[locale()].word.toLowerCase().includes(query)
      );
    }

    return entries.sort((a, b) => a.korean.localeCompare(b.korean, "ko"));
  });

  const selectedCategory = createMemo(() => {
    if (filter() === "all") return null;
    return getCategoryById(filter());
  });

  return (
    <Layout>
      <Title>{t("browse")} - Context</Title>
      <Meta name="description" content="Browse Korean words" />

      <div class="mb-6">
        <h1 class="text-2xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          {t("browse")}
        </h1>

        {/* Search input */}
        <div class="mb-4">
          <input
            type="text"
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            placeholder={locale() === "ko" ? "단어 검색..." : "Search words..."}
            class="w-full px-4 py-2.5 rounded-lg text-sm transition-colors outline-none"
            style={{
              "background-color": "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-primary)"
            }}
          />
        </div>

        {/* Category filter - horizontal scroll */}
        <div class="overflow-x-auto pb-2 -mx-4 px-4">
          <div class="flex gap-2 min-w-max">
            <button
              onClick={() => setFilter("all")}
              class="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-all"
              style={{
                "background-color": filter() === "all" ? "var(--accent-primary)" : "var(--bg-tertiary)",
                color: filter() === "all" ? "var(--bg-primary)" : "var(--text-secondary)",
                "font-weight": filter() === "all" ? "500" : "400"
              }}
            >
              <span class="text-base">📚</span>
              <span>{locale() === "ko" ? "전체" : "All"}</span>
            </button>
            <For each={categories}>
              {(cat) => (
                <button
                  onClick={() => setFilter(cat.id)}
                  class="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap"
                  style={{
                    "background-color": filter() === cat.id ? "var(--accent-primary)" : "var(--bg-tertiary)",
                    color: filter() === cat.id ? "var(--bg-primary)" : "var(--text-secondary)",
                    "font-weight": filter() === cat.id ? "500" : "400"
                  }}
                >
                  <span class="text-base">{cat.icon}</span>
                  <span>{cat.name[locale()]}</span>
                </button>
              )}
            </For>
          </div>
        </div>
      </div>

      {/* Results header */}
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm" style={{ color: "var(--text-tertiary)" }}>
          {filteredEntries().length} {locale() === "ko" ? "단어" : "words"}
          <Show when={selectedCategory()}>
            <span class="ml-2">
              in {selectedCategory()?.icon} {selectedCategory()?.name[locale()]}
            </span>
          </Show>
        </p>
      </div>

      {/* Entry list */}
      <div class="space-y-1">
        <For each={filteredEntries()}>
          {(entry) => {
            const translation = entry.translations[locale()];
            const category = getCategoryById(entry.categoryId);
            const pronunciation = getPronunciation(entry, locale());
            return (
              <A
                href={localePath(`/entry/${entry.id}`)}
                class="group flex items-center justify-between py-3 -mx-2 px-3 rounded-lg transition-colors"
                style={{ "border-bottom": "1px solid var(--border-primary)" }}
              >
                <div class="flex items-center gap-3">
                  <span class="text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                    {category?.icon}
                  </span>
                  <div class="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                    <span class="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
                      {entry.korean}
                    </span>
                    <Show when={pronunciation}>
                      <span class="text-sm" style={{ color: "var(--text-tertiary)" }}>
                        {pronunciation}
                      </span>
                    </Show>
                  </div>
                </div>
                <span class="text-sm text-right" style={{ color: "var(--text-secondary)" }}>
                  {translation.word}
                </span>
              </A>
            );
          }}
        </For>
      </div>

      {/* Empty state */}
      <Show when={filteredEntries().length === 0}>
        <div class="text-center py-12">
          <p class="text-lg mb-2" style={{ color: "var(--text-secondary)" }}>
            {locale() === "ko" ? "검색 결과가 없습니다" : "No results found"}
          </p>
          <p class="text-sm" style={{ color: "var(--text-tertiary)" }}>
            {locale() === "ko" ? "다른 검색어를 시도해보세요" : "Try a different search term"}
          </p>
        </div>
      </Show>
    </Layout>
  );
}
