/**
 * Inject polyfills and API handlers into built server files
 *
 * Strategy:
 * 1. Inject location polyfill at the start of worker-entry
 * 2. Patch TanStack Router's URL class to handle undefined arguments
 * 3. Inject API route handlers (sitemap, offline-db)
 * 4. Wrap fetch handler to process API routes first
 * 5. Fix index.js to export the correct handler
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist/server');
const assetsDir = path.join(distDir, 'assets');

// Polyfill to inject at the very start of the bundle
// This includes:
// 1. Location polyfill for Workers
// 2. Global __cfEnv__ for passing env to createServerFn handlers
// 3. Require polyfill for 'cloudflare:workers' module
const polyfill = `// CF Workers Polyfill
if(typeof globalThis.location==='undefined'){globalThis.location={protocol:'https:',host:'context.soundbluemusic.com',hostname:'context.soundbluemusic.com',port:'',pathname:'/',search:'',hash:'',href:'https://context.soundbluemusic.com/',origin:'https://context.soundbluemusic.com'};}
// Global env for SSR - will be set by fetch handler wrapper
globalThis.__cfEnv__=null;
// Polyfill require for cloudflare:workers to use global env
const __origRequire__=typeof require!=='undefined'?require:null;
globalThis.require=function(m){if(m==='cloudflare:workers')return{env:globalThis.__cfEnv__||{}};if(__origRequire__)return __origRequire__(m);throw new Error('require not available: '+m);};
`;

// API handlers to inject
const apiHandlers = `
// ============================================================================
// Injected API Handlers
// ============================================================================
const API_SITE_URL = 'https://context.soundbluemusic.com';
const API_STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/browse', priority: '0.9', changefreq: 'weekly' },
  { path: '/download', priority: '0.7', changefreq: 'monthly' },
  { path: '/built-with', priority: '0.5', changefreq: 'monthly' },
  { path: '/license', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
];
function apiGetDateString(){return new Date().toISOString().slice(0, 10);}
function apiBilingualUrl(p,pr,cf,now){const e=\`\${API_SITE_URL}\${p}\`,k=\`\${API_SITE_URL}/ko\${p==='/'?'':p}\`;return \`  <url>\\n    <loc>\${e}</loc>\\n    <lastmod>\${now}</lastmod>\\n    <changefreq>\${cf}</changefreq>\\n    <priority>\${pr}</priority>\\n    <xhtml:link rel="alternate" hreflang="en" href="\${e}"/>\\n    <xhtml:link rel="alternate" hreflang="ko" href="\${k}"/>\\n    <xhtml:link rel="alternate" hreflang="x-default" href="\${e}"/>\\n  </url>\\n  <url>\\n    <loc>\${k}</loc>\\n    <lastmod>\${now}</lastmod>\\n    <changefreq>\${cf}</changefreq>\\n    <priority>\${pr}</priority>\\n    <xhtml:link rel="alternate" hreflang="en" href="\${e}"/>\\n    <xhtml:link rel="alternate" hreflang="ko" href="\${k}"/>\\n    <xhtml:link rel="alternate" hreflang="x-default" href="\${e}"/>\\n  </url>\`;}
const xmlH={'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600, s-maxage=86400'};
const jsonH={'Content-Type':'application/json','Cache-Control':'public, max-age=3600'};

async function apiHandleSitemapIndex(db){if(!db)return new Response('Database not available',{status:503,headers:{'Content-Type':'text/plain'}});try{const{results:cats}=await db.prepare('SELECT id FROM categories ORDER BY sort_order').all();const now=apiGetDateString();const sitemaps=[{loc:\`\${API_SITE_URL}/sitemap-pages.xml\`,lastmod:now},{loc:\`\${API_SITE_URL}/sitemap-categories.xml\`,lastmod:now},...cats.map(c=>({loc:\`\${API_SITE_URL}/sitemaps/entries/\${c.id}.xml\`,lastmod:now}))];const xml=\`<?xml version="1.0" encoding="UTF-8"?>\\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n\${sitemaps.map(s=>\`  <sitemap>\\n    <loc>\${s.loc}</loc>\\n    <lastmod>\${s.lastmod}</lastmod>\\n  </sitemap>\`).join('\\n')}\\n</sitemapindex>\`;return new Response(xml,{headers:xmlH});}catch(e){console.error('Sitemap index error:',e);return new Response('Failed',{status:500});}}

function apiHandleSitemapPages(){const now=apiGetDateString();const urls=API_STATIC_PAGES.map(p=>apiBilingualUrl(p.path,p.priority,p.changefreq,now)).join('\\n');const xml=\`<?xml version="1.0" encoding="UTF-8"?>\\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\\n\${urls}\\n</urlset>\`;return new Response(xml,{headers:xmlH});}

async function apiHandleSitemapCategories(db){if(!db)return new Response('Database not available',{status:503,headers:{'Content-Type':'text/plain'}});try{const{results:cats}=await db.prepare('SELECT id FROM categories ORDER BY sort_order').all();const now=apiGetDateString();const urls=cats.map(c=>apiBilingualUrl(\`/category/\${c.id}\`,'0.8','weekly',now)).join('\\n');const xml=\`<?xml version="1.0" encoding="UTF-8"?>\\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\\n\${urls}\\n</urlset>\`;return new Response(xml,{headers:xmlH});}catch(e){console.error('Categories sitemap error:',e);return new Response('Failed',{status:500});}}

async function apiHandleSitemapEntries(db,catId){if(!db)return new Response('Database not available',{status:503,headers:{'Content-Type':'text/plain'}});try{const{results:entries}=await db.prepare('SELECT id FROM entries WHERE category_id=?').bind(catId).all();if(entries.length===0)return new Response('Not found',{status:404});const now=apiGetDateString();const urls=entries.map(e=>apiBilingualUrl(\`/entry/\${e.id}\`,'0.6','monthly',now)).join('\\n');const xml=\`<?xml version="1.0" encoding="UTF-8"?>\\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\\n\${urls}\\n</urlset>\`;return new Response(xml,{headers:xmlH});}catch(e){console.error('Entries sitemap error:',e);return new Response('Failed',{status:500});}}

async function apiHandleOfflineDb(db){if(!db)return new Response(JSON.stringify({error:'Database not available'}),{status:503,headers:jsonH});try{const[entries,cats,convs]=await Promise.all([db.prepare('SELECT id,korean,romanization,part_of_speech,category_id,difficulty,frequency,tags,translations FROM entries').all(),db.prepare('SELECT id,name_ko,name_en,description_ko,description_en,icon,color,sort_order FROM categories').all(),db.prepare('SELECT id,category_id,title_ko,title_en,dialogue FROM conversations').all()]);const data={version:Date.now(),tables:{entries:entries.results,categories:cats.results,conversations:convs.results},meta:{entriesCount:entries.results.length,categoriesCount:cats.results.length,conversationsCount:convs.results.length}};return new Response(JSON.stringify(data),{headers:{...jsonH,'X-Data-Version':String(data.version)}});}catch(e){console.error('Offline DB error:',e);return new Response(JSON.stringify({error:'Failed',message:e?.message||'Unknown'}),{status:500,headers:jsonH});}}

async function handleApiRoute(request,env){const url=new URL(request.url);const pathname=url.pathname;const db=env?.DB;if(pathname==='/sitemap.xml')return apiHandleSitemapIndex(db);if(pathname==='/sitemap-pages.xml')return apiHandleSitemapPages();if(pathname==='/sitemap-categories.xml')return apiHandleSitemapCategories(db);const entryMatch=pathname.match(/^\\/sitemaps\\/entries\\/([^/]+)\\.xml$/);if(entryMatch?.[1])return apiHandleSitemapEntries(db,entryMatch[1]);if(pathname==='/api/offline-db')return apiHandleOfflineDb(db);return null;}
// ============================================================================
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

// Inject API handlers after polyfill
if (!workerContent.includes('handleApiRoute')) {
  // Find the end of polyfill (or start of actual code)
  const polyfillEndIndex = workerContent.indexOf('import{') > 0 ? workerContent.indexOf('import{') : workerContent.length;
  workerContent = workerContent.slice(0, polyfillEndIndex) + apiHandlers + workerContent.slice(polyfillEndIndex);
  console.log('✅ Injected API handlers');
}

// Wrap the fetch handler to process API routes first
// Find the main handler export pattern and wrap it
// Look for patterns like: {fetch:async(r,e,t)=>...} or {async fetch(r,e,t){...}}
// Dynamically find the original handler variable name from exports
function findOriginalHandlerName(content) {
  // Look for pattern like "gd as F" or similar in export statement
  const exportMatch = content.match(/export\{[^}]*?(\w+) as F[,}]/);
  if (exportMatch) {
    return exportMatch[1];
  }
  // Fallback patterns
  const patterns = ['gd', 'Mx', 'w'];
  for (const p of patterns) {
    if (content.includes(`const ${p}={async fetch(`)) {
      return p;
    }
  }
  return 'gd'; // default
}

const originalHandlerName = findOriginalHandlerName(workerContent);

const fetchWrapperCode = `
// Wrap original fetch to handle API routes first and set global env for SSR
const __originalHandler__ = typeof ${originalHandlerName} !== 'undefined' ? ${originalHandlerName} : null;
const __wrappedHandler__ = __originalHandler__ ? {
  ...__originalHandler__,
  async fetch(request, env, ctx) {
    // Set global env for createServerFn handlers using require('cloudflare:workers')
    globalThis.__cfEnv__ = env;
    // Handle API routes first
    const apiResponse = await handleApiRoute(request, env);
    if (apiResponse) return apiResponse;
    // Pass to TanStack Start handler
    return __originalHandler__.fetch(request, env, ctx);
  }
} : null;
`;

// Check if we already have the wrapper
if (!workerContent.includes('__wrappedHandler__')) {
  // Add wrapper before the export statement
  const exportIndex = workerContent.lastIndexOf('export{');
  if (exportIndex > 0) {
    workerContent = workerContent.slice(0, exportIndex) + fetchWrapperCode + workerContent.slice(exportIndex);

    // Update the export to use wrapped handler
    // Change "Mx as w" to "__wrappedHandler__ as w" in exports
    workerContent = workerContent.replace(/Mx as w/g, '__wrappedHandler__ as w');
    console.log('✅ Wrapped fetch handler for API routes');
  }
}

// Check if default export already exists (either 'export default' or 'as default' in export{})
const hasDefaultExport = workerContent.includes('export default') || workerContent.includes('as default');
if (!hasDefaultExport) {
  // Add default export for handler - use wrapped handler
  workerContent = workerContent.replace(
    /export\{([^}]+)\}/,
    'export{$1};export default __wrappedHandler__;'
  );
  console.log('✅ Added default export for wrapped handler');
} else {
  console.log('ℹ️  Default export already exists, skipping');
}

fs.writeFileSync(workerEntryPath, workerContent);
console.log(`✅ Saved ${workerEntryFile}`);

// Step 3: Fix index.js to use the wrapped handler (default export)
const indexPath = path.join(distDir, 'index.js');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');

  // The index.js imports a specific export (like F) which is the original handler
  // We need to change it to import the default export which is our wrapped handler
  // Pattern: import{F as e}from"./assets/worker-entry-xxx.js" -> import e from"./assets/worker-entry-xxx.js"
  const importPattern = /import\{(\w+) as (\w+)\}from"(\.\/assets\/worker-entry-[^"]+\.js)"/;
  const match = indexContent.match(importPattern);
  if (match) {
    const [fullMatch, originalExport, alias, path] = match;
    // Change to default import
    indexContent = indexContent.replace(
      fullMatch,
      `import ${alias} from"${path}"`
    );
    console.log(`✅ Fixed index.js to use default (wrapped) export instead of ${originalExport}`);
  }

  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ Saved index.js');
}

console.log('✨ Polyfill injection complete');
