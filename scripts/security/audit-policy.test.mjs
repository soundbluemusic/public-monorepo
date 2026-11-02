import assert from 'node:assert/strict';
import { test } from 'node:test';
import { reviewAudit } from './audit.mjs';

const zod = {
  github_advisory_id: 'GHSA-mrhx-c7xc-m3w5',
  module_name: 'zod',
  severity: 'high',
  findings: [{ version: '3.25.76' }],
};
const report = (...advisories) => ({
  advisories: Object.fromEntries(advisories.map((a, i) => [i, a])),
  metadata: {},
});

test('only the exact backported Zod 3 release can use the exception', () => {
  assert.equal(reviewAudit(report(zod)).patched.length, 1);
  for (const findings of [
    [{ version: '4.6.5' }],
    [{ version: '3.25.76' }, { version: '4.6.5' }],
    [],
  ]) {
    assert.equal(reviewAudit(report({ ...zod, findings })).blocking.length, 1);
  }
});
test('new high/critical or unknown advisories still block release', () => {
  for (const severity of ['high', 'critical', 'unknown']) {
    assert.equal(
      reviewAudit(report({ ...zod, severity, github_advisory_id: 'GHSA-new' })).blocking.length,
      1,
    );
  }
});
test('lower severity findings remain visible and malformed registry results fail', () => {
  assert.equal(
    reviewAudit(report({ ...zod, severity: 'moderate', github_advisory_id: 'GHSA-other' }))
      .remaining.length,
    1,
  );
  assert.throws(() => reviewAudit({}), /Incomplete/);
});
