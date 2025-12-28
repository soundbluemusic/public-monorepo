/**
 * Class Name Utility
 *
 * clsx + tailwind-merge를 사용해 조건부 클래스 이름을 결합합니다.
 * Tailwind CSS 클래스 충돌을 자동으로 해결합니다.
 *
 * tailwind-merge가 해결하는 문제:
 * - cn("p-4", "p-2") → "p-2" (마지막 값 우선)
 * - cn("text-red-500", "text-blue-500") → "text-blue-500"
 * - cn("bg-red-500 hover:bg-red-600", "bg-blue-500") → "bg-blue-500 hover:bg-red-600"
 *
 * @example
 * ```tsx
 * import { cn } from '@soundblue/shared-react/utils/cn';
 *
 * // 컴포넌트에서 기본 스타일 + 사용자 스타일 병합
 * <button className={cn(
 *   "px-4 py-2 bg-blue-500 text-white",  // 기본 스타일
 *   isActive && "bg-blue-700",            // 조건부 스타일
 *   className                              // 사용자 오버라이드
 * )}>
 *   Click me
 * </button>
 * ```
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
