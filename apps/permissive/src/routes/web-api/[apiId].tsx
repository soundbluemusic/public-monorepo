import { Title, Meta } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import { Show, For } from "solid-js";
import DocsLayout from "@/components/layout/DocsLayout";
import { useI18n } from "@/i18n";

// API 데이터 (실제로는 별도 파일로 분리 가능)
const webApis: Record<string, {
  name: string;
  description: string;
  descriptionKo: string;
  category: string;
  support: string;
  mdnUrl: string;
  features?: string[];
  featuresKo?: string[];
  example?: string;
  relatedApis?: string[];
}> = {
  "fetch": {
    name: "Fetch API",
    description: "Modern interface for making HTTP requests, replacing XMLHttpRequest with a cleaner, Promise-based approach.",
    descriptionKo: "XMLHttpRequest를 대체하는 현대적인 HTTP 요청 인터페이스로, Promise 기반의 깔끔한 API를 제공합니다.",
    category: "Network",
    support: "97%",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
    features: ["Promise-based", "Stream support", "Request/Response objects", "CORS support"],
    featuresKo: ["Promise 기반", "스트림 지원", "Request/Response 객체", "CORS 지원"],
    example: `fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));`,
    relatedApis: ["XMLHttpRequest", "Request", "Response", "Headers"]
  },
  "localstorage": {
    name: "localStorage",
    description: "Web Storage API that allows storing key-value pairs in the browser with no expiration time.",
    descriptionKo: "만료 시간 없이 브라우저에 키-값 쌍을 저장할 수 있는 Web Storage API입니다.",
    category: "Storage",
    support: "99%",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
    features: ["Persistent storage", "5MB+ capacity", "Synchronous API", "Same-origin policy"],
    featuresKo: ["영구 저장", "5MB+ 용량", "동기 API", "동일 출처 정책"],
    example: `// 저장
localStorage.setItem('user', JSON.stringify({ name: 'John' }));

// 불러오기
const user = JSON.parse(localStorage.getItem('user'));`,
    relatedApis: ["sessionStorage", "IndexedDB", "Cache API"]
  },
  "websocket": {
    name: "WebSocket",
    description: "Protocol providing full-duplex communication channels over a single TCP connection.",
    descriptionKo: "단일 TCP 연결을 통해 전이중 통신 채널을 제공하는 프로토콜입니다.",
    category: "Network",
    support: "97%",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/WebSocket",
    features: ["Real-time communication", "Bi-directional", "Low latency", "Binary data support"],
    featuresKo: ["실시간 통신", "양방향", "저지연", "바이너리 데이터 지원"],
    example: `const socket = new WebSocket('wss://example.com/socket');

socket.onmessage = (event) => {
  console.log('Message:', event.data);
};

socket.send('Hello Server!');`,
    relatedApis: ["Server-Sent Events", "Fetch API", "BroadcastChannel"]
  },
  "canvas": {
    name: "Canvas API",
    description: "Provides a means for drawing graphics via JavaScript and the HTML <canvas> element.",
    descriptionKo: "JavaScript와 HTML <canvas> 요소를 통해 그래픽을 그릴 수 있는 수단을 제공합니다.",
    category: "Graphics",
    support: "99%",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
    features: ["2D drawing", "Image manipulation", "Animation support", "Pixel manipulation"],
    featuresKo: ["2D 그리기", "이미지 조작", "애니메이션 지원", "픽셀 조작"],
    example: `const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 100, 100);`,
    relatedApis: ["WebGL", "OffscreenCanvas", "Path2D"]
  }
};

export default function WebApiDetailPage() {
  const params = useParams();
  const { locale } = useI18n();
  const isKo = () => locale() === "ko";

  const api = () => webApis[params.apiId.toLowerCase()];

  return (
    <>
      <Show
        when={api()}
        fallback={
          <>
            <Title>{isKo() ? "API를 찾을 수 없습니다" : "API Not Found"} - Permissive</Title>
            <DocsLayout>
              <div class="text-center py-16">
                <div class="text-6xl mb-4">🔍</div>
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {isKo() ? "API를 찾을 수 없습니다" : "API Not Found"}
                </h1>
                <p class="text-slate-600 dark:text-slate-400 mb-6">
                  {isKo() ? "요청하신 API 정보가 없습니다." : "The requested API information is not available."}
                </p>
                <A
                  href="/web-api"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {isKo() ? "← Web API 목록으로" : "← Back to Web API"}
                </A>
              </div>
            </DocsLayout>
          </>
        }
      >
        <Title>{api()!.name} - Web API - Permissive</Title>
        <Meta name="description" content={isKo() ? api()!.descriptionKo : api()!.description} />

        <DocsLayout>
          {/* Breadcrumb */}
          <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
            <A href="/" class="hover:text-primary-500">Home</A>
            <span>/</span>
            <A href="/web-api" class="hover:text-primary-500">Web API</A>
            <span>/</span>
            <span class="text-slate-900 dark:text-white">{api()!.name}</span>
          </nav>

          {/* Header */}
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium">
                {api()!.category}
              </span>
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
                {api()!.support} {isKo() ? "지원" : "Support"}
              </span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              {api()!.name}
            </h1>
            <p class="text-lg text-slate-600 dark:text-slate-400">
              {isKo() ? api()!.descriptionKo : api()!.description}
            </p>
          </div>

          {/* Features */}
          <Show when={api()!.features}>
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                {isKo() ? "주요 기능" : "Key Features"}
              </h2>
              <ul class="grid sm:grid-cols-2 gap-3">
                <For each={isKo() ? api()!.featuresKo : api()!.features}>
                  {(feature) => (
                    <li class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <svg class="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span class="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  )}
                </For>
              </ul>
            </section>
          </Show>

          {/* Code Example */}
          <Show when={api()!.example}>
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                {isKo() ? "코드 예제" : "Code Example"}
              </h2>
              <div class="relative">
                <pre class="p-4 bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-xl overflow-x-auto text-sm">
                  <code>{api()!.example}</code>
                </pre>
              </div>
            </section>
          </Show>

          {/* Related APIs */}
          <Show when={api()!.relatedApis && api()!.relatedApis!.length > 0}>
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                {isKo() ? "관련 API" : "Related APIs"}
              </h2>
              <div class="flex flex-wrap gap-2">
                <For each={api()!.relatedApis}>
                  {(related) => (
                    <span class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm">
                      {related}
                    </span>
                  )}
                </For>
              </div>
            </section>
          </Show>

          {/* MDN Link */}
          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <a
              href={api()!.mdnUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
            >
              <span>{isKo() ? "MDN 문서 보기" : "View MDN Docs"}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <A
              href="/web-api"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {isKo() ? "← 목록으로" : "← Back to List"}
            </A>
          </div>
        </DocsLayout>
      </Show>
    </>
  );
}
