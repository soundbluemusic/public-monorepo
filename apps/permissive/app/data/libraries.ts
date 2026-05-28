import { libraryEnrichment } from './library-enrichment';

export interface Library {
  name: string;
  description: string;
  descriptionKo: string;
  /**
   * 라이브러리가 속한 카테고리 (다중 분류 허용).
   * 첫 번째 항목이 primary category로 사용됩니다.
   * `categoryMeta` 의 `name.en` 값과 정확히 일치해야 합니다.
   */
  categories: string[];
  license: string;
  github: string;
  website?: string;
  npm?: string;
  stars: string;
  usedHere?: boolean;
  trending?: boolean;
  yearReleased?: number;
  tags?: string[];
  /** WASM 기반 여부 */
  wasmBased?: boolean;
  /** 용도 설명 (어디에 쓰이는지) */
  useCases?: { en: string; ko: string };
  /** 코드 예시 */
  codeExample?: string;
}

/** 카테고리 메타데이터 (SEO용) */
export interface CategoryMeta {
  id: string;
  name: { en: string; ko: string };
  description: { en: string; ko: string };
}

/**
 * Raw 라이브러리 배열. `library-enrichment.ts`의 useCases/codeExample이
 * 파일 끝에서 자동 merge되어 최종 `libraries` export로 노출됩니다.
 */
