import { Title, Meta } from "@solidjs/meta";
import { createSignal, For, Show } from "solid-js";
import DocsLayout from "@/components/layout/DocsLayout";
import { useI18n } from "@/i18n";

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
  { name: "Document", description: "Access and manipulate the DOM tree", descriptionKo: "DOM 트리 접근 및 조작", category: "DOM", support: "99%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Document" },
  { name: "Element", description: "Base class for all elements", descriptionKo: "모든 엘리먼트의 베이스 클래스", category: "DOM", support: "99%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Element" },
  { name: "Event", description: "Handle user interactions and events", descriptionKo: "사용자 상호작용 및 이벤트 처리", category: "DOM", support: "99%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Event" },
  { name: "MutationObserver", description: "Watch for DOM changes", descriptionKo: "DOM 변경 감지", category: "DOM", support: "98%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver" },
  { name: "IntersectionObserver", description: "Detect element visibility", descriptionKo: "엘리먼트 가시성 감지", category: "DOM", support: "97%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver" },
  { name: "ResizeObserver", description: "Watch element size changes", descriptionKo: "엘리먼트 크기 변경 감지", category: "DOM", support: "96%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" },

  // Network
  { name: "Fetch", description: "Make HTTP requests", descriptionKo: "HTTP 요청 보내기", category: "Network", support: "97%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" },
  { name: "XMLHttpRequest", description: "Classic AJAX requests", descriptionKo: "클래식 AJAX 요청", category: "Network", support: "99%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest" },
  { name: "WebSocket", description: "Real-time bidirectional communication", descriptionKo: "실시간 양방향 통신", category: "Network", support: "97%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" },
  { name: "Server-Sent Events", description: "Server push notifications", descriptionKo: "서버 푸시 알림", category: "Network", support: "96%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events" },
  { name: "Beacon", description: "Send analytics data reliably", descriptionKo: "분석 데이터 안정적 전송", category: "Network", support: "96%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API" },

  // Storage
  { name: "localStorage", description: "Persistent key-value storage", descriptionKo: "영구 키-값 저장소", category: "Storage", support: "99%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" },
  { name: "sessionStorage", description: "Session-scoped storage", descriptionKo: "세션 범위 저장소", category: "Storage", support: "99%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage" },
  { name: "IndexedDB", description: "Client-side database", descriptionKo: "클라이언트 사이드 데이터베이스", category: "Storage", support: "98%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" },
  { name: "Cache API", description: "Store request/response pairs", descriptionKo: "요청/응답 쌍 저장", category: "Storage", support: "95%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Cache" },

  // Graphics
  { name: "Canvas 2D", description: "2D drawing and graphics", descriptionKo: "2D 그리기 및 그래픽", category: "Graphics", support: "99%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" },
  { name: "WebGL", description: "3D graphics rendering", descriptionKo: "3D 그래픽 렌더링", category: "Graphics", support: "98%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API" },
  { name: "WebGPU", description: "Next-gen GPU access", descriptionKo: "차세대 GPU 접근", category: "Graphics", support: "75%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API" },
  { name: "SVG", description: "Scalable vector graphics", descriptionKo: "확장 가능한 벡터 그래픽", category: "Graphics", support: "99%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/SVG" },

  // Media
  { name: "Web Audio", description: "Audio processing and synthesis", descriptionKo: "오디오 처리 및 합성", category: "Media", support: "96%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" },
  { name: "MediaRecorder", description: "Record audio and video", descriptionKo: "오디오/비디오 녹화", category: "Media", support: "95%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder" },
  { name: "MediaStream", description: "Access camera and microphone", descriptionKo: "카메라 및 마이크 접근", category: "Media", support: "96%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/MediaStream" },
  { name: "Speech Synthesis", description: "Text-to-speech", descriptionKo: "텍스트 음성 변환", category: "Media", support: "95%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis" },
  { name: "Speech Recognition", description: "Voice input", descriptionKo: "음성 입력", category: "Media", support: "85%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition" },

  // Workers
  { name: "Web Workers", description: "Background thread processing", descriptionKo: "백그라운드 스레드 처리", category: "Workers", support: "98%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API" },
  { name: "Service Workers", description: "Offline support and caching", descriptionKo: "오프라인 지원 및 캐싱", category: "Workers", support: "96%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API" },
  { name: "Shared Workers", description: "Share state across tabs", descriptionKo: "탭 간 상태 공유", category: "Workers", support: "75%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker" },

  // Device
  { name: "Geolocation", description: "Get user location", descriptionKo: "사용자 위치 가져오기", category: "Device", support: "97%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API" },
  { name: "Clipboard", description: "Read and write clipboard", descriptionKo: "클립보드 읽기/쓰기", category: "Device", support: "95%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API" },
  { name: "Notifications", description: "Push notifications", descriptionKo: "푸시 알림", category: "Device", support: "96%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API" },
  { name: "Vibration", description: "Device vibration", descriptionKo: "기기 진동", category: "Device", support: "85%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API" },
  { name: "Battery Status", description: "Battery information", descriptionKo: "배터리 정보", category: "Device", support: "80%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API" },

  // Utilities
  { name: "History", description: "Browser navigation control", descriptionKo: "브라우저 내비게이션 제어", category: "Utilities", support: "99%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/History_API" },
  { name: "URL", description: "URL parsing and manipulation", descriptionKo: "URL 파싱 및 조작", category: "Utilities", support: "99%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/URL" },
  { name: "FormData", description: "Form data handling", descriptionKo: "폼 데이터 처리", category: "Utilities", support: "99%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/FormData" },
  { name: "Crypto", description: "Cryptographic operations", descriptionKo: "암호화 작업", category: "Utilities", support: "98%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Crypto" },
  { name: "Performance", description: "Performance measurement", descriptionKo: "성능 측정", category: "Utilities", support: "98%", mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Performance" },
];

