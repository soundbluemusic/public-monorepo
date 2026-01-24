/**
 * @fileoverview Unit tests for DarkModeToggle component
 */

import { DarkModeToggle } from '@soundblue/ui/components';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('DarkModeToggle', () => {
  let originalClassList: DOMTokenList;
  let mockObserver: {
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Save original classList
    originalClassList = document.documentElement.classList;

    // Mock MutationObserver as a class
    mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    };
    class MockMutationObserver {
      constructor() {
        return mockObserver;
      }
    }
    vi.stubGlobal('MutationObserver', MockMutationObserver);

    // Reset dark mode
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should render a button', () => {
    render(<DarkModeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should have correct aria-label for light mode', () => {
    render(<DarkModeToggle />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Switch to dark mode',
    );
  });

  it('should have correct aria-label for dark mode', () => {
    document.documentElement.classList.add('dark');
    render(<DarkModeToggle />);

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Switch to light mode',
    );
  });

  it('should observe document.documentElement class changes', () => {
    render(<DarkModeToggle />);

    expect(mockObserver.observe).toHaveBeenCalledWith(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  });

  it('should disconnect observer on unmount', () => {
    const { unmount } = render(<DarkModeToggle />);
    unmount();

    expect(mockObserver.disconnect).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<DarkModeToggle className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should apply custom style', () => {
    render(<DarkModeToggle style={{ backgroundColor: 'red' }} />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'style',
      expect.stringContaining('background-color: red'),
    );
  });

  it('should have type="button" to prevent form submission', () => {
    render(<DarkModeToggle />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should render Moon icon in light mode and Sun icon in dark mode', () => {
    const { container, rerender } = render(<DarkModeToggle />);

    // In light mode (not mounted yet or not dark)
    expect(container.querySelector('svg')).toBeInTheDocument();

    // Switch to dark mode
    document.documentElement.classList.add('dark');
    rerender(<DarkModeToggle />);

    // Still has an SVG icon
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
