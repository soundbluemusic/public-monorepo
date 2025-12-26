import { categories } from '@/data/categories';
import { useI18n } from '@/i18n';
import { stripLocaleFromPath } from '@soundblue/shared';
import {
  DarkModeToggle,
  LanguageToggle,
  SearchDropdown,
  type SearchResult,
  cn,
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

  const renderContextResult = useCallback((result: SearchResult, _isSelected: boolean) => {
    const name = result.item.name;
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-(--text-primary)">{name.ko}</span>
          <span className="text-xs text-(--text-tertiary)">
            {result.item.tags?.[result.item.tags.length - 1]}
          </span>
        </div>
        <span className="text-(--text-secondary)">{name.en}</span>
      </div>
    );
  }, []);

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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-primary)">
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">
        {locale === 'ko' ? '본문으로 건너뛰기' : 'Skip to content'}
      </a>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-sm bg-(--bg-primary)/80 border-b border-(--border-primary)">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Menu Button + Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary)"
              aria-label={t('menu')}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <Link to={localePath('/')} className="font-semibold text-(--text-primary) no-underline">
              Context
            </Link>
          </div>

          {/* Search */}
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

          {/* Right Actions - Desktop */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              to={localePath('/browse')}
              className={cn(
                'px-3 py-2 text-sm rounded-lg transition-colors min-h-11 flex items-center justify-center',
                'text-(--text-secondary) hover:bg-(--bg-tertiary)',
                isActive('/browse') && 'text-(--accent-primary) bg-(--bg-tertiary)',
              )}
            >
              {t('browse')}
            </Link>
            <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
            <DarkModeToggle />
          </div>

          {/* Right Actions - Mobile */}
          <div className="flex sm:hidden items-center gap-1">
            <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={closeSidebar}
          onKeyDown={(e) => e.key === 'Escape' && closeSidebar()}
          role="button"
          tabIndex={0}
          aria-label={locale === 'ko' ? '메뉴 닫기' : 'Close menu'}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-(--bg-elevated) border-r border-(--border-primary)',
          'flex flex-col transform transition-transform duration-200',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label={t('menu')}
      >
        <div className="h-14 flex items-center justify-between px-4 shrink-0 border-b border-(--border-primary)">
          <span className="font-semibold text-(--text-primary)">{t('menu')}</span>
          <button
            type="button"
            onClick={closeSidebar}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary)"
            aria-label="Close menu"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-6">
            <Link
              to={localePath('/')}
              onClick={closeSidebar}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
                'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                isActive('/') && 'bg-(--bg-tertiary) text-(--accent-primary)',
              )}
            >
              <Home size={20} aria-hidden="true" />
              {t('home')}
            </Link>
            <Link
              to={localePath('/browse')}
              onClick={closeSidebar}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
                'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                isActive('/browse') && 'bg-(--bg-tertiary) text-(--accent-primary)',
              )}
            >
              <List size={20} aria-hidden="true" />
              {t('browse')}
            </Link>
            <Link
              to={localePath('/my-learning')}
              onClick={closeSidebar}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
                'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                isActive('/my-learning') && 'bg-(--bg-tertiary) text-(--accent-primary)',
              )}
            >
              <LayoutGrid size={20} aria-hidden="true" />
              {locale === 'ko' ? '내 학습 현황' : 'My Learning'}
            </Link>
            <Link
              to={localePath('/about')}
              onClick={closeSidebar}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
                'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                isActive('/about') && 'bg-(--bg-tertiary) text-(--accent-primary)',
              )}
            >
              <Info size={20} aria-hidden="true" />
              {t('about')}
            </Link>
          </div>

          <div className="px-3 mb-6">
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-(--text-tertiary)">
              {t('browseByCategory')}
            </div>
            <div className="flex flex-col gap-0.5">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={localePath(`/category/${category.id}`)}
                  onClick={closeSidebar}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11 text-sm',
                    'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                    isActive(`/category/${category.id}`) &&
                      'bg-(--bg-tertiary) text-(--accent-primary)',
                  )}
                >
                  <span className="text-base">{category.icon}</span>
                  {category.name[locale]}
                </Link>
              ))}
              <Link
                to={localePath('/browse')}
                onClick={closeSidebar}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11 text-sm text-(--accent-primary) hover:bg-(--bg-tertiary)"
              >
                <span className="text-base opacity-50">+{categories.length - 6}</span>
                {t('viewAll')}
              </Link>
            </div>
          </div>
        </nav>

        <div className="shrink-0 p-4 border-t border-(--border-primary)">
          <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-(--text-tertiary)">
            {t('more')}
          </div>
          <Link
            to={localePath('/sitemap')}
            onClick={closeSidebar}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
              'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
              isActive('/sitemap') && 'bg-(--bg-tertiary) text-(--accent-primary)',
            )}
          >
            <LayoutGrid size={20} aria-hidden="true" />
            {t('sitemap')}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 pb-20 sm:pb-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm flex-wrap list-none p-0 m-0">
              {breadcrumbs.map((item, index) => (
                <li key={item.label} className="flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight size={14} className="text-(--text-tertiary)" aria-hidden="true" />
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
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-(--bg-elevated) border-t border-(--border-primary) flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom)]">
        <Link
          to={localePath('/')}
          className={cn(
            'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 rounded-lg transition-colors',
            isActive('/') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
          )}
        >
          <Home size={20} aria-hidden="true" />
          <span className="text-xs">{t('home')}</span>
        </Link>
        <Link
          to={localePath('/browse')}
          className={cn(
            'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 rounded-lg transition-colors',
            isActive('/browse') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
          )}
        >
          <Grid3X3 size={20} aria-hidden="true" />
          <span className="text-xs">{t('browse')}</span>
        </Link>
        <Link
          to={localePath('/my-learning')}
          className={cn(
            'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 rounded-lg transition-colors',
            isActive('/my-learning') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
          )}
        >
          <LayoutGrid size={20} aria-hidden="true" />
          <span className="text-xs">{locale === 'ko' ? '학습' : 'Learn'}</span>
        </Link>
        <Link
          to={localePath('/about')}
          className={cn(
            'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 rounded-lg transition-colors',
            isActive('/about') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
          )}
        >
          <Info size={20} aria-hidden="true" />
          <span className="text-xs">{t('about')}</span>
        </Link>
      </nav>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-8 right-4 z-20 min-h-11 min-w-11 flex items-center justify-center rounded-full shadow-md bg-(--bg-elevated) border border-(--border-primary) text-(--text-secondary) cursor-pointer transition-all hover:bg-(--bg-tertiary) focus:outline-2 focus:outline-(--accent-primary) focus:outline-offset-2"
          aria-label={locale === 'ko' ? '맨 위로' : 'Back to top'}
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      )}

      {/* Footer */}
      <footer className="hidden sm:block mt-auto py-8 bg-(--bg-secondary) border-t border-(--border-primary)">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center justify-center gap-6 mb-4 text-sm text-(--text-secondary)">
            <Link
              to={localePath('/privacy')}
              className="hover:text-(--text-primary) hover:underline"
            >
              {t('privacy')}
            </Link>
            <Link to={localePath('/terms')} className="hover:text-(--text-primary) hover:underline">
              {t('terms')}
            </Link>
            <Link
              to={localePath('/license')}
              className="hover:text-(--text-primary) hover:underline"
            >
              {t('license')}
            </Link>
          </nav>
          <p className="text-center text-sm mb-2 text-(--text-tertiary)">
            {t('footerCredits')}{' '}
            <Link
              to={localePath('/built-with')}
              className="text-(--accent-primary) hover:underline"
            >
              {t('footerBuiltWith')}
            </Link>
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-(--text-tertiary)">
            <p className="m-0">Context by SoundBlueMusic</p>
            <a
              href="https://github.com/soundbluemusic/public-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-(--accent-primary) hover:underline"
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
