import { StrictMode, Suspense, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

/**
 * Client-side hydration for React Router v7 SSG
 *
 * Known issue: React Router v7 with SSG mode has hydration mismatches due to
 * script injection order differences between prerender and client. React 19
 * recovers by creating new DOM elements, but old elements stay in DOM.
 *
 * Workaround: After hydration completes, remove the stale server-rendered
 * content that React didn't take over.
 *
 * @see https://github.com/remix-run/react-router/issues/12893
 */
function App() {
  return (
    <Suspense fallback={null}>
      <HydratedRouter />
    </Suspense>
  );
}

/**
 * Orphan DOM 감지 및 제거
 *
 * React Router v7 SSG hydration 실패 시 React가 새 DOM을 생성하면서
 * 기존 서버 렌더링된 DOM이 고아 상태로 남는 버그에 대한 workaround.
 *
 * MutationObserver를 사용하여 DOM 변경을 감지하고,
 * React 내부 키(__react*)가 없는 고아 DIV를 안전하게 제거합니다.
 *
 * 개선점 (setTimeout 대비):
 * - 타이밍 의존성 제거: 고정 100ms 대신 실제 DOM 변경 감지
 * - 느린 디바이스 대응: 디바이스 성능에 관계없이 안정적
 * - 불필요한 지연 없음: DOM 변경 즉시 처리
 */
function cleanupOrphanDOM() {
  // 이미 정리되었는지 확인
  let cleaned = false;

  const cleanup = () => {
    if (cleaned) return;

    const bodyChildren = Array.from(document.body.children);
    const divs = bodyChildren.filter((el) => el.tagName === 'DIV');

    // 2개 이상의 main DIV가 있으면 첫 번째가 orphan일 가능성 높음
    if (divs.length >= 2) {
      const firstDiv = divs[0] as HTMLElement;

      // React 내부 키가 없으면 orphan DOM
      const hasReact = Object.keys(firstDiv).some((k) => k.startsWith('__react'));
      if (!hasReact) {
        firstDiv.remove();
        cleaned = true;
      }
    }
  };

  // MutationObserver로 DOM 변경 감지
  const observer = new MutationObserver((mutations) => {
    // childList 변경이 있고, DIV가 추가되었을 때만 체크
    const hasDivAdded = mutations.some(
      (m) =>
        m.type === 'childList' &&
        Array.from(m.addedNodes).some((n) => (n as Element).tagName === 'DIV'),
    );

    if (hasDivAdded) {
      cleanup();
      if (cleaned) {
        observer.disconnect();
      }
    }
  });

  // body의 직계 자식 변경만 감시
  observer.observe(document.body, { childList: true });

  // 안전장치: 이미 orphan 상태일 수 있으므로 즉시 한 번 체크
  // requestAnimationFrame으로 다음 렌더 프레임에서 실행
  requestAnimationFrame(() => {
    cleanup();
    if (cleaned) {
      observer.disconnect();
    }
  });

  // 최대 대기 시간 후 observer 정리 (메모리 누수 방지)
  setTimeout(() => {
    observer.disconnect();
  }, 5000);
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <App />
    </StrictMode>,
  );

  // Orphan DOM 정리
  cleanupOrphanDOM();
});
