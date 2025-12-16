import { MetaProvider } from "@solidjs/meta";
import { Router, type RouteSectionProps } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

// 로딩 스켈레톤 UI
function LoadingFallback() {
  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header skeleton */}
      <div class="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40">
        <div class="h-full px-4 flex items-center gap-4">
          <div class="skeleton w-10 h-10 rounded-xl" />
          <div class="hidden sm:block space-y-1">
            <div class="skeleton h-5 w-32 rounded" />
            <div class="skeleton h-3 w-24 rounded" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div class="pt-16 lg:pl-72">
        <div class="container max-w-7xl mx-auto px-4 py-8">
          <div class="space-y-6">
            <div class="skeleton h-10 w-1/3 rounded-lg" />
            <div class="skeleton h-5 w-2/3 rounded" />
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3, 4, 5, 6].map(() => (
                <div class="skeleton h-48 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router
      root={(props: RouteSectionProps) => (
        <MetaProvider>
          <Suspense fallback={<LoadingFallback />}>
            {props.children}
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
