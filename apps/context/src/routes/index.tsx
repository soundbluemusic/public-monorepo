import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For } from "solid-js";
import { Layout } from "@/components/Layout";
import { meaningEntries, getFeaturedEntries } from "@/data/entries";
import { useI18n } from "@/i18n";
import type { MeaningEntry, TargetLanguage } from "@/data/types";

export default function Home() {
  const { locale, t } = useI18n();
  const featuredEntries = getFeaturedEntries(12);

  const getTargetLang = (): TargetLanguage => {
    return locale() === "ko" ? "en" : (locale() as TargetLanguage);
  };

  const getMetaDescription = () => {
    if (locale() === "ko") return "한국어 학습자를 위한 의미 사전";
    if (locale() === "ja") return "韓国語学習者のための意味辞典";
    return "Meaning dictionary for Korean learners";
  };

  return (
    <Layout>
      <Title>Context</Title>
      <Meta name="description" content={getMetaDescription()} />

      {/* Header */}
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {locale() === "ko" ? "한국어 의미 사전" : locale() === "ja" ? "韓国語意味辞典" : "Korean Dictionary"}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          {locale() === "ko"
            ? "한국어 단어의 의미를 영어, 일본어로 설명합니다"
            : locale() === "ja"
            ? "韓国語の単語の意味を説明します"
            : "Korean words explained in English and Japanese"}
        </p>
      </div>

      {/* Word list */}
      <div class="space-y-1">
        <For each={featuredEntries}>
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

      {/* View all link */}
      <div class="mt-8 text-center">
        <A
          href="/browse"
          class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {t("viewAll")} →
        </A>
      </div>
    </Layout>
  );
}
