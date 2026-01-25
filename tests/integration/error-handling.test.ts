/**
 * @fileoverview 에러 처리 통합 테스트
 *
 * 네트워크 실패, 타임아웃, 데이터 파싱 에러 등 다양한 에러 시나리오를 테스트합니다.
 */

import { describe, expect, it, vi } from 'vitest';

// Mock fetch 유틸리티
function createMockFetch(options?: {
  status?: number;
  statusText?: string;
  data?: unknown;
  shouldThrow?: boolean;
  throwError?: Error;
}) {
  const {
    status = 200,
    statusText = 'OK',
    data = {},
    shouldThrow = false,
    throwError,
  } = options || {};

  return vi.fn(async () => {
    if (shouldThrow) {
      throw throwError || new Error('Network error');
    }

    return {
      ok: status >= 200 && status < 300,
      status,
      statusText,
      json: async () => data,
      text: async () => JSON.stringify(data),
      headers: new Headers(),
    } as Response;
  });
}

// 에러 핸들링 유틸리티 함수들 - 동기적 retry (테스트용)
async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit & { retries?: number },
  fetchFn: typeof fetch = fetch,
): Promise<T> {
  const { retries = 3, ...fetchOptions } = options || {};

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchFn(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError || new Error('All retries failed');
}

function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

function handleApiError(error: unknown): { message: string; code: string } {
  // Check for DOMException (AbortError) first - handles jsdom environment
  if (error instanceof DOMException && error.name === 'AbortError') {
    return { message: 'Request timed out', code: 'TIMEOUT' };
  }
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return { message: 'Request timed out', code: 'TIMEOUT' };
    }
    if (error.message.includes('Network')) {
      return { message: 'Network error occurred', code: 'NETWORK_ERROR' };
    }
    if (error.message.includes('HTTP error')) {
      const match = error.message.match(/status: (\d+)/);
      const status = match ? match[1] : 'unknown';
      return { message: `Server error (${status})`, code: `HTTP_${status}` };
    }
    return { message: error.message, code: 'UNKNOWN_ERROR' };
  }
  return { message: 'An unknown error occurred', code: 'UNKNOWN_ERROR' };
}

