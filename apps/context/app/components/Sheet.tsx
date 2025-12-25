/**
 * Sheet Component (Radix Dialog 기반)
 * SSG에서 hydration 후 정상 작동하는 사이드바 컴포넌트
 */
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: string;
  side?: 'left' | 'right';
}

export function Sheet({ open, onOpenChange, children, title, side = 'left' }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Content */}
        <Dialog.Content
          className={`fixed top-0 z-50 h-full w-72 bg-[var(--bg-primary)] border-r border-[var(--border-primary)] shadow-lg transition-transform duration-300 ease-in-out flex flex-col focus:outline-none
            ${side === 'left' ? 'left-0 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left' : 'right-0 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right'}
            data-[state=open]:animate-in data-[state=closed]:animate-out`}
        >
          {/* Header */}
          <div
            className="h-14 flex items-center justify-between px-4 shrink-0"
            style={{ borderBottom: '1px solid var(--border-primary)' }}
          >
            <Dialog.Title className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Close menu"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {/* Content */}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface SheetTriggerProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function SheetTrigger({ onClick, children, className, ariaLabel }: SheetTriggerProps) {
  return (
    <button type="button" onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
