import { useMemo, useState } from 'react';
import type { MetaFunction } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';

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
  trending?: boolean;
  yearReleased?: number;
  tags?: string[];
}

const libraries: Library[] = [
  // Routing
  {
    name: 'React Router',
    description: 'Declarative routing for React',
    descriptionKo: 'React를 위한 선언적 라우팅',
    category: 'Routing',
    license: 'MIT',
    github: 'https://github.com/remix-run/react-router',
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
    category: 'Routing',
    license: 'MIT',
    github: 'https://github.com/TanStack/router',
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
    category: 'Routing',
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
    category: 'Meta-frameworks',
    license: 'MIT',
    github: 'https://github.com/vercel/next.js',
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
    category: 'Meta-frameworks',
    license: 'MIT',
    github: 'https://github.com/withastro/astro',
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
    category: 'Meta-frameworks',
    license: 'MIT',
    github: 'https://github.com/remix-run/remix',
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
    category: 'Meta-frameworks',
    license: 'MIT',
    github: 'https://github.com/nuxt/nuxt',
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
    category: 'Meta-frameworks',
    license: 'MIT',
    github: 'https://github.com/sveltejs/kit',
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
    category: 'Meta-frameworks',
    license: 'MIT',
    github: 'https://github.com/QwikDev/qwik',
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
    category: 'Meta-frameworks',
    license: 'MIT',
    github: 'https://github.com/gatsbyjs/gatsby',
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
    category: 'Frameworks',
    license: 'MIT',
    github: 'https://github.com/facebook/react',
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
    category: 'Frameworks',
    license: 'MIT',
    github: 'https://github.com/vuejs/core',
    npm: 'vue',
    stars: '207k',
    yearReleased: 2014,
    tags: ['UI', 'Components', 'TypeScript'],
  },
  {
    name: 'Svelte',
    description: 'Cybernetically enhanced web apps',
    descriptionKo: '사이버네틱하게 향상된 웹 앱',
    category: 'Frameworks',
    license: 'MIT',
    github: 'https://github.com/sveltejs/svelte',
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
    category: 'Frameworks',
    license: 'MIT',
    github: 'https://github.com/solidjs/solid',
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
    category: 'Frameworks',
    license: 'MIT',
    github: 'https://github.com/preactjs/preact',
    npm: 'preact',
    stars: '37k',
    yearReleased: 2015,
    tags: ['UI', 'Minimal', 'React-compatible'],
  },
  {
    name: 'Alpine.js',
    description: 'Lightweight JavaScript framework',
    descriptionKo: '경량 자바스크립트 프레임워크',
    category: 'Frameworks',
    license: 'MIT',
    github: 'https://github.com/alpinejs/alpine',
    npm: 'alpinejs',
    stars: '28k',
    yearReleased: 2019,
    tags: ['Minimal', 'HTML-first'],
  },
  {
    name: 'Lit',
    description: 'Simple. Fast. Web Components.',
    descriptionKo: '간단하고 빠른 웹 컴포넌트',
    category: 'Frameworks',
    license: 'BSD-3-Clause',
    github: 'https://github.com/lit/lit',
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
    category: 'Build Tools',
    license: 'MIT',
    github: 'https://github.com/vitejs/vite',
    npm: 'vite',
    stars: '69k',
    usedHere: true,
    trending: true,
    yearReleased: 2020,
    tags: ['Build', 'Dev Server', 'ESM'],
  },
  {
    name: 'Turbopack',
    description: 'Incremental bundler for web',
    descriptionKo: '웹을 위한 증분 번들러',
    category: 'Build Tools',
    license: 'MPL-2.0',
    github: 'https://github.com/vercel/turbo',
    npm: 'turbopack',
    stars: '27k',
    trending: true,
    yearReleased: 2022,
    tags: ['Build', 'Rust', 'Fast'],
  },
  {
    name: 'Rspack',
    description: 'Rust-powered webpack',
    descriptionKo: 'Rust 기반 webpack',
    category: 'Build Tools',
    license: 'MIT',
    github: 'https://github.com/web-infra-dev/rspack',
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
    category: 'Build Tools',
    license: 'MIT',
    github: 'https://github.com/evanw/esbuild',
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
    category: 'Build Tools',
    license: 'MIT',
    github: 'https://github.com/webpack/webpack',
    npm: 'webpack',
    stars: '64k',
    yearReleased: 2012,
    tags: ['Build', 'Classic'],
  },
  {
    name: 'Rollup',
    description: 'Module bundler for libraries',
    descriptionKo: '라이브러리를 위한 모듈 번들러',
    category: 'Build Tools',
    license: 'MIT',
    github: 'https://github.com/rollup/rollup',
    npm: 'rollup',
    stars: '25k',
    yearReleased: 2015,
    tags: ['Build', 'ESM'],
  },
  {
    name: 'Parcel',
    description: 'Zero config build tool',
    descriptionKo: '제로 설정 빌드 도구',
    category: 'Build Tools',
    license: 'MIT',
    github: 'https://github.com/parcel-bundler/parcel',
    npm: 'parcel',
    stars: '43k',
    yearReleased: 2017,
    tags: ['Build', 'Zero-config'],
  },
  {
    name: 'SWC',
    description: 'Rust-based platform for fast tools',
    descriptionKo: 'Rust 기반 빠른 도구 플랫폼',
    category: 'Build Tools',
    license: 'Apache-2.0',
    github: 'https://github.com/swc-project/swc',
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
    category: 'Build Tools',
    license: 'MIT',
    github: 'https://github.com/biomejs/biome',
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
    category: 'Runtime',
    license: 'MIT',
    github: 'https://github.com/oven-sh/bun',
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
    category: 'Runtime',
    license: 'MIT',
    github: 'https://github.com/denoland/deno',
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
    category: 'Runtime',
    license: 'MIT',
    github: 'https://github.com/nodejs/node',
    npm: 'node',
    stars: '108k',
    yearReleased: 2009,
    tags: ['Runtime', 'Classic'],
  },

  // State Management
  {
    name: 'Zustand',
    description: 'Small, fast state-management',
    descriptionKo: '작고 빠른 상태 관리',
    category: 'State Management',
    license: 'MIT',
    github: 'https://github.com/pmndrs/zustand',
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
    category: 'State Management',
    license: 'MIT',
    github: 'https://github.com/reduxjs/redux-toolkit',
    npm: '@reduxjs/toolkit',
    stars: '11k',
    yearReleased: 2019,
    tags: ['React', 'State', 'TypeScript'],
  },
  {
    name: 'Jotai',
    description: 'Primitive and flexible state',
    descriptionKo: '원시적이고 유연한 상태 관리',
    category: 'State Management',
    license: 'MIT',
    github: 'https://github.com/pmndrs/jotai',
    npm: 'jotai',
    stars: '19k',
    trending: true,
    yearReleased: 2020,
    tags: ['React', 'Atomic', 'TypeScript'],
  },
  {
    name: 'Recoil',
    description: 'State management for React',
    descriptionKo: 'React를 위한 상태 관리',
    category: 'State Management',
    license: 'MIT',
    github: 'https://github.com/facebookexperimental/Recoil',
    npm: 'recoil',
    stars: '20k',
    yearReleased: 2020,
    tags: ['React', 'Atomic', 'TypeScript'],
  },
  {
    name: 'MobX',
    description: 'Simple, scalable state management',
    descriptionKo: '간단하고 확장 가능한 상태 관리',
    category: 'State Management',
    license: 'MIT',
    github: 'https://github.com/mobxjs/mobx',
    npm: 'mobx',
    stars: '27k',
    yearReleased: 2015,
    tags: ['Observable', 'TypeScript'],
  },
  {
    name: 'Valtio',
    description: 'Proxy-based state management',
    descriptionKo: 'Proxy 기반 상태 관리',
    category: 'State Management',
    license: 'MIT',
    github: 'https://github.com/pmndrs/valtio',
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
    category: 'State Management',
    license: 'MIT',
    github: 'https://github.com/statelyai/xstate',
    npm: 'xstate',
    stars: '27k',
    yearReleased: 2015,
    tags: ['State Machine', 'TypeScript'],
  },
  {
    name: 'Pinia',
    description: 'Intuitive Vue Store',
    descriptionKo: '직관적인 Vue 스토어',
    category: 'State Management',
    license: 'MIT',
    github: 'https://github.com/vuejs/pinia',
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
    category: 'Data Fetching',
    license: 'MIT',
    github: 'https://github.com/TanStack/query',
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
    category: 'Data Fetching',
    license: 'MIT',
    github: 'https://github.com/vercel/swr',
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
    category: 'Data Fetching',
    license: 'MIT',
    github: 'https://github.com/apollographql/apollo-client',
    npm: '@apollo/client',
    stars: '19k',
    yearReleased: 2016,
    tags: ['GraphQL', 'React', 'TypeScript'],
  },
  {
    name: 'tRPC',
    description: 'End-to-end typesafe APIs',
    descriptionKo: '엔드투엔드 타입 안전 API',
    category: 'Data Fetching',
    license: 'MIT',
    github: 'https://github.com/trpc/trpc',
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
    category: 'Data Fetching',
    license: 'MIT',
    github: 'https://github.com/axios/axios',
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
    category: 'Type Safety',
    license: 'Apache-2.0',
    github: 'https://github.com/microsoft/TypeScript',
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
    category: 'Type Safety',
    license: 'MIT',
    github: 'https://github.com/colinhacks/zod',
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
    category: 'Type Safety',
    license: 'MIT',
    github: 'https://github.com/fabian-hiller/valibot',
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
    category: 'Type Safety',
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
    category: 'Styling',
    license: 'MIT',
    github: 'https://github.com/tailwindlabs/tailwindcss',
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
    category: 'Styling',
    license: 'MIT',
    github: 'https://github.com/unocss/unocss',
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
    category: 'Styling',
    license: 'MIT',
    github: 'https://github.com/chakra-ui/panda',
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
    category: 'Styling',
    license: 'MIT',
    github: 'https://github.com/styled-components/styled-components',
    npm: 'styled-components',
    stars: '40k',
    yearReleased: 2016,
    tags: ['CSS-in-JS', 'React'],
  },
  {
    name: 'Emotion',
    description: 'CSS-in-JS library',
    descriptionKo: 'CSS-in-JS 라이브러리',
    category: 'Styling',
    license: 'MIT',
    github: 'https://github.com/emotion-js/emotion',
    npm: '@emotion/react',
    stars: '17k',
    yearReleased: 2017,
    tags: ['CSS-in-JS', 'React'],
  },
  {
    name: 'Sass',
    description: 'CSS with superpowers',
    descriptionKo: '슈퍼파워가 있는 CSS',
    category: 'Styling',
    license: 'MIT',
    github: 'https://github.com/sass/sass',
    npm: 'sass',
    stars: '15k',
    yearReleased: 2006,
    tags: ['CSS', 'Preprocessor'],
  },
  {
    name: 'PostCSS',
    description: 'Transform CSS with JS',
    descriptionKo: 'JS로 CSS 변환',
    category: 'Styling',
    license: 'MIT',
    github: 'https://github.com/postcss/postcss',
    npm: 'postcss',
    stars: '28k',
    yearReleased: 2013,
    tags: ['CSS', 'Transform'],
  },
  {
    name: 'Vanilla Extract',
    description: 'Zero-runtime CSS-in-TypeScript',
    descriptionKo: '제로 런타임 CSS-in-TypeScript',
    category: 'Styling',
    license: 'MIT',
    github: 'https://github.com/vanilla-extract-css/vanilla-extract',
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
    category: 'Styling',
    license: 'MIT',
    github: 'https://github.com/facebook/stylex',
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
    category: 'UI Components',
    license: 'MIT',
    github: 'https://github.com/radix-ui/primitives',
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
    category: 'UI Components',
    license: 'MIT',
    github: 'https://github.com/shadcn-ui/ui',
    stars: '77k',
    trending: true,
    yearReleased: 2023,
    tags: ['React', 'Tailwind', 'Copy-paste'],
  },
  {
    name: 'React Aria',
    description: "Adobe's accessible UI primitives",
    descriptionKo: 'Adobe의 접근 가능한 UI 프리미티브',
    category: 'UI Components',
    license: 'Apache-2.0',
    github: 'https://github.com/adobe/react-spectrum',
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
    category: 'UI Components',
    license: 'MIT',
    github: 'https://github.com/tailwindlabs/headlessui',
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
    category: 'UI Components',
    license: 'MIT',
    github: 'https://github.com/mantinedev/mantine',
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
    category: 'UI Components',
    license: 'MIT',
    github: 'https://github.com/chakra-ui/chakra-ui',
    npm: '@chakra-ui/react',
    stars: '38k',
    yearReleased: 2019,
    tags: ['React', 'Accessible'],
  },
  {
    name: 'Ant Design',
    description: 'Enterprise UI design system',
    descriptionKo: '엔터프라이즈 UI 디자인 시스템',
    category: 'UI Components',
    license: 'MIT',
    github: 'https://github.com/ant-design/ant-design',
    npm: 'antd',
    stars: '92k',
    yearReleased: 2015,
    tags: ['React', 'Enterprise'],
  },
  {
    name: 'Material-UI',
    description: 'React Material Design components',
    descriptionKo: 'React Material Design 컴포넌트',
    category: 'UI Components',
    license: 'MIT',
    github: 'https://github.com/mui/material-ui',
    npm: '@mui/material',
    stars: '94k',
    yearReleased: 2014,
    tags: ['React', 'Material Design'],
  },
  {
    name: 'daisyUI',
    description: 'Tailwind CSS component library',
    descriptionKo: 'Tailwind CSS 컴포넌트 라이브러리',
    category: 'UI Components',
    license: 'MIT',
    github: 'https://github.com/saadeghi/daisyui',
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
    category: 'UI Components',
    license: 'MIT',
    github: 'https://github.com/cschroeter/park-ui',
    npm: '@park-ui/react',
    stars: '2k',
    trending: true,
    yearReleased: 2023,
    tags: ['React', 'Panda CSS'],
  },

  // Animation
  {
    name: 'Framer Motion',
    description: 'Production-ready motion library',
    descriptionKo: '프로덕션 준비된 모션 라이브러리',
    category: 'Animation',
    license: 'MIT',
    github: 'https://github.com/framer/motion',
    npm: 'framer-motion',
    stars: '25k',
    trending: true,
    yearReleased: 2018,
    tags: ['React', 'Animation'],
  },
  {
    name: 'GSAP',
    description: 'Professional-grade animation',
    descriptionKo: '전문가급 애니메이션',
    category: 'Animation',
    license: 'Custom',
    github: 'https://github.com/greensock/GSAP',
    npm: 'gsap',
    stars: '20k',
    yearReleased: 2006,
    tags: ['Animation', 'Professional'],
  },
  {
    name: 'React Spring',
    description: 'Spring-physics based animation',
    descriptionKo: '스프링 물리 기반 애니메이션',
    category: 'Animation',
    license: 'MIT',
    github: 'https://github.com/pmndrs/react-spring',
    npm: '@react-spring/web',
    stars: '28k',
    yearReleased: 2018,
    tags: ['React', 'Physics'],
  },
  {
    name: 'Auto Animate',
    description: 'Zero-config animations',
    descriptionKo: '제로 설정 애니메이션',
    category: 'Animation',
    license: 'MIT',
    github: 'https://github.com/formkit/auto-animate',
    npm: '@formkit/auto-animate',
    stars: '13k',
    trending: true,
    yearReleased: 2022,
    tags: ['Animation', 'Zero-config'],
  },
  {
    name: 'Motion One',
    description: 'Smallest animation library',
    descriptionKo: '가장 작은 애니메이션 라이브러리',
    category: 'Animation',
    license: 'MIT',
    github: 'https://github.com/motiondivision/motionone',
    npm: 'motion',
    stars: '6k',
    trending: true,
    yearReleased: 2021,
    tags: ['Animation', 'Minimal'],
  },

  // Forms
  {
    name: 'React Hook Form',
    description: 'Performant forms with easy validation',
    descriptionKo: '쉬운 검증과 성능 좋은 폼',
    category: 'Forms',
    license: 'MIT',
    github: 'https://github.com/react-hook-form/react-hook-form',
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
    category: 'Forms',
    license: 'MIT',
    github: 'https://github.com/TanStack/form',
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
    category: 'Forms',
    license: 'Apache-2.0',
    github: 'https://github.com/jaredpalmer/formik',
    npm: 'formik',
    stars: '34k',
    yearReleased: 2017,
    tags: ['React', 'Forms'],
  },
  {
    name: 'React Final Form',
    description: 'High performance subscription-based form',
    descriptionKo: '고성능 구독 기반 폼',
    category: 'Forms',
    license: 'MIT',
    github: 'https://github.com/final-form/react-final-form',
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
    category: 'Testing',
    license: 'MIT',
    github: 'https://github.com/vitest-dev/vitest',
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
    category: 'Testing',
    license: 'Apache-2.0',
    github: 'https://github.com/microsoft/playwright',
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
    category: 'Testing',
    license: 'MIT',
    github: 'https://github.com/cypress-io/cypress',
    npm: 'cypress',
    stars: '47k',
    yearReleased: 2015,
    tags: ['E2E', 'Testing'],
  },
  {
    name: 'Testing Library',
    description: 'Simple testing utilities',
    descriptionKo: '간단한 테스팅 유틸리티',
    category: 'Testing',
    license: 'MIT',
    github: 'https://github.com/testing-library/react-testing-library',
    npm: '@testing-library/react',
    stars: '19k',
    yearReleased: 2018,
    tags: ['React', 'Testing'],
  },
  {
    name: 'Jest',
    description: 'Delightful JavaScript testing',
    descriptionKo: '즐거운 자바스크립트 테스팅',
    category: 'Testing',
    license: 'MIT',
    github: 'https://github.com/jestjs/jest',
    npm: 'jest',
    stars: '44k',
    yearReleased: 2011,
    tags: ['Testing', 'Classic'],
  },
  {
    name: 'Storybook',
    description: 'UI component development',
    descriptionKo: 'UI 컴포넌트 개발 도구',
    category: 'Testing',
    license: 'MIT',
    github: 'https://github.com/storybookjs/storybook',
    npm: 'storybook',
    stars: '84k',
    yearReleased: 2016,
    tags: ['UI', 'Documentation'],
  },
];

