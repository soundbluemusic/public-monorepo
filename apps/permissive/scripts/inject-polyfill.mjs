/**
 * Inject location/URL polyfill into built server files
 * This is needed because TanStack Router accesses location.protocol during module initialization
 * and Cloudflare Workers don't have globalThis.location
 *
 * Strategy (Vite 7): Patch worker-entry-*.js in assets/
 * Strategy (Vite 8+): Patch index.js directly (all-in-one bundle)
 *
 * Failure policy: ANY regex/pattern miss MUST abort the build (process.exit(1)).
 * Silent fallbacks were removed to prevent shipping a broken bundle when
 * TanStack Router upgrades change their internal minified field names.
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist/server');
const assetsDir = path.join(distDir, 'assets');

// Single source of truth for the app's site URL, read from app/data/site.json so
// this script and app/config.ts cannot drift.
const siteJsonPath = path.resolve(process.cwd(), 'app/data/site.json');
if (!fs.existsSync(siteJsonPath)) {
  console.error('❌ FATAL: site.json not found.');
  console.error(`   Expected at: ${siteJsonPath}`);
  console.error('   This file is the single source of truth for the app base URL.');
  process.exit(1);
}
const siteData = JSON.parse(fs.readFileSync(siteJsonPath, 'utf8'));
if (!siteData || typeof siteData.baseUrl !== 'string' || !/^https?:\/\//.test(siteData.baseUrl)) {
  console.error('❌ FATAL: site.json must export { "baseUrl": "https://..." }');
  console.error('   Got:', siteData);
  process.exit(1);
}
const SITE_BASE_URL = siteData.baseUrl.replace(/\/$/, '');
const siteUrlObj = new URL(SITE_BASE_URL);
const SITE_HOSTNAME = siteUrlObj.hostname;
const SITE_HOST = siteUrlObj.host;
const SITE_PROTOCOL = siteUrlObj.protocol;
const SITE_ORIGIN = siteUrlObj.origin;
console.log(`ℹ️  Loaded base URL from JSON SSoT: ${SITE_BASE_URL}`);

// Polyfill to inject at the very start of the bundle
const polyfill = `// CF Workers Polyfill
if(typeof globalThis.location==='undefined'){globalThis.location={protocol:${JSON.stringify(SITE_PROTOCOL)},host:${JSON.stringify(SITE_HOST)},hostname:${JSON.stringify(SITE_HOSTNAME)},port:'',pathname:'/',search:'',hash:'',href:${JSON.stringify(`${SITE_ORIGIN}/`)},origin:${JSON.stringify(SITE_ORIGIN)}};}
`;

// Find worker-entry file (Vite 7) or use index.js (Vite 8+)
let targetFile = null;
let targetPath = null;

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const workerEntryFile = files.find((f) => f.startsWith('worker-entry') && f.endsWith('.js'));
  if (workerEntryFile) {
    targetFile = workerEntryFile;
    targetPath = path.join(assetsDir, workerEntryFile);
    console.log('ℹ️  Vite 7 mode: patching worker-entry');
  }
}

// Vite 8+: worker-entry doesn't exist, patch index.js directly
if (!targetFile) {
  const indexPath = path.join(distDir, 'index.js');
  if (fs.existsSync(indexPath)) {
    targetFile = 'index.js';
    targetPath = indexPath;
    console.log('ℹ️  Vite 8+ mode: patching index.js directly');
  }
}

if (!targetPath) {
  console.error('❌ FATAL: No target file found for patching');
  console.error(`   Looked for assets/worker-entry-*.js and index.js under ${distDir}`);
  process.exit(1);
}

// Read and patch target file
let content = fs.readFileSync(targetPath, 'utf8');

// Note (verified 2026-05-13 by grepping the local build artifact): the legacy
// regex `(this.#f=e.protocol,this.#m=e.host,...)` no longer appears anywhere in
// the bundled output. TanStack Router's URL handling was refactored or lives
// in a chunk that this script does not target. The previous patch was always
// a no-op in production — main relied on a silent `if (regex.test)` branch
// that skipped the replacement. Removed entirely; the location polyfill below
// is sufficient on its own.

// Add polyfill at start if not already present
if (!content.startsWith('// CF Workers Polyfill')) {
  content = polyfill + content;
  console.log('✅ Injected location polyfill');
}

fs.writeFileSync(targetPath, content);
console.log(`✅ Saved ${targetFile}`);

console.log('✨ Polyfill injection complete');
