import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const advisoryId = 'GHSA-mrhx-c7xc-m3w5';

export function reviewAudit(report) {
  assert.ok(report?.advisories && report.metadata, 'Incomplete registry audit response');
  const patched = [];
  const remaining = [];
  for (const advisory of Object.values(report.advisories)) {
    const backported =
      advisory.github_advisory_id === advisoryId &&
      advisory.module_name === 'zod' &&
      advisory.findings?.length > 0 &&
      advisory.findings.every(({ version }) => version === '3.25.76');
    (backported ? patched : remaining).push(advisory);
  }
  const blocking = remaining.filter(
    ({ severity }) => !['info', 'low', 'moderate'].includes(severity),
  );
  return { patched, remaining, blocking };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // The advisory exception is available only after every installed Zod passes its guard.
  const guard = spawnSync(
    process.execPath,
    [
      '--test',
      fileURLToPath(new URL('./zod-bounds.test.mjs', import.meta.url)),
      fileURLToPath(new URL('./audit-policy.test.mjs', import.meta.url)),
    ],
    { stdio: 'inherit' },
  );
  if (guard.status !== 0) process.exit(1);
  const audit = spawnSync('pnpm', ['audit', '--json'], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  assert.ok(audit.status === 0 || audit.status === 1, audit.stderr || 'Audit could not run');
  const result = reviewAudit(JSON.parse(audit.stdout));
  for (const advisory of result.patched)
    console.log(`Backport verified: ${advisory.github_advisory_id} (Zod 3.25.76)`);
  for (const advisory of result.remaining)
    console.log(
      `${advisory.severity}: ${advisory.module_name} ${advisory.github_advisory_id} ${advisory.url}`,
    );
  console.log(`Unpatched high/critical advisories: ${result.blocking.length}`);
  process.exitCode = result.blocking.length ? 1 : 0;
}