const categories = [
  'All',
  'Routing',
  'Meta-frameworks',
  'Frameworks',
  'Build Tools',
  'Runtime',
  'State Management',
  'Data Fetching',
  'Type Safety',
  'Styling',
  'UI Components',
  'Animation',
  'Forms',
  'Testing',
] as const;
type CategoryFilter = (typeof categories)[number];

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  const title = 'Libraries - Permissive';
  const description = isKorean
    ? 'MIT 라이센스 오픈소스 라이브러리'
    : 'MIT licensed open source libraries';

  return [{ title }, { name: 'description', content: description }];
};

export default function LibrariesPage() {
  const { locale } = useI18n();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');

  const filteredLibraries = useMemo(() => {
    let libs = libraries;
    if (category !== 'All') {
      libs = libs.filter((lib) => lib.category === category);
    }
    const q = search.toLowerCase().slice(0, 100);
    if (q) {
      libs = libs.filter(
        (lib) =>
          lib.name.toLowerCase().includes(q) ||
          lib.description.toLowerCase().includes(q) ||
          lib.descriptionKo.includes(q),
      );
    }
    return libs;
  }, [search, category]);

  const groupedLibraries = useMemo(() => {
    if (category !== 'All') {
      return { [category]: filteredLibraries };
    }
    return filteredLibraries.reduce<Record<string, Library[]>>((acc, lib) => {
      if (!acc[lib.category]) acc[lib.category] = [];
      acc[lib.category].push(lib);
      return acc;
    }, {});
  }, [filteredLibraries, category]);

  return (
    <DocsLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Libraries
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ko'
            ? 'MIT 라이센스 오픈소스. 상업적 사용 가능'
            : 'MIT licensed open source. Free for commercial use'}
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
            placeholder={locale === 'ko' ? '라이브러리 검색...' : 'Search libraries...'}
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
        {filteredLibraries.length} {locale === 'ko' ? '개의 라이브러리' : 'libraries'}
      </div>

      {/* Library List */}
      <div className="space-y-8">
        {Object.entries(groupedLibraries).map(([categoryName, libs]) => (
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
            <div className="grid sm:grid-cols-2 gap-3">
              {libs.map((lib) => (
                <div
                  key={lib.name}
                  className="group p-4 rounded-xl transition-all hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {lib.name}
                      </h3>
                      {lib.trending && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: 'rgba(255, 107, 107, 0.15)',
                            color: '#ff6b6b',
                          }}
                        >
                          🔥 {locale === 'ko' ? '2025 트렌드' : '2025 Trending'}
                        </span>
                      )}
                      {lib.usedHere && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: 'rgba(176, 136, 48, 0.15)',
                            color: 'var(--color-warning)',
                          }}
                        >
                          {locale === 'ko' ? '사용 중' : 'Used here'}
                        </span>
                      )}
                    </div>
                    <div
                      className="flex items-center gap-2 text-xs"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {lib.stars}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {locale === 'ko' ? lib.descriptionKo : lib.description}
                  </p>
                  {lib.tags && lib.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {lib.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs flex-wrap">
                    <span className="badge-mit">{lib.license}</span>
                    {lib.yearReleased && (
                      <span style={{ color: 'var(--text-tertiary)' }}>
                        Since {lib.yearReleased}
                      </span>
                    )}
                    <a
                      href={lib.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-(--accent-primary)"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      GitHub
                    </a>
                    {lib.npm && (
                      <a
                        href={`https://www.npmjs.com/package/${lib.npm}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-(--accent-primary)"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        npm
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty state */}
      {filteredLibraries.length === 0 && (
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
