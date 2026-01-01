import { forwardRef, useEffect, useState } from 'react';

interface SearchInputProps {
  query: string;
  placeholder: string;
  clearLabel: string;
  searchLabel: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClear: () => void;
}

/**
 * 키보드 단축키 힌트 표시 컴포넌트
 */
function KeyboardShortcutHint({ isMac }: { isMac: boolean }) {
  return (
    <span className="absolute right-2 flex items-center px-1.5 py-0.5 font-inherit text-[0.6875rem] font-medium text-(--text-tertiary) bg-(--bg-secondary) border border-(--border-primary) rounded pointer-events-none max-md:hidden">
      {isMac ? '\u2318K' : 'Ctrl+K'}
    </span>
  );
}

/**
 * 검색 입력 컴포넌트
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { query, placeholder, clearLabel, searchLabel, onChange, onFocus, onBlur, onKeyDown, onClear },
  ref,
) {
  const [isFocused, setIsFocused] = useState(false);
  const [isMac, setIsMac] = useState(false);

  // Detect Mac platform after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.userAgent));
  }, []);

  return (
    <div className="relative flex items-center">
      <svg
        className="absolute left-2.5 w-4 h-4 text-(--text-tertiary) pointer-events-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        ref={ref}
        type="search"
        className="w-full h-9 max-md:h-10 pl-8.5 pr-8 text-sm font-inherit text-(--text-primary) bg-(--bg-tertiary) border border-(--border-primary) rounded-xl outline-hidden transition-[border-color,background-color] duration-150 placeholder:text-(--text-tertiary) focus:border-(--border-focus) focus:bg-(--bg-secondary) [&::-webkit-search-cancel-button]:hidden"
        placeholder={placeholder}
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
          onFocus();
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
        onKeyDown={onKeyDown}
        aria-label={searchLabel}
      />
      {!isFocused && !query && <KeyboardShortcutHint isMac={isMac} />}
      {query && (
        <button
          type="button"
          className="absolute right-1.5 flex items-center justify-center w-6 h-6 p-0 bg-transparent border-none rounded text-(--text-tertiary) cursor-pointer transition-all duration-150 hover:text-(--text-primary) active:scale-90"
          onClick={onClear}
          aria-label={clearLabel}
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});
