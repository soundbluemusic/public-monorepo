/**
 * @fileoverview Unit tests for ErrorBoundary components
 */

import {
  classifyError,
  ErrorBoundary,
  ErrorFallbackUI,
  isRouteErrorResponse,
  RouteErrorUI,
} from '@soundblue/ui/feedback';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

describe('isRouteErrorResponse', () => {
  it('should return true for valid route error response', () => {
    const routeError = { status: 404, statusText: 'Not Found' };
    expect(isRouteErrorResponse(routeError)).toBe(true);
  });

  it('should return true for route error with data', () => {
    const routeError = { status: 500, statusText: 'Internal Server Error', data: 'Error details' };
    expect(isRouteErrorResponse(routeError)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isRouteErrorResponse(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isRouteErrorResponse(undefined)).toBe(false);
  });

  it('should return false for plain object without status', () => {
    expect(isRouteErrorResponse({ message: 'error' })).toBe(false);
  });

  it('should return false for plain object without statusText', () => {
    expect(isRouteErrorResponse({ status: 404 })).toBe(false);
  });

  it('should return false for Error instance', () => {
    expect(isRouteErrorResponse(new Error('test'))).toBe(false);
  });

  it('should return false for string', () => {
    expect(isRouteErrorResponse('error')).toBe(false);
  });
});

describe('classifyError', () => {
  it('should classify route error response', () => {
    const routeError = { status: 404, statusText: 'Not Found' };
    const result = classifyError(routeError);

    expect(result).toEqual({ kind: 'route', status: 404, statusText: 'Not Found' });
  });

  it('should classify Error instance', () => {
    const error = new Error('Test error');
    const result = classifyError(error);

    expect(result.kind).toBe('runtime');
    if (result.kind === 'runtime') {
      expect(result.error.message).toBe('Test error');
    }
  });

  it('should classify unknown error as string', () => {
    const result = classifyError('Unknown error');

    expect(result).toEqual({ kind: 'unknown', message: 'Unknown error' });
  });

  it('should classify number as unknown', () => {
    const result = classifyError(123);

    expect(result).toEqual({ kind: 'unknown', message: '123' });
  });
});

describe('ErrorBoundary', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('should render default fallback when child throws', () => {
    function ThrowingComponent(): never {
      throw new Error('Test error');
    }

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    function ThrowingComponent(): never {
      throw new Error('Test error');
    }

    render(
      <ErrorBoundary fallback={<div>Custom Error UI</div>}>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const onError = vi.fn();

    function ThrowingComponent(): never {
      throw new Error('Test error');
    }

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0].message).toBe('Test error');
  });
});

describe('ErrorFallbackUI', () => {
  it('should render alert role', () => {
    render(<ErrorFallbackUI error={null} onReset={() => {}} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<ErrorFallbackUI error={null} onReset={() => {}} />);
    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should call onReset when retry button clicked', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(<ErrorFallbackUI error={null} onReset={onReset} />);

    await user.click(screen.getByLabelText('Try again'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('should have reload page button', () => {
    render(<ErrorFallbackUI error={null} onReset={() => {}} />);
    expect(screen.getByLabelText('Reload page')).toBeInTheDocument();
  });
});

describe('RouteErrorUI', () => {
  it('should render 404 page for 404 error', () => {
    const error = { status: 404, statusText: 'Not Found' };

    render(<RouteErrorUI error={error} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('페이지를 찾을 수 없습니다')).toBeInTheDocument();
  });

  it('should render error page for other HTTP errors', () => {
    const error = { status: 500, statusText: 'Internal Server Error' };

    render(<RouteErrorUI error={error} />);

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
  });

  it('should render runtime error UI for Error instance', () => {
    const error = new Error('Runtime error message');

    render(<RouteErrorUI error={error} />);

    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument();
    expect(screen.getByText('Runtime error message')).toBeInTheDocument();
  });

  it('should render unknown error UI for string error', () => {
    render(<RouteErrorUI error="Unknown error string" />);

    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument();
    expect(screen.getByText('Unknown error string')).toBeInTheDocument();
  });

  it('should use custom home text', () => {
    const error = { status: 404, statusText: 'Not Found' };

    render(<RouteErrorUI error={error} homeText="Go Home" />);

    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('should use custom not found message', () => {
    const error = { status: 404, statusText: 'Not Found' };

    render(<RouteErrorUI error={error} notFoundMessage="Page does not exist" />);

    expect(screen.getByText('Page does not exist')).toBeInTheDocument();
  });

  it('should use custom error message', () => {
    const error = new Error('Test');

    render(<RouteErrorUI error={error} errorMessage="Custom error occurred" />);

    expect(screen.getByText('Custom error occurred')).toBeInTheDocument();
  });

  it('should have link to home page', () => {
    const error = { status: 404, statusText: 'Not Found' };

    render(<RouteErrorUI error={error} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });
});
