/**
 * Roots App Search Adapter
 *
 * 수학 개념 검색 설정
 */
import type { SearchConfig } from '../core/types';

export const rootsSearchConfig: SearchConfig = {
  fields: ['name.ko', 'name.en', 'tags', 'field', 'subfield'],
  storeFields: ['id', 'name', 'field', 'subfield', 'difficulty'],
  searchOptions: {
    boost: {
      'name.ko': 3,
      'name.en': 3,
      tags: 1.5,
      field: 1,
    },
    fuzzy: 0.2,
    prefix: true,
  },
};
