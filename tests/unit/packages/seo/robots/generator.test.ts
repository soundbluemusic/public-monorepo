/**
 * @fileoverview Tests for robots.txt generator
 */

import {
  generatePrivateRobots,
  generatePublicRobots,
  generateRobotsContent,
} from '@soundblue/seo/robots';
import { describe, expect, it } from 'vitest';

describe('generateRobotsContent', () => {
  it('should generate basic user-agent rule', () => {
    const rules = [{ userAgent: '*', allow: ['/'] }];
    const content = generateRobotsContent(rules);

    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
  });

  it('should include disallow rules', () => {
    const rules = [{ userAgent: '*', disallow: ['/admin', '/private'] }];
    const content = generateRobotsContent(rules);

    expect(content).toContain('Disallow: /admin');
    expect(content).toContain('Disallow: /private');
  });

  it('should include allow rules', () => {
    const rules = [{ userAgent: '*', allow: ['/', '/public'] }];
    const content = generateRobotsContent(rules);

    expect(content).toContain('Allow: /');
    expect(content).toContain('Allow: /public');
  });

  it('should include crawl-delay', () => {
    const rules = [{ userAgent: '*', crawlDelay: 10 }];
    const content = generateRobotsContent(rules);

    expect(content).toContain('Crawl-delay: 10');
  });

  it('should include sitemap URL', () => {
    const rules = [{ userAgent: '*' }];
    const content = generateRobotsContent(rules, 'https://example.com/sitemap.xml');

    expect(content).toContain('Sitemap: https://example.com/sitemap.xml');
  });

  it('should handle multiple rules', () => {
    const rules = [
      { userAgent: 'Googlebot', allow: ['/'] },
      { userAgent: 'Bingbot', disallow: ['/private'] },
    ];
    const content = generateRobotsContent(rules);

    expect(content).toContain('User-agent: Googlebot');
    expect(content).toContain('User-agent: Bingbot');
    expect(content).toContain('Allow: /');
    expect(content).toContain('Disallow: /private');
  });

  it('should handle rule with both allow and disallow', () => {
    const rules = [{ userAgent: '*', allow: ['/public'], disallow: ['/admin'] }];
    const content = generateRobotsContent(rules);

    expect(content).toContain('Allow: /public');
    expect(content).toContain('Disallow: /admin');
  });
});

describe('generatePublicRobots', () => {
  it('should generate public robots.txt', () => {
    const content = generatePublicRobots('https://example.com');

    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('Sitemap: https://example.com/sitemap.xml');
  });
});

describe('generatePrivateRobots', () => {
  it('should generate private robots.txt', () => {
    const content = generatePrivateRobots();

    expect(content).toContain('User-agent: *');
    expect(content).toContain('Disallow: /');
    expect(content).not.toContain('Allow: /');
    expect(content).not.toContain('Sitemap:');
  });
});
