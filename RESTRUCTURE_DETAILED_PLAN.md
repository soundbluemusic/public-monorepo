# Soundblue Monorepo 재설계 - 세부 실행 계획

---

## Phase 1: 데이터 분리 및 표준화

### 1.1 Zod 스키마 패키지 생성
- [ ] `packages/data/` 폴더 생성
- [ ] `packages/data/package.json` 생성 (name: @soundblue/data)
- [ ] `packages/data/tsconfig.json` 생성
- [ ] `packages/data/src/index.ts` 생성

### 1.2 Context 스키마 정의
- [ ] `packages/data/src/schemas/context/entry.ts` - Entry 스키마
- [ ] `packages/data/src/schemas/context/example.ts` - Example 스키마
- [ ] `packages/data/src/schemas/context/category.ts` - Category 스키마
- [ ] `packages/data/src/schemas/context/conversation.ts` - Conversation 스키마
- [ ] `packages/data/src/schemas/context/index.ts` - 통합 export

### 1.3 Roots 스키마 정의
- [ ] `packages/data/src/schemas/roots/concept.ts` - MathConcept 스키마
- [ ] `packages/data/src/schemas/roots/field.ts` - Field 스키마
- [ ] `packages/data/src/schemas/roots/subfield.ts` - Subfield 스키마
- [ ] `packages/data/src/schemas/roots/formula.ts` - Formula 스키마
- [ ] `packages/data/src/schemas/roots/index.ts` - 통합 export

### 1.4 Permissive 스키마 정의
- [ ] `packages/data/src/schemas/permissive/library.ts` - Library 스키마
- [ ] `packages/data/src/schemas/permissive/web-api.ts` - WebAPI 스키마
- [ ] `packages/data/src/schemas/permissive/index.ts` - 통합 export

### 1.5 데이터 폴더 구조 생성
- [ ] `data/` 루트 폴더 생성
- [ ] `data/context/entries/` 폴더 생성
- [ ] `data/context/categories.json` 생성
- [ ] `data/context/conversations.json` 생성
- [ ] `data/roots/concepts/` 폴더 생성
- [ ] `data/roots/fields.json` 생성
- [ ] `data/roots/subfields.json` 생성
- [ ] `data/permissive/libraries.json` 생성
- [ ] `data/permissive/web-apis.json` 생성

### 1.6 Context 데이터 이동
- [ ] `apps/context/app/data/entries/*.json` → `data/context/entries/` (21개 파일)
- [ ] `apps/context/app/data/conversations.ts` → `data/context/conversations.json` 변환
- [ ] 카테고리 메타데이터 추출 → `data/context/categories.json`

### 1.7 Roots 데이터 변환 (TS → JSON)
- [ ] 변환 스크립트 작성: `scripts/migrate/convert-roots-data.ts`
- [ ] `apps/roots/app/data/concepts/algebra.ts` → `data/roots/concepts/algebra.json`
- [ ] `apps/roots/app/data/concepts/analysis.ts` → `data/roots/concepts/analysis.json`
- [ ] `apps/roots/app/data/concepts/geometry.ts` → `data/roots/concepts/geometry.json`
- [ ] ... (나머지 48개 파일 변환)
- [ ] `apps/roots/app/data/subfields.ts` → `data/roots/subfields.json`
- [ ] `apps/roots/app/data/types.ts` → Zod 스키마로 대체

### 1.8 Permissive 데이터 변환 (TS → JSON)
- [ ] `apps/permissive/app/data/libraries.ts` → `data/permissive/libraries.json`
- [ ] `apps/permissive/app/data/web-apis.ts` → `data/permissive/web-apis.json`

### 1.9 타입 자동 생성 시스템
- [ ] `scripts/generators/generate-types.ts` 작성
- [ ] zod-to-ts 또는 직접 추론으로 타입 생성
- [ ] `packages/data/src/generated/types.ts` 출력 설정
- [ ] prebuild 스크립트에 타입 생성 추가