const categories = ["All", "DOM", "Network", "Storage", "Graphics", "Media", "Workers", "Device", "Utilities"];

export default function WebApiPage() {
  const { locale } = useI18n();
  const [search, setSearch] = createSignal("");
  const [category, setCategory] = createSignal("All");

  const filteredApis = () => {
    let apis = webApis;

    // Filter by category
    if (category() !== "All") {
      apis = apis.filter(api => api.category === category());
    }

    // Filter by search
    const q = search().toLowerCase();
    if (q) {
      apis = apis.filter(api =>
        api.name.toLowerCase().includes(q) ||
        api.description.toLowerCase().includes(q) ||
        api.descriptionKo.includes(q)
      );
    }

    return apis;
  };

  const groupedApis = () => {
    const apis = filteredApis();
    if (category() !== "All") {
      return { [category()]: apis };
    }

    return apis.reduce((acc, api) => {
      if (!acc[api.category]) acc[api.category] = [];
      acc[api.category].push(api);
      return acc;
    }, {} as Record<string, WebAPI[]>);
  };

  return (
    <>
      <Title>Web API - Permissive</Title>
      <Meta
        name="description"
        content={locale() === "ko"
          ? "브라우저 내장 웹표준 API 목록"
          : "Browser built-in Web Standard APIs"
        }
      />

      <DocsLayout>
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Web API
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            {locale() === "ko"
              ? "브라우저에 내장된 무료 API. 설치 없이 바로 사용 가능"
              : "Browser built-in APIs. Free to use, no installation required"
            }
          </p>
        </div>

        {/* Search & Filter */}
        <div class="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={locale() === "ko" ? "API 검색..." : "Search APIs..."}
              value={search()}
              onInput={(e) => setSearch(e.currentTarget.value)}
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filter */}
          <div class="flex flex-wrap gap-2">
            <For each={categories}>
              {(cat) => (
                <button
                  onClick={() => setCategory(cat)}
                  class={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    category() === cat
                      ? "bg-primary-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat === "All" ? (locale() === "ko" ? "전체" : "All") : cat}
                </button>
              )}
            </For>
          </div>
        </div>

        {/* Results count */}
        <div class="mb-4 text-sm text-slate-500 dark:text-slate-400">
          {filteredApis().length} {locale() === "ko" ? "개의 API" : "APIs"}
        </div>

        {/* API List */}
        <div class="space-y-8">
          <For each={Object.entries(groupedApis())}>
            {([categoryName, apis]) => (
              <section>
                <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                  {categoryName}
                </h2>
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <For each={apis}>
                    {(api) => (
                      <a
                        href={api.mdnUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all bg-white dark:bg-slate-800/50"
                      >
                        <div class="flex items-start justify-between mb-2">
                          <h3 class="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {api.name}
                          </h3>
                          <span class="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            {api.support}
                          </span>
                        </div>
                        <p class="text-sm text-slate-600 dark:text-slate-400">
                          {locale() === "ko" ? api.descriptionKo : api.description}
                        </p>
                        <div class="mt-2 flex items-center text-xs text-primary-500 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          MDN
                          <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </a>
                    )}
                  </For>
                </div>
              </section>
            )}
          </For>
        </div>

        {/* Empty state */}
        <Show when={filteredApis().length === 0}>
          <div class="text-center py-12">
            <div class="text-4xl mb-4">🔍</div>
            <p class="text-slate-500 dark:text-slate-400">
              {locale() === "ko" ? "검색 결과가 없습니다" : "No results found"}
            </p>
          </div>
        </Show>
      </DocsLayout>
    </>
  );
}
