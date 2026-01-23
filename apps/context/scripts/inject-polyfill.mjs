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

async function apiHandleBrowseChunk(db,sortType,chunkNum){if(!db)return new Response(JSON.stringify({entries:[]}),{headers:jsonH});try{const limit=100;const offset=chunkNum*limit;let query='SELECT id,korean,romanization,part_of_speech,category_id FROM entries';if(sortType==='alphabetical')query+=' ORDER BY korean COLLATE NOCASE';else if(sortType==='category')query+=' ORDER BY category_id,korean';else if(sortType==='recent')query+=' ORDER BY rowid DESC';query+=\` LIMIT \${limit} OFFSET \${offset}\`;const{results}=await db.prepare(query).all();const entries=results.map(e=>({id:e.id,korean:e.korean,romanization:e.romanization,partOfSpeech:e.part_of_speech,categoryId:e.category_id}));return new Response(JSON.stringify({entries,chunk:chunkNum,hasMore:results.length===limit}),{headers:jsonH});}catch(e){console.error('Browse chunk error:',e);return new Response(JSON.stringify({entries:[],error:e?.message}),{status:500,headers:jsonH});}}

async function apiHandleSearchIndex(db){if(!db)return new Response(JSON.stringify([]),{headers:jsonH});try{const{results}=await db.prepare('SELECT id,korean,romanization,part_of_speech,category_id FROM entries ORDER BY frequency DESC LIMIT 5000').all();const index=results.map(e=>({id:e.id,k:e.korean,r:e.romanization||'',p:e.part_of_speech||'',c:e.category_id}));return new Response(JSON.stringify(index),{headers:{...jsonH,'Cache-Control':'public, max-age=86400'}});}catch(e){console.error('Search index error:',e);return new Response(JSON.stringify([]),{status:500,headers:jsonH});}}

async function handleApiRoute(request,env){const url=new URL(request.url);const pathname=url.pathname;const db=env?.DB;if(pathname==='/sitemap.xml')return apiHandleSitemapIndex(db);if(pathname==='/sitemap-pages.xml')return apiHandleSitemapPages();if(pathname==='/sitemap-categories.xml')return apiHandleSitemapCategories(db);const entryMatch=pathname.match(/^\\/sitemaps\\/entries\\/([^/]+)\\.xml$/);if(entryMatch?.[1])return apiHandleSitemapEntries(db,entryMatch[1]);if(pathname==='/api/offline-db')return apiHandleOfflineDb(db);if(pathname==='/search-index.json')return apiHandleSearchIndex(db);const browseMatch=pathname.match(/^\\/data\\/browse\\/(alphabetical|category|recent)\\/chunk-(\\d+)\\.json$/);if(browseMatch)return apiHandleBrowseChunk(db,browseMatch[1],parseInt(browseMatch[2],10));return null;}
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
// The Worker handler is exported as G (not F - F is createServerEntry)
function findOriginalHandlerName(content) {
  // Look for pattern like "ad as G" or similar in export statement
  // G is the Worker handler that gets exported as default by index.js
  const exportMatch = content.match(/export\{[^}]*?(\w+) as G[,}]/);
  if (exportMatch) {
    return exportMatch[1];
  }
  // Fallback: look for pattern like "gd as F" (older versions)
  const fallbackMatch = content.match(/export\{[^}]*?(\w+) as F[,}]/);
  if (fallbackMatch) {
    return fallbackMatch[1];
  }
  // Fallback patterns
  const patterns = ['ad', 'gd', 'Mx', 'w'];
  for (const p of patterns) {
    if (content.includes(`const ${p}={`) || content.includes(`var ${p}={`)) {
      return p;
    }
  }
  return 'ad'; // default
}

const originalHandlerName = findOriginalHandlerName(workerContent);
console.log(`ℹ️  Found handler variable: ${originalHandlerName}`);

const fetchWrapperCode = `
// Wrap original fetch to handle API routes first and set global env for SSR
const __originalHandler__ = typeof ${originalHandlerName} !== 'undefined' ? ${originalHandlerName} : null;
// Static asset paths that should be served by Workers Assets
const __isStaticAsset__ = (pathname) => {
  return pathname.startsWith('/assets/') ||
         pathname.startsWith('/icons/') ||
         pathname.startsWith('/screenshots/') ||
         pathname.startsWith('/fonts/') ||
         (pathname.startsWith('/data/') && !pathname.startsWith('/data/browse/')) ||
         pathname === '/favicon.ico' ||
         pathname === '/manifest.json' ||
         pathname === '/robots.txt' ||
         pathname === '/sitemap.xsl' ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.svg') ||
         pathname.endsWith('.woff2') ||
         pathname.endsWith('.webmanifest');
};
const __wrappedHandler__ = __originalHandler__ ? {
  ...__originalHandler__,
  async fetch(request, env, ctx) {
    // Set global env for createServerFn handlers using require('cloudflare:workers')
    globalThis.__cfEnv__ = env;
    const url = new URL(request.url);
    const pathname = url.pathname;
    // Serve static assets via Workers Assets binding
    if (__isStaticAsset__(pathname) && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    // Handle API routes
    const apiResponse = await handleApiRoute(request, env);
    if (apiResponse) return apiResponse;
    // Pass to TanStack Start handler for SSR
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

  // Current format: import{F as e,G as r}from"./assets/worker-entry-xxx.js";...;export{e as createServerEntry,r as default}
  // Target format: import __handler__,{F as e}from"./assets/worker-entry-xxx.js";...;export{e as createServerEntry,__handler__ as default}

  // Pattern 1: Match import statement with multiple named imports including G
  const multiImportPattern = /import\{([^}]+)\}from"(\.\/assets\/worker-entry-[^"]+\.js)"/;
  const importMatch = indexContent.match(multiImportPattern);

  if (importMatch) {
    const [fullImport, namedImports, workerPath] = importMatch;
    // Parse named imports: "F as e,G as r" -> [{orig: 'F', alias: 'e'}, {orig: 'G', alias: 'r'}]
    const imports = namedImports.split(',').map((s) => {
      const [orig, alias] = s.trim().split(' as ');
      return { orig, alias };
    });

    // Find the G import (this is the handler that becomes default)
    const gImport = imports.find((i) => i.orig === 'G');
    // Keep other imports (F, etc.)
    const otherImports = imports.filter((i) => i.orig !== 'G');

    if (gImport) {
      // Build new import: import __handler__,{F as e}from"./worker-entry.js"
      const namedPart = otherImports.length > 0 ? `,{${otherImports.map((i) => `${i.orig} as ${i.alias}`).join(',')}}` : '';
      const newImport = `import __handler__${namedPart}from"${workerPath}"`;

      indexContent = indexContent.replace(fullImport, newImport);

      // Update export: change "r as default" to "__handler__ as default"
      indexContent = indexContent.replace(new RegExp(`${gImport.alias} as default`, 'g'), '__handler__ as default');

      console.log(`✅ Fixed index.js to use default (wrapped) export`);
    }
  }

  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ Saved index.js');
}

console.log('✨ Polyfill injection complete');
