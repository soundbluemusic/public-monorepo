/**
 * @fileoverview Unit tests for Skeleton components
 */

import {
  PageSkeleton,
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  SkeletonText,
} from '@soundblue/ui/primitives';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Skeleton', () => {
  it('should render a div element', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('should have animate-pulse class', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('should apply custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should apply custom style', () => {
    const { container } = render(<Skeleton style={{ width: '100px' }} />);
    expect(container.firstChild).toHaveStyle({ width: '100px' });
  });
});

describe('SkeletonText', () => {
  it('should render default 3 lines', () => {
    const { container } = render(<SkeletonText />);
    const lines = container.querySelectorAll('.h-4');
    expect(lines.length).toBe(3);
  });

  it('should render specified number of lines', () => {
    const { container } = render(<SkeletonText lines={5} />);
    const lines = container.querySelectorAll('.h-4');
    expect(lines.length).toBe(5);
  });

  it('should make last line shorter (w-2/3)', () => {
    const { container } = render(<SkeletonText lines={3} />);
    const lines = container.querySelectorAll('.h-4');
    expect(lines[2]).toHaveClass('w-2/3');
  });

  it('should apply custom className', () => {
    const { container } = render(<SkeletonText className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('SkeletonCard', () => {
  it('should render with card styling', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.firstChild).toHaveClass('p-4');
    expect(container.firstChild).toHaveClass('rounded-xl');
  });

  it('should have header and text placeholders', () => {
    const { container } = render(<SkeletonCard />);
    // Header placeholder
    expect(container.querySelector('.h-6')).toBeInTheDocument();
    // Text placeholders
    expect(container.querySelectorAll('.h-4').length).toBeGreaterThan(0);
  });

  it('should apply custom className', () => {
    const { container } = render(<SkeletonCard className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('SkeletonList', () => {
  it('should render default 5 items', () => {
    const { container } = render(<SkeletonList />);
    const items = container.querySelectorAll('.flex.items-center.gap-3');
    expect(items.length).toBe(5);
  });

  it('should render specified number of items', () => {
    const { container } = render(<SkeletonList count={3} />);
    const items = container.querySelectorAll('.flex.items-center.gap-3');
    expect(items.length).toBe(3);
  });

  it('should have avatar placeholder for each item', () => {
    const { container } = render(<SkeletonList count={2} />);
    const avatars = container.querySelectorAll('.rounded-full');
    expect(avatars.length).toBe(2);
  });

  it('should apply custom className', () => {
    const { container } = render(<SkeletonList className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('SkeletonGrid', () => {
  it('should render default 6 cards', () => {
    const { container } = render(<SkeletonGrid />);
    const cards = container.querySelectorAll('.p-4');
    expect(cards.length).toBe(6);
  });

  it('should render specified number of cards', () => {
    const { container } = render(<SkeletonGrid count={4} />);
    const cards = container.querySelectorAll('.p-4');
    expect(cards.length).toBe(4);
  });

  it('should have default 3 columns', () => {
    const { container } = render(<SkeletonGrid />);
    expect(container.firstChild).toHaveClass('grid-cols-3');
  });

  it('should apply specified columns', () => {
    const { container } = render(<SkeletonGrid columns={2} />);
    expect(container.firstChild).toHaveClass('grid-cols-2');
  });

  it('should apply custom className', () => {
    const { container } = render(<SkeletonGrid className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('PageSkeleton', () => {
  it('should render header placeholders', () => {
    const { container } = render(<PageSkeleton />);
    // Large header
    expect(container.querySelector('.h-8')).toBeInTheDocument();
    // Subheader
    expect(container.querySelector('.h-5')).toBeInTheDocument();
  });

  it('should render default grid content', () => {
    const { container } = render(<PageSkeleton />);
    // Should have SkeletonGrid with 6 cards
    expect(container.querySelectorAll('.p-4').length).toBe(6);
  });

  it('should render custom children instead of default grid', () => {
    render(
      <PageSkeleton>
        <div data-testid="custom-content">Custom Content</div>
      </PageSkeleton>,
    );
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });
});
