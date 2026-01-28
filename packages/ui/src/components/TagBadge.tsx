/**
 * @fileoverview TagBadge component for displaying clickable tags
 * @description Tag badge with link support for tag pages
 * @environment universal
 *
 * @example
 * ```tsx
 * <TagBadge tag="react" href="/tag/react" />
 * <TagBadge tag="typescript" size="sm" />
 * <TagBadge tag="featured" variant="primary" />
 * ```
 */
import { cva, type VariantProps } from 'class-variance-authority';
import { Tag } from 'lucide-react';
import { type AnchorHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils/cn';

const tagBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200 ease-out cursor-pointer border',
  {
    variants: {
      variant: {
        default:
          'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600',
        primary:
          'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/50',
        secondary:
          'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900/50',
        success:
          'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900/50',
        warning:
          'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/50',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface TagBadgeProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>,
    VariantProps<typeof tagBadgeVariants> {
  /** The tag text to display */
  tag: string;
  /** Optional href for tag page link */
  href?: string;
  /** Show tag icon */
  showIcon?: boolean;
  /** Count of items with this tag */
  count?: number;
}

/**
 * TagBadge - Clickable tag badge component
 */
const TagBadge = forwardRef<HTMLAnchorElement, TagBadgeProps>(
  ({ tag, href, variant, size, showIcon = false, count, className, ...props }, ref) => {
    const content = (
      <>
        {showIcon && <Tag className="size-3" />}
        <span>{tag}</span>
        {count !== undefined && <span className="ml-0.5 text-[0.65rem] opacity-70">({count})</span>}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref}
          href={href}
          className={cn(tagBadgeVariants({ variant, size }), className)}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <span className={cn(tagBadgeVariants({ variant, size }), 'cursor-default', className)}>
        {content}
      </span>
    );
  },
);
TagBadge.displayName = 'TagBadge';

export { TagBadge, tagBadgeVariants };
