/**
 * @fileoverview 스켈레톤 로딩 UI 컴포넌트
 *
 * 콘텐츠 로딩 중 플레이스홀더로 사용되는 스켈레톤 컴포넌트들입니다.
 * CSS 클래스 'skeleton'에 애니메이션이 정의되어 있어야 합니다.
 *
 * @example
 * ```tsx
 * import { Skeleton, SkeletonText, SkeletonCard, SkeletonList, PageSkeleton } from '@/components/Skeleton';
 *
 * // 기본 스켈레톤
 * <Skeleton class="h-10 w-32" />
 *
 * // 텍스트 스켈레톤 (3줄)
 * <SkeletonText lines={3} />
 *
 * // 카드 스켈레톤
 * <SkeletonCard />
 *
 * // 목록 스켈레톤 (5개 항목)
 * <SkeletonList count={5} />
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
          <div class="skeleton h-4 rounded" style={{ width: i() === lines - 1 ? '60%' : '100%' }} />
        )}
      </For>
    </div>
  );
}

/**
 * 카드 스켈레톤 (단어 엔트리 카드용)
 *
 * @example
 * <SkeletonCard />
 */
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

/**
 * 목록 스켈레톤 (검색 결과, 카테고리 목록 등)
 * @param props.count - 항목 개수 (기본값: 5)
 *
 * @example
 * <SkeletonList count={10} />
 */
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

/**
 * 전체 페이지 로딩 스켈레톤
 *
 * 헤더와 카드 그리드를 포함한 완전한 페이지 구조입니다.
 *
 * @example
 * <Show when={isLoading()} fallback={<ActualContent />}>
 *   <PageSkeleton />
 * </Show>
 */
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
        <For each={Array(6).fill(0)}>{() => <SkeletonCard />}</For>
      </div>
    </div>
  );
}
