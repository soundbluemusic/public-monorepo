/**
 * Inject location/URL polyfill into built server files
 * This is needed because TanStack Router accesses location.protocol during module initialization
 * and Cloudflare Workers don't have globalThis.location
 *
 * Strategy (Vite 7): Patch worker-entry-*.js in assets/
 * Strategy (Vite 8+): Patch index.js directly (all-in-one bundle)
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist/server');
const assetsDir = path.join(distDir, 'assets');

// Polyfill to inject at the very start of the bundle
const polyfill = `// CF Workers Polyfill
if(typeof globalThis.location==='undefined'){globalThis.location={protocol:'https:',host:'permissive.soundbluemusic.com',hostname:'permissive.soundbluemusic.com',port:'',pathname:'/',search:'',hash:'',href:'https://permissive.soundbluemusic.com/',origin:'https://permissive.soundbluemusic.com'};}
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
  console.log('❌ No target file found for patching');
  process.exit(1);
}

// Read and patch target file
let content = fs.readFileSync(targetPath, 'utf8');

// Patch 1: Handle undefined 'e' in TanStack Router's URL class
const urlClassPattern = /\(this\.#f=e\.protocol,this\.#m=e\.host,this\.#g=e\.pathname,this\.#y=e\.search\)/g;
const urlClassReplacement = "(this.#f=(e||{}).protocol||'https:',this.#m=(e||{}).host||'',this.#g=(e||{}).pathname||'/',this.#y=(e||{}).search||'')";

if (urlClassPattern.test(content)) {
  content = content.replace(urlClassPattern, urlClassReplacement);
  console.log('✅ Patched TanStack Router URL class');
}

// Add polyfill at start if not already present
if (!content.startsWith('// CF Workers Polyfill')) {
  content = polyfill + content;
  console.log('✅ Injected location polyfill');
}

fs.writeFileSync(targetPath, content);
console.log(`✅ Saved ${targetFile}`);

console.log('✨ Polyfill injection complete');
