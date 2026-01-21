/**
 * @fileoverview Unit tests for Search Web Worker
 *
 * Web Worker의 메시지 핸들링 로직을 테스트합니다.
 * Worker 환경을 모킹하여 INIT, SEARCH, SUGGEST 메시지 처리를 검증합니다.
 */

import { SearchEngine } from '@soundblue/search/core/engine';
import type { SearchConfig, WorkerMessage, SearchableItem } from '@soundblue/search/core/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Worker 환경 모킹
const mockPostMessage = vi.fn();
const mockSelf = {
  postMessage: mockPostMessage,
  onmessage: null as ((e: MessageEvent<WorkerMessage>) => void) | null,
};

// Worker 로직 재현 (실제 worker 파일의 로직을 테스트)
describe('Search Worker Logic', () => {
  let engine: SearchEngine<SearchableItem> | null = null;

  const handleMessage = async (message: WorkerMessage) => {
    switch (message.type) {
      case 'INIT': {
        const { config, data } = message.payload;
        engine = new SearchEngine(config);
        engine.addAll(data);
        mockPostMessage({ type: 'READY' });
        break;
      }
      case 'SEARCH': {
        if (!engine) {
          mockPostMessage({ type: 'ERROR', error: 'Engine not initialized' });
          return;
        }
        const { query, limit } = message.payload;
        const results = engine.search(query, limit);
        mockPostMessage({ type: 'RESULTS', payload: results });
        break;
      }
      case 'SUGGEST': {
        if (!engine) {
          mockPostMessage({ type: 'ERROR', error: 'Engine not initialized' });
          return;
        }
        const { query, limit } = message.payload;
        const suggestions = engine.suggest(query, limit);
        mockPostMessage({ type: 'SUGGESTIONS', payload: suggestions });
        break;
      }
    }
  };

  beforeEach(() => {
    engine = null;
    mockPostMessage.mockClear();
  });

  const testConfig: SearchConfig = {
    fields: ['title', 'content'],
    storeFields: ['id', 'title'],
    searchOptions: {
      boost: { title: 2 },
      fuzzy: 0.2,
      prefix: true,
    },
  };

  const testData: SearchableItem[] = [
    { id: '1', title: 'Hello World', content: 'A greeting message' },
    { id: '2', title: 'Goodbye World', content: 'A farewell message' },
    { id: '3', title: 'Hello Again', content: 'Another greeting' },
  ];

  describe('INIT message', () => {
    it('should initialize engine and send READY', async () => {
      const initMessage: WorkerMessage = {
        type: 'INIT',
        payload: { config: testConfig, data: testData },
      };

      await handleMessage(initMessage);

      expect(mockPostMessage).toHaveBeenCalledWith({ type: 'READY' });
      expect(engine).not.toBeNull();
    });

    it('should initialize with empty data', async () => {
      const initMessage: WorkerMessage = {
        type: 'INIT',
        payload: { config: testConfig, data: [] },
      };

      await handleMessage(initMessage);

      expect(mockPostMessage).toHaveBeenCalledWith({ type: 'READY' });
    });

    it('should reinitialize when INIT is called multiple times', async () => {
      // First init
      await handleMessage({
        type: 'INIT',
        payload: { config: testConfig, data: testData },
      });

      // Second init with different data
      await handleMessage({
        type: 'INIT',
        payload: { config: testConfig, data: [{ id: 'new', title: 'New Item', content: 'New' }] },
      });

      expect(mockPostMessage).toHaveBeenCalledTimes(2);

      // Search should use new data
      await handleMessage({
        type: 'SEARCH',
        payload: { query: 'New', limit: 10 },
      });

      const searchCall = mockPostMessage.mock.calls[2];
      expect(searchCall[0].type).toBe('RESULTS');
      expect(searchCall[0].payload).toHaveLength(1);
    });
  });

  describe('SEARCH message', () => {
    beforeEach(async () => {
      // Initialize engine before search tests
      await handleMessage({
        type: 'INIT',
        payload: { config: testConfig, data: testData },
      });
      mockPostMessage.mockClear();
    });

    it('should return search results', async () => {
      await handleMessage({
        type: 'SEARCH',
        payload: { query: 'Hello', limit: 10 },
      });

      expect(mockPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'RESULTS',
          payload: expect.any(Array),
        })
      );

      const results = mockPostMessage.mock.calls[0][0].payload;
      expect(results.length).toBeGreaterThan(0);
    });

    it('should respect limit parameter', async () => {
      await handleMessage({
        type: 'SEARCH',
        payload: { query: 'Hello', limit: 1 },
      });

      const results = mockPostMessage.mock.calls[0][0].payload;
      expect(results.length).toBeLessThanOrEqual(1);
    });

    it('should return empty array for no matches', async () => {
      await handleMessage({
        type: 'SEARCH',
        payload: { query: 'nonexistent', limit: 10 },
      });

      const results = mockPostMessage.mock.calls[0][0].payload;
      expect(results).toEqual([]);
    });

    it('should handle empty query', async () => {
      await handleMessage({
        type: 'SEARCH',
        payload: { query: '', limit: 10 },
      });

      expect(mockPostMessage).toHaveBeenCalled();
      const response = mockPostMessage.mock.calls[0][0];
      expect(response.type).toBe('RESULTS');
    });
  });

  describe('SUGGEST message', () => {
    beforeEach(async () => {
      await handleMessage({
        type: 'INIT',
        payload: { config: testConfig, data: testData },
      });
      mockPostMessage.mockClear();
    });

    it('should return suggestions', async () => {
      await handleMessage({
        type: 'SUGGEST',
        payload: { query: 'Hel', limit: 5 },
      });

      expect(mockPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SUGGESTIONS',
          payload: expect.any(Array),
        })
      );
    });

    it('should respect limit parameter', async () => {
      await handleMessage({
        type: 'SUGGEST',
        payload: { query: 'Hello', limit: 1 },
      });

      const suggestions = mockPostMessage.mock.calls[0][0].payload;
      expect(suggestions.length).toBeLessThanOrEqual(1);
    });

    it('should return empty array for no matches', async () => {
      await handleMessage({
        type: 'SUGGEST',
        payload: { query: 'xyz', limit: 5 },
      });

      const suggestions = mockPostMessage.mock.calls[0][0].payload;
      expect(suggestions).toEqual([]);
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      engine = null;
      mockPostMessage.mockClear();
    });

    it('should return error for SEARCH without INIT', async () => {
      await handleMessage({
        type: 'SEARCH',
        payload: { query: 'test', limit: 10 },
      });

      expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'ERROR',
        error: 'Engine not initialized',
      });
    });

    it('should return error for SUGGEST without INIT', async () => {
      await handleMessage({
        type: 'SUGGEST',
        payload: { query: 'test', limit: 5 },
      });

      expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'ERROR',
        error: 'Engine not initialized',
      });
    });
  });

  describe('Message Protocol', () => {
    it('INIT message should have correct structure', () => {
      const initMessage: WorkerMessage = {
        type: 'INIT',
        payload: { config: testConfig, data: testData },
      };

      expect(initMessage.type).toBe('INIT');
      expect(initMessage.payload.config).toBeDefined();
      expect(initMessage.payload.data).toBeDefined();
    });

    it('SEARCH message should have correct structure', () => {
      const searchMessage: WorkerMessage = {
        type: 'SEARCH',
        payload: { query: 'test', limit: 10 },
      };

      expect(searchMessage.type).toBe('SEARCH');
      expect(searchMessage.payload.query).toBe('test');
      expect(searchMessage.payload.limit).toBe(10);
    });

    it('SUGGEST message should have correct structure', () => {
      const suggestMessage: WorkerMessage = {
        type: 'SUGGEST',
        payload: { query: 'test', limit: 5 },
      };

      expect(suggestMessage.type).toBe('SUGGEST');
      expect(suggestMessage.payload.query).toBe('test');
      expect(suggestMessage.payload.limit).toBe(5);
    });

    it('READY response should have correct structure', async () => {
      await handleMessage({
        type: 'INIT',
        payload: { config: testConfig, data: testData },
      });

      expect(mockPostMessage).toHaveBeenCalledWith({ type: 'READY' });
    });

    it('RESULTS response should have correct structure', async () => {
      await handleMessage({
        type: 'INIT',
        payload: { config: testConfig, data: testData },
      });
      mockPostMessage.mockClear();

      await handleMessage({
        type: 'SEARCH',
        payload: { query: 'Hello', limit: 10 },
      });

      const response = mockPostMessage.mock.calls[0][0];
      expect(response.type).toBe('RESULTS');
      expect(response.payload).toBeDefined();
      expect(Array.isArray(response.payload)).toBe(true);
    });

    it('SUGGESTIONS response should have correct structure', async () => {
      await handleMessage({
        type: 'INIT',
        payload: { config: testConfig, data: testData },
      });
      mockPostMessage.mockClear();

      await handleMessage({
        type: 'SUGGEST',
        payload: { query: 'Hel', limit: 5 },
      });

      const response = mockPostMessage.mock.calls[0][0];
      expect(response.type).toBe('SUGGESTIONS');
      expect(response.payload).toBeDefined();
      expect(Array.isArray(response.payload)).toBe(true);
    });

    it('ERROR response should have correct structure', async () => {
      await handleMessage({
        type: 'SEARCH',
        payload: { query: 'test', limit: 10 },
      });

      const response = mockPostMessage.mock.calls[0][0];
      expect(response.type).toBe('ERROR');
      expect(response.error).toBeDefined();
      expect(typeof response.error).toBe('string');
    });
  });

  describe('Performance considerations', () => {
    it('should handle large datasets', async () => {
      const largeData: SearchableItem[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `item-${i}`,
        title: `Item ${i} with title`,
        content: `Content for item ${i}`,
      }));

      await handleMessage({
        type: 'INIT',
        payload: { config: testConfig, data: largeData },
      });

      expect(mockPostMessage).toHaveBeenCalledWith({ type: 'READY' });
      mockPostMessage.mockClear();

      await handleMessage({
        type: 'SEARCH',
        payload: { query: 'Item', limit: 10 },
      });

      const response = mockPostMessage.mock.calls[0][0];
      expect(response.type).toBe('RESULTS');
      expect(response.payload.length).toBeLessThanOrEqual(10);
    });

    it('should handle queries with special characters', async () => {
      await handleMessage({
        type: 'INIT',
        payload: { config: testConfig, data: testData },
      });
      mockPostMessage.mockClear();

      await handleMessage({
        type: 'SEARCH',
        payload: { query: 'Hello!@#$%', limit: 10 },
      });

      // Should not throw, should return results or empty array
      expect(mockPostMessage).toHaveBeenCalled();
      const response = mockPostMessage.mock.calls[0][0];
      expect(['RESULTS', 'ERROR']).toContain(response.type);
    });

    it('should handle Korean characters in query', async () => {
      const koreanData: SearchableItem[] = [
        { id: '1', title: '안녕하세요', content: '한국어 테스트' },
        { id: '2', title: '반갑습니다', content: '또 다른 테스트' },
      ];

      await handleMessage({
        type: 'INIT',
        payload: { config: testConfig, data: koreanData },
      });
      mockPostMessage.mockClear();

      await handleMessage({
        type: 'SEARCH',
        payload: { query: '안녕', limit: 10 },
      });

      expect(mockPostMessage).toHaveBeenCalled();
      const response = mockPostMessage.mock.calls[0][0];
      expect(response.type).toBe('RESULTS');
    });
  });
});

