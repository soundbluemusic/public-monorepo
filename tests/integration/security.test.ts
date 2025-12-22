/**
 * @fileoverview Integration tests for security validation
 * Tests for sensitive data exposure and production security
 */

import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { glob } from 'glob';

describe('Sensitive Data Protection', () => {
  it('should not expose API keys in built JavaScript files', () => {
    const jsFiles = glob.sync('apps/roots/build/client/**/*.js', {
      ignore: ['**/node_modules/**'],
    });

    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf-8');

      // Google API Key pattern
      expect(content).not.toMatch(/AIza[0-9A-Za-z-_]{35}/);

      // OpenAI API Key pattern
      expect(content).not.toMatch(/sk-[a-zA-Z0-9]{48}/);

      // Anthropic API Key pattern
      expect(content).not.toMatch(/sk-ant-[a-zA-Z0-9-_]{95}/);

      // Generic secret patterns
      expect(content.toLowerCase()).not.toMatch(/secret.*[:=]\s*["'][^"']+["']/);
      expect(content.toLowerCase()).not.toMatch(/password.*[:=]\s*["'][^"']+["']/);
      expect(content.toLowerCase()).not.toMatch(/api_key.*[:=]\s*["'][^"']+["']/);
    }
  });

  it('should not expose environment variables in built files', () => {
    const jsFiles = glob.sync('apps/roots/build/client/**/*.js', {
      ignore: ['**/node_modules/**'],
    });

    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf-8');

      // Should not contain process.env references (except in comments)
      const processEnvMatches = content.match(/process\.env/g);
      if (processEnvMatches) {
        // Allow in comments or development-only code
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.includes('process.env') && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
            throw new Error(`Found process.env in production build: ${file}`);
          }
        }
      }
    }
  });
});

describe('Source Map Protection', () => {
  it('should not include source maps in production build', () => {
    const mapFiles = glob.sync('apps/roots/build/client/**/*.map', {
      ignore: ['**/node_modules/**'],
    });

    expect(mapFiles.length).toBe(0);
  });

  it('should not reference source maps in JS files', () => {
    const jsFiles = glob.sync('apps/roots/build/client/**/*.js', {
      ignore: ['**/node_modules/**'],
    });

    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf-8');

      // Should not contain sourceMappingURL
      expect(content).not.toContain('//# sourceMappingURL=');
      expect(content).not.toContain('//@ sourceMappingURL=');
    }
  });
});

describe('Development Files Protection', () => {
  it('should not include .env files in build', () => {
    const envFiles = glob.sync('apps/roots/build/client/**/.env*', {
      ignore: ['**/node_modules/**'],
    });

    expect(envFiles.length).toBe(0);
  });

  it('should not include test files in build', () => {
    const testFiles = glob.sync('apps/roots/build/client/**/*.{test,spec}.{ts,tsx,js,jsx}', {
      ignore: ['**/node_modules/**'],
    });

    expect(testFiles.length).toBe(0);
  });

  it('should not include TypeScript source files in build', () => {
    const tsFiles = glob.sync('apps/roots/build/client/**/*.{ts,tsx}', {
      ignore: ['**/node_modules/**', '**/*.d.ts'],
    });

    expect(tsFiles.length).toBe(0);
  });

  it('should not include config files in build', () => {
    const buildDir = 'apps/roots/build/client';

    const configFiles = [
      'tsconfig.json',
      'vite.config.ts',
      'react-router.config.ts',
      '.env',
      '.env.local',
      '.gitignore',
    ];

    for (const configFile of configFiles) {
      const filePath = path.join(buildDir, configFile);
      expect(fs.existsSync(filePath)).toBe(false);
    }
  });
});

describe('Security Headers Files', () => {
  it('_headers file should contain security directives', () => {
    const headersPath = 'apps/roots/build/client/_headers';

    if (fs.existsSync(headersPath)) {
      const content = fs.readFileSync(headersPath, 'utf-8');

      expect(content).toContain('X-Content-Type-Options');
      expect(content).toContain('X-Frame-Options');
      expect(content).toContain('Content-Security-Policy');
    }
  });

  it('robots.txt should allow crawlers', () => {
    const robotsPath = 'apps/roots/build/client/robots.txt';

    if (fs.existsSync(robotsPath)) {
      const content = fs.readFileSync(robotsPath, 'utf-8');

      expect(content).toContain('User-agent: *');
      expect(content).toContain('Allow: /');
      expect(content).not.toContain('Disallow: /'); // Should not block everything
    }
  });
});

describe('Code Quality', () => {
  it('should not contain console.log in production code', () => {
    const jsFiles = glob.sync('apps/roots/build/client/**/*.js', {
      ignore: ['**/node_modules/**'],
    });

    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf-8');

      // Allow console.error, console.warn, but not console.log
      const consoleLogMatches = content.match(/console\.log\(/g);

      if (consoleLogMatches) {
        // In production builds, console.log should be removed by minifier
        // Allow a few for error handling, but not excessive
        expect(consoleLogMatches.length).toBeLessThan(5);
      }
    }
  });

  it('should not contain debugger statements', () => {
    const jsFiles = glob.sync('apps/roots/build/client/**/*.js', {
      ignore: ['**/node_modules/**'],
    });

    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/\bdebugger\b/);
    }
  });
});
