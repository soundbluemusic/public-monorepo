/**
 * Inject location/URL polyfill into built server files
 * This is needed because TanStack Router accesses location.protocol during module initialization
 * and Cloudflare Workers don't have globalThis.location
 *
 * Strategy:
 * 1. Inject location polyfill at the start of worker-entry
 * 2. Patch TanStack Router's URL class to handle undefined arguments
 * 3. Fix index.js to export the correct handler
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist/server');
const assetsDir = path.join(distDir, 'assets');

// Polyfill to inject at the very start of the bundle
const polyfill = `// CF Workers Polyfill
if(typeof globalThis.location==='undefined'){globalThis.location={protocol:'https:',host:'permissive.soundbluemusic.com',hostname:'permissive.soundbluemusic.com',port:'',pathname:'/',search:'',hash:'',href:'https://permissive.soundbluemusic.com/',origin:'https://permissive.soundbluemusic.com'};}
`;

// Find and patch the worker-entry file
let workerEntryFile = null;
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  workerEntryFile = files.find((f) => f.startsWith('worker-entry') && f.endsWith('.js'));
}

if (!workerEntryFile) {
  console.log('❌ worker-entry file not found');
  process.exit(1);
}

// Read and patch worker-entry
const workerEntryPath = path.join(assetsDir, workerEntryFile);
let workerContent = fs.readFileSync(workerEntryPath, 'utf8');

// Patch 1: Handle undefined 'e' in TanStack Router's URL class
const urlClassPattern = /\(this\.#f=e\.protocol,this\.#m=e\.host,this\.#g=e\.pathname,this\.#y=e\.search\)/g;
const urlClassReplacement = "(this.#f=(e||{}).protocol||'https:',this.#m=(e||{}).host||'',this.#g=(e||{}).pathname||'/',this.#y=(e||{}).search||'')";

if (urlClassPattern.test(workerContent)) {
  workerContent = workerContent.replace(urlClassPattern, urlClassReplacement);
  console.log('✅ Patched TanStack Router URL class');
}

// Add polyfill at start if not already present
if (!workerContent.startsWith('// CF Workers Polyfill')) {
  workerContent = polyfill + workerContent;
  console.log('✅ Injected location polyfill into worker-entry');
}

// Check if default export already exists (either 'export default' or 'as default' in export{})
const hasDefaultExport = workerContent.includes('export default') || workerContent.includes('as default');
if (!hasDefaultExport) {
  // Add default export for handler - find Mx (exported as 'w') which contains fetch method
  const exportMatch = workerContent.match(/export\{([^}]+)\}/);
  if (exportMatch) {
    workerContent = workerContent.replace(
      /export\{([^}]+Mx as w[^}]*)\}/,
      'export{$1};export default Mx;'
    );
    console.log('✅ Added default export for handler');
  }
} else {
  console.log('ℹ️  Default export already exists, skipping');
}

fs.writeFileSync(workerEntryPath, workerContent);
console.log(`✅ Saved ${workerEntryFile}`);

// Step 3: Fix index.js to use the correct handler
const indexPath = path.join(distDir, 'index.js');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');

  // The index.js tries to use Yn (default export) which may be undefined
  // Replace the handler export logic to use the actual handler
  if (indexContent.includes('Gn=Yn??{}??{}')) {
    // Import 'w' which is Mx (the handler with fetch method)
    indexContent = indexContent.replace(
      /const Jn=await import\("([^"]+)"\),\{default:Yn,\.\.\.(\$n)\}=Jn,Gn=Yn\?\?\{\}\?\?\{\};export\{Gn as default,Yn as handler,(\$n) as rest\};/,
      `const Jn=await import("$1"),{w:handler,...$2}=Jn;export{handler as default,$2 as rest};`
    );
    console.log('✅ Fixed index.js handler export');
  }

  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ Saved index.js');
}

console.log('✨ Polyfill injection complete');
