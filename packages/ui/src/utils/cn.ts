/**
 * Class Name Utility
 * @environment universal
 *
 * clsx + tailwind-merge를 사용해 조건부 클래스 이름을 결합합니다.
 *
 * @example
 * ```tsx
 * import { cn } from '@soundblue/ui/utils';
 *
 * <button className={cn(
 *   "px-4 py-2 bg-blue-500 text-white",
 *   isActive && "bg-blue-700",
 *   className
 * )}>
 *   Click me
 * </button>
 * ```
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
