/**
 * Open Source Credits
 * 이 프로젝트에서 사용된 오픈소스 목록
 */

export interface OpenSourceProject {
  name: string;
  url: string;
  license: string;
  description: {
    en: string;
    ko: string;
  };
  category: OpenSourceCategory;
}

export type OpenSourceCategory =
  | 'framework'
  | 'build'
  | 'styling'
  | 'ui'
  | 'state'
  | 'data'
  | 'testing'
  | 'i18n'
  | 'animation'
  | 'utility';

export const OPEN_SOURCE_CATEGORIES: Record<OpenSourceCategory, { en: string; ko: string }> = {
  framework: { en: 'Framework', ko: '프레임워크' },
  build: { en: 'Build Tools', ko: '빌드 도구' },
  styling: { en: 'Styling', ko: '스타일링' },
  ui: { en: 'UI Components', ko: 'UI 컴포넌트' },
  state: { en: 'State Management', ko: '상태 관리' },
  data: { en: 'Data & Validation', ko: '데이터 & 검증' },
  testing: { en: 'Testing', ko: '테스팅' },
  i18n: { en: 'Internationalization', ko: '다국어' },
  animation: { en: 'Animation', ko: '애니메이션' },
  utility: { en: 'Utilities', ko: '유틸리티' },
};

