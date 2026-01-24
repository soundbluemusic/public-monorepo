/**
 * @fileoverview Tests for Toast component
 */

import { ToastContainer } from '@soundblue/ui/feedback';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Toast item type for mocking
interface MockToast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

// Mock @soundblue/features/toast
const mockToasts: MockToast[] = [];
const mockRemoveToast = vi.fn<(id: string) => void>();

vi.mock('@soundblue/features/toast', () => ({
  useToast: () => ({
    toasts: mockToasts,
  }),
  removeToast: (id: string) => mockRemoveToast(id),
}));

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockToasts.length = 0;
    mockRemoveToast.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render nothing when there are no toasts', () => {
    const { container } = render(<ToastContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('should render toast messages', () => {
    mockToasts.push({ id: '1', type: 'success', message: 'Success message' });

    render(<ToastContainer />);

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should render multiple toasts', () => {
    mockToasts.push(
      { id: '1', type: 'success', message: 'Success message' },
      { id: '2', type: 'error', message: 'Error message' },
    );

    render(<ToastContainer />);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  describe('toast variants', () => {
    it('should render success toast with green icon', () => {
      mockToasts.push({ id: '1', type: 'success', message: 'Success' });

      render(<ToastContainer />);

      const icon = document.querySelector('.text-green-500');
      expect(icon).toBeInTheDocument();
    });

    it('should render error toast with red icon', () => {
      mockToasts.push({ id: '1', type: 'error', message: 'Error' });

      render(<ToastContainer />);

      const icon = document.querySelector('.text-red-500');
      expect(icon).toBeInTheDocument();
    });

    it('should render warning toast with amber icon', () => {
      mockToasts.push({ id: '1', type: 'warning', message: 'Warning' });

      render(<ToastContainer />);

      const icon = document.querySelector('.text-amber-500');
      expect(icon).toBeInTheDocument();
    });

    it('should render info toast with blue icon', () => {
      mockToasts.push({ id: '1', type: 'info', message: 'Info' });

      render(<ToastContainer />);

      const icon = document.querySelector('.text-blue-500');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('close button', () => {
    it('should call removeToast when close button is clicked', async () => {
      mockToasts.push({ id: '1', type: 'success', message: 'Success' });

      render(<ToastContainer />);

      const closeButton = screen.getByRole('button', { name: '닫기' });
      fireEvent.click(closeButton);

      // Wait for animation delay
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(mockRemoveToast).toHaveBeenCalledWith('1');
    });
  });

  describe('animation', () => {
    it('should animate in after mount', () => {
      mockToasts.push({ id: '1', type: 'success', message: 'Success' });

      render(<ToastContainer />);

      const toastElement = screen.getByText('Success').closest('[role="status"]');

      // Initially not visible
      expect(toastElement).toHaveClass('opacity-0');

      // After animation timer
      act(() => {
        vi.advanceTimersByTime(20);
      });

      expect(toastElement).toHaveClass('opacity-100');
    });

    it('should animate out when closing', async () => {
      mockToasts.push({ id: '1', type: 'success', message: 'Success' });

      render(<ToastContainer />);

      // Wait for enter animation
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
      mockToasts.push({ id: '1', type: 'success', message: 'Success' });

      render(<ToastContainer />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-live="polite" on toast items', () => {
      mockToasts.push({ id: '1', type: 'success', message: 'Success' });

      render(<ToastContainer />);

      const toast = screen.getByRole('status');
      expect(toast).toHaveAttribute('aria-live', 'polite');
    });

    it('should have role="region" on container', () => {
      mockToasts.push({ id: '1', type: 'success', message: 'Success' });

      render(<ToastContainer />);

      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('should have aria-label on container', () => {
      mockToasts.push({ id: '1', type: 'success', message: 'Success' });

      render(<ToastContainer />);

      const container = screen.getByRole('region');
      expect(container).toHaveAttribute('aria-label', '알림');
    });

    it('should have aria-hidden on icons', () => {
      mockToasts.push({ id: '1', type: 'success', message: 'Success' });

      render(<ToastContainer />);

      const svgs = document.querySelectorAll('svg');
      svgs.forEach((svg) => {
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('should have accessible close button', () => {
      mockToasts.push({ id: '1', type: 'success', message: 'Success' });

      render(<ToastContainer />);

      expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have fixed positioning', () => {
      mockToasts.push({ id: '1', type: 'success', message: 'Success' });

      render(<ToastContainer />);

      const container = screen.getByRole('region');
      expect(container).toHaveClass('fixed');
      expect(container).toHaveClass('z-50');
    });
  });
});
