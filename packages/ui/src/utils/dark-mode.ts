/**
 * @fileoverview Dark Mode Scripts for SSG Apps
 * @environment universal
 *
 * These scripts are designed to be inlined in the HTML to prevent
 * flash of unstyled content (FOUC) during page load.
 *
 * @remarks
 * The scripts must be inlined because:
 * 1. They need to run before React hydrates
 * 2. They prevent the flash of wrong theme
 * 3. SSG apps have no server to handle this
 *
 * ## FOUC Prevention Architecture
 *
 * To prevent FOUC, the following order MUST be maintained in <head>:
 * 1. Critical theme CSS (inline <style>) - defines CSS variables for :root and .dark
 * 2. DARK_MODE_INIT_SCRIPT (inline <script>) - adds .dark class based on preference
 * 3. External CSS files (<link>) - full styles that use the CSS variables
 *
 * Each app has its own theme colors, so Critical CSS must be defined per-app.
 */

/**
 * SVG icon for sun (light mode indicator)
 * Matches lucide-react Sun icon
 */
export const SUN_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;

/**
 * SVG icon for moon (dark mode indicator)
 * Matches lucide-react Moon icon
 */
export const MOON_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;

/**
 * Script to prevent dark mode flash on page load.
 * Should be placed in <head> before any styles.
 *
 * Reads theme from localStorage and applies 'dark' class immediately.
 */
export const DARK_MODE_INIT_SCRIPT = `(function() {
  try {
    var stored = localStorage.getItem('settings-storage');
    if (stored) {
      var parsed = JSON.parse(stored);
      var theme = parsed.state?.theme;
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    console.error('[Theme] Failed to load theme preference:', e);
  }
})();`;

/**
 * Script to handle dark mode toggle button clicks.
 * Should be placed at end of <body>.
 *
 * Uses event delegation with capture phase to intercept clicks
 * before React's event system.
 */
export const DARK_MODE_TOGGLE_SCRIPT = `(function() {
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('button[aria-label*="mode" i]');
    if (!btn) return;

    var html = document.documentElement;
    var willBeDark = !html.classList.contains('dark');

    if (willBeDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    var newTheme = willBeDark ? 'dark' : 'light';
    try {
      var currentStored = localStorage.getItem('settings-storage');
      var newState = currentStored ? JSON.parse(currentStored) : { state: { theme: 'light' }, version: 0 };
      newState.state.theme = newTheme;
      localStorage.setItem('settings-storage', JSON.stringify(newState));
    } catch(err) {
      console.error('[Theme] Failed to save theme preference:', err);
    }

    // innerHTML 교체 제거: React 컴포넌트가 MutationObserver로 아이콘을 업데이트함
    // DOM을 직접 수정하면 React와 충돌하여 에러 발생
    btn.setAttribute('aria-label', willBeDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title', willBeDark ? 'Light mode' : 'Dark mode');
  }, true);
})();`;

// ============================================================================
// Sidebar Collapse Script
// ============================================================================

/**
 * SVG icon for panel left close (sidebar expanded indicator)
 * Matches lucide-react PanelLeftClose icon
 */
export const PANEL_LEFT_CLOSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path><path d="m16 15-3-3 3-3"></path></svg>`;

/**
 * SVG icon for panel left open (sidebar collapsed indicator)
 * Matches lucide-react PanelLeftOpen icon
 */
export const PANEL_LEFT_OPEN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path><path d="m14 9 3 3-3 3"></path></svg>`;

/**
 * Script to handle sidebar collapse button clicks.
 * Should be placed at end of <body>.
 *
 * Updates CSS classes and localStorage only.
 * React components handle their own rendering via Zustand state.
 * NO DOM manipulation of React-managed elements (svg, span, etc.)
 */
