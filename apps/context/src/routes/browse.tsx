import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For, createSignal, createMemo } from "solid-js";
import { Layout } from "@/components/Layout";
import { categories, getCategoryColor } from "@/data/categories";
import { meaningEntries, getEntriesByCategory } from "@/data/entries";
import { useI18n } from "@/i18n";
import type { MeaningEntry, TargetLanguage, DifficultyLevel } from "@/data/types";

export default function Browse() {
  const { locale, t } = useI18n();
  const [selectedCategory, setSelectedCategory] = createSignal<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = createSignal<DifficultyLevel | "all">("all");
  const [sortBy, setSortBy] = createSignal<"korean" | "romanization">("korean");

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  // Get target language for translations
  const getTargetLang = (): TargetLanguage => {
    return locale() === "ko" ? "en" : (locale() as TargetLanguage);
  };

  // Filter and sort entries
  const filteredEntries = createMemo(() => {
    let entries = [...meaningEntries];

    // Filter by category
    if (selectedCategory() !== "all") {
      entries = entries.filter((e) => e.categoryId === selectedCategory());
    }

    // Filter by difficulty
    if (selectedDifficulty() !== "all") {
      entries = entries.filter((e) => e.difficulty === selectedDifficulty());
    }

    // Sort
    if (sortBy() === "korean") {
      entries.sort((a, b) => a.korean.localeCompare(b.korean, "ko"));
    } else {
      entries.sort((a, b) => a.romanization.localeCompare(b.romanization));
    }

    return entries;
  });

  // Get translation for entry
  const getTranslation = (entry: MeaningEntry) => {
    return entry.translations[getTargetLang()];
  };

  // Localized labels
  const getPageTitle = () => {
    if (locale() === "ko") return "전체보기 - Context";
    if (locale() === "ja") return "全て見る - Context";
    return "Browse All - Context";
  };

  const getMetaDescription = () => {
    if (locale() === "ko") return "한국어 단어를 카테고리별로 탐색하세요.";
    if (locale() === "ja") return "韓国語の単語をカテゴリー別に探索しましょう。";
    return "Browse Korean words by category.";
  };

  const getAllCategoriesLabel = () => {
    if (locale() === "ko") return "전체 카테고리";
    if (locale() === "ja") return "全カテゴリー";
    return "All Categories";
  };

  const getAllDifficultiesLabel = () => {
    if (locale() === "ko") return "전체 난이도";
    if (locale() === "ja") return "全レベル";
    return "All Levels";
  };

  const getSortByKoreanLabel = () => {
    if (locale() === "ko") return "한국어 순";
    if (locale() === "ja") return "韓国語順";
    return "By Korean";
  };

  const getSortByRomanizationLabel = () => {
    if (locale() === "ko") return "로마자 순";
    if (locale() === "ja") return "ローマ字順";
    return "By Romanization";
  };

  const getResultsLabel = (count: number) => {
    if (locale() === "ko") return `${count}개 단어`;
    if (locale() === "ja") return `${count}個の単語`;
    return `${count} words`;
  };

  const getNoResultsLabel = () => {
    if (locale() === "ko") return "검색 결과가 없습니다";
    if (locale() === "ja") return "検索結果がありません";
    return "No results found";
  };

  return (
    <Layout>
      <Title>{getPageTitle()}</Title>
      <Meta name="description" content={getMetaDescription()} />

      <div class="container-custom py-8">
        {/* Breadcrumb */}
        <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <A href="/" class="hover:text-primary-600 dark:hover:text-primary-400">
            {t("home")}
          </A>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-gray-900 dark:text-white">{t("browse")}</span>
        </nav>

        {/* Page header */}
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {t("browse")}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {locale() === "ko"
              ? "한국어 단어를 탐색하고 의미를 알아보세요"
              : locale() === "ja"
              ? "韓国語の単語を探索して意味を学びましょう"
              : "Explore Korean words and learn their meanings"}
          </p>
        </div>

        {/* Filters */}
        <div class="card p-4 mb-6">
          <div class="flex flex-wrap gap-4">
            {/* Category filter */}
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("category")}
              </label>
              <select
                value={selectedCategory()}
                onChange={(e) => setSelectedCategory(e.currentTarget.value)}
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">{getAllCategoriesLabel()}</option>
                <For each={sortedCategories}>
                  {(category) => (
                    <option value={category.id}>
                      {category.icon} {category.name[locale()]}
                    </option>
                  )}
                </For>
              </select>
            </div>

            {/* Difficulty filter */}
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {locale() === "ko" ? "난이도" : locale() === "ja" ? "レベル" : "Level"}
              </label>
              <select
                value={selectedDifficulty()}
                onChange={(e) => setSelectedDifficulty(e.currentTarget.value as DifficultyLevel | "all")}
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">{getAllDifficultiesLabel()}</option>
                <option value="beginner">{t("beginner")}</option>
                <option value="intermediate">{t("intermediate")}</option>
                <option value="advanced">{t("advanced")}</option>
              </select>
            </div>

            {/* Sort */}
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {locale() === "ko" ? "정렬" : locale() === "ja" ? "並び順" : "Sort"}
              </label>
              <select
                value={sortBy()}
                onChange={(e) => setSortBy(e.currentTarget.value as "korean" | "romanization")}
                class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="korean">{getSortByKoreanLabel()}</option>
                <option value="romanization">{getSortByRomanizationLabel()}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {getResultsLabel(filteredEntries().length)}
        </div>

        {/* Category cards (when showing all) */}
        {selectedCategory() === "all" && selectedDifficulty() === "all" && (
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t("browseByCategory")}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <For each={sortedCategories}>
                {(category) => {
                  const entryCount = getEntriesByCategory(category.id).length;
                  return (
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      class="card p-4 text-left hover:scale-[1.02] transition-transform group"
                    >
                      <div class="flex items-center gap-3">
                        <span
                          class={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${getCategoryColor(category.color)} group-hover:scale-110 transition-transform`}
                        >
                          {category.icon}
                        </span>
                        <div class="flex-1 min-w-0">
                          <h3 class="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {category.name[locale()]}
                          </h3>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            {getResultsLabel(entryCount)}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                }}
              </For>
            </div>
          </div>
        )}

        {/* Entries list */}
        {filteredEntries().length > 0 ? (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={filteredEntries()}>
              {(entry) => {
                const category = categories.find((c) => c.id === entry.categoryId);
                const translation = getTranslation(entry);
                return (
                  <A
                    href={`/entry/${entry.id}`}
                    class="card p-4 hover:scale-[1.02] transition-transform group"
                  >
                    <div class="flex items-start justify-between gap-3 mb-3">
                      <div class="flex-1 min-w-0">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {entry.korean}
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          {entry.romanization}
                        </p>
                      </div>
                      {category && (
                        <span
                          class={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${getCategoryColor(category.color)}`}
                        >
                          {category.icon}
                        </span>
                      )}
                    </div>

                    <p class="text-gray-800 dark:text-gray-200 font-medium mb-1">
                      {translation.word}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {translation.explanation}
                    </p>

                    <div class="flex items-center gap-2 mt-3">
                      <span
                        class={`badge ${
                          entry.difficulty === "beginner"
                            ? "badge-green"
                            : entry.difficulty === "intermediate"
                            ? "badge-yellow"
                            : "badge-red"
                        }`}
                      >
                        {t(entry.difficulty)}
                      </span>
                      <span class="badge badge-gray">{t(entry.partOfSpeech)}</span>
                    </div>
                  </A>
                );
              }}
            </For>
          </div>
        ) : (
          <div class="card p-12 text-center">
            <svg
              class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-gray-500 dark:text-gray-400">{getNoResultsLabel()}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
