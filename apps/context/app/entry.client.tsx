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

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <App />
    </StrictMode>,
  );

  // After hydration recovery, remove stale server-rendered content
  // React creates new DOM when hydration fails, leaving old elements orphaned
  // Use setTimeout to wait for React's recovery render to complete
  setTimeout(() => {
    const bodyChildren = Array.from(document.body.children);
    const divs = bodyChildren.filter((el) => el.tagName === 'DIV');

    // If there are 2 main divs, the first is orphaned server HTML
    if (divs.length >= 2) {
      const firstDiv = divs[0] as HTMLElement;

      // Check if first div has no React keys (orphaned)
      const hasReact = Object.keys(firstDiv).some((k) => k.startsWith('__react'));
      if (!hasReact) {
        firstDiv.remove();
      }
    }
  }, 100);
});
