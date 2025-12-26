/**
 * Class Name Utility
 *
 * clsx를 사용해 조건부 클래스 이름을 결합합니다.
 * Tailwind CSS와 함께 사용하기 위한 유틸리티입니다.
 *
 * @example
 * ```tsx
 * import { cn } from '@soundblue/shared-react/utils/cn';
 *
 * <button className={cn(
 *   "btn-primary",
 *   isActive && "bg-accent",
 *   disabled && "opacity-50 cursor-not-allowed"
 * )}>
 *   Click me
 * </button>
 * ```
 */
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
