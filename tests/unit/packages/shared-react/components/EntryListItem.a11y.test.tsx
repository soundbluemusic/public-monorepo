/**
 * @fileoverview Accessibility tests for EntryListItem component
 */

import { EntryListItem } from '@soundblue/shared-react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import * as React from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

expect.extend(toHaveNoViolations);

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

describe('EntryListItem Accessibility', () => {
  it('should have no accessibility violations with default props', async () => {
    const { container } = renderWithRouter(<EntryListItem {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when studied', async () => {
    const { container } = renderWithRouter(<EntryListItem {...defaultProps} isStudied={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with favorite', async () => {
    const { container } = renderWithRouter(<EntryListItem {...defaultProps} isFavorite={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with category', async () => {
    const category = {
      id: 'greetings',
      name: { ko: '인사', en: 'Greetings' },
      icon: '👋',
    };
    const { container } = renderWithRouter(<EntryListItem {...defaultProps} category={category} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible link', async () => {
    const { container } = renderWithRouter(<EntryListItem {...defaultProps} />);
    const link = container.querySelector('a');

    expect(link).toHaveAttribute('href');
    // Link should have accessible content (Korean text)
    expect(link?.textContent).toContain('안녕');
  });
});
