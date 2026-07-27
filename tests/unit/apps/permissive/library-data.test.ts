import { categoryMeta, libraries } from '../../../../apps/permissive/app/data/libraries';
import { libraryOrder } from '../../../../apps/permissive/app/data/libraries/library-order';
import { describe, expect, it } from 'vitest';

describe('Permissive library data modules', () => {
  it('preserves the public library order after category splitting', () => {
    expect(libraries.map((library) => library.name)).toEqual(libraryOrder);
  });

  it('keeps library names unique', () => {
    const names = libraries.map((library) => library.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('uses only declared categories', () => {
    const validCategories = new Set(categoryMeta.map((category) => category.name.en));
    expect(
      libraries.every((library) =>
        library.categories.every((category) => validCategories.has(category)),
      ),
    ).toBe(true);
  });
});
