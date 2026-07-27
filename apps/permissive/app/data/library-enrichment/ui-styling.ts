import type { LibraryEnrichment } from '../library-enrichment-types';

export const uiStylingEnrichment: Record<string, LibraryEnrichment> = {
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
    codeExample: `import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';

function MyDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogPanel>
        <DialogTitle>Hello</DialogTitle>
      </DialogPanel>
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
      en: 'Style-prop based React components with strong a11y. v3 uses colorPalette tokens (e.g., "blue")',
      ko: '스타일 prop 기반 React 컴포넌트, 강한 접근성. v3는 colorPalette 토큰 사용(예: "blue")',
    },
    codeExample: `import { Button } from '@chakra-ui/react';
// v3: wrap with <Provider> generated by chakra CLI snippets.
import { Provider } from './components/ui/provider';

export default function App() {
  return (
    <Provider>
      <Button colorPalette="blue" px={6} py={3}>
        Click
      </Button>
    </Provider>
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
    codeExample: `# CLI: install a component into your project
npx @park-ui/cli add button

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
