/**
 * Context App Search Adapter
 *
 * 한국어 사전 검색 설정
 */
import type { SearchConfig } from '../core/types';

export const contextSearchConfig: SearchConfig = {
  fields: ['korean', 'romanization', 'translations.en.word', 'translations.ko.word'],
  storeFields: ['id', 'korean', 'romanization', 'categoryId', 'difficulty'],
  searchOptions: {
    boost: {
      korean: 3,
      'translations.en.word': 2,
      romanization: 1.5,
    },
    fuzzy: 0.2,
    prefix: true,
  },
};
