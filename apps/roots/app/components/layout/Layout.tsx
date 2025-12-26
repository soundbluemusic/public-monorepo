import { useI18n } from '@/i18n';
import { stripLocaleFromPath } from '@soundblue/shared';
import {
  DarkModeToggle,
  LanguageToggle,
  SearchDropdown,
  cn,
  useSearchWorker,
} from '@soundblue/shared-react';
import { ArrowUp, BookOpen, ChevronRight, Github, Heart, Star } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
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

  // Real-time search with Fuse.js
  const { query, setQuery, results, isLoading } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: 8,
  });

  const handleSelectResult = useCallback(
    (result: { item: { id: string } }) => {
      navigate(localePath(`/concept/${result.item.id}`));
    },
    [navigate, localePath],
  );

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
    return currentPath === basePath || currentPath.startsWith(`${basePath}/`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-primary)">
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">
        {locale === 'ko' ? '본문으로 건너뛰기' : 'Skip to content'}
      </a>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-sm bg-(--bg-primary)/80 border-b border-(--border-primary)">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link
            to={localePath('/')}
            className="font-semibold flex-shrink-0 flex items-center gap-2 text-(--text-primary) no-underline"
          >
            <span className="text-xl">π</span>
            <span>Roots</span>
          </Link>

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
          <div className="flex items-center gap-1 flex-shrink-0">
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

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex">
        <Sidebar />
        <main
          id="main-content"
          className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full pb-20 lg:ml-0 lg:pb-8"
        >
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
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-(--bg-elevated) border-t border-(--border-primary) flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom,0px)] lg:hidden">
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
          className="fixed bottom-20 lg:bottom-8 right-4 z-30 min-h-11 min-w-11 flex items-center justify-center rounded-full shadow-md transition-colors bg-(--bg-elevated) border border-(--border-primary) text-(--text-secondary) cursor-pointer hover:bg-(--bg-tertiary)"
          aria-label={locale === 'ko' ? '맨 위로' : 'Back to top'}
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      )}

      {/* Footer - Hidden on mobile */}
      <footer className="hidden lg:block mt-auto py-8 bg-(--bg-secondary) border-t border-(--border-primary)">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex items-center justify-center gap-6 mb-4 text-sm text-(--text-secondary)">
            <Link to={localePath('/about')} className="no-underline hover:underline text-inherit">
              {t('about')}
            </Link>
            <Link to={localePath('/sitemap')} className="no-underline hover:underline text-inherit">
              {locale === 'ko' ? '사이트맵' : 'Sitemap'}
            </Link>
          </nav>
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
