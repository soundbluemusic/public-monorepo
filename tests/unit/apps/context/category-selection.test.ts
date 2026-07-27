import { findCategoryById } from '../../../../apps/context/app/lib/category-selection';
import { describe, expect, it } from 'vitest';

const categories = [
  { id: 'greetings', name: 'Greetings' },
  { id: 'food', name: 'Food' },
] as const;

describe('findCategoryById', () => {
  it('returns the matching production category shape', () => {
    expect(findCategoryById(categories, 'food')).toEqual({ id: 'food', name: 'Food' });
  });

  it('returns null for empty and unknown ids', () => {
    expect(findCategoryById(categories, '')).toBeNull();
    expect(findCategoryById(categories, 'missing')).toBeNull();
  });

  it('does not interpret special object keys', () => {
    expect(findCategoryById(categories, '__proto__')).toBeNull();
    expect(findCategoryById(categories, 'constructor')).toBeNull();
  });
});
