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
  var sunIcon = '${SUN_ICON_SVG}';
  var moonIcon = '${MOON_ICON_SVG}';

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

    btn.innerHTML = willBeDark ? sunIcon : moonIcon;
    btn.setAttribute('aria-label', willBeDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title', willBeDark ? 'Light mode' : 'Dark mode');
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