### 1.10 데이터 로더 구현
- [ ] `packages/data/src/loaders/json-loader.ts` - JSON 로드 유틸
- [ ] `packages/data/src/loaders/context-loader.ts` - Context 데이터 로더
- [ ] `packages/data/src/loaders/roots-loader.ts` - Roots 데이터 로더
- [ ] `packages/data/src/loaders/permissive-loader.ts` - Permissive 데이터 로더
- [ ] `packages/data/src/loaders/index.ts` - 통합 export

### 1.11 데이터 검증 파이프라인
- [ ] `scripts/prebuild/validate-data.ts` - 모든 JSON 검증
- [ ] Context 엔트리 검증 (751개)
- [ ] Roots 개념 검증 (414개)
- [ ] Permissive 라이브러리/API 검증
- [ ] 검증 실패 시 빌드 중단 로직

### 1.12 기존 앱 import 경로 업데이트 (Phase 1)
- [ ] Context 앱: data import를 @soundblue/data로 변경
- [ ] Roots 앱: data import를 @soundblue/data로 변경
- [ ] Permissive 앱: data import를 @soundblue/data로 변경
- [ ] 빌드 테스트 및 검증

---

## Phase 2: Core 패키지 분리

### 2.1 Core 패키지 생성
- [ ] `packages/core/` 폴더 생성
- [ ] `packages/core/package.json` 생성 (name: @soundblue/core)
- [ ] `packages/core/tsconfig.json` 생성
- [ ] `packages/core/src/index.ts` 생성

### 2.2 Utils 모듈 분리
- [ ] `packages/core/src/utils/cn.ts` - clsx + tailwind-merge (shared-react에서 이동)
- [ ] `packages/core/src/utils/debounce.ts` - 디바운스 함수
- [ ] `packages/core/src/utils/throttle.ts` - 쓰로틀 함수
- [ ] `packages/core/src/utils/chunk-array.ts` - 배열 청킹
- [ ] `packages/core/src/utils/index.ts` - 통합 export

### 2.3 Validation 모듈 분리
- [ ] `packages/core/src/validation/limits.ts` - LIMITS 상수 (shared에서 이동)
- [ ] `packages/core/src/validation/breakpoints.ts` - BREAKPOINTS 상수
- [ ] `packages/core/src/validation/reserved.ts` - RESERVED_NAMES
- [ ] `packages/core/src/validation/validators.ts` - validateId, isReservedName 등
- [ ] `packages/core/src/validation/index.ts` - 통합 export

### 2.4 Types 모듈 분리
- [ ] `packages/core/src/types/common.ts` - Language, Theme, Difficulty 등
- [ ] `packages/core/src/types/seo.ts` - SEO 관련 타입
- [ ] `packages/core/src/types/i18n.ts` - i18n 관련 타입
- [ ] `packages/core/src/types/index.ts` - 통합 export

### 2.5 Search 패키지 생성
- [ ] `packages/search/` 폴더 생성
- [ ] `packages/search/package.json` 생성 (name: @soundblue/search)
- [ ] `packages/search/tsconfig.json` 생성

### 2.6 Search Core 모듈
- [ ] `packages/search/src/core/engine.ts` - SearchEngine 클래스 (MiniSearch 래퍼)
- [ ] `packages/search/src/core/types.ts` - SearchableItem, SearchConfig 등
- [ ] `packages/search/src/core/utils.ts` - sanitizeSearchQuery, filterBySearch (shared에서 이동)
- [ ] `packages/search/src/core/index.ts` - 통합 export

### 2.7 Search Worker 모듈
- [ ] `packages/search/src/worker/search.worker.ts` (shared-react에서 이동)
- [ ] `packages/search/src/worker/messages.ts` - Worker 메시지 타입
- [ ] `packages/search/src/worker/index.ts` - 통합 export

