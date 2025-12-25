import { categories } from '@/data/categories';
import { useI18n } from '@/i18n';
import { stripLocaleFromPath } from '@soundblue/shared';
import {
  DarkModeToggle,
  LanguageToggle,
  SearchDropdown,
  type SearchResult,
  useSearchWorker,
} from '@soundblue/shared-react';
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
  X,
} from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

// Use shared utility for locale stripping
const stripLocale = stripLocaleFromPath;

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface LayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function Layout({ children, breadcrumbs }: LayoutProps) {
  const { locale, t, localePath } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  // Back to top
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Real-time search with Fuse.js
  const { query, setQuery, results, isLoading } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: 8,
  });

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      navigate(localePath(`/entry/${result.item.id}`));
    },
    [navigate, localePath],
  );

  // Custom render for Context entries (shows korean + romanization)
  const renderContextResult = useCallback((result: SearchResult, _isSelected: boolean) => {
    const name = result.item.name;
    return (
      <div className="flex items-baseline justify-between w-full">
        <div className="flex items-baseline gap-2">
          <span style={{ color: 'var(--text-primary)' }} className="font-medium">
            {name.ko}
          </span>
          <span style={{ color: 'var(--text-tertiary)' }} className="text-xs">
            {result.item.tags?.[result.item.tags.length - 1]}
          </span>
        </div>
        <span style={{ color: 'var(--text-secondary)' }}>{name.en}</span>
      </div>
    );
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
            {/* CSS-only sidebar trigger using label */}
            <label
              htmlFor="sidebar-toggle"
              className="min-h-11 min-w-11 flex items-center justify-center rounded-lg cursor-pointer text-text-secondary transition-colors hover:bg-bg-tertiary"
              aria-label={t('menu')}
            >
              <Menu size={20} aria-hidden="true" />
            </label>
            <Link
              to={localePath('/')}
              className="font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Context
            </Link>
          </div>

          {/* Real-time Search Dropdown */}
          <SearchDropdown
            query={query}
            onQueryChange={setQuery}
            results={results}
            isLoading={isLoading}
            onSelect={handleSelectResult}
            locale={locale}
            renderResult={renderContextResult}
            className="flex-1 max-w-md"
          />

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

            <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
            <DarkModeToggle />
          </div>

          {/* Mobile: only theme toggle */}
          <div className="flex sm:hidden items-center gap-1 shrink-0">
            <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* CSS-Only Sidebar (Checkbox Hack with Tailwind peer) - Works without JavaScript */}
      <input type="checkbox" id="sidebar-toggle" className="peer sr-only" tabIndex={-1} />

      {/* Backdrop - hidden by default, shown when peer is checked */}
      <label
        htmlFor="sidebar-toggle"
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm cursor-pointer
                   opacity-0 invisible transition-all duration-200 ease-out
                   peer-checked:opacity-100 peer-checked:visible"
      >
        <span className="sr-only">{locale === 'ko' ? '메뉴 닫기' : 'Close menu'}</span>
      </label>

      {/* Sidebar Panel - off-screen by default, slides in when peer is checked */}
      <aside
        className="fixed top-0 left-0 z-51 h-full w-72 flex flex-col
                   bg-bg-primary border-r border-border-primary
                   -translate-x-full transition-transform duration-200 ease-out
                   peer-checked:translate-x-0"
        aria-label={t('menu')}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 shrink-0 border-b border-border-primary">
          <span className="font-semibold text-text-primary">{t('menu')}</span>
          <label
            htmlFor="sidebar-toggle"
            className="min-h-11 min-w-11 flex items-center justify-center rounded-lg cursor-pointer text-text-secondary transition-colors hover:bg-bg-tertiary"
            aria-label="Close menu"
          >
            <X size={20} aria-hidden="true" />
          </label>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-6">
            <Link
              to={localePath('/')}
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
              to={localePath('/my-learning')}
              className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors min-h-11"
              style={{
                color: isActive('/my-learning') ? 'var(--accent-primary)' : 'var(--text-primary)',
                backgroundColor: isActive('/my-learning') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              <LayoutGrid size={20} aria-hidden="true" />
              {locale === 'ko' ? '내 학습 현황' : 'My Learning'}
            </Link>
            <Link
              to={localePath('/about')}
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
        <div className="shrink-0 py-4 px-3 border-t border-border-primary">
          <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
            {t('more')}
          </div>
          <Link
            to={localePath('/sitemap')}
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
          to={localePath('/my-learning')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-14"
          style={{
            color: isActive('/my-learning') ? 'var(--accent-primary)' : 'var(--text-secondary)',
          }}
        >
          <LayoutGrid size={20} aria-hidden="true" />
          <span className="text-xs">{locale === 'ko' ? '학습' : 'Learn'}</span>
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
