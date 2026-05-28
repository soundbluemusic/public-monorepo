/**
 * @fileoverview 라이브러리 보조 콘텐츠 (useCases + codeExample) 일괄 생성본.
 *
 * Phase 4 결과물. Phase 3 시점 120개 라이브러리 중 useCases / codeExample이
 * 누락된 77개를 일괄로 채웠습니다. AI 일괄 생성 후 사람 검토가 필요한
 * 콘텐츠라 별도 파일로 분리; `libraries.ts`가 빌드 시 자동 merge합니다.
 *
 * 컨벤션:
 * - useCases.en/ko: 1~2 문장. "어디에 쓰이는지" 위주. 마침표 없음 OK.
 * - codeExample: 5~10줄. import 경로는 npm 패키지명 그대로. 주석 최소화.
 *
 * 검토 가이드:
 * - 라이브러리 공식 문서의 Quick Start 예시 참고
 * - 한국어 번역은 영어 의미를 1:1로 옮기되 어색하지 않게
 */

export interface LibraryEnrichment {
  useCases: { en: string; ko: string };
  codeExample: string;
}

/**
 * key: Library.name (정확히 일치해야 함).
 * libraries.ts의 라이브러리 객체에 자동 merge됨.
 */
export const libraryEnrichment: Record<string, LibraryEnrichment> = {
  // ===== App Frameworks (17) =====
  'React Router': {
    useCases: {
      en: 'Client-side and server-side routing for React SPAs, SSR apps, and file-based route trees',
      ko: 'React SPA와 SSR 앱의 클라이언트/서버 사이드 라우팅, 파일 기반 라우트 트리',
    },
    codeExample: `import { createBrowserRouter, RouterProvider } from 'react-router';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}`,
  },
  'TanStack Router': {
    useCases: {
      en: 'Fully type-safe routing with search params validation, nested layouts, and built-in data loading',
      ko: '완전한 타입 안전 라우팅. search 파라미터 검증, 중첩 레이아웃, 내장 데이터 로딩 지원',
    },
    codeExample: `import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/posts/$postId')({
  loader: ({ params }) => fetchPost(params.postId),
  component: PostPage,
});`,
  },
  Wouter: {
    useCases: {
      en: 'Sub-2 KB router for React with hook-based API; ideal when bundle size matters',
      ko: '2 KB 미만 React 라우터, 훅 기반 API. 번들 크기가 중요할 때',
    },
    codeExample: `import { Route, Switch, Link } from 'wouter';

export default function App() {
  return (
    <Switch>
      <Route path="/users/:id">{(params) => <User id={params.id} />}</Route>
      <Route>404 Not Found</Route>
    </Switch>
  );
}`,
  },
  'Next.js': {
    useCases: {
      en: 'Full-stack React framework with file-based routing, server components, SSR/SSG, and API routes',
      ko: '파일 기반 라우팅, 서버 컴포넌트, SSR/SSG, API 라우트를 갖춘 풀스택 React 프레임워크',
    },
    codeExample: `// app/posts/[slug]/page.tsx
export default async function Post({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  return <article>{post.body}</article>;
}`,
  },
  Astro: {
    useCases: {
      en: 'Content-focused web framework. Ships zero JS by default; opt into React/Vue/Svelte islands',
      ko: '콘텐츠 중심 웹 프레임워크. 기본 JS 0KB; 필요 시 React/Vue/Svelte 아일랜드 선택',
    },
    codeExample: `---
// src/pages/index.astro
const posts = await Astro.glob('./posts/*.md');
---
<ul>
  {posts.map(p => <li><a href={p.url}>{p.frontmatter.title}</a></li>)}
</ul>`,
  },
  Remix: {
    useCases: {
      en: 'Full-stack React framework focused on web standards (Request/Response), nested routes, and progressive enhancement',
      ko: '웹 표준(Request/Response), 중첩 라우트, 점진적 향상에 중점을 둔 풀스택 React 프레임워크',
    },
    codeExample: `// app/routes/posts.$slug.tsx
import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ params }: LoaderFunctionArgs) {
  return { post: await fetchPost(params.slug!) };
}

export default function Post() {
  const { post } = useLoaderData<typeof loader>();
  return <article>{post.body}</article>;
}`,
  },
  Nuxt: {
    useCases: {
      en: 'Vue 3 meta-framework with file-based routing, auto-imports, SSR/SSG, and rich module ecosystem',
      ko: 'Vue 3 메타 프레임워크. 파일 기반 라우팅, 자동 import, SSR/SSG, 풍부한 모듈 생태계',
    },
    codeExample: `<!-- pages/posts/[slug].vue -->
<script setup lang="ts">
const route = useRoute();
const { data: post } = await useFetch(\`/api/posts/\${route.params.slug}\`);
</script>

<template><article>{{ post.body }}</article></template>`,
  },
  SvelteKit: {
    useCases: {
      en: 'Svelte meta-framework with file-based routing, form actions, and adapter-based deploys (Node, Cloudflare, Vercel)',
      ko: 'Svelte 메타 프레임워크. 파일 기반 라우팅, 폼 액션, 어댑터 기반 배포 (Node·Cloudflare·Vercel)',
    },
    codeExample: `// src/routes/posts/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  return { post: await fetchPost(params.slug) };
};`,
  },
  Qwik: {
    useCases: {
      en: 'Resumability-first framework: ship serialized state instead of hydration; near-instant interactive sites',
      ko: 'Resumability 우선 프레임워크. hydration 대신 직렬화된 상태를 전송, 즉시 인터랙티브',
    },
    codeExample: `import { component$, useSignal } from '@builder.io/qwik';

export default component$(() => {
  const count = useSignal(0);
  return <button onClick$={() => count.value++}>Clicks: {count.value}</button>;
});`,
  },
  Gatsby: {
    useCases: {
      en: 'GraphQL-powered SSG for React. Plugins fetch data from CMSes, files, APIs at build time',
      ko: 'GraphQL 기반 React SSG. 플러그인으로 CMS·파일·API에서 빌드 시점 데이터 fetch',
    },
    codeExample: `import { graphql } from 'gatsby';

export const query = graphql\`
  query { allPosts { edges { node { slug title } } } }
\`;

export default function Index({ data }) {
  return data.allPosts.edges.map(({ node }) => <li>{node.title}</li>);
}`,
  },
  React: {
    useCases: {
      en: 'Component-based UI library. Foundation for SPAs, SSR apps, native (React Native), and most modern web stacks',
      ko: '컴포넌트 기반 UI 라이브러리. SPA·SSR·네이티브(React Native)·모던 웹 스택의 토대',
    },
    codeExample: `import { useState } from 'react';

export default function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>Count: {n}</button>;
}`,
  },
  Vue: {
    useCases: {
      en: 'Progressive framework with SFC (single-file components), Composition API, and built-in reactivity',
      ko: '점진적 프레임워크. SFC(단일 파일 컴포넌트), Composition API, 내장 반응성',
    },
    codeExample: `<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>

<template><button @click="count++">Count: {{ count }}</button></template>`,
  },
  Svelte: {
    useCases: {
      en: 'Compile-time UI framework: ships minimal runtime, no virtual DOM, reactive declarations',
      ko: '컴파일 타임 UI 프레임워크. 최소 런타임, virtual DOM 없음, 반응형 선언',
    },
    codeExample: `<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>Count: {count}</button>`,
  },
  SolidJS: {
    useCases: {
      en: 'Fine-grained reactive UI library. Looks like React but compiles to direct DOM updates without VDOM',
      ko: '정교한 반응형 UI 라이브러리. React 스타일이지만 VDOM 없이 직접 DOM 업데이트로 컴파일',
    },
    codeExample: `import { createSignal } from 'solid-js';

export default function Counter() {
  const [count, setCount] = createSignal(0);
  return <button onClick={() => setCount(count() + 1)}>Count: {count()}</button>;
}`,
  },
  Preact: {
    useCases: {
      en: 'Sub-3 KB React-compatible alternative with hooks and the same component model',
      ko: '3 KB 미만 React 호환 대안. 훅 + 동일한 컴포넌트 모델',
    },
    codeExample: `import { render } from 'preact';
import { useState } from 'preact/hooks';

function App() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>Count: {n}</button>;
}

render(<App />, document.body);`,
  },
  'Alpine.js': {
    useCases: {
      en: 'Lightweight HTML-attribute-driven reactivity. Drop-in for static sites needing small interactive bits',
      ko: 'HTML 속성 기반 경량 반응성. 정적 사이트에 작은 인터랙션을 추가할 때',
    },
    codeExample: `<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open">Hidden content</div>
</div>`,
  },
  Lit: {
    useCases: {
      en: 'Web Components base class with reactive properties and declarative templates. Works in any framework or none',
      ko: '반응형 프로퍼티 + 선언적 템플릿이 있는 Web Components 베이스 클래스. 어떤 프레임워크에서도 또는 단독 사용',
    },
    codeExample: `import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('my-counter')
export class MyCounter extends LitElement {
  @state() count = 0;
  render() {
    return html\`<button @click=\${() => this.count++}>Count: \${this.count}</button>\`;
  }
}`,
  },

  // ===== Build & DX (19) =====
  Vite: {
    useCases: {
      en: 'Next-gen frontend build tool. Native ESM dev server + Rollup-based production build with sub-second HMR',
      ko: '차세대 프론트엔드 빌드 도구. 네이티브 ESM dev 서버 + Rollup 기반 프로덕션 빌드, 1초 미만 HMR',
    },
    codeExample: `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { target: 'esnext' },
});`,
  },
  Turbopack: {
    useCases: {
      en: 'Rust-based bundler from Vercel, replacing Webpack in Next.js. Incremental computation for fast dev/build',
      ko: 'Vercel의 Rust 기반 번들러, Next.js의 Webpack 대체. 증분 연산으로 빠른 dev/build',
    },
    codeExample: `// Next.js 15+
// next dev --turbopack
// next build --turbopack`,
  },
  Rspack: {
    useCases: {
      en: 'Rust-based Webpack-compatible bundler. Drop-in replacement claiming 5-10x faster builds',
      ko: 'Rust 기반 Webpack 호환 번들러. 5~10배 빠른 빌드의 drop-in 대체재',
    },
    codeExample: `// rspack.config.js
module.exports = {
  entry: './src/index.ts',
  output: { filename: 'bundle.js' },
  module: { rules: [{ test: /\\.tsx?$/, use: 'builtin:swc-loader' }] },
};`,
  },
  esbuild: {
    useCases: {
      en: 'Go-based bundler/minifier; 10-100x faster than JS-based tools. Used internally by Vite, tsx, etc.',
      ko: 'Go 기반 번들러/minifier. JS 기반 도구 대비 10~100배 빠름. Vite/tsx 등이 내부 사용',
    },
    codeExample: `import { build } from 'esbuild';

await build({
  entryPoints: ['src/app.ts'],
  bundle: true,
  outfile: 'dist/app.js',
  minify: true,
});`,
  },
  Webpack: {
    useCases: {
      en: 'Battle-tested module bundler with the largest plugin ecosystem. Still standard for many production apps',
      ko: '검증된 모듈 번들러, 최대 플러그인 생태계. 여전히 많은 프로덕션 앱의 표준',
    },
    codeExample: `// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: { filename: 'main.js' },
  module: {
    rules: [{ test: /\\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
};`,
  },
  Rollup: {
    useCases: {
      en: 'Library-focused bundler producing small, tree-shaken ESM/CJS outputs. Powers Vite production builds',
      ko: '라이브러리 중심 번들러. 작고 트리 셰이크된 ESM/CJS 출력. Vite 프로덕션 빌드의 엔진',
    },
    codeExample: `// rollup.config.js
export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.cjs', format: 'cjs' },
    { file: 'dist/index.mjs', format: 'esm' },
  ],
};`,
  },
  Parcel: {
    useCases: {
      en: 'Zero-config bundler. Detects file types and applies transforms automatically; good for prototypes',
      ko: 'Zero-config 번들러. 파일 타입을 감지해 자동 변환. 프로토타입에 적합',
    },
    codeExample: `# package.json scripts
{
  "scripts": {
    "start": "parcel index.html",
    "build": "parcel build index.html"
  }
}`,
  },
  SWC: {
    useCases: {
      en: 'Rust-based TypeScript/JavaScript compiler. Used by Next.js, Parcel, and as a Babel replacement',
      ko: 'Rust 기반 TypeScript/JavaScript 컴파일러. Next.js·Parcel이 사용; Babel 대체재',
    },
    codeExample: `// .swcrc
{
  "jsc": {
    "parser": { "syntax": "typescript", "tsx": true },
    "target": "es2022"
  }
}`,
  },
  Biome: {
    useCases: {
      en: 'Rust-based formatter + linter in one tool. Drop-in replacement for Prettier + ESLint with much faster runs',
      ko: 'Rust 기반 포매터 + 린터 통합 도구. Prettier + ESLint를 훨씬 빠른 속도로 대체',
    },
    codeExample: `# biome.json
{
  "formatter": { "indentStyle": "space", "indentWidth": 2 },
  "linter": { "rules": { "recommended": true } }
}

# CLI
biome check --write .`,
  },
  TypeScript: {
    useCases: {
      en: 'Strongly-typed superset of JavaScript. Compiles to JS; provides editor intelligence, refactoring, and contracts',
      ko: '강타입 JavaScript 슈퍼셋. JS로 컴파일; 에디터 인텔리전스·리팩터링·계약 제공',
    },
    codeExample: `interface User { id: string; name: string; }

function greet(user: User): string {
  return \`Hello, \${user.name}\`;
}

const u: User = { id: '1', name: 'Ada' };
console.log(greet(u));`,
  },
  Zod: {
    useCases: {
      en: 'TypeScript-first schema validation with static type inference. Validate API responses, form input, env vars',
      ko: 'TypeScript-first 스키마 검증, 정적 타입 추론. API 응답·폼 입력·환경 변수 검증',
    },
    codeExample: `import { z } from 'zod';

const User = z.object({
  id: z.string(),
  email: z.string().email(),
  age: z.number().int().min(0),
});

type User = z.infer<typeof User>;
const parsed = User.parse(await fetch('/api/me').then(r => r.json()));`,
  },
  Valibot: {
    useCases: {
      en: 'Modular Zod-like validator with much smaller bundle (tree-shaken). Each schema is a separate function',
      ko: 'Zod 스타일의 모듈형 검증기. 훨씬 작은 번들(트리 셰이킹). 각 스키마가 별도 함수',
    },
    codeExample: `import * as v from 'valibot';

const User = v.object({
  id: v.string(),
  email: v.pipe(v.string(), v.email()),
});

const parsed = v.parse(User, input);`,
  },
  Yup: {
    useCases: {
      en: 'Object schema validator with mature ecosystem. Common with Formik for form validation',
      ko: '성숙한 생태계를 가진 객체 스키마 검증기. Formik과 함께 폼 검증에 자주 사용',
    },
    codeExample: `import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email().required(),
  age: yup.number().min(0).required(),
});

await schema.validate({ email: 'x@y.com', age: 30 });`,
  },
  Vitest: {
    useCases: {
      en: 'Vite-native unit test runner. Jest-compatible API with native ESM/TypeScript, HMR-style watch mode',
      ko: 'Vite 네이티브 유닛 테스트 러너. Jest 호환 API, 네이티브 ESM/TS, HMR 스타일 watch 모드',
    },
    codeExample: `import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('add', () => {
  it('sums two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});`,
  },
  Playwright: {
    useCases: {
      en: 'Cross-browser E2E testing (Chromium, WebKit, Firefox). Auto-wait, trace viewer, network mocking',
      ko: '크로스 브라우저 E2E 테스트(Chromium·WebKit·Firefox). 자동 wait, trace viewer, 네트워크 모킹',
    },
    codeExample: `import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});`,
  },
  Cypress: {
    useCases: {
      en: 'Browser-native E2E testing with time-travel debugging. Runs inside the browser for deep DOM control',
      ko: '브라우저 네이티브 E2E 테스트, time-travel 디버깅. 브라우저 내부 실행으로 DOM 깊은 제어',
    },
    codeExample: `// cypress/e2e/login.cy.ts
describe('login', () => {
  it('redirects to dashboard on success', () => {
    cy.visit('/login');
    cy.get('[name=email]').type('a@b.com');
    cy.get('[name=password]').type('secret');
    cy.contains('Sign in').click();
    cy.url().should('include', '/dashboard');
  });
});`,
  },
  'Testing Library': {
    useCases: {
      en: 'Component testing utilities that query the DOM the way users do (by role, label, text). Framework-agnostic',
      ko: '사용자처럼 DOM을 쿼리하는 컴포넌트 테스팅 유틸(role·label·text). 프레임워크 무관',
    },
    codeExample: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('clicking shows result', async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole('button', { name: /count/i }));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});`,
  },
  Jest: {
    useCases: {
      en: 'Mature test runner with snapshots, mocking, and watch mode. Standard for Node.js and CRA-era React projects',
      ko: '성숙한 테스트 러너. 스냅샷·모킹·watch 모드. Node.js와 CRA 시절 React 프로젝트의 표준',
    },
    codeExample: `import { add } from './math';