### 2.8 Search Adapters
- [ ] `packages/search/src/adapters/context.ts` - Context 검색 어댑터
- [ ] `packages/search/src/adapters/roots.ts` - Roots 검색 어댑터 (app/lib/search.ts 이동)
- [ ] `packages/search/src/adapters/permissive.ts` - Permissive 검색 어댑터
- [ ] `packages/search/src/adapters/index.ts` - 통합 export

### 2.9 Search React 훅
- [ ] `packages/search/src/react/useSearch.ts` - 범용 검색 훅
- [ ] `packages/search/src/react/useSearchWorker.ts` (shared-react에서 이동)
- [ ] `packages/search/src/react/SearchProvider.tsx` - 검색 컨텍스트
- [ ] `packages/search/src/react/index.ts` - 통합 export

### 2.10 i18n 패키지 생성
- [ ] `packages/i18n/` 폴더 생성
- [ ] `packages/i18n/package.json` 생성 (name: @soundblue/i18n)
- [ ] `packages/i18n/tsconfig.json` 생성

### 2.11 i18n Core 모듈
- [ ] `packages/i18n/src/core/config.ts` - SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE
- [ ] `packages/i18n/src/core/types.ts` - Language, LocalizedString 타입
- [ ] `packages/i18n/src/core/index.ts` - 통합 export

### 2.12 i18n Utils 모듈
- [ ] `packages/i18n/src/utils/routing.ts` - getLocaleFromPath, buildLocalePath 등 (shared에서 이동)
- [ ] `packages/i18n/src/utils/detection.ts` - 브라우저 언어 감지
- [ ] `packages/i18n/src/utils/index.ts` - 통합 export

### 2.13 i18n Messages
- [ ] `packages/i18n/src/messages/shared.json` - 공통 UI 라벨
- [ ] `packages/i18n/src/messages/context.json` - Context 전용 라벨
- [ ] `packages/i18n/src/messages/roots.json` - Roots 전용 라벨
- [ ] `packages/i18n/src/messages/permissive.json` - Permissive 전용 라벨
- [ ] `packages/i18n/src/messages/index.ts` - 메시지 로더

### 2.14 i18n React 모듈
- [ ] `packages/i18n/src/react/I18nProvider.tsx` - 통합 Provider (3개 앱 중복 제거)
- [ ] `packages/i18n/src/react/useI18n.ts` - useI18n 훅
- [ ] `packages/i18n/src/react/LanguageContext.tsx` - 컨텍스트
- [ ] `packages/i18n/src/react/index.ts` - 통합 export

### 2.15 Meta 유틸 분리
- [ ] `packages/i18n/src/meta/factory.ts` - metaFactory, dynamicMetaFactory (shared에서 이동)
- [ ] `packages/i18n/src/meta/seo.ts` - generateSEOMeta, generateSchemaOrg (shared-react에서 이동)
- [ ] `packages/i18n/src/meta/index.ts` - 통합 export

### 2.16 기존 shared 패키지 정리
- [ ] @soundblue/shared에서 이동된 코드 제거
- [ ] @soundblue/shared를 @soundblue/core re-export로 변경 (하위 호환)
- [ ] deprecation 경고 추가

### 2.17 앱 import 경로 업데이트 (Phase 2)
- [ ] @soundblue/shared → @soundblue/core 변경
- [ ] 검색 관련 → @soundblue/search 변경
- [ ] i18n 관련 → @soundblue/i18n 변경
- [ ] 빌드 테스트 및 검증

---

## Phase 3: UI/Features 패키지 재구성

### 3.1 UI 패키지 생성
- [ ] `packages/ui/` 폴더 생성
- [ ] `packages/ui/package.json` 생성 (name: @soundblue/ui)
- [ ] `packages/ui/tsconfig.json` 생성
- [ ] `packages/ui/src/index.ts` 생성

