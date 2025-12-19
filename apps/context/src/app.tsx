import { I18nProvider } from '@/i18n';
/**
 * @fileoverview Context 앱 루트 컴포넌트
 *
 * SolidStart 앱의 최상위 컴포넌트로, 라우터 설정과 전역 프로바이더를 구성합니다.
 * - MetaProvider: SEO 메타태그 관리
 * - I18nProvider: 다국어(한/영) 지원
 * - OfflineIndicator: 오프라인 상태 표시 (PWA)
 * - Suspense: 비동기 컴포넌트 로딩 처리
 */
import { MetaProvider } from '@solidjs/meta';
import { type RouteSectionProps, Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { OfflineIndicator } from '@soundblue/shared';
import { Suspense } from 'solid-js';
import './app.css';

/**
 * 페이지 로딩 중 표시되는 스켈레톤 UI
 *
 * Suspense fallback으로 사용되며, 헤더와 콘텐츠 영역의
 * 레이아웃을 미리 보여줍니다.
 */
function LoadingFallback() {
  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header skeleton */}
      <div class="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40">
        <div class="h-full px-4 flex items-center gap-4">
          <div class="skeleton w-10 h-10 rounded-xl" />
          <div class="hidden sm:block space-y-1">
            <div class="skeleton h-5 w-24 rounded" />
            <div class="skeleton h-3 w-32 rounded" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div class="pt-16 lg:pl-72">
        <div class="container max-w-7xl mx-auto px-4 py-8">
          <div class="space-y-6">
            <div class="skeleton h-10 w-1/3 rounded-lg" />
            <div class="skeleton h-5 w-2/3 rounded" />
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3, 4, 5, 6].map(() => (
                <div class="skeleton h-48 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 앱 루트 컴포넌트
 *
 * SolidStart의 Router를 설정하고 전역 프로바이더들을 래핑합니다.
 * FileRoutes를 통해 파일 기반 라우팅을 사용합니다.
 *
 * @returns 앱 전체를 감싸는 Router 컴포넌트
 */
export default function App() {
  return (
    <Router
      root={(props: RouteSectionProps) => (
        <MetaProvider>
          <I18nProvider>
            <OfflineIndicator />
            <Suspense fallback={<LoadingFallback />}>{props.children}</Suspense>
          </I18nProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
