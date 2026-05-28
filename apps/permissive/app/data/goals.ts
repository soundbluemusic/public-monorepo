/**
 * @fileoverview Goal-based 진입점 데이터 (Phase 2 — 뉴비 친화).
 *
 * "무엇을 만들고 싶나요?" 카드를 클릭하면 각 goal 페이지로 이동합니다.
 * 각 goal은 6~12개의 추천 라이브러리(`Library.name`과 정확히 일치)와
 * 시작 단계 가이드를 포함합니다.
 *
 * 라이브러리 이름은 `libraries.ts`의 실제 데이터와 검증되어 있습니다.
 * 빌드 시 미일치하면 `getLibrariesForGoal`이 누락된 이름을 로그에 출력합니다.
 */

import { type Library, libraries } from './libraries';

export interface GoalStep {
  /** 단계 제목 (영어/한국어) */
  title: { en: string; ko: string };
  /** 단계 설명 (영어/한국어) */
  description: { en: string; ko: string };
}

export interface Goal {
  /** URL slug (`/build/[id]`) */
  id: string;
  /** 카드 제목 + 페이지 헤더 */
  name: { en: string; ko: string };
  /** 카드 부제 (한 줄 설명) */
  tagline: { en: string; ko: string };
  /** 페이지 hero 영역의 상세 설명 (2~3 문장) */
  hero: { en: string; ko: string };
  /** emoji 아이콘 */
  icon: string;
  /** Tailwind 색상 토큰 (홈 카드 강조용) */
  accent: string;
  /**
   * 추천 라이브러리 이름 목록. `Library.name`과 정확히 일치해야 함.
   * 중요도 순으로 정렬 (앞쪽이 더 핵심).
   */
  libraries: string[];
  /** 시작 단계 가이드 (3~5 단계) */
  steps: GoalStep[];
}