export const SIDEBAR_COLLAPSE_SCRIPT = `(function() {
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('button[aria-label*="sidebar" i]');
    if (!btn) return;

    var html = document.documentElement;
    var sidebar = document.querySelector('aside[aria-label]');
    if (!sidebar) return;

    var isCurrentlyCollapsed = html.classList.contains('sidebar-collapsed');
    var willBeCollapsed = !isCurrentlyCollapsed;

    // Update html class (for global CSS only)
    if (willBeCollapsed) {
      html.classList.add('sidebar-collapsed');
      sidebar.setAttribute('data-collapsed', 'true');
    } else {
      html.classList.remove('sidebar-collapsed');
      sidebar.removeAttribute('data-collapsed');
    }

    // Update localStorage (Zustand will sync on next render)
    try {
      var currentStored = localStorage.getItem('settings-storage');
      var newState = currentStored ? JSON.parse(currentStored) : { state: { sidebarCollapsed: false }, version: 0 };
      newState.state.sidebarCollapsed = willBeCollapsed;
      localStorage.setItem('settings-storage', JSON.stringify(newState));
    } catch(err) {
      console.error('[Sidebar] Failed to save sidebar preference:', err);
    }

    // DO NOT modify React-managed DOM elements (svg, span, button text)
    // React components will re-render based on Zustand state

    // Dispatch custom event for React components to sync immediately
    window.dispatchEvent(new CustomEvent('sidebar-collapse-change', {
      detail: { collapsed: willBeCollapsed }
    }));
  }, true);
})();`;

// ============================================================================
// Mobile Sidebar Toggle Script
// ============================================================================

/**
 * Script to handle mobile sidebar toggle button clicks.
 * Should be placed at end of <body>.
 *
 * Uses event delegation with capture phase to intercept clicks
 * before React's event system. Toggles the sidebar visibility
 * by adding/removing translate-x-0 class.
 */
export const MOBILE_SIDEBAR_TOGGLE_SCRIPT = `(function() {
  document.addEventListener('click', function(e) {
    // Check for menu button click (aria-label contains "Menu" or "메뉴")
    var menuBtn = e.target.closest('button[aria-label*="Menu" i], button[aria-label*="menu" i], button[aria-label*="메뉴"]');

    // Check for backdrop click to close
    var backdrop = e.target.closest('.fixed.bg-black\\\\/50, [data-sidebar-backdrop]');

    // Check for sidebar close button
    var closeBtn = e.target.closest('aside button[aria-label*="close" i], aside button[aria-label*="닫기"]');

    var sidebar = document.querySelector('aside[aria-label], aside[data-mobile-open]');
    if (!sidebar) return;

    if (menuBtn) {
      // Check which pattern this sidebar uses
      var usesTranslate = sidebar.classList.contains('translate-x-0') || sidebar.classList.contains('-translate-x-full');
      var usesDataAttr = sidebar.hasAttribute('data-mobile-open');
      var willBeOpen = false;

      if (usesTranslate) {
        // Pattern A: translate-x classes (Context app)
        var isOpen = sidebar.classList.contains('translate-x-0');
        willBeOpen = !isOpen;
        if (isOpen) {
          sidebar.classList.remove('translate-x-0');
          sidebar.classList.add('-translate-x-full');
        } else {
          sidebar.classList.add('translate-x-0');
          sidebar.classList.remove('-translate-x-full');
        }
      } else if (usesDataAttr || true) {
        // Pattern B: data-mobile-open attribute (Permissive app)
        var isOpen = sidebar.getAttribute('data-mobile-open') === 'true';
        willBeOpen = !isOpen;
        sidebar.setAttribute('data-mobile-open', willBeOpen ? 'true' : 'false');
        sidebar.setAttribute('aria-hidden', willBeOpen ? 'false' : 'true');
      }

      // Show/hide backdrop for Pattern A
      if (usesTranslate) {
        var existingBackdrop = document.querySelector('[data-sidebar-backdrop]');
        if (willBeOpen) {
          if (!existingBackdrop) {
            var newBackdrop = document.createElement('div');
            newBackdrop.setAttribute('data-sidebar-backdrop', '');
            newBackdrop.className = 'fixed inset-0 bg-black/50 z-40 md:hidden';
            document.body.appendChild(newBackdrop);
          }
        } else if (existingBackdrop) {
          existingBackdrop.remove();
        }
      }

      // Dispatch custom event for React components to sync
      window.dispatchEvent(new CustomEvent('mobile-sidebar-toggle', {
        detail: { isOpen: willBeOpen }
      }));
      return;
    }

    if (backdrop || closeBtn) {
      // Close sidebar - handle both patterns
      if (sidebar.classList.contains('translate-x-0')) {
        sidebar.classList.remove('translate-x-0');
        sidebar.classList.add('-translate-x-full');
      }
      if (sidebar.hasAttribute('data-mobile-open')) {
        sidebar.setAttribute('data-mobile-open', 'false');
        sidebar.setAttribute('aria-hidden', 'true');
      }

      // Remove backdrop
      var backdropEl = document.querySelector('[data-sidebar-backdrop]');
      if (backdropEl) backdropEl.remove();

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('mobile-sidebar-toggle', {
        detail: { isOpen: false }
      }));
    }
  }, true);
})();`;

