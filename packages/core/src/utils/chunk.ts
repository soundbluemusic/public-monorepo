/**
 * Array Chunk Utility
 *
 * 배열을 지정된 크기의 청크로 분할합니다.
 *
 * @example
 * ```ts
 * const items = [1, 2, 3, 4, 5, 6, 7];
 * const chunks = chunkArray(items, 3);
 * // [[1, 2, 3], [4, 5, 6], [7]]
 * ```
 */

export function chunkArray<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Chunk size must be positive');
  }

  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * 배열을 균등하게 N개의 그룹으로 분할
 */
export function splitIntoGroups<T>(array: T[], numGroups: number): T[][] {
  if (numGroups <= 0) {
    throw new Error('Number of groups must be positive');
  }

  const groups: T[][] = Array.from({ length: numGroups }, () => []);

  array.forEach((item, index) => {
    groups[index % numGroups]?.push(item);
  });

  return groups.filter((g) => g.length > 0);
}
