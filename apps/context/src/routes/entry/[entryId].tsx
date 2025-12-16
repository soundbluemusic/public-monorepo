import { Title, Meta } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { Layout } from "@/components/Layout";
import { getCategoryById, getCategoryColor } from "@/data/categories";
import { getEntryById, getEntriesByCategory } from "@/data/entries";
import { useI18n } from "@/i18n";
import type { TargetLanguage } from "@/data/types";

export default function EntryPage() {
  const params = useParams();
  const { locale, t } = useI18n();

  const entry = createMemo(() => params.entryId ? getEntryById(params.entryId) : undefined);
  const category = createMemo(() => {
    const e = entry();
    return e ? getCategoryById(e.categoryId) : undefined;
  });

  // Get translation based on current locale
  const translation = createMemo(() => {
    const e = entry();
    if (!e) return null;
    const lang = locale() === "ko" ? "en" : (locale() as TargetLanguage);
    return e.translations[lang];
  });

  // Get target language label
  const targetLangLabel = () => {
    if (locale() === "ko") return "English";
    if (locale() === "en") return "English";
    return "日本語";
  };

  // Get related entries from same category
  const relatedEntries = createMemo(() => {
    const e = entry();
    if (!e) return [];
    const sameCategory = getEntriesByCategory(e.categoryId);
    return sameCategory.filter((r) => r.id !== e.id).slice(0, 4);
  });

  // Get not found message based on locale
  const notFoundMessage = () => {
    if (locale() === "ko") return "단어를 찾을 수 없습니다";
    if (locale() === "ja") return "単語が見つかりません";
    return "Word not found";
  };

  return (
    <Layout>
      <Show
        when={entry()}
        fallback={
          <div class="container-custom py-16 text-center">
            <div class="text-6xl mb-4">📚</div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {notFoundMessage()}
            </h1>
            <A href="/browse" class="btn-primary mt-4">
              {t("backToList")}
            </A>
          </div>
        }
      >
        <Title>{entry()!.korean} - Context</Title>
        <Meta name="description" content={translation()?.explanation || ""} />

        <div class="container-custom py-8">
          {/* Breadcrumb */}
          <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
            <A href="/" class="hover:text-primary-600 dark:hover:text-primary-400">
              {t("home")}
            </A>
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <Show when={category()}>
              <A
                href={`/category/${category()!.id}`}
                class="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {category()!.name[locale()]}
              </A>
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </Show>
            <span class="text-gray-900 dark:text-white">{entry()!.korean}</span>
          </nav>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div class="lg:col-span-2">
              <article class="card p-6 md:p-8">
                {/* Header */}
                <header class="mb-8">
                  <Show when={category()}>
                    <div class="flex items-center gap-2 mb-4">
                      <span
                        class={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${getCategoryColor(category()!.color)}`}
                      >
                        {category()!.icon}
                      </span>
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        {category()!.name[locale()]}
                      </span>
                    </div>
                  </Show>

                  {/* Korean word (always displayed prominently) */}
                  <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {entry()!.korean}
                  </h1>
                  <p class="text-xl text-gray-500 dark:text-gray-400">
                    {entry()!.romanization}
                  </p>

                  {/* Hanja if available */}
                  <Show when={entry()!.hanja}>
                    <p class="text-lg text-gray-400 dark:text-gray-500 mt-1">
                      ({entry()!.hanja})
                    </p>
                  </Show>

                  {/* Badges */}
                  <div class="flex flex-wrap items-center gap-2 mt-4">
                    <span class={`badge ${
                      entry()!.difficulty === "beginner"
                        ? "badge-green"
                        : entry()!.difficulty === "intermediate"
                        ? "badge-yellow"
                        : "badge-red"
                    }`}>
                      {t(entry()!.difficulty)}
                    </span>
                    <span class="badge badge-gray">
                      {t(entry()!.partOfSpeech)}
                    </span>
                    <Show when={entry()!.frequency}>
                      <span class="badge badge-primary">
                        {entry()!.frequency === "common" ? "Common" : entry()!.frequency}
                      </span>
                    </Show>
                  </div>
                </header>

                {/* Translation section */}
                <Show when={translation()}>
                  <section class="mb-8 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                    <div class="flex items-center gap-2 mb-4">
                      <span class="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase">
                        {targetLangLabel()}
                      </span>
                      <span class="flex-1 h-px bg-primary-200 dark:bg-primary-800" />
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {translation()!.word}
                    </h2>
                    <Show when={translation()!.reading}>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        ({translation()!.reading})
                      </p>
                    </Show>
                    <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      {translation()!.explanation}
                    </p>
                  </section>
                </Show>

                {/* Examples */}
                <Show when={translation()?.examples && translation()!.examples!.length > 0}>
                  <section class="mb-8">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {t("examples")}
                    </h2>
                    <ul class="space-y-4">
                      <For each={translation()!.examples}>
                        {(example) => (
                          <li class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <p class="text-gray-700 dark:text-gray-300">{example}</p>
                          </li>
                        )}
                      </For>
                    </ul>
                  </section>
                </Show>

                {/* Tags */}
                <Show when={entry()!.tags.length > 0}>
                  <section>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {t("tags")}
                    </h2>
                    <div class="flex flex-wrap gap-2">
                      <For each={entry()!.tags}>
                        {(tag) => (
                          <span class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                            #{tag}
                          </span>
                        )}
                      </For>
                    </div>
                  </section>
                </Show>
              </article>
            </div>

            {/* Sidebar */}
            <aside class="space-y-6">
              {/* Related entries */}
              <Show when={relatedEntries().length > 0}>
                <div class="card p-5">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
                    {t("relatedWords")}
                  </h3>
                  <div class="space-y-3">
                    <For each={relatedEntries()}>
                      {(related) => {
                        const relatedTranslation = locale() === "ko"
                          ? related.translations.en
                          : related.translations[locale() as TargetLanguage];
                        return (
                          <A
                            href={`/entry/${related.id}`}
                            class="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                          >
                            <div class="flex items-center justify-between">
                              <p class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {related.korean}
                              </p>
                              <span class="text-xs text-gray-400">{related.romanization}</span>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {relatedTranslation.word}
                            </p>
                          </A>
                        );
                      }}
                    </For>
                  </div>
                </div>
              </Show>

              {/* Category info */}
              <Show when={category()}>
                <div class="card p-5">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
                    {t("category")}
                  </h3>
                  <A
                    href={`/category/${category()!.id}`}
                    class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <span
                      class={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${getCategoryColor(category()!.color)}`}
                    >
                      {category()!.icon}
                    </span>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {category()!.name[locale()]}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {category()!.description[locale()]}
                      </p>
                    </div>
                  </A>
                </div>
              </Show>

              {/* Back to browse */}
              <div class="card p-5">
                <A
                  href="/browse"
                  class="btn-secondary w-full justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t("backToList")}
                </A>
              </div>
            </aside>
          </div>
        </div>
      </Show>
    </Layout>
  );
}
