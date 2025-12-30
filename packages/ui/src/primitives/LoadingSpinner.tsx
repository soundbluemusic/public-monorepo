/**
 * @fileoverview Loading Spinner Component
 * @environment universal
 */

export interface LoadingSpinnerProps {
  className?: string;
}

/** Default loading spinner component */
export function LoadingSpinner({ className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`} role="status">
      <svg
        className="h-6 w-6 animate-spin text-accent"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
