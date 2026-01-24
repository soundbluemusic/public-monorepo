/**
 * @fileoverview Unit tests for ProgressBar component
 */

import { ProgressBar } from '@soundblue/ui/primitives';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('ProgressBar', () => {
  it('should render with progressbar role', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should have correct aria attributes', () => {
    render(<ProgressBar value={30} max={100} />);
    const progressbar = screen.getByRole('progressbar');

    expect(progressbar).toHaveAttribute('aria-valuenow', '30');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-label', 'Progress');
  });

  it('should use default max of 100', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
  });

  it('should apply custom label', () => {
    render(<ProgressBar value={50} label="Loading data" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Loading data');
  });

  it('should calculate percentage correctly', () => {
    const { container } = render(<ProgressBar value={75} max={100} />);
    const innerBar = container.querySelector('[role="progressbar"] > div');
    expect(innerBar).toHaveAttribute('style', expect.stringContaining('width: 75%'));
  });

  it('should handle custom max value', () => {
    const { container } = render(<ProgressBar value={25} max={50} />);
    const innerBar = container.querySelector('[role="progressbar"] > div');
    expect(innerBar).toHaveAttribute('style', expect.stringContaining('width: 50%')); // 25/50 = 50%
  });

  it('should cap at 100%', () => {
    const { container } = render(<ProgressBar value={150} max={100} />);
    const innerBar = container.querySelector('[role="progressbar"] > div');
    expect(innerBar).toHaveAttribute('style', expect.stringContaining('width: 100%'));
  });

  it('should handle zero max gracefully', () => {
    const { container } = render(<ProgressBar value={50} max={0} />);
    const innerBar = container.querySelector('[role="progressbar"] > div');
    expect(innerBar).toHaveAttribute('style', expect.stringContaining('width: 0%'));
  });

  describe('sizes', () => {
    it('should apply sm size', () => {
      const { container } = render(<ProgressBar value={50} size="sm" />);
      expect(container.firstChild).toHaveClass('h-1.5');
    });

    it('should apply md size (default)', () => {
      const { container } = render(<ProgressBar value={50} size="md" />);
      expect(container.firstChild).toHaveClass('h-2');
    });

    it('should apply lg size', () => {
      const { container } = render(<ProgressBar value={50} size="lg" />);
      expect(container.firstChild).toHaveClass('h-3');
    });
  });

  it('should have transition by default', () => {
    const { container } = render(<ProgressBar value={50} />);
    const innerBar = container.querySelector('[role="progressbar"] > div');
    expect(innerBar).toHaveClass('duration-300');
  });

  it('should disable animation when noAnimation is true', () => {
    const { container } = render(<ProgressBar value={50} noAnimation />);
    const innerBar = container.querySelector('[role="progressbar"] > div');
    expect(innerBar).not.toHaveClass('duration-300');
  });

  it('should apply custom className', () => {
    const { container } = render(<ProgressBar value={50} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
