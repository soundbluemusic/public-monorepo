import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import type { MeaningEntry } from '@/data/types';
import { type Language, useI18n } from '@/i18n';
import { DarkModeToggle, LanguageToggle } from '@soundblue/shared-react';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

function stripLocale(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3);
  if (pathname === '/ko') return '/';
  return pathname;
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { locale, setLocale, t, localePath } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MeaningEntry[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Initialize dark mode
  useEffect(() => {
    const stored = localStorage.getItem('context-dark-mode');
    if (stored !== null) {
      const isDark = stored === 'true';
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('context-dark-mode', String(newValue));
    document.documentElement.classList.toggle('dark', newValue);
  };

  // Search functionality
  const MAX_SEARCH_LENGTH = 100;
  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim().slice(0, MAX_SEARCH_LENGTH);
    if (!q) return [];

    const matched = meaningEntries.filter((entry) => {
      const translation = entry.translations[locale];
      return (
        entry.korean.includes(q) ||
        entry.romanization.toLowerCase().includes(q) ||
        translation.word.toLowerCase().includes(q)
      );
    });

    return matched.slice(0, 8);
  }, [searchQuery, locale]);

  useEffect(() => {
    setSearchResults(filteredResults);
    setSelectedIndex(0);
  }, [filteredResults]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    const len = searchResults.length;

    if (e.key === 'Escape') {
      setShowResults(false);
      searchInputRef.current?.blur();
      return;
    }

    if (e.key === 'ArrowDown' && len > 0) {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % len);
    } else if (e.key === 'ArrowUp' && len > 0) {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + len) % len);
    } else if (e.key === 'Enter' && len > 0) {
      e.preventDefault();
      selectResult(searchResults[selectedIndex]);
    }
  };

  const selectResult = (entry: MeaningEntry) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(localePath(`/entry/${entry.id}`));
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowResults(true);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const isActive = (basePath: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === basePath;
  };

  const handleLocaleChange = (lang: Language) => {
    setLocale(lang);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-sm"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg-primary) 80%, transparent)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Menu Button + Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg transition-colors hover:bg-(--bg-tertiary)"
              style={{ color: 'var(--text-secondary)' }}
              aria-label={t('menu')}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Link
              to={localePath('/')}
              className="font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Context
            </Link>
          </div>

          {/* Search Form */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-md">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--text-tertiary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder={locale === 'ko' ? '검색...' : 'Search...'}
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                }}
              />
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchQuery.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden z-50"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                {searchResults.length > 0 ? (
                  searchResults.map((entry, index) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => selectResult(entry)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className="w-full flex items-baseline justify-between px-4 py-2 text-left text-sm"
                      style={{
                        backgroundColor:
                          selectedIndex === index ? 'var(--bg-tertiary)' : 'transparent',
                      }}
                    >
                      <div className="flex items-baseline gap-2">
                        <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                          {entry.korean}
                        </span>
                        <span style={{ color: 'var(--text-tertiary)' }} className="text-xs">
                          {entry.romanization}
                        </span>
                      </div>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {entry.translations[locale].word}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {locale === 'ko' ? '결과 없음' : 'No results'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Link
              to={localePath('/browse')}
              className="px-3 py-1.5 text-sm rounded-lg transition-colors"
              style={{
                color: isActive('/browse') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive('/browse') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              {t('browse')}
            </Link>

            <LanguageToggle locale={locale} onLocaleChange={handleLocaleChange} />
            <DarkModeToggle isDark={darkMode} onToggle={toggleDarkMode} />
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 z-50 h-full w-72 transform transition-transform duration-300 ease-in-out flex flex-col"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRight: '1px solid var(--border-primary)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Sidebar Header */}
        <div
          className="h-14 flex items-center justify-between px-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border-primary)' }}
        >
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('menu')}
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg transition-colors hover:bg-(--bg-tertiary)"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-6">
            <Link
              to={localePath('/')}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
              style={{
                color: isActive('/') ? 'var(--accent-primary)' : 'var(--text-primary)',
                backgroundColor: isActive('/') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {t('home')}
            </Link>
            <Link
              to={localePath('/browse')}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
              style={{
                color: isActive('/browse') ? 'var(--accent-primary)' : 'var(--text-primary)',
                backgroundColor: isActive('/browse') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              {t('browse')}
            </Link>
            <Link
              to={localePath('/about')}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
              style={{
                color: isActive('/about') ? 'var(--accent-primary)' : 'var(--text-primary)',
                backgroundColor: isActive('/about') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t('about')}
            </Link>
          </div>

          {/* Categories */}
          <div className="px-3 mb-6">
            <div
              className="px-3 py-2 text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {t('browseByCategory')}
            </div>
            <div className="space-y-0.5">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={localePath(`/category/${category.id}`)}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm"
                  style={{
                    color: isActive(`/category/${category.id}`)
                      ? 'var(--accent-primary)'
                      : 'var(--text-secondary)',
                    backgroundColor: isActive(`/category/${category.id}`)
                      ? 'var(--bg-tertiary)'
                      : 'transparent',
                  }}
                >
                  <span className="text-base">{category.icon}</span>
                  {category.name[locale]}
                </Link>
              ))}
              <Link
                to={localePath('/browse')}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm"
                style={{ color: 'var(--accent-primary)' }}
              >
                <span className="text-base opacity-50">+{categories.length - 6}</span>
                {t('viewAll')}
              </Link>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div
          className="shrink-0 py-4 px-3"
          style={{ borderTop: '1px solid var(--border-primary)' }}
        >
          <div
            className="px-3 py-2 text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {t('more')}
          </div>
          <Link
            to={localePath('/sitemap')}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
            style={{
              color: isActive('/sitemap') ? 'var(--accent-primary)' : 'var(--text-primary)',
              backgroundColor: isActive('/sitemap') ? 'var(--bg-tertiary)' : 'transparent',
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            {t('sitemap')}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer
        className="mt-auto py-8"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-primary)',
        }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <nav
            className="flex justify-center gap-6 mb-4 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Link to={localePath('/privacy')} className="hover:underline">
              {t('privacy')}
            </Link>
            <Link to={localePath('/terms')} className="hover:underline">
              {t('terms')}
            </Link>
            <Link to={localePath('/license')} className="hover:underline">
              {t('license')}
            </Link>
          </nav>
          <p className="text-center text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>
            {t('footerCredits')}{' '}
            <Link
              to={localePath('/built-with')}
              className="underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              {t('footerBuiltWith')}
            </Link>
          </p>
          <div
            className="flex items-center justify-center gap-4 text-sm"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <p>Context by SoundBlueMusic</p>
            <a
              href="https://github.com/soundbluemusic/public-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              {t('footerGitHub')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
