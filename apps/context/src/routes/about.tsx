import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { Layout } from "@/components/Layout";
import { categories } from "@/data/categories";
import { meaningEntries } from "@/data/entries";
import { useI18n } from "@/i18n";

export default function About() {
  const { locale, t } = useI18n();

  const stats = {
    categories: categories.length,
    entries: meaningEntries.length,
  };

  // Localized content
  const getPageTitle = () => {
    if (locale() === "ko") return "소개 - Context";
    if (locale() === "ja") return "概要 - Context";
    return "About - Context";
  };

  const getMetaDescription = () => {
    if (locale() === "ko") return "Context: 한국어 학습자를 위한 다국어 의미 사전";
    if (locale() === "ja") return "Context: 韓国語学習者のための多言語意味辞典";
    return "Context: Multilingual meaning dictionary for Korean learners";
  };

  const getMainTitle = () => {
    if (locale() === "ko") return "Context";
    if (locale() === "ja") return "Context";
    return "Context";
  };

  const getTagline = () => {
    if (locale() === "ko") return "한국어 학습자를 위한 다국어 의미 사전";
    if (locale() === "ja") return "韓国語学習者のための多言語意味辞典";
    return "Multilingual meaning dictionary for Korean learners";
  };

  const getAboutTitle = () => {
    if (locale() === "ko") return "프로젝트 소개";
    if (locale() === "ja") return "プロジェクト紹介";
    return "About the Project";
  };

  const getAboutContent = () => {
    if (locale() === "ko") {
      return [
        "Context는 한국어를 배우는 학습자들을 위한 다국어 의미 사전입니다. 한국어 단어의 의미를 영어와 일본어로 자세히 설명하여, 단순한 번역을 넘어 진정한 이해를 돕습니다.",
        "각 단어에는 발음(로마자 표기), 품사, 난이도, 사용 예문이 포함되어 있어 실제 상황에서 어떻게 사용되는지 쉽게 파악할 수 있습니다.",
      ];
    }
    if (locale() === "ja") {
      return [
        "Contextは韓国語を学ぶ学習者のための多言語意味辞典です。韓国語の単語の意味を英語と日本語で詳しく説明し、単純な翻訳を超えた真の理解を助けます。",
        "各単語には発音（ローマ字表記）、品詞、難易度、使用例文が含まれており、実際の状況でどのように使われるかを簡単に把握できます。",
      ];
    }
    return [
      "Context is a multilingual meaning dictionary designed for Korean learners. It provides detailed explanations of Korean words in English and Japanese, helping you truly understand meanings beyond simple translations.",
      "Each word entry includes pronunciation (romanization), part of speech, difficulty level, and example sentences, making it easy to understand how words are used in real situations.",
    ];
  };

  const getFeaturesTitle = () => {
    if (locale() === "ko") return "주요 기능";
    if (locale() === "ja") return "主な機能";
    return "Key Features";
  };

  const getFeatures = () => {
    if (locale() === "ko") {
      return [
        { title: "다국어 설명", desc: "영어와 일본어로 상세한 의미 설명 제공" },
        { title: "발음 가이드", desc: "로마자 표기와 함께 정확한 발음 학습" },
        { title: "난이도 표시", desc: "초급/중급/고급으로 구분된 학습 난이도" },
        { title: "카테고리 분류", desc: "주제별로 정리된 체계적인 어휘 학습" },
        { title: "예문 제공", desc: "실제 상황에서의 사용 예문으로 활용법 이해" },
        { title: "빠른 검색", desc: "한국어, 로마자, 번역어로 쉽게 검색" },
      ];
    }
    if (locale() === "ja") {
      return [
        { title: "多言語説明", desc: "英語と日本語で詳細な意味説明を提供" },
        { title: "発音ガイド", desc: "ローマ字表記と共に正確な発音を学習" },
        { title: "難易度表示", desc: "初級/中級/上級に区分された学習難易度" },
        { title: "カテゴリー分類", desc: "テーマ別に整理された体系的な語彙学習" },
        { title: "例文提供", desc: "実際の状況での使用例文で活用法を理解" },
        { title: "高速検索", desc: "韓国語、ローマ字、訳語で簡単検索" },
      ];
    }
    return [
      { title: "Multilingual Explanations", desc: "Detailed meanings in English and Japanese" },
      { title: "Pronunciation Guide", desc: "Learn accurate pronunciation with romanization" },
      { title: "Difficulty Levels", desc: "Organized by beginner/intermediate/advanced" },
      { title: "Category Classification", desc: "Systematic vocabulary learning by topic" },
      { title: "Example Sentences", desc: "Understand usage through real-world examples" },
      { title: "Fast Search", desc: "Search by Korean, romanization, or translation" },
    ];
  };

  const getStatsTitle = () => {
    if (locale() === "ko") return "현재 현황";
    if (locale() === "ja") return "現在の状況";
    return "Current Statistics";
  };

  const getCategoriesLabel = () => {
    if (locale() === "ko") return "카테고리";
    if (locale() === "ja") return "カテゴリー";
    return "Categories";
  };

  const getWordsLabel = () => {
    if (locale() === "ko") return "단어";
    if (locale() === "ja") return "単語";
    return "Words";
  };

  const getLanguagesLabel = () => {
    if (locale() === "ko") return "지원 언어";
    if (locale() === "ja") return "対応言語";
    return "Languages";
  };

  const getTechStackTitle = () => {
    if (locale() === "ko") return "기술 스택";
    if (locale() === "ja") return "技術スタック";
    return "Tech Stack";
  };

  const getTechNote = () => {
    if (locale() === "ko") return "모든 페이지는 빌드 시 정적으로 생성되어 빠른 로딩 속도와 SEO 최적화를 제공합니다.";
    if (locale() === "ja") return "全てのページはビルド時に静的生成され、高速なロード速度とSEO最適化を提供します。";
    return "All pages are statically generated at build time for fast loading and SEO optimization.";
  };

  const getStartLearningTitle = () => {
    if (locale() === "ko") return "지금 시작하세요";
    if (locale() === "ja") return "今すぐ始めましょう";
    return "Start Learning Now";
  };

  const getStartLearningDesc = () => {
    if (locale() === "ko") return "Context와 함께 한국어 단어의 진정한 의미를 이해하세요";
    if (locale() === "ja") return "Contextと一緒に韓国語の単語の本当の意味を理解しましょう";
    return "Understand the true meaning of Korean words with Context";
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
          <span class="text-gray-900 dark:text-white">{t("about")}</span>
        </nav>

        <div class="max-w-4xl">
          {/* Header */}
          <div class="mb-12">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {getMainTitle()}
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              {getTagline()}
            </p>
          </div>

          {/* About section */}
          <section class="card p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {getAboutTitle()}
            </h2>
            <div class="prose dark:prose-invert max-w-none space-y-4">
              {getAboutContent().map((paragraph) => (
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Features */}
          <section class="card p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {getFeaturesTitle()}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getFeatures().map((feature, index) => (
                <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span class="text-primary-600 dark:text-primary-400 font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section class="card p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {getStatsTitle()}
            </h2>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {stats.categories}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {getCategoriesLabel()}
                </div>
              </div>
              <div class="text-center p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
                <div class="text-3xl font-bold text-accent-600 dark:text-accent-400">
                  {stats.entries}+
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {getWordsLabel()}
                </div>
              </div>
              <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div class="text-3xl font-bold text-green-600 dark:text-green-400">
                  3
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {getLanguagesLabel()}
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section class="card p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {getTechStackTitle()}
            </h2>
            <div class="flex flex-wrap gap-3">
              <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                SolidStart
              </span>
              <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                TypeScript
              </span>
              <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                Tailwind CSS
              </span>
              <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                PWA
              </span>
              <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                SSG
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
              {getTechNote()}
            </p>
          </section>

          {/* CTA */}
          <div class="text-center py-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {getStartLearningTitle()}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              {getStartLearningDesc()}
            </p>
            <A href="/browse" class="btn-primary">
              {t("browse")}
            </A>
          </div>
        </div>
      </div>
    </Layout>
  );
}
