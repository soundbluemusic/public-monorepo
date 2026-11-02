# Dependency security patches

## Zod 3 compatibility backport

GHSA-mrhx-c7xc-m3w5 is fixed upstream in Zod 4.6.6. All active Zod 4 dependencies use 4.6.6 or later. Chromium BiDi, used by Lighthouse and size-limit, still requires Zod 3 and its `error.errors` API. Replacing it with Zod 4 breaks that API.

`patches/zod@3.25.76.patch` backports the upstream early size rejection to Zod 3 arrays and sets. Oversized `.max()`, `.length()` and `.size()` inputs stop before parsing elements or running refinements, in both CJS and ESM. Zod 3 maps have no built-in size bound. Unbounded collections retain normal Zod behavior; callers must set input limits.

`pnpm audit:security` first tests every active workspace Zod dependency, including synchronous and asynchronous parsing, supported inputs, and the legacy error API. It fails if a vulnerable Zod 4 version returns or if the Zod 3 patch is absent. The audit policy also refuses the exception if this advisory reports any version other than 3.25.76. Only after this check does it omit this single version-based advisory from the high-severity audit gate. No other advisory is ignored. `pnpm audit` remains available and still reports the original version-based advisory.

Remove the backport and single-advisory exception when upstream Chromium BiDi no longer requires Zod 3.

Sources: [advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), [upstream fix](https://github.com/colinhacks/zod/commit/a0ebf97).
