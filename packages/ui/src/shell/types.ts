/**
 * @fileoverview RootShell Types
 * @environment universal
 *
 * Types for creating root shell components.
 */

/**
 * Theme colors for critical CSS
 */
export interface ThemeColors {
  light: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    bgElevated: string;
    textPrimary: string;
    textSecondary: string;
  };
  dark: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    bgElevated: string;
    textPrimary: string;
    textSecondary: string;
  };
}

/**
 * Site verification codes for search engines
 */
export interface SiteVerification {
  naver?: string;
  google?: string;
  bing?: string;
}

/**
 * Navigation item for structured data
 */
export interface NavigationItem {
  name: string;
  path: string;
}

/**
 * Configuration for RootShell
 */
export interface RootShellConfig {
  /** App name for structured data */
  appName: string;
  /** Base URL (e.g., 'https://context.soundbluemusic.com') */
  baseUrl: string;
  /** Theme color for meta tag */
  themeColor: string;
  /** Theme colors for critical CSS */
  themeColors: ThemeColors;
  /** Site description for structured data */
  description: string;
  /** Supported languages */
  languages: string[];
  /** Search action URL template (use {search_term} placeholder) */
  searchUrlTemplate?: string;
  /** Main navigation items for structured data */
  navigationItems: NavigationItem[];
  /** Site verification codes */
  siteVerification?: SiteVerification;
  /** Feature flags */
  features?: {
    /** Enable mobile sidebar toggle script */
    mobileSidebarToggle?: boolean;
  };
}

/**
 * Meta tag configuration from head()
 */
export interface HeadMeta {
  charSet?: string;
  name?: string;
  content?: string;
  title?: string;
}

/**
 * Link configuration from head()
 */
export interface HeadLink {
  rel: string;
  href: string;
  type?: string;
}
