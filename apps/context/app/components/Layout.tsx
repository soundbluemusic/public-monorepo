import { categories } from '@/data/categories';
import { useI18n } from '@/i18n';
import styles from '@/styles/app.module.scss';
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
      <div className={styles.searchResult}>
        <div className={styles.searchResultLeft}>
          <span className={styles.searchResultKorean}>{name.ko}</span>
          <span className={styles.searchResultTag}>
            {result.item.tags?.[result.item.tags.length - 1]}
          </span>
        </div>
        <span className={styles.searchResultEnglish}>{name.en}</span>
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

  return (
    <div className={styles.layout}>
      {/* Skip to content */}
      <a href="#main-content" className={styles.skipToContent}>
        {locale === 'ko' ? '본문으로 건너뛰기' : 'Skip to content'}
      </a>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Menu Button + Logo */}
          <div className={styles.headerLeft}>
            <label htmlFor="sidebar-toggle" className={styles.menuButton} aria-label={t('menu')}>
              <Menu size={20} aria-hidden="true" />
            </label>
            <Link to={localePath('/')} className={styles.logo}>
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
            className={styles.searchWrapper}
          />

          {/* Right Actions - Desktop */}
          <div className={styles.headerRightDesktop}>
            <Link
              to={localePath('/browse')}
              className={`${styles.browseLink} ${isActive('/browse') ? styles.browseLinkActive : ''}`}
            >
              {t('browse')}
            </Link>
            <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
            <DarkModeToggle />
          </div>

          {/* Right Actions - Mobile */}
          <div className={styles.headerRightMobile}>
            <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* CSS-Only Sidebar */}
      <input type="checkbox" id="sidebar-toggle" className={styles.toggle} tabIndex={-1} />

      <label htmlFor="sidebar-toggle" className={styles.backdrop}>
        <span className={styles.srOnly}>{locale === 'ko' ? '메뉴 닫기' : 'Close menu'}</span>
      </label>

      <aside className={styles.sidebar} aria-label={t('menu')}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>{t('menu')}</span>
          <label htmlFor="sidebar-toggle" className={styles.menuButton} aria-label="Close menu">
            <X size={20} aria-hidden="true" />
          </label>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <Link
              to={localePath('/')}
              className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}
            >
              <Home size={20} aria-hidden="true" />
              {t('home')}
            </Link>
            <Link
              to={localePath('/browse')}
              className={`${styles.navLink} ${isActive('/browse') ? styles.navLinkActive : ''}`}
            >
              <List size={20} aria-hidden="true" />
              {t('browse')}
            </Link>
            <Link
              to={localePath('/my-learning')}
              className={`${styles.navLink} ${isActive('/my-learning') ? styles.navLinkActive : ''}`}
            >
              <LayoutGrid size={20} aria-hidden="true" />
              {locale === 'ko' ? '내 학습 현황' : 'My Learning'}
            </Link>
            <Link
              to={localePath('/about')}
              className={`${styles.navLink} ${isActive('/about') ? styles.navLinkActive : ''}`}
            >
              <Info size={20} aria-hidden="true" />
              {t('about')}
            </Link>
          </div>

          <div className={styles.navSection}>
            <div className={styles.sectionLabel}>{t('browseByCategory')}</div>
            <div className={styles.categoryList}>
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={localePath(`/category/${category.id}`)}
                  className={`${styles.navLink} ${styles.navLinkSecondary} ${isActive(`/category/${category.id}`) ? styles.navLinkActive : ''}`}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  {category.name[locale]}
                </Link>
              ))}
              <Link
                to={localePath('/browse')}
                className={`${styles.navLink} ${styles.navLinkSecondary} ${styles.viewAllLink}`}
              >
                <span className={styles.viewAllIcon}>+{categories.length - 6}</span>
                {t('viewAll')}
              </Link>
            </div>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.sectionLabel}>{t('more')}</div>
          <Link
            to={localePath('/sitemap')}
            className={`${styles.navLink} ${isActive('/sitemap') ? styles.navLinkActive : ''}`}
          >
            <LayoutGrid size={20} aria-hidden="true" />
            {t('sitemap')}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main id="main-content" className={styles.main}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
            <ol className={styles.breadcrumbList}>
              {breadcrumbs.map((item, index) => (
                <li key={item.label} className={styles.breadcrumbItem}>
                  {index > 0 && (
                    <ChevronRight size={14} className={styles.breadcrumbIcon} aria-hidden="true" />
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

      {/* Bottom Navigation (Mobile) */}
      <nav className={styles.bottomNav}>
        <Link
          to={localePath('/')}
          className={`${styles.bottomNavLink} ${isActive('/') ? styles.bottomNavLinkActive : ''}`}
        >
          <Home size={20} aria-hidden="true" />
          <span className={styles.bottomNavLabel}>{t('home')}</span>
        </Link>
        <Link
          to={localePath('/browse')}
          className={`${styles.bottomNavLink} ${isActive('/browse') ? styles.bottomNavLinkActive : ''}`}
        >
          <Grid3X3 size={20} aria-hidden="true" />
          <span className={styles.bottomNavLabel}>{t('browse')}</span>
        </Link>
        <Link
          to={localePath('/my-learning')}
          className={`${styles.bottomNavLink} ${isActive('/my-learning') ? styles.bottomNavLinkActive : ''}`}
        >
          <LayoutGrid size={20} aria-hidden="true" />
          <span className={styles.bottomNavLabel}>{locale === 'ko' ? '학습' : 'Learn'}</span>
        </Link>
        <Link
          to={localePath('/about')}
          className={`${styles.bottomNavLink} ${isActive('/about') ? styles.bottomNavLinkActive : ''}`}
        >
          <Info size={20} aria-hidden="true" />
          <span className={styles.bottomNavLabel}>{t('about')}</span>
        </Link>
      </nav>

      {/* Back to Top */}
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

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <nav className={styles.footerNav}>
            <Link to={localePath('/privacy')} className={styles.footerNavLink}>
              {t('privacy')}
            </Link>
            <Link to={localePath('/terms')} className={styles.footerNavLink}>
              {t('terms')}
            </Link>
            <Link to={localePath('/license')} className={styles.footerNavLink}>
              {t('license')}
            </Link>
          </nav>
          <p className={styles.footerCredits}>
            {t('footerCredits')}{' '}
            <Link to={localePath('/built-with')} className={styles.footerBuiltWithLink}>
              {t('footerBuiltWith')}
            </Link>
          </p>
          <div className={styles.footerBottom}>
            <p className={styles.footerBrand}>Context by SoundBlueMusic</p>
            <a
              href="https://github.com/soundbluemusic/public-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerGithub}
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
