import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { auditSite } from './lib/link-audit';

const sites = ['context', 'permissive', 'roots'] as const;
const requested = process.argv
  .slice(2)
  .join(',')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const selected = requested.length
  ? sites.filter((site) =>
      requested.some((value) => value === site || value === `https://${site}.soundbluemusic.com`),
    )
  : sites;
if (
  !selected.length ||
  requested.some(
    (value) =>
      !sites.some((site) => value === site || value === `https://${site}.soundbluemusic.com`),
  )
) {
  throw new Error('Use context, permissive, roots, or their exact production origins.');
}
const output = resolve('link-reports');
mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, 'preflight.txt'), '');
const preflight = spawnSync(
  'lychee',
  ['--config', '.lychee.toml', '--dump', resolve(output, 'preflight.txt')],
  { encoding: 'utf8' },
);
if (preflight.error || preflight.status !== 0) {
  const message = `CHECKER ERROR: ${preflight.error?.message ?? preflight.stderr}`;
  writeFileSync(resolve(output, 'summary.md'), `${message}\n\nNo site links were checked.\n`);
  console.error(message);
  process.exitCode = 1;
} else {
  const rows = [
    '| Site | State | Sitemap pages | Missing/invalid | Server | Blocked | Network |',
    '|---|---|---:|---:|---:|---:|---:|',
  ];
  for (const site of sites) {
    if (!selected.includes(site)) {
      rows.push(`| ${site} | Skipped | | | | | |`);
      continue;
    }
    try {
      const report = await auditSite(`https://${site}.soundbluemusic.com`, resolve(output, site));
      const count = (kind: string) =>
        report.failures.filter((failure) => failure.kind === kind).length;
      const state = report.checkerError
        ? 'Checker error'
        : report.failures.length
          ? 'Needs attention'
          : 'Pass';
      rows.push(
        `| ${site} | ${state} | ${report.pages} | ${count('broken')} | ${count('server')} | ${count('blocked')} | ${count('network')} |`,
      );
      console.log(rows.at(-1));
      if (report.checkerError) console.error(`CHECKER ERROR: ${report.checkerError}`);
      // Blocked and network responses stay actionable, but are never called broken links.
      if (report.checkerError || report.failures.length) process.exitCode = 1;
    } catch (error) {
      const message = String(error);
      writeFileSync(resolve(output, `${site}-checker-error.txt`), message);
      console.error(`${site} CHECKER ERROR: ${message}`);
      rows.push(`| ${site} | Incomplete: sitemap/checker error | | | | | |`);
      process.exitCode = 1;
    }
  }
  const summary = `${rows.join('\n')}\n\nOnly Missing/invalid counts confirmed HTTP 4xx failures other than access blocks. Incomplete checks provide no total broken-link count. Full evidence is in link-reports.\n`;
  writeFileSync(resolve(output, 'summary.md'), summary);
  // biome-ignore lint/suspicious/noUndeclaredEnvVars: GitHub supplies this output file to this standalone CLI.
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(
      // biome-ignore lint/suspicious/noUndeclaredEnvVars: GitHub output path; this CLI is not cached by Turbo.
      process.env.GITHUB_STEP_SUMMARY,
      summary,
    );
  console.log(summary);
}