const RAW_LIBRARIES: Library[] = [
  // Routing
  {
    name: 'React Router',
    description: 'Declarative routing for React',
    descriptionKo: 'React를 위한 선언적 라우팅',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/remix-run/react-router',
    website: 'https://reactrouter.com',
    npm: 'react-router',
    stars: '53k',
    usedHere: true,
    trending: true,
    yearReleased: 2014,
    tags: ['React', 'SSG', 'SSR', 'TypeScript'],
  },
  {
    name: 'TanStack Router',
    description: 'Type-safe routing for React',
    descriptionKo: 'React를 위한 타입 안전 라우팅',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/TanStack/router',
    website: 'https://tanstack.com/router/latest',
    npm: '@tanstack/react-router',
    stars: '8k',
    trending: true,
    yearReleased: 2023,
    tags: ['React', 'TypeScript', 'Type-safe'],
  },
  {
    name: 'Wouter',
    description: 'Minimalist routing for React',
    descriptionKo: 'React를 위한 미니멀 라우팅',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/molefrog/wouter',
    npm: 'wouter',
    stars: '6k',
    yearReleased: 2019,
    tags: ['React', 'Minimal'],
  },

  // Meta-frameworks
  {
    name: 'Next.js',
    description: 'The React framework for production',
    descriptionKo: '프로덕션을 위한 React 프레임워크',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/vercel/next.js',
    website: 'https://nextjs.org',
    npm: 'next',
    stars: '128k',
    trending: true,
    yearReleased: 2016,
    tags: ['React', 'SSR', 'SSG', 'TypeScript'],
  },
  {
    name: 'Astro',
    description: 'Build fast websites, faster',
    descriptionKo: '빠른 웹사이트를 더 빠르게',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/withastro/astro',
    website: 'https://astro.build',
    npm: 'astro',
    stars: '47k',
    trending: true,
    yearReleased: 2021,
    tags: ['SSG', 'MPA', 'TypeScript'],
  },
  {
    name: 'Remix',
    description: 'Full stack web framework',
    descriptionKo: '풀스택 웹 프레임워크',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/remix-run/remix',
    website: 'https://remix.run',
    npm: '@remix-run/react',
    stars: '30k',
    trending: true,
    yearReleased: 2020,
    tags: ['React', 'SSR', 'TypeScript'],
  },
  {
    name: 'Nuxt',
    description: 'The Intuitive Vue Framework',
    descriptionKo: '직관적인 Vue 프레임워크',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/nuxt/nuxt',
    website: 'https://nuxt.com',
    npm: 'nuxt',
    stars: '55k',
    trending: true,
    yearReleased: 2016,
    tags: ['Vue', 'SSR', 'SSG', 'TypeScript'],
  },
  {
    name: 'SvelteKit',
    description: 'The fastest way to build Svelte apps',
    descriptionKo: 'Svelte 앱을 만드는 가장 빠른 방법',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/sveltejs/kit',
    website: 'https://svelte.dev/docs/kit/introduction',
    npm: '@sveltejs/kit',
    stars: '18k',
    trending: true,
    yearReleased: 2020,
    tags: ['Svelte', 'SSR', 'SSG', 'TypeScript'],
  },
  {
    name: 'Qwik',
    description: 'Instant-loading web apps',
    descriptionKo: '즉시 로딩되는 웹 앱',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/QwikDev/qwik',
    website: 'https://qwik.dev',
    npm: '@builder.io/qwik',
    stars: '21k',
    trending: true,
    yearReleased: 2021,
    tags: ['Resumability', 'SSR', 'TypeScript'],
  },
  {
    name: 'Gatsby',
    description: 'Build blazing fast websites',
    descriptionKo: '매우 빠른 웹사이트 구축',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/gatsbyjs/gatsby',
    website: 'https://www.gatsbyjs.com',
    npm: 'gatsby',
    stars: '55k',
    yearReleased: 2015,
    tags: ['React', 'SSG', 'GraphQL'],
  },

  // Frameworks
  {
    name: 'React',
    description: 'A JavaScript library for building user interfaces',
    descriptionKo: '사용자 인터페이스 구축을 위한 자바스크립트 라이브러리',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/facebook/react',
    website: 'https://react.dev',
    npm: 'react',
    stars: '230k',
    usedHere: true,
    yearReleased: 2013,
    tags: ['UI', 'Components', 'TypeScript'],
  },
  {
    name: 'Vue',
    description: 'Progressive JavaScript framework',
    descriptionKo: '점진적 자바스크립트 프레임워크',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/vuejs/core',
    website: 'https://vuejs.org',
    npm: 'vue',
    stars: '207k',
    yearReleased: 2014,
    tags: ['UI', 'Components', 'TypeScript'],
  },
  {
    name: 'Svelte',
    description: 'Cybernetically enhanced web apps',
    descriptionKo: '사이버네틱하게 향상된 웹 앱',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/sveltejs/svelte',
    website: 'https://svelte.dev',
    npm: 'svelte',
    stars: '79k',
    trending: true,
    yearReleased: 2016,
    tags: ['UI', 'Compiler', 'TypeScript'],
  },
  {
    name: 'SolidJS',
    description: 'Simple and performant reactivity',
    descriptionKo: '간단하고 성능 좋은 반응성',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/solidjs/solid',
    website: 'https://www.solidjs.com',
    npm: 'solid-js',
    stars: '33k',
    trending: true,
    yearReleased: 2018,
    tags: ['UI', 'Reactive', 'TypeScript'],
  },
  {
    name: 'Preact',
    description: 'Fast 3kB alternative to React',
    descriptionKo: 'React의 빠른 3kB 대안',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/preactjs/preact',
    website: 'https://preactjs.com',
    npm: 'preact',
    stars: '37k',
    yearReleased: 2015,
    tags: ['UI', 'Minimal', 'React-compatible'],
  },
  {
    name: 'Alpine.js',
    description: 'Lightweight JavaScript framework',
    descriptionKo: '경량 자바스크립트 프레임워크',
    categories: ['App Frameworks'],
    license: 'MIT',
    github: 'https://github.com/alpinejs/alpine',
    website: 'https://alpinejs.dev',
    npm: 'alpinejs',
    stars: '28k',
    yearReleased: 2019,
    tags: ['Minimal', 'HTML-first'],
  },
  {
    name: 'Lit',
    description: 'Simple. Fast. Web Components.',
    descriptionKo: '간단하고 빠른 웹 컴포넌트',
    categories: ['App Frameworks'],
    license: 'BSD-3-Clause',
    github: 'https://github.com/lit/lit',
    website: 'https://lit.dev',
    npm: 'lit',
    stars: '18k',
    yearReleased: 2018,
    tags: ['Web Components', 'TypeScript'],
  },

  // Build Tools
  {
    name: 'Vite',
    description: 'Next generation frontend tooling',
    descriptionKo: '차세대 프론트엔드 도구',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/vitejs/vite',
    website: 'https://vite.dev',
    npm: 'vite',
    stars: '69k',
    usedHere: true,
    trending: true,
    yearReleased: 2020,
    tags: ['Build', 'Dev Server', 'ESM'],
  },
  {
    name: 'Turbopack',
    description: 'Incremental bundler integrated with Next.js',
    descriptionKo: 'Next.js에 통합된 증분 번들러',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/vercel/next.js',
    website: 'https://nextjs.org/docs/app/api-reference/turbopack',
    stars: '139k',
    trending: true,
    yearReleased: 2022,
    tags: ['Build', 'Next.js', 'Rust'],
  },
  {
    name: 'Rspack',
    description: 'Rust-powered webpack',
    descriptionKo: 'Rust 기반 webpack',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/web-infra-dev/rspack',
    website: 'https://rspack.rs',
    npm: '@rspack/core',
    stars: '10k',
    trending: true,
    yearReleased: 2022,
    tags: ['Build', 'Rust', 'Webpack-compatible'],
  },
  {
    name: 'esbuild',
    description: 'Extremely fast bundler',
    descriptionKo: '극도로 빠른 번들러',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/evanw/esbuild',
    website: 'https://esbuild.github.io',
    npm: 'esbuild',
    stars: '38k',
    trending: true,
    yearReleased: 2020,
    tags: ['Build', 'Go', 'Fast'],
  },
  {
    name: 'Webpack',
    description: 'Module bundler',
    descriptionKo: '모듈 번들러',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/webpack/webpack',
    website: 'https://webpack.js.org',
    npm: 'webpack',
    stars: '64k',
    yearReleased: 2012,
    tags: ['Build', 'Classic'],
  },
  {
    name: 'Rollup',
    description: 'Module bundler for libraries',
    descriptionKo: '라이브러리를 위한 모듈 번들러',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/rollup/rollup',
    website: 'https://rollupjs.org',
    npm: 'rollup',
    stars: '25k',
    yearReleased: 2015,
    tags: ['Build', 'ESM'],
  },
  {
    name: 'Parcel',
    description: 'Zero config build tool',
    descriptionKo: '제로 설정 빌드 도구',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/parcel-bundler/parcel',
    website: 'https://parceljs.org',
    npm: 'parcel',
    stars: '43k',
    yearReleased: 2017,
    tags: ['Build', 'Zero-config'],
  },
  {
    name: 'SWC',
    description: 'Rust-based platform for fast tools',
    descriptionKo: 'Rust 기반 빠른 도구 플랫폼',
    categories: ['Build & DX'],
    license: 'Apache-2.0',
    github: 'https://github.com/swc-project/swc',
    website: 'https://swc.rs',
    npm: '@swc/core',
    stars: '31k',
    trending: true,
    yearReleased: 2017,
    tags: ['Build', 'Rust', 'Fast'],
  },
  {
    name: 'Biome',
    description: 'Toolchain for web projects',
    descriptionKo: '웹 프로젝트를 위한 툴체인',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/biomejs/biome',
    website: 'https://biomejs.dev',
    npm: '@biomejs/biome',
    stars: '16k',
    trending: true,
    yearReleased: 2023,
    tags: ['Linter', 'Formatter', 'Rust'],
  },

  // Runtime
  {
    name: 'Bun',
    description: 'All-in-one JavaScript runtime',
    descriptionKo: '올인원 자바스크립트 런타임',
    categories: ['Runtime & WASM'],
    license: 'MIT',
    github: 'https://github.com/oven-sh/bun',
    website: 'https://bun.sh',
    npm: 'bun',
    stars: '75k',
    trending: true,
    yearReleased: 2021,
    tags: ['Runtime', 'Fast', 'Zig'],
  },
  {
    name: 'Deno',
    description: 'Secure runtime for JavaScript',
    descriptionKo: '안전한 자바스크립트 런타임',
    categories: ['Runtime & WASM'],
    license: 'MIT',
    github: 'https://github.com/denoland/deno',
    website: 'https://deno.com',
    npm: 'deno',
    stars: '97k',
    trending: true,
    yearReleased: 2018,
    tags: ['Runtime', 'Secure', 'Rust'],
  },
  {
    name: 'Node.js',
    description: 'JavaScript runtime built on V8',
    descriptionKo: 'V8 기반 자바스크립트 런타임',
    categories: ['Runtime & WASM'],
    license: 'MIT',
    github: 'https://github.com/nodejs/node',
    website: 'https://nodejs.org/en',
    stars: '108k',
    yearReleased: 2009,
    tags: ['Runtime', 'Classic'],
  },

  // State Management
  {
    name: 'Zustand',
    description: 'Small, fast state-management',
    descriptionKo: '작고 빠른 상태 관리',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/pmndrs/zustand',
    website: 'https://zustand-demo.pmnd.rs',
    npm: 'zustand',
    stars: '48k',
    usedHere: true,
    trending: true,
    yearReleased: 2019,
    tags: ['React', 'State', 'TypeScript'],
  },
  {
    name: 'Redux Toolkit',
    description: 'Official Redux toolset',
    descriptionKo: '공식 Redux 툴셋',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/reduxjs/redux-toolkit',
    website: 'https://redux-toolkit.js.org',
    npm: '@reduxjs/toolkit',
    stars: '11k',
    yearReleased: 2019,
    tags: ['React', 'State', 'TypeScript'],
  },
  {
    name: 'Jotai',
    description: 'Primitive and flexible state',
    descriptionKo: '원시적이고 유연한 상태 관리',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/pmndrs/jotai',
    website: 'https://jotai.org',
    npm: 'jotai',
    stars: '19k',
    trending: true,
    yearReleased: 2020,
    tags: ['React', 'Atomic', 'TypeScript'],
  },
  {
    name: 'MobX',
    description: 'Simple, scalable state management',
    descriptionKo: '간단하고 확장 가능한 상태 관리',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/mobxjs/mobx',
    website: 'https://mobx.js.org',
    npm: 'mobx',
    stars: '27k',
    yearReleased: 2015,
    tags: ['Observable', 'TypeScript'],
  },
  {
    name: 'Valtio',
    description: 'Proxy-based state management',
    descriptionKo: 'Proxy 기반 상태 관리',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/pmndrs/valtio',
    website: 'https://valtio.dev',
    npm: 'valtio',
    stars: '9k',
    trending: true,
    yearReleased: 2020,
    tags: ['React', 'Proxy', 'TypeScript'],
  },
  {
    name: 'XState',
    description: 'State machines and statecharts',
    descriptionKo: '상태 머신과 상태 차트',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/statelyai/xstate',
    website: 'https://stately.ai/docs',
    npm: 'xstate',
    stars: '27k',
    yearReleased: 2015,
    tags: ['State Machine', 'TypeScript'],
  },
  {
    name: 'Pinia',
    description: 'Intuitive Vue Store',
    descriptionKo: '직관적인 Vue 스토어',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/vuejs/pinia',
    website: 'https://pinia.vuejs.org',
    npm: 'pinia',
    stars: '13k',
    trending: true,
    yearReleased: 2019,
    tags: ['Vue', 'State', 'TypeScript'],
  },

  // Data Fetching
  {
    name: 'TanStack Query',
    description: 'Powerful asynchronous state management',
    descriptionKo: '강력한 비동기 상태 관리',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/TanStack/query',
    website: 'https://tanstack.com/query/latest',
    npm: '@tanstack/react-query',
    stars: '43k',
    trending: true,
    yearReleased: 2019,
    tags: ['React', 'Data', 'TypeScript'],
  },
  {
    name: 'SWR',
    description: 'React Hooks for data fetching',
    descriptionKo: '데이터 페칭을 위한 React Hooks',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/vercel/swr',
    website: 'https://swr.vercel.app',
    npm: 'swr',
    stars: '31k',
    trending: true,
    yearReleased: 2019,
    tags: ['React', 'Hooks', 'TypeScript'],
  },
  {
    name: 'Apollo Client',
    description: 'GraphQL client for React',
    descriptionKo: 'React를 위한 GraphQL 클라이언트',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/apollographql/apollo-client',
    website: 'https://www.apollographql.com/docs/react',
    npm: '@apollo/client',
    stars: '19k',
    yearReleased: 2016,
    tags: ['GraphQL', 'React', 'TypeScript'],
  },
  {
    name: 'tRPC',
    description: 'End-to-end typesafe APIs',
    descriptionKo: '엔드투엔드 타입 안전 API',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/trpc/trpc',
    website: 'https://trpc.io',
    npm: '@trpc/server',
    stars: '35k',
    trending: true,
    yearReleased: 2020,
    tags: ['TypeScript', 'Type-safe', 'RPC'],
  },
  {
    name: 'Axios',
    description: 'Promise based HTTP client',
    descriptionKo: 'Promise 기반 HTTP 클라이언트',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/axios/axios',
    website: 'https://axios.rest',
    npm: 'axios',
    stars: '106k',
    yearReleased: 2014,
    tags: ['HTTP', 'Promise'],
  },

  // Type Safety
  {
    name: 'TypeScript',
    description: 'Typed superset of JavaScript',
    descriptionKo: '타입이 있는 자바스크립트 상위집합',
    categories: ['Build & DX'],
    license: 'Apache-2.0',
    github: 'https://github.com/microsoft/TypeScript',
    website: 'https://www.typescriptlang.org',
    npm: 'typescript',
    stars: '101k',
    usedHere: true,
    yearReleased: 2012,
    tags: ['Language', 'Types'],
  },
  {
    name: 'Zod',
    description: 'TypeScript-first schema validation',
    descriptionKo: 'TypeScript 우선 스키마 검증',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/colinhacks/zod',
    website: 'https://zod.dev',
    npm: 'zod',
    stars: '34k',
    trending: true,
    yearReleased: 2020,
    tags: ['Validation', 'TypeScript'],
  },
  {
    name: 'Valibot',
    description: 'Modular and type safe schema library',
    descriptionKo: '모듈식 타입 안전 스키마 라이브러리',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/open-circle/valibot',
    website: 'https://valibot.dev',
    npm: 'valibot',
    stars: '7k',
    trending: true,
    yearReleased: 2023,
    tags: ['Validation', 'TypeScript', 'Minimal'],
  },
  {
    name: 'Yup',
    description: 'Schema validation library',
    descriptionKo: '스키마 검증 라이브러리',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/jquense/yup',
    npm: 'yup',
    stars: '23k',
    yearReleased: 2015,
    tags: ['Validation', 'Schema'],
  },

  // Styling
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
    descriptionKo: '유틸리티 우선 CSS 프레임워크',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/tailwindlabs/tailwindcss',
    website: 'https://tailwindcss.com',
    npm: 'tailwindcss',
    stars: '84k',
    usedHere: true,
    trending: true,
    yearReleased: 2017,
    tags: ['CSS', 'Utility'],
  },
  {
    name: 'UnoCSS',
    description: 'Instant on-demand atomic CSS',
    descriptionKo: '즉시 온디맨드 아토믹 CSS',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/unocss/unocss',
    website: 'https://unocss.dev',
    npm: 'unocss',
    stars: '17k',
    trending: true,
    yearReleased: 2021,
    tags: ['CSS', 'Atomic', 'Fast'],
  },
  {
    name: 'Panda CSS',
    description: 'CSS-in-JS with build time generation',
    descriptionKo: '빌드 타임 생성 CSS-in-JS',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/chakra-ui/panda',
    website: 'https://panda-css.com',
    npm: '@pandacss/dev',
    stars: '5k',
    trending: true,
    yearReleased: 2023,
    tags: ['CSS-in-JS', 'TypeScript'],
  },
  {
    name: 'styled-components',
    description: 'CSS-in-JS for React',
    descriptionKo: 'React를 위한 CSS-in-JS',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/styled-components/styled-components',
    website: 'https://styled-components.com',
    npm: 'styled-components',
    stars: '40k',
    yearReleased: 2016,
    tags: ['CSS-in-JS', 'React'],
  },
  {
    name: 'Emotion',
    description: 'CSS-in-JS library',
    descriptionKo: 'CSS-in-JS 라이브러리',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/emotion-js/emotion',
    website: 'https://emotion.sh/docs/introduction',
    npm: '@emotion/react',
    stars: '17k',
    yearReleased: 2017,
    tags: ['CSS-in-JS', 'React'],
  },
  {
    name: 'Sass',
    description: 'CSS with superpowers',
    descriptionKo: '슈퍼파워가 있는 CSS',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/sass/dart-sass',
    website: 'https://sass-lang.com',
    npm: 'sass',
    stars: '15k',
    yearReleased: 2006,
    tags: ['CSS', 'Preprocessor'],
  },
  {
    name: 'PostCSS',
    description: 'Transform CSS with JS',
    descriptionKo: 'JS로 CSS 변환',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/postcss/postcss',
    website: 'https://postcss.org',
    npm: 'postcss',
    stars: '28k',
    yearReleased: 2013,
    tags: ['CSS', 'Transform'],
  },
  {
    name: 'Vanilla Extract',
    description: 'Zero-runtime CSS-in-TypeScript',
    descriptionKo: '제로 런타임 CSS-in-TypeScript',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/vanilla-extract-css/vanilla-extract',
    website: 'https://vanilla-extract.style',
    npm: '@vanilla-extract/css',
    stars: '9k',
    trending: true,
    yearReleased: 2021,
    tags: ['CSS-in-JS', 'TypeScript', 'Zero-runtime'],
  },
  {
    name: 'StyleX',
    description: "Meta's CSS-in-JS solution",
    descriptionKo: 'Meta의 CSS-in-JS 솔루션',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/facebook/stylex',
    website: 'https://stylexjs.com',
    npm: '@stylexjs/stylex',
    stars: '9k',
    trending: true,
    yearReleased: 2023,
    tags: ['CSS-in-JS', 'Meta'],
  },

  // UI Components
  {
    name: 'Radix UI',
    description: 'Unstyled, accessible components',
    descriptionKo: '스타일 없는 접근성 컴포넌트',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/radix-ui/primitives',
    website: 'https://www.radix-ui.com',
    npm: '@radix-ui/react-dialog',
    stars: '16k',
    usedHere: true,
    trending: true,
    yearReleased: 2021,
    tags: ['React', 'Headless', 'Accessible'],
  },
  {
    name: 'shadcn/ui',
    description: 'Re-usable components built with Radix',
    descriptionKo: 'Radix로 만든 재사용 컴포넌트',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/shadcn-ui/ui',
    website: 'https://ui.shadcn.com',
    stars: '77k',
    trending: true,
    yearReleased: 2023,
    tags: ['React', 'Tailwind', 'Copy-paste'],
  },
  {
    name: 'React Aria',
    description: "Adobe's accessible UI primitives",
    descriptionKo: 'Adobe의 접근 가능한 UI 프리미티브',
    categories: ['UI & Styling'],
    license: 'Apache-2.0',
    github: 'https://github.com/adobe/react-spectrum',
    website: 'https://react-aria.adobe.com/',
    npm: 'react-aria',
    stars: '13k',
    trending: true,
    yearReleased: 2020,
    tags: ['React', 'Headless', 'Accessible'],
  },
  {
    name: 'Headless UI',
    description: 'Completely unstyled UI components',
    descriptionKo: '완전히 스타일 없는 UI 컴포넌트',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/tailwindlabs/headlessui',
    website: 'https://headlessui.com',
    npm: '@headlessui/react',
    stars: '26k',
    trending: true,
    yearReleased: 2020,
    tags: ['React', 'Headless', 'Tailwind'],
  },
  {
    name: 'Mantine',
    description: 'Full-featured React components',
    descriptionKo: '풀 기능 React 컴포넌트',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/mantinedev/mantine',
    website: 'https://mantine.dev',
    npm: '@mantine/core',
    stars: '27k',
    trending: true,
    yearReleased: 2021,
    tags: ['React', 'TypeScript'],
  },
  {
    name: 'Chakra UI',
    description: 'Modular and accessible components',
    descriptionKo: '모듈식이고 접근 가능한 컴포넌트',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/chakra-ui/chakra-ui',
    website: 'https://chakra-ui.com',
    npm: '@chakra-ui/react',
    stars: '38k',
    yearReleased: 2019,
    tags: ['React', 'Accessible'],
  },
  {
    name: 'Ant Design',
    description: 'Enterprise UI design system',
    descriptionKo: '엔터프라이즈 UI 디자인 시스템',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/ant-design/ant-design',
    website: 'https://ant.design',
    npm: 'antd',
    stars: '92k',
    yearReleased: 2015,
    tags: ['React', 'Enterprise'],
  },
  {
    name: 'Material-UI',
    description: 'React Material Design components',
    descriptionKo: 'React Material Design 컴포넌트',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/mui/material-ui',
    website: 'https://mui.com',
    npm: '@mui/material',
    stars: '94k',
    yearReleased: 2014,
    tags: ['React', 'Material Design'],
  },
  {
    name: 'daisyUI',
    description: 'Tailwind CSS component library',
    descriptionKo: 'Tailwind CSS 컴포넌트 라이브러리',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/saadeghi/daisyui',
    website: 'https://daisyui.com',
    npm: 'daisyui',
    stars: '34k',
    trending: true,
    yearReleased: 2020,
    tags: ['Tailwind', 'CSS'],
  },
  {
    name: 'Park UI',
    description: 'Beautifully designed components',
    descriptionKo: '아름답게 디자인된 컴포넌트',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/chakra-ui/park-ui',
    website: 'https://park-ui.com',
    stars: '2k',
    trending: true,
    yearReleased: 2023,
    tags: ['React', 'Panda CSS'],
  },

  // Animation
  {
    name: 'React Spring',
    description: 'Spring-physics based animation',
    descriptionKo: '스프링 물리 기반 애니메이션',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/pmndrs/react-spring',
    website: 'https://www.react-spring.dev',
    npm: '@react-spring/web',
    stars: '28k',
    yearReleased: 2018,
    tags: ['React', 'Physics'],
  },
  {
    name: 'Auto Animate',
    description: 'Zero-config animations',
    descriptionKo: '제로 설정 애니메이션',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/formkit/auto-animate',
    website: 'https://auto-animate.formkit.com',
    npm: '@formkit/auto-animate',
    stars: '13k',
    trending: true,
    yearReleased: 2022,
    tags: ['Animation', 'Zero-config'],
  },
  {
    name: 'Motion',
    description: 'Modern animation library for JavaScript and React',
    descriptionKo: 'JavaScript와 React를 위한 모던 애니메이션 라이브러리',
    categories: ['UI & Styling'],
    license: 'MIT',
    github: 'https://github.com/motiondivision/motion',
    website: 'https://motion.dev',
    npm: 'motion',
    stars: '32k',
    trending: true,
    yearReleased: 2021,
    tags: ['Animation', 'React', 'JavaScript'],
  },

  // Forms
  {
    name: 'React Hook Form',
    description: 'Performant forms with easy validation',
    descriptionKo: '쉬운 검증과 성능 좋은 폼',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/react-hook-form/react-hook-form',
    website: 'https://react-hook-form.com',
    npm: 'react-hook-form',
    stars: '42k',
    trending: true,
    yearReleased: 2019,
    tags: ['React', 'Forms', 'Validation'],
  },
  {
    name: 'TanStack Form',
    description: 'Powerful and type-safe form state',
    descriptionKo: '강력하고 타입 안전한 폼 상태',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/TanStack/form',
    website: 'https://tanstack.com/form/latest',
    npm: '@tanstack/react-form',
    stars: '4k',
    trending: true,
    yearReleased: 2023,
    tags: ['React', 'Forms', 'TypeScript'],
  },
  {
    name: 'Formik',
    description: 'Build forms in React',
    descriptionKo: 'React에서 폼 만들기',
    categories: ['State & Data'],
    license: 'Apache-2.0',
    github: 'https://github.com/jaredpalmer/formik',
    website: 'https://formik.org',
    npm: 'formik',
    stars: '34k',
    yearReleased: 2017,
    tags: ['React', 'Forms'],
  },
  {
    name: 'React Final Form',
    description: 'High performance subscription-based form',
    descriptionKo: '고성능 구독 기반 폼',
    categories: ['State & Data'],
    license: 'MIT',
    github: 'https://github.com/final-form/react-final-form',
    website: 'https://final-form.org/react',
    npm: 'react-final-form',
    stars: '7k',
    yearReleased: 2017,
    tags: ['React', 'Forms'],
  },

  // Testing
  {
    name: 'Vitest',
    description: 'Blazing fast unit test framework',
    descriptionKo: '매우 빠른 유닛 테스트 프레임워크',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/vitest-dev/vitest',
    website: 'https://vitest.dev',
    npm: 'vitest',
    stars: '13k',
    usedHere: true,
    trending: true,
    yearReleased: 2021,
    tags: ['Testing', 'Vite', 'Fast'],
  },
  {
    name: 'Playwright',
    description: 'Reliable end-to-end testing',
    descriptionKo: '신뢰할 수 있는 E2E 테스팅',
    categories: ['Build & DX'],
    license: 'Apache-2.0',
    github: 'https://github.com/microsoft/playwright',
    website: 'https://playwright.dev',
    npm: '@playwright/test',
    stars: '67k',
    usedHere: true,
    trending: true,
    yearReleased: 2020,
    tags: ['E2E', 'Testing'],
  },
  {
    name: 'Cypress',
    description: 'Fast, easy and reliable E2E testing',
    descriptionKo: '빠르고 쉽고 신뢰할 수 있는 E2E 테스팅',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/cypress-io/cypress',
    website: 'https://www.cypress.io',
    npm: 'cypress',
    stars: '47k',
    yearReleased: 2015,
    tags: ['E2E', 'Testing'],
  },
  {
    name: 'Testing Library',
    description: 'Simple testing utilities',
    descriptionKo: '간단한 테스팅 유틸리티',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/testing-library/react-testing-library',
    website: 'https://testing-library.com',
    npm: '@testing-library/react',
    stars: '19k',
    yearReleased: 2018,
    tags: ['React', 'Testing'],
  },
  {
    name: 'Jest',
    description: 'Delightful JavaScript testing',
    descriptionKo: '즐거운 자바스크립트 테스팅',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/jestjs/jest',
    website: 'https://jestjs.io',
    npm: 'jest',
    stars: '44k',
    yearReleased: 2011,
    tags: ['Testing', 'Classic'],
  },
  {
    name: 'Storybook',
    description: 'UI component development',
    descriptionKo: 'UI 컴포넌트 개발 도구',
    categories: ['Build & DX'],
    license: 'MIT',
    github: 'https://github.com/storybookjs/storybook',
    website: 'https://storybook.js.org',
    npm: 'storybook',
    stars: '84k',
    yearReleased: 2016,
    tags: ['UI', 'Documentation'],
  },

  // ==========================================
  // WASM Runtime
  // ==========================================
  {
    name: 'FFmpeg.wasm',
    description: 'FFmpeg compiled to WebAssembly for browser video/audio processing',
    descriptionKo: '브라우저에서 비디오/오디오 처리를 위해 WebAssembly로 컴파일된 FFmpeg',
    categories: ['Runtime & WASM'],
    license: 'MIT',
    github: 'https://github.com/ffmpegwasm/ffmpeg.wasm',
    website: 'https://ffmpegwasm.netlify.app',
    npm: '@ffmpeg/ffmpeg',
    stars: '14k',
    trending: true,
    yearReleased: 2019,
    wasmBased: true,
    tags: ['WASM', 'Video', 'Audio', 'Codec'],
    useCases: {
      en: 'Video editing, format conversion, thumbnail extraction, audio processing in the browser without server',
      ko: '서버 없이 브라우저에서 비디오 편집, 포맷 변환, 썸네일 추출, 오디오 처리',
    },
    codeExample: `import { FFmpeg } from '@ffmpeg/ffmpeg';
const ffmpeg = new FFmpeg();
await ffmpeg.load();
await ffmpeg.exec(['-i', 'input.mp4', 'output.gif']);`,
  },
  {
    name: 'sql.js',
    description: 'SQLite compiled to JavaScript via Emscripten',
    descriptionKo: 'Emscripten을 통해 JavaScript로 컴파일된 SQLite',
    categories: ['Runtime & WASM'],
    license: 'MIT',
    github: 'https://github.com/sql-js/sql.js',
    website: 'https://sql.js.org',
    npm: 'sql.js',
    stars: '13k',
    trending: true,
    yearReleased: 2014,
    wasmBased: true,
    tags: ['WASM', 'Database', 'SQLite'],
    useCases: {
      en: 'Client-side databases, offline-first apps, data analysis in browser, educational SQL tools',
      ko: '클라이언트 측 데이터베이스, 오프라인 우선 앱, 브라우저 데이터 분석, SQL 학습 도구',
    },
    codeExample: `import initSqlJs from 'sql.js';
const SQL = await initSqlJs();
const db = new SQL.Database();
db.run('CREATE TABLE users (id, name)');
db.run('INSERT INTO users VALUES (1, "Alice")');`,
  },
  {
    name: 'Pyodide',
    description: 'Python runtime for the browser via WebAssembly',
    descriptionKo: 'WebAssembly를 통한 브라우저용 Python 런타임',
    categories: ['Runtime & WASM'],
    license: 'MPL-2.0',
    github: 'https://github.com/pyodide/pyodide',
    website: 'https://pyodide.org/en/stable/',
    npm: 'pyodide',
    stars: '12k',
    trending: true,
    yearReleased: 2019,
    wasmBased: true,
    tags: ['WASM', 'Python', 'Scientific'],
    useCases: {
      en: 'Run Python in browser, data science notebooks, NumPy/Pandas in web apps, Python education',
      ko: '브라우저에서 Python 실행, 데이터 과학 노트북, 웹 앱에서 NumPy/Pandas, Python 교육',
    },
    codeExample: `import { loadPyodide } from 'pyodide';
const pyodide = await loadPyodide();
await pyodide.loadPackage('numpy');
const result = pyodide.runPython('import numpy; numpy.array([1, 2, 3])');`,
  },
  {
    name: 'AssemblyScript',
    description: 'TypeScript-like language that compiles to WebAssembly',
    descriptionKo: 'WebAssembly로 컴파일되는 TypeScript 유사 언어',
    categories: ['Runtime & WASM'],
    license: 'Apache-2.0',
    github: 'https://github.com/AssemblyScript/assemblyscript',
    website: 'https://www.assemblyscript.org',
    npm: 'assemblyscript',
    stars: '17k',
    trending: true,
    yearReleased: 2017,
    wasmBased: true,
    tags: ['WASM', 'TypeScript', 'Compiler'],
    useCases: {
      en: 'Write performant WASM modules in TypeScript syntax, game engines, crypto algorithms',
      ko: 'TypeScript 문법으로 고성능 WASM 모듈 작성, 게임 엔진, 암호화 알고리즘',
    },
    codeExample: `// add.ts (AssemblyScript)
export function add(a: i32, b: i32): i32 {
  return a + b;
}
// Compile: asc add.ts -o add.wasm`,
  },
  {
    name: 'wasm-bindgen',
    description: 'Facilitates communication between Rust and JavaScript',
    descriptionKo: 'Rust와 JavaScript 간 통신을 용이하게 하는 도구',
    categories: ['Runtime & WASM'],
    license: 'MIT OR Apache-2.0',
    github: 'https://github.com/wasm-bindgen/wasm-bindgen',
    website: 'https://rustwasm.github.io/docs/wasm-bindgen/',
    stars: '9k',
    yearReleased: 2018,
    wasmBased: true,
    tags: ['WASM', 'Rust', 'Binding'],
    useCases: {
      en: 'Build Rust libraries for web, call JavaScript from Rust, expose Rust APIs to JavaScript',
      ko: '웹용 Rust 라이브러리 빌드, Rust에서 JavaScript 호출, JavaScript에 Rust API 노출',
    },
    codeExample: `// Rust code
use wasm_bindgen::prelude::*;
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}`,
  },
  {
    name: 'Emscripten',
    description: 'LLVM-to-WebAssembly compiler toolchain',
    descriptionKo: 'LLVM에서 WebAssembly로 컴파일하는 툴체인',
    categories: ['Runtime & WASM'],
    license: 'MIT',
    github: 'https://github.com/emscripten-core/emscripten',
    website: 'https://emscripten.org',
    stars: '26k',
    yearReleased: 2011,
    wasmBased: true,
    tags: ['WASM', 'C', 'C++', 'Compiler'],
    useCases: {
      en: 'Port C/C++ libraries to web, compile games to browser, bring native code to JavaScript',
      ko: 'C/C++ 라이브러리를 웹으로 포팅, 게임을 브라우저로 컴파일, 네이티브 코드를 JavaScript로',
    },
    codeExample: `// Compile C code to WASM
// emcc hello.c -o hello.js -s WASM=1
#include <stdio.h>
int main() {
  printf("Hello from WASM!\\n");
  return 0;
}`,
  },

  // ==========================================
  // Computer Vision
  // ==========================================
  {
    name: 'OpenCV.js',
    description: 'OpenCV compiled to JavaScript for browser-based computer vision',
    descriptionKo: '브라우저 기반 컴퓨터 비전을 위해 JavaScript로 컴파일된 OpenCV',
    categories: ['AI & Vision'],
    license: 'Apache-2.0',
    github: 'https://github.com/opencv/opencv',
    website: 'https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html',
    npm: '@techstark/opencv-js',
    stars: '79k',
    trending: true,
    yearReleased: 2017,
    wasmBased: true,
    tags: ['WASM', 'Vision', 'Image'],
    useCases: {
      en: 'Face detection, object tracking, image filtering, edge detection, feature matching',
      ko: '얼굴 감지, 객체 추적, 이미지 필터링, 에지 감지, 특징점 매칭',
    },
    codeExample: `const cv = await import('@techstark/opencv-js');
const src = cv.imread('image');
const dst = new cv.Mat();
cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
cv.imshow('output', dst);`,
  },
  {
    name: 'MediaPipe',
    description: 'Google ML solutions for face, hand, and pose detection',
    descriptionKo: '얼굴, 손, 자세 감지를 위한 Google ML 솔루션',
    categories: ['AI & Vision'],
    license: 'Apache-2.0',
    github: 'https://github.com/google-ai-edge/mediapipe',
    website: 'https://ai.google.dev/edge/mediapipe/solutions/guide',
    npm: '@mediapipe/tasks-vision',
    stars: '28k',
    trending: true,
    yearReleased: 2019,
    wasmBased: true,
    tags: ['ML', 'Google', 'Pose', 'Hand'],
    useCases: {
      en: 'Hand tracking, pose estimation, face mesh, gesture recognition, AR filters',
      ko: '손 추적, 자세 추정, 얼굴 메시, 제스처 인식, AR 필터',
    },
    codeExample: `import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
const vision = await FilesetResolver.forVisionTasks('...');
const landmarker = await FaceLandmarker.createFromOptions(vision, { ... });
const results = landmarker.detect(image);`,
  },

  // ==========================================
  // Machine Learning
  // ==========================================
  {
    name: 'TensorFlow.js',
    description: 'Machine learning library for JavaScript',
    descriptionKo: 'JavaScript용 머신러닝 라이브러리',
    categories: ['AI & Vision'],
    license: 'Apache-2.0',
    github: 'https://github.com/tensorflow/tfjs',
    website: 'https://www.tensorflow.org/js',
    npm: '@tensorflow/tfjs',
    stars: '18k',
    trending: true,
    yearReleased: 2018,
    wasmBased: true,
    tags: ['ML', 'AI', 'Google', 'WASM'],
    useCases: {
      en: 'Train ML models in browser, run pre-trained models, transfer learning, real-time predictions',
      ko: '브라우저에서 ML 모델 학습, 사전 학습 모델 실행, 전이 학습, 실시간 예측',
    },
    codeExample: `import * as tf from '@tensorflow/tfjs';
const model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });`,
  },
  {
    name: 'ONNX Runtime Web',
    description: 'Run ONNX models in browser with WebAssembly/WebGL',
    descriptionKo: 'WebAssembly/WebGL로 브라우저에서 ONNX 모델 실행',
    categories: ['AI & Vision'],
    license: 'MIT',
    github: 'https://github.com/microsoft/onnxruntime',
    website: 'https://onnxruntime.ai',
    npm: 'onnxruntime-web',
    stars: '15k',
    trending: true,
    yearReleased: 2019,
    wasmBased: true,
    tags: ['ML', 'ONNX', 'Microsoft', 'WASM'],
    useCases: {
      en: 'Run PyTorch/TensorFlow models in browser, cross-platform ML inference, edge AI',
      ko: '브라우저에서 PyTorch/TensorFlow 모델 실행, 크로스 플랫폼 ML 추론, 엣지 AI',
    },
    codeExample: `import * as ort from 'onnxruntime-web';
const session = await ort.InferenceSession.create('model.onnx');
const results = await session.run({ input: tensor });`,
  },
  {
    name: 'Transformers.js',
    description: 'Run Hugging Face transformers in the browser',
    descriptionKo: '브라우저에서 Hugging Face 트랜스포머 실행',
    categories: ['AI & Vision'],
    license: 'Apache-2.0',
    github: 'https://github.com/huggingface/transformers.js',
    website: 'https://huggingface.co/docs/transformers.js/index',
    npm: '@huggingface/transformers',
    stars: '16k',
    trending: true,
    yearReleased: 2023,
    wasmBased: true,
    tags: ['ML', 'NLP', 'Hugging Face', 'WASM'],
    useCases: {
      en: 'Text generation, translation, summarization, sentiment analysis, image classification',
      ko: '텍스트 생성, 번역, 요약, 감정 분석, 이미지 분류',
    },
    codeExample: `import { pipeline } from '@huggingface/transformers';
const classifier = await pipeline('sentiment-analysis');
const result = await classifier('I love this!');
// [{ label: 'POSITIVE', score: 0.99 }]`,
  },
  {
    name: 'ml5.js',
    description: 'Friendly machine learning for the web',
    descriptionKo: '웹을 위한 친화적인 머신러닝',
    categories: ['AI & Vision'],
    license: 'MIT',
    github: 'https://github.com/ml5js/ml5-next-gen',
    website: 'https://ml5js.org',
    npm: 'ml5',
    stars: '200',
    yearReleased: 2018,
    tags: ['ML', 'Beginner', 'p5.js'],
    useCases: {
      en: 'Creative coding with ML, beginner-friendly AI, image classification, pose detection',
      ko: 'ML을 활용한 크리에이티브 코딩, 초보자 친화적 AI, 이미지 분류, 자세 감지',
    },
    codeExample: `const classifier = ml5.imageClassifier('MobileNet', modelReady);
function modelReady() {
  classifier.classify(document.getElementById('image'), gotResult);
}`,
  },
  {
    name: 'Brain.js',
    description: 'GPU accelerated neural networks in JavaScript',
    descriptionKo: 'JavaScript에서 GPU 가속 신경망',
    categories: ['AI & Vision'],
    license: 'MIT',
    github: 'https://github.com/BrainJS/brain.js',
    website: 'https://brain.js.org',
    npm: 'brain.js',
    stars: '14k',
    yearReleased: 2010,
    tags: ['ML', 'Neural Network', 'GPU'],
    useCases: {
      en: 'Simple neural networks, pattern recognition, time series prediction, text classification',
      ko: '간단한 신경망, 패턴 인식, 시계열 예측, 텍스트 분류',
    },
    codeExample: `const brain = require('brain.js');
const net = new brain.NeuralNetwork();
net.train([{ input: [0, 0], output: [0] }, { input: [1, 1], output: [1] }]);
const output = net.run([1, 0]);`,
  },

  // ==========================================
  // Graphics/Canvas
  // ==========================================
  {
    name: 'CanvasKit',
    description: 'Skia graphics library compiled to WebAssembly',
    descriptionKo: 'WebAssembly로 컴파일된 Skia 그래픽 라이브러리',
    categories: ['Visuals & Graphics'],
    license: 'BSD-3-Clause',
    github: 'https://github.com/google/skia',
    website: 'https://skia.org/docs/user/modules/canvaskit/',
    npm: 'canvaskit-wasm',
    stars: '11k',
    trending: true,
    yearReleased: 2019,
    wasmBased: true,
    tags: ['WASM', 'Graphics', 'Skia'],
    useCases: {
      en: 'High-performance 2D graphics, Flutter web rendering, PDF generation, SVG rendering',
      ko: '고성능 2D 그래픽, Flutter 웹 렌더링, PDF 생성, SVG 렌더링',
    },
    codeExample: `import CanvasKitInit from 'canvaskit-wasm';
const CanvasKit = await CanvasKitInit();
const surface = CanvasKit.MakeCanvasSurface('canvas');
const canvas = surface.getCanvas();`,
  },
  {
    name: 'Konva',
    description: '2D canvas library for desktop and mobile',
    descriptionKo: '데스크톱 및 모바일용 2D 캔버스 라이브러리',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/konvajs/konva',
    website: 'https://konvajs.org',
    npm: 'konva',
    stars: '11k',
    trending: true,
    yearReleased: 2015,
    tags: ['Canvas', '2D', 'Interactive'],
    useCases: {
      en: 'Interactive graphics, drag-and-drop editors, data visualization, image annotation',
      ko: '인터랙티브 그래픽, 드래그 앤 드롭 에디터, 데이터 시각화, 이미지 주석',
    },
    codeExample: `import Konva from 'konva';
const stage = new Konva.Stage({ container: 'container', width: 500, height: 500 });
const layer = new Konva.Layer();
const circle = new Konva.Circle({ x: 100, y: 100, radius: 50, fill: 'red' });
layer.add(circle); stage.add(layer);`,
  },
  {
    name: 'Fabric.js',
    description: 'Powerful canvas library with interactive object model',
    descriptionKo: '인터랙티브 객체 모델을 갖춘 강력한 캔버스 라이브러리',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/fabricjs/fabric.js',
    website: 'https://fabricjs.com',
    npm: 'fabric',
    stars: '29k',
    yearReleased: 2010,
    tags: ['Canvas', 'Editor', 'SVG'],
    useCases: {
      en: 'Image editors, design tools, whiteboard apps, canvas-based games',
      ko: '이미지 에디터, 디자인 도구, 화이트보드 앱, 캔버스 기반 게임',
    },
    codeExample: `import { Canvas, Rect } from 'fabric';
const canvas = new Canvas('c');
const rect = new Rect({ left: 100, top: 100, fill: 'red', width: 50, height: 50 });
canvas.add(rect);`,
  },
  {
    name: 'Paper.js',
    description: 'Vector graphics scripting framework',
    descriptionKo: '벡터 그래픽 스크립팅 프레임워크',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/paperjs/paper.js',
    npm: 'paper',
    stars: '14k',
    yearReleased: 2011,
    tags: ['Canvas', 'Vector', 'SVG'],
    useCases: {
      en: 'Vector illustrations, generative art, path manipulation, interactive graphics',
      ko: '벡터 일러스트레이션, 제너레이티브 아트, 경로 조작, 인터랙티브 그래픽',
    },
    codeExample: `import paper from 'paper';
paper.setup('myCanvas');
const path = new paper.Path.Circle(new paper.Point(80, 50), 30);
path.fillColor = 'red';`,
  },
  {
    name: 'p5.js',
    description: 'JavaScript library for creative coding',
    descriptionKo: '크리에이티브 코딩을 위한 JavaScript 라이브러리',
    categories: ['Visuals & Graphics'],
    license: 'LGPL-2.1',
    github: 'https://github.com/processing/p5.js',
    website: 'https://p5js.org',
    npm: 'p5',
    stars: '22k',
    yearReleased: 2014,
    tags: ['Creative', 'Art', 'Education'],
    useCases: {
      en: 'Creative coding, generative art, interactive visualizations, educational projects',
      ko: '크리에이티브 코딩, 제너레이티브 아트, 인터랙티브 시각화, 교육 프로젝트',
    },
    codeExample: `function setup() {
  createCanvas(400, 400);
}
function draw() {
  background(220);
  ellipse(mouseX, mouseY, 50, 50);
}`,
  },

  // ==========================================
  // 3D Graphics
  // ==========================================
  {
    name: 'Three.js',
    description: '3D library for creating WebGL content',
    descriptionKo: 'WebGL 콘텐츠 생성을 위한 3D 라이브러리',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/mrdoob/three.js',
    website: 'https://threejs.org',
    npm: 'three',
    stars: '103k',
    trending: true,
    yearReleased: 2010,
    tags: ['3D', 'WebGL', 'Graphics'],
    useCases: {
      en: '3D games, product visualizers, architectural visualization, VR/AR experiences',
      ko: '3D 게임, 제품 시각화, 건축 시각화, VR/AR 경험',
    },
    codeExample: `import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();`,
  },
  {
    name: 'Babylon.js',
    description: 'Powerful 3D game engine for the web',
    descriptionKo: '웹을 위한 강력한 3D 게임 엔진',
    categories: ['Visuals & Graphics'],
    license: 'Apache-2.0',
    github: 'https://github.com/BabylonJS/Babylon.js',
    website: 'https://www.babylonjs.com',
    npm: '@babylonjs/core',
    stars: '23k',
    trending: true,
    yearReleased: 2013,
    tags: ['3D', 'Game Engine', 'WebGL'],
    useCases: {
      en: '3D games, interactive 3D experiences, product configurators, virtual showrooms',
      ko: '3D 게임, 인터랙티브 3D 경험, 제품 구성기, 가상 쇼룸',
    },
    codeExample: `import { Engine, Scene, FreeCamera, HemisphericLight } from '@babylonjs/core';
const engine = new Engine(canvas, true);
const scene = new Scene(engine);`,
  },
  {
    name: 'React Three Fiber',
    description: 'React renderer for Three.js',
    descriptionKo: 'Three.js를 위한 React 렌더러',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/pmndrs/react-three-fiber',
    website: 'https://pmndrs.github.io/react-three-fiber/',
    npm: '@react-three/fiber',
    stars: '28k',
    trending: true,
    yearReleased: 2019,
    tags: ['React', 'Three.js', '3D'],
    useCases: {
      en: 'Declarative 3D in React, interactive 3D components, 3D data visualization',
      ko: 'React에서 선언적 3D, 인터랙티브 3D 컴포넌트, 3D 데이터 시각화',
    },
    codeExample: `import { Canvas } from '@react-three/fiber';
function App() {
  return <Canvas><mesh><boxGeometry /><meshStandardMaterial /></mesh></Canvas>;
}`,
  },
  {
    name: 'A-Frame',
    description: 'Web framework for building VR experiences',
    descriptionKo: 'VR 경험 구축을 위한 웹 프레임워크',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/aframevr/aframe',
    website: 'https://aframe.io',
    npm: 'aframe',
    stars: '17k',
    yearReleased: 2015,
    tags: ['VR', 'AR', 'WebXR'],
    useCases: {
      en: 'VR websites, AR experiences, 360 tours, immersive storytelling',
      ko: 'VR 웹사이트, AR 경험, 360도 투어, 몰입형 스토리텔링',
    },
    codeExample: `<a-scene>
  <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
  <a-sky color="#ECECEC"></a-sky>
</a-scene>`,
  },

  // ==========================================
  // Compression
  // ==========================================
  {
    name: 'fflate',
    description: 'High performance (de)compression in pure JavaScript',
    descriptionKo: '순수 JavaScript로 구현된 고성능 (압축/해제)',
    categories: ['Data & Security'],
    license: 'MIT',
    github: 'https://github.com/101arrowz/fflate',
    npm: 'fflate',
    stars: '2k',
    trending: true,
    yearReleased: 2020,
    tags: ['Compression', 'Zip', 'Gzip'],
    useCases: {
      en: 'Compress/decompress files in browser, create ZIP archives, streaming compression',
      ko: '브라우저에서 파일 압축/해제, ZIP 아카이브 생성, 스트리밍 압축',
    },
    codeExample: `import { gzip, gunzip, strToU8, strFromU8 } from 'fflate';
const compressed = gzip(strToU8('Hello World'));
const decompressed = strFromU8(gunzip(compressed));`,
  },
  {
    name: 'brotli-wasm',
    description: 'Brotli compression compiled to WebAssembly',
    descriptionKo: 'WebAssembly로 컴파일된 Brotli 압축',
    categories: ['Data & Security'],
    license: 'Apache-2.0',
    github: 'https://github.com/httptoolkit/brotli-wasm',
    npm: 'brotli-wasm',
    stars: '300',
    yearReleased: 2020,
    wasmBased: true,
    tags: ['WASM', 'Compression', 'Brotli'],
    useCases: {
      en: 'High-ratio compression in browser, decompress Brotli content, web performance',
      ko: '브라우저에서 고비율 압축, Brotli 콘텐츠 해제, 웹 성능',
    },
    codeExample: `import brotli from 'brotli-wasm';
const compressed = brotli.compress(new TextEncoder().encode('Hello'));
const decompressed = brotli.decompress(compressed);`,
  },
  {
    name: 'zstd-codec',
    description: 'Zstandard compression for JavaScript via WASM',
    descriptionKo: 'WASM을 통한 JavaScript용 Zstandard 압축',
    categories: ['Data & Security'],
    license: 'MIT',
    github: 'https://github.com/yoshihitoh/zstd-codec',
    npm: 'zstd-codec',
    stars: '100',
    yearReleased: 2019,
    wasmBased: true,
    tags: ['WASM', 'Compression', 'Zstandard'],
    useCases: {
      en: 'Fast compression/decompression, game assets, large file handling',
      ko: '빠른 압축/해제, 게임 에셋, 대용량 파일 처리',
    },
    codeExample: `import { ZstdCodec } from 'zstd-codec';
ZstdCodec.run(zstd => {
  const compressed = zstd.compress(data);
  const decompressed = zstd.decompress(compressed);
});`,
  },

  // ==========================================
  // Cryptography
  // ==========================================
  {
    name: 'noble-curves',
    description: 'Audited elliptic curve cryptography in JavaScript',
    descriptionKo: '감사된 JavaScript 타원 곡선 암호화',
    categories: ['Data & Security'],
    license: 'MIT',
    github: 'https://github.com/paulmillr/noble-curves',
    npm: '@noble/curves',
    stars: '700',
    trending: true,
    yearReleased: 2022,
    tags: ['Crypto', 'Elliptic Curve', 'Audited'],
    useCases: {
      en: 'Ethereum/Bitcoin signatures, ECDSA, Ed25519, secp256k1, BLS signatures',
      ko: 'Ethereum/Bitcoin 서명, ECDSA, Ed25519, secp256k1, BLS 서명',
    },
    codeExample: `import { secp256k1 } from '@noble/curves/secp256k1';
const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);`,
  },
  {
    name: 'libsodium.js',
    description: 'JavaScript port of libsodium cryptographic library',
    descriptionKo: 'libsodium 암호화 라이브러리의 JavaScript 포팅',
    categories: ['Data & Security'],
    license: 'ISC',
    github: 'https://github.com/jedisct1/libsodium.js',
    npm: 'libsodium-wrappers',
    stars: '1k',
    yearReleased: 2016,
    wasmBased: true,
    tags: ['WASM', 'Crypto', 'libsodium'],
    useCases: {
      en: 'Secure encryption, password hashing, key exchange, authenticated encryption',
      ko: '안전한 암호화, 비밀번호 해싱, 키 교환, 인증된 암호화',
    },
    codeExample: `import sodium from 'libsodium-wrappers';
await sodium.ready;
const key = sodium.crypto_secretbox_keygen();
const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);`,
  },
  {
    name: 'crypto-js',
    description: 'JavaScript library of crypto standards',
    descriptionKo: '암호화 표준의 JavaScript 라이브러리',
    categories: ['Data & Security'],
    license: 'MIT',
    github: 'https://github.com/brix/crypto-js',
    npm: 'crypto-js',
    stars: '16k',
    yearReleased: 2009,
    tags: ['Crypto', 'AES', 'SHA', 'MD5'],
    useCases: {
      en: 'AES encryption, SHA hashing, HMAC, PBKDF2, simple encryption needs',
      ko: 'AES 암호화, SHA 해싱, HMAC, PBKDF2, 간단한 암호화 요구',
    },
    codeExample: `import CryptoJS from 'crypto-js';
const encrypted = CryptoJS.AES.encrypt('message', 'secret key').toString();
const decrypted = CryptoJS.AES.decrypt(encrypted, 'secret key').toString(CryptoJS.enc.Utf8);`,
  },

  // ==========================================
  // Data Serialization
  // ==========================================
  {
    name: 'protobuf.js',
    description: 'Protocol Buffers for JavaScript',
    descriptionKo: 'JavaScript용 Protocol Buffers',
    categories: ['Data & Security'],
    license: 'BSD-3-Clause',
    github: 'https://github.com/protobufjs/protobuf.js',
    website: 'https://protobufjs.github.io/protobuf.js/',
    npm: 'protobufjs',
    stars: '10k',
    yearReleased: 2013,
    tags: ['Protobuf', 'Binary', 'Google'],
    useCases: {
      en: 'Efficient data serialization, gRPC communication, cross-language data exchange',
      ko: '효율적인 데이터 직렬화, gRPC 통신, 크로스 언어 데이터 교환',
    },
    codeExample: `import protobuf from 'protobufjs';
const root = await protobuf.load('awesome.proto');
const Message = root.lookupType('package.Message');
const buffer = Message.encode({ field: 'value' }).finish();`,
  },
  {
    name: 'FlatBuffers',
    description: 'Efficient cross-platform serialization library',
    descriptionKo: '효율적인 크로스 플랫폼 직렬화 라이브러리',
    categories: ['Data & Security'],
    license: 'Apache-2.0',
    github: 'https://github.com/google/flatbuffers',
    website: 'https://flatbuffers.dev',
    npm: 'flatbuffers',
    stars: '26k',
    yearReleased: 2014,
    tags: ['Binary', 'Google', 'Gaming'],
    useCases: {
      en: 'Game data serialization, zero-copy deserialization, real-time data exchange',
      ko: '게임 데이터 직렬화, 제로 카피 역직렬화, 실시간 데이터 교환',
    },
    codeExample: `import * as flatbuffers from 'flatbuffers';
const builder = new flatbuffers.Builder(256);
// Build your FlatBuffer...
const buf = builder.asUint8Array();`,
  },
  {
    name: 'msgpackr',
    description: 'Fast MessagePack encoder/decoder',
    descriptionKo: '빠른 MessagePack 인코더/디코더',
    categories: ['Data & Security'],
    license: 'MIT',
    github: 'https://github.com/kriszyp/msgpackr',
    npm: 'msgpackr',
    stars: '700',
    trending: true,
    yearReleased: 2020,
    tags: ['MessagePack', 'Binary', 'Fast'],
    useCases: {
      en: 'Compact JSON alternative, WebSocket communication, efficient storage',
      ko: '컴팩트한 JSON 대안, WebSocket 통신, 효율적인 저장',
    },
    codeExample: `import { pack, unpack } from 'msgpackr';
const encoded = pack({ hello: 'world' });
const decoded = unpack(encoded);`,
  },
  {
    name: 'cbor-x',
    description: 'Fast CBOR encoder/decoder',
    descriptionKo: '빠른 CBOR 인코더/디코더',
    categories: ['Data & Security'],
    license: 'MIT',
    github: 'https://github.com/kriszyp/cbor-x',
    npm: 'cbor-x',
    stars: '200',
    yearReleased: 2020,
    tags: ['CBOR', 'Binary', 'IoT'],
    useCases: {
      en: 'IoT data encoding, WebAuthn, compact binary format, COSE signatures',
      ko: 'IoT 데이터 인코딩, WebAuthn, 컴팩트 바이너리 포맷, COSE 서명',
    },
    codeExample: `import { encode, decode } from 'cbor-x';
const encoded = encode({ hello: 'world' });
const decoded = decode(encoded);`,
  },

  // ==========================================
  // Image Processing
  // ==========================================
  {
    name: 'Sharp',
    description: 'High performance image processing',
    descriptionKo: '고성능 이미지 처리',
    categories: ['Visuals & Graphics'],
    license: 'Apache-2.0',
    github: 'https://github.com/lovell/sharp',
    website: 'https://sharp.pixelplumbing.com',
    npm: 'sharp',
    stars: '29k',
    trending: true,
    yearReleased: 2013,
    tags: ['Image', 'Resize', 'Convert'],
    useCases: {
      en: 'Image resizing, format conversion, thumbnail generation, image optimization',
      ko: '이미지 리사이징, 포맷 변환, 썸네일 생성, 이미지 최적화',
    },
    codeExample: `import sharp from 'sharp';
await sharp('input.jpg')
  .resize(300, 200)
  .toFormat('webp')
  .toFile('output.webp');`,
  },
  {
    name: 'Jimp',
    description: 'JavaScript Image Manipulation Program',
    descriptionKo: 'JavaScript 이미지 조작 프로그램',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/jimp-dev/jimp',
    npm: 'jimp',
    stars: '14k',
    yearReleased: 2014,
    tags: ['Image', 'Pure JS', 'Manipulation'],
    useCases: {
      en: 'Image manipulation without native dependencies, browser image editing, Node.js processing',
      ko: '네이티브 의존성 없는 이미지 조작, 브라우저 이미지 편집, Node.js 처리',
    },
    codeExample: `import Jimp from 'jimp';
const image = await Jimp.read('image.png');
image.resize(256, 256).quality(80).write('output.jpg');`,
  },
  // ==========================================
  // Audio/Video
  // ==========================================
  {
    name: 'Tone.js',
    description: 'Web Audio framework for music synthesis',
    descriptionKo: '음악 합성을 위한 Web Audio 프레임워크',
    categories: ['Media & Documents'],
    license: 'MIT',
    github: 'https://github.com/Tonejs/Tone.js',
    website: 'https://tonejs.github.io',
    npm: 'tone',
    stars: '14k',
    trending: true,
    yearReleased: 2014,
    tags: ['Audio', 'Music', 'Synthesizer'],
    useCases: {
      en: 'Music applications, audio synthesis, interactive sound, music education',
      ko: '음악 애플리케이션, 오디오 합성, 인터랙티브 사운드, 음악 교육',
    },
    codeExample: `import * as Tone from 'tone';
const synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease('C4', '8n');`,
  },
  {
    name: 'Howler.js',
    description: 'Audio library for the modern web',
    descriptionKo: '모던 웹을 위한 오디오 라이브러리',
    categories: ['Media & Documents'],
    license: 'MIT',
    github: 'https://github.com/goldfire/howler.js',
    website: 'https://howlerjs.com',
    npm: 'howler',
    stars: '25k',
    yearReleased: 2013,
    tags: ['Audio', 'Sound', 'Game'],
    useCases: {
      en: 'Game audio, sound effects, music players, audio sprites',
      ko: '게임 오디오, 사운드 효과, 음악 플레이어, 오디오 스프라이트',
    },
    codeExample: `import { Howl } from 'howler';
const sound = new Howl({ src: ['sound.mp3'] });
sound.play();`,
  },
  {
    name: 'WaveSurfer.js',
    description: 'Audio visualization and playback',
    descriptionKo: '오디오 시각화 및 재생',
    categories: ['Media & Documents'],
    license: 'BSD-3-Clause',
    github: 'https://github.com/katspaugh/wavesurfer.js',
    website: 'https://wavesurfer.xyz',
    npm: 'wavesurfer.js',
    stars: '10k',
    trending: true,
    yearReleased: 2013,
    tags: ['Audio', 'Waveform', 'Visualization'],
    useCases: {
      en: 'Audio waveform display, podcast players, audio editors, music visualization',
      ko: '오디오 파형 표시, 팟캐스트 플레이어, 오디오 에디터, 음악 시각화',
    },
    codeExample: `import WaveSurfer from 'wavesurfer.js';
const wavesurfer = WaveSurfer.create({ container: '#waveform' });
wavesurfer.load('audio.mp3');`,
  },
  {
    name: 'Video.js',
    description: 'HTML5 video player framework',
    descriptionKo: 'HTML5 비디오 플레이어 프레임워크',
    categories: ['Media & Documents'],
    license: 'Apache-2.0',
    github: 'https://github.com/videojs/video.js',
    website: 'https://videojs.org',
    npm: 'video.js',
    stars: '38k',
    yearReleased: 2010,
    tags: ['Video', 'Player', 'Streaming'],
    useCases: {
      en: 'Video streaming, custom video players, HLS/DASH playback, video ads',
      ko: '비디오 스트리밍, 커스텀 비디오 플레이어, HLS/DASH 재생, 비디오 광고',
    },
    codeExample: `import videojs from 'video.js';
const player = videojs('my-video', { controls: true, autoplay: false });
player.src({ type: 'video/mp4', src: 'video.mp4' });`,
  },

  // ==========================================
  // PDF/Documents
  // ==========================================
  {
    name: 'PDF.js',
    description: 'PDF reader built with JavaScript',
    descriptionKo: 'JavaScript로 만든 PDF 리더',
    categories: ['Media & Documents'],
    license: 'Apache-2.0',
    github: 'https://github.com/mozilla/pdf.js',
    website: 'https://mozilla.github.io/pdf.js/',
    npm: 'pdfjs-dist',
    stars: '53k',
    yearReleased: 2011,
    tags: ['PDF', 'Viewer', 'Mozilla'],
    useCases: {
      en: 'PDF rendering, document viewers, PDF to canvas, text extraction',
      ko: 'PDF 렌더링, 문서 뷰어, PDF를 캔버스로, 텍스트 추출',
    },
    codeExample: `import * as pdfjsLib from 'pdfjs-dist';
const pdf = await pdfjsLib.getDocument('document.pdf').promise;
const page = await pdf.getPage(1);`,
  },
  {
    name: 'Mammoth',
    description: 'Convert Word documents to HTML',
    descriptionKo: 'Word 문서를 HTML로 변환',
    categories: ['Media & Documents'],
    license: 'BSD-2-Clause',
    github: 'https://github.com/mwilliamson/mammoth.js',
    npm: 'mammoth',
    stars: '6k',
    yearReleased: 2014,
    tags: ['Word', 'DOCX', 'HTML'],
    useCases: {
      en: 'DOCX to HTML conversion, document import, content migration, CMS integration',
      ko: 'DOCX를 HTML로 변환, 문서 가져오기, 콘텐츠 마이그레이션, CMS 통합',
    },
    codeExample: `import mammoth from 'mammoth';
const result = await mammoth.convertToHtml({ arrayBuffer });
console.log(result.value); // HTML string`,
  },

  // ==========================================
  // Math/Science
  // ==========================================
  {
    name: 'Math.js',
    description: 'Extensive math library for JavaScript',
    descriptionKo: 'JavaScript용 광범위한 수학 라이브러리',
    categories: ['Math & Science'],
    license: 'Apache-2.0',
    github: 'https://github.com/josdejong/mathjs',
    website: 'https://mathjs.org',
    npm: 'mathjs',
    stars: '14k',
    trending: true,
    yearReleased: 2013,
    tags: ['Math', 'Algebra', 'Expression'],
    useCases: {
      en: 'Scientific calculations, matrix operations, expression parsing, unit conversions',
      ko: '과학 계산, 행렬 연산, 수식 파싱, 단위 변환',
    },
    codeExample: `import { evaluate, matrix, multiply } from 'mathjs';
evaluate('sqrt(3^2 + 4^2)'); // 5
const A = matrix([[1, 2], [3, 4]]);
multiply(A, 2);`,
  },
  {
    name: 'Simple Statistics',
    description: 'Statistical methods in JavaScript',
    descriptionKo: 'JavaScript 통계 메서드',
    categories: ['Math & Science'],
    license: 'ISC',
    github: 'https://github.com/simple-statistics/simple-statistics',
    website: 'https://simple-statistics.github.io/',
    npm: 'simple-statistics',
    stars: '3k',
    yearReleased: 2012,
    tags: ['Statistics', 'Math', 'Data'],
    useCases: {
      en: 'Mean, median, standard deviation, regression, probability distributions',
      ko: '평균, 중앙값, 표준편차, 회귀분석, 확률 분포',
    },
    codeExample: `import ss from 'simple-statistics';
ss.mean([1, 2, 3]); // 2
ss.standardDeviation([1, 2, 3]); // 0.816...
ss.linearRegression([[0, 0], [1, 1]]);`,
  },
  {
    name: 'stdlib',
    description: 'Standard library for JavaScript numerical computing',
    descriptionKo: 'JavaScript 수치 컴퓨팅 표준 라이브러리',
    categories: ['Math & Science'],
    license: 'Apache-2.0',
    github: 'https://github.com/stdlib-js/stdlib',
    website: 'https://stdlib.io',
    npm: '@stdlib/stdlib',
    stars: '4k',
    yearReleased: 2016,
    tags: ['Math', 'Scientific', 'Statistics'],
    useCases: {
      en: 'Scientific computing, statistical functions, special functions, random number generation',
      ko: '과학 계산, 통계 함수, 특수 함수, 난수 생성',
    },
    codeExample: `import linspace from '@stdlib/array-base-linspace';
import sin from '@stdlib/math-base-special-sin';
const x = linspace(0, 2 * Math.PI, 100);
const y = x.map(sin);`,
  },
];

