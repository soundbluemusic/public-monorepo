import { Title, Meta } from "@solidjs/meta";
import { createSignal, For, Show } from "solid-js";
import DocsLayout from "@/components/layout/DocsLayout";
import { useI18n } from "@/i18n";

interface Library {
  name: string;
  description: string;
  descriptionKo: string;
  category: string;
  license: string;
  github: string;
  npm?: string;
  stars: string;
  usedHere?: boolean;
}

const libraries: Library[] = [
  // Frameworks
  { name: "React", description: "A JavaScript library for building user interfaces", descriptionKo: "사용자 인터페이스 구축을 위한 자바스크립트 라이브러리", category: "Frameworks", license: "MIT", github: "https://github.com/facebook/react", npm: "react", stars: "220k" },
  { name: "Vue", description: "Progressive JavaScript framework", descriptionKo: "점진적 자바스크립트 프레임워크", category: "Frameworks", license: "MIT", github: "https://github.com/vuejs/core", npm: "vue", stars: "207k" },
  { name: "Solid.js", description: "Simple and performant reactivity", descriptionKo: "간단하고 성능 좋은 반응형 라이브러리", category: "Frameworks", license: "MIT", github: "https://github.com/solidjs/solid", npm: "solid-js", stars: "32k", usedHere: true },
  { name: "Svelte", description: "Cybernetically enhanced web apps", descriptionKo: "사이버네틱하게 향상된 웹 앱", category: "Frameworks", license: "MIT", github: "https://github.com/sveltejs/svelte", npm: "svelte", stars: "79k" },
  { name: "Preact", description: "Fast 3kB alternative to React", descriptionKo: "3kB의 빠른 React 대안", category: "Frameworks", license: "MIT", github: "https://github.com/preactjs/preact", npm: "preact", stars: "36k" },
  { name: "Alpine.js", description: "Rugged, minimal framework", descriptionKo: "견고하고 미니멀한 프레임워크", category: "Frameworks", license: "MIT", github: "https://github.com/alpinejs/alpine", npm: "alpinejs", stars: "28k" },
  { name: "Lit", description: "Simple, fast web components", descriptionKo: "간단하고 빠른 웹 컴포넌트", category: "Frameworks", license: "BSD-3", github: "https://github.com/lit/lit", npm: "lit", stars: "18k" },

  // State Management
  { name: "Zustand", description: "Small, fast state-management", descriptionKo: "작고 빠른 상태 관리", category: "State", license: "MIT", github: "https://github.com/pmndrs/zustand", npm: "zustand", stars: "47k" },
  { name: "Jotai", description: "Primitive and flexible state", descriptionKo: "원시적이고 유연한 상태 관리", category: "State", license: "MIT", github: "https://github.com/pmndrs/jotai", npm: "jotai", stars: "18k" },
  { name: "Redux Toolkit", description: "Official Redux toolset", descriptionKo: "공식 Redux 툴셋", category: "State", license: "MIT", github: "https://github.com/reduxjs/redux-toolkit", npm: "@reduxjs/toolkit", stars: "10k" },
  { name: "Pinia", description: "Intuitive Vue store", descriptionKo: "직관적인 Vue 스토어", category: "State", license: "MIT", github: "https://github.com/vuejs/pinia", npm: "pinia", stars: "13k" },
  { name: "Valtio", description: "Proxy-state made simple", descriptionKo: "간단한 프록시 상태", category: "State", license: "MIT", github: "https://github.com/pmndrs/valtio", npm: "valtio", stars: "9k" },
  { name: "MobX", description: "Simple, scalable state management", descriptionKo: "간단하고 확장 가능한 상태 관리", category: "State", license: "MIT", github: "https://github.com/mobxjs/mobx", npm: "mobx", stars: "27k" },

  // Routing
  { name: "React Router", description: "Declarative routing for React", descriptionKo: "React를 위한 선언적 라우팅", category: "Routing", license: "MIT", github: "https://github.com/remix-run/react-router", npm: "react-router-dom", stars: "53k" },
  { name: "TanStack Router", description: "Type-safe router with built-in caching", descriptionKo: "타입 안전 라우터 + 내장 캐싱", category: "Routing", license: "MIT", github: "https://github.com/TanStack/router", npm: "@tanstack/react-router", stars: "8k" },
  { name: "Vue Router", description: "Official router for Vue.js", descriptionKo: "Vue.js 공식 라우터", category: "Routing", license: "MIT", github: "https://github.com/vuejs/router", npm: "vue-router", stars: "19k" },

  // Styling
  { name: "Tailwind CSS", description: "Utility-first CSS framework", descriptionKo: "유틸리티 우선 CSS 프레임워크", category: "Styling", license: "MIT", github: "https://github.com/tailwindlabs/tailwindcss", npm: "tailwindcss", stars: "82k", usedHere: true },
  { name: "UnoCSS", description: "Instant on-demand atomic CSS", descriptionKo: "즉시 온디맨드 아토믹 CSS", category: "Styling", license: "MIT", github: "https://github.com/unocss/unocss", npm: "unocss", stars: "16k" },
  { name: "styled-components", description: "CSS-in-JS for React", descriptionKo: "React를 위한 CSS-in-JS", category: "Styling", license: "MIT", github: "https://github.com/styled-components/styled-components", npm: "styled-components", stars: "40k" },
  { name: "Emotion", description: "CSS-in-JS library", descriptionKo: "CSS-in-JS 라이브러리", category: "Styling", license: "MIT", github: "https://github.com/emotion-js/emotion", npm: "@emotion/react", stars: "17k" },
  { name: "Panda CSS", description: "Universal, Type-Safe CSS-in-JS", descriptionKo: "범용 타입 안전 CSS-in-JS", category: "Styling", license: "MIT", github: "https://github.com/chakra-ui/panda", npm: "@pandacss/dev", stars: "5k" },

  // Build Tools
  { name: "Vite", description: "Next generation frontend tooling", descriptionKo: "차세대 프론트엔드 도구", category: "Build", license: "MIT", github: "https://github.com/vitejs/vite", npm: "vite", stars: "68k", usedHere: true },
  { name: "esbuild", description: "Extremely fast bundler", descriptionKo: "초고속 번들러", category: "Build", license: "MIT", github: "https://github.com/evanw/esbuild", npm: "esbuild", stars: "38k" },
  { name: "Rollup", description: "ES module bundler", descriptionKo: "ES 모듈 번들러", category: "Build", license: "MIT", github: "https://github.com/rollup/rollup", npm: "rollup", stars: "25k" },
  { name: "SWC", description: "Rust-based web compiler", descriptionKo: "Rust 기반 웹 컴파일러", category: "Build", license: "Apache-2.0", github: "https://github.com/swc-project/swc", npm: "@swc/core", stars: "31k" },
  { name: "Turbopack", description: "Rust-powered successor to Webpack", descriptionKo: "Rust 기반 Webpack 후속", category: "Build", license: "MIT", github: "https://github.com/vercel/turbo", npm: "turbo", stars: "26k" },
  { name: "Parcel", description: "Zero config build tool", descriptionKo: "무설정 빌드 도구", category: "Build", license: "MIT", github: "https://github.com/parcel-bundler/parcel", npm: "parcel", stars: "43k" },

  // Data Fetching
  { name: "TanStack Query", description: "Powerful async state management", descriptionKo: "강력한 비동기 상태 관리", category: "Data", license: "MIT", github: "https://github.com/TanStack/query", npm: "@tanstack/react-query", stars: "42k" },
  { name: "SWR", description: "React Hooks for data fetching", descriptionKo: "데이터 페칭을 위한 React Hooks", category: "Data", license: "MIT", github: "https://github.com/vercel/swr", npm: "swr", stars: "30k" },
  { name: "Axios", description: "Promise based HTTP client", descriptionKo: "프로미스 기반 HTTP 클라이언트", category: "Data", license: "MIT", github: "https://github.com/axios/axios", npm: "axios", stars: "105k" },
  { name: "ky", description: "Tiny HTTP client based on Fetch", descriptionKo: "Fetch 기반 작은 HTTP 클라이언트", category: "Data", license: "MIT", github: "https://github.com/sindresorhus/ky", npm: "ky", stars: "13k" },

  // UI Components
  { name: "Radix UI", description: "Unstyled, accessible components", descriptionKo: "스타일 없는 접근성 컴포넌트", category: "UI", license: "MIT", github: "https://github.com/radix-ui/primitives", npm: "@radix-ui/react-dialog", stars: "16k" },
  { name: "Headless UI", description: "Unstyled, accessible UI components", descriptionKo: "스타일 없는 접근성 UI 컴포넌트", category: "UI", license: "MIT", github: "https://github.com/tailwindlabs/headlessui", npm: "@headlessui/react", stars: "26k" },
  { name: "shadcn/ui", description: "Re-usable components built with Radix", descriptionKo: "Radix로 만든 재사용 컴포넌트", category: "UI", license: "MIT", github: "https://github.com/shadcn-ui/ui", stars: "74k" },
  { name: "Ark UI", description: "Headless library for building UI", descriptionKo: "UI 구축을 위한 헤드리스 라이브러리", category: "UI", license: "MIT", github: "https://github.com/chakra-ui/ark", npm: "@ark-ui/react", stars: "4k" },

  // Animation
  { name: "Framer Motion", description: "Production-ready motion library", descriptionKo: "프로덕션 레디 모션 라이브러리", category: "Animation", license: "MIT", github: "https://github.com/framer/motion", npm: "framer-motion", stars: "24k" },
  { name: "GSAP", description: "Professional-grade animation", descriptionKo: "전문가급 애니메이션", category: "Animation", license: "Custom", github: "https://github.com/greensock/GSAP", npm: "gsap", stars: "20k" },
  { name: "Lottie", description: "Render After Effects animations", descriptionKo: "After Effects 애니메이션 렌더링", category: "Animation", license: "MIT", github: "https://github.com/airbnb/lottie-web", npm: "lottie-web", stars: "30k" },
  { name: "Auto Animate", description: "Zero-config animations", descriptionKo: "무설정 애니메이션", category: "Animation", license: "MIT", github: "https://github.com/formkit/auto-animate", npm: "@formkit/auto-animate", stars: "13k" },

  // Forms
  { name: "React Hook Form", description: "Performant, flexible forms", descriptionKo: "성능 좋은 유연한 폼", category: "Forms", license: "MIT", github: "https://github.com/react-hook-form/react-hook-form", npm: "react-hook-form", stars: "42k" },
  { name: "Formik", description: "Build forms in React", descriptionKo: "React에서 폼 구축", category: "Forms", license: "Apache-2.0", github: "https://github.com/jaredpalmer/formik", npm: "formik", stars: "34k" },
  { name: "Zod", description: "TypeScript-first schema validation", descriptionKo: "TypeScript 우선 스키마 검증", category: "Forms", license: "MIT", github: "https://github.com/colinhacks/zod", npm: "zod", stars: "34k" },
  { name: "Yup", description: "Schema validation", descriptionKo: "스키마 검증", category: "Forms", license: "MIT", github: "https://github.com/jquense/yup", npm: "yup", stars: "23k" },

  // Utilities
  { name: "date-fns", description: "Modern JavaScript date utility", descriptionKo: "모던 자바스크립트 날짜 유틸리티", category: "Utilities", license: "MIT", github: "https://github.com/date-fns/date-fns", npm: "date-fns", stars: "35k" },
  { name: "Day.js", description: "2kB immutable date library", descriptionKo: "2kB 불변 날짜 라이브러리", category: "Utilities", license: "MIT", github: "https://github.com/iamkun/dayjs", npm: "dayjs", stars: "47k" },
  { name: "Lodash", description: "Modern JavaScript utility library", descriptionKo: "모던 자바스크립트 유틸리티", category: "Utilities", license: "MIT", github: "https://github.com/lodash/lodash", npm: "lodash", stars: "60k" },
  { name: "uuid", description: "Generate RFC-compliant UUIDs", descriptionKo: "RFC 호환 UUID 생성", category: "Utilities", license: "MIT", github: "https://github.com/uuidjs/uuid", npm: "uuid", stars: "15k" },
  { name: "nanoid", description: "Tiny, secure URL-friendly ID", descriptionKo: "작고 안전한 URL 친화적 ID", category: "Utilities", license: "MIT", github: "https://github.com/ai/nanoid", npm: "nanoid", stars: "24k" },
];

