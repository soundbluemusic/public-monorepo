import { MetaProvider, Title } from "@solidjs/meta";
import { Router, type RouteSectionProps } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { I18nProvider } from "@/i18n";

import "~/styles/global.css";

// Loading skeleton UI
function LoadingFallback() {
  return (
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header skeleton */}
      <div class="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30">
        <div class="h-full px-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="skeleton w-8 h-8 rounded-lg" />
            <div class="skeleton h-5 w-24 rounded" />
          </div>
          <div class="flex gap-2">
            <div class="skeleton w-9 h-9 rounded-lg" />
            <div class="skeleton w-9 h-9 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div class="pt-14 md:ml-60">
        <div class="max-w-4xl mx-auto px-4 py-8">
          <div class="space-y-6">
            <div class="skeleton h-9 w-1/4 rounded-lg" />
            <div class="skeleton h-5 w-1/2 rounded" />
            <div class="flex gap-4 mt-4">
              <div class="skeleton h-11 flex-1 rounded-xl" />
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
              {[1, 2, 3, 4, 5, 6].map(() => (
                <div class="skeleton h-32 rounded-xl" />
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
    <I18nProvider>
      <Router
        root={(props: RouteSectionProps) => (
          <MetaProvider>
            <Title>Permissive - Free Web Dev Resources</Title>
            <Suspense fallback={<LoadingFallback />}>
              {props.children}
            </Suspense>
          </MetaProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </I18nProvider>
  );
}
