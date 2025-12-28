/**
 * Input Component (shadcn/ui style)
 *
 * 접근성 준수 Input 컴포넌트
 * 기본 스타일 + 다크모드 지원
 *
 * @example
 * ```tsx
 * import { Input } from '@soundblue/shared-react/components/ui/input';
 *
 * <Input type="email" placeholder="Email" />
 * <Input disabled value="Disabled" />
 * ```
 */
import type * as React from 'react';

import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
