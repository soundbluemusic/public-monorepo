/**
 * @fileoverview 메인 레이아웃 컴포넌트
 */
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { useI18n } from '@/i18n';
import { type SearchResult, preloadSearchIndex, searchConcepts } from '@/lib/search';
import { A, useLocation, useNavigate } from '@solidjs/router';
import { LanguageToggle } from '@soundblue/shared';
import {
  For,
  type ParentComponent,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

function stripLocale(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3);
  if (pathname === '/ko') return '/';
  return pathname;
}

export const Layout: ParentComponent = (props) => {
  const { locale, setLocale, t, localePath } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  // Dark mode
  const [darkMode, setDarkMode] = createSignal(false);

  // Search
  const [searchQuery, setSearchQuery] = createSignal('');
  const [searchResults, setSearchResults] = createSignal<SearchResult[]>([]);
  const [showResults, setShowResults] = createSignal(false);
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [isSearching, setIsSearching] = createSignal(false);
  let searchInputRef: HTMLInputElement | undefined;
  let searchContainerRef: HTMLDivElement | undefined;

  // Initialize dark mode
  onMount(() => {
    const stored = localStorage.getItem('roots-dark-mode');
    if (stored !== null) {
      const isDark = stored === 'true';
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  });

  const toggleDarkMode = () => {
    const newValue = !darkMode();
    setDarkMode(newValue);
    localStorage.setItem('roots-dark-mode', String(newValue));
    document.documentElement.classList.toggle('dark', newValue);
  };

  // Search functionality with Fuse.js (비동기)
  createEffect(() => {
    const q = searchQuery().trim();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchConcepts(q, locale(), 8).then((results) => {
      setSearchResults(results);
      setSelectedIndex(0);
      setIsSearching(false);
    });
  });

  // 검색창 focus 시 인덱스 프리로드
  const handleSearchFocus = () => {
    preloadSearchIndex();
    setShowResults(true);
  };

  const handleSearchKeyDown = (e: KeyboardEvent) => {
    const len = searchResults().length;

    if (e.key === 'Escape') {
      setShowResults(false);
      searchInputRef?.blur();
      return;
    }

    if (e.key === 'ArrowDown' && len > 0) {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % len);
    } else if (e.key === 'ArrowUp' && len > 0) {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + len) % len);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (len > 0) {
        selectResult(searchResults()[selectedIndex()]);
      } else if (searchQuery().trim().length >= 2) {
        goToSearchPage();
      }
    }
  };

  const selectResult = (result: SearchResult) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(localePath(`/concept/${result.item.id}`));
  };

  const goToSearchPage = () => {
    const q = searchQuery().trim();
    setShowResults(false);
    navigate(localePath(`/search?q=${encodeURIComponent(q)}`));
  };

  // Close search results when clicking outside
  onMount(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target;
      if (searchContainerRef && target instanceof Node && !searchContainerRef.contains(target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    onCleanup(() => document.removeEventListener('click', handleClickOutside));
  });

  // Keyboard shortcut for search
  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef?.focus();
        preloadSearchIndex();
        setShowResults(true);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    onCleanup(() => window.removeEventListener('keydown', handleKeydown));
  });

  const isActive = (basePath: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === basePath || currentPath.startsWith(`${basePath}/`);
  };

  return (
    <div class="min-h-screen flex flex-col" style={{ 'background-color': 'var(--bg-primary)' }}>
      {/* Header */}
      <header
        class="sticky top-0 z-40 backdrop-blur-sm"
        style={{
          'background-color': 'color-mix(in srgb, var(--bg-primary) 80%, transparent)',
          'border-bottom': '1px solid var(--border-primary)',
        }}
      >
        <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <A
            href={localePath('/')}
            class="font-semibold shrink-0 flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <span class="text-xl">π</span>
            <span>Roots</span>
          </A>

          {/* Search Form */}
          <div ref={searchContainerRef} class="relative flex-1 max-w-md">
            <div class="relative">
              <svg
                aria-hidden="true"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--text-tertiary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery()}
                onInput={(e) => {
                  setSearchQuery(e.currentTarget.value);
                  setShowResults(true);
                }}
                onFocus={handleSearchFocus}
                onKeyDown={handleSearchKeyDown}
                placeholder={t('searchPlaceholder')}
                class="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg focus:outline-none"
                style={{
                  'background-color': 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                }}
              />
            </div>

            {/* Search Results Dropdown */}
            <Show when={showResults() && searchQuery().length > 0}>
              <div
                class="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden z-50"
                style={{
                  'background-color': 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <Show
                  when={!isSearching() && searchResults().length > 0}
                  fallback={
                    <div class="px-4 py-3 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      {isSearching() ? '...' : t('noResults')}
                    </div>
                  }
                >
                  <For each={searchResults()}>
                    {(result, index) => (
                      <button
                        type="button"
                        onClick={() => selectResult(result)}
                        onMouseEnter={() => setSelectedIndex(index())}
                        class="w-full flex items-center justify-between gap-3 px-4 py-2 text-left text-sm"
                        style={{
                          'background-color':
                            selectedIndex() === index() ? 'var(--bg-tertiary)' : 'transparent',
                        }}
                      >
                        <div class="flex-1 min-w-0">
                          <div style={{ color: 'var(--text-primary)' }} class="font-medium">
                            {result.item.name[locale()] || result.item.name.en}
                          </div>
                          <div
                            style={{ color: 'var(--text-tertiary)' }}
                            class="text-xs line-clamp-1"
                          >
                            {result.item.def[locale()] || result.item.def.en}
                          </div>
                        </div>
                        <DifficultyBadge
                          level={result.item.difficulty as 1 | 2 | 3 | 4 | 5}
                          showLabel={false}
                          size="sm"
                        />
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
              href={localePath('/browse')}
              class="hidden sm:block px-3 py-1.5 text-sm rounded-lg transition-colors"
              style={{
                color: isActive('/browse') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                'background-color': isActive('/browse') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              {t('browse')}
            </A>

            <A
              href={localePath('/favorites')}
              class="hidden sm:block px-3 py-1.5 text-sm rounded-lg transition-colors"
              style={{
                color: isActive('/favorites') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                'background-color': isActive('/favorites') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              {t('favorites')}
            </A>

            <A
              href={localePath('/constants')}
              class="hidden sm:block px-3 py-1.5 text-sm rounded-lg transition-colors"
              style={{
                color: isActive('/constants') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                'background-color': isActive('/constants') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              {t('constants')}
            </A>

            {/* Language */}
            <LanguageToggle locale={locale} setLocale={setLocale} />

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              class="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle dark mode"
            >
              <Show
                when={darkMode()}
                fallback={
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                }
              >
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </Show>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main class="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">{props.children}</main>

      {/* Footer */}
      <footer
        class="mt-auto py-8"
        style={{
          'background-color': 'var(--bg-secondary)',
          'border-top': '1px solid var(--border-primary)',
        }}
      >
        <div class="max-w-6xl mx-auto px-4">
          <nav
            class="flex justify-center gap-6 mb-4 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            <A href={localePath('/about')} class="hover:underline">
              {t('about')}
            </A>
            <A href={localePath('/privacy')} class="hover:underline">
              Privacy
            </A>
            <A href={localePath('/terms')} class="hover:underline">
              Terms
            </A>
          </nav>
          <p class="text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Roots by SoundBlueMusic
          </p>
        </div>
      </footer>
    </div>
  );
};
