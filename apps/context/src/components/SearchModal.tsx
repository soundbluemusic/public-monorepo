import { createSignal, For, Show, createEffect, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { categories, getCategoryColor } from "@/data/categories";
import { vocabEntries } from "@/data/entries";
import type { VocabEntry, Category, Subcategory } from "@/data/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  type: "category" | "subcategory" | "entry";
  category?: Category;
  subcategory?: Subcategory;
  entry?: VocabEntry;
}

export function SearchModal(props: SearchModalProps) {
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const navigate = useNavigate();
  let inputRef: HTMLInputElement | undefined;

  // 모달 열릴 때 포커스
  createEffect(() => {
    if (props.isOpen && inputRef) {
      setTimeout(() => inputRef?.focus(), 100);
    }
  });

  // 검색 실행
  createEffect(() => {
    const q = query().toLowerCase().trim();
    if (!q) {
      setResults([]);
      return;
    }

    const items: SearchResultItem[] = [];

    // 카테고리 검색
    for (const category of categories) {
      if (
        category.name.toLowerCase().includes(q) ||
        category.nameEn.toLowerCase().includes(q) ||
        category.description.toLowerCase().includes(q)
      ) {
        items.push({ type: "category", category });
      }

      // 하위 카테고리 검색
      for (const sub of category.subcategories) {
        if (
          sub.name.toLowerCase().includes(q) ||
          sub.nameEn.toLowerCase().includes(q) ||
          sub.description.toLowerCase().includes(q)
        ) {
          items.push({ type: "subcategory", category, subcategory: sub });
        }
      }
    }

    // 어휘 항목 검색
    for (const entry of vocabEntries) {
      if (
        entry.term.toLowerCase().includes(q) ||
        entry.definition.toLowerCase().includes(q) ||
        entry.examples.some((ex) => ex.toLowerCase().includes(q)) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(q))
      ) {
        const category = categories.find((c) => c.id === entry.categoryId);
        if (category) {
          items.push({ type: "entry", entry, category });
        }
      }
    }

    setResults(items.slice(0, 20));
    setSelectedIndex(0);
  });

  // 키보드 네비게이션
  const handleKeyDown = (e: KeyboardEvent) => {
    const len = results().length;
    if (!len) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % len);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + len) % len);
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectResult(results()[selectedIndex()]);
    }
  };

  // 결과 선택
  const selectResult = (item: SearchResultItem) => {
    props.onClose();
    setQuery("");

    if (item.type === "category" && item.category) {
      navigate(`/category/${item.category.id}`);
    } else if (item.type === "subcategory" && item.category && item.subcategory) {
      navigate(`/category/${item.category.id}/${item.subcategory.id}`);
    } else if (item.type === "entry" && item.entry && item.category) {
      navigate(`/entry/${item.entry.id}`);
    }
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 overflow-y-auto">
        {/* 배경 오버레이 */}
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={props.onClose}
        />

        {/* 모달 */}
        <div class="relative min-h-screen flex items-start justify-center p-4 pt-[15vh]">
          <div class="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-down">
            {/* 검색 입력 */}
            <div class="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-700">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query()}
                onInput={(e) => setQuery(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                placeholder="검색어를 입력하세요..."
                class="flex-1 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-lg"
              />
              <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500 dark:text-gray-400">
                ESC
              </kbd>
            </div>

            {/* 검색 결과 */}
            <div class="max-h-[60vh] overflow-y-auto">
              <Show
                when={results().length > 0}
                fallback={
                  <Show when={query().length > 0}>
                    <div class="p-8 text-center text-gray-500 dark:text-gray-400">
                      <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>검색 결과가 없습니다</p>
                      <p class="text-sm mt-1">다른 검색어를 시도해보세요</p>
                    </div>
                  </Show>
                }
              >
                <ul class="py-2">
                  <For each={results()}>
                    {(item, index) => (
                      <li>
                        <button
                          onClick={() => selectResult(item)}
                          onMouseEnter={() => setSelectedIndex(index())}
                          class={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            selectedIndex() === index()
                              ? "bg-primary-50 dark:bg-primary-900/20"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          }`}
                        >
                          {/* 아이콘 */}
                          <Show when={item.type === "category" && item.category}>
                            <span
                              class={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${getCategoryColor(item.category!.color)}`}
                            >
                              {item.category!.icon}
                            </span>
                          </Show>
                          <Show when={item.type === "subcategory" && item.category}>
                            <span
                              class={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${getCategoryColor(item.category!.color)}`}
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </span>
                          </Show>
                          <Show when={item.type === "entry"}>
                            <span class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </span>
                          </Show>

                          {/* 내용 */}
                          <div class="flex-1 min-w-0">
                            <Show when={item.type === "category" && item.category}>
                              <p class="font-medium text-gray-900 dark:text-white truncate">
                                {item.category!.name}
                              </p>
                              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {item.category!.description}
                              </p>
                            </Show>
                            <Show when={item.type === "subcategory" && item.subcategory}>
                              <p class="font-medium text-gray-900 dark:text-white truncate">
                                {item.subcategory!.name}
                              </p>
                              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {item.category!.name} &gt; {item.subcategory!.name}
                              </p>
                            </Show>
                            <Show when={item.type === "entry" && item.entry}>
                              <p class="font-medium text-gray-900 dark:text-white truncate">
                                {item.entry!.term}
                              </p>
                              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {item.entry!.definition}
                              </p>
                            </Show>
                          </div>

                          {/* 타입 배지 */}
                          <span class="badge badge-gray text-xs">
                            {item.type === "category"
                              ? "카테고리"
                              : item.type === "subcategory"
                              ? "하위 카테고리"
                              : "어휘"}
                          </span>
                        </button>
                      </li>
                    )}
                  </For>
                </ul>
              </Show>
            </div>

            {/* 하단 힌트 */}
            <Show when={results().length > 0}>
              <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">↑</kbd>
                    <kbd class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">↓</kbd>
                    이동
                  </span>
                  <span class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">Enter</kbd>
                    선택
                  </span>
                  <span class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">ESC</kbd>
                    닫기
                  </span>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}
