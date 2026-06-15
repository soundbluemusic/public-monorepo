/**
 * @fileoverview Permissive 인스턴트 검색 다이얼로그 (Cmd+K).
 * @environment client-only
 *
 * Astro Island로 hydrate되어 라이브러리/Web API를 통합 검색합니다.
 * MiniSearch는 @soundblue/search를 통해 사용.
 *
 * 진입점:
 * - Cmd+K (Mac) / Ctrl+K (Win): 전역 단축키
 * - 홈/라이브러리 페이지 검색 입력 클릭
 * - 헤더의 검색 아이콘 (구현 시)
 */
import { useSearch } from '@soundblue/search/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface SearchIndexItem {
  id: string;
  type: 'library' | 'api';
  name: { en: string; ko: string };
  description: { en: string; ko: string };
  field: string;
  tags: string[];
}

/**
 * MiniSearch 인덱싱용 평탄화된 검색 아이템.
 * `[key: string]: unknown` 인덱스 시그니처는 `@soundblue/search`의
 * `SearchableItem` 제약을 만족시키기 위해 필요.
 */
interface SearchableItem extends SearchIndexItem {
  searchName: string;
  searchDesc: string;
  searchTags: string;
  [key: string]: unknown;
}

type SortMode = 'relevance' | 'a-z';

interface SearchDialogProps {
  /** 'en' or 'ko' — 결과 표시 언어 */
  locale: 'en' | 'ko';
  /** 라이선스 필터 옵션 표시 여부 (기본 true) */
  showLicenseFilter?: boolean;
}

const LOCALE_LABELS: Record<'en' | 'ko', Record<string, string>> = {
  en: {
    placeholder: 'Search libraries and Web APIs...',
    empty: 'No results. Try a different keyword.',
    initial: 'Start typing to search 120 libraries and 56 Web APIs.',
    close: 'Close',
    library: 'Library',
    api: 'Web API',
    sortRelevance: 'Most relevant',
    sortAZ: 'A → Z',
    allCategories: 'All categories',
    kbdHint: '↑↓ to navigate · Enter to open · Esc to close',
  },
  ko: {
    placeholder: '라이브러리와 Web API 검색...',
    empty: '결과가 없습니다. 다른 키워드를 시도해보세요.',
    initial: '입력을 시작하면 120개 라이브러리와 56개 Web API를 검색합니다.',
    close: '닫기',
    library: '라이브러리',
    api: 'Web API',
    sortRelevance: '관련도순',
    sortAZ: 'A → Z',
    allCategories: '전체 카테고리',
    kbdHint: '↑↓ 이동 · Enter 열기 · Esc 닫기',
  },
};

/**
 * 검색 인덱스를 평탄화된 SearchableItem으로 변환.
 * MiniSearch는 nested 객체를 직접 인덱싱할 수 없으므로 미리 string으로 펼침.
 */
function flattenIndex(raw: SearchIndexItem[], locale: 'en' | 'ko'): SearchableItem[] {
  return raw.map((item) => ({
    ...item,
    searchName: item.name[locale] || item.name.en,
    searchDesc: item.description[locale] || item.description.en,
    searchTags: item.tags.join(' '),
  }));
}

/**
 * 검색 결과 → URL 경로 변환.
 * library: `/library/:slug` (locale prefix 적용)
 * api: `/web-api/:slug`
 */
function itemToHref(item: SearchableItem, locale: 'en' | 'ko'): string {
  const prefix = locale === 'ko' ? '/ko' : '';
  // id 형태: 'lib-{slug}' or 'api-{slug}'
  const [, ...rest] = item.id.split('-');
  const slug = rest.join('-');
  return item.type === 'library' ? `${prefix}/library/${slug}` : `${prefix}/web-api/${slug}`;
}

