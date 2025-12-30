/**
 * @fileoverview Progress bar component
 * @environment universal
 */
import { cn } from '../utils/cn';

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
  /** 접근성 라벨 (aria-label) */
  label?: string;
}

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
 * <ProgressBar value={75} />
 * <ProgressBar value={30} max={100} size="sm" />
 * ```
 */
export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  className,
  noAnimation = false,
  label = 'Progress',
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
      aria-label={label}
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