// 테스트 시작
describe('Error Handling', () => {
  describe('fetchWithRetry', () => {
    it('should succeed on first attempt', async () => {
      const mockFetch = createMockFetch({ data: { success: true } });

      const result = await fetchWithRetry<{ success: boolean }>(
        'https://api.example.com/data',
        { retries: 3 },
        mockFetch,
      );

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on network failure', async () => {
      const mockFetch = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        });

      const result = await fetchWithRetry<{ success: boolean }>(
        'https://api.example.com/data',
        { retries: 3 },
        mockFetch,
      );

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should throw after all retries exhausted', async () => {
      const mockFetch = createMockFetch({ shouldThrow: true });

      await expect(
        fetchWithRetry<{ success: boolean }>(
          'https://api.example.com/data',
          { retries: 2 },
          mockFetch,
        ),
      ).rejects.toThrow('Network error');

      expect(mockFetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should retry on HTTP 500 error', async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Internal Server Error' })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        });

      const result = await fetchWithRetry<{ success: boolean }>(
        'https://api.example.com/data',
        { retries: 3 },
        mockFetch,
      );

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should throw on HTTP 404 after retries', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(
        fetchWithRetry<unknown>(
          'https://api.example.com/data',
          { retries: 2 },
          mockFetch,
        ),
      ).rejects.toThrow('HTTP error! status: 404');
    });
  });

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const result = safeJsonParse('{"key": "value"}', { default: true });
      expect(result).toEqual({ key: 'value' });
    });

    it('should return fallback for invalid JSON', () => {
      const result = safeJsonParse('not valid json', { default: true });
      expect(result).toEqual({ default: true });
    });

    it('should return fallback for empty string', () => {
      const result = safeJsonParse('', []);
      expect(result).toEqual([]);
    });

    it('should return null for null string (valid JSON)', () => {
      const result = safeJsonParse('null', { default: true });
      expect(result).toBeNull();
    });

    it('should handle complex objects', () => {
      const complex = {
        nested: { array: [1, 2, 3] },
        unicode: '한글',
        number: 123.45,
      };
      const result = safeJsonParse(JSON.stringify(complex), {});
      expect(result).toEqual(complex);
    });

    it('should return fallback for truncated JSON', () => {
      const result = safeJsonParse('{"key": "val', { error: true });
      expect(result).toEqual({ error: true });
    });
  });

  describe('handleApiError', () => {
    it('should handle AbortError', () => {
      const error = new DOMException('Aborted', 'AbortError');
      const result = handleApiError(error);

      expect(result.code).toBe('TIMEOUT');
      expect(result.message).toBe('Request timed out');
    });

    it('should handle Network error', () => {
      const error = new Error('Network error');
      const result = handleApiError(error);

      expect(result.code).toBe('NETWORK_ERROR');
      expect(result.message).toBe('Network error occurred');
    });

    it('should handle HTTP errors', () => {
      const error = new Error('HTTP error! status: 500');
      const result = handleApiError(error);

      expect(result.code).toBe('HTTP_500');
      expect(result.message).toBe('Server error (500)');
    });

    it('should handle HTTP 404', () => {
      const error = new Error('HTTP error! status: 404');
      const result = handleApiError(error);

      expect(result.code).toBe('HTTP_404');
    });

    it('should handle generic Error', () => {
      const error = new Error('Something went wrong');
      const result = handleApiError(error);

      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.message).toBe('Something went wrong');
    });

    it('should handle non-Error objects', () => {
      const result = handleApiError('string error');

      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.message).toBe('An unknown error occurred');
    });

    it('should handle null', () => {
      const result = handleApiError(null);

      expect(result.code).toBe('UNKNOWN_ERROR');
    });

    it('should handle undefined', () => {
      const result = handleApiError(undefined);

      expect(result.code).toBe('UNKNOWN_ERROR');
    });
  });

  describe('HTTP Status Code Handling', () => {
    const statusCodes = [
      { code: 400, name: 'Bad Request' },
      { code: 401, name: 'Unauthorized' },
      { code: 403, name: 'Forbidden' },
      { code: 404, name: 'Not Found' },
      { code: 500, name: 'Internal Server Error' },
      { code: 502, name: 'Bad Gateway' },
      { code: 503, name: 'Service Unavailable' },
      { code: 504, name: 'Gateway Timeout' },
    ];

    for (const { code, name } of statusCodes) {
      it(`should handle ${code} ${name}`, async () => {
        const mockFetch = createMockFetch({ status: code, statusText: name });

        try {
          await fetchWithRetry<unknown>(
            'https://api.example.com/data',
            { retries: 0 },
            mockFetch,
          );
          expect.fail('Should have thrown');
        } catch (error) {
          const handled = handleApiError(error);
          expect(handled.code).toBe(`HTTP_${code}`);
        }
      });
    }
  });

  describe('Edge Cases', () => {
    it('should handle empty response body error', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        json: async () => {
          throw new Error('No content');
        },
      });

      await expect(
        fetchWithRetry<unknown>('https://api.example.com/data', { retries: 0 }, mockFetch),
      ).rejects.toThrow();
    });

    it('should handle malformed JSON response', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        },
      });

      await expect(
        fetchWithRetry<unknown>('https://api.example.com/data', { retries: 0 }, mockFetch),
      ).rejects.toThrow('Unexpected token');
    });

    it('should handle concurrent requests', async () => {
      let callCount = 0;
      const mockFetch = vi.fn(async () => {
        callCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: callCount }),
        } as Response;
      });

      const promises = [
        fetchWithRetry<{ id: number }>('https://api.example.com/1', { retries: 0 }, mockFetch),
        fetchWithRetry<{ id: number }>('https://api.example.com/2', { retries: 0 }, mockFetch),
        fetchWithRetry<{ id: number }>('https://api.example.com/3', { retries: 0 }, mockFetch),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('D1 Error Simulation', () => {
    // D1 데이터베이스 에러 시뮬레이션
    interface D1Error {
      message: string;
      code?: string;
    }

    function simulateD1Error(type: string): D1Error {
      switch (type) {
        case 'connection':
          return { message: 'D1 connection failed', code: 'D1_CONNECTION_ERROR' };
        case 'timeout':
          return { message: 'D1 query timeout', code: 'D1_TIMEOUT' };
        case 'constraint':
          return { message: 'UNIQUE constraint failed', code: 'D1_CONSTRAINT_ERROR' };
        case 'syntax':
          return { message: 'SQL syntax error', code: 'D1_SYNTAX_ERROR' };
        default:
          return { message: 'Unknown D1 error', code: 'D1_UNKNOWN_ERROR' };
      }
    }

    it('should handle D1 connection error', () => {
      const error = simulateD1Error('connection');
      expect(error.code).toBe('D1_CONNECTION_ERROR');
    });

    it('should handle D1 timeout', () => {
      const error = simulateD1Error('timeout');
      expect(error.code).toBe('D1_TIMEOUT');
    });

    it('should handle D1 constraint error', () => {
      const error = simulateD1Error('constraint');
      expect(error.code).toBe('D1_CONSTRAINT_ERROR');
    });

    it('should handle D1 syntax error', () => {
      const error = simulateD1Error('syntax');
      expect(error.code).toBe('D1_SYNTAX_ERROR');
    });
  });

  describe('Error Message Formatting', () => {
    it('should format user-friendly messages', () => {
      const testCases = [
        { error: new Error('Network error'), expected: 'Network error occurred' },
        { error: new DOMException('', 'AbortError'), expected: 'Request timed out' },
        { error: new Error('HTTP error! status: 500'), expected: 'Server error (500)' },
        { error: new Error('HTTP error! status: 404'), expected: 'Server error (404)' },
      ];

      for (const { error, expected } of testCases) {
        const result = handleApiError(error);
        expect(result.message).toBe(expected);
      }
    });

    it('should extract status code correctly', () => {
      const statuses = [200, 201, 400, 401, 403, 404, 500, 502, 503];

      for (const status of statuses) {
        const error = new Error(`HTTP error! status: ${status}`);
        const result = handleApiError(error);
        expect(result.code).toBe(`HTTP_${status}`);
      }
    });
  });

  describe('Error Recovery Patterns', () => {
    it('should recover from temporary failure', async () => {
      let attempts = 0;
      const mockFetch = vi.fn(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary failure');
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({ recovered: true }),
        } as Response;
      });

      const result = await fetchWithRetry<{ recovered: boolean }>(
        'https://api.example.com/data',
        { retries: 3 },
        mockFetch,
      );

      expect(result.recovered).toBe(true);
      expect(attempts).toBe(3);
    });

    it('should report final error after exhausting retries', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Persistent failure'));

      try {
        await fetchWithRetry<unknown>(
          'https://api.example.com/data',
          { retries: 2 },
          mockFetch,
        );
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Persistent failure');
      }
    });
  });
});
