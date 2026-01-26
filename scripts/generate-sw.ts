/**
 * Service Worker Generator
 *
 * Generates a service worker using workbox-build for SSR apps.
 * This is used instead of VitePWA because VitePWA doesn't work well with SSR frameworks.
 *
 * Usage: tsx scripts/generate-sw.ts <app-name>
 * Example: tsx scripts/generate-sw.ts permissive
 */

import path from 'node:path';
import { generateSW } from 'workbox-build';

const appName = process.argv[2];

if (!appName) {
  console.error('Usage: tsx scripts/generate-sw.ts <app-name>');
  console.error('Example: tsx scripts/generate-sw.ts permissive');
  process.exit(1);
}

// 스크립트는 앱 디렉토리(apps/<app-name>/)에서 실행됨
// 또는 루트에서 실행될 수 있으므로 두 경우 모두 처리
const cwd = process.cwd();
const isRunFromApp = cwd.includes(`apps/${appName}`) || cwd.endsWith(appName);
const appDir = isRunFromApp ? cwd : path.resolve(cwd, 'apps', appName);
const distDir = path.join(appDir, 'dist', 'client');

async function generateServiceWorker(): Promise<void> {
  console.log(`\n🔧 Generating Service Worker for ${appName}...`);

  try {
    const { count, size, warnings } = await generateSW({
      globDirectory: distDir,
      globPatterns: ['**/*.{js,css,ico,svg,woff2,png,jpg,jpeg,webp}'],
      globIgnores: ['**/sw.js', '**/workbox-*.js', '**/sitemap*.xml', '**/*.map'],
      swDest: path.join(distDir, 'sw.js'),
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      // SSR 앱이므로 navigateFallback 불필요
      navigationPreload: false,
      runtimeCaching: [
        {
          // Google Fonts stylesheets
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-stylesheets',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
        {
          // Google Fonts webfonts
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
        {
          // Images
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          // Static resources (JS, CSS)
          urlPattern: /\.(?:js|css)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
            },
          },
        },
      ],
    });

    if (warnings.length > 0) {
      console.warn('⚠️  Warnings:');
      for (const warning of warnings) {
        console.warn(`   ${warning}`);
      }
    }

    console.log(`✅ Service Worker generated: ${count} files, ${(size / 1024).toFixed(1)} KB`);
    console.log(`   → ${path.join(distDir, 'sw.js')}`);
  } catch (error) {
    console.error('❌ Failed to generate Service Worker:', error);
    process.exit(1);
  }
}

generateServiceWorker();