test('adds 2 + 3 = 5', () => {
  expect(add(2, 3)).toBe(5);
});

test('snapshot', () => {
  expect({ user: 'Ada' }).toMatchSnapshot();
});`,
  },
  Storybook: {
    useCases: {
      en: 'Component workshop. Develop UI in isolation, document props/states, generate visual regression snapshots',
      ko: '컴포넌트 워크숍. 격리된 UI 개발, props/state 문서화, 비주얼 회귀 스냅샷 생성',
    },
    codeExample: `// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = { component: Button };
export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: { variant: 'primary', children: 'Click' },
};`,
  },

  // ===== Runtime & WASM (3 — others already filled) =====
  Bun: {
    useCases: {
      en: 'All-in-one JavaScript runtime + package manager + bundler. Drop-in for Node.js with much faster startup',
      ko: 'JavaScript 런타임 + 패키지 매니저 + 번들러 통합. 훨씬 빠른 시작 속도로 Node.js drop-in',
    },
    codeExample: `// server.ts — run with: bun server.ts
Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response('Hello from Bun');
  },
});`,
  },
  Deno: {
    useCases: {
      en: 'Secure-by-default JS/TS runtime with URL imports, built-in formatter/linter/test runner, native Web APIs',
      ko: '기본 보안 JS/TS 런타임. URL import, 내장 포매터/린터/테스트, 네이티브 Web API',
    },
    codeExample: `// server.ts — run with: deno run --allow-net server.ts
