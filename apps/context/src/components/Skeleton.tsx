import { For } from "solid-js";

// 기본 스켈레톤 박스
export function Skeleton(props: { class?: string }) {
  return <div class={`skeleton ${props.class || ""}`} />;
}

// 텍스트 스켈레톤
export function SkeletonText(props: { lines?: number; class?: string }) {
  const lines = props.lines || 3;
  return (
    <div class={`space-y-2 ${props.class || ""}`}>
      <For each={Array(lines).fill(0)}>
        {(_, i) => (
          <div
            class="skeleton h-4 rounded"
            style={{ width: i() === lines - 1 ? "60%" : "100%" }}
          />
        )}
      </For>
    </div>
  );
}

// 카드 스켈레톤
export function SkeletonCard() {
  return (
    <div class="card p-6 space-y-4">
      <div class="flex items-center gap-4">
        <Skeleton class="w-12 h-12 rounded-xl" />
        <div class="flex-1 space-y-2">
          <Skeleton class="h-5 w-1/3 rounded" />
          <Skeleton class="h-4 w-1/2 rounded" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <div class="flex gap-2">
        <Skeleton class="h-6 w-16 rounded-full" />
        <Skeleton class="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

// 목록 스켈레톤
export function SkeletonList(props: { count?: number }) {
  return (
    <div class="space-y-4">
      <For each={Array(props.count || 5).fill(0)}>
        {() => (
          <div class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
            <Skeleton class="w-10 h-10 rounded-lg" />
            <div class="flex-1 space-y-2">
              <Skeleton class="h-4 w-1/4 rounded" />
              <Skeleton class="h-3 w-1/2 rounded" />
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

// 페이지 로딩 스켈레톤
export function PageSkeleton() {
  return (
    <div class="container-custom py-8 space-y-8">
      {/* Header skeleton */}
      <div class="space-y-4">
        <Skeleton class="h-10 w-1/3 rounded-lg" />
        <Skeleton class="h-5 w-2/3 rounded" />
      </div>

      {/* Grid skeleton */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={Array(6).fill(0)}>
          {() => <SkeletonCard />}
        </For>
      </div>
    </div>
  );
}
