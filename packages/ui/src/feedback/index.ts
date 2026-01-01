/**
 * @fileoverview UI Feedback Components
 * @environment universal
 */

// Error Boundary (React Class Component)
// Route Error UI (React Router용)
// Legacy alias
export {
  classifyError,
  ErrorBoundary,
  type ErrorBoundaryProps,
  ErrorFallbackUI,
  type ErrorType,
  isRouteErrorResponse,
  RouteErrorFallback,
  type RouteErrorResponse,
  RouteErrorUI,
} from './ErrorBoundary';

// Toast
export { type Toast, ToastContainer } from './Toast';
