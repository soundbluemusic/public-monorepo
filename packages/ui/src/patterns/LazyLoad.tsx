/**
 * Lazy Loading Components and Utilities
 *
 * This module provides React components and utilities for code-splitting and
 * lazy loading, optimizing initial bundle size and improving page load performance.
 *
 * All exports are compatible with React 18+ Suspense and work in both SSR/SSG
 * and client-side environments.
 *
 * @module @soundblue/ui/patterns/LazyLoad
 * @environment universal
 *
 * @example Basic lazy loading with Suspense
 * ```tsx
 * import { LazyLoad } from '@soundblue/ui/patterns';
 *
 * const HeavyChart = lazy(() => import('./HeavyChart'));
 *
 * function Dashboard() {
 *   return (
 *     <LazyLoad fallback={<Skeleton />}>
 *       <HeavyChart data={data} />
 *     </LazyLoad>
 *   );
 * }
 * ```
 *
 * @example Using lazyWithSuspense for cleaner imports
 * ```tsx
 * import { lazyWithSuspense } from '@soundblue/ui/patterns';
 *
 * // Component with built-in Suspense wrapper
 * const HeavyChart = lazyWithSuspense(() => import('./HeavyChart'));
 *
 * // Use directly without wrapping in Suspense
 * function Dashboard() {
 *   return <HeavyChart data={data} />;
 * }
 * ```
 *
 * @see {@link https://react.dev/reference/react/lazy | React lazy() documentation}
 * @see {@link https://react.dev/reference/react/Suspense | React Suspense documentation}
 */
import { type ComponentType, lazy, type ReactNode, Suspense } from 'react';
import { LoadingSpinner } from '../primitives/LoadingSpinner';

/**
 * Props for the LazyLoad wrapper component.
 *
 * @interface LazyLoadProps
 */
export interface LazyLoadProps {
  /**
   * The lazy-loaded content to render.
   * Should contain a component created with `React.lazy()`.
   */
  children: ReactNode;

  /**
   * Custom fallback UI to show while the lazy component is loading.
   * Defaults to `<LoadingSpinner />` if not provided.
   *
   * @default <LoadingSpinner />
   */
  fallback?: ReactNode;
}

/**
 * A skeleton placeholder component for lazy-loaded content.
 *
 * Displays an animated pulse placeholder while content is loading.
 * Includes proper accessibility attributes for screen readers.
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply to the skeleton container
 * @returns A skeleton placeholder element with loading animation
 *
 * @example Basic usage
 * ```tsx
 * <LazyLoad fallback={<LazyLoadSkeleton />}>
 *   <HeavyComponent />
 * </LazyLoad>
 * ```
 *
 * @example With custom styling
 * ```tsx
 * <LazyLoad fallback={<LazyLoadSkeleton className="h-64 bg-gray-100" />}>
 *   <LargeImage />
 * </LazyLoad>
 * ```
 *
 * @example In a card layout
 * ```tsx
 * function CardList() {
 *   return (
 *     <div className="grid grid-cols-3 gap-4">
 *       {items.map((item) => (
 *         <LazyLoad key={item.id} fallback={<LazyLoadSkeleton className="h-48" />}>
 *           <Card data={item} />
 *         </LazyLoad>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @accessibility
 * - Uses `role="status"` for screen reader announcements
 * - Includes `aria-label="Loading content"` for context
 */
export function LazyLoadSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="Loading content">
      <div className="skeleton h-32 w-full rounded-lg" />
    </div>
  );
}

/**
 * A wrapper component that provides Suspense boundaries for lazy-loaded content.
 *
 * This is the simplest way to add lazy loading to your components. It wraps
 * children in a React Suspense boundary with a configurable fallback UI.
 *
 * @param props - Component props
 * @param props.children - The lazy-loaded component(s) to render
 * @param props.fallback - Custom fallback UI (defaults to LoadingSpinner)
 * @returns The children wrapped in a Suspense boundary
 *
 * @example Basic usage with React.lazy
 * ```tsx
 * import { lazy } from 'react';
 * import { LazyLoad } from '@soundblue/ui/patterns';
 *
 * const HeavyChart = lazy(() => import('./HeavyChart'));
 *
 * function Analytics() {
 *   return (
 *     <LazyLoad>
 *       <HeavyChart />
 *     </LazyLoad>
 *   );
 * }
 * ```
 *
 * @example With custom fallback
 * ```tsx
 * function Dashboard() {
 *   return (
 *     <LazyLoad fallback={<div className="p-4">Loading chart...</div>}>
 *       <HeavyChart />
 *     </LazyLoad>
 *   );
 * }
 * ```
 *
 * @example Multiple lazy components
 * ```tsx
 * const Chart = lazy(() => import('./Chart'));
 * const Table = lazy(() => import('./Table'));
 *
 * function Report() {
 *   return (
 *     <LazyLoad fallback={<LazyLoadSkeleton />}>
 *       <Chart />
 *       <Table />
 *     </LazyLoad>
 *   );
 * }
 * ```
 *
 * @remarks
 * For components that need individual Suspense boundaries, consider using
 * {@link lazyWithSuspense} instead, which creates a component with a built-in
 * Suspense wrapper.
 *
 * @see {@link lazyWithSuspense} for creating lazy components with built-in Suspense
 * @see {@link LazyLoadSkeleton} for a default skeleton fallback
 */
