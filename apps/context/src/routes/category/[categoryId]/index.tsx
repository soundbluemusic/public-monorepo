import { Title, Meta } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { Layout } from "@/components/Layout";
import { getCategoryById, getCategoryColor, categories } from "@/data/categories";
import { getEntriesByCategory } from "@/data/entries";
import { useI18n } from "@/i18n";
import type { TargetLanguage } from "@/data/types";

export default function CategoryPage() {
  const params = useParams();
  const { locale, t } = useI18n();

  const category = createMemo(() => params.categoryId ? getCategoryById(params.categoryId) : undefined);
  const entries = createMemo(() => params.categoryId ? getEntriesByCategory(params.categoryId) : []);

  // Get target language for translations
  const getTargetLang = (): TargetLanguage => {
    return locale() === "ko" ? "en" : (locale() as TargetLanguage);
  };

  // Localized labels
  const getNotFoundMessage = () => {
    if (locale() === "ko") return "카테고리를 찾을 수 없습니다";
    if (locale() === "ja") return "カテゴリーが見つかりません";
    return "Category not found";
  };

  const getBackToBrowseLabel = () => {
    if (locale() === "ko") return "전체보기로 돌아가기";
    if (locale() === "ja") return "一覧に戻る";
    return "Back to browse";
  };

  const getWordsLabel = (count: number) => {
    if (locale() === "ko") return `${count}개 단어`;
    if (locale() === "ja") return `${count}個の単語`;
    return `${count} words`;
  };

  const getNoEntriesMessage = () => {
    if (locale() === "ko") return "아직 등록된 단어가 없습니다";
    if (locale() === "ja") return "まだ登録された単語がありません";
    return "No words available yet";
  };

  const getAllWordsLabel = () => {
    if (locale() === "ko") return "전체 단어";
    if (locale() === "ja") return "全ての単語";
    return "All Words";
  };

  const getOtherCategoriesLabel = () => {
    if (locale() === "ko") return "다른 카테고리";
    if (locale() === "ja") return "他のカテゴリー";
    return "Other Categories";
  };

  return (
    <Layout>
      <Show
        when={category()}
        fallback={
          <div class="container-custom py-16 text-center">
            <div class="text-6xl mb-4">📂</div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {getNotFoundMessage()}
            </h1>
            <A href="/browse" class="btn-primary mt-4">
              {getBackToBrowseLabel()}
            </A>
          </div>
        }
      >
        <Title>{category()!.name[locale()]} - Context</Title>
        <Meta name="description" content={category()!.description[locale()]} />

        <div class="container-custom py-8">
          {/* Breadcrumb */}
          <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
            <A href="/" class="hover:text-primary-600 dark:hover:text-primary-400">
              {t("home")}
            </A>
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <A href="/browse" class="hover:text-primary-600 dark:hover:text-primary-400">
              {t("browse")}
            </A>
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-gray-900 dark:text-white">{category()!.name[locale()]}</span>
          </nav>

          {/* Category header */}
          <div class="card p-6 md:p-8 mb-8">
            <div class="flex items-start gap-4">
              <div
                class={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${getCategoryColor(category()!.color)}`}
              >
                {category()!.icon}
              </div>
              <div class="flex-1">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {category()!.name[locale()]}
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">
                  {category()!.description[locale()]}
                </p>
                <div class="flex items-center gap-3 mt-4">
                  <span class="badge badge-primary">
                    {getWordsLabel(entries().length)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content */}
            <div class="lg:col-span-3">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {getAllWordsLabel()} ({entries().length})
              </h2>

              <Show
                when={entries().length > 0}
                fallback={
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
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <p class="text-gray-500 dark:text-gray-400">{getNoEntriesMessage()}</p>
                  </div>
                }
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <For each={entries()}>
                    {(entry) => {
                      const translation = entry.translations[getTargetLang()];
                      return (
                        <A
                          href={`/entry/${entry.id}`}
                          class="card p-4 hover:scale-[1.02] transition-transform group"
                        >
                          <div class="flex items-start justify-between gap-3 mb-2">
                            <div class="flex-1 min-w-0">
                              <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {entry.korean}
                              </h3>
                              <p class="text-sm text-gray-500 dark:text-gray-400">
                                {entry.romanization}
                              </p>
                            </div>
                            <svg
                              class="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-shrink-0 mt-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>

                          <p class="text-gray-800 dark:text-gray-200 font-medium">
                            {translation.word}
                          </p>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
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
              </Show>
            </div>

            {/* Sidebar */}
            <aside class="space-y-6">
              {/* Other categories */}
              <div class="card p-5">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
                  {getOtherCategoriesLabel()}
                </h3>
                <div class="space-y-2">
                  <For each={categories.filter((c) => c.id !== params.categoryId).slice(0, 6)}>
                    {(cat) => (
                      <A
                        href={`/category/${cat.id}`}
                        class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        <span
                          class={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${getCategoryColor(cat.color)}`}
                        >
                          {cat.icon}
                        </span>
                        <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {cat.name[locale()]}
                        </span>
                      </A>
                    )}
                  </For>
                </div>
              </div>

              {/* Back to browse */}
              <div class="card p-5">
                <A href="/browse" class="btn-secondary w-full justify-center">
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
