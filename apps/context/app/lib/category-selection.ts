export interface CategoryOption {
  id: string;
}

export function findCategoryById<T extends CategoryOption>(
  categories: readonly T[],
  categoryId: string,
): T | null {
  if (!categoryId) return null;
  return categories.find((category) => category.id === categoryId) ?? null;
}
