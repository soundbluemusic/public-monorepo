import { libraryEnrichment } from './library-enrichment';
import type { CategoryMeta, Library } from './library-types';
import { aiVisionLibraries } from './libraries/ai-vision';
import { appFrameworkLibraries } from './libraries/app-frameworks';
import { buildDxLibraries } from './libraries/build-dx';
import { dataSecurityLibraries } from './libraries/data-security';
import { libraryOrder } from './libraries/library-order';
import { mathScienceLibraries } from './libraries/math-science';
import { mediaDocumentsLibraries } from './libraries/media-documents';
import { runtimeWasmLibraries } from './libraries/runtime-wasm';
import { stateDataLibraries } from './libraries/state-data';
import { uiStylingLibraries } from './libraries/ui-styling';
import { visualsGraphicsLibraries } from './libraries/visuals-graphics';

export type { CategoryMeta, Library } from './library-types';

/**
 * Raw 라이브러리 배열. `library-enrichment.ts`의 useCases/codeExample이
 * 파일 끝에서 자동 merge되어 최종 `libraries` export로 노출됩니다.
 */
const RAW_LIBRARIES: Library[] = (() => {
  const libraryByName = new Map(
    [
      ...uiStylingLibraries,
      ...appFrameworkLibraries,
      ...buildDxLibraries,
      ...stateDataLibraries,
      ...visualsGraphicsLibraries,
      ...dataSecurityLibraries,
      ...runtimeWasmLibraries,
      ...aiVisionLibraries,
      ...mediaDocumentsLibraries,
      ...mathScienceLibraries,
    ].map((library) => [library.name, library]),
  );
  return libraryOrder.map((name) => {
    const library = libraryByName.get(name);
    if (!library) throw new Error(`Missing library data: ${name}`);
    return library;
  });
})();

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