export const goals: Goal[] = [
  {
    id: 'website',
    name: { en: 'Static Website', ko: '정적 웹사이트' },
    tagline: {
      en: 'Blog, docs, marketing — fast and SEO-friendly',
      ko: '블로그·문서·랜딩 페이지 — 빠르고 SEO 친화적',
    },
    hero: {
      en: 'Build a content-focused site that loads instantly and ranks well on search engines. Static site generators output plain HTML that any browser can crawl and any CDN can cache.',
      ko: '검색엔진에 잘 노출되고 즉시 로딩되는 콘텐츠 중심 사이트를 만듭니다. 정적 사이트 생성기는 어떤 브라우저든 크롤링 가능하고 CDN이 캐시하기 좋은 순수 HTML을 출력합니다.',
    },
    icon: '🌐',
    accent: 'text-emerald-500',
    libraries: [
      'Astro',
      'Next.js',
      'Gatsby',
      'Tailwind CSS',
      'TypeScript',
      'Sass',
      'Vite',
      'Biome',
      'Zod',
    ],
    steps: [
      {
        title: { en: 'Pick a generator', ko: '생성기 선택' },
        description: {
          en: 'Astro for content-heavy sites, Next.js for blogs needing React, Gatsby for GraphQL data sources.',
          ko: '콘텐츠 위주면 Astro, React 블로그면 Next.js, GraphQL 데이터 소스가 있으면 Gatsby.',
        },
      },
      {
        title: { en: 'Add styling', ko: '스타일링 추가' },
        description: {
          en: 'Tailwind CSS for utility-first, Sass if you prefer traditional CSS preprocessor.',
          ko: 'Utility-first 방식은 Tailwind CSS, 전통적 전처리기 선호 시 Sass.',
        },
      },
      {
        title: { en: 'Type-check content', ko: '콘텐츠 타입 체크' },
        description: {
          en: 'Use TypeScript + Zod schemas to validate frontmatter, CMS responses, or generated data.',
          ko: 'TypeScript + Zod 스키마로 frontmatter, CMS 응답, 생성 데이터를 검증.',
        },
      },
      {
        title: { en: 'Deploy to a CDN', ko: 'CDN에 배포' },
        description: {
          en: 'Output static HTML, push to Cloudflare Pages / Netlify / Vercel — free tier handles personal blogs easily.',
          ko: '정적 HTML 출력 후 Cloudflare Pages / Netlify / Vercel로. 개인 블로그는 무료 플랜으로 충분.',
        },
      },
    ],
  },
  {
    id: 'webapp',
    name: { en: 'Interactive Web App', ko: '인터랙티브 웹앱' },
    tagline: {
      en: 'SPA, dashboard, SaaS — rich client-side experience',
      ko: 'SPA·대시보드·SaaS — 풍부한 클라이언트 경험',
    },
    hero: {
      en: 'Build a single-page or SSR app with stateful forms, real-time data, and complex interactions. The stack below covers everything from routing to validation.',
      ko: '상태 폼, 실시간 데이터, 복잡한 상호작용을 갖춘 SPA 또는 SSR 앱을 만듭니다. 아래 스택은 라우팅부터 검증까지 모든 영역을 커버합니다.',
    },
    icon: '📱',
    accent: 'text-blue-500',
    libraries: [
      'React',
      'Vue',
      'Svelte',
      'SolidJS',
      'Next.js',
      'SvelteKit',
      'TanStack Router',
      'TanStack Query',
      'Zustand',
      'Tailwind CSS',
      'React Hook Form',
      'Zod',
      'TypeScript',
      'Vite',
    ],
    steps: [
      {
        title: { en: 'Choose a framework', ko: '프레임워크 선택' },
        description: {
          en: 'React for the largest ecosystem, Svelte for less boilerplate, SolidJS for fine-grained reactivity, Vue for balanced DX.',
          ko: '가장 큰 생태계는 React, 보일러플레이트 적게는 Svelte, 정교한 반응성은 SolidJS, 균형 잡힌 DX는 Vue.',
        },
      },
      {
        title: { en: 'Add routing + data', ko: '라우팅·데이터 추가' },
        description: {
          en: 'TanStack Router for type-safe routes, TanStack Query for server state caching/sync.',
          ko: '타입 안전 라우팅은 TanStack Router, 서버 상태 캐싱/동기화는 TanStack Query.',
        },
      },
      {
        title: { en: 'Manage client state', ko: '클라이언트 상태 관리' },
        description: {
          en: 'Zustand for simple stores, Jotai for atomic state. Skip Redux unless you need its devtools/middleware.',
          ko: '단순 스토어는 Zustand, 원자 상태는 Jotai. devtools/미들웨어 필요 없으면 Redux 생략.',
        },
      },
      {
        title: { en: 'Forms + validation', ko: '폼·검증' },
        description: {
          en: 'React Hook Form + Zod schema = fully typed forms with runtime validation.',
          ko: 'React Hook Form + Zod 스키마 조합으로 완전히 타입된 폼 + 런타임 검증.',
        },
      },
    ],
  },
  {
    id: 'interactive',
    name: { en: 'Games & 3D', ko: '게임·3D' },
    tagline: {
      en: 'Canvas, WebGL, physics — built-in-the-browser experiences',
      ko: '캔버스·WebGL·물리 — 브라우저 안에서 동작하는 체험',
    },
    hero: {
      en: 'Build games, 3D scenes, interactive art, or physics demos that run directly in the browser. The web has caught up to native — WebGPU and WebGL2 power AAA-quality visuals.',
      ko: '브라우저에서 직접 동작하는 게임, 3D 장면, 인터랙티브 아트, 물리 데모를 만듭니다. 웹은 이제 네이티브와 견줄 만합니다 — WebGPU와 WebGL2가 AAA급 그래픽을 구동합니다.',
    },
    icon: '🎮',
    accent: 'text-purple-500',
    libraries: [
      'Three.js',
      'React Three Fiber',
      'Babylon.js',
      'A-Frame',
      'p5.js',
      'Konva',
      'Fabric.js',
      'Paper.js',
      'CanvasKit',
      'Motion',
    ],
    steps: [
      {
        title: { en: 'Pick 2D or 3D', ko: '2D vs 3D 선택' },
        description: {
          en: '2D: Konva (objects) or p5.js (creative coding). 3D: Three.js (raw control) or Babylon.js (game engine features).',
          ko: '2D면 Konva(객체 기반) 또는 p5.js(크리에이티브 코딩). 3D면 Three.js(저수준 제어) 또는 Babylon.js(게임 엔진 기능).',
        },
      },
      {
        title: { en: 'React integration', ko: 'React 통합' },
        description: {
          en: 'React Three Fiber lets you write Three.js scenes declaratively as React components.',
          ko: 'React Three Fiber로 Three.js 장면을 React 컴포넌트처럼 선언적으로 작성 가능.',
        },
      },
      {
        title: { en: 'Add animation', ko: '애니메이션 추가' },
        description: {
          en: 'Motion (formerly Framer Motion) for UI choreography; raw requestAnimationFrame for game loops.',
          ko: 'UI 동작은 Motion(구 Framer Motion). 게임 루프는 raw requestAnimationFrame.',
        },
      },
      {
        title: { en: 'Optimize for the web', ko: '웹 최적화' },
        description: {
          en: 'Compress textures to KTX2/Basis, use draco for geometry, lazy-load heavy scenes.',
          ko: '텍스처는 KTX2/Basis로 압축, 지오메트리는 draco, 무거운 장면은 지연 로딩.',
        },
      },
    ],
  },
  {
    id: 'dataviz',
    name: { en: 'Data Visualization', ko: '데이터 시각화' },
    tagline: {
      en: 'Charts, dashboards, scientific plots',
      ko: '차트·대시보드·과학 시각화',
    },
    hero: {
      en: 'Render charts, dashboards, or scientific plots that scale from a few points to millions. Canvas-based libraries handle large datasets without DOM bloat.',
      ko: '소수의 데이터부터 수백만 포인트까지 다루는 차트, 대시보드, 과학 시각화를 렌더링합니다. Canvas 기반 라이브러리는 DOM 폭증 없이 대용량을 처리합니다.',
    },
    icon: '📊',
    accent: 'text-orange-500',
    libraries: [
      'p5.js',
      'CanvasKit',
      'Konva',
      'Paper.js',
      'Three.js',
      'React Three Fiber',
      'Math.js',
      'Simple Statistics',
      'stdlib',
    ],
    steps: [
      {
        title: { en: 'Pick a rendering target', ko: '렌더링 타겟 선택' },
        description: {
          en: 'SVG for under ~1,000 elements (interactive, accessible). Canvas/WebGL for larger datasets.',
          ko: '약 1,000개 이하 요소는 SVG (상호작용·접근성 우수). 대용량은 Canvas/WebGL.',
        },
      },
      {
        title: { en: 'Compute statistics', ko: '통계 연산' },
        description: {
          en: 'Math.js for symbolic math, Simple Statistics for descriptive stats, stdlib for scientific computing.',
          ko: '기호 수학은 Math.js, 기술 통계는 Simple Statistics, 과학 계산은 stdlib.',
        },
      },
      {
        title: { en: 'Build the visualization', ko: '시각화 구성' },
        description: {
          en: 'Konva for object-based 2D, p5.js for creative/educational plots, Three.js for 3D viz (volume rendering, point clouds).',
          ko: '객체 기반 2D는 Konva, 크리에이티브/교육용은 p5.js, 3D 시각화(볼륨 렌더링, 포인트 클라우드)는 Three.js.',
        },
      },
      {
        title: { en: 'Performance tuning', ko: '성능 튜닝' },
        description: {
          en: 'Aggregate large datasets server-side, virtualize off-screen elements, use OffscreenCanvas for heavy compute.',
          ko: '대용량 데이터는 서버에서 집계, 화면 밖 요소는 가상화, 무거운 연산은 OffscreenCanvas로.',
        },
      },
    ],
  },
  {
    id: 'ai-app',
    name: { en: 'AI / ML App', ko: 'AI · ML 앱' },
    tagline: {
      en: 'Run models in the browser — no server needed',
      ko: '브라우저에서 모델 실행 — 서버 불필요',
    },
    hero: {
      en: 'Run machine learning models directly in the browser using WebAssembly and WebGPU. No backend, no API costs — inference happens on the user device.',
      ko: 'WebAssembly와 WebGPU로 브라우저에서 머신러닝 모델을 직접 실행합니다. 백엔드도, API 비용도 없이 사용자 기기에서 추론이 이뤄집니다.',
    },
    icon: '🤖',
    accent: 'text-pink-500',
    libraries: [
      'Transformers.js',
      'TensorFlow.js',
      'ONNX Runtime Web',
      'MediaPipe',
      'OpenCV.js',
      'ml5.js',
      'Brain.js',
    ],
    steps: [
      {
        title: { en: 'Pick your task', ko: '작업 유형 선택' },
        description: {
          en: 'Text (sentiment, embedding): Transformers.js. Vision (face/pose detection): MediaPipe. Custom models: ONNX Runtime Web.',
          ko: '텍스트(감정·임베딩)는 Transformers.js. 비전(얼굴·포즈 감지)은 MediaPipe. 커스텀 모델은 ONNX Runtime Web.',
        },
      },
      {
        title: { en: 'Choose model format', ko: '모델 포맷 선택' },
        description: {
          en: 'HuggingFace models → Transformers.js. PyTorch/TF exported to ONNX → ONNX Runtime. Train in-browser → ml5.js or Brain.js.',
          ko: 'HuggingFace 모델은 Transformers.js. PyTorch/TF는 ONNX로 변환 후 ONNX Runtime. 브라우저 학습은 ml5.js 또는 Brain.js.',
        },
      },
      {
        title: { en: 'Enable WebGPU/WASM', ko: 'WebGPU/WASM 활성화' },
        description: {
          en: 'Use WebGPU backend when available (10-100x faster than CPU), fall back to WASM SIMD.',
          ko: '가능하면 WebGPU 백엔드 사용(CPU 대비 10~100배 빠름), 미지원 시 WASM SIMD로 폴백.',
        },
      },
      {
        title: { en: 'Optimize model size', ko: '모델 크기 최적화' },
        description: {
          en: 'Quantize to INT8 (4x smaller), use distilled variants (DistilBERT, MobileNet), lazy-load on user interaction.',
          ko: 'INT8 양자화(4배 작아짐), 디스틸 버전 사용(DistilBERT, MobileNet), 사용자 인터랙션 시 지연 로딩.',
        },
      },
    ],
  },
  {
    id: 'commerce',
    name: { en: 'E-commerce App', ko: '커머스 앱' },
    tagline: {
      en: 'Storefront, cart, checkout — type-safe and SEO-ready',
      ko: '스토어·장바구니·결제 — 타입 안전 + SEO 대응',
    },
    hero: {
      en: 'Build a storefront with type-safe API calls, validated checkout forms, and server-rendered product pages for SEO. Combine with a payment provider (Stripe, Polar) and a database.',
      ko: '타입 안전 API, 검증된 결제 폼, SEO용 서버 렌더 상품 페이지를 갖춘 스토어를 만듭니다. 결제 제공자(Stripe, Polar)와 데이터베이스를 조합하세요.',
    },
    icon: '🛍️',
    accent: 'text-rose-500',
    libraries: [
      'Next.js',
      'Remix',
      'SvelteKit',
      'tRPC',
      'TanStack Query',
      'React Hook Form',
      'Zod',
      'Tailwind CSS',
      'TypeScript',
      'Vitest',
      'Playwright',
    ],
    steps: [
      {
        title: { en: 'Choose SSR framework', ko: 'SSR 프레임워크 선택' },
        description: {
          en: 'Next.js for the largest ecosystem, Remix for nested routing UX, SvelteKit for smaller bundles. SSR is critical — product pages need to be indexable.',
          ko: '큰 생태계면 Next.js, 중첩 라우팅 UX면 Remix, 작은 번들이면 SvelteKit. 상품 페이지는 색인이 필요하므로 SSR이 필수.',
        },
      },
      {
        title: { en: 'Type-safe API + DB', ko: '타입 안전 API · DB' },
        description: {
          en: 'tRPC for end-to-end typed RPCs without REST/GraphQL ceremony. Zod schemas double as runtime validators.',
          ko: 'REST/GraphQL 의례 없이 종단간 타입 RPC를 위한 tRPC. Zod 스키마는 런타임 검증기 역할도 겸함.',
        },
      },
      {
        title: { en: 'Checkout forms', ko: '결제 폼' },
        description: {
          en: 'React Hook Form for performant uncontrolled forms, Zod for validation that matches your DB schema.',
          ko: '성능 좋은 비제어 폼은 React Hook Form, DB 스키마와 일치하는 검증은 Zod.',
        },
      },
      {
        title: { en: 'Test the critical path', ko: '핵심 경로 테스트' },
        description: {
          en: 'Vitest for unit tests on cart logic, Playwright for full E2E (browse → cart → checkout → confirmation).',
          ko: '장바구니 로직 단위 테스트는 Vitest, 전체 흐름(탐색 → 장바구니 → 결제 → 확인)은 Playwright.',
        },
      },
    ],
  },
];

/**
 * Goal id → Goal 조회.
 */
export function getGoalById(id: string): Goal | undefined {
  return goals.find((g) => g.id === id);
}

/**
 * Goal이 추천하는 라이브러리들을 실제 Library 객체로 변환.
 * `libraries.ts`에 없는 이름은 콘솔 경고 후 제외 (빌드는 깨지지 않음).
 */
export function getLibrariesForGoal(goal: Goal): Library[] {
  const byName = new Map<string, Library>(libraries.map((lib) => [lib.name, lib]));
  const resolved: Library[] = [];
  const missing: string[] = [];
  for (const name of goal.libraries) {
    const lib = byName.get(name);
    if (lib) {
      resolved.push(lib);
    } else {
      missing.push(name);
    }
  }
  if (missing.length > 0) {
    console.warn(`[goals] Goal '${goal.id}' references unknown libraries: ${missing.join(', ')}`);
  }
  return resolved;
}
