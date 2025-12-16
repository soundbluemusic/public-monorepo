import { Title, Meta } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { Layout } from "@/components/Layout";
import { getCategoryById, getCategoryColor } from "@/data/categories";
import { getEntryById, getEntriesByTag } from "@/data/entries";

export default function EntryPage() {
  const params = useParams();

  const entry = createMemo(() => getEntryById(params.entryId));
  const category = createMemo(() => {
    const e = entry();
    return e ? getCategoryById(e.categoryId) : undefined;
  });
  const subcategory = createMemo(() => {
    const e = entry();
    const c = category();
    if (!e || !c || !e.subcategoryId) return undefined;
    return c.subcategories.find((s) => s.id === e.subcategoryId);
  });

  const relatedEntries = createMemo(() => {
    const e = entry();
    if (!e || e.tags.length === 0) return [];
    const related = getEntriesByTag(e.tags[0]);
    return related.filter((r) => r.id !== e.id).slice(0, 4);
  });

  return (
    <Layout>
      <Show
        when={entry()}
        fallback={
          <div class="container-custom py-16 text-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              어휘를 찾을 수 없습니다
            </h1>
            <A href="/browse" class="btn-primary mt-4">
              전체보기로 돌아가기
            </A>
          </div>
        }
      >
        <Title>{entry()!.term} - 한국어 어휘 데이터베이스</Title>
        <Meta name="description" content={entry()!.definition} />
        <Meta name="keywords" content={entry()!.tags.join(", ")} />

        <div class="container-custom py-8">
          {/* 브레드크럼 */}
          <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
            <A href="/" class="hover:text-primary-600 dark:hover:text-primary-400">
              홈
            </A>
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <Show when={category()}>
              <A
                href={`/category/${category()!.id}`}
                class="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {category()!.name}
              </A>
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </Show>
            <Show when={subcategory()}>
              <A
                href={`/category/${category()!.id}/${subcategory()!.id}`}
                class="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {subcategory()!.name}
              </A>
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </Show>
            <span class="text-gray-900 dark:text-white truncate">{entry()!.term}</span>
          </nav>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 메인 콘텐츠 */}
            <div class="lg:col-span-2">
              <article class="card p-6 md:p-8">
                {/* 헤더 */}
                <header class="mb-6">
                  <Show when={category()}>
                    <div class="flex items-center gap-2 mb-3">
                      <span
                        class={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${getCategoryColor(category()!.color)}`}
                      >
                        {category()!.icon}
                      </span>
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        {category()!.name}
                        {subcategory() && ` > ${subcategory()!.name}`}
                      </span>
                    </div>
                  </Show>
                  <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {entry()!.term}
                  </h1>
                  {entry()!.pronunciation && (
                    <p class="text-lg text-gray-500 dark:text-gray-400 mt-2">
                      [{entry()!.pronunciation}]
                    </p>
                  )}
                </header>

                {/* 정의 */}
                <section class="mb-8">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    정의
                  </h2>
                  <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {entry()!.definition}
                  </p>
                </section>

                {/* 예문 */}
                <Show when={entry()!.examples.length > 0}>
                  <section class="mb-8">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      예문
                    </h2>
                    <ul class="space-y-3">
                      <For each={entry()!.examples}>
                        {(example) => (
                          <li class="flex items-start gap-3">
                            <span class="text-primary-500 mt-1">•</span>
                            <p class="text-gray-700 dark:text-gray-300 italic">"{example}"</p>
                          </li>
                        )}
                      </For>
                    </ul>
                  </section>
                </Show>

                {/* 관련 용어 */}
                <Show when={entry()!.relatedTerms && entry()!.relatedTerms!.length > 0}>
                  <section class="mb-8">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      관련 용어
                    </h2>
                    <div class="flex flex-wrap gap-2">
                      <For each={entry()!.relatedTerms}>
                        {(term) => (
                          <span class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
                            {term}
                          </span>
                        )}
                      </For>
                    </div>
                  </section>
                </Show>

                {/* 태그 */}
                <section>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    태그
                  </h2>
                  <div class="flex flex-wrap gap-2">
                    <For each={entry()!.tags}>
                      {(tag) => (
                        <span class="badge badge-primary">{tag}</span>
                      )}
                    </For>
                  </div>
                </section>
              </article>
            </div>

            {/* 사이드바 */}
            <aside class="space-y-6">
              {/* 관련 어휘 */}
              <Show when={relatedEntries().length > 0}>
                <div class="card p-5">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
                    관련 어휘
                  </h3>
                  <div class="space-y-3">
                    <For each={relatedEntries()}>
                      {(related) => (
                        <A
                          href={`/entry/${related.id}`}
                          class="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                        >
                          <p class="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {related.term}
                          </p>
                          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                            {related.definition}
                          </p>
                        </A>
                      )}
                    </For>
                  </div>
                </div>
              </Show>

              {/* 카테고리 정보 */}
              <Show when={category()}>
                <div class="card p-5">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
                    카테고리
                  </h3>
                  <A
                    href={`/category/${category()!.id}`}
                    class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <span
                      class={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${getCategoryColor(category()!.color)}`}
                    >
                      {category()!.icon}
                    </span>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {category()!.name}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {category()!.nameEn}
                      </p>
                    </div>
                  </A>
                </div>
              </Show>

              {/* 기여하기 */}
              <div class="card p-5 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-primary-100 dark:border-primary-800">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                  수정 제안하기
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  오류를 발견하셨거나 개선할 내용이 있나요?
                </p>
                <A
                  href="/contribute"
                  class="btn-primary w-full justify-center text-sm"
                >
                  기여하기
                </A>
              </div>
            </aside>
          </div>
        </div>
      </Show>
    </Layout>
  );
}
