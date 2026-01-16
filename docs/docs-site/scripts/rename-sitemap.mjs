/**
 * Sitemap Post-Build Script
 * 1. Renames sitemap-index.xml to sitemap.xml for consistency
 * 2. Injects XSL stylesheet reference for human-readable sitemap
 */

import { readFileSync, writeFileSync, renameSync, existsSync, unlinkSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST_DIR = join(import.meta.dirname, '../dist');
const XSL_REFERENCE = '<?xml-stylesheet type="text/xsl" href="/public-monorepo/sitemap.xsl"?>';

// Step 1: Rename sitemap-index.xml to sitemap.xml
const indexFile = join(DIST_DIR, 'sitemap-index.xml');
const targetFile = join(DIST_DIR, 'sitemap.xml');

if (!existsSync(indexFile)) {
  console.log('⚠️  sitemap-index.xml not found, skipping rename');
} else {
  // Remove existing sitemap.xml if exists
  if (existsSync(targetFile)) {
    unlinkSync(targetFile);
  }
  renameSync(indexFile, targetFile);
  console.log('✅ Renamed sitemap-index.xml → sitemap.xml');
}

// Step 2: Update robots.txt
const robotsFile = join(DIST_DIR, 'robots.txt');
if (existsSync(robotsFile)) {
  let robotsContent = readFileSync(robotsFile, 'utf-8');
  robotsContent = robotsContent.replace('sitemap-index.xml', 'sitemap.xml');
  writeFileSync(robotsFile, robotsContent);
  console.log('✅ Updated robots.txt sitemap reference');
}

// Step 3: Inject XSL stylesheet reference into all sitemap files
console.log('\n📄 Injecting XSL stylesheet reference...');
const files = readdirSync(DIST_DIR);
const sitemapFiles = files.filter((f) => f.startsWith('sitemap') && f.endsWith('.xml'));

let updated = 0;
for (const filename of sitemapFiles) {
  const filepath = join(DIST_DIR, filename);
  let content = readFileSync(filepath, 'utf-8');

  // Skip if already has XSL reference
  if (content.includes('xml-stylesheet')) {
    console.log(`   [skip] ${filename}`);
    continue;
  }

  // Insert XSL reference after XML declaration
  const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
  if (content.startsWith(xmlDeclaration)) {
    content = content.replace(xmlDeclaration, `${xmlDeclaration}\n${XSL_REFERENCE}`);
    writeFileSync(filepath, content);
    console.log(`   [done] ${filename}`);
    updated++;
  }
}
console.log(`\n✅ Injected XSL into ${updated}/${sitemapFiles.length} sitemap files`);
console.log('🎉 Sitemap post-build complete!');
