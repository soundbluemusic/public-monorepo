/**
 * Inject polyfills and API handlers into built server files
 *
 * Strategy (Vite 7): Patch worker-entry-*.js in assets/
 * Strategy (Vite 8+): Patch index.js directly (all-in-one bundle)
 *
 * Failure policy: ANY regex/pattern miss MUST abort the build (process.exit(1)).
 * Silent fallbacks were removed after a sitemap drift incident caused 3 static
 * page URLs to be missing in production.
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist/server');
const assetsDir = path.join(distDir, 'assets');

// Single source of truth for static sitemap pages, read from app/data/sitemap-static-pages.json
// so that this script and apps/context/app/server.ts cannot drift.
const staticPagesJsonPath = path.resolve(process.cwd(), 'app/data/sitemap-static-pages.json');
if (!fs.existsSync(staticPagesJsonPath)) {
  console.error('❌ FATAL: sitemap-static-pages.json not found.');
  console.error(`   Expected at: ${staticPagesJsonPath}`);
  console.error('   This file is the single source of truth for static sitemap entries.');
  process.exit(1);
}
const staticPagesData = JSON.parse(fs.readFileSync(staticPagesJsonPath, 'utf8'));
if (!Array.isArray(staticPagesData) || staticPagesData.length === 0) {
  console.error('❌ FATAL: sitemap-static-pages.json is empty or not an array.');
  process.exit(1);
}
for (const page of staticPagesData) {
  if (!page || typeof page.path !== 'string' || typeof page.priority !== 'string' || typeof page.changefreq !== 'string') {
    console.error('❌ FATAL: sitemap-static-pages.json contains an invalid entry:', page);
    process.exit(1);
  }
}
console.log(`ℹ️  Loaded ${staticPagesData.length} static sitemap pages from JSON SSoT`);

// Single source of truth for the app's site URL, read from app/data/site.json so
// this script, app/config.ts, and the runtime location polyfill cannot drift.
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
// This includes:
// 1. Location polyfill for Workers
// 2. Global __cfEnv__ for passing env to createServerFn handlers
// 3. Require polyfill for 'cloudflare:workers' module
const polyfill = `// CF Workers Polyfill
if(typeof globalThis.location==='undefined'){globalThis.location={protocol:${JSON.stringify(SITE_PROTOCOL)},host:${JSON.stringify(SITE_HOST)},hostname:${JSON.stringify(SITE_HOSTNAME)},port:'',pathname:'/',search:'',hash:'',href:${JSON.stringify(`${SITE_ORIGIN}/`)},origin:${JSON.stringify(SITE_ORIGIN)}};}
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
const API_SITE_URL = ${JSON.stringify(SITE_BASE_URL)};
const API_STATIC_PAGES = ${JSON.stringify(staticPagesData)};
function apiGetDateString(){return new Date().toISOString().slice(0, 10);}
function apiEncodePath(p){return p.split('/').map(s=>s?encodeURIComponent(s):'').join('/');}
function apiBilingualUrl(p,pr,cf,now){const ep=apiEncodePath(p);const e=\`\${API_SITE_URL}\${ep}\`,k=\`\${API_SITE_URL}/ko\${ep==='/'?'':ep}\`;return \`  <url>\\n    <loc>\${e}</loc>\\n    <lastmod>\${now}</lastmod>\\n    <changefreq>\${cf}</changefreq>\\n    <priority>\${pr}</priority>\\n    <xhtml:link rel="alternate" hreflang="en" href="\${e}"/>\\n    <xhtml:link rel="alternate" hreflang="ko" href="\${k}"/>\\n    <xhtml:link rel="alternate" hreflang="x-default" href="\${e}"/>\\n  </url>\\n  <url>\\n    <loc>\${k}</loc>\\n    <lastmod>\${now}</lastmod>\\n    <changefreq>\${cf}</changefreq>\\n    <priority>\${pr}</priority>\\n    <xhtml:link rel="alternate" hreflang="en" href="\${e}"/>\\n    <xhtml:link rel="alternate" hreflang="ko" href="\${k}"/>\\n    <xhtml:link rel="alternate" hreflang="x-default" href="\${e}"/>\\n  </url>\`;}
const xmlH={'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600, s-maxage=86400'};
const jsonH={'Content-Type':'application/json','Cache-Control':'public, max-age=3600'};

async function apiHandleSitemapIndex(db){if(!db)return new Response('Database not available',{status:503,headers:{'Content-Type':'text/plain'}});try{const{results:cats}=await db.prepare('SELECT id FROM categories ORDER BY sort_order').all();const now=apiGetDateString();const sitemaps=[{loc:\`\${API_SITE_URL}/sitemap-pages.xml\`,lastmod:now},{loc:\`\${API_SITE_URL}/sitemap-categories.xml\`,lastmod:now},{loc:\`\${API_SITE_URL}/sitemap-conversations.xml\`,lastmod:now},{loc:\`\${API_SITE_URL}/sitemap-tags.xml\`,lastmod:now},...cats.map(c=>({loc:\`\${API_SITE_URL}/sitemaps/entries/\${c.id}.xml\`,lastmod:now}))];const xml=\`<?xml version="1.0" encoding="UTF-8"?>\\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n\${sitemaps.map(s=>\`  <sitemap>\\n    <loc>\${s.loc}</loc>\\n    <lastmod>\${s.lastmod}</lastmod>\\n  </sitemap>\`).join('\\n')}\\n</sitemapindex>\`;return new Response(xml,{headers:xmlH});}catch(e){console.error('Sitemap index error:',e);return new Response('Service Unavailable: database query failed',{status:503,headers:{'Content-Type':'text/plain','Retry-After':'60'}});}}

function apiHandleSitemapPages(){const now=apiGetDateString();const urls=API_STATIC_PAGES.map(p=>apiBilingualUrl(p.path,p.priority,p.changefreq,now)).join('\\n');const xml=\`<?xml version="1.0" encoding="UTF-8"?>\\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\\n\${urls}\\n</urlset>\`;return new Response(xml,{headers:xmlH});}

async function apiHandleSitemapCategories(db){if(!db)return new Response('Database not available',{status:503,headers:{'Content-Type':'text/plain'}});try{const{results:cats}=await db.prepare('SELECT id FROM categories ORDER BY sort_order').all();const now=apiGetDateString();const urls=cats.map(c=>apiBilingualUrl(\`/category/\${c.id}\`,'0.8','weekly',now)).join('\\n');const xml=\`<?xml version="1.0" encoding="UTF-8"?>\\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\\n\${urls}\\n</urlset>\`;return new Response(xml,{headers:xmlH});}catch(e){console.error('Categories sitemap error:',e);return new Response('Service Unavailable: database query failed',{status:503,headers:{'Content-Type':'text/plain','Retry-After':'60'}});}}

async function apiHandleSitemapEntries(db,catId){if(!db)return new Response('Database not available',{status:503,headers:{'Content-Type':'text/plain'}});try{const{results:entries}=await db.prepare('SELECT id FROM entries WHERE category_id=?').bind(catId).all();if(entries.length===0)return new Response('Not found',{status:404});const now=apiGetDateString();const urls=entries.map(e=>apiBilingualUrl(\`/entry/\${e.id}\`,'0.8','monthly',now)).join('\\n');const xml=\`<?xml version="1.0" encoding="UTF-8"?>\\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\\n\${urls}\\n</urlset>\`;return new Response(xml,{headers:xmlH});}catch(e){console.error('Entries sitemap error:',e);return new Response('Service Unavailable: database query failed',{status:503,headers:{'Content-Type':'text/plain','Retry-After':'60'}});}}

async function apiHandleSitemapConversations(db){if(!db)return new Response('Database not available',{status:503,headers:{'Content-Type':'text/plain'}});try{const{results:cats}=await db.prepare('SELECT DISTINCT category_id FROM conversations ORDER BY category_id').all();const now=apiGetDateString();const urls=cats.map(c=>apiBilingualUrl(\`/conversations/\${c.category_id}\`,'0.7','monthly',now)).join('\\n');const xml=\`<?xml version="1.0" encoding="UTF-8"?>\\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\\n\${urls}\\n</urlset>\`;return new Response(xml,{headers:xmlH});}catch(e){console.error('Conversations sitemap error:',e);return new Response('Service Unavailable: database query failed',{status:503,headers:{'Content-Type':'text/plain','Retry-After':'60'}});}}

async function apiHandleSitemapTags(db){if(!db)return new Response('Database not available',{status:503,headers:{'Content-Type':'text/plain'}});try{const{results}=await db.prepare("SELECT tags FROM entries WHERE tags IS NOT NULL AND tags != '[]'").all();const uniqueTags=new Set();for(const row of results){try{const tags=JSON.parse(row.tags);for(const tag of tags){uniqueTags.add(tag);}}catch(err){console.warn('[Sitemap] Invalid JSON in tags:',String(row.tags).slice(0,100),err);}}const sortedTags=Array.from(uniqueTags).sort();const now=apiGetDateString();const urls=sortedTags.map(tag=>apiBilingualUrl(\`/tag/\${tag}\`,'0.5','monthly',now)).join('\\n');const xml=\`<?xml version="1.0" encoding="UTF-8"?>\\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\\n\${urls}\\n</urlset>\`;return new Response(xml,{headers:xmlH});}catch(e){console.error('Tags sitemap error:',e);return new Response('Service Unavailable: database query failed',{status:503,headers:{'Content-Type':'text/plain','Retry-After':'60'}});}}

async function apiHandleOfflineDb(db){if(!db)return new Response(JSON.stringify({error:'Database not available'}),{status:503,headers:jsonH});try{const[entries,cats,convs]=await Promise.all([db.prepare('SELECT id,korean,romanization,part_of_speech,category_id,difficulty,frequency,tags,translations FROM entries').all(),db.prepare('SELECT id,name_ko,name_en,description_ko,description_en,icon,color,sort_order FROM categories').all(),db.prepare('SELECT id,category_id,title_ko,title_en,dialogue FROM conversations').all()]);const data={version:Date.now(),tables:{entries:entries.results,categories:cats.results,conversations:convs.results},meta:{entriesCount:entries.results.length,categoriesCount:cats.results.length,conversationsCount:convs.results.length}};return new Response(JSON.stringify(data),{headers:{...jsonH,'X-Data-Version':String(data.version)}});}catch(e){console.error('Offline DB error:',e);return new Response(JSON.stringify({error:'ServiceUnavailable',message:e?.message||'Unknown'}),{status:503,headers:{...jsonH,'Retry-After':'60'}});}}

async function apiHandleBrowseChunk(db,sortType,chunkNum){if(!db)return new Response(JSON.stringify({entries:[]}),{headers:jsonH});try{const limit=100;const offset=chunkNum*limit;let query='SELECT id,korean,romanization,part_of_speech,category_id FROM entries';if(sortType==='alphabetical')query+=' ORDER BY korean COLLATE NOCASE';else if(sortType==='category')query+=' ORDER BY category_id,korean';else if(sortType==='recent')query+=' ORDER BY rowid DESC';query+=\` LIMIT \${limit} OFFSET \${offset}\`;const{results}=await db.prepare(query).all();const entries=results.map(e=>({id:e.id,korean:e.korean,romanization:e.romanization,partOfSpeech:e.part_of_speech,categoryId:e.category_id}));return new Response(JSON.stringify({entries,chunk:chunkNum,hasMore:results.length===limit}),{headers:jsonH});}catch(e){console.error('Browse chunk error:',e);return new Response(JSON.stringify({entries:[],error:e?.message}),{status:503,headers:{...jsonH,'Retry-After':'60'}});}}

async function apiHandleSearchIndex(db){if(!db)return new Response(JSON.stringify([]),{headers:jsonH});try{const{results}=await db.prepare('SELECT id,korean,romanization,part_of_speech,category_id FROM entries ORDER BY frequency DESC LIMIT 5000').all();const index=results.map(e=>({id:e.id,k:e.korean,r:e.romanization||'',p:e.part_of_speech||'',c:e.category_id}));return new Response(JSON.stringify(index),{headers:{...jsonH,'Cache-Control':'public, max-age=86400'}});}catch(e){console.error('Search index error:',e);return new Response(JSON.stringify([]),{status:503,headers:{...jsonH,'Retry-After':'60'}});}}

async function handleApiRoute(request,env){const url=new URL(request.url);const pathname=url.pathname;const db=env?.DB;if(pathname==='/sitemap.xml')return apiHandleSitemapIndex(db);if(pathname==='/sitemap-pages.xml')return apiHandleSitemapPages();if(pathname==='/sitemap-categories.xml')return apiHandleSitemapCategories(db);if(pathname==='/sitemap-conversations.xml')return apiHandleSitemapConversations(db);if(pathname==='/sitemap-tags.xml')return apiHandleSitemapTags(db);const entryMatch=pathname.match(/^\\/sitemaps\\/entries\\/([^/]+)\\.xml$/);if(entryMatch?.[1])return apiHandleSitemapEntries(db,entryMatch[1]);const legacyMatch=pathname.match(/^\\/sitemap-entry-([^/]+)\\.xml$/);if(legacyMatch?.[1])return new Response(null,{status:301,headers:{Location:\`\${API_SITE_URL}/sitemaps/entries/\${legacyMatch[1]}.xml\`}});if(pathname==='/api/offline-db')return apiHandleOfflineDb(db);if(pathname==='/search-index.json')return apiHandleSearchIndex(db);const browseMatch=pathname.match(/^\\/data\\/browse\\/(alphabetical|category|recent)\\/chunk-(\\d+)\\.json$/);if(browseMatch)return apiHandleBrowseChunk(db,browseMatch[1],parseInt(browseMatch[2],10));return null;}
// ============================================================================
`;

// Find worker-entry file (Vite 7) or use index.js (Vite 8+)
let targetFile = null;
let targetPath = null;
let isVite8Mode = false;

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
    isVite8Mode = true;
    console.log('ℹ️  Vite 8+ mode: patching index.js directly');
  }
}

if (!targetPath) {
  console.log('❌ No target file found for patching');
  process.exit(1);
}

// Read and patch target file
let content = fs.readFileSync(targetPath, 'utf8');

// Note (verified 2026-05-13 against the deployed permissive worker via grep):
// the legacy regex `(this.#f=e.protocol,this.#m=e.host,...)` no longer appears
// in the bundle in any form. TanStack Router's URL handling was refactored or
// is now isolated in a chunk that is not the patch target. The previous patch
// was always a no-op in production — main relied on a silent `if (regex.test)`
// branch that skipped the replacement. Removed entirely; the location polyfill
// below is sufficient on its own.

// Add polyfill at start if not already present
if (!content.startsWith('// CF Workers Polyfill')) {
  content = polyfill + content;
  console.log('✅ Injected location polyfill');
}

// Inject API handlers after polyfill
if (!content.includes('handleApiRoute')) {
  const importCurlyIdx = content.indexOf('import{');
  const importSpaceIdx = content.indexOf('import ');
  let polyfillEndIndex;
  if (importCurlyIdx > 0) {
    polyfillEndIndex = importCurlyIdx;
  } else if (importSpaceIdx > 0) {
    polyfillEndIndex = importSpaceIdx;
  } else {
    console.error('❌ FATAL: No top-level import statement found in bundle.');
    console.error('   Cannot determine a safe location to inject API handlers.');
    console.error('   The bundle structure has changed unexpectedly.');
    process.exit(1);
  }
  content = content.slice(0, polyfillEndIndex) + apiHandlers + content.slice(polyfillEndIndex);
  console.log('✅ Injected API handlers');
}

// Find original handler name for wrapping.
// NO fallback guessing: if neither the default-export pattern nor the pl()
// pattern matches, we abort. Previously the script fell back to the literal
// string "gl", which would silently wrap the wrong variable (or nothing) and
// cause every static asset to 404 in production.
function findOriginalHandlerName(content) {
  // Priority 1: Find the default export variable name directly
  // Pattern: export{...,xxx as default} or export{xxx as default,...}
  const defaultExportMatch = content.match(/export\{[^}]*?(\w+) as default[,}]/);
  if (defaultExportMatch?.[1]) {
    console.log(`ℹ️  Found default export variable: ${defaultExportMatch[1]}`);
    return defaultExportMatch[1];
  }

  // Priority 2: Look for createServerEntry pattern (pl function result)
  // Pattern: var gl=pl({fetch:...})
  const serverEntryMatch = content.match(/var\s+(\w+)\s*=\s*pl\s*\(/);
  if (serverEntryMatch?.[1]) {
    console.log(`ℹ️  Found server entry variable: ${serverEntryMatch[1]}`);
    return serverEntryMatch[1];
  }

  console.error('❌ FATAL: Could not find the original handler variable in the bundle.');
  console.error('   Neither the "as default" export pattern nor the "pl(" server-entry');
  console.error('   pattern matched. This likely means TanStack Start changed its');
  console.error('   bundle structure. Update findOriginalHandlerName in this script.');
  process.exit(1);
}

const originalHandlerName = findOriginalHandlerName(content);
console.log(`ℹ️  Found handler variable: ${originalHandlerName}`);

// Build timestamp used by ETag / Last-Modified. Computed at inject time so that
// every deploy produces a stable identifier across the lifetime of the bundle.
const __CONTENT_LAST_MODIFIED__ = new Date().toISOString().slice(0, 10);

const fetchWrapperCode = `
// Wrap original fetch to handle API routes first and set global env for SSR
const __originalHandler__ = typeof ${originalHandlerName} !== 'undefined' ? ${originalHandlerName} : null;

// Security headers applied to every HTML response (Workers does not honour
// the _headers file). Mirrors apps/context/app/server.ts SECURITY_HEADERS.
const __SEC_HEADERS__ = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

const __CONTENT_LAST_MODIFIED__ = ${JSON.stringify(__CONTENT_LAST_MODIFIED__)};
function __getLastModifiedHeader__() {
  return new Date(__CONTENT_LAST_MODIFIED__).toUTCString();
}
function __generateETag__(pathname) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < pathname.length; i++) {
    hash ^= pathname.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hashHex = (hash >>> 0).toString(16);
  return '"' + __CONTENT_LAST_MODIFIED__ + '-' + hashHex + '"';
}
function __shouldReturn304__(request) {
  const ifModifiedSince = request.headers.get('If-Modified-Since');
  if (!ifModifiedSince) return false;
  const clientDate = new Date(ifModifiedSince);
  const lastModified = new Date(__CONTENT_LAST_MODIFIED__);
  return clientDate >= lastModified;
}
function __etagMatches__(request, etag) {
  const ifNoneMatch = request.headers.get('If-None-Match');
  if (!ifNoneMatch) return false;
  return ifNoneMatch === etag || ifNoneMatch === 'W/' + etag;
}

// Dynamic D1-backed routes whose HTML reflects database content. ETag is
// derived from deploy date + pathname, so a 304 short-circuit on these routes
// would let clients keep showing pre-deploy entry/category/tag HTML even after
// D1 mutations. Skip the conditional-GET path for these.
const __isDynamicD1Path__ = (pathname) => {
  if (pathname.startsWith('/ko/')) {
    pathname = pathname.slice(3);
  }
  return pathname.startsWith('/entry/') ||
         pathname.startsWith('/category/') ||
         pathname.startsWith('/conversations/') ||
         pathname.startsWith('/tag/');
};

// Static asset paths that should be served by Workers Assets
const __isStaticAsset__ = (pathname) => {
  return pathname.startsWith('/assets/') ||
         pathname.startsWith('/icons/') ||
         pathname.startsWith('/screenshots/') ||
         pathname.startsWith('/fonts/') ||
         pathname.startsWith('/data/') ||
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

    // ETag/304 only for static-content HTML (D1-backed dynamic pages opt out
    // so a database mutation is never hidden behind an unchanged ETag).
    const isDynamic = __isDynamicD1Path__(pathname);
    const etag = isDynamic ? null : __generateETag__(pathname);
    if (etag && request.method === 'GET' && (__etagMatches__(request, etag) || __shouldReturn304__(request))) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: etag,
          'Last-Modified': __getLastModifiedHeader__(),
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      });
    }

    // Pass to TanStack Start handler for SSR
    const response = await __originalHandler__.fetch(request, env, ctx);

    // Attach cache + security headers to HTML responses (Workers has no _headers).
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('text/html')) {
      const newResponse = new Response(response.body, response);
      if (isDynamic) {
        // D1-backed pages: require revalidation every time so a database
        // update is reflected on the next request, not after deploy date rolls.
        newResponse.headers.set('Cache-Control', 'no-cache, must-revalidate');
      } else {
        newResponse.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
        newResponse.headers.set('Last-Modified', __getLastModifiedHeader__());
        newResponse.headers.set('ETag', etag);
      }
      for (const [key, value] of Object.entries(__SEC_HEADERS__)) {
        newResponse.headers.set(key, value);
      }
      return newResponse;
    }

    return response;
  }
} : null;
`;

// Check if we already have the wrapper
if (!content.includes('__wrappedHandler__')) {
  const exportIndex = content.lastIndexOf('export{');
  if (exportIndex <= 0) {
    console.error('❌ FATAL: No "export{" statement found at the end of the bundle.');
    console.error('   Cannot insert the fetch handler wrapper. Bundle layout changed.');
    process.exit(1);
  }
  content = content.slice(0, exportIndex) + fetchWrapperCode + content.slice(exportIndex);
  console.log('✅ Wrapped fetch handler for API routes');
}

// Replace or add default export with __wrappedHandler__
const defaultExportMatch = content.match(/(\w+) as default/);
if (defaultExportMatch) {
  const originalDefault = defaultExportMatch[1];
  content = content.replace(
    new RegExp(`${originalDefault} as default`, 'g'),
    '__wrappedHandler__ as default'
  );
  console.log(`✅ Replaced default export: ${originalDefault} → __wrappedHandler__`);
} else if (!content.includes('export default')) {
  // No default export at all, add one
  content = content.replace(
    /export\{([^}]+)\}/,
    'export{$1};export default __wrappedHandler__;'
  );
  console.log('✅ Added default export for wrapped handler');
}

// Verify that __wrappedHandler__ is now the default export
if (!content.includes('__wrappedHandler__ as default') && !content.includes('export default __wrappedHandler__')) {
  console.error('❌ FATAL: Failed to set __wrappedHandler__ as default export!');
  console.error('   This will cause all static assets (CSS, JS, images) to return 404.');
  console.error('   The build cannot proceed.');
  process.exit(1);
}

fs.writeFileSync(targetPath, content);
console.log(`✅ Saved ${targetFile}`);

// For Vite 7 only: Fix index.js to use the wrapped handler
if (!isVite8Mode) {
  const indexPath = path.join(distDir, 'index.js');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');

    const multiImportPattern = /import\{([^}]+)\}from"(\.\/assets\/worker-entry-[^"]+\.js)"/;
    const importMatch = indexContent.match(multiImportPattern);

    if (importMatch) {
      const [fullImport, namedImports, workerPath] = importMatch;
      const imports = namedImports.split(',').map((s) => {
        const [orig, alias] = s.trim().split(' as ');
        return { orig, alias };
      });

      const gImport = imports.find((i) => i.orig === 'G');
      const otherImports = imports.filter((i) => i.orig !== 'G');

      if (gImport) {
        const namedPart = otherImports.length > 0 ? `,{${otherImports.map((i) => `${i.orig} as ${i.alias}`).join(',')}}` : '';
        const newImport = `import __handler__${namedPart}from"${workerPath}"`;

        indexContent = indexContent.replace(fullImport, newImport);
        indexContent = indexContent.replace(new RegExp(`${gImport.alias} as default`, 'g'), '__handler__ as default');

        console.log(`✅ Fixed index.js to use default (wrapped) export`);
      }
    }

    fs.writeFileSync(indexPath, indexContent);
    console.log('✅ Saved index.js');
  }
}

console.log('✨ Polyfill injection complete');
