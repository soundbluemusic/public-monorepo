/**
 * @fileoverview Error Boundary Components
 * @environment universal
 *
 * React Error Boundary + React Router Error Boundary 통합
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';

// ========================================
// Types
// ========================================

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/** React Router error response type */
export interface RouteErrorResponse {
  status: number;
  statusText: string;
  data?: unknown;
}

/** Error 정보를 담는 타입 (discriminated union) */
export type ErrorType =
  | { kind: 'route'; status: number; statusText: string }
  | { kind: 'runtime'; error: Error }
  | { kind: 'unknown'; message: string };

// ========================================
// Error Type Guards
// ========================================

/**
 * React Router의 isRouteErrorResponse와 동일한 타입 가드
 * React Router 패키지에서 import하지 않고도 사용 가능
 */
export function isRouteErrorResponse(error: unknown): error is RouteErrorResponse {
  return (
    error != null &&
    typeof error === 'object' &&
    'status' in error &&
    'statusText' in error &&
    typeof (error as RouteErrorResponse).status === 'number' &&
    typeof (error as RouteErrorResponse).statusText === 'string'
  );
}

/**
 * 에러를 ErrorType으로 분류
 */
export function classifyError(error: unknown): ErrorType {
  if (isRouteErrorResponse(error)) {
    return { kind: 'route', status: error.status, statusText: error.statusText };
  }
  if (error instanceof Error) {
    return { kind: 'runtime', error };
  }
  return { kind: 'unknown', message: String(error) };
}

// ========================================
// React Error Boundary (Class Component)
// ========================================

/**
 * Error Boundary component for graceful error handling
 * React 컴포넌트 트리 내의 에러를 캐치
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallbackUI error={this.state.error} onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}

// ========================================
// Error UI Components
// ========================================

interface ErrorFallbackUIProps {
  error: Error | null;
  onReset: () => void;
}

/** Default error fallback UI component (React Error Boundary용) */
export function ErrorFallbackUI({ error, onReset }: ErrorFallbackUIProps) {
  const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';

  return (
    <div
      role="alert"
      className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center"
    >
      <div className="mb-6 text-6xl" aria-hidden="true">
        ⚠️
      </div>
      <h2 className="mb-2 text-xl font-semibold text-(--text-primary)">문제가 발생했습니다</h2>
      <p className="mb-6 text-(--text-secondary)">Something went wrong</p>

      {error && isDev && (
        <details className="mb-6 max-w-lg text-left">
          <summary className="cursor-pointer text-sm text-(--text-tertiary) hover:text-(--text-secondary)">
            Error details
          </summary>
          <pre className="mt-2 overflow-auto rounded-lg bg-(--bg-secondary) p-4 text-xs text-(--text-primary)">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onReset}
          className="min-h-11 px-6 py-2 rounded-lg font-medium bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          aria-label="Try again"
        >
          다시 시도
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="min-h-11 px-6 py-2 rounded-lg font-medium bg-(--bg-tertiary) text-(--text-primary) hover:bg-(--border-primary) transition-colors cursor-pointer"
          aria-label="Reload page"
        >
          페이지 새로고침
        </button>
      </div>
    </div>
  );
}

// ========================================
// Route Error UI (React Router용)
// ========================================

interface RouteErrorUIProps {
  /** 에러 객체 (useRouteError() 반환값) */
  error: unknown;
  /** 홈 링크 텍스트 (i18n용) */
  homeText?: string;
  /** 404 메시지 (i18n용) */
  notFoundMessage?: string;
  /** 일반 에러 메시지 (i18n용) */
  errorMessage?: string;
}

/**
 * React Router의 ErrorBoundary에서 사용할 에러 UI
 * isRouteErrorResponse를 사용하여 404와 일반 에러를 구분
 *
 * @example
 * // root.tsx
 * export function ErrorBoundary() {
 *   const error = useRouteError();
 *   return <RouteErrorUI error={error} />;
 * }
 */
export function RouteErrorUI({
  error,
  homeText = '홈으로 돌아가기',
  notFoundMessage = '페이지를 찾을 수 없습니다',
  errorMessage = '문제가 발생했습니다',
}: RouteErrorUIProps) {
  const classified = classifyError(error);
  const isDev =
    typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV;

  // 404 에러
  if (classified.kind === 'route' && classified.status === 404) {
    return (
      <main
        role="alert"
        className="flex min-h-screen flex-col items-center justify-center bg-(--bg-primary) p-8 text-center"
      >
        <div className="mb-6 text-6xl" aria-hidden="true">
          🔍
        </div>
        <h1 className="mb-2 text-4xl font-bold text-(--text-primary)">404</h1>
        <p className="mb-8 text-lg text-(--text-secondary)">{notFoundMessage}</p>
        <a
          href="/"
          className="inline-block rounded-lg bg-(--accent-primary) px-6 py-3 text-white transition-colors hover:bg-(--accent-primary)/90"
        >
          {homeText}
        </a>
      </main>
    );
  }

  // 기타 HTTP 에러 (500 등)
  if (classified.kind === 'route') {
    return (
      <main
        role="alert"
        className="flex min-h-screen flex-col items-center justify-center bg-(--bg-primary) p-8 text-center"
      >
        <div className="mb-6 text-6xl" aria-hidden="true">
          ⚠️
        </div>
        <h1 className="mb-2 text-4xl font-bold text-(--text-primary)">{classified.status}</h1>
        <p className="mb-8 text-lg text-(--text-secondary)">{classified.statusText}</p>
        <a
          href="/"
          className="inline-block rounded-lg bg-(--accent-primary) px-6 py-3 text-white transition-colors hover:bg-(--accent-primary)/90"
        >
          {homeText}
        </a>
      </main>
    );
  }

  // Runtime 에러
  const stack = classified.kind === 'runtime' ? classified.error.stack : undefined;
  const message = classified.kind === 'runtime' ? classified.error.message : classified.message;

  return (
    <main
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center bg-(--bg-primary) p-8 text-center"
    >
      <div className="mb-6 text-6xl" aria-hidden="true">
        💥
      </div>
      <h1 className="mb-2 text-2xl font-bold text-(--text-primary)">{errorMessage}</h1>
      <p className="mb-8 text-(--text-secondary)">{message}</p>

      {isDev && stack && (
        <pre className="mb-8 max-w-2xl overflow-auto rounded-lg bg-(--bg-secondary) p-4 text-left text-sm text-(--text-primary)">
          <code>{stack}</code>
        </pre>
      )}

      <a
        href="/"
        className="inline-block rounded-lg bg-(--accent-primary) px-6 py-3 text-white transition-colors hover:bg-(--accent-primary)/90"
      >
        {homeText}
      </a>
    </main>
  );
}

// ========================================
// Legacy Alias (Backward Compatibility)
// ========================================

/** @deprecated Use RouteErrorUI instead */
export function RouteErrorFallback() {
  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center bg-(--bg-primary) p-8 text-center"
    >
      <div className="mb-6 text-6xl" aria-hidden="true">
        🔍
      </div>
      <h1 className="mb-2 text-2xl font-bold text-(--text-primary)">페이지를 찾을 수 없습니다</h1>
      <p className="mb-6 text-(--text-secondary)">Page not found</p>
      <a
        href="/"
        className="inline-block rounded-lg bg-(--accent-primary) px-6 py-3 text-white transition-colors hover:brightness-110"
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}