export function LazyLoad({ children, fallback }: LazyLoadProps) {
  return <Suspense fallback={fallback ?? <LoadingSpinner />}>{children}</Suspense>;
}

/**
 * Creates a lazy-loaded component with an automatic Suspense wrapper.
 *
 * This is a higher-order component (HOC) that combines `React.lazy()` with
 * `<Suspense>`, creating a component that can be used directly without
 * needing to wrap it in a Suspense boundary.
 *
 * This is the recommended approach when you want each lazy component to have
 * its own loading state, rather than sharing a parent Suspense boundary.
 *
 * @typeParam P - The props type of the lazy-loaded component (inferred from factory)
 * @param factory - A function that returns a dynamic import Promise
 * @param fallback - Optional custom fallback UI (defaults to LoadingSpinner)
 * @returns A new component with built-in Suspense wrapper
 *
 * @example Basic usage
 * ```tsx
 * // components/index.ts
 * import { lazyWithSuspense } from '@soundblue/ui/patterns';
 *
 * // Creates a lazy component with automatic Suspense
 * export const HeavyChart = lazyWithSuspense(
 *   () => import('./HeavyChart')
 * );
 *
 * // App.tsx - Use directly, no Suspense wrapper needed
 * import { HeavyChart } from './components';
 *
 * function Dashboard() {
 *   return <HeavyChart data={chartData} />;
 * }
 * ```
 *
 * @example With custom fallback
 * ```tsx
 * const DataTable = lazyWithSuspense(
 *   () => import('./DataTable'),
 *   <TableSkeleton rows={5} />
 * );
 *
 * // The TableSkeleton shows while DataTable.tsx is being fetched
 * function Report() {
 *   return <DataTable data={reportData} columns={columns} />;
 * }
 * ```
 *
 * @example Route-based code splitting
 * ```tsx
 * // routes.ts
 * import { lazyWithSuspense } from '@soundblue/ui/patterns';
 *
 * export const routes = [
 *   {
 *     path: '/dashboard',
 *     Component: lazyWithSuspense(() => import('./pages/Dashboard')),
 *   },
 *   {
 *     path: '/settings',
 *     Component: lazyWithSuspense(
 *       () => import('./pages/Settings'),
 *       <PageSkeleton />
 *     ),
 *   },
 * ];
 * ```
 *
 * @example Combining with preloadComponent for faster navigation
 * ```tsx
 * const Settings = lazyWithSuspense(() => import('./Settings'));
 * const settingsFactory = () => import('./Settings');
 *
 * function NavLink() {
 *   return (
 *     <Link
 *       to="/settings"
 *       onMouseEnter={() => preloadComponent(settingsFactory)}
 *     >
 *       Settings
 *     </Link>
 *   );
 * }
 * ```
 *
 * @remarks
 * - The returned component preserves the original component's prop types
 * - Each usage creates an independent Suspense boundary
 * - The lazy component is only fetched when first rendered
 * - Subsequent renders use the cached module
 *
 * @see {@link preloadComponent} for preloading components before render
 * @see {@link usePreloadOnVisible} for viewport-based preloading
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
 * Preloads a lazy component without rendering it.
 *
 * Use this to start fetching a component's code before the user navigates
 * to it, improving perceived performance. Common use cases include:
 * - Preloading on link hover
 * - Preloading after initial page load
 * - Preloading based on user behavior predictions
 *
 * @typeParam T - The component type (inferred from factory)
 * @param factory - A function that returns a dynamic import Promise
 * @returns void - The function triggers the import but doesn't return anything
 *
 * @example Preload on hover
 * ```tsx
 * import { preloadComponent } from '@soundblue/ui/patterns';
 *
 * const settingsFactory = () => import('./pages/Settings');
 *
 * function Navigation() {
 *   return (
 *     <nav>
 *       <Link
 *         to="/settings"
 *         onMouseEnter={() => preloadComponent(settingsFactory)}
 *       >
 *         Settings
 *       </Link>
 *     </nav>
 *   );
 * }
 * ```
 *
 * @example Preload after page load
 * ```tsx
 * import { preloadComponent } from '@soundblue/ui/patterns';
 *
 * // Preload important routes after initial render
 * useEffect(() => {
 *   // Wait for main content to load first
 *   requestIdleCallback(() => {
 *     preloadComponent(() => import('./pages/Dashboard'));
 *     preloadComponent(() => import('./pages/Profile'));
 *   });
 * }, []);
 * ```
 *
 * @example Preload based on user intent
 * ```tsx
 * function SearchBar() {
 *   const [query, setQuery] = useState('');
 *
 *   useEffect(() => {
 *     // User is likely to view results, preload the component
 *     if (query.length > 2) {
 *       preloadComponent(() => import('./SearchResults'));
 *     }
 *   }, [query]);
 *
 *   return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
 * }
 * ```
 *
 * @remarks
 * - The component code is fetched and cached by the browser
 * - Calling multiple times with the same factory is safe (module is cached)
 * - This does not render the component, only fetches the code
 * - Works with any dynamic import, not just React components
 *
 * @see {@link usePreloadOnVisible} for automatic viewport-based preloading
 * @see {@link lazyWithSuspense} for creating lazy components
 */