### 3.2 Primitives 컴포넌트
- [ ] `packages/ui/src/primitives/Button.tsx` - 기본 버튼
- [ ] `packages/ui/src/primitives/Input.tsx` - 입력 필드
- [ ] `packages/ui/src/primitives/Select.tsx` - 셀렉트 (Context에서 이동)
- [ ] `packages/ui/src/primitives/Skeleton.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/primitives/DarkModeToggle.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/primitives/LanguageToggle.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/primitives/LoadingSpinner.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/primitives/index.ts` - 통합 export

### 3.3 Patterns 컴포넌트
- [ ] `packages/ui/src/patterns/Card.tsx` - 카드 컴포넌트
- [ ] `packages/ui/src/patterns/List.tsx` - 리스트 컴포넌트
- [ ] `packages/ui/src/patterns/SearchBox.tsx` - 검색 박스
- [ ] `packages/ui/src/patterns/SearchDropdown.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/patterns/EntryListItem.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/patterns/ShareButton.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/patterns/Toast.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/patterns/ViewTransitionLink.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/patterns/VirtualList.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/patterns/ProgressBar.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/patterns/index.ts` - 통합 export

### 3.4 Layout 컴포넌트
- [ ] `packages/ui/src/layout/AppShell.tsx` - 앱 쉘 (공통 레이아웃)
- [ ] `packages/ui/src/layout/Header.tsx` - 공통 헤더
- [ ] `packages/ui/src/layout/Footer.tsx` - 공통 푸터
- [ ] `packages/ui/src/layout/Sidebar.tsx` - 공통 사이드바
- [ ] `packages/ui/src/layout/BottomNav.tsx` - 모바일 하단 네비게이션
- [ ] `packages/ui/src/layout/index.ts` - 통합 export

### 3.5 Feedback 컴포넌트
- [ ] `packages/ui/src/feedback/ErrorBoundary.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/feedback/ErrorFallback.tsx` - 에러 폴백 UI
- [ ] `packages/ui/src/feedback/LazyLoad.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/feedback/OfflineIndicator.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/feedback/index.ts` - 통합 export

### 3.6 Motion 컴포넌트
- [ ] `packages/ui/src/motion/FadeIn.tsx` (shared-react에서 이동)
- [ ] `packages/ui/src/motion/SlideIn.tsx` - 슬라이드 애니메이션
- [ ] `packages/ui/src/motion/index.ts` - 통합 export

### 3.7 Features 패키지 생성
- [ ] `packages/features/` 폴더 생성
- [ ] `packages/features/package.json` 생성 (name: @soundblue/features)
- [ ] `packages/features/tsconfig.json` 생성

### 3.8 Favorites 기능 모듈
- [ ] `packages/features/src/favorites/store.ts` - Zustand 스토어
- [ ] `packages/features/src/favorites/hooks.ts` - useFavorites 훅
- [ ] `packages/features/src/favorites/FavoriteButton.tsx` - 즐겨찾기 버튼
- [ ] `packages/features/src/favorites/FavoritesList.tsx` - 즐겨찾기 목록
- [ ] `packages/features/src/favorites/types.ts` - 타입 정의
- [ ] `packages/features/src/favorites/index.ts` - 통합 export

### 3.9 Offline 기능 모듈
- [ ] `packages/features/src/offline/store.ts` - 오프라인 상태 스토어
- [ ] `packages/features/src/offline/hooks.ts` - useOnlineStatus (shared-react에서 이동)
- [ ] `packages/features/src/offline/OfflineBanner.tsx` - 오프라인 배너
- [ ] `packages/features/src/offline/index.ts` - 통합 export

### 3.10 Study Progress 기능 모듈
- [ ] `packages/features/src/study-progress/store.ts` - 학습 진도 스토어
- [ ] `packages/features/src/study-progress/hooks.ts` - useStudyProgress 훅
- [ ] `packages/features/src/study-progress/ProgressCard.tsx` - 진도 카드
- [ ] `packages/features/src/study-progress/ProgressBar.tsx` - 진도 바
- [ ] `packages/features/src/study-progress/types.ts` - 타입 정의
- [ ] `packages/features/src/study-progress/index.ts` - 통합 export

