import { useMemo, useState } from 'react';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';

interface WebAPI {
  name: string;
  description: string;
  descriptionKo: string;
  category: string;
  support: string;
  mdnUrl: string;
}

const webApis: WebAPI[] = [
  // DOM
  {
    name: 'Document',
    description: 'Access and manipulate the DOM tree',
    descriptionKo: 'DOM 트리 접근 및 조작',
    category: 'DOM',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Document',
  },
  {
    name: 'Element',
    description: 'Base class for all elements',
    descriptionKo: '모든 엘리먼트의 베이스 클래스',
    category: 'DOM',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Element',
  },
  {
    name: 'IntersectionObserver',
    description: 'Detect element visibility',
    descriptionKo: '엘리먼트 가시성 감지',
    category: 'DOM',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver',
  },
  // Network
  {
    name: 'Fetch',
    description: 'Make HTTP requests',
    descriptionKo: 'HTTP 요청 보내기',
    category: 'Network',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
  },
  {
    name: 'WebSocket',
    description: 'Real-time bidirectional communication',
    descriptionKo: '실시간 양방향 통신',
    category: 'Network',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket',
  },
  // Storage
  {
    name: 'localStorage',
    description: 'Persistent key-value storage',
    descriptionKo: '영구 키-값 저장소',
    category: 'Storage',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
  },
  {
    name: 'IndexedDB',
    description: 'Client-side database',
    descriptionKo: '클라이언트 사이드 데이터베이스',
    category: 'Storage',
    support: '98%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API',
  },
  // Graphics
  {
    name: 'Canvas 2D',
    description: '2D drawing and graphics',
    descriptionKo: '2D 그리기 및 그래픽',
    category: 'Graphics',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
  },
  {
    name: 'WebGL',
    description: '3D graphics rendering',
    descriptionKo: '3D 그래픽 렌더링',
    category: 'Graphics',
    support: '98%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API',
  },
];

const categories = ['All', 'DOM', 'Network', 'Storage', 'Graphics'] as const;
type CategoryFilter = (typeof categories)[number];

export function meta() {
  return [
    { title: 'Web API - Permissive' },
    { name: 'description', content: 'Browser built-in Web Standard APIs' },
  ];
}

export default function WebApiPage() {
  const { locale } = useI18n();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');

  const filteredApis = useMemo(() => {
    let apis = webApis;
    if (category !== 'All') {
      apis = apis.filter((api) => api.category === category);
    }
    const q = search.toLowerCase().slice(0, 100);
    if (q) {
      apis = apis.filter(
        (api) =>
          api.name.toLowerCase().includes(q) ||
          api.description.toLowerCase().includes(q) ||
          api.descriptionKo.includes(q),
      );
    }
    return apis;
  }, [search, category]);

  const groupedApis = useMemo(() => {
    if (category !== 'All') {
      return { [category]: filteredApis };
    }
    return filteredApis.reduce<Record<string, WebAPI[]>>((acc, api) => {
      if (!acc[api.category]) acc[api.category] = [];
      acc[api.category].push(api);
      return acc;
    }, {});
  }, [filteredApis, category]);

  return (
    <DocsLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Web API
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ko'
            ? '브라우저에 내장된 무료 API. 설치 없이 바로 사용 가능'
            : 'Browser built-in APIs. Free to use, no installation required'}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <svg
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--text-tertiary)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder={locale === 'ko' ? 'API 검색...' : 'Search APIs...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl transition-all"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: category === cat ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: category === cat ? 'white' : 'var(--text-secondary)',
              }}
            >
              {cat === 'All' ? (locale === 'ko' ? '전체' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
        {filteredApis.length} {locale === 'ko' ? '개의 API' : 'APIs'}
      </div>

      {/* API List */}
      <div className="space-y-8">
        {Object.entries(groupedApis).map(([categoryName, apis]) => (
          <section key={categoryName}>
            <h2
              className="text-lg font-semibold mb-4 pb-2"
              style={{
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border-primary)',
              }}
            >
              {categoryName}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {apis.map((api) => (
                <a
                  key={api.name}
                  href={api.mdnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 rounded-xl transition-all hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {api.name}
                    </h3>
                    <span className="badge-mit">{api.support}</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {locale === 'ko' ? api.descriptionKo : api.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty state */}
      {filteredApis.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p style={{ color: 'var(--text-tertiary)' }}>
            {locale === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
          </p>
        </div>
      )}
    </DocsLayout>
  );
}
