import { createSignal, createEffect, onMount, For, Show, type ParentComponent } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { Sidebar } from "./Sidebar";
import { SearchModal } from "./SearchModal";
import { useI18n, languageFlags } from "@/i18n";
import type { Language } from "@/data/types";

// Language options for selector
const languages: { code: Language; label: string; flag: string }[] = [
  { code: "ko", label: "한국어", flag: "KR" },
  { code: "en", label: "English", flag: "EN" },
  { code: "ja", label: "日本語", flag: "JP" },
];

export const Layout: ParentComponent = (props) => {
  const { locale, setLocale, t } = useI18n();
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [searchOpen, setSearchOpen] = createSignal(false);
  const [langMenuOpen, setLangMenuOpen] = createSignal(false);
  const [darkMode, setDarkMode] = createSignal(false);
  const location = useLocation();

  // Close sidebar on route change
  createEffect(() => {
    location.pathname;
    setSidebarOpen(false);
    setLangMenuOpen(false);
  });

  // Dark mode initialization with system preference
  onMount(() => {
    const stored = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "true" : prefersDark;

    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }

    // Listen for system preference changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("darkMode")) {
        setDarkMode(e.matches);
        document.documentElement.classList.toggle("dark", e.matches);
      }
    });
  });

  const toggleDarkMode = () => {
    document.documentElement.classList.add("dark-transition");
    const newValue = !darkMode();
    setDarkMode(newValue);
    localStorage.setItem("darkMode", String(newValue));
    document.documentElement.classList.toggle("dark", newValue);
    setTimeout(() => {
      document.documentElement.classList.remove("dark-transition");
    }, 300);
  };

  const isActive = (href: string) => location.pathname === href;

  // Keyboard shortcuts
  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSidebarOpen(false);
        setLangMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  // Close language menu when clicking outside
  onMount(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-lang-menu]")) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });

  const currentLang = () => languages.find((l) => l.code === locale()) || languages[0];

  // Bottom navigation items with i18n
  const bottomNavItems = () => [
    { href: "/", label: t("home"), icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/browse", label: t("browse"), icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { href: "/about", label: t("about"), icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Skip to content - Accessibility */}
      <a href="#main-content" class="skip-to-content">
        {locale() === "ko" ? "본문으로 건너뛰기" : locale() === "ja" ? "本文へスキップ" : "Skip to content"}
      </a>

      {/* Header */}
      <header class="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40">
        <div class="h-full px-4 flex items-center justify-between">
          {/* Left: Menu button + Logo */}
          <div class="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen())}
              class="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={locale() === "ko" ? "메뉴 열기" : locale() === "ja" ? "メニューを開く" : "Open menu"}
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <A href="/" class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                C
              </div>
              <div class="hidden sm:block">
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">Context</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {locale() === "ko" ? "한국어 의미 사전" : locale() === "ja" ? "韓国語意味辞典" : "Korean Meaning Dictionary"}
                </p>
              </div>
            </A>
          </div>

          {/* Center: Search bar */}
          <div class="flex-1 max-w-xl mx-4 hidden md:block">
            <button
              onClick={() => setSearchOpen(true)}
              class="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>{t("searchPlaceholder")}</span>
              <kbd class="ml-auto px-2 py-0.5 bg-white dark:bg-gray-600 rounded text-xs font-mono">⌘K</kbd>
            </button>
          </div>

          {/* Right: Action buttons */}
          <div class="flex items-center gap-2">
            {/* Mobile search */}
            <button
              onClick={() => setSearchOpen(true)}
              class="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={t("search")}
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Language Selector */}
            <div class="relative" data-lang-menu>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLangMenuOpen(!langMenuOpen());
                }}
                class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Select language"
              >
                <span class="text-xs font-bold">{currentLang().flag}</span>
                <svg class={`w-4 h-4 transition-transform ${langMenuOpen() ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <Show when={langMenuOpen()}>
                <div class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <For each={languages}>
                    {(lang) => (
                      <button
                        onClick={() => {
                          setLocale(lang.code);
                          setLangMenuOpen(false);
                        }}
                        class={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          locale() === lang.code ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span class="text-xs font-bold w-6">{lang.flag}</span>
                        <span>{lang.label}</span>
                        <Show when={locale() === lang.code}>
                          <svg class="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                        </Show>
                      </button>
                    )}
                  </For>
                </div>
              </Show>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={locale() === "ko" ? "다크모드 전환" : locale() === "ja" ? "ダークモード切替" : "Toggle dark mode"}
            >
              {darkMode() ? (
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar overlay (mobile) */}
      <div
        class={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${sidebarOpen() ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen()} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main id="main-content" class="pt-16 pb-20 lg:pb-0 lg:pl-72">
        <div class="min-h-[calc(100vh-4rem)]">
          {props.children}
        </div>

        {/* Footer */}
        <footer class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-8">
          <div class="container-custom">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="text-center md:text-left">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Context - {locale() === "ko" ? "한국어 의미 사전" : locale() === "ja" ? "韓国語意味辞典" : "Korean Meaning Dictionary"}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {locale() === "ko"
                    ? "한국어 학습자를 위한 다국어 의미 사전"
                    : locale() === "ja"
                    ? "韓国語学習者のための多言語意味辞典"
                    : "Multilingual meaning dictionary for Korean learners"}
                </p>
              </div>
              <div class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <A href="/about" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("about")}
                </A>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Search modal */}
      <SearchModal isOpen={searchOpen()} onClose={() => setSearchOpen(false)} />

      {/* Bottom navigation (mobile) */}
      <nav class="bottom-nav lg:hidden" aria-label={locale() === "ko" ? "모바일 네비게이션" : locale() === "ja" ? "モバイルナビゲーション" : "Mobile navigation"}>
        <div class="flex items-center justify-around h-full">
          <For each={bottomNavItems()}>
            {(item) => (
              <A
                href={item.href}
                class={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                  isActive(item.href)
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
                </svg>
                <span class="text-xs font-medium">{item.label}</span>
              </A>
            )}
          </For>
        </div>
      </nav>
    </div>
  );
};
