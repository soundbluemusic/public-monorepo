import { createSignal, For, Show, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { meaningEntries } from "@/data/entries";
import { useI18n } from "@/i18n";
import type { MeaningEntry, TargetLanguage } from "@/data/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal(props: SearchModalProps) {
  const { locale, t } = useI18n();
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<MeaningEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const navigate = useNavigate();
  let inputRef: HTMLInputElement | undefined;

  const getTargetLang = (): TargetLanguage => {
    return locale() === "ko" ? "en" : (locale() as TargetLanguage);
  };

  // Focus on open
  createEffect(() => {
    if (props.isOpen) {
      setTimeout(() => inputRef?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  });

  // Search
  createEffect(() => {
    const q = query().toLowerCase().trim();
    if (!q) {
      setResults([]);
      return;
    }

    const targetLang = getTargetLang();
    const matched = meaningEntries.filter((entry) => {
      const translation = entry.translations[targetLang];
      return (
        entry.korean.includes(q) ||
        entry.romanization.toLowerCase().includes(q) ||
        translation.word.toLowerCase().includes(q)
      );
    });

    setResults(matched.slice(0, 10));
    setSelectedIndex(0);
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    const len = results().length;
    if (e.key === "Escape") {
      props.onClose();
      return;
    }
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

  const selectResult = (entry: MeaningEntry) => {
    props.onClose();
    setQuery("");
    navigate(`/entry/${entry.id}`);
  };

  const getPlaceholder = () => {
    if (locale() === "ko") return "검색...";
    if (locale() === "ja") return "検索...";
    return "Search...";
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50">
        <div class="fixed inset-0 bg-black/50" onClick={props.onClose} />

        <div class="relative flex justify-center pt-[20vh] px-4">
          <div class="w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            {/* Input */}
            <div class="flex items-center gap-3 px-4 border-b border-gray-100 dark:border-gray-800">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query()}
                onInput={(e) => setQuery(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                placeholder={getPlaceholder()}
                class="flex-1 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* Results */}
            <Show when={results().length > 0}>
              <div class="max-h-80 overflow-y-auto py-2">
                <For each={results()}>
                  {(entry, index) => (
                    <button
                      onClick={() => selectResult(entry)}
                      onMouseEnter={() => setSelectedIndex(index())}
                      class={`w-full flex items-baseline justify-between px-4 py-2 text-left ${
                        selectedIndex() === index()
                          ? "bg-gray-100 dark:bg-gray-800"
                          : ""
                      }`}
                    >
                      <div class="flex items-baseline gap-2">
                        <span class="font-medium text-gray-900 dark:text-white">
                          {entry.korean}
                        </span>
                        <span class="text-sm text-gray-400">
                          {entry.romanization}
                        </span>
                      </div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        {entry.translations[getTargetLang()].word}
                      </span>
                    </button>
                  )}
                </For>
              </div>
            </Show>

            {/* No results */}
            <Show when={query().length > 0 && results().length === 0}>
              <div class="px-4 py-6 text-center text-gray-400">
                {locale() === "ko" ? "결과 없음" : locale() === "ja" ? "結果なし" : "No results"}
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}