/**
 * 최종 `libraries` export. `RAW_LIBRARIES`에 `library-enrichment.ts`의
 * useCases/codeExample을 자동 merge.
 * - 본체에 이미 채워진 필드가 있으면 그것을 우선 (덮어쓰기 방지).
 * - enrichment에 등록되지 않은 라이브러리는 그대로 반환.
 */
export const libraries: Library[] = RAW_LIBRARIES.map((lib) => {
  const enrich = libraryEnrichment[lib.name];
  if (!enrich) return lib;
  return {
    ...lib,
    useCases: lib.useCases ?? enrich.useCases,
    codeExample: lib.codeExample ?? enrich.codeExample,
  };
});

/**
 * 카테고리 목록 (Phase 2: 25개 → 10개로 통폐합).
 * `categoryMeta` 와 1:1 대응. UI 필터 칩 표시 순서는 이 배열 순서를 따릅니다.
 * 'All'은 필터 UI 전용 sentinel.
 */
export const categories = [
  'All',
  'UI & Styling',
  'App Frameworks',
  'Build & DX',
  'State & Data',
  'Visuals & Graphics',
  'Data & Security',
  'Runtime & WASM',
  'AI & Vision',
  'Media & Documents',
  'Math & Science',
] as const;

export type CategoryFilter = (typeof categories)[number];

