import { I18nProvider } from '@/i18n';
/**
 * @fileoverview Permissive 앱 루트 컴포넌트
 *
 * 무료 웹개발 도구 앱의 최상위 컴포넌트로, 라우터 설정과 전역 프로바이더를 구성합니다.
 * - MetaProvider: SEO 메타태그 관리
 * - I18nProvider: 다국어(한/영) 지원
 * - OfflineIndicator: 오프라인 상태 표시 (PWA)
 * - Suspense: 비동기 컴포넌트 로딩 처리
 */
import { MetaProvider, Title } from '@solidjs/meta';
import { type RouteSectionProps, Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { OfflineIndicator } from '@soundblue/shared';
import { Suspense } from 'solid-js';

import '~/styles/global.css';

/**
 * 페이지 로딩 중 표시되는 스켈레톤 UI
 *
 * Suspense fallback으로 사용되며, 헤더와 콘텐츠 영역의
 * 레이아웃을 미리 보여줍니다.
 */
function LoadingFallback() {
  return (
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header skeleton */}
      <div class="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30">
        <div class="h-full px-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="skeleton w-8 h-8 rounded-lg" />
            <div class="skeleton h-5 w-24 rounded" />
          </div>
          <div class="flex gap-2">
            <div class="skeleton w-9 h-9 rounded-lg" />
            <div class="skeleton w-9 h-9 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div class="pt-14 md:ml-60">
        <div class="max-w-4xl mx-auto px-4 py-8">
          <div class="space-y-6">
            <div class="skeleton h-9 w-1/4 rounded-lg" />
            <div class="skeleton h-5 w-1/2 rounded" />
            <div class="flex gap-4 mt-4">
              <div class="skeleton h-11 flex-1 rounded-xl" />
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div class="skeleton h-32 rounded-xl" key={i} />
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
            <Title>Permissive - Free Web Dev Resources</Title>
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
