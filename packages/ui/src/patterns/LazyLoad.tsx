/**
 * @fileoverview Lazy Loading Components
 * @environment universal
 */
import { type ComponentType, lazy, type ReactNode, Suspense } from 'react';
import { LoadingSpinner } from '../primitives/LoadingSpinner';

export interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/** Default skeleton fallback for lazy-loaded content */
export function LazyLoadSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="Loading content">
      <div className="skeleton h-32 w-full rounded-lg" />
    </div>
  );
}

/** Wrapper component for lazy-loaded content with Suspense */
export function LazyLoad({ children, fallback }: LazyLoadProps) {
  return <Suspense fallback={fallback ?? <LoadingSpinner />}>{children}</Suspense>;
}

/** Create a lazy-loaded component with automatic Suspense wrapper */
export function lazyWithSuspense<P extends object>(
  factory: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode,
): ComponentType<P> {
  const LazyComponent = lazy(factory);

  return function LazyWrapped(props: P) {
    return (
      <Suspense fallback={fallback ?? <LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/** Preload a lazy component without rendering it */
export function preloadComponent<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
): void {
  factory();
}

/** Callback ref type for observing elements */
export type ObserverRefCallback = (element: HTMLElement | null) => void;

/** Hook to preload a component when it comes into view */
export function usePreloadOnVisible<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
): ObserverRefCallback | null {
  if (typeof IntersectionObserver === 'undefined') {
    return null;
  }

  let hasPreloaded = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && !hasPreloaded) {
        hasPreloaded = true;
        factory();
        observer.disconnect();
      }
    },
    { rootMargin: '200px' },
  );

  return (element: HTMLElement | null): void => {
    if (element) {
      observer.observe(element);
    }
  };
}
