import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

// Inspect the active workspace dependency graph. This never starts a browser.
const listing = spawnSync('pnpm', ['list', '-r', 'zod', '--depth', 'Infinity', '--json'], {
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
});
assert.equal(listing.status, 0, listing.stderr);
const packages = new Map();
function visit(node) {
  if (!node || typeof node !== 'object') return;
  for (const group of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    for (const [name, dependency] of Object.entries(node[group] ?? {})) {
      if (name === 'zod') packages.set(dependency.path, dependency.version);
      visit(dependency);
    }
  }
}
for (const workspace of JSON.parse(listing.stdout)) visit(workspace);
assert.ok(packages.size > 0, 'The Zod guard must not silently skip all dependencies');

for (const [directory, version] of packages) {
  test(`Zod ${version}: collection bounds stop parsing in CJS and ESM`, async () => {
    const numericVersion = version.split('(')[0];
    const [major, minor, patch] = numericVersion.split('.').map(Number);
    assert.ok(
      numericVersion === '3.25.76' ||
        major > 4 ||
        (major === 4 && (minor > 6 || (minor === 6 && patch >= 6))),
      `Unreviewed vulnerable Zod version: ${version}`,
    );
    const manifest = JSON.parse(readFileSync(path.join(directory, 'package.json'), 'utf8'));
    const require = createRequire(import.meta.url);
    const commonjs = require(path.join(directory, manifest.main));
    const esm = await import(pathToFileURL(path.join(directory, manifest.module)).href);
    for (const { z } of [commonjs, esm]) {
      let parsed = 0;
      let refined = 0;
      const element = z.string().refine(() => {
        parsed++;
        return true;
      });
      const cases = [
        [z.array(element).max(2), ['a', 'b', 'c']],
        [z.array(element).length(2), ['a', 'b', 'c']],
        [z.set(element).max(2), new Set(['a', 'b', 'c'])],
        [z.set(element).size(2), new Set(['a', 'b', 'c'])],
      ];
      for (const [bounded, input] of cases) {
        const schema = bounded.refine(() => {
          refined++;
          return true;
        });
        for (const result of [schema.safeParse(input), await schema.safeParseAsync(input)]) {
          assert.equal(result.success, false);
          assert.equal(result.error.issues.length, 1);
          assert.equal(result.error.issues[0].code, 'too_big');
        }
      }
      assert.equal(parsed, 0, 'Oversized input must not visit any element');
      assert.equal(refined, 0, 'Oversized input must not run collection refinements');
      assert.deepEqual(z.array(z.string()).max(2).parse(['a', 'b']), ['a', 'b']);
      assert.equal(z.array(z.string()).min(2).safeParse(['a']).success, false);
      // Chromium BiDi depends on the Zod 3 error.errors API.
      if (major === 3) assert.ok(Array.isArray(z.string().safeParse(123).error.errors));
    }
  });
}
