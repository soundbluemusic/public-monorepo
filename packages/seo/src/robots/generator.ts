/**
 * @fileoverview Robots.txt Generator
 * @environment build-only
 *
 * Generates robots.txt with sitemap reference.
 * Uses Node.js fs - only runs at build time, never in browser.
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

// ============================================================================
// Types
// ============================================================================

export interface RobotsConfig {
  /** Site URL without trailing slash (e.g., 'https://example.com') */
  siteUrl: string;
  /** Output directory for generated files */
  outputDir: string;
  /** Disallowed paths (default: none) */
  disallow?: string[];
  /** Allowed paths (overrides disallow) */
  allow?: string[];
  /** Crawl delay in seconds (optional) */
  crawlDelay?: number;
}

export interface RobotsRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Generate robots.txt content from rules
 */
export function generateRobotsContent(rules: RobotsRule[], sitemapUrl?: string): string {
  const lines: string[] = [];

  for (const rule of rules) {
    lines.push(`User-agent: ${rule.userAgent}`);

    if (rule.disallow) {
      for (const path of rule.disallow) {
        lines.push(`Disallow: ${path}`);
      }
    }

    if (rule.allow) {
      for (const path of rule.allow) {
        lines.push(`Allow: ${path}`);
      }
    }

    if (rule.crawlDelay !== undefined) {
      lines.push(`Crawl-delay: ${rule.crawlDelay}`);
    }

    lines.push(''); // Empty line between rules
  }

  if (sitemapUrl) {
    lines.push(`Sitemap: ${sitemapUrl}`);
  }

  return lines.join('\n');
}

/**
 * Generate standard robots.txt for public sites
 */
export function generatePublicRobots(siteUrl: string): string {
  const rules: RobotsRule[] = [
    {
      userAgent: '*',
      allow: ['/'],
    },
  ];

  return generateRobotsContent(rules, `${siteUrl}/sitemap.xml`);
}

/**
 * Generate robots.txt that blocks all crawlers
 */
export function generatePrivateRobots(): string {
  const rules: RobotsRule[] = [
    {
      userAgent: '*',
      disallow: ['/'],
    },
  ];

  return generateRobotsContent(rules);
}

// ============================================================================
// High-Level Generator
// ============================================================================

/**
 * Generate robots.txt file for an app
 */
export function generateRobotsTxt(config: RobotsConfig): void {
  const { siteUrl, outputDir, disallow = [], allow = [], crawlDelay } = config;

  console.log('🤖 Generating robots.txt...');

  const rules: RobotsRule[] = [
    {
      userAgent: '*',
      allow: allow.length > 0 ? allow : ['/'],
      disallow: disallow.length > 0 ? disallow : undefined,
      crawlDelay,
    },
  ];

  const content = generateRobotsContent(rules, `${siteUrl}/sitemap.xml`);
  writeFileSync(join(outputDir, 'robots.txt'), content);

  console.log('✅ robots.txt generated');
}
