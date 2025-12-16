import { Title, Meta } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { Layout } from "@/components/Layout";
import { getCategoryById, getCategoryColor } from "@/data/categories";
import { getEntriesByCategory, getEntriesBySubcategory } from "@/data/entries";

export default function CategoryPage() {
  const params = useParams();

  const category = createMemo(() => getCategoryById(params.categoryId));
  const entries = createMemo(() => getEntriesByCategory(params.categoryId));

  return (
    <Layout>
      <Show
        when={category()}
        fallback={
          <div class="container-custom py-16 text-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              카테고리를 찾을 수 없습니다
            </h1>
            <A href="/browse" class="btn-primary mt-4">
              전체보기로 돌아가기
            </A>
          </div>
        }
      >
        <Title>{category()!.name} - 한국어 어휘 데이터베이스</Title>
        <Meta name="description" content={category()!.description} />

        <div class="container-custom py-8">
          {/* 브레드크럼 */}
          <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <A href="/" class="hover:text-primary-600 dark:hover:text-primary-400">
              홈
            </A>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <A href="/browse" class="hover:text-primary-600 dark:hover:text-primary-400">
              전체보기
            </A>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-gray-900 dark:text-white">{category()!.name}</span>
          </nav>

          {/* 카테고리 헤더 */}
          <div class="card p-6 mb-8">
            <div class="flex items-start gap-4">
              <div
                class={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${getCategoryColor(category()!.color)}`}
              >
                {category()!.icon}
              </div>
              <div class="flex-1">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {category()!.name}
                </h1>
                <p class="text-gray-500 dark:text-gray-400">{category()!.nameEn}</p>
                <p class="text-gray-600 dark:text-gray-300 mt-2">{category()!.description}</p>
                <div class="flex items-center gap-3 mt-4 text-sm">
                  <span class="badge badge-primary">
                    {category()!.subcategories.length}개 하위 분류
                  </span>
                  <span class="badge badge-gray">{entries().length}개 어휘</span>
                </div>
              </div>
            </div>
          </div>

          {/* 하위 카테고리 */}
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">하위 분류</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <For each={category()!.subcategories}>
                {(sub) => {
                  const subEntries = getEntriesBySubcategory(params.categoryId, sub.id);
                  return (
                    <A
                      href={`/category/${params.categoryId}/${sub.id}`}
                      class="card p-4 hover:scale-[1.02] transition-transform group"
                    >
                      <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {sub.name}
                      </h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{sub.nameEn}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                        {sub.description}
                      </p>
                      <div class="mt-3">
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {subEntries.length}개 어휘
                        </span>
                      </div>
                    </A>
                  );
                }}
              </For>
            </div>
          </div>

          {/* 전체 어휘 목록 */}
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              전체 어휘 ({entries().length})
            </h2>
            <Show
              when={entries().length > 0}
              fallback={
                <div class="card p-8 text-center text-gray-500 dark:text-gray-400">
                  아직 등록된 어휘가 없습니다.
                </div>
              }
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <For each={entries()}>
                  {(entry) => (
                    <A
                      href={`/entry/${entry.id}`}
                      class="card p-4 hover:scale-[1.01] transition-transform group"
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex-1 min-w-0">
                          <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {entry.term}
                          </h3>
                          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {entry.definition}
                          </p>
                          <div class="flex flex-wrap gap-1 mt-2">
                            <For each={entry.tags.slice(0, 3)}>
                              {(tag) => (
                                <span class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                  {tag}
                                </span>
                              )}
                            </For>
                          </div>
                        </div>
                        <svg
                          class="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-shrink-0"
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
                    </A>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </Layout>
  );
}