const categories = ["All", "Frameworks", "State", "Routing", "Styling", "Build", "Data", "UI", "Animation", "Forms", "Utilities"] as const;

type CategoryFilter = (typeof categories)[number];

export default function LibrariesPage() {
  const { locale } = useI18n();
  const [search, setSearch] = createSignal("");
  const [category, setCategory] = createSignal<CategoryFilter>("All");

  const filteredLibraries = () => {
    let libs = libraries;

    // Filter by category
    if (category() !== "All") {
      libs = libs.filter(lib => lib.category === category());
    }

    // Filter by search
    const q = search().toLowerCase();
    if (q) {
      libs = libs.filter(lib =>
        lib.name.toLowerCase().includes(q) ||
        lib.description.toLowerCase().includes(q) ||
        lib.descriptionKo.includes(q)
      );
    }

    return libs;
  };

  const groupedLibraries = () => {
    const libs = filteredLibraries();
    if (category() !== "All") {
      return { [category()]: libs };
    }

    return libs.reduce((acc, lib) => {
      if (!acc[lib.category]) acc[lib.category] = [];
      acc[lib.category].push(lib);
      return acc;
    }, {} as Record<string, Library[]>);
  };

  return (
    <>
      <Title>Libraries - Permissive</Title>
      <Meta
        name="description"
        content={locale() === "ko"
          ? "MIT 라이센스 오픈소스 라이브러리 목록"
          : "MIT licensed open source libraries"
        }
      />

      <DocsLayout>
        {/* Header */}
        <div class="mb-8">
          <h1
            class="text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Libraries
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {locale() === "ko"
              ? "MIT 라이센스 오픈소스. 상업적 사용 가능"
              : "MIT licensed open source. Free for commercial use"
            }
          </p>
        </div>

        {/* Search & Filter */}
        <div class="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div class="relative flex-1">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "var(--text-tertiary)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={locale() === "ko" ? "라이브러리 검색..." : "Search libraries..."}
              value={search()}
              onInput={(e) => setSearch(e.currentTarget.value)}
              class="w-full pl-10 pr-4 py-2.5 rounded-xl transition-all"
              style={{
                "background-color": "var(--bg-elevated)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)"
              }}
            />
          </div>

          {/* Category Filter */}
          <div class="flex flex-wrap gap-2">
            <For each={categories}>
              {(cat) => (
                <button
                  onClick={() => setCategory(cat)}
                  class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    "background-color": category() === cat ? "var(--accent-primary)" : "var(--bg-tertiary)",
                    color: category() === cat ? "white" : "var(--text-secondary)"
                  }}
                >
                  {cat === "All" ? (locale() === "ko" ? "전체" : "All") : cat}
                </button>
              )}
            </For>
          </div>
        </div>

        {/* Results count */}
        <div class="mb-4 text-sm" style={{ color: "var(--text-tertiary)" }}>
          {filteredLibraries().length} {locale() === "ko" ? "개의 라이브러리" : "libraries"}
        </div>

        {/* Library List */}
        <div class="space-y-8">
          <For each={Object.entries(groupedLibraries())}>
            {([categoryName, libs]) => (
              <section>
                <h2
                  class="text-lg font-semibold mb-4 pb-2"
                  style={{ color: "var(--text-primary)", "border-bottom": "1px solid var(--border-primary)" }}
                >
                  {categoryName}
                </h2>
                <div class="grid sm:grid-cols-2 gap-3">
                  <For each={libs}>
                    {(lib) => (
                      <div
                        class="group p-4 rounded-xl transition-all hover:shadow-md"
                        style={{
                          "background-color": "var(--bg-elevated)",
                          border: "1px solid var(--border-primary)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--accent-primary)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--border-primary)";
                        }}
                      >
                        <div class="flex items-start justify-between mb-2">
                          <div class="flex items-center gap-2">
                            <h3
                              class="font-semibold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {lib.name}
                            </h3>
                            <Show when={lib.usedHere}>
                              <span
                                class="text-xs px-2 py-0.5 rounded-full"
                                style={{ "background-color": "rgba(176, 136, 48, 0.15)", color: "var(--color-warning)" }}
                              >
                                {locale() === "ko" ? "사용 중" : "Used here"}
                              </span>
                            </Show>
                          </div>
                          <div class="flex items-center gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                            <span class="flex items-center gap-1">
                              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                              {lib.stars}
                            </span>
                          </div>
                        </div>
                        <p class="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                          {locale() === "ko" ? lib.descriptionKo : lib.description}
                        </p>
                        <div class="flex items-center gap-3 text-xs">
                          <span class="badge-mit">
                            {lib.license}
                          </span>
                          <a
                            href={lib.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="transition-colors"
                            style={{ color: "var(--text-tertiary)" }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-primary)"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-tertiary)"}
                          >
                            GitHub
                          </a>
                          <Show when={lib.npm}>
                            <a
                              href={`https://www.npmjs.com/package/${lib.npm}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="transition-colors"
                              style={{ color: "var(--text-tertiary)" }}
                              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-primary)"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-tertiary)"}
                            >
                              npm
                            </a>
                          </Show>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </section>
            )}
          </For>
        </div>

        {/* Empty state */}
        <Show when={filteredLibraries().length === 0}>
          <div class="text-center py-12">
            <div class="text-4xl mb-4">🔍</div>
            <p style={{ color: "var(--text-tertiary)" }}>
              {locale() === "ko" ? "검색 결과가 없습니다" : "No results found"}
            </p>
          </div>
        </Show>
      </DocsLayout>
    </>
  );
}
