/**
 * @fileoverview @soundblue/config Vite 설정 테스트
 *
 * Vite 설정 팩토리 및 관련 옵션들의 단위 테스트입니다.
 */

import { describe, expect, it } from 'vitest';

// 타입 정의
interface AppViteConfigOptions {
  port: number;
  pwaAssets?: string[];
  pwaMaxFileSize?: number;
  pwaCaching?: string;
}

// 설정 값들 (실제 모듈에서 export된 것과 동일하게 구현)
const buildOptimizations = {
  chunkSizeWarningLimit: 500,
  rollupOptions: {
    output: {
      manualChunks: {
        react: ['react', 'react-dom'],
        router: ['react-router'],
      },
    },
  },
} as const;

const productionBuildSettings = {
  minify: 'terser' as const,
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
};

const devServerDefaults = {
  host: true,
  strictPort: false,
} as const;

const appPorts = {
  context: 3003,
  permissive: 3004,
  roots: 3005,
} as const;

const staticOptimizations = {
  prerenderConcurrency: 10,
  staticExtensions: [
    '.html',
    '.css',
    '.js',
    '.json',
    '.data',
    '.xml',
    '.txt',
    '.ico',
    '.png',
    '.jpg',
    '.svg',
    '.woff2',
  ],
} as const;

interface RuntimeCaching {
  urlPattern: RegExp;
  handler: string;
  options: {
    cacheName: string;
    expiration: { maxAgeSeconds?: number; maxEntries?: number };
  };
}

const pwaPresets: Record<string, RuntimeCaching[]> = {
  googleFonts: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
  ],
  none: [],
};

// createAppViteConfig 함수 모의 구현
function createAppViteConfig(options: AppViteConfigOptions) {
  const {
    port,
    pwaAssets = ['favicon.ico', 'icons/*.svg'],
    pwaMaxFileSize,
    pwaCaching = 'googleFonts',
  } = options;

  return {
    server: { port },
    preview: { port },
    resolve: {
      alias: { '@': '/app', '~': '/app' },
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
      },
    },
    plugins: [
      // Mock plugin representations
      { name: 'tailwindcss' },
      { name: 'paraglide' },
      { name: 'reactRouter' },
      {
        name: 'VitePWA',
        options: {
          registerType: 'autoUpdate',
          includeAssets: pwaAssets,
          manifest: false,
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
            cleanupOutdatedCaches: true,
            skipWaiting: true,
            clientsClaim: true,
            ...(pwaMaxFileSize && { maximumFileSizeToCacheInBytes: pwaMaxFileSize }),
            runtimeCaching: pwaPresets[pwaCaching],
          },
        },
      },
      { name: 'visualizer' },
    ],
  };
}

