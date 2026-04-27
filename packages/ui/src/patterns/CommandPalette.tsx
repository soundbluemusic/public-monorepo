/**
 * @fileoverview CommandPalette Component
 * @environment universal
 *
 * 검색 + 네비게이션 + 액션을 하나의 인터페이스에 통합하는 커맨드 팔레트.
 * Cmd+K / Ctrl+K로 열기, ESC로 닫기.
 *
 * @example
 * <CommandPalette
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   groups={[
 *     { label: '최근 본 항목', items: recentItems },
 *     { label: '빠른 이동', items: navigationItems },
 *     { label: '액션', items: actionItems },
 *   ]}
 *   onSearch={handleSearch}
 *   searchResults={searchResults}
 *   locale="ko"
 * />
 */
import type * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';

// ========================================
// Types
// ========================================

export interface CommandItem {
  id: string;
  label: { en: string; ko: string };
  description?: { en: string; ko: string };
  icon?: React.ReactNode;
  /** 아이템 선택 시 실행할 콜백. URL 문자열이면 네비게이션. */
  onSelect: (() => void) | string;
  /** 단축키 표시 (예: '⌘K') */
  shortcut?: string;
  /** 검색 키워드 (보이지 않지만 검색 대상) */
  keywords?: string[];
}

export interface CommandGroup {
  label: { en: string; ko: string };
  items: CommandItem[];
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  /** 정적 커맨드 그룹 (검색어 없을 때 표시) */
  groups: CommandGroup[];
  /** 검색 콜백 - 비동기 검색 결과 반환 */
  onSearch?: (query: string) => void;
  /** 검색 결과 아이템들 */
  searchResults?: CommandItem[];
  /** 검색 중 여부 */
  isSearching?: boolean;
  /** 네비게이션 핸들러 (URL 문자열인 onSelect용) */
  onNavigate?: (url: string) => void;
  locale: 'en' | 'ko';
  placeholder?: { en: string; ko: string };
}

// ========================================
// Component
// ========================================

