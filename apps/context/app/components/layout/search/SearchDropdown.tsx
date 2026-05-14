import { cn, highlightMatches } from '@soundblue/ui/utils';
import { Link } from '@tanstack/react-router';
import { memo, useEffect, useRef } from 'react';

interface SearchResult {
  id: string;
  name: { ko: string; en: string };
}

interface SearchDropdownProps {
  results: SearchResult[];
  selectedIndex: number;
  query: string;
  ariaLabel: string;
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
  query,
  ariaLabel,
  localePath,
  onResultClick,
  onMouseEnter,
}: SearchDropdownProps) {
  const listboxRef = useRef<HTMLDivElement>(null);

  // 키보드로 선택된 항목이 화면 밖이면 자동 스크롤
  useEffect(() => {
    if (selectedIndex < 0 || !listboxRef.current) return;
    const optionEl = listboxRef.current.querySelector<HTMLElement>(
      `[data-option-index="${selectedIndex}"]`,
    );
    if (optionEl) {
      optionEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [selectedIndex]);

  if (results.length === 0) return null;

  return (
    <div
      ref={listboxRef}
      className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 max-h-75 overflow-y-auto bg-(--bg-secondary) border border-(--border-primary) rounded-xl shadow-lg m-0 p-1"
      role="listbox"
      aria-label={ariaLabel}
    >
      {results.map((result, index) => (
        <Link
          key={result.id}
          to={localePath(`/entry/${result.id}`)}
          data-option-index={index}
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
            <span className="text-sm font-medium text-(--text-primary)">
              {highlightMatches(result.name.ko, query)}
            </span>
            <span className="text-sm text-(--text-secondary)">
              {highlightMatches(result.name.en, query)}
            </span>
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
    <div
      role="status"
      aria-live="polite"
      className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-(--bg-secondary) border border-(--border-primary) rounded-xl shadow-lg p-4 text-center text-sm text-(--text-tertiary)"
    >
      {message}
    </div>
  );
});
