/**
 * @fileoverview ConfirmDialog component
 * @description Modal dialog for confirming destructive or important actions
 * @environment universal
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   variant="danger"
 *   title="Delete item?"
 *   message="This action cannot be undone."
 *   confirmLabel="Delete"
 *   cancelLabel="Cancel"
 *   onConfirm={() => { deleteItem(); setIsOpen(false); }}
 *   onCancel={() => setIsOpen(false)}
 * />
 * ```
 */
import { type ReactNode, useCallback, useEffect, useRef } from 'react';
import { Button } from '../components/Button';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Visual variant of the dialog */
  variant?: ConfirmDialogVariant;
  /** Dialog title */
  title: string;
  /** Dialog message content */
  message: string | ReactNode;
  /** Label for confirm button */
  confirmLabel?: string;
  /** Label for cancel button */
  cancelLabel?: string;
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Callback when cancelled */
  onCancel: () => void;
  /** Show loading state on confirm button */
  isLoading?: boolean;
}

const variantStyles: Record<
  ConfirmDialogVariant,
  { icon: ReactNode; buttonVariant: 'destructive' | 'default' | 'secondary' }
> = {
  danger: {
    icon: (
      <svg
        className="w-6 h-6 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    buttonVariant: 'destructive',
  },
  warning: {
    icon: (
      <svg
        className="w-6 h-6 text-amber-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    buttonVariant: 'default',
  },
  info: {
    icon: (
      <svg
        className="w-6 h-6 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    buttonVariant: 'default',
  },
};

/**
 * ConfirmDialog - Modal dialog for user confirmation
 *
 * Uses native HTML dialog element for accessibility.
 * Supports danger, warning, and info variants.
 */
export function ConfirmDialog({
  isOpen,
  variant = 'danger',
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Handle dialog open/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      // Focus cancel button by default for safety
      cancelButtonRef.current?.focus();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    },
    [onCancel],
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onCancel();
      }
    },
    [onCancel],
  );

  const { icon, buttonVariant } = variantStyles[variant];

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto p-0 bg-transparent backdrop:bg-black/50 open:animate-in open:fade-in open:zoom-in-95"
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Event propagation handled by dialog */}
      <div
        role="document"
        className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon and Title */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2 rounded-full bg-gray-100 dark:bg-gray-800">{icon}</div>
          <div className="flex-1 min-w-0">
            <h2
              id="confirm-dialog-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              {title}
            </h2>
            <p
              id="confirm-dialog-message"
              className="mt-2 text-sm text-gray-600 dark:text-gray-400"
            >
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button ref={cancelButtonRef} variant="secondary" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={buttonVariant} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Loading...' : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