export function CommandPalette({
  isOpen,
  onClose,
  groups,
  onSearch,
  searchResults,
  isSearching = false,
  onNavigate,
  locale,
  placeholder = { en: 'Search or type a command...', ko: '검색하거나 명령어 입력...' },
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // 표시할 아이템 계산
  const hasQuery = query.trim().length > 0;
  const displayItems = hasQuery
    ? (searchResults ?? filterItems(groups, query))
    : getAllItems(groups);
  const displayGroups = hasQuery ? null : groups;

  // 열릴 때 포커스 & 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // requestAnimationFrame으로 포커스 지연 (dialog 렌더링 후)
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // 선택 인덱스가 결과 범위 밖이면 리셋
  useEffect(() => {
    if (selectedIndex >= displayItems.length) {
      setSelectedIndex(Math.max(0, displayItems.length - 1));
    }
  }, [displayItems.length, selectedIndex]);

  // 선택된 아이템 스크롤
  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedIndex is intentionally a trigger; effect body queries DOM rather than reading the value
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector('[data-selected="true"]');
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      onClose();
      if (typeof item.onSelect === 'string') {
        onNavigate?.(item.onSelect);
      } else {
        item.onSelect();
      }
    },
    [onClose, onNavigate],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const len = displayItems.length;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % len);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + len) % len);
          break;
        case 'Enter':
          e.preventDefault();
          if (displayItems[selectedIndex]) {
            handleSelect(displayItems[selectedIndex]);
          }
          break;
      }
    },
    [displayItems, selectedIndex, handleSelect, onClose],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      setSelectedIndex(0);
      onSearch?.(newQuery);
    },
    [onSearch],
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;

  // 그룹별 인덱스 계산 (flat list에서의 위치 추적)
  let globalIndex = 0;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Modal overlay click-to-close, role="presentation" + Escape key handler cover keyboard a11y
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[var(--z-index-modal,60)] flex items-start justify-center pt-[15vh] motion-fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden motion-scale-in bg-(--bg-elevated) border border-(--border-primary)"
        role="dialog"
        aria-label={locale === 'ko' ? '커맨드 팔레트' : 'Command palette'}
        aria-modal="true"
      >
        {/* 검색 입력 */}
        <div className="flex items-center gap-3 px-4 border-b border-(--border-primary)">
          <svg
            className="w-5 h-5 shrink-0 text-(--text-tertiary)"
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
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder[locale]}
            className="flex-1 h-14 text-base bg-transparent border-none outline-none text-(--text-primary) placeholder:text-(--text-tertiary)"
            role="combobox"
            aria-expanded="true"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="command-list"
            aria-activedescendant={
              displayItems[selectedIndex] ? `cmd-${displayItems[selectedIndex].id}` : undefined
            }
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[0.6875rem] font-medium rounded text-(--text-tertiary) bg-(--bg-secondary) border border-(--border-primary)">
            ESC
          </kbd>
        </div>

        {/* 결과 목록 */}
        <div
          ref={listRef}
          id="command-list"
          role="listbox"
          className="max-h-[min(50vh,400px)] overflow-y-auto p-2"
        >
          {isSearching ? (
            <div className="px-3 py-6 text-center text-sm text-(--text-tertiary)">
              {locale === 'ko' ? '검색 중...' : 'Searching...'}
            </div>
          ) : displayItems.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-(--text-tertiary)">
              {locale === 'ko' ? '결과 없음' : 'No results found'}
            </div>
          ) : displayGroups ? (
            // 그룹 모드 (검색어 없을 때)
            displayGroups.map((group) => {
              if (group.items.length === 0) return null;
              const groupElement = (
                <div key={group.label.en} className="mb-2 last:mb-0">
                  <div className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-(--text-tertiary)">
                    {group.label[locale]}
                  </div>
                  {group.items.map((item) => {
                    const itemIndex = globalIndex++;
                    return (
                      <CommandItemButton
                        key={item.id}
                        item={item}
                        isSelected={itemIndex === selectedIndex}
                        locale={locale}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                      />
                    );
                  })}
                </div>
              );
              return groupElement;
            })
          ) : (
            // 플랫 모드 (검색 결과)
            displayItems.map((item, index) => (
              <CommandItemButton
                key={item.id}
                item={item}
                isSelected={index === selectedIndex}
                locale={locale}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
              />
            ))
          )}
        </div>

        {/* 하단 힌트 */}
        <div className="flex items-center gap-4 px-4 py-2 text-xs border-t border-(--border-primary) text-(--text-tertiary)">
          <span className="flex items-center gap-1">
            <kbd className="inline-flex items-center justify-center w-5 h-5 rounded text-[0.625rem] bg-(--bg-secondary) border border-(--border-primary)">
              ↑
            </kbd>
            <kbd className="inline-flex items-center justify-center w-5 h-5 rounded text-[0.625rem] bg-(--bg-secondary) border border-(--border-primary)">
              ↓
            </kbd>
            {locale === 'ko' ? '이동' : 'Navigate'}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="inline-flex items-center justify-center w-5 h-5 rounded text-[0.625rem] bg-(--bg-secondary) border border-(--border-primary)">
              ↵
            </kbd>
            {locale === 'ko' ? '선택' : 'Select'}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="inline-flex items-center justify-center px-1 h-5 rounded text-[0.625rem] bg-(--bg-secondary) border border-(--border-primary)">
              esc
            </kbd>
            {locale === 'ko' ? '닫기' : 'Close'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ========================================
// CommandItem Button
// ========================================

function CommandItemButton({
  item,
  isSelected,
  locale,
  onClick,
  onMouseEnter,
}: {
  item: CommandItem;
  isSelected: boolean;
  locale: 'en' | 'ko';
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <button
      id={`cmd-${item.id}`}
      type="button"
      role="option"
      aria-selected={isSelected}
      data-selected={isSelected}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        'flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg transition-colors duration-100 cursor-pointer border-none',
        isSelected ? 'bg-(--bg-tertiary)' : 'bg-transparent hover:bg-(--bg-tertiary)',
      )}
    >
      {item.icon && (
        <span className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 text-(--text-secondary) bg-(--bg-secondary)">
          {item.icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate text-(--text-primary)">
          {item.label[locale]}
        </div>
        {item.description && (
          <div className="text-xs truncate text-(--text-tertiary)">{item.description[locale]}</div>
        )}
      </div>
      {item.shortcut && (
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[0.625rem] font-medium rounded shrink-0 text-(--text-tertiary) bg-(--bg-secondary) border border-(--border-primary)">
          {item.shortcut}
        </kbd>
      )}
    </button>
  );
}

// ========================================
// Helpers
// ========================================

/** 모든 그룹의 아이템을 flat list로 */
function getAllItems(groups: CommandGroup[]): CommandItem[] {
  return groups.flatMap((g) => g.items);
}

/** 검색어로 아이템 필터링 (로컬 퍼지 매칭) */
function filterItems(groups: CommandGroup[], query: string): CommandItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllItems(groups);

  return getAllItems(groups).filter((item) => {
    const targets = [
      item.label.en.toLowerCase(),
      item.label.ko.toLowerCase(),
      item.description?.en.toLowerCase() ?? '',
      item.description?.ko.toLowerCase() ?? '',
      ...(item.keywords?.map((k) => k.toLowerCase()) ?? []),
    ];
    return targets.some((t) => t.includes(q));
  });
}

// ========================================
// Hook: useCommandPalette
// ========================================

/**
 * 커맨드 팔레트 열기/닫기 상태 관리 훅
 * Cmd+K / Ctrl+K 글로벌 단축키 등록
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
