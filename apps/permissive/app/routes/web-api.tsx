import { useMemo, useState } from 'react';
import type { MetaFunction } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';

interface WebAPI {
  name: string;
  description: string;
  descriptionKo: string;
  category: string;
  support: string;
  mdnUrl: string;
  trending?: boolean;
  yearStable?: number;
}

const webApis: WebAPI[] = [
  // Modern Web Platform
  {
    name: 'View Transitions API',
    description: 'Smooth page transitions',
    descriptionKo: '부드러운 페이지 전환',
    category: 'Modern Web Platform',
    support: '72%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API',
    trending: true,
    yearStable: 2023,
  },
  {
    name: 'WebGPU',
    description: 'Next-gen 3D graphics and compute',
    descriptionKo: '차세대 3D 그래픽 및 컴퓨팅',
    category: 'Modern Web Platform',
    support: '68%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API',
    trending: true,
    yearStable: 2023,
  },
  {
    name: 'Navigation API',
    description: 'Control browser navigation',
    descriptionKo: '브라우저 네비게이션 제어',
    category: 'Modern Web Platform',
    support: '75%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API',
    trending: true,
    yearStable: 2022,
  },
  {
    name: 'Popover API',
    description: 'Native popover elements',
    descriptionKo: '네이티브 팝오버 엘리먼트',
    category: 'Modern Web Platform',
    support: '82%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Popover_API',
    trending: true,
    yearStable: 2023,
  },
  {
    name: 'Web Animations API',
    description: 'JavaScript animation control',
    descriptionKo: '자바스크립트 애니메이션 제어',
    category: 'Modern Web Platform',
    support: '96%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API',
    yearStable: 2020,
  },

  // DOM & Observers
  {
    name: 'Document',
    description: 'Access and manipulate the DOM tree',
    descriptionKo: 'DOM 트리 접근 및 조작',
    category: 'DOM & Observers',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Document',
    yearStable: 1998,
  },
  {
    name: 'Element',
    description: 'Base class for all elements',
    descriptionKo: '모든 엘리먼트의 베이스 클래스',
    category: 'DOM & Observers',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Element',
    yearStable: 1998,
  },
  {
    name: 'IntersectionObserver',
    description: 'Detect element visibility',
    descriptionKo: '엘리먼트 가시성 감지',
    category: 'DOM & Observers',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver',
    yearStable: 2019,
  },
  {
    name: 'ResizeObserver',
    description: 'Observe element size changes',
    descriptionKo: '엘리먼트 크기 변화 감지',
    category: 'DOM & Observers',
    support: '96%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver',
    trending: true,
    yearStable: 2020,
  },
  {
    name: 'MutationObserver',
    description: 'Watch for DOM changes',
    descriptionKo: 'DOM 변경 감지',
    category: 'DOM & Observers',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver',
    yearStable: 2012,
  },
  {
    name: 'PerformanceObserver',
    description: 'Monitor performance metrics',
    descriptionKo: '성능 지표 모니터링',
    category: 'DOM & Observers',
    support: '96%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver',
    yearStable: 2017,
  },

  // Network & Communication
  {
    name: 'Fetch API',
    description: 'Modern HTTP requests',
    descriptionKo: '모던 HTTP 요청',
    category: 'Network & Communication',
    support: '98%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
    yearStable: 2015,
  },
  {
    name: 'WebSocket',
    description: 'Real-time bidirectional communication',
    descriptionKo: '실시간 양방향 통신',
    category: 'Network & Communication',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket',
    yearStable: 2011,
  },
  {
    name: 'Server-Sent Events',
    description: 'Server push notifications',
    descriptionKo: '서버 푸시 알림',
    category: 'Network & Communication',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events',
    yearStable: 2012,
  },
  {
    name: 'WebRTC',
    description: 'Real-time peer-to-peer communication',
    descriptionKo: '실시간 P2P 통신',
    category: 'Network & Communication',
    support: '95%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API',
    trending: true,
    yearStable: 2017,
  },
  {
    name: 'Broadcast Channel API',
    description: 'Communication between browsing contexts',
    descriptionKo: '브라우징 컨텍스트 간 통신',
    category: 'Network & Communication',
    support: '96%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API',
    yearStable: 2016,
  },

  // Storage & Data
  {
    name: 'localStorage',
    description: 'Persistent key-value storage',
    descriptionKo: '영구 키-값 저장소',
    category: 'Storage & Data',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
    yearStable: 2009,
  },
  {
    name: 'sessionStorage',
    description: 'Session-scoped storage',
    descriptionKo: '세션 범위 저장소',
    category: 'Storage & Data',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage',
    yearStable: 2009,
  },
  {
    name: 'IndexedDB',
    description: 'Client-side database',
    descriptionKo: '클라이언트 사이드 데이터베이스',
    category: 'Storage & Data',
    support: '98%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API',
    yearStable: 2015,
  },
  {
    name: 'Cache API',
    description: 'HTTP cache management',
    descriptionKo: 'HTTP 캐시 관리',
    category: 'Storage & Data',
    support: '96%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Cache',
    yearStable: 2017,
  },
  {
    name: 'Cookie Store API',
    description: 'Asynchronous cookie access',
    descriptionKo: '비동기 쿠키 접근',
    category: 'Storage & Data',
    support: '87%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Cookie_Store_API',
    trending: true,
    yearStable: 2021,
  },

  // Graphics & Animation
  {
    name: 'Canvas 2D',
    description: '2D drawing and graphics',
    descriptionKo: '2D 그리기 및 그래픽',
    category: 'Graphics & Animation',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
    yearStable: 2005,
  },
  {
    name: 'WebGL',
    description: '3D graphics rendering',
    descriptionKo: '3D 그래픽 렌더링',
    category: 'Graphics & Animation',
    support: '98%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API',
    yearStable: 2011,
  },
  {
    name: 'OffscreenCanvas',
    description: 'Canvas rendering in workers',
    descriptionKo: '워커에서 캔버스 렌더링',
    category: 'Graphics & Animation',
    support: '89%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas',
    trending: true,
    yearStable: 2018,
  },
  {
    name: 'SVG',
    description: 'Scalable vector graphics',
    descriptionKo: '확장 가능한 벡터 그래픽',
    category: 'Graphics & Animation',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/SVG',
    yearStable: 2001,
  },

  // Media & Audio
  {
    name: 'Web Audio API',
    description: 'Advanced audio processing',
    descriptionKo: '고급 오디오 처리',
    category: 'Media & Audio',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',
    trending: true,
    yearStable: 2014,
  },
  {
    name: 'Media Devices',
    description: 'Access cameras and microphones',
    descriptionKo: '카메라 및 마이크 접근',
    category: 'Media & Audio',
    support: '96%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices',
    yearStable: 2016,
  },
  {
    name: 'Media Source Extensions',
    description: 'Adaptive streaming support',
    descriptionKo: '적응형 스트리밍 지원',
    category: 'Media & Audio',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API',
    yearStable: 2016,
  },
  {
    name: 'Picture-in-Picture',
    description: 'Floating video window',
    descriptionKo: '플로팅 비디오 창',
    category: 'Media & Audio',
    support: '93%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API',
    trending: true,
    yearStable: 2020,
  },
  {
    name: 'Screen Capture API',
    description: 'Capture screen content',
    descriptionKo: '화면 콘텐츠 캡처',
    category: 'Media & Audio',
    support: '94%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API',
    yearStable: 2018,
  },

  // Performance & Optimization
  {
    name: 'Web Workers',
    description: 'Background JavaScript execution',
    descriptionKo: '백그라운드 자바스크립트 실행',
    category: 'Workers & Threading',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API',
    yearStable: 2012,
  },
  {
    name: 'Service Worker',
    description: 'Offline-first web apps',
    descriptionKo: '오프라인 우선 웹 앱',
    category: 'Workers & Threading',
    support: '95%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API',
    trending: true,
    yearStable: 2017,
  },
  {
    name: 'SharedArrayBuffer',
    description: 'Shared memory for workers',
    descriptionKo: '워커를 위한 공유 메모리',
    category: 'Workers & Threading',
    support: '92%',
    mdnUrl:
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer',
    yearStable: 2017,
  },
  {
    name: 'Performance API',
    description: 'Measure web performance',
    descriptionKo: '웹 성능 측정',
    category: 'Workers & Threading',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Performance',
    yearStable: 2012,
  },

  // Device & Sensors
  {
    name: 'Geolocation API',
    description: 'Access device location',
    descriptionKo: '기기 위치 접근',
    category: 'Device & Sensors',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API',
    yearStable: 2010,
  },
  {
    name: 'Device Orientation',
    description: 'Detect device rotation',
    descriptionKo: '기기 회전 감지',
    category: 'Device & Sensors',
    support: '94%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events',
    yearStable: 2011,
  },
  {
    name: 'Battery Status API',
    description: 'Monitor battery level',
    descriptionKo: '배터리 레벨 모니터링',
    category: 'Device & Sensors',
    support: '76%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API',
    yearStable: 2016,
  },
  {
    name: 'Vibration API',
    description: 'Control device vibration',
    descriptionKo: '기기 진동 제어',
    category: 'Device & Sensors',
    support: '82%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API',
    yearStable: 2014,
  },
  {
    name: 'Ambient Light Sensor',
    description: 'Detect ambient light level',
    descriptionKo: '주변 조도 감지',
    category: 'Device & Sensors',
    support: '68%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Ambient_Light_Events',
    yearStable: 2019,
  },

  // User Interaction
  {
    name: 'Clipboard API',
    description: 'Access system clipboard',
    descriptionKo: '시스템 클립보드 접근',
    category: 'User Interaction',
    support: '96%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API',
    trending: true,
    yearStable: 2020,
  },
  {
    name: 'Drag and Drop API',
    description: 'Native drag and drop',
    descriptionKo: '네이티브 드래그 앤 드롭',
    category: 'User Interaction',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API',
    yearStable: 2010,
  },
  {
    name: 'Fullscreen API',
    description: 'Enter fullscreen mode',
    descriptionKo: '전체 화면 모드 진입',
    category: 'User Interaction',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API',
    yearStable: 2014,
  },
  {
    name: 'Pointer Lock API',
    description: 'Lock mouse cursor',
    descriptionKo: '마우스 커서 고정',
    category: 'User Interaction',
    support: '95%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API',
    yearStable: 2013,
  },
  {
    name: 'Web Share API',
    description: 'Native sharing',
    descriptionKo: '네이티브 공유',
    category: 'User Interaction',
    support: '89%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API',
    trending: true,
    yearStable: 2019,
  },
  {
    name: 'Page Visibility API',
    description: 'Detect page visibility',
    descriptionKo: '페이지 가시성 감지',
    category: 'User Interaction',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API',
    yearStable: 2013,
  },

  // Security & Privacy
  {
    name: 'Web Crypto API',
    description: 'Cryptographic operations',
    descriptionKo: '암호화 작업',
    category: 'Security & Crypto',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API',
    trending: true,
    yearStable: 2017,
  },
  {
    name: 'Credential Management',
    description: 'Password and credential storage',
    descriptionKo: '비밀번호 및 자격 증명 저장',
    category: 'Security & Crypto',
    support: '89%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Credential_Management_API',
    trending: true,
    yearStable: 2019,
  },
  {
    name: 'Web Authentication API',
    description: 'WebAuthn for passwordless auth',
    descriptionKo: '비밀번호 없는 인증을 위한 WebAuthn',
    category: 'Security & Crypto',
    support: '93%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API',
    trending: true,
    yearStable: 2019,
  },
  {
    name: 'Permissions API',
    description: 'Query permission status',
    descriptionKo: '권한 상태 조회',
    category: 'Security & Crypto',
    support: '94%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API',
    yearStable: 2017,
  },

  // File & System
  {
    name: 'File API',
    description: 'Read and manipulate files',
    descriptionKo: '파일 읽기 및 조작',
    category: 'File & System',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/File_API',
    yearStable: 2011,
  },
  {
    name: 'File System Access API',
    description: 'Access local file system',
    descriptionKo: '로컬 파일 시스템 접근',
    category: 'File & System',
    support: '86%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API',
    trending: true,
    yearStable: 2020,
  },
  {
    name: 'File and Directory Entries',
    description: 'Navigate file system',
    descriptionKo: '파일 시스템 탐색',
    category: 'File & System',
    support: '92%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API',
    yearStable: 2016,
  },

  // Other
  {
    name: 'Notification API',
    description: 'Display system notifications',
    descriptionKo: '시스템 알림 표시',
    category: 'Other',
    support: '95%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API',
    yearStable: 2015,
  },
  {
    name: 'Web Components',
    description: 'Custom HTML elements',
    descriptionKo: '커스텀 HTML 엘리먼트',
    category: 'Other',
    support: '96%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components',
    trending: true,
    yearStable: 2019,
  },
  {
    name: 'History API',
    description: 'Browser history manipulation',
    descriptionKo: '브라우저 히스토리 조작',
    category: 'Other',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/History_API',
    yearStable: 2010,
  },
  {
    name: 'URL API',
    description: 'Parse and construct URLs',
    descriptionKo: 'URL 파싱 및 생성',
    category: 'Other',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/URL_API',
    yearStable: 2015,
  },
];

const categories = [
  'All',
  'Modern Web Platform',
  'DOM & Observers',
  'Network & Communication',
  'Storage & Data',
  'Graphics & Animation',
  'Media & Audio',
  'Workers & Threading',
  'Device & Sensors',
  'User Interaction',
  'Security & Crypto',
  'File & System',
  'Other',
] as const;
type CategoryFilter = (typeof categories)[number];

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  const title = 'Web API - Permissive';
  const description = isKorean
    ? '브라우저에 내장된 웹 표준 API'
    : 'Browser built-in Web Standard APIs';

  return [{ title }, { name: 'description', content: description }];
};

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
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {api.name}
                      </h3>
                      {api.trending && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: 'rgba(255, 107, 107, 0.15)',
                            color: '#ff6b6b',
                          }}
                        >
                          🔥
                        </span>
                      )}
                    </div>
                    <span className="badge-mit">{api.support}</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {locale === 'ko' ? api.descriptionKo : api.description}
                  </p>
                  {api.yearStable && (
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      Since {api.yearStable}
                    </p>
                  )}
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