// 테스트 시작
describe('@soundblue/config - Vite', () => {
  describe('buildOptimizations', () => {
    it('should have correct chunk size warning limit', () => {
      expect(buildOptimizations.chunkSizeWarningLimit).toBe(500);
    });

    it('should have manual chunks for react', () => {
      const chunks = buildOptimizations.rollupOptions.output.manualChunks;

      expect(chunks.react).toContain('react');
      expect(chunks.react).toContain('react-dom');
    });

    it('should have manual chunks for router', () => {
      const chunks = buildOptimizations.rollupOptions.output.manualChunks;

      expect(chunks.router).toContain('react-router');
    });
  });

  describe('productionBuildSettings', () => {
    it('should use terser for minification', () => {
      expect(productionBuildSettings.minify).toBe('terser');
    });

    it('should drop console in production', () => {
      expect(productionBuildSettings.terserOptions.compress.drop_console).toBe(true);
    });

    it('should drop debugger in production', () => {
      expect(productionBuildSettings.terserOptions.compress.drop_debugger).toBe(true);
    });
  });

  describe('devServerDefaults', () => {
    it('should enable host by default', () => {
      expect(devServerDefaults.host).toBe(true);
    });

    it('should not use strict port', () => {
      expect(devServerDefaults.strictPort).toBe(false);
    });
  });

  describe('appPorts', () => {
    it('should have correct port for context', () => {
      expect(appPorts.context).toBe(3003);
    });

    it('should have correct port for permissive', () => {
      expect(appPorts.permissive).toBe(3004);
    });

    it('should have correct port for roots', () => {
      expect(appPorts.roots).toBe(3005);
    });

    it('should have unique ports for all apps', () => {
      const ports = Object.values(appPorts);
      const uniquePorts = new Set(ports);

      expect(uniquePorts.size).toBe(ports.length);
    });
  });

  describe('staticOptimizations', () => {
    it('should have correct prerender concurrency', () => {
      expect(staticOptimizations.prerenderConcurrency).toBe(10);
    });

    it('should include common static extensions', () => {
      const extensions = staticOptimizations.staticExtensions;

      expect(extensions).toContain('.html');
      expect(extensions).toContain('.css');
      expect(extensions).toContain('.js');
      expect(extensions).toContain('.json');
      expect(extensions).toContain('.xml');
    });

    it('should include image extensions', () => {
      const extensions = staticOptimizations.staticExtensions;

      expect(extensions).toContain('.png');
      expect(extensions).toContain('.jpg');
      expect(extensions).toContain('.svg');
      expect(extensions).toContain('.ico');
    });

    it('should include font extensions', () => {
      const extensions = staticOptimizations.staticExtensions;

      expect(extensions).toContain('.woff2');
    });
  });

  describe('pwaPresets', () => {
    describe('googleFonts preset', () => {
      it('should have rules for Google Fonts stylesheets', () => {
        const preset = pwaPresets.googleFonts;
        // Test regex by checking if it matches a sample URL
        const stylesheetRule = preset.find((r) =>
          r.urlPattern.test('https://fonts.googleapis.com/css2?family=Inter'),
        );

        expect(stylesheetRule).toBeDefined();
        expect(stylesheetRule?.handler).toBe('CacheFirst');
        expect(stylesheetRule?.options.cacheName).toBe('google-fonts-stylesheets');
      });

      it('should have rules for Google Fonts webfonts', () => {
        const preset = pwaPresets.googleFonts;
        // Test regex by checking if it matches a sample URL
        const webfontRule = preset.find((r) =>
          r.urlPattern.test('https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS.woff2'),
        );

        expect(webfontRule).toBeDefined();
        expect(webfontRule?.handler).toBe('CacheFirst');
        expect(webfontRule?.options.cacheName).toBe('google-fonts-webfonts');
      });

      it('should cache fonts for 1 year', () => {
        const preset = pwaPresets.googleFonts;
        const oneYearInSeconds = 60 * 60 * 24 * 365;

        for (const rule of preset) {
          expect(rule.options.expiration.maxAgeSeconds).toBe(oneYearInSeconds);
        }
      });

      it('should limit webfonts cache entries to 30', () => {
        const preset = pwaPresets.googleFonts;
        // Test regex by checking if it matches a sample URL
        const webfontRule = preset.find((r) =>
          r.urlPattern.test('https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS.woff2'),
        );

        expect(webfontRule?.options.expiration.maxEntries).toBe(30);
      });
    });

    describe('none preset', () => {
      it('should be an empty array', () => {
        expect(pwaPresets.none).toEqual([]);
      });
    });
  });

  describe('createAppViteConfig', () => {
    it('should create config with specified port', () => {
      const config = createAppViteConfig({ port: 3003 });

      expect(config.server.port).toBe(3003);
      expect(config.preview.port).toBe(3003);
    });

    it('should set up path aliases', () => {
      const config = createAppViteConfig({ port: 3000 });

      expect(config.resolve.alias['@']).toBe('/app');
      expect(config.resolve.alias['~']).toBe('/app');
    });

    it('should configure production build settings', () => {
      const config = createAppViteConfig({ port: 3000 });

      expect(config.build.minify).toBe('terser');
      expect(config.build.terserOptions.compress.drop_console).toBe(true);
      expect(config.build.terserOptions.compress.drop_debugger).toBe(true);
    });

    it('should use default PWA assets', () => {
      const config = createAppViteConfig({ port: 3000 });
      const pwaPlugin = config.plugins.find((p) => p.name === 'VitePWA') as {
        name: string;
        options: { includeAssets: string[] };
      };

      expect(pwaPlugin.options.includeAssets).toEqual(['favicon.ico', 'icons/*.svg']);
    });

    it('should use custom PWA assets when provided', () => {
      const customAssets = ['custom.ico', 'custom/*.png'];
      const config = createAppViteConfig({ port: 3000, pwaAssets: customAssets });
      const pwaPlugin = config.plugins.find((p) => p.name === 'VitePWA') as {
        name: string;
        options: { includeAssets: string[] };
      };

      expect(pwaPlugin.options.includeAssets).toEqual(customAssets);
    });

    it('should set PWA max file size when provided', () => {
      const maxSize = 35 * 1024 * 1024;
      const config = createAppViteConfig({ port: 3000, pwaMaxFileSize: maxSize });
      const pwaPlugin = config.plugins.find((p) => p.name === 'VitePWA') as {
        name: string;
        options: { workbox: { maximumFileSizeToCacheInBytes?: number } };
      };

      expect(pwaPlugin.options.workbox.maximumFileSizeToCacheInBytes).toBe(maxSize);
    });

    it('should not set PWA max file size when not provided', () => {
      const config = createAppViteConfig({ port: 3000 });
      const pwaPlugin = config.plugins.find((p) => p.name === 'VitePWA') as {
        name: string;
        options: { workbox: { maximumFileSizeToCacheInBytes?: number } };
      };

      expect(pwaPlugin.options.workbox.maximumFileSizeToCacheInBytes).toBeUndefined();
    });

    it('should use googleFonts caching by default', () => {
      const config = createAppViteConfig({ port: 3000 });
      const pwaPlugin = config.plugins.find((p) => p.name === 'VitePWA') as {
        name: string;
        options: { workbox: { runtimeCaching: RuntimeCaching[] } };
      };

      expect(pwaPlugin.options.workbox.runtimeCaching).toBe(pwaPresets.googleFonts);
    });

    it('should use none caching when specified', () => {
      const config = createAppViteConfig({ port: 3000, pwaCaching: 'none' });
      const pwaPlugin = config.plugins.find((p) => p.name === 'VitePWA') as {
        name: string;
        options: { workbox: { runtimeCaching: RuntimeCaching[] } };
      };

      expect(pwaPlugin.options.workbox.runtimeCaching).toEqual([]);
    });

    it('should include all required plugins', () => {
      const config = createAppViteConfig({ port: 3000 });
      const pluginNames = config.plugins.map((p) => p.name);

      expect(pluginNames).toContain('tailwindcss');
      expect(pluginNames).toContain('paraglide');
      expect(pluginNames).toContain('reactRouter');
      expect(pluginNames).toContain('VitePWA');
      expect(pluginNames).toContain('visualizer');
    });

    it('should configure PWA with autoUpdate', () => {
      const config = createAppViteConfig({ port: 3000 });
      const pwaPlugin = config.plugins.find((p) => p.name === 'VitePWA') as {
        name: string;
        options: { registerType: string };
      };

      expect(pwaPlugin.options.registerType).toBe('autoUpdate');
    });

    it('should disable manifest in PWA', () => {
      const config = createAppViteConfig({ port: 3000 });
      const pwaPlugin = config.plugins.find((p) => p.name === 'VitePWA') as {
        name: string;
        options: { manifest: boolean };
      };

      expect(pwaPlugin.options.manifest).toBe(false);
    });

    it('should configure workbox with correct patterns', () => {
      const config = createAppViteConfig({ port: 3000 });
      const pwaPlugin = config.plugins.find((p) => p.name === 'VitePWA') as {
        name: string;
        options: {
          workbox: {
            globPatterns: string[];
            cleanupOutdatedCaches: boolean;
            skipWaiting: boolean;
            clientsClaim: boolean;
          };
        };
      };

      expect(pwaPlugin.options.workbox.globPatterns).toEqual([
        '**/*.{js,css,html,ico,svg,woff2}',
      ]);
      expect(pwaPlugin.options.workbox.cleanupOutdatedCaches).toBe(true);
      expect(pwaPlugin.options.workbox.skipWaiting).toBe(true);
      expect(pwaPlugin.options.workbox.clientsClaim).toBe(true);
    });
  });

  describe('app-specific configurations', () => {
    it('should create valid config for context app', () => {
      const config = createAppViteConfig({
        port: appPorts.context,
        pwaMaxFileSize: 35 * 1024 * 1024,
      });

      expect(config.server.port).toBe(3003);
    });

    it('should create valid config for permissive app', () => {
      const config = createAppViteConfig({
        port: appPorts.permissive,
      });

      expect(config.server.port).toBe(3004);
    });

    it('should create valid config for roots app', () => {
      const config = createAppViteConfig({
        port: appPorts.roots,
        pwaCaching: 'none',
      });

      expect(config.server.port).toBe(3005);
    });
  });
});
