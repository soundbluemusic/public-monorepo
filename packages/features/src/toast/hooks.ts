/**
 * @fileoverview Toast Notification System
 * @environment client-only
 *
 * 전역 Toast 알림 시스템. useSyncExternalStore 기반.
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

/** Toast 타이머 메타데이터 */
interface ToastTimer {
  /** 활성 타이머 ID. null이면 일시정지 상태. */
  id: ReturnType<typeof setTimeout> | null;
  /** 현재 타이머 시작 시각 (Date.now()) */
  startedAt: number;
  /** 시작 시각 기준 남은 시간(ms) */
  remaining: number;
}

/** Toast 스토어 상태 */
interface ToastStore {
  toasts: Toast[];
  queue: Toast[];
  listeners: Set<() => void>;
  timers: Map<string, ToastTimer>;
}

/** 동시에 표시할 수 있는 최대 Toast 개수 */
const MAX_VISIBLE_TOASTS = 3;
/** 큐 대기열 최대 길이 */
const MAX_QUEUE_SIZE = 10;

// 전역 스토어 (모든 컴포넌트에서 공유)
const store: ToastStore = {
  toasts: [],
  queue: [],
  listeners: new Set(),
  timers: new Map(),
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

/** 자동 제거 타이머 시작 */
function scheduleRemoval(toast: Toast, remaining: number): void {
  if (remaining <= 0) return;
  const timerId = setTimeout(() => removeToast(toast.id), remaining);
  store.timers.set(toast.id, {
    id: timerId,
    startedAt: Date.now(),
    remaining,
  });
}

/** Toast 추가 */
export function addToast(options: ToastOptions): string {
  const id = generateId();
  const toast: Toast = {
    id,
    message: options.message,
    type: options.type ?? 'info',
    duration: options.duration ?? 3000,
  };

  if (store.toasts.length >= MAX_VISIBLE_TOASTS) {
    if (store.queue.length >= MAX_QUEUE_SIZE) {
      store.queue.shift();
    }
    store.queue = [...store.queue, toast];
    emitChange();
    return id;
  }

  store.toasts = [...store.toasts, toast];
  emitChange();

  if (toast.duration > 0) {
    scheduleRemoval(toast, toast.duration);
  }

  return id;
}

/** Toast 제거 */
export function removeToast(id: string): void {
  const timer = store.timers.get(id);
  if (timer) {
    if (timer.id !== null) {
      clearTimeout(timer.id);
    }
    store.timers.delete(id);
  }
  store.toasts = store.toasts.filter((t) => t.id !== id);

  if (store.queue.length > 0 && store.toasts.length < MAX_VISIBLE_TOASTS) {
    const next = store.queue[0];
    store.queue = store.queue.slice(1);
    if (next) {
      store.toasts = [...store.toasts, next];
      if (next.duration > 0) {
        scheduleRemoval(next, next.duration);
      }
    }
  }

  emitChange();
}

/**
 * Toast 자동 닫힘 타이머 일시정지 (마우스 호버 / 포커스 시)
 *
 * 이미 일시정지 상태(timer.id === null)인 경우 noop이므로
 * onMouseEnter + onFocus가 연달아 호출되어도 remaining이 중복 차감되지 않습니다.
 */
export function pauseToastTimer(id: string): void {
  const timer = store.timers.get(id);
  if (!timer || timer.id === null) return;
  clearTimeout(timer.id);
  const elapsed = Date.now() - timer.startedAt;
  const remaining = Math.max(0, timer.remaining - elapsed);
  store.timers.set(id, { id: null, startedAt: timer.startedAt, remaining });
}

/**
 * Toast 자동 닫힘 타이머 재개 (마우스 떠남 / 포커스 해제 시)
 *
 * 일시정지 상태(timer.id === null)일 때만 재개합니다. 활성 상태에서 호출되면
 * 중복 스케줄링을 방지하기 위해 noop입니다.
 */
export function resumeToastTimer(id: string): void {
  const timer = store.timers.get(id);
  if (!timer || timer.id !== null) return;
  const toast = store.toasts.find((t) => t.id === id);
  if (!toast) return;
  scheduleRemoval(toast, timer.remaining);
}

/** 모든 Toast 제거 */
export function clearToasts(): void {
  for (const timer of store.timers.values()) {
    if (timer.id !== null) {
      clearTimeout(timer.id);
    }
  }
  store.timers.clear();
  store.toasts = [];
  store.queue = [];
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

/** useToast 훅 반환 타입 */
export interface UseToastReturn {
  /** Toast 추가 함수 */
  toast: (options: ToastOptions) => string;
  /** 현재 표시 중인 Toast 목록 */
  toasts: Toast[];
  /** 특정 Toast 제거 */
  removeToast: (id: string) => void;
  /** 모든 Toast 제거 */
  clearToasts: () => void;
}

/**
 * Toast 알림 훅
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
export function useToast(): UseToastReturn {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toast = useCallback((options: ToastOptions): string => {
    return addToast(options);
  }, []);

  return {
    toast,
    toasts,
    removeToast,
    clearToasts,
  };
}

// 외부에서 직접 호출할 수 있도록 export
export { addToast as toast };
