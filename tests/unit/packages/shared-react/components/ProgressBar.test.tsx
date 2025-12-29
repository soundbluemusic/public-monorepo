/**
 * @fileoverview Unit tests for ProgressBar component
 */

import { ProgressBar } from '@soundblue/shared-react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('ProgressBar', () => {
  it('should render with default props', () => {
    render(<ProgressBar value={50} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });

  it('should handle percentage values', () => {
    render(<ProgressBar value={75} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '75');
  });

  it('should handle value/max format', () => {
    render(<ProgressBar value={30} max={60} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '30');
    expect(progressbar).toHaveAttribute('aria-valuemax', '60');
  });

  it('should apply size variants', () => {
    const { rerender } = render(<ProgressBar value={50} size="sm" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-1.5');

    rerender(<ProgressBar value={50} size="md" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-2');

    rerender(<ProgressBar value={50} size="lg" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-3');
  });

  it('should apply custom className', () => {
    render(<ProgressBar value={50} className="custom-class" />);
    expect(screen.getByRole('progressbar')).toHaveClass('custom-class');
  });

  it('should disable animation when noAnimation is true', () => {
    render(<ProgressBar value={50} noAnimation />);
    const bar = screen.getByRole('progressbar').querySelector('div');
    expect(bar).not.toHaveClass('transition-all');
  });

  it('should allow values outside 0-max range in aria-valuenow', () => {
    // Note: aria-valuenow reflects actual value, not clamped
    // The visual width is clamped via percentage calculation
    const { rerender } = render(<ProgressBar value={-10} />);
    let progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '-10');

    rerender(<ProgressBar value={150} />);
    progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '150');
  });

  it('should clamp visual width to max 100%', () => {
    // Value > max should show 100% width (capped by Math.min)
    render(<ProgressBar value={150} />);
    const bar = screen.getByRole('progressbar').querySelector('div');
    expect(bar).toHaveStyle({ width: '100%' });
  });

  it('should calculate correct width percentage', () => {
    render(<ProgressBar value={25} max={50} />);
    const bar = screen.getByRole('progressbar').querySelector('div');
    expect(bar).toHaveStyle({ width: '50%' });
  });
});
