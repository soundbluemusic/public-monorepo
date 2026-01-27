/**
 * Query Provider 컴포넌트
 *
 * 앱의 루트에서 QueryClientProvider를 제공합니다.
 * SSR hydration을 위한 설정이 포함되어 있습니다.
 *
 * @environment client-only
 */

'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { getQueryClient } from './client';

interface QueryProviderProps {
  children: ReactNode;
  /** DevTools 표시 여부 (기본: development 환경에서만) */
  showDevtools?: boolean;
}

/**
 * TanStack Query Provider
 *
 * @example
 * ```tsx
 * // __root.tsx에서 사용
 * function RootComponent() {
 *   return (
 *     <QueryProvider>
 *       <Outlet />
 *     </QueryProvider>
 *   );
 * }
 * ```
 */
export function QueryProvider({ children, showDevtools }: QueryProviderProps) {
  const queryClient = getQueryClient();

  const shouldShowDevtools =
    showDevtools ?? (typeof window !== 'undefined' && process.env.NODE_ENV === 'development');

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {shouldShowDevtools && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
