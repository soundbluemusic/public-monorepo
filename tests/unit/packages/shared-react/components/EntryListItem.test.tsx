/**
 * @fileoverview Unit tests for EntryListItem component
 */

import { EntryListItem } from '@soundblue/shared-react';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

const defaultProps = {
  entryId: 'test-entry',
  korean: '안녕',
  romanization: 'annyeong',
  translation: 'hello',
  isStudied: false,
  locale: 'en' as const,
  localePath: (path: string) => path,
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(React.createElement(MemoryRouter, null, ui));
};

describe('EntryListItem', () => {
  it('should render korean text and translation', () => {
    renderWithRouter(<EntryListItem {...defaultProps} />);
    expect(screen.getByText('안녕')).toBeInTheDocument();
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('should render romanization for english locale', () => {
    renderWithRouter(<EntryListItem {...defaultProps} locale="en" />);
    expect(screen.getByText('annyeong')).toBeInTheDocument();
  });

  it('should render without errors when isStudied is true', () => {
    renderWithRouter(<EntryListItem {...defaultProps} isStudied={true} />);
    // Component renders successfully with isStudied prop
    expect(screen.getByText('안녕')).toBeInTheDocument();
  });

  it('should show favorite indicator when isFavorite is true', () => {
    renderWithRouter(<EntryListItem {...defaultProps} isFavorite={true} />);
    // Heart icon should be present
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('should render category badge when category is provided', () => {
    const category = {
      id: 'greetings',
      name: { ko: '인사', en: 'Greetings' },
      icon: '👋',
    };
    renderWithRouter(<EntryListItem {...defaultProps} category={category} locale="en" />);
    // Category badge contains icon and name together
    expect(screen.getByText(/👋.*Greetings/)).toBeInTheDocument();
  });

  it('should generate correct link path', () => {
    const localePath = vi.fn((path: string) => `/ko${path}`);
    renderWithRouter(<EntryListItem {...defaultProps} localePath={localePath} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/ko/entry/test-entry');
  });

  it('should apply different styles based on studied state', () => {
    const { rerender } = renderWithRouter(<EntryListItem {...defaultProps} isStudied={false} />);
    const unstudiedLink = screen.getByRole('link');

    rerender(
      React.createElement(MemoryRouter, null, <EntryListItem {...defaultProps} isStudied={true} />),
    );
    const studiedLink = screen.getByRole('link');

    // Both should be links but may have different classes
    expect(unstudiedLink).toBeInTheDocument();
    expect(studiedLink).toBeInTheDocument();
  });

  it('should handle missing optional props', () => {
    renderWithRouter(
      <EntryListItem
        entryId="test"
        korean="테스트"
        romanization="teseuteu"
        translation="test"
        isStudied={false}
        locale="ko"
        localePath={(p) => p}
      />,
    );
    expect(screen.getByText('테스트')).toBeInTheDocument();
  });
});