/**
 * 카테고리 메타데이터 (SEO + UI용 상세 정보).
 * Phase 2: 25개 카테고리를 10개 그룹으로 통폐합.
 * 각 항목의 `name.en`은 `Library.category` / `Library.categories` 의 값과 정확히 일치해야 합니다.
 * `id`는 URL slug로 사용됩니다 (`/category/:id`).
 */
export const categoryMeta: CategoryMeta[] = [
  {
    id: 'ui-styling',
    name: { en: 'UI & Styling', ko: 'UI 및 스타일링' },
    description: {
      en: 'UI component libraries, design systems, CSS frameworks, and animation tools',
      ko: 'UI 컴포넌트 라이브러리, 디자인 시스템, CSS 프레임워크, 애니메이션 도구',
    },
  },
  {
    id: 'app-frameworks',
    name: { en: 'App Frameworks', ko: '앱 프레임워크' },
    description: {
      en: 'UI frameworks, meta-frameworks (SSR/SSG), and routing libraries for building apps',
      ko: '앱 구축을 위한 UI 프레임워크, 메타 프레임워크(SSR/SSG), 라우팅 라이브러리',
    },
  },
  {
    id: 'build-dx',
    name: { en: 'Build & DX', ko: '빌드 및 개발자 경험' },
    description: {
      en: 'Bundlers, compilers, testing tools, and type-safety libraries',
      ko: '번들러, 컴파일러, 테스팅 도구, 타입 안전성 라이브러리',
    },
  },
  {
    id: 'state-data',
    name: { en: 'State & Data', ko: '상태 및 데이터' },
    description: {
      en: 'State management, data fetching, and form handling libraries',
      ko: '상태 관리, 데이터 페칭, 폼 처리 라이브러리',
    },
  },
  {
    id: 'visuals-graphics',
    name: { en: 'Visuals & Graphics', ko: '시각화 및 그래픽' },
    description: {
      en: '2D/3D graphics, canvas, WebGL, and image processing libraries',
      ko: '2D/3D 그래픽, 캔버스, WebGL, 이미지 처리 라이브러리',
    },
  },
  {
    id: 'data-security',
    name: { en: 'Data & Security', ko: '데이터 및 보안' },
    description: {
      en: 'Data serialization (Protobuf, MessagePack), compression, and cryptography libraries',
      ko: '데이터 직렬화(Protobuf, MessagePack), 압축, 암호화 라이브러리',
    },
  },
  {
    id: 'runtime-wasm',
    name: { en: 'Runtime & WASM', ko: '런타임 및 WASM' },
    description: {
      en: 'JavaScript/TypeScript runtimes and WebAssembly compilers/runtimes',
      ko: 'JavaScript/TypeScript 런타임과 WebAssembly 컴파일러/런타임',
    },
  },
  {
    id: 'ai-vision',
    name: { en: 'AI & Vision', ko: 'AI 및 비전' },
    description: {
      en: 'Machine learning, computer vision, and AI libraries running in the browser',
      ko: '브라우저에서 동작하는 머신러닝, 컴퓨터 비전, AI 라이브러리',
    },
  },
  {
    id: 'media-documents',
    name: { en: 'Media & Documents', ko: '미디어 및 문서' },
    description: {
      en: 'Audio/video processing, PDF generation, and document handling libraries',
      ko: '오디오/비디오 처리, PDF 생성, 문서 처리 라이브러리',
    },
  },
  {
    id: 'math-science',
    name: { en: 'Math & Science', ko: '수학 및 과학' },
    description: {
      en: 'Mathematical computation, statistics, and scientific computing libraries',
      ko: '수학 연산, 통계, 과학 계산 라이브러리',
    },
  },
];

