/**
 * @fileoverview PWA Manifest Generator
 * @environment build-only
 *
 * Generates web app manifest JSON for PWA.
 * Uses Node.js fs - only runs at build time.
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

// ============================================================================
// Types
// ============================================================================

export interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'any' | 'maskable' | 'monochrome';
}

export interface ManifestShortcut {
  name: string;
  short_name?: string;
  description?: string;
  url: string;
  icons?: ManifestIcon[];
}

export interface ManifestConfig {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  background_color: string;
  theme_color: string;
  icons: ManifestIcon[];
  shortcuts?: ManifestShortcut[];
  categories?: string[];
  lang?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  orientation?: 'any' | 'natural' | 'landscape' | 'portrait';
  scope?: string;
  id?: string;
}

/** Web App Manifest JSON structure */
export interface WebAppManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  background_color: string;
  theme_color: string;
  icons: ManifestIcon[];
  shortcuts?: ManifestShortcut[];
  categories?: string[];
  lang?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  orientation?: 'any' | 'natural' | 'landscape' | 'portrait';
  scope?: string;
  id?: string;
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Generate manifest JSON content
 */
export function generateManifestContent(config: ManifestConfig): WebAppManifest {
  const manifest: WebAppManifest = {
    name: config.name,
    short_name: config.short_name,
    description: config.description,
    start_url: config.start_url,
    display: config.display,
    background_color: config.background_color,
    theme_color: config.theme_color,
    icons: config.icons,
  };

  if (config.shortcuts && config.shortcuts.length > 0) {
    manifest.shortcuts = config.shortcuts;
  }

  if (config.categories && config.categories.length > 0) {
    manifest.categories = config.categories;
  }

  if (config.lang) {
    manifest.lang = config.lang;
  }

  if (config.dir) {
    manifest.dir = config.dir;
  }

  if (config.orientation) {
    manifest.orientation = config.orientation;
  }

  if (config.scope) {
    manifest.scope = config.scope;
  }

  if (config.id) {
    manifest.id = config.id;
  }

  return manifest;
}

/**
 * Generate standard icon set for PWA
 */
export function generateStandardIcons(basePath: string, name: string): ManifestIcon[] {
  const sizes = ['72', '96', '128', '144', '152', '192', '384', '512'];

  return [
    ...sizes.map((size) => ({
      src: `${basePath}/${name}-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
    })),
    {
      src: `${basePath}/${name}-maskable-512x512.png`,
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable' as const,
    },
  ];
}

// ============================================================================
// High-Level Generator
// ============================================================================

/**
 * Generate manifest.json file for an app
 */
export function generateManifest(config: ManifestConfig, outputDir: string): void {
  console.log('📱 Generating manifest.json...');

  const manifest = generateManifestContent(config);
  const content = JSON.stringify(manifest, null, 2);

  writeFileSync(join(outputDir, 'manifest.json'), content);

  console.log('✅ manifest.json generated');
}
