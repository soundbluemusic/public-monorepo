import { type ComponentType, lazy, type ReactNode, Suspense } from 'react';

export interface LazyLoadProps {
  /** The lazy-loaded component */
  children: ReactNode;
  /** Fallback UI to show while loading */
  fallback?: ReactNode;
}

/**
 * Default loading spinner component
 */
export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`} role="status">
      <svg
        className="h-6 w-6 animate-spin text-accent"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Default skeleton fallback for lazy-loaded content
 */
export function LazyLoadSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="Loading content">
      <div className="skeleton h-32 w-full rounded-lg" />
    </div>
  );
}

/**
 * Wrapper component for lazy-loaded content with Suspense
 *
 * @example
 * ```tsx
 * const HeavyChart = lazy(() => import('./HeavyChart'));
 *
 * <LazyLoad fallback={<LoadingSpinner />}>
 *   <HeavyChart data={data} />
 * </LazyLoad>
 * ```
 */
export function LazyLoad({ children, fallback }: LazyLoadProps) {
  return <Suspense fallback={fallback ?? <LoadingSpinner />}>{children}</Suspense>;
}

/**
 * Create a lazy-loaded component with automatic Suspense wrapper
 *
 * @example
 * ```tsx
 * // Instead of:
 * const Chart = lazy(() => import('./Chart'));
 * <Suspense fallback={<Loading />}><Chart /></Suspense>
 *
 * // Use:
 * const Chart = lazyWithSuspense(() => import('./Chart'));
 * <Chart />
 * ```
 */
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

/**
 * Preload a lazy component without rendering it
 * Useful for prefetching components on hover or intersection
 *
 * @example
 * ```tsx
 * const HeavyComponent = lazy(() => import('./HeavyComponent'));
 *
 * // Preload on hover
 * <button onMouseEnter={() => preloadComponent(() => import('./HeavyComponent'))}>
 *   Open Heavy Modal
 * </button>
 * ```
 */
export function preloadComponent<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
): void {
  factory();
}

/**
 * Hook to preload a component when it comes into view
 *
 * @example
 * ```tsx
 * const ref = usePreloadOnVisible(() => import('./HeavyComponent'));
 * <div ref={ref}>Content near heavy component</div>
 * ```
 */
export function usePreloadOnVisible<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
) {
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

  return (element: HTMLElement | null) => {
    if (element) {
      observer.observe(element);
    }
  };
}