// Slug utilities for URL-friendly library identifiers
export function getLibrarySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getLibraryBySlug(slug: string): Library | undefined {
  return libraries.find((lib) => getLibrarySlug(lib.name) === slug);
}

/**
 * 관련 라이브러리: 같은 카테고리(다중 분류 중 하나라도 겹침)를 가진 라이브러리.
 * `lib.name` 자체는 제외.
 */
export function getRelatedLibraries(library: Library, limit = 3): Library[] {
  const own = new Set(library.categories);
  return libraries
    .filter((lib) => lib.name !== library.name && lib.categories.some((c) => own.has(c)))
    .slice(0, limit);
}

/** 카테고리 이름 → slug 변환 */
export function getCategorySlug(categoryName: string): string {
  return categoryName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** slug → 카테고리 메타데이터 조회 */
export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return categoryMeta.find((cat) => cat.id === slug);
}

/** 카테고리 이름으로 메타데이터 조회 */
export function getCategoryMetaByName(categoryName: string): CategoryMeta | undefined {
  const slug = getCategorySlug(categoryName);
  return getCategoryBySlug(slug);
}

/**
 * 특정 카테고리의 라이브러리 조회 (다중 분류 중 하나라도 일치하면 포함).
 */
export function getLibrariesByCategory(categoryName: string): Library[] {
  return libraries.filter((lib) => lib.categories.includes(categoryName));
}

