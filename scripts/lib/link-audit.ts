import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

export type FailureKind = 'broken' | 'blocked' | 'server' | 'network';
export interface LinkFailure {
  url: string;
  parent: string;
  status: number;
  kind: FailureKind;
  detail?: string;
}
export interface LinkReport {
  total: number;
  failures: LinkFailure[];
  checkerError?: string;
}
interface LycheeLink {
  url: string;
  status: { code?: number; text?: string; details?: string };
}

export function classifyFailure(status: number): FailureKind {
  if (status === 401 || status === 403 || status === 429) return 'blocked';
  if (status >= 500) return 'server';
  if (status >= 400) return 'broken';
  return 'network';
}

export function parseLycheeOutput(stdout: string, exitCode: number, stderr: string): LinkReport {
  try {
    const result = JSON.parse(stdout) as {
      total?: number;
      errors?: number;
      fail_map?: Record<string, LycheeLink[]>;
      error_map?: Record<string, LycheeLink[]>;
      timeout_map?: Record<string, LycheeLink[]>;
    };
    if (typeof result.total !== 'number' || typeof result.errors !== 'number') {
      throw new Error('Missing top-level lychee counters');
    }
    const failures = [
      ...Object.entries(result.fail_map ?? {}),
      ...Object.entries(result.error_map ?? {}),
      ...Object.entries(result.timeout_map ?? {}),
    ].flatMap(([parent, links]) =>
      links.map((link) => {
        const status = link.status.code ?? 0;
        return {
          url: link.url,
          parent,
          status,
          kind: classifyFailure(status),
          detail: link.status.text ?? link.status.details,
        };
      }),
    );
    const checkerError =
      (exitCode !== 0 || result.errors > 0) && failures.length === 0
        ? stderr.trim() || `lychee exited with ${exitCode}; no link failure evidence returned`
        : undefined;
    return { total: result.total, failures, checkerError };
  } catch (error) {
    return {
      total: 0,
      failures: [],
      checkerError: stderr.trim() || `Invalid lychee output: ${String(error)}`,
    };
  }
}

export function sitemapLocations(xml: string): string[] {
  const dom = new JSDOM(xml, { contentType: 'text/xml' });
  const locations = [...dom.window.document.querySelectorAll('loc')]
    .map((node) => node.textContent?.trim() ?? '')
    .filter(Boolean);
  dom.window.close();
  return locations;
}

export function extractLinks(html: string, parent: string): string[] {
  // JSDOM parses markup only: no browser, scripts, resources or navigation are started.
  const fragment = JSDOM.fragment(html);
  const links = new Set<string>();
  const add = (value: string) => {
    try {
      const url = new URL(value, parent);
      // Cloudflare injects hidden, short-lived crawler decoys at this managed endpoint.
      // They are not site content. Keep checking real /cdn-cgi/image/ resources.
      if (url.origin === new URL(parent).origin && url.pathname === '/cdn-cgi/content') return;
      if (url.protocol === 'http:' || url.protocol === 'https:') links.add(url.href);
    } catch {
      /* Non-HTTP schemes and invalid URL values have no HTTP status to check. */
    }
  };
  for (const node of fragment.querySelectorAll('[href], [src], [srcset]')) {
    const relations = (node.getAttribute('rel') ?? '').trim().toLowerCase().split(/\s+/);
    // Connection hints name servers, not documents to fetch. Real links and
    // resource requests (stylesheet, preload, icons, etc.) must still be checked.
    if (
      node.tagName === 'LINK' &&
      relations.every((relation) => ['preconnect', 'dns-prefetch'].includes(relation))
    )
      continue;
    for (const attr of ['href', 'src']) {
      const value = node.getAttribute(attr);
      if (value) add(value);
    }
    for (const candidate of (node.getAttribute('srcset') ?? '').split(',')) {
      const value = candidate.trim().split(/\s+/)[0];
      if (value) add(value);
    }
  }
  const walk = (value: unknown, key = '') => {
    if (
      typeof value === 'string' &&
      ['logo', 'image', 'url', 'contentUrl', 'thumbnailUrl', 'item'].includes(key)
    )
      add(value);
    else if (Array.isArray(value)) for (const item of value) walk(item, key);
    else if (value && typeof value === 'object')
      for (const [name, item] of Object.entries(value)) walk(item, name);
  };
  for (const node of fragment.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      walk(JSON.parse(node.textContent ?? 'null'));
    } catch {
      /* JSON-LD validation is handled separately from HTTP link status. */
    }
  }
  return [...links];
}

