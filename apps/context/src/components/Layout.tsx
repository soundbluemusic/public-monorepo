import { createSignal, createEffect, onMount, onCleanup, For, Show, type ParentComponent } from "solid-js";
import { A, useLocation, useNavigate } from "@solidjs/router";
import { useI18n } from "@/i18n";
import { meaningEntries } from "@/data/entries";
import type { Language, MeaningEntry } from "@/data/types";

const languages: { code: Language; label: string }[] = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "EN" },
  { code: "ja", label: "日本語" },
];

// Strip locale prefix from path for comparison
function stripLocale(pathname: string): string {
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  if (pathname.startsWith("/ja/")) return pathname.slice(3);
  if (pathname === "/en" || pathname === "/ja") return "/";
  return pathname;
}

export const Layout: ParentComponent = (props) => {
  const { locale, setLocale, t, localePath } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  // Dark mode
  const [darkMode, setDarkMode] = createSignal(false);

  // Search
  const [searchQuery, setSearchQuery] = createSignal("");
  const [searchResults, setSearchResults] = createSignal<MeaningEntry[]>([]);
  const [showResults, setShowResults] = createSignal(false);
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  let searchInputRef: HTMLInputElement | undefined;
  let searchContainerRef: HTMLDivElement | undefined;

  // Initialize dark mode from localStorage or system preference
  onMount(() => {
    const stored = localStorage.getItem("context-dark-mode");
    if (stored !== null) {
      const isDark = stored === "true";
      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  });

  const toggleDarkMode = () => {
    const newValue = !darkMode();
    setDarkMode(newValue);
    localStorage.setItem("context-dark-mode", String(newValue));
    document.documentElement.classList.toggle("dark", newValue);
  };

  // Search functionality
  createEffect(() => {
    const q = searchQuery().toLowerCase().trim();
    if (!q) {
      setSearchResults([]);
      return;
    }

    const currentLocale = locale();
    const matched = meaningEntries.filter((entry) => {
      const translation = entry.translations[currentLocale];
      return (
        entry.korean.includes(q) ||
        entry.romanization.toLowerCase().includes(q) ||
        translation.word.toLowerCase().includes(q)
      );
    });

    setSearchResults(matched.slice(0, 8));
    setSelectedIndex(0);
  });

  const handleSearchKeyDown = (e: KeyboardEvent) => {
    const len = searchResults().length;

    if (e.key === "Escape") {
      setShowResults(false);
      searchInputRef?.blur();
      return;
    }

    if (e.key === "ArrowDown" && len > 0) {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % len);
    } else if (e.key === "ArrowUp" && len > 0) {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + len) % len);
    } else if (e.key === "Enter" && len > 0) {
      e.preventDefault();
      selectResult(searchResults()[selectedIndex()]);
    }
  };

  const selectResult = (entry: MeaningEntry) => {
    setSearchQuery("");
    setShowResults(false);
    navigate(localePath(`/entry/${entry.id}`));
  };

  // Close search results when clicking outside
  onMount(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef && !searchContainerRef.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    onCleanup(() => document.removeEventListener("click", handleClickOutside));
  });

  // Keyboard shortcut for search
  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef?.focus();
        setShowResults(true);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    onCleanup(() => window.removeEventListener("keydown", handleKeydown));
  });

  // Check if a path is active (strip locale for comparison)
  const isActive = (basePath: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === basePath;
  };

  const getPlaceholder = () => {
    if (locale() === "ko") return "검색...";
    if (locale() === "ja") return "検索...";
    return "Search...";
  };

  return (
    <div class="min-h-screen" style={{ "background-color": "var(--bg-primary)" }}>
      {/* Header */}
      <header
        class="sticky top-0 z-40 backdrop-blur-sm"
        style={{
          "background-color": "color-mix(in srgb, var(--bg-primary) 80%, transparent)",
          "border-bottom": "1px solid var(--border-primary)"
        }}
      >
        <div class="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <A
            href={localePath("/")}
            class="font-semibold shrink-0"
            style={{ color: "var(--text-primary)" }}
          >
            Context
          </A>

          {/* Search Form */}
          <div ref={searchContainerRef} class="relative flex-1 max-w-md">
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--text-tertiary)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery()}
                onInput={(e) => {
                  setSearchQuery(e.currentTarget.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder={getPlaceholder()}
                class="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg focus:outline-none"
                style={{
                  "background-color": "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-primary)"
                }}
              />
            </div>

            {/* Search Results Dropdown */}
            <Show when={showResults() && searchQuery().length > 0}>
              <div
                class="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden z-50"
                style={{
                  "background-color": "var(--bg-elevated)",
                  border: "1px solid var(--border-primary)"
                }}
              >
                <Show
                  when={searchResults().length > 0}
                  fallback={
                    <div class="px-4 py-3 text-sm" style={{ color: "var(--text-tertiary)" }}>
                      {locale() === "ko" ? "결과 없음" : locale() === "ja" ? "結果なし" : "No results"}
                    </div>
                  }
                >
                  <For each={searchResults()}>
                    {(entry, index) => (
                      <button
                        onClick={() => selectResult(entry)}
                        onMouseEnter={() => setSelectedIndex(index())}
                        class="w-full flex items-baseline justify-between px-4 py-2 text-left text-sm"
                        style={{
                          "background-color": selectedIndex() === index() ? "var(--bg-tertiary)" : "transparent"
                        }}
                      >
                        <div class="flex items-baseline gap-2">
                          <span style={{ color: "var(--text-primary)" }} class="font-medium">
                            {entry.korean}
                          </span>
                          <span style={{ color: "var(--text-tertiary)" }} class="text-xs">
                            {entry.romanization}
                          </span>
                        </div>
                        <span style={{ color: "var(--text-secondary)" }}>
                          {entry.translations[locale()].word}
                        </span>
                      </button>
                    )}
                  </For>
                </Show>
              </div>
            </Show>
          </div>

          {/* Right Actions */}
          <div class="flex items-center gap-1 shrink-0">
            {/* Nav Links */}
            <A
              href={localePath("/browse")}
              class="px-3 py-1.5 text-sm rounded-lg transition-colors"
              style={{
                color: isActive("/browse") ? "var(--accent-primary)" : "var(--text-secondary)",
                "background-color": isActive("/browse") ? "var(--bg-tertiary)" : "transparent"
              }}
            >
              {t("browse")}
            </A>

            {/* Language */}
            <select
              value={locale()}
              onChange={(e) => setLocale(e.currentTarget.value as Language)}
              class="text-sm bg-transparent border-none cursor-pointer focus:outline-none px-2 py-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              <For each={languages}>
                {(lang) => <option value={lang.code}>{lang.label}</option>}
              </For>
            </select>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              class="p-2 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Toggle dark mode"
            >
              <Show
                when={darkMode()}
                fallback={
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                }
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </Show>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main class="max-w-3xl mx-auto px-4 py-8">
        {props.children}
      </main>
    </div>
  );
};
