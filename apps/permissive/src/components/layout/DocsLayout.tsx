import { type JSX, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';
import BottomNav from './BottomNav';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

interface DocsLayoutProps {
  children: JSX.Element;
}

// Constants
const BREAKPOINT_MD = 768;

export default function DocsLayout(props: DocsLayoutProps) {
  // Mobile sidebar open/close state
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  // Desktop sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(false);
  // Track if we're on mobile (SSR에서는 false로 시작해서 데스크톱 레이아웃으로)
  const [isMobile, setIsMobile] = createSignal(false);
  // 하이드레이션 완료 여부 (transition 활성화용)
  const [isReady, setIsReady] = createSignal(false);

  onMount(() => {
    if (isServer) return;

    // 즉시 화면 크기 확인 (transition 없이)
    const currentIsMobile = window.innerWidth < BREAKPOINT_MD;
    setIsMobile(currentIsMobile);

    // Load collapsed state from localStorage with validation
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true' || saved === 'false') {
      setSidebarCollapsed(saved === 'true');
    }

    // 다음 프레임에서 transition 활성화
    requestAnimationFrame(() => {
      setIsReady(true);
    });

    // 리사이즈 이벤트
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINT_MD);
    };
    window.addEventListener('resize', checkMobile);
    onCleanup(() => window.removeEventListener('resize', checkMobile));
  });

  // Save collapsed state to localStorage
  createEffect(() => {
    if (!isServer) {
      localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed()));
    }
  });

  // Close mobile sidebar on route change or resize to desktop
  createEffect(() => {
    if (!isMobile() && sidebarOpen()) {
      setSidebarOpen(false);
    }
  });

  // Toggle functions
  const toggleSidebarOpen = () => setSidebarOpen(!sidebarOpen());
  const toggleSidebarCollapsed = () => setSidebarCollapsed(!sidebarCollapsed());
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div class="min-h-screen" style={{ 'background-color': 'var(--bg-primary)' }}>
      {/* Skip to content - Accessibility */}
      <a href="#main-content" class="skip-to-content">
        Skip to content
      </a>

      {/* Header */}
      <Header onMenuClick={toggleSidebarOpen} isSidebarOpen={sidebarOpen()} />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen()}
        isCollapsed={sidebarCollapsed()}
        isMobile={isMobile()}
        isReady={isReady()}
        onClose={closeSidebar}
        onToggleCollapse={toggleSidebarCollapsed}
      />

      {/* Main Content */}
      <main
        id="main-content"
        class={`pt-header min-h-screen ${isReady() ? 'transition-[margin] duration-200' : ''}`}
        style={{
          'margin-left': isMobile()
            ? '0'
            : sidebarCollapsed()
              ? 'var(--sidebar-collapsed-width)'
              : 'var(--sidebar-width)',
          'padding-bottom': isMobile() ? 'var(--bottom-nav-height)' : '0',
        }}
      >
        <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">{props.children}</div>

        {/* Footer */}
        <Footer />
      </main>

      {/* Bottom Navigation (mobile only) */}
      <BottomNav />
    </div>
  );
}
