import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For, createSignal, createMemo } from "solid-js";
import { Layout } from "@/components/Layout";
import { categories } from "@/data/categories";
import { meaningEntries } from "@/data/entries";
import { useI18n } from "@/i18n";
import type { TargetLanguage, DifficultyLevel } from "@/data/types";

export default function Browse() {
  const { locale, t } = useI18n();
  const [filter, setFilter] = createSignal<string>("all");

  const getTargetLang = (): TargetLanguage => {
    return locale() === "ko" ? "en" : (locale() as TargetLanguage);
  };

  const filteredEntries = createMemo(() => {
    let entries = [...meaningEntries];
    if (filter() !== "all") {
      entries = entries.filter((e) => e.categoryId === filter());
    }
    return entries.sort((a, b) => a.korean.localeCompare(b.korean, "ko"));
  });

  return (
    <Layout>
      <Title>{t("browse")} - Context</Title>
      <Meta name="description" content="Browse Korean words" />

      {/* Header */}
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {t("browse")}
        </h1>

        {/* Filter */}
        <div class="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            class={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              filter() === "all"
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {locale() === "ko" ? "전체" : locale() === "ja" ? "全て" : "All"}
          </button>
          <For each={categories}>
            {(cat) => (
              <button
                onClick={() => setFilter(cat.id)}
                class={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  filter() === cat.id
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {cat.name[locale()]}
              </button>
            )}
          </For>
        </div>
      </div>

      {/* Count */}
      <p class="text-sm text-gray-400 dark:text-gray-500 mb-4">
        {filteredEntries().length} {locale() === "ko" ? "단어" : locale() === "ja" ? "単語" : "words"}
      </p>

      {/* Word list */}
      <div class="space-y-1">
        <For each={filteredEntries()}>
          {(entry) => {
            const translation = entry.translations[getTargetLang()];
            return (
              <A
                href={`/entry/${entry.id}`}
                class="flex items-baseline justify-between py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 -mx-2 px-2 rounded transition-colors"
              >
                <div class="flex items-baseline gap-3">
                  <span class="text-lg font-medium text-gray-900 dark:text-white">
                    {entry.korean}
                  </span>
                  <span class="text-sm text-gray-400 dark:text-gray-500">
                    {entry.romanization}
                  </span>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {translation.word}
                </span>
              </A>
            );
          }}
        </For>
      </div>
    </Layout>
  );
}
