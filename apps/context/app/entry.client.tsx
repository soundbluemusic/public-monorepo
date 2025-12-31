import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

console.log('[HYDRATION] Starting React hydration...');

startTransition(() => {
  try {
    const root = hydrateRoot(document, <HydratedRouter />);
    console.log('[HYDRATION] React hydration completed successfully', root);
  } catch (error) {
    console.error('[HYDRATION] React hydration failed:', error);
  }
});
