import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';
import { createRouter } from './router';

// @ts-expect-error - TanStack Start types are not fully compatible
export default createStartHandler({ createRouter })(defaultStreamHandler);
