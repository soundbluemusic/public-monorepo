import { JSX, createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

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
  // Track if we're on mobile
  const [isMobile, setIsMobile] = createSignal(true);

  onMount(() => {
    if (isServer) return;

    // Check initial screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINT_MD);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    onCleanup(() => window.removeEventListener("resize", checkMobile));

    // Load collapsed state from localStorage
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      setSidebarCollapsed(true);
    }
  });

  // Save collapsed state to localStorage
  createEffect(() => {
    if (!isServer) {
      localStorage.setItem("sidebar-collapsed", String(sidebarCollapsed()));
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
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Skip to content - Accessibility */}
      <a href="#main-content" class="skip-to-content">
        Skip to content
      </a>

      {/* Header */}
      <Header
        onMenuClick={toggleSidebarOpen}
        isSidebarOpen={sidebarOpen()}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen()}
        isCollapsed={sidebarCollapsed()}
        isMobile={isMobile()}
        onClose={closeSidebar}
        onToggleCollapse={toggleSidebarCollapsed}
      />

      {/* Main Content */}
      <main
        id="main-content"
        class="pt-header min-h-screen transition-[margin] duration-200"
        style={{
          "margin-left": isMobile()
            ? "0"
            : sidebarCollapsed()
              ? "var(--sidebar-collapsed-width)"
              : "var(--sidebar-width)",
          "padding-bottom": isMobile() ? "var(--bottom-nav-height)" : "0"
        }}
      >
        <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {props.children}
        </div>

        {/* Footer */}
        <Footer />
      </main>

      {/* Bottom Navigation (mobile only) */}
      <BottomNav />
    </div>
  );
}
