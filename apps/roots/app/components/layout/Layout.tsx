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
import styles from '../../styles/app.module.scss';
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
    <div className={styles.container}>
      {/* Skip to content */}
      <a href="#main-content" className={styles.skipToContent}>
        {locale === 'ko' ? '본문으로 건너뛰기' : 'Skip to content'}
      </a>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to={localePath('/')} className={styles.logo}>
            <span className={styles.logoIcon}>π</span>
            <span>Roots</span>
          </Link>

          {/* Real-time Search Dropdown */}
          <div className={styles.searchWrapper}>
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
          <div className={styles.rightActions}>
            <Link
              to={localePath('/browse')}
              className={`${styles.navLink} ${isActive('/browse') ? styles.navLinkActive : ''}`}
            >
              {t('browse')}
            </Link>

            <Link
              to={localePath('/favorites')}
              className={`${styles.navLink} ${isActive('/favorites') ? styles.navLinkActive : ''}`}
            >
              {t('favorites')}
            </Link>

            <Link
              to={localePath('/constants')}
              className={`${styles.navLink} ${isActive('/constants') ? styles.navLinkActive : ''}`}
            >
              {t('constants')}
            </Link>

            <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className={styles.mainWrapper}>
        <Sidebar />
        <main id="main-content" className={styles.main}>
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
              <ol className={styles.breadcrumbList}>
                {breadcrumbs.map((item, index) => (
                  <li key={item.label} className={styles.breadcrumbItem}>
                    {index > 0 && (
                      <ChevronRight
                        size={14}
                        className={styles.breadcrumbIcon}
                        aria-hidden="true"
                      />
                    )}
                    {item.path ? (
                      <Link to={localePath(item.path)} className={styles.breadcrumbLink}>
                        {item.label}
                      </Link>
                    ) : (
                      <span className={styles.breadcrumbCurrent}>{item.label}</span>
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
      <nav className={styles.bottomNav}>
        <Link
          to={localePath('/browse')}
          className={`${styles.bottomNavItem} ${isActive('/browse') ? styles.bottomNavItemActive : ''}`}
        >
          <BookOpen size={20} aria-hidden="true" />
          <span className={styles.bottomNavLabel}>{t('browse')}</span>
        </Link>
        <Link
          to={localePath('/favorites')}
          className={`${styles.bottomNavItem} ${isActive('/favorites') ? styles.bottomNavItemActive : ''}`}
        >
          <Heart size={20} aria-hidden="true" />
          <span className={styles.bottomNavLabel}>{t('favorites')}</span>
        </Link>
        <Link
          to={localePath('/constants')}
          className={`${styles.bottomNavItem} ${isActive('/constants') ? styles.bottomNavItemActive : ''}`}
        >
          <Star size={20} aria-hidden="true" />
          <span className={styles.bottomNavLabel}>{t('constants')}</span>
        </Link>
      </nav>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className={styles.backToTop}
          aria-label={locale === 'ko' ? '맨 위로' : 'Back to top'}
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      )}

      {/* Footer - Hidden on mobile */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <nav className={styles.footerNav}>
            <Link to={localePath('/about')} className={styles.footerNavLink}>
              {t('about')}
            </Link>
            <Link to={localePath('/sitemap')} className={styles.footerNavLink}>
              {locale === 'ko' ? '사이트맵' : 'Sitemap'}
            </Link>
          </nav>
          <div className={styles.footerContent}>
            <p>{t('footerText')}</p>
            <a
              href="https://github.com/soundbluemusic/public-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerGithub}
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
