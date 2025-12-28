/**
 * Label Component (shadcn/ui style)
 *
 * Radix UI Label 기반, Form 요소와 연동되는 Label
 * 접근성: htmlFor로 input과 연결, 클릭 시 input 포커스
 *
 * @example
 * ```tsx
 * import { Label } from '@soundblue/shared-react/components/ui/label';
 *
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" />
 * ```
 */
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '../../utils/cn';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

function Label({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>) {
  return <LabelPrimitive.Root className={cn(labelVariants(), className)} {...props} />;
}

export { Label };
