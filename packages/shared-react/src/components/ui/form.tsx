/**
 * Form Components (Zod + React Hook Form)
 *
 * 타입 안전한 폼 컴포넌트
 * - Zod 스키마로 런타임 + 컴파일타임 검증
 * - React Hook Form으로 리렌더링 최적화
 * - 접근성 자동 적용 (aria-invalid, aria-describedby)
 *
 * @example
 * ```tsx
 * import { z } from 'zod';
 * import { useForm } from 'react-hook-form';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import {
 *   Form,
 *   FormField,
 *   FormItem,
 *   FormLabel,
 *   FormControl,
 *   FormMessage,
 * } from '@soundblue/shared-react/components/ui/form';
 * import { Input } from '@soundblue/shared-react/components/ui/input';
 *
 * const schema = z.object({
 *   email: z.string().email('유효한 이메일을 입력하세요'),
 *   password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
 * });
 *
 * function LoginForm() {
 *   const form = useForm({
 *     resolver: zodResolver(schema),
 *     defaultValues: { email: '', password: '' },
 *   });
 *
 *   return (
 *     <Form {...form}>
 *       <form onSubmit={form.handleSubmit(onSubmit)}>
 *         <FormField
 *           control={form.control}
 *           name="email"
 *           render={({ field }) => (
 *             <FormItem>
 *               <FormLabel>Email</FormLabel>
 *               <FormControl>
 *                 <Input {...field} />
 *               </FormControl>
 *               <FormMessage />
 *             </FormItem>
 *           )}
 *         />
 *       </form>
 *     </Form>
 *   );
 * }
 * ```
 */
import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';

import { cn } from '../../utils/cn';
import { Label } from './label';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();

  return (
    <Label className={cn(error && 'text-destructive', className)} htmlFor={formItemId} {...props} />
  );
}

function FormControl({ ...props }: React.ComponentPropsWithoutRef<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={cn('text-[0.8rem] text-muted-foreground', className)}
      {...props}
    />
  );
}

function FormMessage({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      id={formMessageId}
      className={cn('text-[0.8rem] font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};

export { zodResolver } from '@hookform/resolvers/zod';
// Re-export for convenience
export { useForm } from 'react-hook-form';
export { z } from 'zod';
