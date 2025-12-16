import { For } from "solid-js";

// Base skeleton box
export function Skeleton(props: { class?: string }) {
  return <div class={`skeleton ${props.class || ""}`} />;
}

// Text skeleton
export function SkeletonText(props: { lines?: number; class?: string }) {
  const lines = props.lines || 3;
  return (
    <div class={`space-y-2 ${props.class || ""}`}>
      <For each={Array(lines).fill(0)}>
        {(_, i) => (
          <div
            class="skeleton h-4"
            style={{ width: i() === lines - 1 ? "60%" : "100%" }}
          />
        )}
      </For>
    </div>
  );
}

// Card skeleton for API/Library items
export function SkeletonCard() {
  return (
    <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 space-y-3">
      <div class="flex items-start justify-between">
        <div class="skeleton h-5 w-24" />
        <div class="skeleton h-5 w-12 rounded-full" />
      </div>
      <div class="skeleton h-4 w-full" />
      <div class="skeleton h-4 w-2/3" />
    </div>
  );
}

// Grid skeleton for listings
export function SkeletonGrid(props: { count?: number; columns?: number }) {
  const count = props.count || 6;
  const columns = props.columns || 3;

  return (
    <div class={`grid gap-3 ${
      columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
    }`}>
      <For each={Array(count).fill(0)}>
        {() => <SkeletonCard />}
      </For>
    </div>
  );
}

// Page loading skeleton
export function PageSkeleton() {
  return (
    <div class="space-y-8">
      {/* Header skeleton */}
      <div class="space-y-4">
        <div class="skeleton h-9 w-1/4" />
        <div class="skeleton h-5 w-1/2" />
      </div>

      {/* Search skeleton */}
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="skeleton h-11 flex-1 rounded-xl" />
        <div class="flex gap-2">
          <For each={Array(5).fill(0)}>
            {() => <div class="skeleton h-9 w-16 rounded-lg" />}
          </For>
        </div>
      </div>

      {/* Grid skeleton */}
      <SkeletonGrid count={9} />
    </div>
  );
}
