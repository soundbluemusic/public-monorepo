import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For } from "solid-js";
import { Layout } from "@/components/Layout";
import { categories, getCategoryColor } from "@/data/categories";
import { getEntriesByCategory } from "@/data/entries";

export default function Browse() {
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <Layout>
      <Title>전체보기 - 한국어 어휘 데이터베이스</Title>
      <Meta name="description" content="한국어 어휘 데이터베이스의 모든 카테고리를 탐색하세요." />

      <div class="container-custom py-8">
        {/* 페이지 헤더 */}
        <div class="mb-8">
          <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <A href="/" class="hover:text-primary-600 dark:hover:text-primary-400">
              홈
            </A>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-gray-900 dark:text-white">전체보기</span>
          </nav>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">전체 카테고리</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {categories.length}개의 대분류와{" "}
            {categories.reduce((acc, c) => acc + c.subcategories.length, 0)}개의 하위 분류
          </p>
        </div>

        {/* 카테고리 그리드 */}
        <div class="space-y-8">
          <For each={sortedCategories}>
            {(category) => {
              const entryCount = getEntriesByCategory(category.id).length;
              return (
                <div class="card p-6">
                  <div class="flex items-start gap-4 mb-6">
                    <div
                      class={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${getCategoryColor(category.color)}`}
                    >
                      {category.icon}
                    </div>
                    <div class="flex-1">
                      <A
                        href={`/category/${category.id}`}
                        class="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {category.name}
                      </A>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{category.nameEn}</p>
                      <p class="text-gray-600 dark:text-gray-300 mt-2">{category.description}</p>
                      <div class="flex items-center gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>{category.subcategories.length}개 하위 분류</span>
                        <span>•</span>
                        <span>{entryCount}개 어휘</span>
                      </div>
                    </div>
                  </div>

                  {/* 하위 카테고리 */}
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    <For each={category.subcategories}>
                      {(sub) => (
                        <A
                          href={`/category/${category.id}/${sub.id}`}
                          class="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                        >
                          <h3 class="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                            {sub.name}
                          </h3>
                          <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {sub.nameEn}
                          </p>
                        </A>
                      )}
                    </For>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </Layout>
  );
}
