/** Inspect already running dev servers without starting a browser or building. */
import { resolve } from 'node:path';
import { auditSite } from './lib/link-audit';

for (const [site, port] of [
  ['context', 3003],
  ['permissive', 3004],
  ['roots', 3005],
] as const) {
  try {
    const report = await auditSite(
      `http://localhost:${port}`,
      resolve('link-reports', `local-${site}`),
      true,
    );
    console.log(`${site}: ${report.pages} pages; ${report.failures.length} HTTP/network failures`);
    if (report.checkerError) console.error(`${site} CHECKER ERROR: ${report.checkerError}`);
    if (report.checkerError || report.failures.length) process.exitCode = 1;
  } catch (error) {
    console.error(`${site} CHECK INCOMPLETE: ${String(error)}. Start pnpm dev:${site} first.`);
    process.exitCode = 1;
  }
}
