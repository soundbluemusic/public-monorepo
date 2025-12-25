import { useI18n } from '@/i18n';
import { stripLocaleFromPath } from '@soundblue/shared';
import {
  DarkModeToggle,
  LanguageToggle,
  SearchDropdown,
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
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link
            to={localePath('/')}
            className="font-semibold shrink-0 flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <span className="text-xl">π</span>
            <span>Roots</span>
          </Link>

          {/* Real-time Search Dropdown */}
          <SearchDropdown
            query={query}
            onQueryChange={setQuery}
            results={results}
            isLoading={isLoading}
            onSelect={handleSelectResult}
            locale={locale}
            className="flex-1 max-w-md"
          />

          {/* Right Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Link
              to={localePath('/browse')}
              className="hidden sm:flex px-3 py-2 text-sm rounded-lg transition-colors min-h-11 items-center"
              style={{
                color: isActive('/browse') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive('/browse') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              {t('browse')}
            </Link>

            <Link
              to={localePath('/favorites')}
              className="hidden sm:flex px-3 py-2 text-sm rounded-lg transition-colors min-h-11 items-center"
              style={{
                color: isActive('/favorites') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive('/favorites') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              {t('favorites')}
            </Link>

            <Link
              to={localePath('/constants')}
              className="hidden sm:flex px-3 py-2 text-sm rounded-lg transition-colors min-h-11 items-center"
              style={{
                color: isActive('/constants') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive('/constants') ? 'var(--bg-tertiary)' : 'transparent',
              }}
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
          className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full lg:ml-0 pb-20 lg:pb-8"
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
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border-primary)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <Link
          to={localePath('/browse')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-14"
          style={{ color: isActive('/browse') ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
        >
          <BookOpen size={20} aria-hidden="true" />
          <span className="text-xs">{t('browse')}</span>
        </Link>
        <Link
          to={localePath('/favorites')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-14"
          style={{
            color: isActive('/favorites') ? 'var(--accent-primary)' : 'var(--text-secondary)',
          }}
        >
          <Heart size={20} aria-hidden="true" />
          <span className="text-xs">{t('favorites')}</span>
        </Link>
        <Link
          to={localePath('/constants')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-14"
          style={{
            color: isActive('/constants') ? 'var(--accent-primary)' : 'var(--text-secondary)',
          }}
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
          className="fixed bottom-20 lg:bottom-8 right-4 z-30 min-h-11 min-w-11 flex items-center justify-center rounded-full shadow-lg transition-all"
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

      {/* Footer - Hidden on mobile */}
      <footer
        className="hidden lg:block mt-auto py-8"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-primary)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <nav
            className="flex justify-center gap-6 mb-4 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Link to={localePath('/about')} className="hover:underline">
              {t('about')}
            </Link>
            <Link to={localePath('/sitemap')} className="hover:underline">
              {locale === 'ko' ? '사이트맵' : 'Sitemap'}
            </Link>
          </nav>
          <div
            className="flex items-center justify-center gap-4 text-sm"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <p>{t('footerText')}</p>
            <a
              href="https://github.com/soundbluemusic/public-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline"
              style={{ color: 'var(--accent-primary)' }}
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
