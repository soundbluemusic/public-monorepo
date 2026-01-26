/**
 * Inject polyfills and API handlers into built server files
 *
 * Strategy (Vite 7): Patch worker-entry-*.js in assets/
 * Strategy (Vite 8+): Patch index.js directly (all-in-one bundle)
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

// Inject API handlers after polyfill
if (!content.includes('handleApiRoute')) {
  const polyfillEndIndex = content.indexOf('import{') > 0 ? content.indexOf('import{') : (content.indexOf('import ') > 0 ? content.indexOf('import ') : content.length);
  content = content.slice(0, polyfillEndIndex) + apiHandlers + content.slice(polyfillEndIndex);
  console.log('✅ Injected API handlers');
}

// Find original handler name for wrapping
function findOriginalHandlerName(content) {
  // Priority 1: Find the default export variable name directly
  // Pattern: export{...,xxx as default} or export{xxx as default,...}
  const defaultExportMatch = content.match(/export\{[^}]*?(\w+) as default[,}]/);
  if (defaultExportMatch) {
    console.log(`ℹ️  Found default export variable: ${defaultExportMatch[1]}`);
    return defaultExportMatch[1];
  }

  // Priority 2: Look for createServerEntry pattern (pl function result)
  // Pattern: var gl=pl({fetch:...})
  const serverEntryMatch = content.match(/var\s+(\w+)\s*=\s*pl\s*\(/);
  if (serverEntryMatch) {
    console.log(`ℹ️  Found server entry variable: ${serverEntryMatch[1]}`);
    return serverEntryMatch[1];
  }

  // Fallback: common handler patterns
  const patterns = ['gl', 'ad', 'gd', 'Mx', 'w'];
  for (const p of patterns) {
    if (content.includes(`var ${p}=pl(`) || content.includes(`const ${p}=pl(`)) {
      return p;
    }
  }

  console.warn('⚠️  Could not find handler variable, using fallback "gl"');
  return 'gl';
}

const originalHandlerName = findOriginalHandlerName(content);
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
if (!content.includes('__wrappedHandler__')) {
  const exportIndex = content.lastIndexOf('export{');
  if (exportIndex > 0) {
    content = content.slice(0, exportIndex) + fetchWrapperCode + content.slice(exportIndex);
    console.log('✅ Wrapped fetch handler for API routes');
  }
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
