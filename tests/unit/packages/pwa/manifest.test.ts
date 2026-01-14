/**
 * @soundblue/pwa - Manifest Generator Tests
 *
 * PWA manifest 생성 함수 테스트
 */
import {
  generateManifestContent,
  generateStandardIcons,
  type ManifestConfig,
  type ManifestIcon,
} from '@soundblue/pwa/manifest';
import { describe, expect, it } from 'vitest';

describe('@soundblue/pwa/manifest', () => {
  describe('generateManifestContent', () => {
    const minimalConfig: ManifestConfig = {
      name: 'Test App',
      short_name: 'Test',
      description: 'A test application',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#000000',
      icons: [],
    };

    it('should generate manifest with required fields', () => {
      const manifest = generateManifestContent(minimalConfig);

      expect(manifest.name).toBe('Test App');
      expect(manifest.short_name).toBe('Test');
      expect(manifest.description).toBe('A test application');
      expect(manifest.start_url).toBe('/');
      expect(manifest.display).toBe('standalone');
      expect(manifest.background_color).toBe('#ffffff');
      expect(manifest.theme_color).toBe('#000000');
    });

    it('should include icons array', () => {
      const icons: ManifestIcon[] = [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ];

      const config: ManifestConfig = { ...minimalConfig, icons };
      const manifest = generateManifestContent(config);

      expect(manifest.icons).toHaveLength(2);
      expect(manifest.icons[0].sizes).toBe('192x192');
      expect(manifest.icons[1].sizes).toBe('512x512');
    });

    it('should include shortcuts when provided', () => {
      const config: ManifestConfig = {
        ...minimalConfig,
        shortcuts: [
          { name: 'Browse', url: '/browse' },
          { name: 'Search', url: '/search' },
        ],
      };

      const manifest = generateManifestContent(config);

      expect(manifest.shortcuts).toHaveLength(2);
      expect(manifest.shortcuts![0].name).toBe('Browse');
      expect(manifest.shortcuts![1].url).toBe('/search');
    });

    it('should exclude shortcuts when empty array', () => {
      const config: ManifestConfig = { ...minimalConfig, shortcuts: [] };
      const manifest = generateManifestContent(config);

      expect(manifest.shortcuts).toBeUndefined();
    });

    it('should include categories when provided', () => {
      const config: ManifestConfig = {
        ...minimalConfig,
        categories: ['education', 'reference'],
      };

      const manifest = generateManifestContent(config);

      expect(manifest.categories).toEqual(['education', 'reference']);
    });

    it('should exclude categories when empty array', () => {
      const config: ManifestConfig = { ...minimalConfig, categories: [] };
      const manifest = generateManifestContent(config);

      expect(manifest.categories).toBeUndefined();
    });

    it('should include lang when provided', () => {
      const config: ManifestConfig = { ...minimalConfig, lang: 'ko' };
      const manifest = generateManifestContent(config);

      expect(manifest.lang).toBe('ko');
    });

    it('should include dir when provided', () => {
      const config: ManifestConfig = { ...minimalConfig, dir: 'ltr' };
      const manifest = generateManifestContent(config);

      expect(manifest.dir).toBe('ltr');
    });

    it('should include orientation when provided', () => {
      const config: ManifestConfig = { ...minimalConfig, orientation: 'portrait' };
      const manifest = generateManifestContent(config);

      expect(manifest.orientation).toBe('portrait');
    });

    it('should include scope when provided', () => {
      const config: ManifestConfig = { ...minimalConfig, scope: '/app/' };
      const manifest = generateManifestContent(config);

      expect(manifest.scope).toBe('/app/');
    });

    it('should include id when provided', () => {
      const config: ManifestConfig = { ...minimalConfig, id: '/app' };
      const manifest = generateManifestContent(config);

      expect(manifest.id).toBe('/app');
    });

    it('should support all display modes', () => {
      const displayModes = ['standalone', 'fullscreen', 'minimal-ui', 'browser'] as const;

      for (const display of displayModes) {
        const config: ManifestConfig = { ...minimalConfig, display };
        const manifest = generateManifestContent(config);
        expect(manifest.display).toBe(display);
      }
    });
  });

  describe('generateStandardIcons', () => {
    it('should generate icons for all standard sizes', () => {
      const icons = generateStandardIcons('/icons', 'app');

      const expectedSizes = [
        '72x72',
        '96x96',
        '128x128',
        '144x144',
        '152x152',
        '192x192',
        '384x384',
        '512x512',
      ];
      const generatedSizes = icons.filter((i) => !i.purpose).map((i) => i.sizes);

      for (const size of expectedSizes) {
        expect(generatedSizes).toContain(size);
      }
    });

    it('should include maskable icon', () => {
      const icons = generateStandardIcons('/icons', 'app');

      const maskableIcon = icons.find((i) => i.purpose === 'maskable');
      expect(maskableIcon).toBeDefined();
      expect(maskableIcon?.sizes).toBe('512x512');
    });

    it('should use correct path format', () => {
      const icons = generateStandardIcons('/icons', 'myapp');

      const icon192 = icons.find((i) => i.sizes === '192x192');
      expect(icon192?.src).toBe('/icons/myapp-192x192.png');
    });

    it('should set correct type for all icons', () => {
      const icons = generateStandardIcons('/icons', 'app');

      for (const icon of icons) {
        expect(icon.type).toBe('image/png');
      }
    });

    it('should generate correct number of icons', () => {
      const icons = generateStandardIcons('/icons', 'app');

      // 8 standard sizes + 1 maskable = 9
      expect(icons).toHaveLength(9);
    });

    it('should handle different base paths', () => {
      const icons1 = generateStandardIcons('/assets/icons', 'app');
      const icons2 = generateStandardIcons('/', 'app');

      expect(icons1[0].src).toContain('/assets/icons/');
      expect(icons2[0].src).toContain('/app-');
    });

    it('should handle different app names', () => {
      const icons = generateStandardIcons('/icons', 'context');

      expect(icons[0].src).toContain('context-');
      expect(icons.find((i) => i.purpose === 'maskable')?.src).toContain('context-maskable');
    });
  });
});
