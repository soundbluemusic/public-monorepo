import { describe, expect, it } from 'vitest';
import { classifyFailure, parseLycheeOutput, sitemapLocations, extractLinks } from '../../../scripts/lib/link-audit';

describe('link audit evidence', () => {
  it('reads top-level lychee counters and preserves blocked responses', () => {
    const report = parseLycheeOutput(JSON.stringify({ total: 4, successful: 1, errors: 3,
      error_map: { page: [
        { url: 'https://example.com/missing', status: { code: 404 } },
        { url: 'https://example.com/blocked', status: { code: 403 } },
        { url: 'https://example.com/down', status: { code: 503 } },
      ] } }), 2, '');
    expect(report.total).toBe(4);
    expect(report.failures.map(item => item.kind)).toEqual(['broken', 'blocked', 'server']);
  });
  it('preserves errors and timeouts from the same input file', () => {
    const report = parseLycheeOutput(JSON.stringify({total: 2, errors: 2, error_map: {page: [{url: 'https://example.com/missing', status: {code: 404}}]}, timeout_map: {page: [{url: 'https://example.com/timeout', status: {text: 'Timeout'}}]}}), 2, '');
    expect(report.failures.map(item => item.kind)).toEqual(['broken', 'network']);
  });
  it('never turns invalid config or absent JSON into broken-link counts', () => {
    const report = parseLycheeOutput('', 1, 'invalid value Compact');
    expect(report.failures).toEqual([]);
    expect(report.checkerError).toContain('Compact');
  });
  it('treats network failures separately from missing pages', () => {
    expect(classifyFailure(0)).toBe('network');
    expect(classifyFailure(429)).toBe('blocked');
    expect(classifyFailure(410)).toBe('broken');
  });
  it('reads nested sitemap locations and decodes XML entities', () => {
    expect(sitemapLocations('<sitemapindex><sitemap><loc>https://example.com/a.xml?a=1&amp;b=2</loc></sitemap></sitemapindex>'))
      .toEqual(['https://example.com/a.xml?a=1&b=2']);
  });
  it('includes entry pages, alternate language links and JSON-LD logos', () => {
    const links = extractLinks('<a href="/entry/test">Entry</a><link rel="alternate" href="/ko/entry/test"><script type="application/ld+json">{"logo":"/logo.png"}</script>', 'https://example.com/');
    expect(links).toEqual(expect.arrayContaining(['https://example.com/entry/test', 'https://example.com/ko/entry/test', 'https://example.com/logo.png']));
  });
  it('does not follow Cloudflare decoy links, but still checks transformed images', () => {
    const links = extractLinks('<a href="/cdn-cgi/content?id=ephemeral" aria-hidden="true" rel="nofollow">Decoy</a><img src="/cdn-cgi/image/width=100/photo.jpg"><a href="/missing">Missing</a>', 'https://example.com/');
    expect(links).toEqual(['https://example.com/cdn-cgi/image/width=100/photo.jpg', 'https://example.com/missing']);
  });
  it('does not request connection hints as documents, but still checks linked resources', () => {
    const links = extractLinks('<link rel="preconnect" href="https://i.ytimg.com"><link rel="DNS-PREFETCH preconnect" href="//fonts.example.com"><link rel="preload" href="/font.woff2" as="font"><link rel="stylesheet" href="/style.css"><a rel="preconnect" href="https://i.ytimg.com/real-page">Actual link</a>', 'https://example.com/');
    expect(links).toEqual(['https://example.com/font.woff2', 'https://example.com/style.css', 'https://i.ytimg.com/real-page']);
  });
});
