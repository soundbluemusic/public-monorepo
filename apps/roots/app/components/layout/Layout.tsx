import { useSettingsStore } from '@soundblue/features/settings';
import { cn } from '@soundblue/ui/utils';
import { Link } from '@tanstack/react-router';
import { ArrowUp, ChevronRight } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

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

  // Back to top visibility with RAF throttling
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        setShowBackToTop(window.scrollY > 300);
        rafIdRef.current = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
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
          'flex-1 w-full px-4 py-8 pb-20 lg:pb-8',
          'pt-(--header-height)',
          sidebarCollapsed
            ? 'lg:pl-[calc(var(--sidebar-collapsed-width)+1rem)]'
            : 'lg:pl-[calc(var(--sidebar-width)+1rem)]',
          'lg:pr-4',
          'transition-[padding] duration-200',
        )}
      >
        <div className="max-w-4xl">
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
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-20 lg:bottom-8 right-4 z-20 min-h-11 min-w-11 flex items-center justify-center rounded-full shadow-md transition-colors bg-(--bg-elevated) border border-(--border-primary) text-(--text-secondary) cursor-pointer hover:bg-(--bg-tertiary)"
          aria-label={t('backToTop')}
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      )}

      {/* Footer */}
      <Footer sidebarCollapsed={sidebarCollapsed} />
    </div>
  );
}
