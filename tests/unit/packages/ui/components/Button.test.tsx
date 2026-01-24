/**
 * @fileoverview Unit tests for Button and LinkButton components
 */

import { Button, LinkButton } from '@soundblue/ui/components';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('Button', () => {
  it('should render a button element', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should have type="button" by default', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should allow type override', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should call onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should forward ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('should support disabled state', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  describe('variants', () => {
    it('should apply default variant styles', () => {
      render(<Button variant="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
    });

    it('should apply destructive variant styles', () => {
      render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-red-600');
    });

    it('should apply outline variant styles', () => {
      render(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toHaveClass('border');
    });

    it('should apply secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-gray-100');
    });

    it('should apply ghost variant styles', () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-transparent');
    });

    it('should apply link variant styles', () => {
      render(<Button variant="link">Link</Button>);
      expect(screen.getByRole('button')).toHaveClass('underline-offset-4');
    });

    it('should apply glass variant styles', () => {
      render(<Button variant="glass">Glass</Button>);
      expect(screen.getByRole('button')).toHaveClass('backdrop-blur-[24px]');
    });
  });

  describe('sizes', () => {
    it('should apply default size styles', () => {
      render(<Button size="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-11');
    });

    it('should apply sm size styles', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-9');
    });

    it('should apply lg size styles', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-12');
    });

    it('should apply xl size styles', () => {
      render(<Button size="xl">Extra Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-14');
    });

    it('should apply icon size styles', () => {
      render(<Button size="icon">I</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-10');
      expect(screen.getByRole('button')).toHaveClass('w-10');
    });

    it('should apply icon-sm size styles', () => {
      render(<Button size="icon-sm">I</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-8');
      expect(screen.getByRole('button')).toHaveClass('w-8');
    });

    it('should apply icon-lg size styles', () => {
      render(<Button size="icon-lg">I</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-12');
      expect(screen.getByRole('button')).toHaveClass('w-12');
    });
  });
});

describe('LinkButton', () => {
  it('should render an anchor element', () => {
    render(<LinkButton href="/test">Link</LinkButton>);
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByText('Link')).toBeInTheDocument();
  });

  it('should have correct href attribute', () => {
    render(<LinkButton href="/test">Link</LinkButton>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
  });

  it('should forward ref', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <LinkButton ref={ref} href="/test">
        Link
      </LinkButton>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('should apply custom className', () => {
    render(
      <LinkButton href="/test" className="custom-class">
        Link
      </LinkButton>,
    );
    expect(screen.getByRole('link')).toHaveClass('custom-class');
  });

  it('should apply variant styles', () => {
    render(
      <LinkButton href="/test" variant="destructive">
        Delete
      </LinkButton>,
    );
    expect(screen.getByRole('link')).toHaveClass('bg-red-600');
  });

  it('should apply size styles', () => {
    render(
      <LinkButton href="/test" size="lg">
        Large
      </LinkButton>,
    );
    expect(screen.getByRole('link')).toHaveClass('h-12');
  });

  it('should support additional anchor props', () => {
    render(
      <LinkButton href="/test" target="_blank" rel="noopener noreferrer">
        External
      </LinkButton>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
