import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPageReader } from '../../../scripts/lib/link-audit';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('sitemap request backoff', () => {
  it('waits for Retry-After before retrying a rate-limited page', async () => {
    vi.useFakeTimers();
    const requestedAt: number[] = [];
    vi.stubGlobal('fetch', async () => {
      requestedAt.push(Date.now());
      return requestedAt.length === 1
        ? new Response('Too many requests', { status: 429, headers: { 'Retry-After': '2' } })
        : new Response('<main>Available</main>');
    });
    const result = createPageReader()('https://roots.example/concept/math');
    await vi.advanceTimersByTimeAsync(1_999);
    expect(requestedAt).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1);
    expect((await result).status).toBe(200);
    expect(requestedAt[1] - requestedAt[0]).toBe(2_000);
  });

  it('honors HTTP-date Retry-After values', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-02T07:00:00Z'));
    const requestedAt: number[] = [];
    vi.stubGlobal('fetch', async () => {
      requestedAt.push(Date.now());
      return requestedAt.length === 1
        ? new Response(null, {
            status: 429,
            headers: { 'Retry-After': 'Mon, 02 Nov 2026 07:00:03 GMT' },
          })
        : new Response('Available');
    });
    const result = createPageReader()('https://roots.example/concept/date');
    await vi.advanceTimersByTimeAsync(3_000);
    expect((await result).status).toBe(200);
    expect(requestedAt[1] - requestedAt[0]).toBe(3_000);
  });

  it('shares the cooldown and spaces concurrent workers after a block', async () => {
    vi.useFakeTimers();
    const requestedAt: number[] = [];
    vi.stubGlobal('fetch', async () => {
      requestedAt.push(Date.now());
      return requestedAt.length === 1
        ? new Response(null, { status: 429, headers: { 'Retry-After': '2' } })
        : new Response('Available');
    });
    const read = createPageReader();
    const first = read('https://roots.example/a');
    await vi.advanceTimersByTimeAsync(0);
    const second = read('https://roots.example/b');
    await vi.advanceTimersByTimeAsync(1_999);
    expect(requestedAt).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(501);
    expect((await first).status).toBe(200);
    expect((await second).status).toBe(200);
    expect(requestedAt[1] - requestedAt[0]).toBe(2_000);
    expect(requestedAt[2] - requestedAt[1]).toBe(500);
  });

  it.each([null, 'invalid'])('retains repeated 429 evidence with Retry-After %s', async (header) => {
    vi.useFakeTimers();
    const requestedAt: number[] = [];
    vi.stubGlobal('fetch', async () => {
      requestedAt.push(Date.now());
      return new Response(null, {
        status: 429,
        headers: header ? { 'Retry-After': header } : {},
      });
    });
    const result = createPageReader()('https://roots.example/blocked');
    await vi.advanceTimersByTimeAsync(120_000);
    expect((await result).status).toBe(429);
    expect(requestedAt).toHaveLength(3);
    expect(requestedAt[2] - requestedAt[0]).toBe(120_000);
  });

  it.each([404, 503])('backs off transient HTTP %s failures without hiding a final failure', async (status) => {
    vi.useFakeTimers();
    const requestedAt: number[] = [];
    vi.stubGlobal('fetch', async () => {
      requestedAt.push(Date.now());
      return new Response(null, { status });
    });
    const result = createPageReader()('https://roots.example/transient');
    await vi.advanceTimersByTimeAsync(3_000);
    expect((await result).status).toBe(status);
    expect(requestedAt[2] - requestedAt[0]).toBe(3_000);
    expect(requestedAt).toHaveLength(3);
  });

  it('does not retry a permanent missing page response', async () => {
    let requests = 0;
    vi.stubGlobal('fetch', async () => {
      requests++;
      return new Response(null, { status: 410 });
    });
    expect((await createPageReader()('https://roots.example/gone')).status).toBe(410);
    expect(requests).toBe(1);
  });
});
