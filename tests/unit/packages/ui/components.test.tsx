/**
 * @soundblue/ui - Components Tests
 *
 * React 컴포넌트 렌더링 및 동작 테스트
 */

import { Button, LinkButton } from '@soundblue/ui/components';
import {
  PageSkeleton,
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  SkeletonText,
} from '@soundblue/ui/primitives';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('@soundblue/ui/components', () => {
  describe('Button', () => {
    it('should render with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('should have type="button" by default', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('should support type="submit"', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should handle click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('should forward ref', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Test</Button>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('LinkButton', () => {
    it('should render as anchor element', () => {
      render(<LinkButton href="/test">Link</LinkButton>);
      expect(screen.getByRole('link', { name: 'Link' })).toBeInTheDocument();
    });

    it('should have correct href', () => {
      render(<LinkButton href="/test">Link</LinkButton>);
      expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
    });

    it('should apply custom className', () => {
      render(
        <LinkButton href="/test" className="custom-class">
          Link
        </LinkButton>,
      );
      expect(screen.getByRole('link')).toHaveClass('custom-class');
    });
  });
});

describe('@soundblue/ui/primitives - Skeleton', () => {
  describe('Skeleton', () => {
    it('should render with default classes', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should apply custom className', () => {
      const { container } = render(<Skeleton className="h-10 w-full" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('h-10', 'w-full');
    });

    it('should apply custom style', () => {
      const { container } = render(<Skeleton style={{ width: '200px' }} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '200px' });
    });
  });

  describe('SkeletonText', () => {
    it('should render 3 lines by default', () => {
      const { container } = render(<SkeletonText />);
      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines).toHaveLength(3);
    });

    it('should render specified number of lines', () => {
      const { container } = render(<SkeletonText lines={5} />);
      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines).toHaveLength(5);
    });

    it('should render 1 line when lines=1', () => {
      const { container } = render(<SkeletonText lines={1} />);
      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines).toHaveLength(1);
    });
  });

  describe('SkeletonCard', () => {
    it('should render card skeleton', () => {
      const { container } = render(<SkeletonCard />);
      expect(container.firstChild).toHaveClass('rounded-xl');
    });

    it('should apply custom className', () => {
      const { container } = render(<SkeletonCard className="w-full" />);
      expect(container.firstChild).toHaveClass('w-full');
    });
  });

  describe('SkeletonList', () => {
    it('should render 5 items by default', () => {
      const { container } = render(<SkeletonList />);
      const items = container.querySelectorAll('.flex.items-center');
      expect(items).toHaveLength(5);
    });

    it('should render specified count of items', () => {
      const { container } = render(<SkeletonList count={3} />);
      const items = container.querySelectorAll('.flex.items-center');
      expect(items).toHaveLength(3);
    });

    it('should render avatar placeholders', () => {
      const { container } = render(<SkeletonList count={1} />);
      const avatar = container.querySelector('.rounded-full');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('SkeletonGrid', () => {
    it('should render 6 cards by default', () => {
      render(<SkeletonGrid />);
      const cards = document.querySelectorAll('.rounded-xl.p-4');
      expect(cards).toHaveLength(6);
    });

    it('should render specified count of cards', () => {
      render(<SkeletonGrid count={4} />);
      const cards = document.querySelectorAll('.rounded-xl.p-4');
      expect(cards).toHaveLength(4);
    });

    it('should use grid layout', () => {
      const { container } = render(<SkeletonGrid />);
      expect(container.firstChild).toHaveClass('grid');
    });
  });

  describe('PageSkeleton', () => {
    it('should render page layout with default grid', () => {
      render(<PageSkeleton />);
      const cards = document.querySelectorAll('.rounded-xl.p-4');
      expect(cards).toHaveLength(6);
    });

    it('should render custom children', () => {
      render(
        <PageSkeleton>
          <div data-testid="custom-content">Custom</div>
        </PageSkeleton>,
      );
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('should not render default grid when children provided', () => {
      render(
        <PageSkeleton>
          <div>Custom</div>
        </PageSkeleton>,
      );
      const cards = document.querySelectorAll('.grid');
      expect(cards).toHaveLength(0);
    });
  });
});