/**
 * 특정 카테고리 slug의 라이브러리 조회.
 * slug → 카테고리 이름 → categories 배열에 포함된 라이브러리 모두.
 */
export function getLibrariesByCategorySlug(slug: string): Library[] {
  const meta = getCategoryBySlug(slug);
  if (!meta) return [];
  return libraries.filter((lib) => lib.categories.includes(meta.name.en));
}

/**
 * Phase 2 카테고리 통폐합 (25 → 10) 이전의 옛 slug → 새 slug 매핑.
 * 검색엔진/북마크 호환성을 위한 301 redirect 용도.
 * 'math-science'는 옛/새 동일 (이름이 'Math/Science' → 'Math & Science'로
 * 바뀌었지만 slug는 그대로).
 */
export const OLD_CATEGORY_SLUG_REDIRECTS: Record<string, string> = {
  // 옛 → 'ui-styling'
  'ui-components': 'ui-styling',
  styling: 'ui-styling',
  animation: 'ui-styling',
  // 옛 → 'app-frameworks'
  routing: 'app-frameworks',
  'meta-frameworks': 'app-frameworks',
  frameworks: 'app-frameworks',
  // 옛 → 'build-dx'
  'build-tools': 'build-dx',
  testing: 'build-dx',
  'type-safety': 'build-dx',
  // 옛 → 'state-data'
  'state-management': 'state-data',
  'data-fetching': 'state-data',
  forms: 'state-data',
  // 옛 → 'visuals-graphics'
  'graphics-canvas': 'visuals-graphics',
  '3d-graphics': 'visuals-graphics',
  'image-processing': 'visuals-graphics',
  // 옛 → 'data-security'
  'data-serialization': 'data-security',
  cryptography: 'data-security',
  compression: 'data-security',
  // 옛 → 'runtime-wasm'
  'wasm-runtime': 'runtime-wasm',
  runtime: 'runtime-wasm',
  // 옛 → 'ai-vision'
  'machine-learning': 'ai-vision',
  'computer-vision': 'ai-vision',
  // 옛 → 'media-documents'
  'audio-video': 'media-documents',
  'pdf-documents': 'media-documents',
};

/**
 * 옛 카테고리 slug가 들어왔을 때 새 slug로 변환. 새 slug면 그대로 반환.
 * 매칭되지 않으면 undefined (caller에서 404 처리).
 */
export function resolveCategorySlug(slug: string): string | undefined {
  if (getCategoryBySlug(slug)) return slug;
  return OLD_CATEGORY_SLUG_REDIRECTS[slug];
}

// ============================================================================
// 태그 관련 유틸리티
// ============================================================================

export interface TagWithCount {
  tag: string;
  count: number;
}

/** 모든 태그와 개수 (정렬됨) */
export const allLibraryTags: TagWithCount[] = (() => {
  const tagCounts = new Map<string, number>();
  for (const lib of libraries) {
    for (const tag of lib.tags || []) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
})();

/** 태그별 라이브러리 조회 */
export function getLibrariesByTag(tag: string): Library[] {
  return libraries.filter((lib) => lib.tags?.includes(tag));
}

/** 총 태그 수 */
export const totalLibraryTagCount = allLibraryTags.length;