### 3.11 Recent Views 기능 모듈
- [ ] `packages/features/src/recent-views/store.ts` - 최근 본 항목 스토어
- [ ] `packages/features/src/recent-views/hooks.ts` - useRecentViews 훅
- [ ] `packages/features/src/recent-views/RecentList.tsx` - 최근 목록
- [ ] `packages/features/src/recent-views/index.ts` - 통합 export

### 3.12 Settings 기능 모듈
- [ ] `packages/features/src/settings/store.ts` - 설정 스토어 (shared-react에서 이동)
- [ ] `packages/features/src/settings/hooks.ts` - useSettings 훅
- [ ] `packages/features/src/settings/SettingsPanel.tsx` - 설정 패널
- [ ] `packages/features/src/settings/ThemeSelector.tsx` - 테마 선택
- [ ] `packages/features/src/settings/index.ts` - 통합 export

### 3.13 DB 패키지 분리
- [ ] `packages/db/` 폴더 생성
- [ ] `packages/db/package.json` 생성 (name: @soundblue/db)
- [ ] `packages/db/src/core/dexie-setup.ts` - Dexie 초기화
- [ ] `packages/db/src/helpers/favorites.ts` - createFavoritesHelper (shared에서 이동)
- [ ] `packages/db/src/helpers/settings.ts` - createSettingsHelper (shared에서 이동)
- [ ] `packages/db/src/helpers/recent-views.ts` - createRecentViewsHelper (shared에서 이동)
- [ ] `packages/db/src/helpers/study-records.ts` - 학습 기록 헬퍼
- [ ] `packages/db/src/index.ts` - 통합 export

### 3.14 Hooks 패키지 분리
- [ ] `packages/hooks/` 폴더 생성
- [ ] `packages/hooks/package.json` 생성 (name: @soundblue/hooks)
- [ ] `packages/hooks/src/useMediaQuery.ts` (shared-react에서 이동)
- [ ] `packages/hooks/src/useViewTransition.ts` (shared-react에서 이동)
- [ ] `packages/hooks/src/useToast.ts` (shared-react에서 이동)
- [ ] `packages/hooks/src/useAutoAnimate.ts` (shared-react에서 이동)
- [ ] `packages/hooks/src/useDebounce.ts` - 디바운스 훅
- [ ] `packages/hooks/src/useThrottle.ts` - 쓰로틀 훅
- [ ] `packages/hooks/src/useLocalStorage.ts` - 로컬 스토리지 훅
- [ ] `packages/hooks/src/index.ts` - 통합 export

### 3.15 기존 shared-react 패키지 정리
- [ ] @soundblue/shared-react에서 이동된 코드 제거
- [ ] @soundblue/shared-react를 새 패키지들 re-export로 변경 (하위 호환)
- [ ] deprecation 경고 추가

### 3.16 앱 import 경로 업데이트 (Phase 3)
- [ ] 컴포넌트 import → @soundblue/ui 변경
- [ ] 기능 모듈 import → @soundblue/features 변경
- [ ] 훅 import → @soundblue/hooks 변경
- [ ] DB import → @soundblue/db 변경
- [ ] 빌드 테스트 및 검증

### 3.17 앱별 컴포넌트 정리
- [ ] Context: Layout, Header, Footer 등 → @soundblue/ui 사용으로 대체
- [ ] Roots: Layout, Sidebar 등 → @soundblue/ui 사용으로 대체
- [ ] Permissive: DocsLayout 등 → @soundblue/ui 사용으로 대체
- [ ] 앱 전용 컴포넌트만 앱 내부에 유지

---

## Phase 4: 라우트 통합

