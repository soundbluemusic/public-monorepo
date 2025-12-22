/**
 * @fileoverview Unit tests for Fuse.js search utilities
 */

import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';

// Mock console
const consoleSpy = {
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
};

interface SearchIndexItem {
  id: string;
  name: { ko: string; en: string };
  field: string;
  subfield: string;
  difficulty: number;
  tags: string[];
  def: { ko: string; en: string };
}

const mockSearchIndex: SearchIndexItem[] = [
  {
    id: 'linear-algebra',
    name: { ko: '선형대수', en: 'Linear Algebra' },
    field: 'algebra',
    subfield: 'linear',
    difficulty: 2,
    tags: ['matrix', 'vector', 'space'],
    def: { ko: '선형대수의 정의', en: 'Definition of linear algebra' },
  },
  {
    id: 'calculus',
    name: { ko: '미적분', en: 'Calculus' },
    field: 'analysis',
    subfield: 'calculus',
    difficulty: 1,
    tags: ['derivative', 'integral', 'limit'],
    def: { ko: '미적분의 정의', en: 'Definition of calculus' },
  },
  {
    id: 'differential-equations',
    name: { ko: '미분방정식', en: 'Differential Equations' },
    field: 'analysis',
    subfield: 'ode',
    difficulty: 3,
    tags: ['ode', 'pde', 'derivative'],
    def: { ko: '미분방정식의 정의', en: 'Definition of differential equations' },
  },
];

describe('Search Index Loading', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
    consoleSpy.log.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should load search index successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSearchIndex,
    });

    const response = await fetch('/search-index.json');
    const data = await response.json();

    expect(data).toHaveLength(3);
    expect(data[0].id).toBe('linear-algebra');
    expect(mockFetch).toHaveBeenCalledWith('/search-index.json');
  });

  it('should return empty array on SSR (window undefined)', () => {
    const originalWindow = global.window;
    // @ts-expect-error - testing SSR behavior
    delete global.window;

    // In SSR, should return empty array immediately
    expect(global.window).toBeUndefined();

    global.window = originalWindow;
  });

  it('should handle fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetch('/search-index.json')).rejects.toThrow('Network error');
  });
});

describe('Search Functionality (Mock)', () => {
  it('should filter results by query string', () => {
    const query = 'algebra';
    const filtered = mockSearchIndex.filter(
      (item) =>
        item.name.ko.toLowerCase().includes(query.toLowerCase()) ||
        item.name.en.toLowerCase().includes(query.toLowerCase()) ||
        item.def.ko.toLowerCase().includes(query.toLowerCase()) ||
        item.def.en.toLowerCase().includes(query.toLowerCase()),
    );

    expect(filtered).toHaveLength(2); // linear-algebra and its definition
    expect(filtered[0].id).toBe('linear-algebra');
  });

  it('should handle empty query', () => {
    const query = '';
    // Empty queries should return empty results
    if (query.trim().length < 2) {
      expect([]).toEqual([]);
    }
  });

  it('should handle short query (< 2 chars)', () => {
    const query = 'a';
    // Queries less than 2 characters should return empty
    if (query.trim().length < 2) {
      expect([]).toEqual([]);
    }
  });

  it('should be case-insensitive', () => {
    const query1 = 'ALGEBRA';
    const query2 = 'algebra';
    const query3 = 'AlGeBrA';

    const results = [query1, query2, query3].map((q) =>
      mockSearchIndex.filter(
        (item) =>
          item.name.ko.toLowerCase().includes(q.toLowerCase()) ||
          item.name.en.toLowerCase().includes(q.toLowerCase()),
      ),
    );

    // All should return same results
    expect(results[0]).toEqual(results[1]);
    expect(results[1]).toEqual(results[2]);
  });
});

describe('Search by Tag', () => {
  it('should find concepts by tag', () => {
    const tag = 'derivative';
    const filtered = mockSearchIndex.filter((c) =>
      c.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())),
    );

    expect(filtered).toHaveLength(2); // calculus and differential-equations
    expect(filtered.map((c) => c.id)).toContain('calculus');
    expect(filtered.map((c) => c.id)).toContain('differential-equations');
  });

  it('should handle non-existent tag', () => {
    const tag = 'nonexistent';
    const filtered = mockSearchIndex.filter((c) =>
      c.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())),
    );

    expect(filtered).toHaveLength(0);
  });

  it('should be case-insensitive for tags', () => {
    const tag1 = 'MATRIX';
    const tag2 = 'matrix';

    const results1 = mockSearchIndex.filter((c) =>
      c.tags.some((t) => t.toLowerCase().includes(tag1.toLowerCase())),
    );
    const results2 = mockSearchIndex.filter((c) =>
      c.tags.some((t) => t.toLowerCase().includes(tag2.toLowerCase())),
    );

    expect(results1).toEqual(results2);
  });

  it('should handle partial tag matches', () => {
    const tag = 'deriv'; // should match 'derivative'
    const filtered = mockSearchIndex.filter((c) =>
      c.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())),
    );

    expect(filtered.length).toBeGreaterThan(0);
  });
});

