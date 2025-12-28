import { cn } from '@soundblue/shared-react';
import {
  Atom,
  ChevronLeft,
  ExternalLink,
  Github,
  Globe,
  HardDrive,
  Home,
  Package,
  Palette,
  Plug,
  Sparkles,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';
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
  icon: ReactNode;
}

interface QuickLink {
  name: string;
  desc: string;
  descKo: string;
  href: string;
  icon: ReactNode;
}

const navItems: readonly NavItem[] = [
  { href: '/', label: 'Home', labelKo: '홈', icon: <Home size={18} aria-hidden="true" /> },
  {
    href: '/web-api',
    label: 'Web API',
    labelKo: 'Web API',
    icon: <Globe size={18} aria-hidden="true" />,
  },
  {
    href: '/libraries',
    label: 'Libraries',
    labelKo: 'Libraries',
    icon: <Package size={18} aria-hidden="true" />,
  },
];

const quickLinks = {
  webApi: [
    {
      name: 'Fetch API',
      desc: 'HTTP requests',
      descKo: 'HTTP 요청',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
      icon: <Globe size={16} aria-hidden="true" />,
    },
    {
      name: 'localStorage',
      desc: 'Persistent storage',
      descKo: '영구 저장소',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
      icon: <HardDrive size={16} aria-hidden="true" />,
    },
    {
      name: 'WebSocket',
      desc: 'Real-time',
      descKo: '실시간 통신',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket',
      icon: <Plug size={16} aria-hidden="true" />,
    },
    {
      name: 'Canvas',
      desc: '2D graphics',
      descKo: '2D 그래픽',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
      icon: <Palette size={16} aria-hidden="true" />,
    },
  ],
  libraries: [
    {
      name: 'React',
      desc: 'UI library',
      descKo: 'UI 라이브러리',
      href: 'https://github.com/facebook/react',
      icon: <Atom size={16} aria-hidden="true" />,
    },
    {
      name: 'Vue',
      desc: 'Progressive',
      descKo: '프로그레시브',
      href: 'https://github.com/vuejs/core',
      icon: <Sparkles size={16} aria-hidden="true" />,
    },
    {
      name: 'Vite',
      desc: 'Build tool',
      descKo: '빌드 도구',
      href: 'https://github.com/vitejs/vite',
      icon: <Zap size={16} aria-hidden="true" />,
    },
    {
      name: 'Tailwind',
      desc: 'Utility CSS',
      descKo: '유틸리티 CSS',
      href: 'https://github.com/tailwindlabs/tailwindcss',
      icon: <Wind size={16} aria-hidden="true" />,
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
          className={cn(
            'fixed inset-0 z-40 bg-black/50 transition-opacity',
            isReady ? 'opacity-100' : 'opacity-0',
          )}
          onClick={onClose}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Escape' && onClose()}
          role="button"
          tabIndex={0}
          aria-label={t('aria.closeSidebar')}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] flex flex-col bg-(--bg-primary) border-r border-(--border-primary) transition-all duration-200',
          isReady && 'ready',
          isMobile && 'z-50',
          isMobile && !isOpen && 'invisible',
        )}
        style={{
          width: getSidebarWidth(),
          transform: getTransform(),
        }}
        aria-hidden={isMobile && !isOpen}
        data-mobile-open={isMobile && isOpen ? 'true' : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-(--border-primary)">
          {(!isCollapsed || isMobile) && (
            <Link
              to={localePath('/')}
              onClick={onClose}
              className="flex items-center gap-2 text-(--text-primary) font-semibold no-underline"
            >
              <Sparkles size={20} aria-hidden="true" className="text-(--accent-primary)" />
              <span>Permissive</span>
            </Link>
          )}
          {isCollapsed && !isMobile && (
            <Link
              to={localePath('/')}
              className="flex items-center justify-center w-full text-(--accent-primary)"
            >
              <Sparkles size={20} aria-hidden="true" />
            </Link>
          )}

          {/* Close button (mobile) */}
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 min-w-11 flex items-center justify-center rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) cursor-pointer"
              aria-label={t('aria.closeMenu')}
            >
              <X size={20} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={localePath(item.href)}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 min-h-11 px-3 py-2 rounded-lg no-underline transition-colors',
                  isActive(item.href)
                    ? 'bg-(--accent-primary)/10 text-(--accent-primary)'
                    : 'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                  isCollapsed && !isMobile && 'justify-center',
                )}
                title={
                  isCollapsed && !isMobile
                    ? locale === 'ko'
                      ? item.labelKo
                      : item.label
                    : undefined
                }
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
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
              <div className="my-4 border-t border-(--border-primary)" />

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
        <div className="p-2 border-t border-(--border-primary)">
          {/* Collapse Toggle Button (desktop only) */}
          {!isMobile && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={cn(
                'w-full flex items-center gap-2 min-h-11 px-3 py-2 rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer',
                isCollapsed && 'justify-center',
              )}
              title={isCollapsed ? t('aria.expandSidebar') : t('aria.collapseSidebar')}
            >
              <ChevronLeft
                size={18}
                aria-hidden="true"
                className={cn('transition-transform', isCollapsed && 'rotate-180')}
              />
              {!isCollapsed && <span>{locale === 'ko' ? '접기' : 'Collapse'}</span>}
            </button>
          )}

          {/* GitHub Link */}
          <a
            href="https://github.com/soundbluemusic/public-monorepo"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-3 min-h-11 px-3 py-2 rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors no-underline',
              isCollapsed && !isMobile && 'justify-center',
            )}
            title={isCollapsed && !isMobile ? t('ui.github') : undefined}
          >
            <Github size={18} aria-hidden="true" />
            {(!isCollapsed || isMobile) && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{t('ui.github')}</span>
                <span className="text-xs text-(--text-tertiary)">{t('ui.viewSource')}</span>
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
    <div className="mb-4">
      <h3 className="px-3 py-2 text-xs font-semibold text-(--text-tertiary) uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {links.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 min-h-11 px-3 py-2 rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors no-underline group"
          >
            <span className="flex-shrink-0 text-(--text-tertiary)">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-(--text-primary)">{item.name}</div>
              <div className="text-xs text-(--text-tertiary)">
                {locale === 'ko' ? item.descKo : item.desc}
              </div>
            </div>
            <ExternalLink
              size={14}
              aria-hidden="true"
              className="flex-shrink-0 text-(--text-tertiary) opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
