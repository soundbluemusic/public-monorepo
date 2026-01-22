import { cn } from '@soundblue/ui/utils';
import { Link } from '@tanstack/react-router';
import { memo } from 'react';

interface SearchResult {
  id: string;
  name: { ko: string; en: string };
}

interface SearchDropdownProps {
  results: SearchResult[];
  selectedIndex: number;
  localePath: (path: string) => string;
  onResultClick: () => void;
  onMouseEnter: (index: number) => void;
}

/**
 * 검색 결과 드롭다운 컴포넌트
 */
export const SearchDropdown = memo(function SearchDropdown({
  results,
  selectedIndex,
  localePath,
  onResultClick,
  onMouseEnter,
}: SearchDropdownProps) {
  if (results.length === 0) return null;

  return (
    <div
      className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 max-h-75 overflow-y-auto bg-(--bg-secondary) border border-(--border-primary) rounded-xl shadow-lg m-0 p-1"
      role="listbox"
    >
      {results.map((result, index) => (
        <Link
          key={result.id}
          to={localePath(`/entry/${result.id}`)}
          className={cn(
            'flex flex-col gap-0.5 py-2.5 px-3 no-underline rounded-lg transition-all duration-150',
            index === selectedIndex ? 'bg-(--bg-tertiary)' : 'hover:bg-(--bg-tertiary)',
          )}
          onClick={onResultClick}
          onMouseEnter={() => onMouseEnter(index)}
          role="option"
          aria-selected={index === selectedIndex}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium text-(--text-primary)">{result.name.ko}</span>
            <span className="text-sm text-(--text-secondary)">{result.name.en}</span>
          </div>
        </Link>
      ))}
    </div>
  );
});

interface NoResultsProps {
  message: string;
}

/**
 * 검색 결과 없음 표시 컴포넌트
 */
export const NoResults = memo(function NoResults({ message }: NoResultsProps) {
  return (
    <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-(--bg-secondary) border border-(--border-primary) rounded-xl shadow-lg p-4 text-center text-sm text-(--text-tertiary)">
      {message}
    </div>
  );
});