export const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  // Framework
  {
    name: 'React',
    url: 'https://react.dev',
    license: 'MIT',
    description: {
      en: 'A JavaScript library for building user interfaces',
      ko: '사용자 인터페이스 구축을 위한 JavaScript 라이브러리',
    },
    category: 'framework',
  },
  {
    name: 'React Router',
    url: 'https://reactrouter.com',
    license: 'MIT',
    description: {
      en: 'Declarative routing for React with SSG support',
      ko: 'SSG를 지원하는 React 선언적 라우팅',
    },
    category: 'framework',
  },

  // Build Tools
  {
    name: 'Vite',
    url: 'https://vite.dev',
    license: 'MIT',
    description: {
      en: 'Next generation frontend tooling',
      ko: '차세대 프론트엔드 빌드 도구',
    },
    category: 'build',
  },
  {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org',
    license: 'Apache-2.0',
    description: {
      en: 'Typed superset of JavaScript',
      ko: 'JavaScript의 타입 확장 언어',
    },
    category: 'build',
  },
  {
    name: 'Biome',
    url: 'https://biomejs.dev',
    license: 'MIT',
    description: {
      en: 'Fast formatter and linter for web projects',
      ko: '웹 프로젝트를 위한 빠른 포매터/린터',
    },
    category: 'build',
  },
  {
    name: 'Turbo',
    url: 'https://turbo.build',
    license: 'MIT',
    description: {
      en: 'High-performance build system for monorepos',
      ko: '모노레포를 위한 고성능 빌드 시스템',
    },
    category: 'build',
  },
  {
    name: 'pnpm',
    url: 'https://pnpm.io',
    license: 'MIT',
    description: {
      en: 'Fast, disk space efficient package manager',
      ko: '빠르고 디스크 효율적인 패키지 매니저',
    },
    category: 'build',
  },

  // Styling
  {
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    license: 'MIT',
    description: {
      en: 'Utility-first CSS framework',
      ko: '유틸리티 우선 CSS 프레임워크',
    },
    category: 'styling',
  },
  {
    name: 'tailwind-merge',
    url: 'https://github.com/dcastil/tailwind-merge',
    license: 'MIT',
    description: {
      en: 'Merge Tailwind CSS classes without conflicts',
      ko: 'Tailwind CSS 클래스 충돌 없이 병합',
    },
    category: 'styling',
  },
  {
    name: 'class-variance-authority',
    url: 'https://cva.style',
    license: 'Apache-2.0',
    description: {
      en: 'CSS-in-TS variant API for component styling',
      ko: '컴포넌트 스타일링을 위한 variant API',
    },
    category: 'styling',
  },

  // UI Components
  {
    name: 'Radix UI',
    url: 'https://radix-ui.com',
    license: 'MIT',
    description: {
      en: 'Unstyled, accessible UI primitives',
      ko: '스타일 없는 접근성 UI 프리미티브',
    },
    category: 'ui',
  },
  {
    name: 'Lucide React',
    url: 'https://lucide.dev',
    license: 'ISC',
    description: {
      en: 'Beautiful & consistent icon toolkit',
      ko: '아름답고 일관된 아이콘 툴킷',
    },
    category: 'ui',
  },

  // State Management
  {
    name: 'Zustand',
    url: 'https://zustand-demo.pmnd.rs',
    license: 'MIT',
    description: {
      en: 'Small, fast state management solution',
      ko: '작고 빠른 상태 관리 솔루션',
    },
    category: 'state',
  },
  {
    name: 'Immer',
    url: 'https://immerjs.github.io/immer',
    license: 'MIT',
    description: {
      en: 'Immutable state with a mutable API',
      ko: '뮤터블 API로 불변 상태 관리',
    },
    category: 'state',
  },
  {
    name: 'Dexie.js',
    url: 'https://dexie.org',
    license: 'Apache-2.0',
    description: {
      en: 'Minimalistic IndexedDB wrapper',
      ko: '미니멀한 IndexedDB 래퍼',
    },
    category: 'state',
  },

  // Data & Validation
  {
    name: 'Zod',
    url: 'https://zod.dev',
    license: 'MIT',
    description: {
      en: 'TypeScript-first schema validation',
      ko: 'TypeScript 우선 스키마 검증',
    },
    category: 'data',
  },
  {
    name: 'React Hook Form',
    url: 'https://react-hook-form.com',
    license: 'MIT',
    description: {
      en: 'Performant form validation library',
      ko: '고성능 폼 검증 라이브러리',
    },
    category: 'data',
  },
  {
    name: 'MiniSearch',
    url: 'https://lucaong.github.io/minisearch',
    license: 'MIT',
    description: {
      en: 'Tiny full-text search engine',
      ko: '작은 전문 검색 엔진',
    },
    category: 'data',
  },

  // Testing
  {
    name: 'Vitest',
    url: 'https://vitest.dev',
    license: 'MIT',
    description: {
      en: 'Blazing fast unit testing framework',
      ko: '초고속 단위 테스트 프레임워크',
    },
    category: 'testing',
  },
  {
    name: 'Playwright',
    url: 'https://playwright.dev',
    license: 'Apache-2.0',
    description: {
      en: 'Reliable end-to-end testing for web apps',
      ko: '웹앱을 위한 신뢰할 수 있는 E2E 테스팅',
    },
    category: 'testing',
  },
  {
    name: 'Testing Library',
    url: 'https://testing-library.com',
    license: 'MIT',
    description: {
      en: 'Simple and complete testing utilities',
      ko: '간단하고 완전한 테스팅 유틸리티',
    },
    category: 'testing',
  },

  // Internationalization
  {
    name: 'Paraglide',
    url: 'https://inlang.com/m/gerre34r/paraglide-js',
    license: 'Apache-2.0',
    description: {
      en: 'Compile-time i18n library',
      ko: '컴파일 타임 i18n 라이브러리',
    },
    category: 'i18n',
  },

  // Animation
  {
    name: 'Framer Motion',
    url: 'https://motion.dev',
    license: 'MIT',
    description: {
      en: 'Production-ready motion library for React',
      ko: 'React를 위한 프로덕션 레벨 모션 라이브러리',
    },
    category: 'animation',
  },
  {
    name: 'AutoAnimate',
    url: 'https://auto-animate.formkit.com',
    license: 'MIT',
    description: {
      en: 'Zero-config animation utility',
      ko: '설정 없는 애니메이션 유틸리티',
    },
    category: 'animation',
  },

  // Utilities
  {
    name: 'nanoid',
    url: 'https://github.com/ai/nanoid',
    license: 'MIT',
    description: {
      en: 'Tiny, secure URL-friendly unique ID generator',
      ko: '작고 안전한 URL 친화적 ID 생성기',
    },
    category: 'utility',
  },
  {
    name: 'clsx',
    url: 'https://github.com/lukeed/clsx',
    license: 'MIT',
    description: {
      en: 'Tiny utility for constructing className strings',
      ko: 'className 문자열 구성을 위한 작은 유틸리티',
    },
    category: 'utility',
  },
  {
    name: 'D3.js',
    url: 'https://d3js.org',
    license: 'ISC',
    description: {
      en: 'Data visualization library',
      ko: '데이터 시각화 라이브러리',
    },
    category: 'utility',
  },
];

/**
 * 카테고리별로 그룹화된 오픈소스 목록
 */
export function getOpenSourceByCategory(): Map<OpenSourceCategory, OpenSourceProject[]> {
  const grouped = new Map<OpenSourceCategory, OpenSourceProject[]>();

  for (const project of OPEN_SOURCE_PROJECTS) {
    const existing = grouped.get(project.category) ?? [];
    existing.push(project);
    grouped.set(project.category, existing);
  }

  return grouped;
}

/**
 * 카테고리 순서대로 정렬된 배열 반환
 */
export function getOpenSourceGrouped(): Array<{
  category: OpenSourceCategory;
  label: { en: string; ko: string };
  projects: OpenSourceProject[];
}> {
  const categoryOrder: OpenSourceCategory[] = [
    'framework',
    'build',
    'styling',
    'ui',
    'state',
    'data',
    'testing',
    'i18n',
    'animation',
    'utility',
  ];

  const grouped = getOpenSourceByCategory();

  return categoryOrder
    .filter((cat) => grouped.has(cat))
    .map((category) => ({
      category,
      label: OPEN_SOURCE_CATEGORIES[category],
      projects: grouped.get(category) ?? [],
    }));
}
