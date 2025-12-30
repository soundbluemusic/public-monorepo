import { cn } from '@soundblue/ui/utils';
import { useLocation } from 'react-router';
import { useI18n } from '../../i18n';
import {
  navItems,
  QuickLinksSection,
  quickLinks,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
} from './sidebar';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  isReady: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

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

  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <button
          type="button"
          className={cn(
            'fixed inset-0 z-40 bg-black/50 transition-opacity cursor-pointer',
            'lg:hidden',
            isReady ? 'opacity-100' : 'opacity-0',
          )}
          onClick={onClose}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Escape' && onClose()}
          aria-label={t('aria.closeSidebar')}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] flex flex-col',
          'bg-(--bg-primary) border-r border-(--border-primary) transition-all duration-200',
          'w-(--sidebar-width)',
          !isCollapsed && 'lg:w-(--sidebar-width)',
          isCollapsed && 'lg:w-(--sidebar-collapsed-width)',
          isReady && 'ready',
        )}
        data-mobile-open={isOpen ? 'true' : undefined}
        data-collapsed={isCollapsed ? 'true' : undefined}
        aria-hidden={isMobile && !isOpen}
      >
        <SidebarHeader localePath={localePath} isCollapsed={isCollapsed} t={t} onClose={onClose} />

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto p-2">
          <SidebarNav
            navItems={navItems}
            locale={locale}
            localePath={localePath}
            isActive={isActive}
            isCollapsed={isCollapsed}
            onClose={onClose}
          />

          {/* Quick Links - hidden when collapsed */}
          <div className={cn(isCollapsed && 'lg:hidden')}>
            <div className="my-4 border-t border-(--border-primary)" />

            <QuickLinksSection
              title={locale === 'ko' ? '인기 Web API' : 'Popular Web API'}
              links={quickLinks.webApi}
              locale={locale}
            />

            <QuickLinksSection
              title={locale === 'ko' ? '인기 Libraries' : 'Popular Libraries'}
              links={quickLinks.libraries}
              locale={locale}
            />
          </div>
        </nav>

        <SidebarFooter
          locale={locale}
          isCollapsed={isCollapsed}
          t={t}
          onToggleCollapse={onToggleCollapse}
        />
      </aside>
    </>
  );
}
