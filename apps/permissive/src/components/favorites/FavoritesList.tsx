/**
 * @fileoverview 즐겨찾기 라이브러리 목록 (클라이언트 렌더).
 * @environment client-only
 *
 * /favorites 페이지에서 사용. 전체 라이브러리 메타를 props로 받아
 * localStorage에 저장된 이름만 필터링해 표시합니다.
 */
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'permissive:favorites';
const CHANGE_EVENT = 'permissive:favorites-changed';

interface MinimalLibrary {
  name: string;
  slug: string;
  description: string;
  descriptionKo: string;
  license: string;
  stars: string;
  categories: string[];
}

interface FavoritesListProps {
  libraries: MinimalLibrary[];
  locale: 'en' | 'ko';
}

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

export default function FavoritesList({ libraries, locale }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sync = () => setFavorites(readFavorites());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (!mounted) {
    return (
      <p className="text-sm text-(--text-tertiary)">
        {locale === 'ko' ? '불러오는 중...' : 'Loading...'}
      </p>
    );
  }

  const items = libraries.filter((lib) => favorites.has(lib.name));
  const prefix = locale === 'ko' ? '/ko' : '';

  if (items.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-(--bg-tertiary) border border-(--border-primary) text-center">
        <p className="text-4xl mb-3" aria-hidden="true">
          ⭐
        </p>
        <p className="font-semibold text-(--text-primary) mb-1.5">
          {locale === 'ko' ? '저장된 라이브러리가 없습니다' : 'No saved libraries yet'}
        </p>
        <p className="text-sm text-(--text-secondary) mb-4">
          {locale === 'ko'
            ? '라이브러리 상세 페이지에서 별 아이콘을 눌러 저장하세요.'
            : 'Tap the star on any library detail page to save it.'}
        </p>
        <a
          href={`${prefix}/libraries`}
          className="inline-block px-4 py-2 rounded-lg bg-(--accent-bg) text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {locale === 'ko' ? '라이브러리 둘러보기' : 'Browse libraries'}
        </a>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-(--text-tertiary) mb-4">
        {items.length} {locale === 'ko' ? '개 저장됨' : 'saved'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((lib) => (
          <a
            key={lib.name}
            href={`${prefix}/library/${lib.slug}`}
            className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) hover:border-(--border-focus) transition-colors group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="font-semibold text-(--text-primary) group-hover:text-(--accent-primary) transition-colors">
                {lib.name}
              </h2>
              <span className="text-xs text-(--text-tertiary) shrink-0">★ {lib.stars}</span>
            </div>
            <p className="text-sm text-(--text-secondary) line-clamp-2 mb-3">
              {locale === 'ko' ? lib.descriptionKo : lib.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-xs bg-(--bg-tertiary) text-(--text-tertiary)">
                {lib.license}
              </span>
              {lib.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 rounded text-xs bg-(--bg-tertiary) text-(--text-tertiary)"
                >
                  {cat}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
