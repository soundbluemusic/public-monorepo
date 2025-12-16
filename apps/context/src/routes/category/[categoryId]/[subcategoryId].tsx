import { Title, Meta } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { Layout } from "@/components/Layout";
import { getSubcategoryById, getCategoryColor } from "@/data/categories";
import { getEntriesBySubcategory } from "@/data/entries";

export default function SubcategoryPage() {
  const params = useParams();

  const data = createMemo(() =>
    getSubcategoryById(params.categoryId, params.subcategoryId)
  );
  const entries = createMemo(() =>
    getEntriesBySubcategory(params.categoryId, params.subcategoryId)
  );

  return (
    <Layout>
      <Show
        when={data()}
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
        <Title>
          {data()!.subcategory.name} - {data()!.category.name} - 한국어 어휘 데이터베이스
        </Title>
        <Meta name="description" content={data()!.subcategory.description} />

        <div class="container-custom py-8">
          {/* 브레드크럼 */}
          <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
            <A href="/" class="hover:text-primary-600 dark:hover:text-primary-400">
              홈
            </A>
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <A href="/browse" class="hover:text-primary-600 dark:hover:text-primary-400">
              전체보기
            </A>
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <A
              href={`/category/${params.categoryId}`}
              class="hover:text-primary-600 dark:hover:text-primary-400"
            >
              {data()!.category.name}
            </A>
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-gray-900 dark:text-white">{data()!.subcategory.name}</span>
          </nav>

          {/* 헤더 */}
          <div class="card p-6 mb-8">
            <div class="flex items-start gap-4">
              <div
                class={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${getCategoryColor(data()!.category.color)}`}
              >
                {data()!.category.icon}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <A
                    href={`/category/${params.categoryId}`}
                    class="hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {data()!.category.name}
                  </A>
                  <span>/</span>
                </div>
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {data()!.subcategory.name}
                </h1>
                <p class="text-gray-500 dark:text-gray-400">{data()!.subcategory.nameEn}</p>
                <p class="text-gray-600 dark:text-gray-300 mt-2">
                  {data()!.subcategory.description}
                </p>
                <div class="mt-4">
                  <span class="badge badge-primary">{entries().length}개 어휘</span>
                </div>
              </div>
            </div>
          </div>

          {/* 어휘 목록 */}
          <Show
            when={entries().length > 0}
            fallback={
              <div class="card p-8 text-center text-gray-500 dark:text-gray-400">
                <svg
                  class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>아직 등록된 어휘가 없습니다.</p>
                <A href="/contribute" class="text-primary-600 dark:text-primary-400 hover:underline mt-2 inline-block">
                  어휘 추가하기
                </A>
              </div>
            }
          >
            <div class="space-y-4">
              <For each={entries()}>
                {(entry) => (
                  <A
                    href={`/entry/${entry.id}`}
                    class="card p-5 block hover:scale-[1.005] transition-transform group"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {entry.term}
                        </h3>
                        {entry.pronunciation && (
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            [{entry.pronunciation}]
                          </p>
                        )}
                        <p class="text-gray-600 dark:text-gray-300 mt-2">{entry.definition}</p>
                        <Show when={entry.examples.length > 0}>
                          <div class="mt-3 space-y-1">
                            <For each={entry.examples.slice(0, 2)}>
                              {(example) => (
                                <p class="text-sm text-gray-500 dark:text-gray-400 italic">
                                  "{example}"
                                </p>
                              )}
                            </For>
                          </div>
                        </Show>
                        <div class="flex flex-wrap gap-1.5 mt-3">
                          <For each={entry.tags}>
                            {(tag) => (
                              <span class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                {tag}
                              </span>
                            )}
                          </For>
                        </div>
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
                  </A>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Show>
    </Layout>
  );
}
