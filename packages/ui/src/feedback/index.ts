/**
 * @fileoverview UI Feedback Components
 * @environment universal
 */

// Toast: moved to @soundblue/features/toast
// Import directly: import { ToastContainer } from '@soundblue/features/toast';
// Confirm Dialog
export { ConfirmDialog, type ConfirmDialogProps, type ConfirmDialogVariant } from './ConfirmDialog';
// Error Boundary (React Class Component)
// Route Error UI
export {
  classifyError,
  ErrorBoundary,
  type ErrorBoundaryProps,
  ErrorFallbackUI,
  type ErrorType,
  isRouteErrorResponse,
  type RouteErrorResponse,
  RouteErrorUI,
} from './ErrorBoundary';