export default function SearchDialog({
  locale,
  showLicenseFilter: _showLicenseFilter = true,
}: SearchDialogProps) {
  const labels = LOCALE_LABELS[locale];
  const [open, setOpen] = useState(false);
  const [indexData, setIndexData] = useState<SearchableItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [sortMode, setSortMode] = useState<SortMode>('relevance');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultsRef = useRef<HTMLUListElement | null>(null);

  /** 다이얼로그가 열릴 때 lazy load */
  useEffect(() => {
    if (!open || indexData) return;
    fetch('/search-index.json', { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`search-index.json fetch failed: ${res.status}`);
        }
        return res.json() as Promise<SearchIndexItem[]>;
      })
      .then((data) => {
        setIndexData(flattenIndex(data, locale));
        setLoadError(null);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[SearchDialog] failed to load index:', message);
        setLoadError(message);
      });
  }, [open, indexData, locale]);

  const searchConfig = useMemo(
    () => ({
      fields: ['searchName', 'searchDesc', 'searchTags', 'field'],
      storeFields: ['id', 'type', 'name', 'description', 'field', 'tags'],
      searchOptions: {
        boost: { searchName: 3, field: 2, searchTags: 1.5 },
        fuzzy: 0.2,
        prefix: true,
      },
    }),
    [],
  );

  const { query, setQuery, results } = useSearch<SearchableItem>({
    config: searchConfig,
    data: indexData ?? [],
    limit: 40,
  });

  /**
   * 카테고리 + 정렬 후처리 (MiniSearch 결과 후 client-side).
   * `SearchResult.item`이 optional이므로 undefined 항목을 먼저 제거.
   */
  const visibleResults = useMemo<SearchableItem[]>(() => {
    let list: SearchableItem[] = results
      .map((r) => r.item)
      .filter((item): item is SearchableItem => item !== undefined);
    if (activeCategory) {
      list = list.filter((item) => item.field === activeCategory);
    }
    if (sortMode === 'a-z') {
      list = [...list].sort((a, b) => a.searchName.localeCompare(b.searchName));
    }
    return list;
  }, [results, activeCategory, sortMode]);

  /** 사용 가능한 카테고리 목록 (현재 검색 결과 기준; 비어있으면 모든 카테고리) */
  const availableCategories = useMemo(() => {
    const source = visibleResults.length > 0 ? visibleResults : (indexData ?? []);
    return Array.from(new Set(source.map((item) => item.field))).sort();
  }, [visibleResults, indexData]);

  /** Cmd/Ctrl + K 전역 단축키 */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  /** 다이얼로그 외부에서 검색 input을 클릭하면 다이얼로그 열기 */
  useEffect(() => {
    const onTriggerClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const trigger = target.closest('[data-search-trigger]');
      if (trigger) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('click', onTriggerClick);
    return () => document.removeEventListener('click', onTriggerClick);
  }, []);

  /** 다이얼로그 열렸을 때 input에 자동 포커스 */
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  /** 결과 리스트 키보드 네비게이션 */
  const onKeyNav = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!visibleResults.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((idx) => Math.min(idx + 1, visibleResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((idx) => Math.max(idx - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = visibleResults[selectedIdx];
        if (item) {
          window.location.href = itemToHref(item, locale);
        }
      }
    },
    [visibleResults, selectedIdx, locale],
  );

  /** 선택된 항목이 화면에 보이도록 스크롤 */
  useEffect(() => {
    if (!resultsRef.current) return;
    const selectedEl = resultsRef.current.querySelector<HTMLLIElement>(
      `[data-result-idx="${selectedIdx}"]`,
    );
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIdx]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-start justify-center pt-16 px-4">
      {/* 백드롭: 마우스로 바깥 클릭 시 닫기. 키보드 사용자는 Esc(전역 핸들러)로 닫음. */}
      <button
        type="button"
        aria-label={labels.close}
        tabIndex={-1}
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/50 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={locale === 'ko' ? '라이브러리 검색' : 'Search libraries'}
        className="relative w-full max-w-2xl bg-(--bg-elevated) border border-(--border-primary) rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-(--border-primary)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-(--text-tertiary) shrink-0"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            onKeyDown={onKeyNav}
            placeholder={labels.placeholder}
            className="flex-1 bg-transparent text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-none"
            aria-label={labels.placeholder}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={labels.close}
            className="text-xs text-(--text-tertiary) px-2 py-0.5 rounded border border-(--border-primary)"
          >
            Esc
          </button>
        </div>

        {/* Filters */}
        {indexData && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-(--border-primary) overflow-x-auto scrollbar-none">
            <select
              value={activeCategory}
              onChange={(e) => {
                setActiveCategory(e.target.value);
                setSelectedIdx(0);
              }}
              className="text-xs bg-(--bg-tertiary) text-(--text-secondary) rounded px-2 py-1 border border-(--border-primary)"
              aria-label={labels.allCategories}
            >
              <option value="">{labels.allCategories}</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={sortMode}
              onChange={(e) => {
                setSortMode(e.target.value as SortMode);
                setSelectedIdx(0);
              }}
              className="text-xs bg-(--bg-tertiary) text-(--text-secondary) rounded px-2 py-1 border border-(--border-primary)"
              aria-label="Sort"
            >
              <option value="relevance">{labels.sortRelevance}</option>
              <option value="a-z">{labels.sortAZ}</option>
            </select>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {loadError && (
            <p className="px-4 py-6 text-sm text-red-500">
              Failed to load search index: {loadError}
            </p>
          )}
          {!indexData && !loadError && (
            <p className="px-4 py-6 text-sm text-(--text-tertiary)">Loading...</p>
          )}
          {indexData && !query && (
            <p className="px-4 py-6 text-sm text-(--text-tertiary)">{labels.initial}</p>
          )}
          {indexData && query && visibleResults.length === 0 && (
            <p className="px-4 py-6 text-sm text-(--text-tertiary)">{labels.empty}</p>
          )}
          {visibleResults.length > 0 && (
            <ul ref={resultsRef} className="py-1">
              {visibleResults.map((item, idx) => (
                <li key={item.id} data-result-idx={idx}>
                  <a
                    href={itemToHref(item, locale)}
                    aria-current={idx === selectedIdx ? 'true' : undefined}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={`px-4 py-2.5 flex items-start gap-3 no-underline ${
                      idx === selectedIdx ? 'bg-(--bg-tertiary)' : 'hover:bg-(--bg-tertiary)/50'
                    }`}
                  >
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                        item.type === 'library'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-purple-500/10 text-purple-500'
                      }`}
                    >
                      {item.type === 'library' ? labels.library : labels.api}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-(--text-primary) truncate">
                        {item.searchName}
                      </p>
                      <p className="text-xs text-(--text-secondary) line-clamp-1 mt-0.5">
                        {item.searchDesc}
                      </p>
                    </div>
                    <span className="text-xs text-(--text-tertiary) shrink-0 mt-1 hidden sm:block">
                      {item.field}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-(--border-primary) text-xs text-(--text-tertiary) flex items-center justify-between">
          <span>{labels.kbdHint}</span>
          {visibleResults.length > 0 && (
            <span>
              {visibleResults.length} {locale === 'ko' ? '결과' : 'results'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