Deno.serve((req) => new Response('Hello from Deno'));`,
  },
  'Node.js': {
    useCases: {
      en: 'The original JS server runtime. Vast ecosystem (npm), wide hosting support, baseline target for libraries',
      ko: '원조 JS 서버 런타임. 거대한 생태계(npm), 폭넓은 호스팅 지원, 라이브러리의 기본 타겟',
    },
    codeExample: `// server.mjs
import { createServer } from 'node:http';

createServer((req, res) => {
  res.end('Hello from Node');
}).listen(3000);`,
  },

  // ===== State & Data (16) =====
  Zustand: {
    useCases: {
      en: 'Minimal state management for React without context or boilerplate. Stores are hooks',
      ko: 'Context·보일러플레이트 없는 미니멀 React 상태 관리. 스토어가 곧 훅',
    },
    codeExample: `import { create } from 'zustand';

const useCounter = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));

function Counter() {
  const { count, inc } = useCounter();
  return <button onClick={inc}>Count: {count}</button>;
}`,
  },
  'Redux Toolkit': {
    useCases: {
      en: 'Official Redux successor with createSlice + Immer for less boilerplate. Best for complex/large React apps',
      ko: '공식 Redux 후속. createSlice + Immer로 보일러플레이트 감소. 복잡/대형 React 앱에 적합',
    },
    codeExample: `import { createSlice, configureStore } from '@reduxjs/toolkit';

