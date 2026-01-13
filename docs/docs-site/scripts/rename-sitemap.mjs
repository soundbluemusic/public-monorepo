/**
 * Sitemap Rename Script
 * Renames sitemap-index.xml to sitemap.xml for consistency with other apps
 */

import { readFileSync, writeFileSync, renameSync, existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const DIST_DIR = join(import.meta.dirname, '../dist');

const indexFile = join(DIST_DIR, 'sitemap-index.xml');
const targetFile = join(DIST_DIR, 'sitemap.xml');

if (!existsSync(indexFile)) {
  console.log('⚠️  sitemap-index.xml not found, skipping rename');
  process.exit(0);
}

// Remove existing sitemap.xml if exists
if (existsSync(targetFile)) {
  unlinkSync(targetFile);
}

// Rename sitemap-index.xml to sitemap.xml
renameSync(indexFile, targetFile);

console.log('✅ Renamed sitemap-index.xml → sitemap.xml');

// Update robots.txt to point to sitemap.xml
const robotsFile = join(DIST_DIR, 'robots.txt');
if (existsSync(robotsFile)) {
  let robotsContent = readFileSync(robotsFile, 'utf-8');
  robotsContent = robotsContent.replace('sitemap-index.xml', 'sitemap.xml');
  writeFileSync(robotsFile, robotsContent);
  console.log('✅ Updated robots.txt sitemap reference');
}
