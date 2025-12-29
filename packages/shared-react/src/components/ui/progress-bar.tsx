/**
 * @fileoverview Progress bar component
 *
 * 학습 진행률 등을 시각적으로 표시하는 재사용 가능한 컴포넌트입니다.
 */

import { cn } from '../../utils';

/**
 * ProgressBar 컴포넌트 Props
 */
export interface ProgressBarProps {
  /** 현재 값 */
  value: number;
  /** 최대 값 (기본값: 100) */
  max?: number;
  /** 바 높이 변형 */
  size?: 'sm' | 'md' | 'lg';
  /** 추가 CSS 클래스 */
  className?: string;
  /** 애니메이션 비활성화 */
  noAnimation?: boolean;
}

/**
 * 높이 변형 매핑
 * - sm: 카테고리 카드 내 작은 프로그레스 바
 * - md: 기본 크기
 * - lg: 큰 프로그레스 바
 */
const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
} as const;

/**
 * ProgressBar - 진행률 표시 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <ProgressBar value={75} />
 *
 * // 퍼센트가 아닌 실제 값
 * <ProgressBar value={30} max={100} />
 *
 * // 크기 변형
 * <ProgressBar value={50} size="sm" />
 * ```
 */
export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  className,
  noAnimation = false,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div
      className={cn(
        'w-full rounded-full overflow-hidden bg-(--bg-secondary)',
        sizeClasses[size],
        className,
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn(
          'h-full bg-(--accent-primary)',
          !noAnimation && 'transition-all duration-300',
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
