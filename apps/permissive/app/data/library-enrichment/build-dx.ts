import type { LibraryEnrichment } from '../library-enrichment-types';

export const buildDxEnrichment: Record<string, LibraryEnrichment> = {
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
      ko: 'Rust 기반 Webpack 호환 번들러. 기존 Webpack 설정을 그대로 교체 가능하며 빌드 속도 5~10배 향상',
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
      ko: 'Go 기반 번들러/minifier. JS 기반 도구 대비 10~100배 빠름. Vite·tsx 등이 내부적으로 사용',
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
      ko: 'JavaScript의 강타입 슈퍼셋. JS로 컴파일되며, 에디터 자동완성·리팩터링·타입 기반 계약을 제공',
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
};
