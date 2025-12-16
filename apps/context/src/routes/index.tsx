import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Layout } from "@/components/Layout";
import { categories, getCategoryColor } from "@/data/categories";
import { meaningEntries, getFeaturedEntries } from "@/data/entries";
import { useI18n } from "@/i18n";
import type { MeaningEntry, TargetLanguage } from "@/data/types";

export default function Home() {
  const { locale, targetLang, t } = useI18n();

  const stats = {
    categories: categories.length,
    entries: meaningEntries.length,
  };

  const featuredCategories = [...categories].sort((a, b) => a.order - b.order).slice(0, 6);
  const featuredEntries = getFeaturedEntries(6);

  // Get translation for current target language
  const getTranslation = (entry: MeaningEntry) => {
    const lang = locale() === "ko" ? "en" : (locale() as TargetLanguage);
    return entry.translations[lang];
  };

  // Get meta description based on locale
  const getMetaDescription = () => {
    if (locale() === "ko") {
      return "한국어 학습자를 위한 다국어 의미 사전. 한국어 단어의 의미를 영어, 일본어로 설명합니다.";
    } else if (locale() === "ja") {
      return "韓国語学習者のための多言語意味辞典。韓国語の単語の意味を日本語で説明します。";
    }
    return "Multilingual meaning dictionary for Korean learners. Korean words explained in English and Japanese.";
  };

  return (
    <Layout>
      <Title>Context - {t("heroTitle")}</Title>
      <Meta name="description" content={getMetaDescription()} />

      {/* Hero Section */}
      <section class="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700">
        <div class="absolute inset-0 bg-grid-white/10" />
        <div class="relative container-custom py-16 md:py-24">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white/90 text-sm mb-6">
              <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {locale() === "ko"
                ? "한국어 → 영어/일본어"
                : locale() === "ja"
                ? "韓国語 → 日本語/英語"
                : "Korean → English/Japanese"}
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
              {t("heroTitle")}
            </h1>
            <p class="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl">
              {t("heroSubtitle")}
            </p>
            <div class="flex flex-wrap gap-4">
              <A href="/browse" class="btn-primary bg-white text-primary-700 hover:bg-primary-50">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t("browse")}
              </A>
              <A href="/about" class="btn-secondary border-white/30 text-white hover:bg-white/10">
                {t("about")}
              </A>
            </div>
          </div>

          {/* Stats */}
          <div class="grid grid-cols-2 gap-4 mt-12 max-w-md">
            <div class="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div class="text-3xl md:text-4xl font-bold text-white">{stats.categories}</div>
              <div class="text-sm text-primary-200 mt-1">
                {locale() === "ko" ? "카테고리" : locale() === "ja" ? "カテゴリー" : "Categories"}
              </div>
            </div>
            <div class="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div class="text-3xl md:text-4xl font-bold text-white">{stats.entries}+</div>
              <div class="text-sm text-primary-200 mt-1">
                {locale() === "ko" ? "단어" : locale() === "ja" ? "単語" : "Words"}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div class="absolute top-1/4 right-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
        <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
      </section>

      {/* Featured Words */}
      <section class="container-custom py-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t("featuredWords")}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
              {locale() === "ko"
                ? "한국어 학습에 필수적인 기본 단어"
                : locale() === "ja"
                ? "韓国語学習に必須の基本単語"
                : "Essential Korean words for beginners"}
            </p>
          </div>
          <A
            href="/browse"
            class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1"
          >
            {t("viewAll")}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </A>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <For each={featuredEntries}>
            {(entry) => {
              const category = categories.find((c) => c.id === entry.categoryId);
              const translation = getTranslation(entry);
              return (
                <A
                  href={`/entry/${entry.id}`}
                  class="card group p-6 hover:scale-[1.02] transition-transform"
                >
                  {/* Korean word */}
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <h3 class="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {entry.korean}
                      </h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {entry.romanization}
                      </p>
                    </div>
                    <Show when={category}>
                      <span
                        class={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${getCategoryColor(category!.color)}`}
                      >
                        {category!.icon}
                      </span>
                    </Show>
                  </div>

                  {/* Translation */}
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                        {locale() === "ko" ? "EN" : locale().toUpperCase()}
                      </span>
                      <span class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <p class="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {translation.word}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {translation.explanation}
                    </p>
                  </div>

                  {/* Difficulty badge */}
                  <div class="flex items-center gap-2 mt-4">
                    <span class={`badge ${
                      entry.difficulty === "beginner"
                        ? "badge-green"
                        : entry.difficulty === "intermediate"
                        ? "badge-yellow"
                        : "badge-red"
                    }`}>
                      {t(entry.difficulty)}
                    </span>
                    <span class="badge badge-gray">
                      {t(entry.partOfSpeech)}
                    </span>
                  </div>
                </A>
              );
            }}
          </For>
        </div>
      </section>

      {/* Browse by Category */}
      <section class="bg-gray-100 dark:bg-gray-800/50 py-16">
        <div class="container-custom">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {t("browseByCategory")}
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mt-2">
                {locale() === "ko"
                  ? "주제별로 단어를 찾아보세요"
                  : locale() === "ja"
                  ? "テーマ別に単語を探す"
                  : "Find words by topic"}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={featuredCategories}>
              {(category) => (
                <A
                  href={`/category/${category.id}`}
                  class="card group p-6 hover:scale-[1.02] transition-transform"
                >
                  <div class="flex items-start gap-4">
                    <div
                      class={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${getCategoryColor(category.color)} group-hover:scale-110 transition-transform`}
                    >
                      {category.icon}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {category.name[locale()]}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {category.description[locale()]}
                      </p>
                    </div>
                  </div>
                </A>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section class="container-custom py-16">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {locale() === "ko"
              ? "Context 사용법"
              : locale() === "ja"
              ? "Contextの使い方"
              : "How Context Works"}
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">1</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {locale() === "ko"
                ? "한국어 단어 검색"
                : locale() === "ja"
                ? "韓国語の単語を検索"
                : "Search Korean Words"}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {locale() === "ko"
                ? "알고 싶은 한국어 단어를 검색하세요"
                : locale() === "ja"
                ? "知りたい韓国語の単語を検索"
                : "Search for Korean words you want to learn"}
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-accent-600 dark:text-accent-400">2</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {locale() === "ko"
                ? "언어 선택"
                : locale() === "ja"
                ? "言語を選択"
                : "Choose Your Language"}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {locale() === "ko"
                ? "영어 또는 일본어로 설명을 확인하세요"
                : locale() === "ja"
                ? "日本語または英語で説明を確認"
                : "View explanations in English or Japanese"}
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {locale() === "ko"
                ? "의미와 예문 학습"
                : locale() === "ja"
                ? "意味と例文を学習"
                : "Learn Meanings & Examples"}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {locale() === "ko"
                ? "자세한 설명과 예문으로 학습하세요"
                : locale() === "ja"
                ? "詳しい説明と例文で学習"
                : "Study with detailed explanations and examples"}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="bg-gradient-to-r from-primary-600 to-accent-600 py-16">
        <div class="container-custom text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            {locale() === "ko"
              ? "지금 한국어 학습을 시작하세요"
              : locale() === "ja"
              ? "今すぐ韓国語学習を始めましょう"
              : "Start Learning Korean Today"}
          </h2>
          <p class="text-primary-100 mb-8 max-w-2xl mx-auto">
            {locale() === "ko"
              ? "Context와 함께라면 한국어 단어의 진정한 의미를 이해할 수 있습니다"
              : locale() === "ja"
              ? "Contextと一緒なら韓国語の単語の本当の意味が分かります"
              : "With Context, you can truly understand the meaning of Korean words"}
          </p>
          <A href="/browse" class="btn-primary bg-white text-primary-700 hover:bg-primary-50">
            {t("browse")}
          </A>
        </div>
      </section>
    </Layout>
  );
}
