import type { LibraryEnrichment } from '../library-enrichment-types';

export const stateDataEnrichment: Record<string, LibraryEnrichment> = {
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
};
