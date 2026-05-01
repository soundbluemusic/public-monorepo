/**
 * @fileoverview Tests for Toast component
 */

import { clearToasts, ToastContainer, toast as addToast } from '@soundblue/features/toast';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearToasts();
  });

  afterEach(() => {
    clearToasts();
    vi.useRealTimers();
  });

  it('should render nothing when there are no toasts', () => {
    const { container } = render(<ToastContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('should render toast messages', () => {
    addToast({ message: 'Success message', type: 'success', duration: 0 });

    render(<ToastContainer />);

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should render multiple toasts', () => {
    addToast({ message: 'Success message', type: 'success', duration: 0 });
    addToast({ message: 'Error message', type: 'error', duration: 0 });

    render(<ToastContainer />);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  describe('toast variants', () => {
    it('should render success toast with green icon', () => {
      addToast({ message: 'Success', type: 'success', duration: 0 });

      render(<ToastContainer />);

      const icon = document.querySelector('.text-green-500');
      expect(icon).toBeInTheDocument();
    });

    it('should render error toast with red icon', () => {
      addToast({ message: 'Error', type: 'error', duration: 0 });

      render(<ToastContainer />);

      const icon = document.querySelector('.text-red-500');
      expect(icon).toBeInTheDocument();
    });

    it('should render warning toast with amber icon', () => {
      addToast({ message: 'Warning', type: 'warning', duration: 0 });

      render(<ToastContainer />);

      const icon = document.querySelector('.text-amber-500');
      expect(icon).toBeInTheDocument();
    });

    it('should render info toast with blue icon', () => {
      addToast({ message: 'Info', type: 'info', duration: 0 });

      render(<ToastContainer />);

      const icon = document.querySelector('.text-blue-500');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('close button', () => {
    it('should remove toast when close button is clicked', () => {
      addToast({ message: 'Success', type: 'success', duration: 0 });

      render(<ToastContainer />);

      const closeButton = screen.getByRole('button', { name: '닫기' });
      fireEvent.click(closeButton);

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.queryByText('Success')).not.toBeInTheDocument();
    });
  });

  describe('animation', () => {
    it('should animate in after mount', () => {
      addToast({ message: 'Success', type: 'success', duration: 0 });

      render(<ToastContainer />);

      const toastElement = screen.getByText('Success').closest('[role="status"]');

      expect(toastElement).toHaveClass('opacity-0');

      act(() => {
        vi.advanceTimersByTime(20);
      });

      expect(toastElement).toHaveClass('opacity-100');
    });

    it('should animate out when closing', () => {
      addToast({ message: 'Success', type: 'success', duration: 0 });

      render(<ToastContainer />);

      act(() => {
        vi.advanceTimersByTime(20);
      });

      const closeButton = screen.getByRole('button', { name: '닫기' });
      fireEvent.click(closeButton);

      const toastElement = screen.getByText('Success').closest('[role="status"]');
      expect(toastElement).toHaveClass('opacity-0');
    });
  });

  describe('accessibility', () => {
    it('should have role="status" on toast items', () => {
      addToast({ message: 'Success', type: 'success', duration: 0 });

      render(<ToastContainer />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-live="polite" on toast items', () => {
      addToast({ message: 'Success', type: 'success', duration: 0 });

      render(<ToastContainer />);

      const toastElement = screen.getByRole('status');
      expect(toastElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should have role="region" on container', () => {
      addToast({ message: 'Success', type: 'success', duration: 0 });

      render(<ToastContainer />);

      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('should have aria-label on container', () => {
      addToast({ message: 'Success', type: 'success', duration: 0 });

      render(<ToastContainer />);

      const container = screen.getByRole('region');
      expect(container).toHaveAttribute('aria-label', '알림');
    });

    it('should have aria-hidden on icons', () => {
      addToast({ message: 'Success', type: 'success', duration: 0 });

      render(<ToastContainer />);

      const svgs = document.querySelectorAll('svg');
      svgs.forEach((svg) => {
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('should have accessible close button', () => {
      addToast({ message: 'Success', type: 'success', duration: 0 });

      render(<ToastContainer />);

      expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have fixed positioning', () => {
      addToast({ message: 'Success', type: 'success', duration: 0 });

      render(<ToastContainer />);

      const container = screen.getByRole('region');
      expect(container).toHaveClass('fixed');
      expect(container).toHaveClass('z-50');
    });
  });
});
