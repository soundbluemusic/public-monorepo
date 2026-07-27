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

import type { LibraryEnrichment } from './library-enrichment-types';
import { uiStylingEnrichment } from './library-enrichment/ui-styling';
import { appFrameworkEnrichment } from './library-enrichment/app-frameworks';
import { buildDxEnrichment } from './library-enrichment/build-dx';
import { stateDataEnrichment } from './library-enrichment/state-data';
import { visualsGraphicsEnrichment } from './library-enrichment/visuals-graphics';
import { dataSecurityEnrichment } from './library-enrichment/data-security';
import { runtimeWasmEnrichment } from './library-enrichment/runtime-wasm';
import { aiVisionEnrichment } from './library-enrichment/ai-vision';
import { mediaDocumentsEnrichment } from './library-enrichment/media-documents';
import { mathScienceEnrichment } from './library-enrichment/math-science';

export type { LibraryEnrichment } from './library-enrichment-types';

/**
 * key: Library.name (정확히 일치해야 함).
 * libraries.ts의 라이브러리 객체에 자동 merge됨.
 */
export const libraryEnrichment: Record<string, LibraryEnrichment> = {
  ...uiStylingEnrichment,
  ...appFrameworkEnrichment,
  ...buildDxEnrichment,
  ...stateDataEnrichment,
  ...visualsGraphicsEnrichment,
  ...dataSecurityEnrichment,
  ...runtimeWasmEnrichment,
  ...aiVisionEnrichment,
  ...mediaDocumentsEnrichment,
  ...mathScienceEnrichment,
};