export function createPageReader(): (url: string) => Promise<Response> {
  // All sitemap workers share a cooldown. A blocked worker must not leave
  // the other workers sending more requests during the server's Retry-After.
  let blockedUntil = 0;
  let nextStart = 0;
  let spacing = 0;
  const sleep = (milliseconds: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
  return async (url) => {
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      while (Math.max(blockedUntil, nextStart) > Date.now())
        await sleep(Math.max(blockedUntil, nextStart) - Date.now());
      nextStart = Date.now() + spacing;
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(30_000),
          headers: { 'User-Agent': 'SoundBlue-LinkAudit/1.0' },
        });
        if (response.status === 429) {
          const now = Date.now();
          const retryAfter = response.headers.get('retry-after')?.trim() ?? '';
          const retryAt = /^\d+$/.test(retryAfter)
            ? now + Number(retryAfter) * 1_000
            : Date.parse(retryAfter);
          const cooldown = Number.isFinite(retryAt) ? Math.max(1_000, retryAt - now) : 60_000;
          if (now >= blockedUntil) spacing = Math.min(5_000, Math.max(500, spacing * 2));
          blockedUntil = Math.max(blockedUntil, now + cooldown);
        }
        if (
          (response.status < 500 && response.status !== 404 && response.status !== 429) ||
          attempt === 2
        )
          return response;
        await response.body?.cancel();
        if (response.status !== 429) await sleep(1_000 * 2 ** attempt);
      } catch (error) {
        lastError = error;
        if (attempt < 2) await sleep(1_000 * 2 ** attempt);
      }
    }
    throw lastError ?? new Error(`Request failed: ${url}`);
  };
}

export async function auditSite(
  origin: string,
  outputDirectory: string,
  internalOnly = false,
): Promise<LinkReport & { pages: number }> {
  const root = new URL(origin).origin;
  const readUrl = createPageReader();
  const pages = new Set<string>([`${root}/`]);
  const sitemaps = new Set<string>();
  const failures: LinkFailure[] = [];
  const sources = new Map<string, string>();
  const addFailure = (url: string, parent: string, status: number, detail?: string) =>
    failures.push({ url, parent, status, kind: classifyFailure(status), detail });
  const visitSitemap = async (url: string): Promise<void> => {
    if (sitemaps.has(url)) return;
    if (new URL(url).origin !== root) throw new Error(`Unexpected sitemap origin: ${url}`);
    sitemaps.add(url);
    const response = await readUrl(url);
    if (!response.ok) throw new Error(`Sitemap unavailable (${response.status}): ${url}`);
    const xml = await response.text();
    const locations = sitemapLocations(xml);
    if (!locations.length) throw new Error(`Sitemap contains no URLs: ${url}`);
    for (const sourceLocation of locations) {
      const location = internalOnly
        ? new URL(new URL(sourceLocation).pathname + new URL(sourceLocation).search, root).href
        : sourceLocation;
      if (/<(?:\w+:)?sitemapindex[\s>]/.test(xml)) await visitSitemap(location);
      else {
        if (new URL(location).origin !== root)
          throw new Error(`Unexpected page origin: ${location}`);
        pages.add(location);
      }
    }
  };
  // Local dev servers also publish the same sitemap routes; entry pages are never excluded.
  await visitSitemap(`${root}/sitemap.xml`);
  const queue = [...pages];
  let index = 0;
  let completed = 0;
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (index < queue.length) {
        const url = queue[index++];
        try {
          const response = await readUrl(url);
          if (!response.ok) addFailure(url, 'sitemap', response.status);
          else {
            sources.set(url, 'sitemap');
            if ((response.headers.get('content-type') ?? '').includes('html')) {
              for (const link of extractLinks(await response.text(), response.url)) {
                if (!internalOnly || new URL(link).origin === root) sources.set(link, url);
              }
            } else await response.body?.cancel();
          }
        } catch (error) {
          addFailure(url, 'sitemap', 0, String(error));
        }
        completed++;
        if (completed % 500 === 0)
          console.log(`${root}: fetched ${completed}/${queue.length} sitemap pages`);
      }
    }),
  );
  mkdirSync(outputDirectory, { recursive: true });
  const input = join(outputDirectory, 'urls.txt');
  writeFileSync(input, [...sources.keys()].join('\n'));
  // Feed absolute URLs as text. This checks each sitemap page itself as well as its links.
  // Argument arrays avoid shell interpretation, and no unsupported regex look-around is used.
  const args = [
    '--config',
    '.lychee.toml',
    '--format',
    'json',
    '--no-progress',
    '--cache',
    '--max-cache-age',
    '0s',
  ];
  if (internalOnly)
    args.push(
      '--exclude',
      '.*',
      '--include',
      `^${root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:/|$)`,
    );
  args.push(input);
  const result = spawnSync('lychee', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  writeFileSync(join(outputDirectory, 'lychee.json'), result.stdout ?? '');
  writeFileSync(join(outputDirectory, 'lychee.stderr.txt'), result.stderr ?? '');
  const report = parseLycheeOutput(
    result.stdout ?? '',
    result.status ?? 1,
    result.error?.message ?? result.stderr ?? '',
  );
  for (const failure of report.failures)
    failure.parent = sources.get(failure.url) ?? failure.parent;
  const unique = new Map(
    [...failures, ...report.failures].map((failure) => [`${failure.url}:${failure.kind}`, failure]),
  );
  const fullReport = { ...report, failures: [...unique.values()], pages: pages.size };
  writeFileSync(join(outputDirectory, 'report.json'), JSON.stringify(fullReport, null, 2));
  return fullReport;
}
