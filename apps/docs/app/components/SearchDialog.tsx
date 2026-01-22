import MiniSearch from 'minisearch';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'en' | 'ko' | 'ja';
}

interface SearchDoc {
  id: string;
  title: string;
  description: string;
  path: string;
  section: string;
}

// Search index (built at compile time, loaded lazily)
let searchIndex: MiniSearch<SearchDoc> | null = null;
let searchDocs: SearchDoc[] = [];

async function getSearchIndex(): Promise<MiniSearch<SearchDoc>> {
  if (searchIndex) return searchIndex;

  // Load docs data (would be generated at build time)
  searchDocs = getDocsData();

  searchIndex = new MiniSearch<SearchDoc>({
    fields: ['title', 'description', 'section'],
    storeFields: ['title', 'description', 'path', 'section'],
    searchOptions: {
      boost: { title: 3, section: 2, description: 1 },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  searchIndex.addAll(searchDocs);
  return searchIndex;
}

export function SearchDialog({ isOpen, onClose, locale }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchDoc[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // Would need to lift state up or use context
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      const index = await getSearchIndex();
      const searchResults = index.search(query.trim()).slice(0, 10);
      setResults(searchResults.map((r) => r as unknown as SearchDoc));
      setSelectedIndex(0);
    };

    search();
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        if (results[selectedIndex]) {
          window.location.href = results[selectedIndex].path;
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  const basePath = locale === 'en' ? '/public-monorepo' : `/public-monorepo/${locale}`;
  const quickLinks = getQuickLinks(locale, basePath);

  return (
    <div
      className="search-dialog"
      role="dialog"
      aria-modal="true"
      aria-label={
        locale === 'ko'
          ? '문서 검색'
          : locale === 'ja'
            ? 'ドキュメント検索'
            : 'Search documentation'
      }
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: dialog container needs click handling */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled by parent */}
      <div className="search-container" onClick={(e) => e.stopPropagation()}>
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-(--border-primary)">
          <svg
            className="w-5 h-5 text-(--text-tertiary)"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              locale === 'ko'
                ? '문서 검색...'
                : locale === 'ja'
                  ? 'ドキュメント検索...'
                  : 'Search docs...'
            }
            className="flex-1 bg-transparent outline-none text-(--text-primary) placeholder:text-(--text-tertiary)"
          />
          <kbd className="px-2 py-1 text-xs bg-(--bg-tertiary) text-(--text-tertiary) rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {query.trim() === '' ? (
            // Quick links when no query
            <div className="p-2">
              <h4 className="px-2 mb-2 text-xs font-semibold uppercase text-(--text-tertiary)">
                {locale === 'ko' ? '빠른 링크' : locale === 'ja' ? 'クイックリンク' : 'Quick Links'}
              </h4>
              <ul className="space-y-1">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-(--bg-secondary) transition-colors"
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="text-(--text-primary)">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : results.length > 0 ? (
            <ul className="space-y-1">
              {results.map((result, index) => (
                <li key={result.id}>
                  <Link
                    to={result.path}
                    onClick={onClose}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      index === selectedIndex
                        ? 'bg-(--accent) text-white'
                        : 'hover:bg-(--bg-secondary)'
                    }`}
                  >
                    <div className="font-medium">{result.title}</div>
                    <div
                      className={`text-sm ${index === selectedIndex ? 'text-white/80' : 'text-(--text-secondary)'}`}
                    >
                      {result.section}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-(--text-tertiary)">
              {locale === 'ko' ? '결과 없음' : locale === 'ja' ? '結果なし' : 'No results found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getQuickLinks(locale: 'en' | 'ko' | 'ja', basePath: string) {
  const labels = {
    en: {
      quickStart: 'Quick Start',
      architecture: 'Architecture',
      context: 'Context App',
      packages: 'Packages',
      aiGuidelines: 'AI Guidelines',
    },
    ko: {
      quickStart: '빠른 시작',
      architecture: '아키텍처',
      context: 'Context 앱',
      packages: '패키지',
      aiGuidelines: 'AI 가이드라인',
    },
    ja: {
      quickStart: 'クイックスタート',
      architecture: 'アーキテクチャ',
      context: 'Context アプリ',
      packages: 'パッケージ',
      aiGuidelines: 'AI ガイドライン',
    },
  };

  const t = labels[locale];

  return [
    { icon: '🚀', label: t.quickStart, href: `${basePath}/guides/quickstart` },
    { icon: '📐', label: t.architecture, href: `${basePath}/guides/architecture` },
    { icon: '📖', label: t.context, href: `${basePath}/apps/context/overview` },
    { icon: '📦', label: t.packages, href: `${basePath}/packages` },
    { icon: '🤖', label: t.aiGuidelines, href: `${basePath}/ai-guidelines` },
  ];
}

// This would be generated at build time from MDX files
function getDocsData(): SearchDoc[] {
  return [
    {
      id: '1',
      title: 'Quick Start',
      description: 'Get started with the monorepo in minutes',
      path: '/public-monorepo/guides/quickstart',
      section: 'Getting Started',
    },
    {
      id: '2',
      title: 'Architecture',
      description: 'Understand the SSG architecture and package layers',
      path: '/public-monorepo/guides/architecture',
      section: 'Getting Started',
    },
    {
      id: '3',
      title: 'Context App',
      description: 'Korean dictionary application',
      path: '/public-monorepo/apps/context/overview',
      section: 'Apps',
    },
    {
      id: '4',
      title: 'Permissive App',
      description: 'Web development resources',
      path: '/public-monorepo/apps/permissive/overview',
      section: 'Apps',
    },
    {
      id: '5',
      title: 'Roots App',
      description: 'Math documentation',
      path: '/public-monorepo/apps/roots/overview',
      section: 'Apps',
    },
    {
      id: '6',
      title: '@soundblue/core',
      description: 'Core utilities, validation, and types',
      path: '/public-monorepo/packages/core',
      section: 'Packages',
    },
    {
      id: '7',
      title: '@soundblue/ui',
      description: 'React UI components',
      path: '/public-monorepo/packages/ui',
      section: 'Packages',
    },
    {
      id: '8',
      title: 'AI Guidelines',
      description: 'Guidelines for AI assistants',
      path: '/public-monorepo/ai-guidelines',
      section: 'AI Guidelines',
    },
  ];
}
