import { useIsMobile, useSettingsStore } from '@soundblue/shared-react';
import { type ReactNode, useEffect, useState } from 'react';
import { useI18n } from '../../i18n';
import BottomNav from './BottomNav';
import styles from './DocsLayout.module.scss';
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
    <div className={styles.container}>
      {/* Skip to content - Accessibility */}
      <a href="#main-content" className={styles.skipToContent}>
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
        className={`${styles.main} ${isReady ? styles.mainReady : ''}`}
        style={{
          marginLeft: isMobile
            ? '0'
            : sidebarCollapsed
              ? 'var(--sidebar-collapsed-width)'
              : 'var(--sidebar-width)',
          paddingBottom: isMobile ? 'var(--bottom-nav-height)' : '0',
        }}
      >
        <div className={styles.contentWrapper}>{children}</div>

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
          className={styles.backToTop}
          aria-label={locale === 'ko' ? '맨 위로' : 'Back to top'}
        >
          <svg
            aria-hidden="true"
            className={styles.backToTopIcon}
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