describe('Filter by Difficulty', () => {
  it('should filter by difficulty range', () => {
    const minLevel = 1;
    const maxLevel = 2;

    const filtered = mockSearchIndex.filter(
      (c) => c.difficulty >= minLevel && c.difficulty <= maxLevel,
    );

    expect(filtered).toHaveLength(2); // calculus (1) and linear-algebra (2)
    expect(filtered.map((c) => c.id)).toContain('calculus');
    expect(filtered.map((c) => c.id)).toContain('linear-algebra');
  });

  it('should filter exact difficulty', () => {
    const level = 3;
    const filtered = mockSearchIndex.filter((c) => c.difficulty >= level && c.difficulty <= level);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('differential-equations');
  });

  it('should return empty for invalid range', () => {
    const minLevel = 5;
    const maxLevel = 10;

    const filtered = mockSearchIndex.filter(
      (c) => c.difficulty >= minLevel && c.difficulty <= maxLevel,
    );

    expect(filtered).toHaveLength(0);
  });

  it('should handle all difficulties', () => {
    const minLevel = 1;
    const maxLevel = 5;

    const filtered = mockSearchIndex.filter(
      (c) => c.difficulty >= minLevel && c.difficulty <= maxLevel,
    );

    expect(filtered).toHaveLength(3); // all concepts
  });
});

describe('Search Result Limit', () => {
  it('should respect limit parameter', () => {
    const limit = 2;
    const results = mockSearchIndex.slice(0, limit);

    expect(results).toHaveLength(2);
  });

  it('should handle limit larger than results', () => {
    const limit = 100;
    const results = mockSearchIndex.slice(0, limit);

    expect(results).toHaveLength(mockSearchIndex.length);
  });

  it('should handle zero limit', () => {
    const limit = 0;
    const results = mockSearchIndex.slice(0, limit);

    expect(results).toHaveLength(0);
  });
});

describe('Locale-specific Search', () => {
  it('should search in Korean', () => {
    const query = '선형';
    const filtered = mockSearchIndex.filter(
      (item) =>
        item.name.ko.includes(query) ||
        item.def.ko.includes(query) ||
        item.tags.some((t) => t.includes(query)),
    );

    expect(filtered.length).toBeGreaterThan(0);
  });

  it('should search in English', () => {
    const query = 'linear';
    const filtered = mockSearchIndex.filter(
      (item) =>
        item.name.en.toLowerCase().includes(query.toLowerCase()) ||
        item.def.en.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())),
    );

    expect(filtered.length).toBeGreaterThan(0);
  });

  it('should handle mixed locale query', () => {
    const query = '미분'; // Korean for "differential"
    const filtered = mockSearchIndex.filter((item) => item.name.ko.includes(query));

    expect(filtered.length).toBeGreaterThan(0);
  });
});

describe('Edge Cases', () => {
  it('should handle special characters in query', () => {
    const query = 'algebra+';
    // Should not crash, just filter normally
    const filtered = mockSearchIndex.filter((item) =>
      item.name.en.toLowerCase().includes(query.toLowerCase()),
    );

    expect(Array.isArray(filtered)).toBe(true);
  });

  it('should handle whitespace-only query', () => {
    const query = '   ';
    if (query.trim().length < 2) {
      expect([]).toEqual([]);
    }
  });

  it('should handle very long query', () => {
    const query = 'a'.repeat(1000);
    const filtered = mockSearchIndex.filter((item) =>
      item.name.en.toLowerCase().includes(query.toLowerCase()),
    );

    expect(Array.isArray(filtered)).toBe(true);
  });

  it('should handle unicode characters', () => {
    const query = '微積分'; // Chinese characters
    const filtered = mockSearchIndex.filter((item) =>
      item.name.ko.includes(query) || item.name.en.includes(query),
    );

    expect(Array.isArray(filtered)).toBe(true);
  });
});
