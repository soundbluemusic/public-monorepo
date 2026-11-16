import { describe, expect, it } from 'vitest';
import { allConcepts, getConceptById } from '../../../../apps/roots/app/data/concepts';
import { subfields } from '../../../../apps/roots/app/data/subfields';

describe('Roots proven-content policy', () => {
  it('does not expose the excluded continuum hypothesis or links to it', () => {
    expect(getConceptById('continuum-hypothesis')).toBeUndefined();
    const visibleContent = JSON.stringify({ allConcepts, subfields });
    expect(visibleContent).not.toMatch(/continuum-hypothesis|continuum hypothesis|연속체 가설/i);
  });
});
