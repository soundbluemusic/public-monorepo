/**
 * @fileoverview Toast 알림 시스템 훅
 *
 * UX 원칙 6 (쉬운 복구), 9 (배려하는 시스템)를 위한 피드백 시스템
 *
 * @example
 * ```tsx
 * const { toast, toasts, removeToast } = useToast();
 *
 * // 성공 메시지
 * toast({ message: '저장되었습니다', type: 'success' });
 *
 * // 에러 메시지
 * toast({ message: '저장에 실패했습니다', type: 'error' });
 * ```
 */

import { useCallback, useSyncExternalStore } from 'react';

/** Toast 타입 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/** Toast 데이터 */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

/** Toast 생성 옵션 */
export interface ToastOptions {
  message: string;
  type?: ToastType;
  /** 자동 닫힘 시간 (ms). 기본값: 3000 */
  duration?: number;
}

/** Toast 스토어 상태 */
interface ToastStore {
  toasts: Toast[];
  listeners: Set<() => void>;
}

// 전역 스토어 (모든 컴포넌트에서 공유)
const store: ToastStore = {
  toasts: [],
  listeners: new Set(),
};

/** 리스너에게 상태 변경 알림 */
function emitChange() {
  for (const listener of store.listeners) {
    listener();
  }
}

/** 고유 ID 생성 */
function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Toast 추가 */
function addToast(options: ToastOptions): string {
  const id = generateId();
  const toast: Toast = {
    id,
    message: options.message,
    type: options.type ?? 'info',
    duration: options.duration ?? 3000,
  };

  store.toasts = [...store.toasts, toast];
  emitChange();

  // 자동 제거
  if (toast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, toast.duration);
  }

  return id;
}

/** Toast 제거 */
function removeToast(id: string): void {
  store.toasts = store.toasts.filter((t) => t.id !== id);
  emitChange();
}

/** 모든 Toast 제거 */
function clearToasts(): void {
  store.toasts = [];
  emitChange();
}

/** 스토어 구독 */
function subscribe(listener: () => void): () => void {
  store.listeners.add(listener);
  return () => {
    store.listeners.delete(listener);
  };
}

/** 현재 스냅샷 반환 */
function getSnapshot(): Toast[] {
  return store.toasts;
}

/** SSR용 스냅샷 */
function getServerSnapshot(): Toast[] {
  return [];
}

/**
 * Toast 알림 훅
 *
 * @returns toast 함수와 현재 toasts 목록
 */
export function useToast() {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toast = useCallback((options: ToastOptions) => {
    return addToast(options);
  }, []);

  return {
    /** Toast 추가 함수 */
    toast,
    /** 현재 표시 중인 Toast 목록 */
    toasts,
    /** 특정 Toast 제거 */
    removeToast,
    /** 모든 Toast 제거 */
    clearToasts,
  };
}

// 외부에서 직접 호출할 수 있도록 export
export { addToast as toast, removeToast, clearToasts };
