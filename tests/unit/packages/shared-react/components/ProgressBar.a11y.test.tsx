/**
 * @fileoverview Accessibility tests for ProgressBar component
 */

import { ProgressBar } from '@soundblue/shared-react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

expect.extend(toHaveNoViolations);

describe('ProgressBar Accessibility', () => {
  it('should have no accessibility violations with default props', async () => {
    const { container } = render(<ProgressBar value={50} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with custom max', async () => {
    const { container } = render(<ProgressBar value={30} max={60} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations at 0%', async () => {
    const { container } = render(<ProgressBar value={0} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations at 100%', async () => {
    const { container } = render(<ProgressBar value={100} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    const { container } = render(<ProgressBar value={75} max={100} />);
    const progressbar = container.querySelector('[role="progressbar"]');

    expect(progressbar).toHaveAttribute('aria-valuenow', '75');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });
});
