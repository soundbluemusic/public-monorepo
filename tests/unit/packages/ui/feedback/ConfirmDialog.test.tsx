/**
 * @fileoverview Tests for ConfirmDialog component
 */

import type { ConfirmDialogProps } from '@soundblue/ui/feedback';
import { ConfirmDialog } from '@soundblue/ui/feedback';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock HTMLDialogElement methods
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('ConfirmDialog', () => {
  const defaultProps: ConfirmDialogProps = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  describe('rendering', () => {
    it('should render dialog with title and message', () => {
      render(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<ConfirmDialog {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
    });

    it('should render confirm and cancel buttons', () => {
      render(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should render custom button labels', () => {
      render(
        <ConfirmDialog {...defaultProps} confirmLabel="Delete" cancelLabel="Keep" />,
      );

      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Keep')).toBeInTheDocument();
    });

    it('should render ReactNode message', () => {
      render(
        <ConfirmDialog
          {...defaultProps}
          message={
            <span data-testid="custom-message">
              Custom <strong>message</strong>
            </span>
          }
        />,
      );

      expect(screen.getByTestId('custom-message')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should render danger variant by default', () => {
      render(<ConfirmDialog {...defaultProps} />);

      // Danger variant has red icon
      const icon = document.querySelector('.text-red-500');
      expect(icon).toBeInTheDocument();
    });

    it('should render warning variant', () => {
      render(<ConfirmDialog {...defaultProps} variant="warning" />);

      // Warning variant has amber icon
      const icon = document.querySelector('.text-amber-500');
      expect(icon).toBeInTheDocument();
    });

    it('should render info variant', () => {
      render(<ConfirmDialog {...defaultProps} variant="info" />);

      // Info variant has blue icon
      const icon = document.querySelector('.text-blue-500');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onConfirm when confirm button is clicked', () => {
      const onConfirm = vi.fn();
      render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

      fireEvent.click(screen.getByText('Confirm'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button is clicked', () => {
      const onCancel = vi.fn();
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      fireEvent.click(screen.getByText('Cancel'));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when Escape key is pressed', () => {
      const onCancel = vi.fn();
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      // Dialog element is not accessible in JSDOM, query by tag
      const dialog = document.querySelector('dialog');
      expect(dialog).not.toBeNull();
      fireEvent.keyDown(dialog!, { key: 'Escape' });
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when backdrop is clicked', () => {
      const onCancel = vi.fn();
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      const dialog = document.querySelector('dialog');
      expect(dialog).not.toBeNull();
      fireEvent.click(dialog!);
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should not call onCancel when dialog content is clicked', () => {
      const onCancel = vi.fn();
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      const content = document.querySelector('[role="document"]');
      expect(content).not.toBeNull();
      fireEvent.click(content!);
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should show loading text when isLoading is true', () => {
      render(<ConfirmDialog {...defaultProps} isLoading />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should disable buttons when isLoading is true', () => {
      render(<ConfirmDialog {...defaultProps} isLoading />);

      expect(screen.getByText('Cancel')).toBeDisabled();
      expect(screen.getByText('Loading...')).toBeDisabled();
    });

    it('should not call onConfirm when clicking disabled confirm button', () => {
      const onConfirm = vi.fn();
      render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} isLoading />);

      fireEvent.click(screen.getByText('Loading...'));
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it('should not call onCancel when clicking disabled cancel button', () => {
      const onCancel = vi.fn();
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} isLoading />);

      fireEvent.click(screen.getByText('Cancel'));
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have aria-labelledby attribute', () => {
      render(<ConfirmDialog {...defaultProps} />);

      const dialog = document.querySelector('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-dialog-title');
    });

    it('should have aria-describedby attribute', () => {
      render(<ConfirmDialog {...defaultProps} />);

      const dialog = document.querySelector('dialog');
      expect(dialog).toHaveAttribute('aria-describedby', 'confirm-dialog-message');
    });

    it('should have correct heading level', () => {
      render(<ConfirmDialog {...defaultProps} />);

      const heading = screen.getByText('Confirm Action');
      expect(heading.tagName).toBe('H2');
    });

    it('should have role="document" on content wrapper', () => {
      render(<ConfirmDialog {...defaultProps} />);

      const contentWrapper = document.querySelector('[role="document"]');
      expect(contentWrapper).toBeInTheDocument();
    });

    it('should have aria-hidden on icons', () => {
      render(<ConfirmDialog {...defaultProps} />);

      const svgs = document.querySelectorAll('svg');
      svgs.forEach((svg) => {
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('dialog lifecycle', () => {
    it('should call showModal when isOpen becomes true', () => {
      const { rerender } = render(<ConfirmDialog {...defaultProps} isOpen={false} />);

      expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();

      rerender(<ConfirmDialog {...defaultProps} isOpen={true} />);

      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });

    it('should unmount dialog when isOpen becomes false', () => {
      const { rerender } = render(<ConfirmDialog {...defaultProps} isOpen={true} />);

      expect(document.querySelector('dialog')).toBeInTheDocument();

      rerender(<ConfirmDialog {...defaultProps} isOpen={false} />);

      // Dialog is removed from DOM when isOpen is false
      expect(document.querySelector('dialog')).not.toBeInTheDocument();
    });
  });
});
