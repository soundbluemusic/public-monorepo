/**
 * @fileoverview E2E tests for robots.txt AI crawler permissions
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { expect, test } from '@playwright/test';

const AI_CRAWLERS = [
  'GPTBot',          // ChatGPT
  'ChatGPT-User',    // ChatGPT Browse
  'ClaudeBot',       // Claude
  'Claude-Web',      // Claude Web
  'PerplexityBot',   // Perplexity
  'Google-Extended', // Google Bard/Gemini
  'anthropic-ai',    // Anthropic
  'Applebot-Extended', // Apple Intelligence
  'CCBot',           // Common Crawl
  'Diffbot',         // Diffbot
  'FacebookBot',     // Meta AI
  'ImagesiftBot',    // ImageSift
  'Omgilibot',       // Omgili
  'Bytespider',      // ByteDance (TikTok)
  'Googlebot',       // Google
  'Bingbot',         // Bing
];

const APPS = [
  { name: 'roots', path: 'apps/roots/public/robots.txt', url: 'https://roots.soundbluemusic.com' },
  { name: 'context', path: 'apps/context/public/robots.txt', url: 'https://context.soundbluemusic.com' },
  { name: 'permissive', path: 'apps/permissive/public/robots.txt', url: 'https://permissive.soundbluemusic.com' },
];

for (const app of APPS) {
  test.describe(`robots.txt - ${app.name}`, () => {
    let robotsTxt: string;

    test.beforeAll(() => {
      const robotsPath = path.join(process.cwd(), app.path);
      robotsTxt = fs.readFileSync(robotsPath, 'utf-8');
    });

    test('should allow all crawlers by default', () => {
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
    });

    test('should include sitemap URL', () => {
      expect(robotsTxt).toContain('Sitemap:');
      expect(robotsTxt).toContain(`${app.url}/sitemap.xml`);
    });

    for (const crawler of AI_CRAWLERS) {
      test(`should explicitly allow ${crawler}`, () => {
        const crawlerBlock = `User-agent: ${crawler}`;
        expect(robotsTxt).toContain(crawlerBlock);

        // Ensure it's not blocked
        const blockPattern = `User-agent: ${crawler}\nDisallow: /`;
        expect(robotsTxt).not.toContain(blockPattern);
      });
    }

    test('should not contain Disallow: / for any AI crawler', () => {
      for (const crawler of AI_CRAWLERS) {
        const lines = robotsTxt.split('\n');
        let foundCrawler = false;
        let foundDisallow = false;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === `User-agent: ${crawler}`) {
            foundCrawler = true;
            // Check next few lines
            for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
              if (lines[j].trim().startsWith('User-agent:')) {
                break; // New user-agent section
              }
              if (lines[j].trim() === 'Disallow: /') {
                foundDisallow = true;
                break;
              }
            }
          }
        }

        if (foundCrawler && foundDisallow) {
          throw new Error(`${crawler} is blocked with Disallow: /`);
        }
      });
    });

    test('should have proper format', () => {
      // Should start with comment or User-agent
      const firstLine = robotsTxt.trim().split('\n')[0];
      expect(firstLine.startsWith('#') || firstLine.startsWith('User-agent:')).toBe(true);
    });

    test('should not have syntax errors', () => {
      const lines = robotsTxt.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();

        // Skip empty lines and comments
        if (trimmed === '' || trimmed.startsWith('#')) {
          continue;
        }

        // Should be valid directive
        const validDirectives = ['User-agent:', 'Allow:', 'Disallow:', 'Sitemap:', 'Crawl-delay:'];
        const isValid = validDirectives.some(directive => trimmed.startsWith(directive));

        if (!isValid) {
          throw new Error(`Invalid robots.txt directive: "${trimmed}"`);
        }
      }
    });
  });
}
