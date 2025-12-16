import { createSignal, For, Show, createEffect, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { categories, getCategoryColor } from "@/data/categories";
import { searchEntries, meaningEntries } from "@/data/entries";
import { useI18n } from "@/i18n";
import type { MeaningEntry, Category, TargetLanguage } from "@/data/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  type: "category" | "entry";
  category?: Category;
  entry?: MeaningEntry;
}

// Debounce function
function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Recent searches management
const RECENT_SEARCHES_KEY = "context-recentSearches";
const MAX_RECENT_SEARCHES = 5;

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(term: string): void {
  if (!term.trim()) return;
  const searches = getRecentSearches().filter((s) => s !== term);
  searches.unshift(term);
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES))
  );
}

function clearRecentSearches(): void {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export function SearchModal(props: SearchModalProps) {
  const { locale, t } = useI18n();
  const [query, setQuery] = createSignal("");
  const [debouncedQuery, setDebouncedQuery] = createSignal("");
  const [results, setResults] = createSignal<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [recentSearches, setRecentSearches] = createSignal<string[]>([]);
  const [isSearching, setIsSearching] = createSignal(false);
  const navigate = useNavigate();
  let inputRef: HTMLInputElement | undefined;

  // Get target language for search
  const getTargetLang = (): TargetLanguage => {
    return locale() === "ko" ? "en" : (locale() as TargetLanguage);
  };

  // Debounced query update
  const updateDebouncedQuery = debounce((q: string) => {
    setDebouncedQuery(q);
    setIsSearching(false);
  }, 200);

  // Input handler
  const handleInput = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setIsSearching(true);
    }
    updateDebouncedQuery(value);
  };

  // Focus on open & load recent searches
  createEffect(() => {
    if (props.isOpen) {
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef?.focus(), 100);
    }
  });

  // Search execution
  createEffect(() => {
    const q = debouncedQuery().toLowerCase().trim();
    if (!q) {
      setResults([]);
      return;
    }

    const items: SearchResultItem[] = [];

    // Search categories
    for (const category of categories) {
      if (
        category.name.ko.toLowerCase().includes(q) ||
        category.name.en.toLowerCase().includes(q) ||
        category.name.ja.toLowerCase().includes(q) ||
        category.description[locale()].toLowerCase().includes(q)
      ) {
        items.push({ type: "category", category });
      }
    }

    // Search entries
    const targetLang = getTargetLang();
    for (const entry of meaningEntries) {
      const translation = entry.translations[targetLang];
      if (
        entry.korean.includes(q) ||
        entry.romanization.toLowerCase().includes(q) ||
        translation.word.toLowerCase().includes(q) ||
        translation.explanation.toLowerCase().includes(q) ||
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

  // Keyboard navigation
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

  // Result selection
  const selectResult = (item: SearchResultItem) => {
    addRecentSearch(query());
    props.onClose();
    setQuery("");
    setDebouncedQuery("");

    if (item.type === "category" && item.category) {
      navigate(`/category/${item.category.id}`);
    } else if (item.type === "entry" && item.entry) {
      navigate(`/entry/${item.entry.id}`);
    }
  };

  // Recent search click
  const handleRecentClick = (term: string) => {
    setQuery(term);
    setDebouncedQuery(term);
  };

  // Clear recent searches
  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Get localized labels
  const getPlaceholder = () => {
    if (locale() === "ko") return "한국어 단어 검색...";
    if (locale() === "ja") return "韓国語の単語を検索...";
    return "Search Korean words...";
  };

  const getNoResultsText = () => {
    if (locale() === "ko") return "검색 결과가 없습니다";
    if (locale() === "ja") return "検索結果がありません";
    return "No results found";
  };

  const getRecentSearchesLabel = () => {
    if (locale() === "ko") return "최근 검색어";
    if (locale() === "ja") return "最近の検索";
    return "Recent searches";
  };

  const getClearAllLabel = () => {
    if (locale() === "ko") return "모두 삭제";
    if (locale() === "ja") return "すべて削除";
    return "Clear all";
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 overflow-y-auto">
        {/* Background overlay */}
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={props.onClose}
        />

        {/* Modal */}
        <div class="relative min-h-screen flex items-start justify-center p-4 pt-[15vh]">
          <div class="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-down">
            {/* Search input */}
            <div class="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-700">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query()}
                onInput={(e) => handleInput(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                placeholder={getPlaceholder()}
                class="flex-1 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-lg"
                aria-label={t("search")}
                role="combobox"
                aria-expanded={results().length > 0}
              />
              <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500 dark:text-gray-400">
                ESC
              </kbd>
            </div>

            {/* Search results */}
            <div class="max-h-[60vh] overflow-y-auto">
              {/* Loading indicator */}
              <Show when={isSearching()}>
                <div class="p-4 text-center text-gray-500 dark:text-gray-400">
                  <div class="inline-block w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
                </div>
              </Show>

              {/* Recent searches */}
              <Show when={!query() && recentSearches().length > 0 && !isSearching()}>
                <div class="p-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{getRecentSearchesLabel()}</span>
                    <button
                      onClick={handleClearRecent}
                      class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {getClearAllLabel()}
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <For each={recentSearches()}>
                      {(term) => (
                        <button
                          onClick={() => handleRecentClick(term)}
                          class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
                        >
                          {term}
                        </button>
                      )}
                    </For>
                  </div>
                </div>
              </Show>

              <Show
                when={results().length > 0}
                fallback={
                  <Show when={query().length > 0 && !isSearching()}>
                    <div class="p-8 text-center text-gray-500 dark:text-gray-400">
                      <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>{getNoResultsText()}</p>
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
                          {/* Icon */}
                          <Show when={item.type === "category" && item.category}>
                            <span
                              class={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${getCategoryColor(item.category!.color)}`}
                            >
                              {item.category!.icon}
                            </span>
                          </Show>
                          <Show when={item.type === "entry" && item.category}>
                            <span
                              class={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${getCategoryColor(item.category!.color)}`}
                            >
                              {item.category!.icon}
                            </span>
                          </Show>

                          {/* Content */}
                          <div class="flex-1 min-w-0">
                            <Show when={item.type === "category" && item.category}>
                              <p class="font-medium text-gray-900 dark:text-white truncate">
                                {item.category!.name[locale()]}
                              </p>
                              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {item.category!.description[locale()]}
                              </p>
                            </Show>
                            <Show when={item.type === "entry" && item.entry}>
                              <div class="flex items-center gap-2">
                                <p class="font-bold text-gray-900 dark:text-white">
                                  {item.entry!.korean}
                                </p>
                                <span class="text-xs text-gray-400">
                                  {item.entry!.romanization}
                                </span>
                              </div>
                              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {item.entry!.translations[getTargetLang()].word}
                              </p>
                            </Show>
                          </div>

                          {/* Type badge */}
                          <span class="badge badge-gray text-xs">
                            {item.type === "category"
                              ? (locale() === "ko" ? "카테고리" : locale() === "ja" ? "カテゴリー" : "Category")
                              : (locale() === "ko" ? "단어" : locale() === "ja" ? "単語" : "Word")}
                          </span>
                        </button>
                      </li>
                    )}
                  </For>
                </ul>
              </Show>
            </div>

            {/* Bottom hints */}
            <Show when={results().length > 0}>
              <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">↑</kbd>
                    <kbd class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">↓</kbd>
                    {locale() === "ko" ? "이동" : locale() === "ja" ? "移動" : "Navigate"}
                  </span>
                  <span class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">Enter</kbd>
                    {locale() === "ko" ? "선택" : locale() === "ja" ? "選択" : "Select"}
                  </span>
                  <span class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">ESC</kbd>
                    {locale() === "ko" ? "닫기" : locale() === "ja" ? "閉じる" : "Close"}
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
