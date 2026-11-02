import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../../apps/roots/app/data/concepts', () => ({
  allConcepts: [{ id: 'shared-concept' }, { id: 'shared-concept' }, { id: 'unique-concept' }],
  allTags: [],
}));

import { GET } from '../../../../apps/roots/src/pages/sitemap.xml';

describe('Roots sitemap integrity', () => {
  it('publishes each English and Korean concept URL once when source records overlap', async () => {
    const response = await GET({} as Parameters<typeof GET>[0]);
    const xml = await response.text();
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(new Set(locations).size).toBe(locations.length);
    expect(locations.filter((url) => url?.endsWith('/concept/shared-concept'))).toHaveLength(2);
    expect(locations.filter((url) => url?.endsWith('/concept/unique-concept'))).toHaveLength(2);
  });
});