### 4.1 라우트 로더 패턴 정의
- [ ] `packages/data/src/loaders/createDataLoader.ts` - 범용 데이터 로더 팩토리
- [ ] `packages/data/src/loaders/createStaticPaths.ts` - SSG 경로 생성기
- [ ] `packages/data/src/loaders/types.ts` - LoaderConfig 타입
- [ ] `packages/data/src/loaders/index.ts` - 통합 export

### 4.2 Context 라우트 병합 (27 → 6)
- [ ] `($lang)._index.tsx` 생성 (기존 _index.tsx + ko._index.tsx 병합)
- [ ] `($lang).entry.$entryId.tsx` 생성 (기존 entry.$entryId.tsx + ko.entry.$entryId.tsx 병합)
- [ ] `($lang).category.$categoryId.tsx` 생성
- [ ] `($lang).conversations.tsx` 생성 (conversations 라우트 병합)
- [ ] `($lang).browse.tsx` 생성
- [ ] `($lang).about.tsx` 생성 (about, license, privacy, terms 통합 또는 분리)
- [ ] `$.tsx` 유지 (catch-all)
- [ ] 기존 중복 라우트 파일 삭제

### 4.3 Context 라우트 세부 작업
- [ ] _index: 로더에서 lang 파라미터 처리
- [ ] entry.$entryId: getEntry(id, lang) 패턴 적용
- [ ] category.$categoryId: 카테고리 로더 통합
- [ ] conversations: 대화 라우트 언어 처리
- [ ] browse: 탐색 페이지 언어 처리
- [ ] about 관련: 정적 페이지 언어 처리

### 4.4 Roots 라우트 병합 (19 → 6)
- [ ] `($lang)._index.tsx` 생성
- [ ] `($lang).concept.$conceptId.tsx` 생성
- [ ] `($lang).field.$fieldId.tsx` 생성
- [ ] `($lang).browse.tsx` 생성
- [ ] `($lang).search.tsx` 생성
- [ ] `($lang).favorites.tsx` 생성
- [ ] `$.tsx` 유지
- [ ] 기존 중복 라우트 파일 삭제

### 4.5 Roots 라우트 세부 작업
- [ ] _index: 홈페이지 로더 통합
- [ ] concept.$conceptId: getConcept(id, lang) 패턴 적용
- [ ] field.$fieldId: 필드 로더 통합
- [ ] browse: 탐색 페이지 언어 처리
- [ ] search: 검색 페이지 언어 처리
- [ ] favorites: 즐겨찾기 페이지 언어 처리

### 4.6 Permissive 라우트 병합 (9 → 4)
- [ ] `($lang)._index.tsx` 생성
- [ ] `($lang).libraries.tsx` 생성
- [ ] `($lang).web-api.tsx` 생성
- [ ] `($lang).sitemap.tsx` 생성
- [ ] `$.tsx` 유지
- [ ] 기존 중복 라우트 파일 삭제

### 4.7 Permissive 라우트 세부 작업
- [ ] _index: 홈페이지 로더 통합
- [ ] libraries: 라이브러리 목록 언어 처리
- [ ] web-api: Web API 목록 언어 처리
- [ ] sitemap: 사이트맵 언어 처리

### 4.8 react-router.config.ts 업데이트
- [ ] Context: prerender() 함수에서 ($lang) 패턴 경로 생성
- [ ] Roots: prerender() 함수에서 ($lang) 패턴 경로 생성
- [ ] Permissive: prerender() 함수에서 ($lang) 패턴 경로 생성

### 4.9 SSG 경로 생성 로직
- [ ] `generateLocalizedPaths(basePaths, languages)` 유틸 작성
- [ ] Context: 751 entries × 2 languages = 1502 + 정적 페이지
- [ ] Roots: 414 concepts × 2 languages = 828 + 정적 페이지
- [ ] Permissive: 4 routes × 2 languages = 8

### 4.10 메타 태그 업데이트
- [ ] 각 라우트의 meta 함수에서 ($lang) 파라미터 처리
- [ ] metaFactory 사용하여 로케일별 메타 생성
- [ ] Open Graph, Twitter Card 언어별 처리

