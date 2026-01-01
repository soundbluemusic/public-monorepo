import { LIMITS } from '@soundblue/core/validation';
import { useSettingsStore } from '@soundblue/features/settings';
import { stripLocaleFromPath } from '@soundblue/i18n';
import { useSearchWorker } from '@soundblue/search/react';
import { DarkModeToggle, FamilySites, LanguageToggle } from '@soundblue/ui/components';
import { SearchDropdown } from '@soundblue/ui/patterns';
import { cn } from '@soundblue/ui/utils';
import { ArrowUp, BookOpen, ChevronRight, Github, Heart, Menu, Star } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useI18n } from '@/i18n';
import { Sidebar } from './Sidebar';

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

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed, toggleSidebarCollapse } = useSettingsStore();

  // Real-time search with Fuse.js
  const { query, setQuery, results, isLoading } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: LIMITS.SEARCH_MAX_RESULTS,
  });

  const handleSelectResult = useCallback(
    (result: { item: { id: string } }) => {
      navigate(localePath(`/concept/${result.item.id}`));
    },
    [navigate, localePath],
  );

  // Back to top visibility with RAF throttling
  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setShowBackToTop(window.scrollY > 300);
        rafId = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (basePath: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === basePath || currentPath.startsWith(`${basePath}/`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-primary)">
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">
        {t('skipToContent')}
      </a>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-(--header-height) backdrop-blur-sm bg-(--bg-primary)/80 border-b border-(--border-primary)">
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          {/* Left: Menu button (mobile) + Logo */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer"
              aria-label={locale === 'ko' ? '메뉴 열기' : 'Open menu'}
            >
              <Menu size={20} aria-hidden="true" />
            </button>

            <Link
              to={localePath('/')}
              className="font-semibold shrink-0 flex items-center gap-2 text-(--text-primary) no-underline"
            >
              <span className="text-xl">π</span>
              <span>Roots</span>
            </Link>
          </div>

          {/* Real-time Search Dropdown */}
          <div className="flex-1 max-w-md">
            <SearchDropdown
              query={query}
              onQueryChange={setQuery}
              results={results}
              isLoading={isLoading}
              onSelect={handleSelectResult}
              locale={locale}
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Link
              to={localePath('/browse')}
              className={cn(
                'hidden sm:flex min-h-11 items-center px-3 py-2 text-sm rounded-lg transition-colors no-underline',
                isActive('/browse')
                  ? 'text-(--accent-primary) bg-(--bg-tertiary)'
                  : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
              )}
            >
              {t('browse')}
            </Link>

            <Link
              to={localePath('/favorites')}
              className={cn(
                'hidden sm:flex min-h-11 items-center px-3 py-2 text-sm rounded-lg transition-colors no-underline',
                isActive('/favorites')
                  ? 'text-(--accent-primary) bg-(--bg-tertiary)'
                  : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
              )}
            >
              {t('favorites')}
            </Link>

            <Link
              to={localePath('/constants')}
              className={cn(
                'hidden sm:flex min-h-11 items-center px-3 py-2 text-sm rounded-lg transition-colors no-underline',
                isActive('/constants')
                  ? 'text-(--accent-primary) bg-(--bg-tertiary)'
                  : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
              )}
            >
              {t('constants')}
            </Link>

            <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content */}
      <main
        id="main-content"
        data-sidebar-collapsed={sidebarCollapsed ? 'true' : undefined}
        className={cn(
          'flex-1 w-full px-4 py-8 pb-20 lg:pb-8',
          'pt-(--header-height)',
          // Desktop: offset for fixed sidebar
          'lg:ml-(--sidebar-width)',
          'transition-[margin] duration-200',
        )}
      >
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-1 text-sm flex-wrap list-none p-0 m-0">
                {breadcrumbs.map((item, index) => (
                  <li key={item.label} className="flex items-center gap-1">
                    {index > 0 && (
                      <ChevronRight
                        size={14}
                        className="text-(--text-tertiary)"
                        aria-hidden="true"
                      />
                    )}
                    {item.path ? (
                      <Link
                        to={localePath(item.path)}
                        className="text-(--text-secondary) no-underline hover:underline"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-(--text-primary)">{item.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-(--bg-elevated) border-t border-(--border-primary) flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
      >
        <Link
          to={localePath('/browse')}
          className={cn(
            'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-4 py-2 no-underline transition-colors',
            isActive('/browse') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
          )}
        >
          <BookOpen size={20} aria-hidden="true" />
          <span className="text-xs">{t('browse')}</span>
        </Link>
        <Link
          to={localePath('/favorites')}
          className={cn(
            'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-4 py-2 no-underline transition-colors',
            isActive('/favorites') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
          )}
        >
          <Heart size={20} aria-hidden="true" />
          <span className="text-xs">{t('favorites')}</span>
        </Link>
        <Link
          to={localePath('/constants')}
          className={cn(
            'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-4 py-2 no-underline transition-colors',
            isActive('/constants') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
          )}
        >
          <Star size={20} aria-hidden="true" />
          <span className="text-xs">{t('constants')}</span>
        </Link>
      </nav>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-20 lg:bottom-8 right-4 z-20 min-h-11 min-w-11 flex items-center justify-center rounded-full shadow-md transition-colors bg-(--bg-elevated) border border-(--border-primary) text-(--text-secondary) cursor-pointer hover:bg-(--bg-tertiary)"
          aria-label={t('backToTop')}
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      )}

      {/* Footer - Hidden on mobile */}
      <footer className="hidden lg:block mt-auto py-8 bg-(--bg-secondary) border-t border-(--border-primary)">
        <div className="max-w-6xl mx-auto px-4">
          <nav
            aria-label="Footer links"
            className="flex items-center justify-center gap-6 mb-4 text-sm text-(--text-secondary)"
          >
            <Link to={localePath('/about')} className="no-underline hover:underline text-inherit">
              {t('about')}
            </Link>
            <Link
              to={localePath('/built-with')}
              className="no-underline hover:underline text-inherit"
            >
              {locale === 'ko' ? '사용된 기술' : 'Built With'}
            </Link>
            <Link to={localePath('/sitemap')} className="no-underline hover:underline text-inherit">
              {t('sitemap')}
            </Link>
          </nav>

          {/* More from Us */}
          <div className="flex justify-center mb-4">
            <FamilySites currentAppId="roots" variant="footer" locale={locale} />
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-(--text-tertiary)">
            <p>{t('footerText')}</p>
            <a
              href="https://github.com/soundbluemusic/public-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-(--accent-primary) no-underline hover:underline"
            >
              <Github size={16} aria-hidden="true" />
              {t('github')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
