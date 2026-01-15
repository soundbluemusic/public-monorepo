import { useSettingsStore } from '@soundblue/features/settings';
import { cn } from '@soundblue/ui/utils';
import { ArrowUp } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { useI18n } from '../../i18n';
import BottomNav from './BottomNav';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

interface DocsLayoutProps {
  children: ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const { t, locale } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed, toggleSidebarCollapse } = useSettingsStore();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Back to top visibility with RAF throttling
  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setShowBackToTop(window.scrollY > 300);
        rafId = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleSidebarOpen = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-(--bg-primary)">
      {/* Skip to content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-(--accent-primary) focus:text-white focus:rounded-lg"
      >
        {t('ui.skipToContent')}
      </a>

      {/* Header */}
      <Header onMenuClick={toggleSidebarOpen} isSidebarOpen={sidebarOpen} />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={closeSidebar}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content */}
      <main
        id="main-content"
        data-sidebar-collapsed={sidebarCollapsed ? 'true' : undefined}
        className={cn(
          'pt-14 min-h-screen transition-[margin] duration-200',
          // Desktop (lg): offset for fixed sidebar
          sidebarCollapsed
            ? 'lg:pl-[calc(var(--sidebar-collapsed-width)+1rem)]'
            : 'lg:pl-[calc(var(--sidebar-width)+1rem)]',
          'pb-16 lg:pb-0',
        )}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">{children}</div>

        {/* Footer */}
        <Footer />
      </main>

      {/* Bottom Navigation (mobile only) */}
      <BottomNav />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-24 lg:bottom-8 right-4 z-20 min-h-11 min-w-11 flex items-center justify-center rounded-full shadow-md transition-colors bg-(--bg-elevated) border border-(--border-primary) text-(--text-secondary) cursor-pointer hover:bg-(--bg-tertiary)"
          aria-label={locale === 'ko' ? '맨 위로' : 'Back to top'}
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
