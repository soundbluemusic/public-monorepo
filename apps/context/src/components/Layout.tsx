import { createSignal, createEffect, onMount, type ParentComponent } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { Sidebar } from "./Sidebar";
import { SearchModal } from "./SearchModal";

export const Layout: ParentComponent = (props) => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [searchOpen, setSearchOpen] = createSignal(false);
  const [darkMode, setDarkMode] = createSignal(false);
  const location = useLocation();

  // 사이드바 닫기 (라우트 변경 시)
  createEffect(() => {
    location.pathname;
    setSidebarOpen(false);
  });

  // 다크모드 초기화
  onMount(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  });

  const toggleDarkMode = () => {
    const newValue = !darkMode();
    setDarkMode(newValue);
    localStorage.setItem("darkMode", String(newValue));
    document.documentElement.classList.toggle("dark", newValue);
  };

  // 키보드 단축키
  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header class="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40">
        <div class="h-full px-4 flex items-center justify-between">
          {/* 왼쪽: 메뉴 버튼 + 로고 */}
          <div class="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen())}
              class="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="메뉴 열기"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <A href="/" class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                한
              </div>
              <div class="hidden sm:block">
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">한국어 어휘 DB</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">Korean Vocabulary Database</p>
              </div>
            </A>
          </div>

          {/* 중앙: 검색창 */}
          <div class="flex-1 max-w-xl mx-4 hidden md:block">
            <button
              onClick={() => setSearchOpen(true)}
              class="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>검색어를 입력하세요...</span>
              <kbd class="ml-auto px-2 py-0.5 bg-white dark:bg-gray-600 rounded text-xs font-mono">⌘K</kbd>
            </button>
          </div>

          {/* 오른쪽: 액션 버튼들 */}
          <div class="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              class="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="검색"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={toggleDarkMode}
              class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="다크모드 전환"
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

      {/* 사이드바 오버레이 (모바일) */}
      <div
        class={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${sidebarOpen() ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* 사이드바 */}
      <Sidebar isOpen={sidebarOpen()} onClose={() => setSidebarOpen(false)} />

      {/* 메인 콘텐츠 */}
      <main class="pt-16 lg:pl-72">
        <div class="min-h-[calc(100vh-4rem)]">
          {props.children}
        </div>

        {/* 푸터 */}
        <footer class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-8">
          <div class="container-custom">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="text-center md:text-left">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  한국어 어휘 데이터베이스
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  한글의 모든 어휘를 체계적으로 정리한 종합 자료
                </p>
              </div>
              <div class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <A href="/about" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  소개
                </A>
                <A href="/contribute" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  기여하기
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

      {/* 검색 모달 */}
      <SearchModal isOpen={searchOpen()} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
