/**
 * @fileoverview Integration tests for HTML build verification
 * Tests that build works correctly and generates proper HTML
 *
 * Note: These tests require the build to exist. Run `pnpm build:roots` first.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';

const buildDir = path.join(process.cwd(), 'apps/roots/build/client');
const hasBuild = fs.existsSync(buildDir);

describe.skipIf(!hasBuild)('HTML Build Verification', () => {
  it('should generate index.html for root route', () => {
    const indexPath = path.join(buildDir, 'index.html');
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  it('should generate HTML for Korean homepage', () => {
    const koIndexPath = path.join(buildDir, 'ko/index.html');
    expect(fs.existsSync(koIndexPath)).toBe(true);
  });

  it('should generate HTML for about page', () => {
    const aboutPath = path.join(buildDir, 'about/index.html');
    expect(fs.existsSync(aboutPath)).toBe(true);

    const koAboutPath = path.join(buildDir, 'ko/about/index.html');
    expect(fs.existsSync(koAboutPath)).toBe(true);
  });

  it('should copy _headers file to build output', () => {
    const headersPath = path.join(buildDir, '_headers');
    expect(fs.existsSync(headersPath)).toBe(true);
  });

  it('should copy _redirects file to build output', () => {
    const redirectsPath = path.join(buildDir, '_redirects');
    expect(fs.existsSync(redirectsPath)).toBe(true);
  });

  it('should copy manifest.json to build output', () => {
    const manifestPath = path.join(buildDir, 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
  });

  it('should copy robots.txt to build output', () => {
    const robotsPath = path.join(buildDir, 'robots.txt');
    expect(fs.existsSync(robotsPath)).toBe(true);
  });

  it('should copy sitemap.xml to build output', () => {
    const sitemapPath = path.join(buildDir, 'sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);
  });

  it('should generate assets directory with JS/CSS bundles', () => {
    const assetsDir = path.join(buildDir, 'assets');
    expect(fs.existsSync(assetsDir)).toBe(true);

    const files = fs.readdirSync(assetsDir);
    const hasJS = files.some((file) => file.endsWith('.js'));
    const hasCSS = files.some((file) => file.endsWith('.css'));

    expect(hasJS).toBe(true);
    expect(hasCSS).toBe(true);
  });

  it('HTML files should contain proper DOCTYPE', () => {
    const indexPath = path.join(buildDir, 'ko/index.html');

    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      expect(content).toContain('<!DOCTYPE html>');
    }
  });

  it('HTML files should contain meta charset', () => {
    const indexPath = path.join(buildDir, 'ko/index.html');

    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      // React renders charSet (camelCase) but browsers interpret both
      expect(content.toLowerCase()).toContain('charset="utf-8"');
    }
  });

  it('HTML files should contain viewport meta tag', () => {
    const indexPath = path.join(buildDir, 'ko/index.html');

    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      expect(content).toContain('viewport');
      expect(content).toContain('width=device-width');
    }
  });

  it('HTML files should contain manifest link', () => {
    const indexPath = path.join(buildDir, 'ko/index.html');

    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      expect(content).toContain('manifest.json');
    }
  });
});

describe.skipIf(!hasBuild)('Build Output Validation', () => {
  it('should not include node_modules in build output', () => {
    const nodeModulesPath = path.join(buildDir, 'node_modules');
    expect(fs.existsSync(nodeModulesPath)).toBe(false);
  });

  it('should not include source .tsx/.ts files in build output', () => {
    const assetsDir = path.join(buildDir, 'assets');

    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      const hasTSX = files.some((file) => file.endsWith('.tsx'));
      const hasTS = files.some((file) => file.endsWith('.ts') && !file.endsWith('.d.ts'));

      expect(hasTSX).toBe(false);
      expect(hasTS).toBe(false);
    }
  });

  it('assets should have cache-busting hashes in filenames', () => {
    const assetsDir = path.join(buildDir, 'assets');

    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      const jsFiles = files.filter((file) => file.endsWith('.js'));

      if (jsFiles.length > 0) {
        // Check if files have hash pattern (e.g., index-a1b2c3d4.js)
        const hasHash = jsFiles.some((file) => /[a-f0-9]{8}/.test(file));
        expect(hasHash).toBe(true);
      }
    }
  });
});
