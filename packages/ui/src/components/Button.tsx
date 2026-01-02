/**
 * @fileoverview Button component with CVA variants
 * @description Comprehensive button with multiple variants, sizes, and effects
 * @environment universal
 *
 * @example
 * ```tsx
 * <Button variant="default">Primary</Button>
 * <Button variant="destructive" size="lg">Delete</Button>
 * <Button variant="outline" size="sm">Cancel</Button>
 * <LinkButton href="/path" variant="ghost">Link</LinkButton>
 * ```
 */
import { cva, type VariantProps } from 'class-variance-authority';
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight rounded-xl transition-all duration-200 ease-out cursor-pointer border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] active:transition-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-blue-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(59,130,246,0.25)] hover:bg-blue-700 hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_24px_rgba(59,130,246,0.35)] hover:-translate-y-0.5 dark:bg-blue-500 dark:hover:bg-blue-600',
        destructive:
          'bg-red-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(239,68,68,0.25)] hover:bg-red-700 hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_24px_rgba(239,68,68,0.35)] hover:-translate-y-0.5',
        outline:
          'border border-gray-300 bg-transparent text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-gray-100 hover:border-transparent hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800',
        secondary:
          'bg-gray-100 text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-gray-200 hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
        ghost:
          'bg-transparent text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800',
        link: 'bg-transparent text-blue-600 underline-offset-4 hover:underline dark:text-blue-400',
        glass:
          'bg-white/10 backdrop-blur-[24px] border border-white/20 text-gray-900 shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:bg-white/20 dark:text-white',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 px-4 text-xs rounded-lg',
        lg: 'h-12 px-8 text-base rounded-2xl',
        xl: 'h-14 px-10 text-lg rounded-2xl',
        icon: 'h-10 w-10 rounded-xl',
        'icon-sm': 'h-8 w-8 rounded-lg',
        'icon-lg': 'h-12 w-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/**
 * Button - Primary button component with multiple variants and sizes
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => {
    return (
      <button
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export interface LinkButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  href: string;
}

/**
 * LinkButton - Anchor element styled as a button
 */
const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <a className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
LinkButton.displayName = 'LinkButton';

export { Button, buttonVariants, LinkButton };