### 4.11 네비게이션 링크 업데이트
- [ ] Header 컴포넌트: localePath() 사용
- [ ] Sidebar 컴포넌트: localePath() 사용
- [ ] BottomNav 컴포넌트: localePath() 사용
- [ ] 내부 링크 모두 localePath() 적용

### 4.12 라우트 테스트
- [ ] 각 앱 dev 서버에서 영문 라우트 테스트
- [ ] 각 앱 dev 서버에서 한국어 라우트 테스트
- [ ] 빌드 후 SSG 파일 생성 확인
- [ ] 404 처리 확인

---

## Phase 5: 빌드 파이프라인 및 마무리

### 5.1 Prebuild 파이프라인 구축
- [ ] `scripts/prebuild/index.ts` - 메인 진입점
- [ ] `scripts/prebuild/pipeline.ts` - 파이프라인 엔진
- [ ] `scripts/prebuild/transforms/index.ts` - 변환 함수 모음

### 5.2 데이터 변환 함수
- [ ] `addSearchableText.ts` - 검색용 텍스트 생성
- [ ] `generateSlug.ts` - URL slug 생성
- [ ] `attachMetadata.ts` - 메타데이터 첨부
- [ ] `validateSchema.ts` - Zod 스키마 검증

### 5.3 출력 생성기
- [ ] `scripts/prebuild/outputs/chunked.ts` - 청크 파일 생성
- [ ] `scripts/prebuild/outputs/search-index.ts` - 검색 인덱스 생성
- [ ] `scripts/prebuild/outputs/types.ts` - 타입 파일 생성
- [ ] `scripts/prebuild/outputs/sitemap.ts` - 사이트맵 생성

### 5.4 SSG 최적화
- [ ] `scripts/prebuild/ssg-optimizer.ts` - SSG 병렬 처리
- [ ] 청크 크기 설정 (50개 단위)
- [ ] 병렬 처리 설정 (4개 동시)
- [ ] 진행률 표시

### 5.5 앱별 prebuild 설정
- [ ] `apps/context/prebuild.config.ts` - Context 파이프라인 설정
- [ ] `apps/roots/prebuild.config.ts` - Roots 파이프라인 설정
- [ ] `apps/permissive/prebuild.config.ts` - Permissive 파이프라인 설정

### 5.6 package.json 스크립트 업데이트
- [ ] 루트: `prebuild` 스크립트 추가
- [ ] 루트: `build:all` 스크립트 업데이트
- [ ] 각 앱: `prebuild` 스크립트 업데이트
- [ ] 각 앱: `build` 스크립트가 prebuild 호출하도록

### 5.7 CI/CD 업데이트
- [ ] `.github/workflows/ci.yml` 업데이트
- [ ] prebuild 단계 추가
- [ ] 캐싱 전략 업데이트 (data/ 폴더)
- [ ] 병렬 빌드 설정

### 5.8 Postbuild 검증
- [ ] `scripts/postbuild/verify-ssg.ts` 업데이트
- [ ] 새로운 라우트 구조에 맞게 검증
- [ ] SSG 페이지 수 확인 로직 업데이트

### 5.9 문서 업데이트
- [ ] `CLAUDE.md` 업데이트 - 새 패키지 구조 반영
- [ ] `README.md` 업데이트 - 프로젝트 구조 업데이트
- [ ] 각 패키지 `README.md` 작성

### 5.10 마이그레이션 스크립트
- [ ] `scripts/migrate/update-imports.ts` - import 경로 자동 업데이트
- [ ] `scripts/migrate/cleanup-old-files.ts` - 기존 파일 정리
- [ ] `scripts/migrate/verify-migration.ts` - 마이그레이션 검증

### 5.11 기존 패키지 정리
- [ ] @soundblue/shared → deprecated 마킹 또는 제거
- [ ] @soundblue/shared-react → deprecated 마킹 또는 제거
- [ ] 하위 호환성 re-export 설정 (필요시)

