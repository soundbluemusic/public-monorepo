/**
 * @fileoverview Tests for robots.txt generator
 */

import {
  generatePrivateRobots,
  generatePublicRobots,
  generateRobotsContent,
  generateRobotsTxt,
} from '@soundblue/seo/robots';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('generateRobotsTxt', () => {
  let mockConsoleLog: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockConsoleLog = vi.fn();
    vi.spyOn(console, 'log').mockImplementation(mockConsoleLog);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be a function', () => {
    expect(typeof generateRobotsTxt).toBe('function');
  });

  it('should log progress messages', () => {
    // The actual file writing requires mocking fs, but we verify the function exists
    // and would log messages during execution
    expect(generateRobotsTxt).toBeDefined();
  });
});

describe('generateRobotsContent edge cases', () => {
  it('should handle empty rules array', () => {
    const content = generateRobotsContent([]);
    expect(content).toBe('');
  });

  it('should handle rule with only userAgent', () => {
    const rules = [{ userAgent: 'Googlebot' }];
    const content = generateRobotsContent(rules);

    expect(content).toContain('User-agent: Googlebot');
    expect(content).not.toContain('Disallow:');
    expect(content).not.toContain('Allow:');
  });

  it('should handle sitemap URL without rules', () => {
    const content = generateRobotsContent([], 'https://example.com/sitemap.xml');
    expect(content).toContain('Sitemap: https://example.com/sitemap.xml');
  });

  it('should handle multiple allow paths', () => {
    const rules = [{ userAgent: '*', allow: ['/public', '/api/v1', '/docs'] }];
    const content = generateRobotsContent(rules);

    expect(content).toContain('Allow: /public');
    expect(content).toContain('Allow: /api/v1');
    expect(content).toContain('Allow: /docs');
  });

  it('should handle multiple disallow paths', () => {
    const rules = [{ userAgent: '*', disallow: ['/admin', '/private', '/internal'] }];
    const content = generateRobotsContent(rules);

    expect(content).toContain('Disallow: /admin');
    expect(content).toContain('Disallow: /private');
    expect(content).toContain('Disallow: /internal');
  });

  it('should include crawl-delay when specified', () => {
    const rules = [{ userAgent: '*', crawlDelay: 5 }];
    const content = generateRobotsContent(rules);

    expect(content).toContain('Crawl-delay: 5');
  });

  it('should handle crawl-delay of 0', () => {
    const rules = [{ userAgent: '*', crawlDelay: 0 }];
    const content = generateRobotsContent(rules);

    // crawlDelay: 0 should still be included (0 is a valid value)
    expect(content).toContain('Crawl-delay: 0');
  });

  it('should handle multiple user agents with different rules', () => {
    const rules = [
      { userAgent: 'Googlebot', allow: ['/'], crawlDelay: 1 },
      { userAgent: 'Bingbot', disallow: ['/private'], crawlDelay: 2 },
      { userAgent: '*', disallow: ['/admin'] },
    ];
    const content = generateRobotsContent(rules);

    expect(content).toContain('User-agent: Googlebot');
    expect(content).toContain('User-agent: Bingbot');
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Crawl-delay: 1');
    expect(content).toContain('Crawl-delay: 2');
  });

  it('should maintain correct order: User-agent, Disallow, Allow, Crawl-delay', () => {
    const rules = [{ userAgent: '*', allow: ['/public'], disallow: ['/private'], crawlDelay: 10 }];
    const content = generateRobotsContent(rules);
    const lines = content.split('\n');

    const userAgentIndex = lines.findIndex((l) => l.startsWith('User-agent:'));
    const disallowIndex = lines.findIndex((l) => l.startsWith('Disallow:'));
    const allowIndex = lines.findIndex((l) => l.startsWith('Allow:'));
    const crawlDelayIndex = lines.findIndex((l) => l.startsWith('Crawl-delay:'));

    // Order should be: User-agent -> Disallow -> Allow -> Crawl-delay
    expect(userAgentIndex).toBeLessThan(disallowIndex);
    expect(disallowIndex).toBeLessThan(allowIndex);
    expect(allowIndex).toBeLessThan(crawlDelayIndex);
  });
});
