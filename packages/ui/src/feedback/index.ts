/**
 * @fileoverview UI Feedback Components
 * @environment universal
 */

// Toast: moved to @soundblue/features/toast
// Import directly: import { ToastContainer } from '@soundblue/features/toast';
// Confirm Dialog
export { ConfirmDialog, type ConfirmDialogProps, type ConfirmDialogVariant } from './ConfirmDialog';
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
