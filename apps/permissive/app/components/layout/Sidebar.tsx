import { Link, useLocation } from 'react-router';
import { type Language, useI18n } from '../../i18n';

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
          className={`fixed inset-0 z-overlay ${isReady ? 'transition-opacity duration-200' : ''}`}
          style={{ backgroundColor: 'rgba(15, 23, 22, 0.5)' }}
          onClick={onClose}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Escape' && onClose()}
          role="button"
          tabIndex={0}
          aria-label={t('aria.closeSidebar')}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-sidebar flex flex-col ${isReady ? 'transition-all duration-200 ease-out' : ''}`}
        style={{
          width: getSidebarWidth(),
          transform: getTransform(),
          paddingTop: 'env(safe-area-inset-top, 0)',
          backgroundColor: 'var(--bg-elevated)',
          borderRight: '1px solid var(--border-primary)',
        }}
      >
        {/* Header */}
        <div
          className="h-header flex items-center justify-between px-3 shrink-0"
          style={{ borderBottom: '1px solid var(--border-primary)' }}
        >
          {(!isCollapsed || isMobile) && (
            <Link to={localePath('/')} onClick={onClose} className="flex items-center gap-2.5">
              <span className="text-lg">✨</span>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Permissive
              </span>
            </Link>
          )}
          {isCollapsed && !isMobile && (
            <Link to={localePath('/')} className="flex items-center justify-center w-full">
              <span className="text-lg">✨</span>
            </Link>
          )}

          {/* Close button (mobile) */}
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 -mr-1 rounded-lg hover-bg"
              style={{ color: 'var(--text-secondary)' }}
              aria-label={t('aria.closeMenu')}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
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
        <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={localePath(item.href)}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-(--bg-tertiary) text-(--accent-primary)'
                    : 'text-(--text-secondary) hover:bg-(--bg-secondary)'
                }`}
                title={
                  isCollapsed && !isMobile
                    ? locale === 'ko'
                      ? item.labelKo
                      : item.label
                    : undefined
                }
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span className="text-base shrink-0">{item.icon}</span>
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
              <div style={{ borderTop: '1px solid var(--border-primary)' }} />

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
        <div className="p-2 shrink-0" style={{ borderTop: '1px solid var(--border-primary)' }}>
          {/* Collapse Toggle Button (desktop only) */}
          {!isMobile && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover-bg"
              style={{ color: 'var(--text-secondary)' }}
              title={isCollapsed ? t('aria.expandSidebar') : t('aria.collapseSidebar')}
            >
              <svg
                aria-hidden="true"
                className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover-bg-secondary group"
            title={isCollapsed && !isMobile ? t('ui.github') : undefined}
          >
            <span
              className="w-7 h-7 flex items-center justify-center rounded-md shrink-0"
              style={{ backgroundColor: 'var(--text-primary)' }}
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                style={{ color: 'var(--bg-elevated)' }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </span>
            {(!isCollapsed || isMobile) && (
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {t('ui.github')}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {t('ui.viewSource')}
                </div>
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
      <h3
        className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {title}
      </h3>
      <div className="space-y-0.5">
        {links.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover-bg-secondary group"
          >
            <span
              className="w-7 h-7 flex items-center justify-center rounded-md text-sm group-hover:scale-110 transition-transform shrink-0"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              {item.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.name}
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                {locale === 'ko' ? item.descKo : item.desc}
              </div>
            </div>
            <svg
              aria-hidden="true"
              className="w-3.5 h-3.5 transition-colors shrink-0"
              style={{ color: 'var(--text-tertiary)' }}
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
