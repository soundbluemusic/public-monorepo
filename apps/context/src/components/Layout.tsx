import { createSignal, createEffect, onMount, For, Show, type ParentComponent } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { SearchModal } from "./SearchModal";
import { useI18n } from "@/i18n";
import type { Language } from "@/data/types";

const languages: { code: Language; label: string }[] = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "EN" },
  { code: "ja", label: "日本語" },
];

export const Layout: ParentComponent = (props) => {
  const { locale, setLocale, t } = useI18n();
  const [searchOpen, setSearchOpen] = createSignal(false);
  const [darkMode, setDarkMode] = createSignal(false);
  const location = useLocation();

  onMount(() => {
    const stored = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "true" : prefersDark;
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
  });

  const toggleDarkMode = () => {
    const newValue = !darkMode();
    setDarkMode(newValue);
    localStorage.setItem("darkMode", String(newValue));
    document.documentElement.classList.toggle("dark", newValue);
  };

  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <div class="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div class="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <A href="/" class="font-semibold text-gray-900 dark:text-white">
            Context
          </A>

          {/* Nav */}
          <nav class="flex items-center gap-6">
            <A
              href="/browse"
              class={`text-sm ${isActive("/browse") ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
            >
              {t("browse")}
            </A>
            <A
              href="/about"
              class={`text-sm ${isActive("/about") ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
            >
              {t("about")}
            </A>
          </nav>

          {/* Actions */}
          <div class="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              aria-label={t("search")}
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Language */}
            <select
              value={locale()}
              onChange={(e) => setLocale(e.currentTarget.value as Language)}
              class="text-sm bg-transparent text-gray-500 dark:text-gray-400 border-none focus:ring-0 cursor-pointer"
            >
              <For each={languages}>
                {(lang) => <option value={lang.code}>{lang.label}</option>}
              </For>
            </select>

            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              aria-label="Toggle dark mode"
            >
              {darkMode() ? (
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main class="max-w-3xl mx-auto px-4 py-8">
        {props.children}
      </main>

      {/* Search */}
      <SearchModal isOpen={searchOpen()} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