const counter = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: { inc: (s) => { s.value++; } },
});

export const store = configureStore({ reducer: { counter: counter.reducer } });`,
  },
  Jotai: {
    useCases: {
      en: 'Atomic React state. Each atom is a small unit of state; derived atoms compose without selectors',
      ko: '원자 단위 React 상태. 각 atom이 작은 상태 단위, 파생 atom으로 selector 없이 조합',
    },
    codeExample: `import { atom, useAtom } from 'jotai';

const countAtom = atom(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
  },
  MobX: {
    useCases: {
      en: 'Observable state management. Mutate plain objects; components re-render automatically through proxies',
      ko: 'Observable 상태 관리. 평범한 객체를 mutate하면 프록시 통해 컴포넌트가 자동 리렌더',
    },
    codeExample: `import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

class CounterStore {
  count = 0;
  constructor() { makeAutoObservable(this); }
  inc() { this.count++; }
}

const Counter = observer(({ store }) => (
  <button onClick={() => store.inc()}>{store.count}</button>
));`,
  },
  Valtio: {
    useCases: {
      en: 'Proxy-based React state: mutate the state object directly, components subscribed via useSnapshot re-render',
      ko: '프록시 기반 React 상태. 상태 객체를 직접 mutate하면 useSnapshot 구독 컴포넌트가 리렌더',
    },
    codeExample: `import { proxy, useSnapshot } from 'valtio';

const state = proxy({ count: 0 });

function Counter() {
  const snap = useSnapshot(state);
  return <button onClick={() => state.count++}>{snap.count}</button>;
}`,
  },
  XState: {
    useCases: {
      en: 'Finite state machines and statecharts. Model complex flows (auth, checkout) with explicit states/transitions',
      ko: '유한 상태 머신과 statechart. 인증·결제 같은 복잡한 흐름을 명시적 상태/전이로 모델링',
    },
    codeExample: `import { createMachine, createActor } from 'xstate';

const toggle = createMachine({
  id: 'toggle',
  initial: 'off',
  states: {
    off: { on: { TOGGLE: 'on' } },
    on: { on: { TOGGLE: 'off' } },
  },
});

const actor = createActor(toggle).start();
actor.send({ type: 'TOGGLE' });`,
  },
  Pinia: {
    useCases: {
      en: 'Official Vue 3 store with TypeScript support, devtools, and SSR-friendly setup',
      ko: '공식 Vue 3 스토어. TypeScript 지원, devtools, SSR 친화적 설정',
    },
    codeExample: `import { defineStore } from 'pinia';

export const useCounter = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: { inc() { this.count++; } },
});`,
  },
  'TanStack Query': {
    useCases: {
      en: 'Server-state cache for React/Vue/Solid. Handles fetching, caching, sync, retry, refetch on window focus',
      ko: 'React/Vue/Solid의 서버 상태 캐시. fetch·캐시·동기화·재시도·focus 시 refetch 처리',
    },
    codeExample: `import { useQuery } from '@tanstack/react-query';

function Profile({ id }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetch(\`/api/users/\${id}\`).then(r => r.json()),
  });
  if (isLoading) return 'Loading...';
  return <p>{data.name}</p>;
}`,
  },
  SWR: {
    useCases: {
      en: 'Stale-while-revalidate React data fetching. Smaller than TanStack Query; built by Vercel for Next.js',
      ko: 'Stale-while-revalidate React 데이터 페칭. TanStack Query보다 작음. Vercel의 Next.js용',
    },
    codeExample: `import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

function Profile({ id }) {
  const { data, error } = useSWR(\`/api/users/\${id}\`, fetcher);
  if (error) return 'Error';
  if (!data) return 'Loading...';
  return <p>{data.name}</p>;
}`,
  },
  'Apollo Client': {
    useCases: {
      en: 'Full-featured GraphQL client for React/Vue/Angular. Normalized cache, optimistic UI, subscriptions',
      ko: 'React/Vue/Angular의 풀 기능 GraphQL 클라이언트. 정규화 캐시·optimistic UI·구독',
    },
    codeExample: `import { gql, useQuery } from '@apollo/client';

const ME = gql\`query Me { me { id name } }\`;

function Profile() {
  const { data, loading } = useQuery(ME);
  if (loading) return 'Loading...';
  return <p>{data.me.name}</p>;
}`,
  },
  tRPC: {
    useCases: {
      en: 'End-to-end type-safe RPC for TypeScript backends + clients. No REST/GraphQL ceremony, no codegen',
      ko: 'TypeScript 백엔드·클라이언트 종단간 타입 안전 RPC. REST/GraphQL 의식·codegen 불필요',
    },
    codeExample: `// server
export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => \`Hello \${input.name}\`),
});

// client (fully typed)
const greeting = await trpc.hello.query({ name: 'Ada' });`,
  },
  Axios: {
    useCases: {
      en: 'Promise-based HTTP client with interceptors, request/response transforms, and broad browser support',
      ko: '프로미스 기반 HTTP 클라이언트. interceptor, 요청/응답 변환, 폭넓은 브라우저 지원',
    },
    codeExample: `import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 5000 });
api.interceptors.request.use((c) => {
  c.headers.Authorization = \`Bearer \${getToken()}\`;
  return c;
});

const { data } = await api.get('/users/me');`,
  },
  'React Hook Form': {
    useCases: {
      en: 'Performant React forms with minimal re-renders. Uncontrolled inputs + ref-based validation',
      ko: '리렌더 최소화 React 폼. 비제어 인풋 + ref 기반 검증',
    },
    codeExample: `import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit } = useForm();
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register('email', { required: true })} />
      <button type="submit">Sign in</button>
    </form>
  );
}`,
  },
  'TanStack Form': {
    useCases: {
      en: 'Headless form library with first-class TypeScript inference and framework adapters (React, Vue, Solid, Lit)',
      ko: '헤드리스 폼 라이브러리. 일급 TypeScript 추론, 프레임워크 어댑터(React·Vue·Solid·Lit)',
    },
    codeExample: `import { useForm } from '@tanstack/react-form';

function MyForm() {
  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: ({ value }) => console.log(value),
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.Field name="email">{(f) => <input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}</form.Field>
    </form>
  );
}`,
  },
  Formik: {
    useCases: {
      en: 'Mature React form library. Controlled inputs + Yup validation. Best for moderate-sized forms',
      ko: '성숙한 React 폼 라이브러리. 제어 인풋 + Yup 검증. 중간 크기 폼에 적합',
    },
    codeExample: `import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

<Formik
  initialValues={{ email: '' }}
  validationSchema={yup.object({ email: yup.string().email().required() })}
  onSubmit={(values) => console.log(values)}
>
  <Form><Field name="email" /></Form>
</Formik>`,
  },
  'React Final Form': {
    useCases: {
      en: 'Subscription-based React form library. Field-level subscriptions for minimal re-renders, no extra deps',
      ko: '구독 기반 React 폼 라이브러리. 필드 단위 구독으로 리렌더 최소화, 외부 의존성 없음',
    },
    codeExample: `import { Form, Field } from 'react-final-form';

<Form
  onSubmit={(values) => console.log(values)}
  render={({ handleSubmit }) => (
    <form onSubmit={handleSubmit}>
      <Field name="email" component="input" />
      <button type="submit">Submit</button>
    </form>
  )}
/>`,
  },

  // ===== UI & Styling (22) =====
  'Tailwind CSS': {
    useCases: {
      en: 'Utility-first CSS framework. Compose layouts with class names directly in HTML/JSX',
      ko: 'Utility-first CSS 프레임워크. 클래스명을 HTML/JSX에 직접 조합해 레이아웃 구성',
    },
    codeExample: `<button class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
  Click me
</button>`,
  },
  UnoCSS: {
    useCases: {
      en: 'On-demand atomic CSS engine. Faster than Tailwind with preset-based extensibility',
      ko: '온디맨드 atomic CSS 엔진. Tailwind보다 빠르며 preset 기반 확장',
    },
    codeExample: `// uno.config.ts
import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  presets: [presetUno()],
  shortcuts: { 'btn-primary': 'px-4 py-2 bg-blue-500 text-white rounded' },
});`,
  },
  'Panda CSS': {
    useCases: {
      en: 'Type-safe CSS-in-JS at build time. Generates atomic CSS with design tokens and recipes',
      ko: '빌드 타임 타입 안전 CSS-in-JS. 디자인 토큰과 recipe로 atomic CSS 생성',
    },
    codeExample: `import { css } from 'styled-system/css';

<button className={css({ px: 4, py: 2, bg: 'blue.500', color: 'white', rounded: 'lg' })}>
  Click
</button>`,
  },
  'styled-components': {
    useCases: {
      en: 'CSS-in-JS with tagged template literals. Co-locate styles with components, theming via context',
      ko: '태그 템플릿 리터럴 기반 CSS-in-JS. 스타일을 컴포넌트와 공존, context 기반 theming',
    },
    codeExample: `import styled from 'styled-components';

const Button = styled.button\`
  padding: 8px 16px;
  background: \${(p) => p.theme.primary};
  color: white;
\`;`,
  },
  Emotion: {
    useCases: {
      en: 'CSS-in-JS with both string-template and object styles. Smaller runtime than styled-components',
      ko: '문자열 템플릿 + 객체 스타일 둘 다 지원하는 CSS-in-JS. styled-components보다 작은 런타임',
    },
    codeExample: `import { css } from '@emotion/react';

<button
  css={css\`
    padding: 8px 16px;
    background: blue;
    color: white;
  \`}
>Click</button>`,
  },
  Sass: {
    useCases: {
      en: 'Mature CSS preprocessor with variables, nesting, mixins, and modules. Compiles to CSS at build time',
      ko: '성숙한 CSS 전처리기. 변수·중첩·믹스인·모듈. 빌드 시 CSS로 컴파일',
    },
    codeExample: `// styles.scss
$primary: #3b82f6;

.btn {
  padding: 8px 16px;
  background: $primary;
  &:hover { opacity: 0.9; }
}`,
  },
  PostCSS: {
    useCases: {
      en: 'CSS transformer toolkit. Plugin-based pipeline; powers autoprefixer, Tailwind, custom syntax processors',
      ko: 'CSS 변환 툴킷. 플러그인 파이프라인. autoprefixer·Tailwind·커스텀 신택스 처리기의 엔진',
    },
    codeExample: `// postcss.config.mjs
export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
  },
};`,
  },
  'Vanilla Extract': {
    useCases: {
      en: 'Zero-runtime CSS-in-TS. Write styles in TypeScript files that compile to plain CSS at build time',
      ko: '0 런타임 CSS-in-TS. TypeScript 파일에 작성한 스타일이 빌드 시 plain CSS로 컴파일',
    },
    codeExample: `// button.css.ts
import { style } from '@vanilla-extract/css';

export const button = style({
  padding: '8px 16px',
  background: 'blue',
  color: 'white',
});`,
  },
  StyleX: {
    useCases: {
      en: "Meta's atomic CSS-in-JS with deterministic conflict resolution. Each declaration becomes a single atomic class",
      ko: 'Meta의 atomic CSS-in-JS. 결정론적 충돌 해결. 각 선언이 atomic 클래스 하나',
    },
    codeExample: `import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  button: { padding: '8px 16px', backgroundColor: 'blue', color: 'white' },
});

<button {...stylex.props(styles.button)}>Click</button>`,
  },
  'Radix UI': {
    useCases: {
      en: 'Unstyled, accessible primitives (Dialog, Dropdown, etc). Bring-your-own styles; battle-tested a11y',
      ko: '스타일 없는 접근성 primitive(Dialog·Dropdown 등). 자신의 스타일 적용, 검증된 a11y',
    },
    codeExample: `import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="overlay" />
    <Dialog.Content className="content">
      <Dialog.Title>Hello</Dialog.Title>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`,
  },
  'shadcn/ui': {
    useCases: {
      en: 'Copy-paste React components built on Radix + Tailwind. Not an npm package; you own the source',
      ko: 'Radix + Tailwind 기반 복사-붙여넣기 React 컴포넌트. npm 패키지가 아니라 소스를 직접 소유',
    },
    codeExample: `# CLI: copy components into your project
npx shadcn@latest add button dialog

# Usage
import { Button } from '@/components/ui/button';
<Button variant="outline">Click</Button>`,
  },
  'React Aria': {
    useCases: {
      en: "Adobe's a11y hooks for React. Build custom components with WAI-ARIA, keyboard, and i18n built-in",
      ko: 'Adobe의 React용 접근성 훅. WAI-ARIA·키보드·i18n 내장 커스텀 컴포넌트',
    },
    codeExample: `import { useButton } from 'react-aria';
import { useRef } from 'react';

function MyButton(props) {
  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);
  return <button {...buttonProps} ref={ref}>{props.children}</button>;
}`,
  },
  'Headless UI': {
    useCases: {
      en: 'Unstyled, accessible React/Vue components from Tailwind team. Pairs well with Tailwind CSS classes',
      ko: 'Tailwind 팀의 스타일 없는 접근성 React/Vue 컴포넌트. Tailwind 클래스와 잘 어울림',
    },
    codeExample: `import { Dialog } from '@headlessui/react';
import { useState } from 'react';

function MyDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Dialog.Panel><Dialog.Title>Hello</Dialog.Title></Dialog.Panel>
    </Dialog>
  );
}`,
  },
  Mantine: {
    useCases: {
      en: 'Feature-rich React component library: 100+ components, hooks, form, notifications. Good defaults',
      ko: '풍부한 React 컴포넌트 라이브러리: 100+ 컴포넌트·훅·폼·알림. 좋은 기본값',
    },
    codeExample: `import { Button, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export default function App() {
  return (
    <MantineProvider>
      <Button variant="filled">Click</Button>
    </MantineProvider>
  );
}`,
  },
  'Chakra UI': {
    useCases: {
      en: 'Style-prop based React components with strong a11y. Compose via props (p={4}, bg="blue.500")',
      ko: '스타일 prop 기반 React 컴포넌트, 강한 접근성. props로 조합(p={4}, bg="blue.500")',
    },
    codeExample: `import { ChakraProvider, Button } from '@chakra-ui/react';

export default function App() {
  return (
    <ChakraProvider>
      <Button colorScheme="blue" px={6} py={3}>Click</Button>
    </ChakraProvider>
  );
}`,
  },
  'Ant Design': {
    useCases: {
      en: 'Enterprise React component library from Alibaba. Comprehensive (tables, forms, charts) with Chinese-first DX',
      ko: '알리바바의 엔터프라이즈 React 컴포넌트 라이브러리. 종합적(테이블·폼·차트), 중국어 우선 DX',
    },
    codeExample: `import { Button, DatePicker, Form } from 'antd';

<Form>
  <Form.Item label="Date" name="date">
    <DatePicker />
  </Form.Item>
  <Button type="primary" htmlType="submit">Submit</Button>
</Form>`,
  },
  'Material-UI': {
    useCases: {
      en: 'React implementation of Google Material Design. Huge component set, theming, sx prop styling',
      ko: 'Google Material Design의 React 구현. 거대한 컴포넌트셋, theming, sx prop 스타일링',
    },
    codeExample: `import { Button, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({ palette: { primary: { main: '#1976d2' } } });

<ThemeProvider theme={theme}>
  <Button variant="contained" sx={{ px: 4, py: 1.5 }}>Click</Button>
</ThemeProvider>`,
  },
  daisyUI: {
    useCases: {
      en: 'Tailwind CSS component plugin. Adds semantic class names (btn, card) on top of Tailwind utilities',
      ko: 'Tailwind CSS 컴포넌트 플러그인. utility 위에 의미적 클래스(btn·card 등) 추가',
    },
    codeExample: `<!-- After installing daisyui plugin in tailwind.config -->
<button class="btn btn-primary">Click</button>
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">Hello</div>
</div>`,
  },
  'Park UI': {
    useCases: {
      en: 'Component recipes for Ark UI (Radix-style headless) + Panda CSS / Tailwind. Customizable design system base',
      ko: 'Ark UI(Radix 스타일 헤드리스) + Panda CSS/Tailwind 컴포넌트 recipe. 커스터마이징 가능한 디자인 시스템 베이스',
    },
    codeExample: `# CLI: install components into your project
npx @park-ui/cli components add button

# Usage with Panda CSS
import { Button } from '~/components/ui/button';
<Button variant="solid">Click</Button>`,
  },
  'React Spring': {
    useCases: {
      en: 'Spring-physics animation library for React. Smooth, interruptible animations driven by spring configs',
      ko: 'React용 스프링 물리 애니메이션 라이브러리. 스프링 설정 기반 부드럽고 중단 가능한 애니메이션',
    },
    codeExample: `import { useSpring, animated } from '@react-spring/web';

function Box() {
  const styles = useSpring({ from: { x: 0 }, to: { x: 100 } });
  return <animated.div style={styles}>Slide</animated.div>;
}`,
  },
  'Auto Animate': {
    useCases: {
      en: 'Zero-config animation for list/element changes. Add one directive and any add/remove gets animated',
      ko: '리스트·요소 변경의 zero-config 애니메이션. 디렉티브 하나만으로 추가/제거 시 자동 애니메이션',
    },
    codeExample: `import { useAutoAnimate } from '@formkit/auto-animate/react';

function Todos({ items }) {
  const [parent] = useAutoAnimate();
  return <ul ref={parent}>{items.map((t) => <li key={t}>{t}</li>)}</ul>;
}`,
  },
  Motion: {
    useCases: {
      en: 'Formerly Framer Motion. Declarative animations for React with layout, drag, gestures, and SVG support',
      ko: '구 Framer Motion. React용 선언적 애니메이션. 레이아웃·드래그·제스처·SVG 지원',
    },
    codeExample: `import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  Fade in
</motion.div>`,
  },
};
