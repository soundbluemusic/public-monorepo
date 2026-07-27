import type { LibraryEnrichment } from '../library-enrichment-types';

export const appFrameworkEnrichment: Record<string, LibraryEnrichment> = {
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
    codeExample: `// app/posts/[slug]/page.tsx — Next.js 15+ async params
export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
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
// Astro 5+ uses import.meta.glob (Astro.glob was deprecated).
const modules = import.meta.glob<{ frontmatter: { title: string } }>(
  './posts/*.md',
  { eager: true },
);
const posts = Object.entries(modules).map(([path, mod]) => ({ path, ...mod }));
---
<ul>
  {posts.map((p) => <li><a href={p.path}>{p.frontmatter.title}</a></li>)}
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
      ko: '반응형 프로퍼티 + 선언적 템플릿이 있는 Web Components 베이스 클래스. 어떤 프레임워크에서도 사용 가능하며, 프레임워크 없이도 동작',
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
};