export function preloadComponent<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
): void {
  factory();
}

/**
 * Callback ref type for attaching the Intersection Observer to an element.
 *
 * Use this type when storing the ref callback returned by {@link usePreloadOnVisible}.
 *
 * @example
 * ```tsx
 * const preloadRef: ObserverRefCallback | null = usePreloadOnVisible(factory);
 *
 * return <div ref={preloadRef}>Trigger element</div>;
 * ```
 */
export type ObserverRefCallback = (element: HTMLElement | null) => void;

/**
 * A hook that preloads a component when a trigger element enters the viewport.
 *
 * Uses the Intersection Observer API to detect when an element becomes visible,
 * then automatically starts fetching the specified component. This is useful for:
 * - Preloading content below the fold before the user scrolls to it
 * - Preloading modal/dialog content when the trigger button is visible
 * - Progressive loading of page sections
 *
 * The preload triggers when the element is within 200px of the viewport
 * (configurable via `rootMargin`), giving the browser time to fetch the
 * component before the user actually needs it.
 *
 * @typeParam T - The component type (inferred from factory)
 * @param factory - A function that returns a dynamic import Promise
 * @returns A ref callback to attach to the trigger element, or `null` if
 *          IntersectionObserver is not available (e.g., SSR or old browsers)
 *
 * @example Basic usage - preload when section becomes visible
 * ```tsx
 * import { usePreloadOnVisible, lazyWithSuspense } from '@soundblue/ui/patterns';
 *
 * const heavyChartFactory = () => import('./HeavyChart');
 * const HeavyChart = lazyWithSuspense(heavyChartFactory);
 *
 * function Dashboard() {
 *   const preloadRef = usePreloadOnVisible(heavyChartFactory);
 *
 *   return (
 *     <div>
 *       <Header />
 *       <MainContent />
 *
 *       {/* When this div enters viewport, HeavyChart starts loading *\/}
 *       <section ref={preloadRef}>
 *         <h2>Analytics</h2>
 *         <HeavyChart />
 *       </section>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Preload modal content when trigger is visible
 * ```tsx
 * const modalFactory = () => import('./SettingsModal');
 * const SettingsModal = lazyWithSuspense(modalFactory);
 *
 * function SettingsButton() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const preloadRef = usePreloadOnVisible(modalFactory);
 *
 *   return (
 *     <>
 *       {/* Modal starts loading when this button scrolls into view *\/}
 *       <button ref={preloadRef} onClick={() => setIsOpen(true)}>
 *         Open Settings
 *       </button>
 *
 *       {isOpen && <SettingsModal onClose={() => setIsOpen(false)} />}
 *     </>
 *   );
 * }
 * ```
 *
 * @example Handle SSR/browser compatibility
 * ```tsx
 * function LazySection() {
 *   const preloadRef = usePreloadOnVisible(heavyComponentFactory);
 *
 *   // preloadRef is null during SSR or in browsers without IntersectionObserver
 *   // The component still works, just without preloading optimization
 *   return (
 *     <section ref={preloadRef ?? undefined}>
 *       <HeavyComponent />
 *     </section>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Returns `null` during SSR (IntersectionObserver not available)
 * - The observer disconnects after first intersection (preloads only once)
 * - Uses `rootMargin: '200px'` to trigger 200px before element enters viewport
 * - Safe to call multiple times - the factory is only executed once
 *
 * @see {@link preloadComponent} for manual preloading
 * @see {@link lazyWithSuspense} for creating lazy components
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API | MDN IntersectionObserver}
 */
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
