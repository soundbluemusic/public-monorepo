import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import type { MeaningEntry } from '@/data/types';
import { type Language, useI18n } from '@/i18n';
import { DarkModeToggle, LanguageToggle } from '@soundblue/shared-react';
import {
  ArrowUp,
  ChevronRight,
  Github,
  Grid3X3,
  Home,
  Info,
  LayoutGrid,
  List,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

function stripLocale(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3);
  if (pathname === '/ko') return '/';
  return pathname;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface LayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function Layout({ children, breadcrumbs }: LayoutProps) {
  const { locale, setLocale, t, localePath } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Back to top
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Search functionality
  const MAX_SEARCH_LENGTH = 100;
  const searchResults = useMemo(() => {
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

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (basePath: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === basePath;
  };

  const handleLocaleChange = (lang: Language) => {
    setLocale(lang);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">
        {locale === 'ko' ? '본문으로 건너뛰기' : 'Skip to content'}
      </a>

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
              className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
              style={{ color: 'var(--text-secondary)' }}
              aria-label={t('menu')}
            >
              <Menu size={20} aria-hidden="true" />
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
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-tertiary)' }}
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder={locale === 'ko' ? '검색... (⌘K)' : 'Search... (⌘K)'}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg focus:outline-none"
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
                      className="w-full flex items-baseline justify-between px-4 py-3 text-left text-sm min-h-11"
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

          {/* Right Actions - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <Link
              to={localePath('/browse')}
              className="px-3 py-2 text-sm rounded-lg transition-colors min-h-11 flex items-center"
              style={{
                color: isActive('/browse') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive('/browse') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              {t('browse')}
            </Link>

            <LanguageToggle locale={locale} onLocaleChange={handleLocaleChange} />
            <DarkModeToggle />
          </div>

          {/* Mobile: only theme toggle */}
          <div className="flex sm:hidden items-center gap-1 shrink-0">
            <LanguageToggle locale={locale} onLocaleChange={handleLocaleChange} />
            <DarkModeToggle />
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
            className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Close menu"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Sidebar Content */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-6">
            <Link
              to={localePath('/')}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors min-h-11"
              style={{
                color: isActive('/') ? 'var(--accent-primary)' : 'var(--text-primary)',
                backgroundColor: isActive('/') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              <Home size={20} aria-hidden="true" />
              {t('home')}
            </Link>
            <Link
              to={localePath('/browse')}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors min-h-11"
              style={{
                color: isActive('/browse') ? 'var(--accent-primary)' : 'var(--text-primary)',
                backgroundColor: isActive('/browse') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              <List size={20} aria-hidden="true" />
              {t('browse')}
            </Link>
            <Link
              to={localePath('/about')}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors min-h-11"
              style={{
                color: isActive('/about') ? 'var(--accent-primary)' : 'var(--text-primary)',
                backgroundColor: isActive('/about') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              <Info size={20} aria-hidden="true" />
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
                  className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm min-h-11"
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
                className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm min-h-11"
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
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors min-h-11"
            style={{
              color: isActive('/sitemap') ? 'var(--accent-primary)' : 'var(--text-primary)',
              backgroundColor: isActive('/sitemap') ? 'var(--bg-tertiary)' : 'transparent',
            }}
          >
            <LayoutGrid size={20} aria-hidden="true" />
            {t('sitemap')}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main
        id="main-content"
        className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full pb-bottom-nav sm:pb-8"
      >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm flex-wrap">
              {breadcrumbs.map((item, index) => (
                <li key={item.label} className="flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight
                      size={14}
                      className="text-[var(--text-tertiary)]"
                      aria-hidden="true"
                    />
                  )}
                  {item.path ? (
                    <Link
                      to={localePath(item.path)}
                      className="hover:underline"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border-primary)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <Link
          to={localePath('/')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-14"
          style={{ color: isActive('/') ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
        >
          <Home size={20} aria-hidden="true" />
          <span className="text-xs">{t('home')}</span>
        </Link>
        <Link
          to={localePath('/browse')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-14"
          style={{ color: isActive('/browse') ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
        >
          <Grid3X3 size={20} aria-hidden="true" />
          <span className="text-xs">{t('browse')}</span>
        </Link>
        <Link
          to={localePath('/about')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-14"
          style={{ color: isActive('/about') ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
        >
          <Info size={20} aria-hidden="true" />
          <span className="text-xs">{t('about')}</span>
        </Link>
      </nav>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-8 right-4 z-30 min-h-11 min-w-11 flex items-center justify-center rounded-full shadow-lg transition-all"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-secondary)',
          }}
          aria-label={locale === 'ko' ? '맨 위로' : 'Back to top'}
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      )}

      {/* Footer - Hidden on mobile (bottom nav takes its place) */}
      <footer
        className="hidden sm:block mt-auto py-8"
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
              <Github size={16} aria-hidden="true" />
              {t('footerGitHub')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