// ============================================================================
// Option B: CSS mask-image approach
// ============================================================================

/**
 * Data URL for sun icon (for use in CSS mask-image)
 */
const SUN_ICON_DATA_URL = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>')}`;

/**
 * Data URL for moon icon (for use in CSS mask-image)
 */
const MOON_ICON_DATA_URL = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>')}`;

/**
 * CSS styles for mask-image based icon switching.
 */
export const DARK_MODE_ICONS_CSS = `
.dark-mode-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: currentColor;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}
.dark-mode-icon--sun {
  -webkit-mask-image: url("${SUN_ICON_DATA_URL}");
  mask-image: url("${SUN_ICON_DATA_URL}");
}
.dark-mode-icon--moon {
  -webkit-mask-image: url("${MOON_ICON_DATA_URL}");
  mask-image: url("${MOON_ICON_DATA_URL}");
}
`;

/**
 * Toggle script for CSS mask-image approach.
 */
export const DARK_MODE_TOGGLE_SCRIPT_CSS = `(function() {
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('button[aria-label*="mode" i]');
    if (!btn) return;

    var html = document.documentElement;
    var willBeDark = !html.classList.contains('dark');

    if (willBeDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    var newTheme = willBeDark ? 'dark' : 'light';
    try {
      var currentStored = localStorage.getItem('settings-storage');
      var newState = currentStored ? JSON.parse(currentStored) : { state: { theme: 'light' }, version: 0 };
      newState.state.theme = newTheme;
      localStorage.setItem('settings-storage', JSON.stringify(newState));
    } catch(err) {
      console.error('[Theme] Failed to save theme preference:', err);
    }

    var icon = btn.querySelector('.dark-mode-icon');
    if (icon) {
      icon.classList.toggle('dark-mode-icon--sun', willBeDark);
      icon.classList.toggle('dark-mode-icon--moon', !willBeDark);
    }
    btn.setAttribute('aria-label', willBeDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title', willBeDark ? 'Light mode' : 'Dark mode');
  }, true);
})();`;

// ============================================================================
// Option C: Dual icons with CSS visibility toggle
// ============================================================================

/**
 * CSS for dual-icon approach where both icons are rendered
 * and visibility is toggled via CSS based on .dark class.
 */
export const DARK_MODE_DUAL_ICONS_CSS = `
.theme-icon--moon { display: none; }
.theme-icon--sun { display: inline-flex; }
.dark .theme-icon--moon { display: inline-flex; }
.dark .theme-icon--sun { display: none; }
`;

/**
 * Toggle script for dual-icon approach.
 */
export const DARK_MODE_TOGGLE_SCRIPT_DUAL = `(function() {
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('button[aria-label*="mode" i]');
    if (!btn) return;

    var html = document.documentElement;
    var willBeDark = !html.classList.contains('dark');

    if (willBeDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    var newTheme = willBeDark ? 'dark' : 'light';
    try {
      var currentStored = localStorage.getItem('settings-storage');
      var newState = currentStored ? JSON.parse(currentStored) : { state: { theme: 'light' }, version: 0 };
      newState.state.theme = newTheme;
      localStorage.setItem('settings-storage', JSON.stringify(newState));
    } catch(err) {
      console.error('[Theme] Failed to save theme preference:', err);
    }

    btn.setAttribute('aria-label', willBeDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title', willBeDark ? 'Light mode' : 'Dark mode');
  }, true);
})();`;
