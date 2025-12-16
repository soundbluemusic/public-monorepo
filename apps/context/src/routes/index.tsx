import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For } from "solid-js";
import { Layout } from "@/components/Layout";
import { categories, getCategoryColor, getCategoryBgColor } from "@/data/categories";
import { vocabEntries } from "@/data/entries";

export default function Home() {
  const stats = {
    categories: categories.length,
    subcategories: categories.reduce((acc, c) => acc + c.subcategories.length, 0),
    entries: vocabEntries.length,
  };

  const featuredCategories = [...categories].sort((a, b) => a.order - b.order).slice(0, 6);
  const recentEntries = vocabEntries.slice(0, 8);

  return (
    <Layout>
      <Title>한국어 어휘 데이터베이스 - Korean Vocabulary Database</Title>
      <Meta
        name="description"
        content="한글의 모든 어휘를 카테고리별로 정리한 종합 데이터베이스. 단어, 형태소, 신조어, 사투리, 이모지까지 체계적으로 분류된 한국어 자료."
      />
      <Meta name="keywords" content="한국어, 한글, 어휘, 단어, 형태소, 신조어, 사투리, 콩글리시, 이모지, 띄어쓰기" />

      {/* 히어로 섹션 */}
      <section class="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700">
        <div class="absolute inset-0 bg-grid-white/10" />
        <div class="relative container-custom py-16 md:py-24">
          <div class="max-w-3xl">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
              한국어의 모든 것을
              <br />
              <span class="text-primary-200">한 곳에서</span>
            </h1>
            <p class="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl">
              단어, 형태소, 신조어, 사투리, 이모지까지.
              한국어의 모든 어휘를 체계적으로 정리한 종합 데이터베이스입니다.
            </p>
            <div class="flex flex-wrap gap-4">
              <A href="/browse" class="btn-primary bg-white text-primary-700 hover:bg-primary-50">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                전체 보기
              </A>
              <A href="/about" class="btn-secondary border-white/30 text-white hover:bg-white/10">
                자세히 알아보기
              </A>
            </div>
          </div>

          {/* 통계 */}
          <div class="grid grid-cols-3 gap-4 mt-12 max-w-xl">
            <div class="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div class="text-3xl md:text-4xl font-bold text-white">{stats.categories}</div>
              <div class="text-sm text-primary-200 mt-1">카테고리</div>
            </div>
            <div class="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div class="text-3xl md:text-4xl font-bold text-white">{stats.subcategories}</div>
              <div class="text-sm text-primary-200 mt-1">하위 분류</div>
            </div>
            <div class="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div class="text-3xl md:text-4xl font-bold text-white">{stats.entries}+</div>
              <div class="text-sm text-primary-200 mt-1">어휘 항목</div>
            </div>
          </div>
        </div>

        {/* 장식 요소 */}
        <div class="absolute top-1/4 right-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
        <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
      </section>

      {/* 주요 카테고리 */}
      <section class="container-custom py-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              주요 카테고리
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
              체계적으로 분류된 한국어 어휘를 탐색하세요
            </p>
          </div>
          <A
            href="/browse"
            class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1"
          >
            전체 보기
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </A>
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
                      {category.name}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {category.nameEn}
                    </p>
                  </div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 mt-4 text-sm line-clamp-2">
                  {category.description}
                </p>
                <div class="flex items-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <span class="badge badge-gray">
                    {category.subcategories.length}개 하위 분류
                  </span>
                </div>
              </A>
            )}
          </For>
        </div>
      </section>

      {/* 최근 추가된 어휘 */}
      <section class="bg-gray-100 dark:bg-gray-800/50 py-16">
        <div class="container-custom">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                최근 추가된 어휘
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mt-2">
                새롭게 등록된 어휘 항목들
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <For each={recentEntries}>
              {(entry) => {
                const category = categories.find((c) => c.id === entry.categoryId);
                return (
                  <A
                    href={`/entry/${entry.id}`}
                    class="card p-4 hover:scale-[1.02] transition-transform group"
                  >
                    <div class="flex items-center gap-2 mb-2">
                      {category && (
                        <span
                          class={`w-6 h-6 rounded text-xs flex items-center justify-center font-bold ${getCategoryColor(category.color)}`}
                        >
                          {category.icon}
                        </span>
                      )}
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {category?.name}
                      </span>
                    </div>
                    <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                      {entry.term}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {entry.definition}
                    </p>
                  </A>
                );
              }}
            </For>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section class="container-custom py-16">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            왜 한국어 어휘 DB인가요?
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            한국어 학습자, 언어 연구자, 콘텐츠 제작자를 위한 최고의 한국어 레퍼런스
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              체계적인 분류
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              14개 대분류, 50개 이상의 하위 분류로 체계적으로 정리된 어휘
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              빠른 검색
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              단어, 정의, 예문, 태그로 원하는 어휘를 즉시 검색
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              오프라인 지원
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              PWA 지원으로 인터넷 없이도 앱처럼 사용 가능
            </p>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section class="bg-gradient-to-r from-primary-600 to-accent-600 py-16">
        <div class="container-custom text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            한국어 어휘 데이터베이스에 기여하세요
          </h2>
          <p class="text-primary-100 mb-8 max-w-2xl mx-auto">
            새로운 어휘, 신조어, 사투리 등을 추가하여 데이터베이스를 더 풍성하게 만들어주세요.
          </p>
          <A href="/contribute" class="btn-primary bg-white text-primary-700 hover:bg-primary-50">
            기여하기
          </A>
        </div>
      </section>
    </Layout>
  );
}
