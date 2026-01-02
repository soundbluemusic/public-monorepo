/**
 * @fileoverview LoadingDots component
 * @description Three animated dots with staggered animation delays
 * @environment universal
 *
 * @example
 * ```tsx
 * <LoadingDots size="md" />
 * <LoadingDots size="sm" className="text-blue-500" />
 * ```
 */
import type { HTMLAttributes } from 'react';

export interface LoadingDotsProps extends HTMLAttributes<HTMLSpanElement> {
  /** Size of the dots */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-1 h-1',
  md: 'w-1.5 h-1.5',
  lg: 'w-2 h-2',
};

const gapClasses = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5',
};

/**
 * LoadingDots - Animated loading indicator with three pulsing dots
 */
export function LoadingDots({ size = 'md', className = '', ...props }: LoadingDotsProps) {
  const dotClass = `${sizeClasses[size]} rounded-full bg-current`;

  return (
    <output
      className={`inline-flex items-center ${gapClasses[size]} ${className}`}
      aria-label="Loading"
      {...props}
    >
      <span
        className={dotClass}
        style={{ animation: 'dotPulse 1.4s ease-in-out infinite', animationDelay: '0s' }}
      />
      <span
        className={dotClass}
        style={{ animation: 'dotPulse 1.4s ease-in-out infinite', animationDelay: '0.2s' }}
      />
      <span
        className={dotClass}
        style={{ animation: 'dotPulse 1.4s ease-in-out infinite', animationDelay: '0.4s' }}
      />
    </output>
  );
}
