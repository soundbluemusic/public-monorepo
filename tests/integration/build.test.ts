/**
 * @fileoverview Integration tests for SSR Worker build output verification.
 *
 * Note: These tests require the build to exist. Run `pnpm build:roots` first.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';

const clientBuildDir = path.join(process.cwd(), 'apps/roots/dist/client');
const serverBuildDir = path.join(process.cwd(), 'apps/roots/dist/server');
const hasBuild = fs.existsSync(clientBuildDir) && fs.existsSync(serverBuildDir);

describe.skipIf(!hasBuild)('SSR Worker Build Verification', () => {
  it('should generate a server worker entry', () => {
    const serverEntryPath = path.join(serverBuildDir, 'index.js');
    expect(fs.existsSync(serverEntryPath)).toBe(true);
  });

  it('should generate a client fallback document', () => {
    const fallbackPath = path.join(clientBuildDir, '404.html');
    expect(fs.existsSync(fallbackPath)).toBe(true);
  });

  it('should copy _headers file to build output', () => {
    const headersPath = path.join(clientBuildDir, '_headers');
    expect(fs.existsSync(headersPath)).toBe(true);
  });

  it('should copy _redirects file to build output', () => {
    const redirectsPath = path.join(clientBuildDir, '_redirects');
    expect(fs.existsSync(redirectsPath)).toBe(true);
  });

  it('should copy _routes.json file to build output', () => {
    const routesPath = path.join(clientBuildDir, '_routes.json');
    expect(fs.existsSync(routesPath)).toBe(true);
  });

  it('should copy manifest.json to build output', () => {
    const manifestPath = path.join(clientBuildDir, 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
  });

  it('should copy sitemap.xml to build output', () => {
    const sitemapPath = path.join(clientBuildDir, 'sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);
  });

  it('should generate assets directory with JS/CSS bundles', () => {
    const assetsDir = path.join(clientBuildDir, 'assets');
    expect(fs.existsSync(assetsDir)).toBe(true);

    const files = fs.readdirSync(assetsDir);
    const hasJS = files.some((file) => file.endsWith('.js'));
    const hasCSS = files.some((file) => file.endsWith('.css'));

    expect(hasJS).toBe(true);
    expect(hasCSS).toBe(true);
  });

  it('fallback document should contain proper DOCTYPE', () => {
    const fallbackPath = path.join(clientBuildDir, '404.html');
    const content = fs.readFileSync(fallbackPath, 'utf-8');

    expect(content).toContain('<!DOCTYPE html>');
  });

  it('fallback document should contain meta charset', () => {
    const fallbackPath = path.join(clientBuildDir, '404.html');
    const content = fs.readFileSync(fallbackPath, 'utf-8');

    expect(content.toLowerCase()).toContain('charset="utf-8"');
  });

  it('fallback document should contain viewport meta tag', () => {
    const fallbackPath = path.join(clientBuildDir, '404.html');
    const content = fs.readFileSync(fallbackPath, 'utf-8');

    expect(content).toContain('viewport');
    expect(content).toContain('width=device-width');
  });
});

describe.skipIf(!hasBuild)('Build Output Validation', () => {
  it('should not include node_modules in build output', () => {
    const nodeModulesPath = path.join(clientBuildDir, 'node_modules');
    expect(fs.existsSync(nodeModulesPath)).toBe(false);
  });

  it('should not include source .tsx/.ts files in build output', () => {
    const assetsDir = path.join(clientBuildDir, 'assets');
    const files = fs.readdirSync(assetsDir);
    const hasTSX = files.some((file) => file.endsWith('.tsx'));
    const hasTS = files.some((file) => file.endsWith('.ts') && !file.endsWith('.d.ts'));

    expect(hasTSX).toBe(false);
    expect(hasTS).toBe(false);
  });

  it('assets should have cache-busting hashes in filenames', () => {
    const assetsDir = path.join(clientBuildDir, 'assets');
    const files = fs.readdirSync(assetsDir);
    const jsFiles = files.filter((file) => file.endsWith('.js'));

    if (jsFiles.length > 0) {
      const hasHash = jsFiles.some((file) => /-[A-Za-z0-9_-]{8,}\.js$/.test(file));
      expect(hasHash).toBe(true);
    }
  });
});
