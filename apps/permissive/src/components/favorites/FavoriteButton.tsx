/**
 * @fileoverview 라이브러리 즐겨찾기 토글 버튼 (localStorage 기반).
 * @environment client-only
 *
 * Astro Island로 라이브러리 상세/카드에 부착됩니다.
 * 외부 의존성 없이 localStorage만 사용 — 작은 번들 + SSR 친화적.
 *
 * Storage key: `permissive:favorites` (string[] of Library.name).
 */
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'permissive:favorites';
const CHANGE_EVENT = 'permissive:favorites-changed';

function readFavorites(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((v): v is string => typeof v === 'string'));
  } catch (err) {
    console.warn('[favorites] failed to read:', err);
    return new Set();
  }
}

function writeFavorites(set: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch (err) {
    console.warn('[favorites] failed to write:', err);
  }
}

interface FavoriteButtonProps {
  /** Library.name — 식별자 */
  libraryName: string;
  /** UI 언어 */
  locale: 'en' | 'ko';
  /** 작은 아이콘만 (true) vs 라벨 포함 (false). 기본 false */
  iconOnly?: boolean;
}

export default function FavoriteButton({
  libraryName,
  locale,
  iconOnly = false,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  /** Mount 시 localStorage에서 상태 동기화 + 다른 탭/창의 변경 감지 */
  useEffect(() => {
    const sync = () => setIsFavorite(readFavorites().has(libraryName));
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [libraryName]);

  const toggle = useCallback(() => {
    const set = readFavorites();
    if (set.has(libraryName)) {
      set.delete(libraryName);
    } else {
      set.add(libraryName);
    }
    writeFavorites(set);
    setIsFavorite(set.has(libraryName));
  }, [libraryName]);

  const labelAdd = locale === 'ko' ? '즐겨찾기 추가' : 'Add to favorites';
  const labelRemove = locale === 'ko' ? '즐겨찾기 제거' : 'Remove from favorites';
  const label = isFavorite ? labelRemove : labelAdd;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm transition-colors ${
        isFavorite
          ? 'text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20'
          : 'text-(--text-tertiary) bg-(--bg-tertiary) hover:text-(--text-primary)'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      {!iconOnly && (
        <span>
          {isFavorite ? (locale === 'ko' ? '저장됨' : 'Saved') : locale === 'ko' ? '저장' : 'Save'}
        </span>
      )}
    </button>
  );
}
