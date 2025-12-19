/**
 * @fileoverview 스켈레톤 로딩 UI 컴포넌트
 *
 * 콘텐츠 로딩 중 플레이스홀더로 사용되는 스켈레톤 컴포넌트들입니다.
 * CSS 클래스 'skeleton'에 애니메이션이 정의되어 있어야 합니다.
 *
 * @example
 * ```tsx
 * import { Skeleton, SkeletonText, SkeletonGrid, PageSkeleton } from '@/components/ui/Skeleton';
 *
 * // 기본 스켈레톤
 * <Skeleton class="h-10 w-32" />
 *
 * // 텍스트 스켈레톤 (3줄)
 * <SkeletonText lines={3} />
 *
 * // 그리드 스켈레톤 (6개 카드, 3열)
 * <SkeletonGrid count={6} columns={3} />
 *
 * // 전체 페이지 스켈레톤
 * <PageSkeleton />
 * ```
 */
import { For } from 'solid-js';

/**
 * 기본 스켈레톤 박스
 * @param props.class - 추가 CSS 클래스 (크기, 모양 등)
 *
 * @example
 * <Skeleton class="h-10 w-32 rounded-lg" />
 */
export function Skeleton(props: { class?: string }) {
  return <div class={`skeleton ${props.class || ''}`} />;
}

/**
 * 텍스트 스켈레톤 (여러 줄)
 * @param props.lines - 줄 수 (기본값: 3)
 * @param props.class - 컨테이너 CSS 클래스
 *
 * @example
 * <SkeletonText lines={4} />
 */
export function SkeletonText(props: { lines?: number; class?: string }) {
  const lines = props.lines || 3;
  return (
    <div class={`space-y-2 ${props.class || ''}`}>
      <For each={Array(lines).fill(0)}>
        {(_, i) => (
          <div class="skeleton h-4" style={{ width: i() === lines - 1 ? '60%' : '100%' }} />
        )}
      </For>
    </div>
  );
}

/**
 * 카드 스켈레톤 (API/라이브러리 항목용)
 *
 * @example
 * <SkeletonCard />
 */
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

/**
 * 그리드 스켈레톤 (목록 페이지용)
 * @param props.count - 카드 개수 (기본값: 6)
 * @param props.columns - 열 개수 (기본값: 3, 2도 지원)
 *
 * @example
 * <SkeletonGrid count={9} columns={3} />
 */
export function SkeletonGrid(props: { count?: number; columns?: number }) {
  const count = props.count || 6;
  const columns = props.columns || 3;

  return (
    <div class={`grid gap-3 ${columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
      <For each={Array(count).fill(0)}>{() => <SkeletonCard />}</For>
    </div>
  );
}

/**
 * 전체 페이지 로딩 스켈레톤
 *
 * 헤더, 검색바, 그리드를 포함한 완전한 페이지 구조입니다.
 *
 * @example
 * <Show when={isLoading()} fallback={<ActualContent />}>
 *   <PageSkeleton />
 * </Show>
 */
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
          <For each={Array(5).fill(0)}>{() => <div class="skeleton h-9 w-16 rounded-lg" />}</For>
        </div>
      </div>

      {/* Grid skeleton */}
      <SkeletonGrid count={9} />
    </div>
  );
}
