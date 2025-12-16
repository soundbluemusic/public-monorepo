import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { Layout } from "@/components/Layout";
import { categories } from "@/data/categories";
import { meaningEntries } from "@/data/entries";
import { useI18n } from "@/i18n";

export default function About() {
  const { locale, t } = useI18n();

  const getContent = () => {
    if (locale() === "ko") {
      return {
        title: "Context 소개",
        description: "한국어를 배우는 학습자들을 위한 의미 사전입니다. 한국어 단어의 의미를 영어와 일본어로 자세히 설명합니다.",
        stats: `${categories.length}개 카테고리 · ${meaningEntries.length}개 단어 · 3개 언어`,
      };
    }
    if (locale() === "ja") {
      return {
        title: "Contextについて",
        description: "韓国語を学ぶ学習者のための意味辞典です。韓国語の単語の意味を英語と日本語で詳しく説明します。",
        stats: `${categories.length}カテゴリー · ${meaningEntries.length}単語 · 3言語`,
      };
    }
    return {
      title: "About Context",
      description: "A meaning dictionary for Korean learners. Korean words explained in detail in English and Japanese.",
      stats: `${categories.length} categories · ${meaningEntries.length} words · 3 languages`,
    };
  };

  const content = getContent();

  return (
    <Layout>
      <Title>{t("about")} - Context</Title>
      <Meta name="description" content={content.description} />

      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {content.title}
        </h1>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          {content.description}
        </p>
        <p class="text-sm text-gray-400 dark:text-gray-500">
          {content.stats}
        </p>
      </div>

      <div class="pt-6 border-t border-gray-100 dark:border-gray-800">
        <A
          href="/browse"
          class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {t("browse")} →
        </A>
      </div>
    </Layout>
  );
}
