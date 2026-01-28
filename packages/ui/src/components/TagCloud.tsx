/**
 * @fileoverview TagCloud component for displaying a collection of tags
 * @description Displays tags in a cloud/list format with optional counts
 * @environment universal
 *
 * @example
 * ```tsx
 * const tags = [
 *   { tag: 'react', count: 42, href: '/tag/react' },
 *   { tag: 'typescript', count: 38, href: '/tag/typescript' },
 * ];
 * <TagCloud tags={tags} variant="cloud" />
 * <TagCloud tags={tags} variant="list" />
 * ```
 */
import { Tags } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../utils/cn';
import { TagBadge, type TagBadgeProps } from './TagBadge';

export interface TagCloudItem {
  /** Tag name */
  tag: string;
  /** Link to tag page */
  href?: string;
  /** Number of items with this tag */
  count?: number;
  /** Optional variant override */
  variant?: TagBadgeProps['variant'];
}

export interface TagCloudProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Array of tags to display */
  tags: TagCloudItem[];
  /** Display variant */
  variant?: 'cloud' | 'list' | 'compact';
  /** Tag badge size */
  size?: TagBadgeProps['size'];
  /** Show tag icon on badges */
  showIcon?: boolean;
  /** Show counts on badges */
  showCounts?: boolean;
  /** Maximum tags to display (0 = unlimited) */
  maxTags?: number;
  /** Title for the section */
  title?: string;
  /** Callback to generate href for each tag */
  getTagHref?: (tag: string) => string;
  /** Sort tags by count (descending) */
  sortByCount?: boolean;
  /** Default badge variant */
  badgeVariant?: TagBadgeProps['variant'];
}

/**
 * TagCloud - Display a collection of tags
 */
export function TagCloud({
  tags,
  variant = 'cloud',
  size = 'default',
  showIcon = false,
  showCounts = false,
  maxTags = 0,
  title,
  getTagHref,
  sortByCount = false,
  badgeVariant = 'default',
  className,
  ...props
}: TagCloudProps) {
  // Sort and limit tags
  let processedTags = [...tags];

  if (sortByCount) {
    processedTags.sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
  }

  if (maxTags > 0) {
    processedTags = processedTags.slice(0, maxTags);
  }

  const containerClasses = {
    cloud: 'flex flex-wrap gap-2',
    list: 'flex flex-col gap-1.5',
    compact: 'flex flex-wrap gap-1',
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {title && (
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Tags className="size-4" />
          <span>{title}</span>
          {tags.length > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-500">({tags.length})</span>
          )}
        </div>
      )}

      {processedTags.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No tags available</p>
      ) : (
        <div className={containerClasses[variant]}>
          {processedTags.map((item) => (
            <TagBadge
              key={item.tag}
              tag={item.tag}
              href={item.href ?? getTagHref?.(item.tag)}
              count={showCounts ? item.count : undefined}
              showIcon={showIcon}
              size={variant === 'compact' ? 'sm' : size}
              variant={item.variant ?? badgeVariant}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * TagList - Inline tag list with optional label
 */
export interface TagListProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Array of tag strings or TagCloudItems */
  tags: string[] | TagCloudItem[];
  /** Label text */
  label?: string;
  /** Tag badge size */
  size?: TagBadgeProps['size'];
  /** Callback to generate href for each tag */
  getTagHref?: (tag: string) => string;
  /** Default badge variant */
  badgeVariant?: TagBadgeProps['variant'];
}

/**
 * TagList - Simple inline tag list
 */
export function TagList({
  tags,
  label,
  size = 'sm',
  getTagHref,
  badgeVariant = 'default',
  className,
  ...props
}: TagListProps) {
  // Normalize tags to TagCloudItem format
  const normalizedTags: TagCloudItem[] = tags.map((t) => (typeof t === 'string' ? { tag: t } : t));

  if (normalizedTags.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)} {...props}>
      {label && <span className="mr-1 text-xs text-gray-500 dark:text-gray-400">{label}</span>}
      {normalizedTags.map((item) => (
        <TagBadge
          key={item.tag}
          tag={item.tag}
          href={item.href ?? getTagHref?.(item.tag)}
          size={size}
          variant={item.variant ?? badgeVariant}
        />
      ))}
    </div>
  );
}
