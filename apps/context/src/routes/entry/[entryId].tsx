import { Title, Meta } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { Layout } from "@/components/Layout";
import { getCategoryById } from "@/data/categories";
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

  const getTargetLang = (): TargetLanguage => {
    return locale() === "ko" ? "en" : (locale() as TargetLanguage);
  };

  const translation = createMemo(() => {
    const e = entry();
    if (!e) return null;
    return e.translations[getTargetLang()];
  });

  const relatedEntries = createMemo(() => {
    const e = entry();
    if (!e) return [];
    return getEntriesByCategory(e.categoryId).filter((r) => r.id !== e.id).slice(0, 5);
  });

  return (
    <Layout>
      <Show
        when={entry()}
        fallback={
          <div class="text-center py-16">
            <p class="text-gray-500 dark:text-gray-400">
              {locale() === "ko" ? "단어를 찾을 수 없습니다" : locale() === "ja" ? "単語が見つかりません" : "Word not found"}
            </p>
            <A href="/" class="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-4 inline-block">
              ← {t("home")}
            </A>
          </div>
        }
      >
        <Title>{entry()!.korean} - Context</Title>
        <Meta name="description" content={translation()?.explanation || ""} />

        {/* Back link */}
        <A href="/" class="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mb-8 inline-block">
          ← {t("backToList")}
        </A>

        {/* Word header */}
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-1">
            {entry()!.korean}
          </h1>
          <p class="text-lg text-gray-400 dark:text-gray-500">
            {entry()!.romanization}
          </p>
          <Show when={entry()!.hanja}>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {entry()!.hanja}
            </p>
          </Show>
        </div>

        {/* Translation */}
        <Show when={translation()}>
          <div class="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
            <p class="text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
              {getTargetLang() === "en" ? "English" : "日本語"}
            </p>
            <h2 class="text-2xl font-medium text-gray-900 dark:text-white mb-3">
              {translation()!.word}
            </h2>
            <Show when={translation()!.reading}>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {translation()!.reading}
              </p>
            </Show>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              {translation()!.explanation}
            </p>
          </div>
        </Show>

        {/* Examples */}
        <Show when={translation()?.examples && translation()!.examples!.length > 0}>
          <div class="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
            <p class="text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
              {t("examples")}
            </p>
            <ul class="space-y-2">
              <For each={translation()!.examples}>
                {(example) => (
                  <li class="text-gray-600 dark:text-gray-300 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    {example}
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Show>

        {/* Meta info */}
        <div class="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
          <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{t(entry()!.partOfSpeech)}</span>
            <span>•</span>
            <span>{t(entry()!.difficulty)}</span>
            <Show when={category()}>
              <span>•</span>
              <A href={`/category/${category()!.id}`} class="hover:text-gray-900 dark:hover:text-white">
                {category()!.name[locale()]}
              </A>
            </Show>
          </div>
        </div>

        {/* Related words */}
        <Show when={relatedEntries().length > 0}>
          <div>
            <p class="text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
              {t("relatedWords")}
            </p>
            <div class="space-y-1">
              <For each={relatedEntries()}>
                {(related) => (
                  <A
                    href={`/entry/${related.id}`}
                    class="flex items-baseline justify-between py-2 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <div class="flex items-baseline gap-2">
                      <span class="text-gray-900 dark:text-white">{related.korean}</span>
                      <span class="text-sm text-gray-400 dark:text-gray-500">{related.romanization}</span>
                    </div>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {related.translations[getTargetLang()].word}
                    </span>
                  </A>
                )}
              </For>
            </div>
          </div>
        </Show>
      </Show>
    </Layout>
  );
}