/**
 * Tests for the actual search.worker.ts file
 *
 * The worker runs in a Web Worker context with `self.onmessage`.
 * Since Vitest runs in Node.js, we import the module and simulate
 * the Web Worker environment by mocking `self` and `postMessage`.
 */
describe('Search Worker Module (Actual File Coverage)', () => {
  let mockPostMessageFn: ReturnType<typeof vi.fn>;
  let originalSelf: typeof globalThis;

  beforeEach(() => {
    // Save original self
    originalSelf = globalThis.self;

    // Create mock postMessage
    mockPostMessageFn = vi.fn();

    // Mock self with postMessage
    (globalThis as unknown as { self: { postMessage: typeof mockPostMessageFn; onmessage: null | ((e: MessageEvent) => void) } }).self = {
      postMessage: mockPostMessageFn,
      onmessage: null,
    };
  });

  afterEach(() => {
    // Restore original self
    (globalThis as unknown as { self: typeof originalSelf }).self = originalSelf;
    vi.resetModules();
  });

  it('should register onmessage handler when module loads', async () => {
    // Dynamic import to trigger module execution with mocked self
    await import('@soundblue/search/worker/search.worker');

    // The worker should have set self.onmessage
    expect((globalThis as unknown as { self: { onmessage: unknown } }).self.onmessage).toBeDefined();
  });

  it('should handle INIT message and post READY', async () => {
    await import('@soundblue/search/worker/search.worker');

    const onmessage = (globalThis as unknown as { self: { onmessage: (e: MessageEvent) => Promise<void> } }).self.onmessage;

    await onmessage({
      data: {
        type: 'INIT',
        payload: {
          config: {
            fields: ['title'],
            storeFields: ['id', 'title'],
          },
          data: [{ id: '1', title: 'Test' }],
        },
      },
    } as MessageEvent);

    expect(mockPostMessageFn).toHaveBeenCalledWith({ type: 'READY' });
  });

  it('should handle SEARCH message after INIT', async () => {
    await import('@soundblue/search/worker/search.worker');

    const onmessage = (globalThis as unknown as { self: { onmessage: (e: MessageEvent) => Promise<void> } }).self.onmessage;

    // Initialize first
    await onmessage({
      data: {
        type: 'INIT',
        payload: {
          config: {
            fields: ['title'],
            storeFields: ['id', 'title'],
          },
          data: [{ id: '1', title: 'Hello World' }],
        },
      },
    } as MessageEvent);

    mockPostMessageFn.mockClear();

    // Search
    await onmessage({
      data: {
        type: 'SEARCH',
        payload: { query: 'Hello', limit: 10 },
      },
    } as MessageEvent);

    expect(mockPostMessageFn).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'RESULTS',
        payload: expect.any(Array),
      })
    );
  });

  it('should handle SUGGEST message after INIT', async () => {
    await import('@soundblue/search/worker/search.worker');

    const onmessage = (globalThis as unknown as { self: { onmessage: (e: MessageEvent) => Promise<void> } }).self.onmessage;

    // Initialize first
    await onmessage({
      data: {
        type: 'INIT',
        payload: {
          config: {
            fields: ['title'],
            storeFields: ['id', 'title'],
          },
          data: [{ id: '1', title: 'Hello World' }],
        },
      },
    } as MessageEvent);

    mockPostMessageFn.mockClear();

    // Suggest
    await onmessage({
      data: {
        type: 'SUGGEST',
        payload: { query: 'Hel', limit: 5 },
      },
    } as MessageEvent);

    expect(mockPostMessageFn).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SUGGESTIONS',
        payload: expect.any(Array),
      })
    );
  });

  it('should return ERROR for SEARCH without INIT', async () => {
    vi.resetModules();

    // Re-mock self after reset
    mockPostMessageFn = vi.fn();
    (globalThis as unknown as { self: { postMessage: typeof mockPostMessageFn; onmessage: null | ((e: MessageEvent) => void) } }).self = {
      postMessage: mockPostMessageFn,
      onmessage: null,
    };

    await import('@soundblue/search/worker/search.worker');

    const onmessage = (globalThis as unknown as { self: { onmessage: (e: MessageEvent) => Promise<void> } }).self.onmessage;

    // Search without init
    await onmessage({
      data: {
        type: 'SEARCH',
        payload: { query: 'test', limit: 10 },
      },
    } as MessageEvent);

    expect(mockPostMessageFn).toHaveBeenCalledWith({
      type: 'ERROR',
      error: 'Engine not initialized',
    });
  });

  it('should return ERROR for SUGGEST without INIT', async () => {
    vi.resetModules();

    // Re-mock self after reset
    mockPostMessageFn = vi.fn();
    (globalThis as unknown as { self: { postMessage: typeof mockPostMessageFn; onmessage: null | ((e: MessageEvent) => void) } }).self = {
      postMessage: mockPostMessageFn,
      onmessage: null,
    };

    await import('@soundblue/search/worker/search.worker');

    const onmessage = (globalThis as unknown as { self: { onmessage: (e: MessageEvent) => Promise<void> } }).self.onmessage;

    // Suggest without init
    await onmessage({
      data: {
        type: 'SUGGEST',
        payload: { query: 'test', limit: 5 },
      },
    } as MessageEvent);

    expect(mockPostMessageFn).toHaveBeenCalledWith({
      type: 'ERROR',
      error: 'Engine not initialized',
    });
  });
});
