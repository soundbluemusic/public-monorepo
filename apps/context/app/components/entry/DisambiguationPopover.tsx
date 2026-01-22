/**
 * @fileoverview 동음이의어 선택 팝오버
 *
 * 같은 한국어에 여러 의미가 있을 때 사용자가 선택할 수 있는 팝오버입니다.
 * 예: "이"가 숫자 2와 조사(주격)로 사용될 때
 *
 * @example
 * ```tsx
 * <DisambiguationPopover
 *   korean="이"
 *   ids={["i-number", "i-particle"]}
 * />
 * ```
 */

import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { getEntryById } from '@/data/entries';

import { useI18n } from '@/i18n';

interface DisambiguationPopoverProps {
  /** 표시할 한국어 텍스트 */
  korean: string;
  /** 해당하는 엔트리 ID 목록 */
  ids: string[];
}

interface ResolvedEntry {
  id: string;
  word: string;
  explanation: string;
  partOfSpeech: string;
}

/**
 * DisambiguationPopover - 동음이의어 선택 팝오버
 *
 * 한 단어에 여러 의미가 있을 때 사용자가 원하는 의미를 선택할 수 있게 합니다.
 */
export function DisambiguationPopover({ korean, ids }: DisambiguationPopoverProps) {
  const { localePath, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<ResolvedEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 엔트리 정보를 비동기로 로드
  useEffect(() => {
    async function loadEntries() {
      setIsLoading(true);
      const resolved: ResolvedEntry[] = [];

      for (const id of ids) {
        const entry = await getEntryById(id);
        if (entry) {
          resolved.push({
            id: entry.id,
            word: entry.translations[locale].word,
            explanation: entry.translations[locale].explanation,
            partOfSpeech: entry.partOfSpeech,
          });
        }
      }

      setEntries(resolved);
      setIsLoading(false);
    }

    loadEntries();
  }, [ids, locale]);

  // 외부 클릭 시 팝오버 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // 로딩 중이거나 유효한 엔트리가 없으면 빈 span 반환
  if (isLoading || entries.length === 0) {
    return <span>{korean}</span>;
  }

  // 엔트리가 하나면 팝오버 없이 바로 링크
  const singleEntry = entries.length === 1 ? entries[0] : undefined;
  if (singleEntry) {
    return (
      <Link
        to={localePath(`/entry/${singleEntry.id}`)}
        className="text-(--accent-primary) underline decoration-dotted underline-offset-4 hover:decoration-solid"
      >
        {korean}
      </Link>
    );
  }

  return (
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-(--accent-primary) underline decoration-dotted underline-offset-4 hover:decoration-solid cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {korean}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          role="menu"
          className="absolute left-0 top-full z-50 mt-1 min-w-48 max-w-72 rounded-lg border border-(--border-primary) bg-(--bg-elevated) shadow-lg"
        >
          <div className="p-2">
            <div className="mb-2 px-2 text-xs text-(--text-tertiary)">
              {locale === 'ko' ? '의미 선택' : 'Select meaning'}
            </div>
            <ul className="space-y-1">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <Link
                    to={localePath(`/entry/${entry.id}`)}
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md px-2 py-1.5 hover:bg-(--bg-muted) transition-colors"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-(--text-primary)">{entry.word}</span>
                      <span className="text-xs text-(--text-tertiary)">({entry.partOfSpeech})</span>
                    </div>
                    <div className="text-sm text-(--text-secondary) line-clamp-1">
                      {entry.explanation}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </span>
  );
}
