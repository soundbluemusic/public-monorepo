/**
 * @fileoverview Unit tests for OfflineIndicator component
 *
 * Tests:
 * - Renders nothing when online
 * - Shows offline banner when offline
 * - Shows reconnected toast when going from offline to online
 * - Auto-dismisses reconnected toast after 3 seconds
 */

import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the internal useOnlineStatus hook
const mockReturnValue = { isOnline: true, wasOffline: false };
vi.mock('../../../../../packages/pwa/src/react/useOnlineStatus', () => ({
  useOnlineStatus: vi.fn(() => mockReturnValue),
}));

// Import after mock setup
import { OfflineIndicator } from '@soundblue/pwa/react';
import { useOnlineStatus } from '../../../../../packages/pwa/src/react/useOnlineStatus';

const mockUseOnlineStatus = vi.mocked(useOnlineStatus);

describe('OfflineIndicator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockUseOnlineStatus.mockReturnValue({ isOnline: true, wasOffline: false });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should render nothing when online and never was offline', () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: true, wasOffline: false });

    const { container } = render(<OfflineIndicator />);

    expect(screen.queryByText('You are offline')).not.toBeInTheDocument();
    expect(screen.queryByText('Back online')).not.toBeInTheDocument();
    // Only empty fragment wrapper
    expect(container.children.length).toBe(0);
  });

  it('should show offline banner when offline', () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: false, wasOffline: false });

    render(<OfflineIndicator />);

    expect(screen.getByText('You are offline')).toBeInTheDocument();
    expect(screen.queryByText('Back online')).not.toBeInTheDocument();
  });

  it('should show offline banner with correct styles', () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: false, wasOffline: false });

    render(<OfflineIndicator />);

    const banner = screen.getByText('You are offline').closest('div');
    expect(banner).toHaveClass('bg-red-500');
    expect(banner).toHaveClass('fixed');
    expect(banner).toHaveClass('top-0');
  });

  it('should show reconnected toast when going from offline to online', () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: true, wasOffline: true });

    render(<OfflineIndicator />);

    expect(screen.queryByText('You are offline')).not.toBeInTheDocument();
    expect(screen.getByText('Back online')).toBeInTheDocument();
  });

  it('should show reconnected toast with correct styles', () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: true, wasOffline: true });

    render(<OfflineIndicator />);

    const toast = screen.getByText('Back online').closest('div');
    expect(toast).toHaveClass('bg-green-500');
    expect(toast).toHaveClass('fixed');
    expect(toast).toHaveClass('bottom-4');
  });

  it('should auto-dismiss reconnected toast after 3 seconds', () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: true, wasOffline: true });

    render(<OfflineIndicator />);

    expect(screen.getByText('Back online')).toBeInTheDocument();

    // Advance time by 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Back online')).not.toBeInTheDocument();
  });

  it('should not show reconnected toast before 3 seconds', () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: true, wasOffline: true });

    render(<OfflineIndicator />);

    expect(screen.getByText('Back online')).toBeInTheDocument();

    // Advance time by 2.9 seconds
    act(() => {
      vi.advanceTimersByTime(2900);
    });

    // Should still be visible
    expect(screen.getByText('Back online')).toBeInTheDocument();
  });

  it('should cleanup timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    mockUseOnlineStatus.mockReturnValue({ isOnline: true, wasOffline: true });

    const { unmount } = render(<OfflineIndicator />);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('should not show toast if wasOffline but still offline', () => {
    // Edge case: wasOffline is true but still offline
    mockUseOnlineStatus.mockReturnValue({ isOnline: false, wasOffline: true });

    render(<OfflineIndicator />);

    expect(screen.getByText('You are offline')).toBeInTheDocument();
    expect(screen.queryByText('Back online')).not.toBeInTheDocument();
  });

  it('should handle transition from online to offline', () => {
    const { rerender } = render(<OfflineIndicator />);

    // Initially online
    mockUseOnlineStatus.mockReturnValue({ isOnline: true, wasOffline: false });
    rerender(<OfflineIndicator />);
    expect(screen.queryByText('You are offline')).not.toBeInTheDocument();

    // Go offline
    mockUseOnlineStatus.mockReturnValue({ isOnline: false, wasOffline: false });
    rerender(<OfflineIndicator />);
    expect(screen.getByText('You are offline')).toBeInTheDocument();
  });

  it('should handle full offline-online-offline cycle', () => {
    const { rerender } = render(<OfflineIndicator />);

    // Start online
    mockUseOnlineStatus.mockReturnValue({ isOnline: true, wasOffline: false });
    rerender(<OfflineIndicator />);
    expect(screen.queryByText('You are offline')).not.toBeInTheDocument();
    expect(screen.queryByText('Back online')).not.toBeInTheDocument();

    // Go offline
    mockUseOnlineStatus.mockReturnValue({ isOnline: false, wasOffline: false });
    rerender(<OfflineIndicator />);
    expect(screen.getByText('You are offline')).toBeInTheDocument();

    // Come back online
    mockUseOnlineStatus.mockReturnValue({ isOnline: true, wasOffline: true });
    rerender(<OfflineIndicator />);
    expect(screen.queryByText('You are offline')).not.toBeInTheDocument();
    expect(screen.getByText('Back online')).toBeInTheDocument();

    // Wait for toast to dismiss
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText('Back online')).not.toBeInTheDocument();

    // Go offline again
    mockUseOnlineStatus.mockReturnValue({ isOnline: false, wasOffline: true });
    rerender(<OfflineIndicator />);
    expect(screen.getByText('You are offline')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes on SVG icons', () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: false, wasOffline: false });

    render(<OfflineIndicator />);

    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
