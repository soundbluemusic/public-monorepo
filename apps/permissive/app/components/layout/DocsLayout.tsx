import { useIsMobile, useSettingsStore } from '@soundblue/shared-react';
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
  const { sidebarCollapsed, setSidebarCollapsed } = useSettingsStore();
  const isMobile = useIsMobile();
  const [isReady, setIsReady] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsReady(true);
    });
  }, []);

  // Close mobile sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isMobile, sidebarOpen]);

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebarOpen = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapsed = () => setSidebarCollapsed(!sidebarCollapsed);
  const closeSidebar = () => setSidebarOpen(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Skip to content - Accessibility */}
      <a href="#main-content" className="skip-to-content">
        {t('ui.skipToContent')}
      </a>

      {/* Header */}
      <Header onMenuClick={toggleSidebarOpen} isSidebarOpen={sidebarOpen} />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        isReady={isReady}
        onClose={closeSidebar}
        onToggleCollapse={toggleSidebarCollapsed}
      />

      {/* Main Content */}
      <main
        id="main-content"
        className={`pt-header min-h-screen ${isReady ? 'transition-[margin] duration-200' : ''}`}
        style={{
          marginLeft: isMobile
            ? '0'
            : sidebarCollapsed
              ? 'var(--sidebar-collapsed-width)'
              : 'var(--sidebar-width)',
          paddingBottom: isMobile ? 'var(--bottom-nav-height)' : '0',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">{children}</div>

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
          className="fixed bottom-20 md:bottom-8 right-4 z-30 min-h-11 min-w-11 flex items-center justify-center rounded-full shadow-lg transition-all"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-secondary)',
          }}
          aria-label={locale === 'ko' ? '맨 위로' : 'Back to top'}
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
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
