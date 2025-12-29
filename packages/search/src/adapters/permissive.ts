/**
 * Permissive App Search Adapter
 *
 * 라이브러리/API 검색 설정
 */
import type { SearchConfig } from '../core/types';

export const librarySearchConfig: SearchConfig = {
  fields: ['name', 'description', 'descriptionKo', 'category', 'tags'],
  storeFields: ['name', 'description', 'descriptionKo', 'category', 'license', 'github'],
  searchOptions: {
    boost: {
      name: 3,
      description: 1.5,
      descriptionKo: 1.5,
      category: 1,
    },
    fuzzy: 0.2,
    prefix: true,
  },
};

export const webApiSearchConfig: SearchConfig = {
  fields: ['name', 'description', 'descriptionKo', 'category'],
  storeFields: ['name', 'description', 'descriptionKo', 'category', 'support', 'mdnUrl'],
  searchOptions: {
    boost: {
      name: 3,
      description: 1.5,
      descriptionKo: 1.5,
    },
    fuzzy: 0.2,
    prefix: true,
  },
};
