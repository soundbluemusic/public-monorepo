/**
 * @soundblue/ui - ErrorBoundary Tests
 *
 * 에러 타입 가드 및 분류 함수 테스트
 */
import {
  classifyError,
  type ErrorType,
  isRouteErrorResponse,
  type RouteErrorResponse,
} from '@soundblue/ui/feedback';
import { describe, expect, it } from 'vitest';

describe('@soundblue/ui/feedback - Error Utilities', () => {
  describe('isRouteErrorResponse', () => {
    it('should return true for valid route error response', () => {
      const error: RouteErrorResponse = {
        status: 404,
        statusText: 'Not Found',
      };
      expect(isRouteErrorResponse(error)).toBe(true);
    });

    it('should return true for route error with data', () => {
      const error: RouteErrorResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        data: { message: 'Something went wrong' },
      };
      expect(isRouteErrorResponse(error)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isRouteErrorResponse(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isRouteErrorResponse(undefined)).toBe(false);
    });

    it('should return false for plain object without required fields', () => {
      expect(isRouteErrorResponse({ message: 'error' })).toBe(false);
    });

    it('should return false for Error instance', () => {
      expect(isRouteErrorResponse(new Error('test'))).toBe(false);
    });

    it('should return false for string', () => {
      expect(isRouteErrorResponse('error')).toBe(false);
    });

    it('should return false for object with wrong status type', () => {
      expect(isRouteErrorResponse({ status: '404', statusText: 'Not Found' })).toBe(false);
    });

    it('should return false for object with wrong statusText type', () => {
      expect(isRouteErrorResponse({ status: 404, statusText: 404 })).toBe(false);
    });
  });

  describe('classifyError', () => {
    it('should classify route error response as route kind', () => {
      const error: RouteErrorResponse = {
        status: 404,
        statusText: 'Not Found',
      };
      const result = classifyError(error);
      expect(result).toEqual({
        kind: 'route',
        status: 404,
        statusText: 'Not Found',
      });
    });

    it('should classify Error instance as runtime kind', () => {
      const error = new Error('Test error');
      const result = classifyError(error);
      expect(result.kind).toBe('runtime');
      if (result.kind === 'runtime') {
        expect(result.error).toBe(error);
        expect(result.error.message).toBe('Test error');
      }
    });

    it('should classify TypeError as runtime kind', () => {
      const error = new TypeError('Type error');
      const result = classifyError(error);
      expect(result.kind).toBe('runtime');
      if (result.kind === 'runtime') {
        expect(result.error).toBeInstanceOf(TypeError);
      }
    });

    it('should classify string as unknown kind', () => {
      const result = classifyError('Something went wrong');
      expect(result).toEqual({
        kind: 'unknown',
        message: 'Something went wrong',
      });
    });

    it('should classify null as unknown kind', () => {
      const result = classifyError(null);
      expect(result).toEqual({
        kind: 'unknown',
        message: 'null',
      });
    });

    it('should classify undefined as unknown kind', () => {
      const result = classifyError(undefined);
      expect(result).toEqual({
        kind: 'unknown',
        message: 'undefined',
      });
    });

    it('should classify number as unknown kind', () => {
      const result = classifyError(42);
      expect(result).toEqual({
        kind: 'unknown',
        message: '42',
      });
    });

    it('should classify object without required fields as unknown kind', () => {
      const result = classifyError({ foo: 'bar' });
      expect(result).toEqual({
        kind: 'unknown',
        message: '[object Object]',
      });
    });

    it('should handle 500 error', () => {
      const error: RouteErrorResponse = {
        status: 500,
        statusText: 'Internal Server Error',
      };
      const result = classifyError(error);
      expect(result).toEqual({
        kind: 'route',
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    it('should handle 403 error', () => {
      const error: RouteErrorResponse = {
        status: 403,
        statusText: 'Forbidden',
      };
      const result = classifyError(error);
      expect(result).toEqual({
        kind: 'route',
        status: 403,
        statusText: 'Forbidden',
      });
    });
  });

  describe('ErrorType discriminated union', () => {
    it('should narrow type based on kind (route)', () => {
      const error: ErrorType = { kind: 'route', status: 404, statusText: 'Not Found' };
      if (error.kind === 'route') {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    it('should narrow type based on kind (runtime)', () => {
      const originalError = new Error('Test');
      const error: ErrorType = { kind: 'runtime', error: originalError };
      if (error.kind === 'runtime') {
        expect(error.error.message).toBe('Test');
      }
    });

    it('should narrow type based on kind (unknown)', () => {
      const error: ErrorType = { kind: 'unknown', message: 'Unknown error' };
      if (error.kind === 'unknown') {
        expect(error.message).toBe('Unknown error');
      }
    });
  });
});
