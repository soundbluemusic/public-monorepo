import { Link, useLocation } from 'react-router';
import { type Language, useI18n } from '../../i18n';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  isReady: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

interface NavItem {
  href: string;
  label: string;
  labelKo: string;
  icon: string;
}

interface QuickLink {
  name: string;
  desc: string;
  descKo: string;
  href: string;
  icon: string;
}

const navItems: readonly NavItem[] = [
  { href: '/', label: 'Home', labelKo: '홈', icon: '🏠' },
  { href: '/web-api', label: 'Web API', labelKo: 'Web API', icon: '🌐' },
  { href: '/libraries', label: 'Libraries', labelKo: 'Libraries', icon: '📦' },
];

const quickLinks = {
  webApi: [
    {
      name: 'Fetch API',
      desc: 'HTTP requests',
      descKo: 'HTTP 요청',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
      icon: '🌐',
    },
    {
      name: 'localStorage',
      desc: 'Persistent storage',
      descKo: '영구 저장소',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
      icon: '💾',
    },
    {
      name: 'WebSocket',
      desc: 'Real-time',
      descKo: '실시간 통신',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket',
      icon: '🔌',
    },
    {
      name: 'Canvas',
      desc: '2D graphics',
      descKo: '2D 그래픽',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
      icon: '🎨',
    },
  ],
  libraries: [
    {
      name: 'React',
      desc: 'UI library',
      descKo: 'UI 라이브러리',
      href: 'https://github.com/facebook/react',
      icon: '⚛️',
    },
    {
      name: 'Vue',
      desc: 'Progressive',
      descKo: '프로그레시브',
      href: 'https://github.com/vuejs/core',
      icon: '💚',
    },
    {
      name: 'Vite',
      desc: 'Build tool',
      descKo: '빌드 도구',
      href: 'https://github.com/vitejs/vite',
      icon: '⚡',
    },
    {
      name: 'Tailwind',
      desc: 'Utility CSS',
      descKo: '유틸리티 CSS',
      href: 'https://github.com/tailwindlabs/tailwindcss',
      icon: '🎐',
    },
  ],
};

export default function Sidebar({
  isOpen,
  isCollapsed,
  isMobile,
  isReady,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  const { locale, localePath, t } = useI18n();
  const location = useLocation();

  const isActive = (href: string) => location.pathname === localePath(href);

  const getSidebarWidth = () => {
    if (isMobile) return 'var(--sidebar-width)';
    return isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';
  };

  const getTransform = () => {
    if (isMobile) return isOpen ? 'translateX(0)' : 'translateX(-100%)';
    return 'translateX(0)';
  };

  return (
    <>
      {/* Overlay (mobile only) */}
      {isMobile && isOpen && (
        <div
          className={`${styles.overlay} ${isReady ? styles.overlayReady : ''}`}
          onClick={onClose}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Escape' && onClose()}
          role="button"
          tabIndex={0}
          aria-label={t('aria.closeSidebar')}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isReady ? styles.sidebarReady : ''}`}
        style={{
          width: getSidebarWidth(),
          transform: getTransform(),
        }}
        data-mobile-open={isMobile && isOpen ? 'true' : undefined}
      >
        {/* Header */}
        <div className={styles.sidebarHeader}>
          {(!isCollapsed || isMobile) && (
            <Link to={localePath('/')} onClick={onClose} className={styles.logo}>
              <span className={styles.logoEmoji}>✨</span>
              <span className={styles.logoText}>Permissive</span>
            </Link>
          )}
          {isCollapsed && !isMobile && (
            <Link to={localePath('/')} className={styles.logoCollapsed}>
              <span className={styles.logoEmoji}>✨</span>
            </Link>
          )}

          {/* Close button (mobile) */}
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              aria-label={t('aria.closeMenu')}
            >
              <svg
                aria-hidden="true"
                className={styles.closeIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {/* Main Navigation */}
          <div className={styles.navSection}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={localePath(item.href)}
                onClick={onClose}
                className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ''}`}
                title={
                  isCollapsed && !isMobile
                    ? locale === 'ko'
                      ? item.labelKo
                      : item.label
                    : undefined
                }
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span className={styles.navItemIcon}>{item.icon}</span>
                {(!isCollapsed || isMobile) && (
                  <span>{locale === 'ko' ? item.labelKo : item.label}</span>
                )}
              </Link>
            ))}
          </div>

          {/* Quick Links - hidden when collapsed */}
          {(!isCollapsed || isMobile) && (
            <>
              {/* Divider */}
              <div className={styles.navDivider} />

              {/* Web API Quick Links */}
              <QuickLinksSection
                title={locale === 'ko' ? '인기 Web API' : 'Popular Web API'}
                links={quickLinks.webApi}
                locale={locale}
              />

              {/* Libraries Quick Links */}
              <QuickLinksSection
                title={locale === 'ko' ? '인기 Libraries' : 'Popular Libraries'}
                links={quickLinks.libraries}
                locale={locale}
              />
            </>
          )}
        </nav>

        {/* Footer - Collapse toggle (desktop) + GitHub */}
        <div className={styles.sidebarFooter}>
          {/* Collapse Toggle Button (desktop only) */}
          {!isMobile && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={styles.collapseButton}
              title={isCollapsed ? t('aria.expandSidebar') : t('aria.collapseSidebar')}
            >
              <svg
                aria-hidden="true"
                className={`${styles.collapseIcon} ${isCollapsed ? styles.collapseIconRotated : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
              {!isCollapsed && <span>{locale === 'ko' ? '접기' : 'Collapse'}</span>}
            </button>
          )}

          {/* GitHub Link */}
          <a
            href="https://github.com/soundbluemusic/public-monorepo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
            title={isCollapsed && !isMobile ? t('ui.github') : undefined}
          >
            <span className={styles.githubIcon}>
              <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </span>
            {(!isCollapsed || isMobile) && (
              <div className={styles.githubInfo}>
                <div className={styles.githubTitle}>{t('ui.github')}</div>
                <div className={styles.githubSubtitle}>{t('ui.viewSource')}</div>
              </div>
            )}
          </a>
        </div>
      </aside>
    </>
  );
}

function QuickLinksSection({
  title,
  links,
  locale,
}: {
  title: string;
  links: readonly QuickLink[];
  locale: Language;
}) {
  return (
    <div>
      <h3 className={styles.quickLinksTitle}>{title}</h3>
      <div className={styles.quickLinksSection}>
        {links.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.quickLink}
          >
            <span className={styles.quickLinkIcon}>{item.icon}</span>
            <div className={styles.quickLinkContent}>
              <div className={styles.quickLinkName}>{item.name}</div>
              <div className={styles.quickLinkDesc}>
                {locale === 'ko' ? item.descKo : item.desc}
              </div>
            </div>
            <svg
              aria-hidden="true"
              className={styles.quickLinkExternal}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