### 5.12 테스트 업데이트
- [ ] 단위 테스트: 새 패키지 구조에 맞게 업데이트
- [ ] 통합 테스트: import 경로 업데이트
- [ ] E2E 테스트: 라우트 변경 반영
- [ ] `pnpm test` 전체 통과 확인

### 5.13 타입체크 및 린트
- [ ] `pnpm typecheck` 전체 통과
- [ ] `pnpm lint` 전체 통과
- [ ] `pnpm format` 실행

### 5.14 빌드 테스트
- [ ] `pnpm build:context` 성공
- [ ] `pnpm build:roots` 성공
- [ ] `pnpm build:permissive` 성공
- [ ] SSG 페이지 수 검증 (Context: 1578, Roots: 878, Permissive: 8)

### 5.15 개발 서버 테스트
- [ ] `pnpm dev:context` - 모든 라우트 동작 확인
- [ ] `pnpm dev:roots` - 모든 라우트 동작 확인
- [ ] `pnpm dev:permissive` - 모든 라우트 동작 확인

### 5.16 최종 검증
- [ ] `pnpm verify:ssg` 통과
- [ ] `pnpm check:links` 통과
- [ ] Lighthouse CI 통과
- [ ] 모든 CI 검증 통과

### 5.17 배포 준비
- [ ] Cloudflare Pages 설정 확인
- [ ] 빌드 명령어 업데이트 (필요시)
- [ ] 환경 변수 확인

### 5.18 최종 문서화
- [ ] CHANGELOG.md 작성
- [ ] 마이그레이션 가이드 작성 (필요시)
- [ ] 새 아키텍처 다이어그램 추가

---

## 패키지 의존성 최종 구조

```
Layer 0: @soundblue/core
  └── 외부: (없음, 순수 함수만)

Layer 1: @soundblue/data
  └── @soundblue/core

Layer 2: @soundblue/search
  └── @soundblue/core
  └── @soundblue/data
  └── 외부: minisearch

Layer 2: @soundblue/i18n
  └── @soundblue/core
  └── 외부: @inlang/paraglide-js

Layer 2: @soundblue/db
  └── @soundblue/core
  └── 외부: dexie

Layer 3: @soundblue/hooks
  └── @soundblue/core
  └── 외부: react

Layer 3: @soundblue/ui
  └── @soundblue/core
  └── @soundblue/i18n
  └── @soundblue/hooks
  └── 외부: react, framer-motion, lucide-react

Layer 4: @soundblue/features
  └── @soundblue/core
  └── @soundblue/db
  └── @soundblue/hooks
  └── @soundblue/ui
  └── 외부: react, zustand, immer

Apps:
  └── @soundblue/core
  └── @soundblue/data
  └── @soundblue/search
  └── @soundblue/i18n
  └── @soundblue/db
  └── @soundblue/hooks
  └── @soundblue/ui
  └── @soundblue/features
```

---

## 체크리스트 요약

| Phase | 작업 수 | 핵심 목표 |
|-------|--------|----------|
| Phase 1 | 46개 | 데이터 JSON 표준화, Zod 스키마 |
| Phase 2 | 51개 | 패키지 분리 (core, search, i18n) |
| Phase 3 | 53개 | UI/Features 패키지 재구성 |
| Phase 4 | 36개 | 라우트 통합 (55 → 16) |
| Phase 5 | 54개 | 빌드 파이프라인, 검증, 문서화 |
| **Total** | **240개** | |

---

## 예상 결과

| 항목 | 현재 | 변경 후 |
|------|------|---------|
| 패키지 수 | 2 | 8 |
| 라우트 파일 | 55 | 16 |
| TS 데이터 파일 | 53 | 0 |
| i18n 중복 코드 | 14,400줄 | ~500줄 |
| 코드 재사용성 | 낮음 | 높음 |
| 테스트 용이성 | 낮음 | 높음 |

