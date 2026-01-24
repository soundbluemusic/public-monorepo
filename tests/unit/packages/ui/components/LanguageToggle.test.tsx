/**
 * @fileoverview Unit tests for LanguageToggle component
 */

import { LanguageToggle } from '@soundblue/ui/components';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('LanguageToggle', () => {
  it('should render an anchor element', () => {
    render(<LanguageToggle locale="en" />);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('should display EN when locale is en', () => {
    render(<LanguageToggle locale="en" />);
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('should display KR when locale is ko', () => {
    render(<LanguageToggle locale="ko" />);
    expect(screen.getByText('KR')).toBeInTheDocument();
  });

  it('should link to Korean path when locale is en', () => {
    render(<LanguageToggle locale="en" currentPath="/about" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/ko/about');
  });

  it('should link to English path when locale is ko', () => {
    render(<LanguageToggle locale="ko" currentPath="/about" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/about');
  });

  it('should handle root path correctly for English to Korean', () => {
    render(<LanguageToggle locale="en" currentPath="/" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/ko');
  });

  it('should handle root path correctly for Korean to English', () => {
    render(<LanguageToggle locale="ko" currentPath="/" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });

  it('should default to root path if currentPath is not provided', () => {
    render(<LanguageToggle locale="en" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/ko');
  });

  it('should have correct aria-label for English locale', () => {
    render(<LanguageToggle locale="en" />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'aria-label',
      'EN - Switch to Korean',
    );
  });

  it('should have correct aria-label for Korean locale', () => {
    render(<LanguageToggle locale="ko" />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'aria-label',
      'KR - Switch to English',
    );
  });

  it('should have correct title for English locale', () => {
    render(<LanguageToggle locale="en" />);
    expect(screen.getByRole('link')).toHaveAttribute('title', '한국어로 전환');
  });

  it('should have correct title for Korean locale', () => {
    render(<LanguageToggle locale="ko" />);
    expect(screen.getByRole('link')).toHaveAttribute('title', 'Switch to English');
  });

  it('should handle complex paths', () => {
    render(<LanguageToggle locale="en" currentPath="/entry/hello/details" />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/ko/entry/hello/details',
    );
  });
});
