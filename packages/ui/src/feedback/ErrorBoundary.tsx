/**
 * @fileoverview Error Boundary Components
 * @environment universal
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';

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

/**
 * Error Boundary component for graceful error handling
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

interface ErrorFallbackUIProps {
  error: Error | null;
  onReset: () => void;
}

/** Default error fallback UI component */
export function ErrorFallbackUI({ error, onReset }: ErrorFallbackUIProps) {
  return (
    <div
      role="alert"
      className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center"
    >
      <div className="mb-6 text-6xl" aria-hidden="true">
        ⚠️
      </div>
      <h2 className="mb-2 text-xl font-semibold text-primary">문제가 발생했습니다</h2>
      <p className="mb-6 text-secondary">Something went wrong</p>

      {error && process.env.NODE_ENV === 'development' && (
        <details className="mb-6 max-w-lg text-left">
          <summary className="cursor-pointer text-sm text-tertiary hover:text-secondary">
            Error details
          </summary>
          <pre className="mt-2 overflow-auto rounded-lg bg-secondary p-4 text-xs text-primary">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onReset}
          className="btn-primary px-6 py-2"
          aria-label="Try again"
        >
          다시 시도
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-secondary px-6 py-2"
          aria-label="Reload page"
        >
          페이지 새로고침
        </button>
      </div>
    </div>
  );
}

/** Route-level error fallback for React Router */
export function RouteErrorFallback() {
  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center bg-primary p-8 text-center"
    >
      <div className="mb-6 text-6xl" aria-hidden="true">
        🔍
      </div>
      <h1 className="mb-2 text-2xl font-bold text-primary">페이지를 찾을 수 없습니다</h1>
      <p className="mb-6 text-secondary">Page not found</p>
      <a href="/" className="btn-primary px-6 py-2">
        홈으로 돌아가기
      </a>
    </div>
  );
}
