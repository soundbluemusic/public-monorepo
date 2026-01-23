import { LIMITS } from '@soundblue/core/validation';
import { cn } from '@soundblue/ui/utils';
import { Link } from '@tanstack/react-router';
import { Flame, Star } from 'lucide-react';
import { memo } from 'react';
import { getLibrarySlug, type Library } from '../../data/libraries';
import { useI18n } from '../../i18n';

interface LibraryCardProps {
  library: Library;
  locale: 'en' | 'ko';
  selectedTag: string | null;
  onTagClick: (tag: string) => void;
}

export const LibraryCard = memo(function LibraryCard({
  library: lib,
  locale,
  selectedTag,
  onTagClick,
}: LibraryCardProps) {
  const { localePath } = useI18n();

  return (
    <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) overflow-hidden">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center flex-wrap gap-2 min-w-0">
          <Link
            to={localePath(`/library/${getLibrarySlug(lib.name)}`)}
            className="font-medium text-(--text-primary) truncate max-w-[150px] sm:max-w-none hover:text-(--accent-primary) transition-colors"
          >
            {lib.name}
          </Link>
          {lib.trending && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-500/10 text-orange-500 shrink-0">
              <Flame size={12} aria-hidden="true" />
              <span className="hidden sm:inline">{locale === 'ko' ? '트렌드' : 'Trending'}</span>
            </span>
          )}
          {lib.usedHere && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-500 shrink-0">
              <span className="hidden sm:inline">{locale === 'ko' ? '사용 중' : 'Used here'}</span>
              <span className="sm:hidden">✓</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-(--text-tertiary) shrink-0">
          <Star size={14} aria-hidden="true" className="fill-current" />
          {lib.stars}
        </div>
      </div>
      <p className="text-sm text-(--text-secondary) mb-3 line-clamp-2">
        {locale === 'ko' ? lib.descriptionKo : lib.description}
      </p>
      {lib.tags && lib.tags.length > 0 && (
        <div className="flex gap-1 mb-3 overflow-x-auto scrollbar-none pb-1">
          {lib.tags.slice(0, LIMITS.TAGS_PREVIEW).map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => onTagClick(tag)}
              className={cn(
                'px-2 py-0.5 rounded text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0',
                selectedTag === tag
                  ? 'bg-(--accent-primary) text-white'
                  : 'bg-(--bg-tertiary) text-(--text-tertiary) hover:text-(--text-primary)',
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs">
        <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-600 font-medium">
          {lib.license}
        </span>
        {lib.yearReleased && (
          <span className="text-(--text-tertiary)">Since {lib.yearReleased}</span>
        )}
        {lib.website && (
          <a
            href={lib.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--accent-primary) hover:underline font-medium"
          >
            Website
          </a>
        )}
        <a
          href={lib.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-(--accent-primary) hover:underline"
        >
          GitHub
        </a>
        {lib.npm && (
          <a
            href={`https://www.npmjs.com/package/${lib.npm}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--accent-primary) hover:underline"
          >
            npm
          </a>
        )}
      </div>
    </div>
  );
});
