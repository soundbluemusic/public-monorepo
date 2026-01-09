import { useSettingsStore } from '@soundblue/features/settings';
import { cn } from '@soundblue/ui/utils';
import { ArrowUp, ChevronRight } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useI18n } from '@/i18n';
import { BottomNav } from '../navigation/BottomNav';
import { Sidebar } from '../navigation/Sidebar';
import { Footer } from './Footer';
import { Header } from './Header';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface LayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function Layout({ children, breadcrumbs }: LayoutProps) {
  const { t, localePath } = useI18n();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed, toggleSidebarCollapse } = useSettingsStore();

  // Sync sidebar state with inline script's custom events
  useEffect(() => {
    const handleMobileSidebarToggle = (e: CustomEvent<{ isOpen: boolean }>) => {
      setSidebarOpen(e.detail.isOpen);
    };
    const handleSidebarCollapseChange = (e: CustomEvent<{ collapsed: boolean }>) => {
      // Sync Zustand state with inline script's localStorage update
      const { setSidebarCollapsed } = useSettingsStore.getState();
      setSidebarCollapsed(e.detail.collapsed);
    };

    window.addEventListener('mobile-sidebar-toggle', handleMobileSidebarToggle as EventListener);
    window.addEventListener(
      'sidebar-collapse-change',
      handleSidebarCollapseChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        'mobile-sidebar-toggle',
        handleMobileSidebarToggle as EventListener,
      );
      window.removeEventListener(
        'sidebar-collapse-change',
        handleSidebarCollapseChange as EventListener,
      );
    };
  }, []);

  // 스크롤 이벤트 throttling (requestAnimationFrame 사용)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowBackToTop(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-primary)">
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">
        {t('skipToContent')}
      </a>

      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} sidebarCollapsed={sidebarCollapsed} />

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
          'flex-1 w-full px-4 py-6 pb-20 md:pb-6',
          'pt-(--header-height)',
          // Desktop: offset for fixed sidebar (collapsed: 56px + 1rem, expanded: 18rem + 1rem)
          sidebarCollapsed
            ? 'md:pl-[calc(var(--sidebar-collapsed-width)+1rem)]'
            : 'md:pl-[calc(var(--sidebar-width)+1rem)]',
          'md:pr-4',
          'max-w-[calc(48rem+18rem+2rem)] mx-auto',
          'transition-[padding] duration-200',
        )}
      >
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
        <div className="max-w-3xl">{children}</div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />

      {/* Back to Top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-8 right-4 z-30 min-h-11 min-w-11 flex items-center justify-center rounded-full shadow-md bg-(--bg-elevated) border border-(--border-primary) text-(--text-secondary) cursor-pointer transition-all hover:bg-(--bg-tertiary) focus:outline-2 focus:outline-(--accent-primary) focus:outline-offset-2"
          aria-label={t('backToTop')}
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
