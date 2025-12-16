import { Title, Meta } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { Layout } from "@/components/Layout";
import { getCategoryById } from "@/data/categories";
import { getEntriesByCategory } from "@/data/entries";
import { useI18n } from "@/i18n";
import type { TargetLanguage } from "@/data/types";

export default function CategoryPage() {
  const params = useParams();
  const { locale, t } = useI18n();

  const category = createMemo(() => params.categoryId ? getCategoryById(params.categoryId) : undefined);
  const entries = createMemo(() => params.categoryId ? getEntriesByCategory(params.categoryId) : []);

  const getTargetLang = (): TargetLanguage => {
    return locale() === "ko" ? "en" : (locale() as TargetLanguage);
  };

  return (
    <Layout>
      <Show
        when={category()}
        fallback={
          <div class="text-center py-16">
            <p class="text-gray-500 dark:text-gray-400">
              {locale() === "ko" ? "카테고리를 찾을 수 없습니다" : locale() === "ja" ? "カテゴリーが見つかりません" : "Category not found"}
            </p>
            <A href="/browse" class="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-4 inline-block">
              ← {t("browse")}
            </A>
          </div>
        }
      >
        <Title>{category()!.name[locale()]} - Context</Title>
        <Meta name="description" content={category()!.description[locale()]} />

        {/* Back link */}
        <A href="/browse" class="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mb-6 inline-block">
          ← {t("browse")}
        </A>

        {/* Header */}
        <div class="mb-6">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {category()!.name[locale()]}
          </h1>
          <p class="text-gray-500 dark:text-gray-400">
            {category()!.description[locale()]}
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {entries().length} {locale() === "ko" ? "단어" : locale() === "ja" ? "単語" : "words"}
          </p>
        </div>

        {/* Word list */}
        <Show
          when={entries().length > 0}
          fallback={
            <p class="text-gray-400 dark:text-gray-500 text-center py-8">
              {locale() === "ko" ? "등록된 단어가 없습니다" : locale() === "ja" ? "登録された単語がありません" : "No words available"}
            </p>
          }
        >
          <div class="space-y-1">
            <For each={entries()}>
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
        </Show>
      </Show>
    </Layout>
  );
}
