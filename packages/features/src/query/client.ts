/**
 * TanStack Query Client 설정
 *
 * 모든 앱에서 공유하는 QueryClient 설정입니다.
 * 캐싱, 재시도, stale 시간 등을 설정합니다.
 *
 * @environment client-only
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * 기본 QueryClient 설정
 *
 * - staleTime: 5분 (5분 동안 fresh 상태 유지)
 * - gcTime: 30분 (30분 후 캐시에서 제거)
 * - retry: 1회 (네트워크 오류 시 1회 재시도)
 * - refetchOnWindowFocus: false (탭 포커스 시 자동 리페치 비활성화)
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 5분 동안 fresh 상태 유지 (D1 요청 감소)
        staleTime: 5 * 60 * 1000,
        // 30분 후 캐시에서 제거
        gcTime: 30 * 60 * 1000,
        // 네트워크 오류 시 1회 재시도
        retry: 1,
        // 탭 포커스 시 자동 리페치 비활성화 (불필요한 요청 방지)
        refetchOnWindowFocus: false,
        // 네트워크 재연결 시 리페치
        refetchOnReconnect: true,
      },
      mutations: {
        // 뮤테이션 실패 시 재시도 없음
        retry: 0,
      },
    },
  });
}

/**
 * 싱글톤 QueryClient (클라이언트 전용)
 *
 * SSR에서는 매 요청마다 새 QueryClient를 생성해야 합니다.
 * 클라이언트에서만 싱글톤으로 사용합니다.
 */
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  // 서버에서는 항상 새 클라이언트 생성
  if (typeof window === 'undefined') {
    return createQueryClient();
  }

  // 브라우저에서는 싱글톤 사용
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }
  return browserQueryClient;
}
