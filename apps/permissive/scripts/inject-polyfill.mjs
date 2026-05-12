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

// Patch 1: Handle undefined 'e' in TanStack Router's URL class
// NOTE: This pattern matches MINIFIED private field names. If a future TanStack
// Router upgrade renames the minified fields, the regex will not match and we
// MUST fail the build loudly rather than ship a silently broken bundle.
const urlClassPattern = /\(this\.#f=e\.protocol,this\.#m=e\.host,this\.#g=e\.pathname,this\.#y=e\.search\)/g;
const urlClassReplacement = "(this.#f=(e||{}).protocol||'https:',this.#m=(e||{}).host||'',this.#g=(e||{}).pathname||'/',this.#y=(e||{}).search||'')";

if (!urlClassPattern.test(content)) {
  console.error('❌ FATAL: TanStack Router URL class pattern not found in bundle.');
  console.error('   Expected minified pattern: (this.#f=e.protocol,this.#m=e.host,...)');
  console.error('   This likely means TanStack Router was upgraded and changed its');
  console.error('   internal minified field names. The polyfill cannot be applied safely.');
  console.error('   Update urlClassPattern in this script to match the new bundle.');
  process.exit(1);
}
content = content.replace(urlClassPattern, urlClassReplacement);
console.log('✅ Patched TanStack Router URL class');

// Add polyfill at start if not already present
if (!content.startsWith('// CF Workers Polyfill')) {
  content = polyfill + content;
  console.log('✅ Injected location polyfill');
}

fs.writeFileSync(targetPath, content);
console.log(`✅ Saved ${targetFile}`);

console.log('✨ Polyfill injection complete');
