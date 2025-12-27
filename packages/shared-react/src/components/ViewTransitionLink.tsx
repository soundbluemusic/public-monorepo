import { type ComponentPropsWithoutRef, type MouseEvent, useCallback } from 'react';
import { Link, type LinkProps, useNavigate } from 'react-router';
import { supportsViewTransitions } from '../hooks/useViewTransition';

export interface ViewTransitionLinkProps extends LinkProps {
  /** View transition name for shared element transitions */
  viewTransitionName?: string;
}

/**
 * Link component that uses View Transitions API for smooth page transitions
 *
 * @example
 * ```tsx
 * <ViewTransitionLink to="/entry/hello">
 *   Hello
 * </ViewTransitionLink>
 *
 * // With shared element transition
 * <ViewTransitionLink to="/entry/hello" viewTransitionName="entry-card">
 *   <Card style={{ viewTransitionName: 'entry-card' }} />
 * </ViewTransitionLink>
 * ```
 */
export function ViewTransitionLink({
  to,
  children,
  onClick,
  viewTransitionName,
  style,
  ...props
}: ViewTransitionLinkProps) {
  const navigate = useNavigate();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      // Call original onClick if provided
      onClick?.(e);

      // If default was prevented or modifier keys pressed, don't handle
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) {
        return;
      }

      // If View Transitions not supported, let the Link handle it normally
      if (!supportsViewTransitions()) {
        return;
      }

      // Prevent default and use View Transitions
      e.preventDefault();

      document.startViewTransition(() => {
        navigate(to.toString());
      });
    },
    [navigate, onClick, to],
  );

  const combinedStyle = viewTransitionName ? { ...style, viewTransitionName } : style;

  return (
    <Link to={to} onClick={handleClick} style={combinedStyle} {...props}>
      {children}
    </Link>
  );
}

export interface ViewTransitionButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Path to navigate to */
  to: string;
  /** View transition name for shared element transitions */
  viewTransitionName?: string;
}

/**
 * Button component that navigates with View Transitions API
 *
 * @example
 * ```tsx
 * <ViewTransitionButton to="/settings">
 *   Settings
 * </ViewTransitionButton>
 * ```
 */
export function ViewTransitionButton({
  to,
  children,
  onClick,
  viewTransitionName,
  style,
  ...props
}: ViewTransitionButtonProps) {
  const navigate = useNavigate();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);

      if (e.defaultPrevented) {
        return;
      }

      if (!supportsViewTransitions()) {
        navigate(to);
        return;
      }

      document.startViewTransition(() => {
        navigate(to);
      });
    },
    [navigate, onClick, to],
  );

  const combinedStyle = viewTransitionName ? { ...style, viewTransitionName } : style;

  return (
    <button type="button" onClick={handleClick} style={combinedStyle} {...props}>
      {children}
    </button>
  );
}
