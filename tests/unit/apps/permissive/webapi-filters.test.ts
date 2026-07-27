import type { WebAPI } from '../../../../apps/permissive/app/data/web-apis';
import { filterWebApis } from '../../../../apps/permissive/app/lib/web-api-filters';
import { LIMITS } from '@soundblue/core/validation';
import { describe, expect, it } from 'vitest';

const apis: WebAPI[] = [
  {
    name: 'View Transitions API',
    description: 'Smooth page transitions',
    descriptionKo: '부드러운 페이지 전환',
    category: 'Modern Web Platform',
    support: '72%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API',
  },
  {
    name: 'IntersectionObserver',
    description: 'Detect element visibility',
    descriptionKo: '엘리먼트 가시성 감지',
    category: 'DOM & Observers',
    support: '97%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver',
  },
  {
    name: 'Web Storage API',
    description: 'Store data in the browser',
    descriptionKo: '브라우저에 데이터 저장',
    category: 'Storage & Data',
    support: '99%',
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API',
  },
];

describe('filterWebApis', () => {
  it('returns a copy for an empty query', () => {
    const result = filterWebApis(apis, '');
    expect(result).toEqual(apis);
    expect(result).not.toBe(apis);
  });

  it('matches names and both descriptions', () => {
    expect(filterWebApis(apis, 'storage').map(({ name }) => name)).toEqual([
      'Web Storage API',
    ]);
    expect(filterWebApis(apis, 'visibility').map(({ name }) => name)).toEqual([
      'IntersectionObserver',
    ]);
    expect(filterWebApis(apis, '전환').map(({ name }) => name)).toEqual([
      'View Transitions API',
    ]);
  });

  it('normalizes, bounds, and safely handles arbitrary input', () => {
    expect(filterWebApis(apis, '  STORAGE  ').map(({ name }) => name)).toEqual([
      'Web Storage API',
    ]);
    expect(() => filterWebApis(apis, 'a'.repeat(LIMITS.SEARCH_LENGTH + 100))).not.toThrow();
    expect(filterWebApis(apis, "'; DELETE FROM apis; --")).toEqual([]);
  });
});
