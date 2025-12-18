/**
 * @fileoverview 스켈레톤 로딩 UI 컴포넌트
 *
 * 콘텐츠 로딩 중 플레이스홀더로 사용되는 스켈레톤 컴포넌트들입니다.
 * CSS 클래스 'skeleton'에 애니메이션이 정의되어 있어야 합니다.
 * (@soundblue/shared/styles/base.css에 포함)
 *
 * @example
 * ```tsx
 * import { Skeleton, SkeletonText, SkeletonCard, SkeletonList, SkeletonGrid, PageSkeleton } from '@soundblue/shared';
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
  const lines = () => props.lines || 3;
  return (
    <div class={`space-y-2 ${props.class || ''}`}>
      <For each={Array(lines()).fill(0)}>
        {(_, i) => (
          <div
            class="skeleton h-4 rounded"
            style={{ width: i() === lines() - 1 ? '60%' : '100%' }}
          />
        )}
      </For>
    </div>
  );
}

/**
 * 카드 스켈레톤
 * @param props.variant - 카드 변형 ('default' | 'compact')
 *
 * @example
 * <SkeletonCard />
 * <SkeletonCard variant="compact" />
 */
export function SkeletonCard(props: { variant?: 'default' | 'compact' }) {
  if (props.variant === 'compact') {
    return (
      <div
        class="p-4 rounded-xl space-y-3"
        style={{
          'background-color': 'var(--bg-elevated)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div class="flex items-start justify-between">
          <div class="skeleton h-5 w-24" />
          <div class="skeleton h-5 w-12 rounded-full" />
        </div>
        <div class="skeleton h-4 w-full" />
        <div class="skeleton h-4 w-2/3" />
      </div>
    );
  }

  return (
    <div
      class="p-6 rounded-xl space-y-4"
      style={{
        'background-color': 'var(--bg-elevated)',
        border: '1px solid var(--border-primary)',
      }}
    >
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
          <div
            class="flex items-center gap-4 p-4 rounded-xl"
            style={{
              'background-color': 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
            }}
          >
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
 * 그리드 스켈레톤 (목록 페이지용)
 * @param props.count - 카드 개수 (기본값: 6)
 * @param props.columns - 열 개수 (기본값: 3, 2도 지원)
 *
 * @example
 * <SkeletonGrid count={9} columns={3} />
 */
export function SkeletonGrid(props: { count?: number; columns?: number }) {
  const count = () => props.count || 6;
  const columns = () => props.columns || 3;

  return (
    <div
      class={`grid gap-4 ${
        columns() === 2 ? 'sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      <For each={Array(count()).fill(0)}>{() => <SkeletonCard variant="compact" />}</For>
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
    <div class="py-8 space-y-8">
      {/* Header skeleton */}
      <div class="space-y-4">
        <Skeleton class="h-10 w-1/3 rounded-lg" />
        <Skeleton class="h-5 w-2/3 rounded" />
      </div>

      {/* Search skeleton */}
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="skeleton h-11 flex-1 rounded-xl" />
        <div class="flex gap-2">
          <For each={Array(4).fill(0)}>{() => <div class="skeleton h-9 w-16 rounded-lg" />}</For>
        </div>
      </div>

      {/* Grid skeleton */}
      <SkeletonGrid count={6} />
    </div>
  );
}
