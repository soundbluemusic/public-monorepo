import { StartClient } from '@tanstack/react-start/client';
import { hydrateRoot } from 'react-dom/client';
import { createRouter } from './router';

const router = createRouter();

// @ts-expect-error - TanStack Start types are not fully compatible
hydrateRoot(document, <StartClient router={router} />);
