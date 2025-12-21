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
  const { t } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed, setSidebarCollapsed } = useSettingsStore();
  const isMobile = useIsMobile();
  const [isReady, setIsReady] = useState(false);

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

  const toggleSidebarOpen = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapsed = () => setSidebarCollapsed(!sidebarCollapsed);
  const closeSidebar = () => setSidebarOpen(false);

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
    </div>
  );
}
