/**
 * R2에 파일 업로드 스크립트
 *
 * wrangler r2 object put은 단일 파일만 지원하므로
 * 이 스크립트로 폴더 전체를 재귀적으로 업로드
 *
 * Usage:
 *   pnpm tsx scripts/upload-to-r2.ts data   # public/data 폴더 업로드
 *   pnpm tsx scripts/upload-to-r2.ts entries # build/client 폴더 업로드 (entry pages)
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BUCKET_NAME = 'all-sites-static';
const R2_PREFIX = 'public-monorepo/context';

type UploadTarget = 'data' | 'entries';

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];

  for (const item of readdirSync(dir)) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(relative(baseDir, fullPath));
    }
  }

  return files;
}

function getContentType(filePath: string): string {
  if (filePath.endsWith('.json')) return 'application/json';
  if (filePath.endsWith('.html')) return 'text/html';
  if (filePath.endsWith('.bin')) return 'application/octet-stream';
  if (filePath.endsWith('.js')) return 'application/javascript';
  if (filePath.endsWith('.css')) return 'text/css';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.ico')) return 'image/x-icon';
  if (filePath.endsWith('.woff2')) return 'font/woff2';
  if (filePath.endsWith('.xml')) return 'application/xml';
  return 'application/octet-stream';
}

async function uploadFiles(target: UploadTarget) {
  const localDir = target === 'data' ? 'public/data' : 'build/client';
  const r2Prefix = target === 'data' ? `${R2_PREFIX}/data` : R2_PREFIX;

  if (!existsSync(localDir)) {
    console.error(`❌ Directory not found: ${localDir}`);
    process.exit(1);
  }

  const files = getAllFiles(localDir);
  console.log(`📦 Uploading ${files.length} files from ${localDir} to R2...`);
  console.log(`   Bucket: ${BUCKET_NAME}`);
  console.log(`   Prefix: ${r2Prefix}`);
  console.log('');

  let uploaded = 0;
  let failed = 0;
  const startTime = Date.now();

  // 병렬 업로드를 위한 배치 처리
  const BATCH_SIZE = 50;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (file) => {
        const localPath = join(localDir, file);
        const r2Key = `${r2Prefix}/${file}`;
        const contentType = getContentType(file);

        try {
          execSync(
            `npx wrangler r2 object put "${BUCKET_NAME}/${r2Key}" --file "${localPath}" --content-type "${contentType}"`,
            { stdio: 'pipe' },
          );
          uploaded++;
        } catch {
          console.error(`❌ Failed: ${file}`);
          failed++;
        }
      }),
    );

    // 진행상황 표시
    const progress = Math.round(((i + batch.length) / files.length) * 100);
    process.stdout.write(`\r⏳ Progress: ${progress}% (${i + batch.length}/${files.length})`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n');
  console.log(`✅ Upload complete!`);
  console.log(`   Uploaded: ${uploaded} files`);
  console.log(`   Failed: ${failed} files`);
  console.log(`   Time: ${elapsed}s`);
}

// CLI
const target = process.argv[2] as UploadTarget;

if (!target || !['data', 'entries'].includes(target)) {
  console.log('Usage: pnpm tsx scripts/upload-to-r2.ts <target>');
  console.log('  target: data | entries');
  process.exit(1);
}

uploadFiles(target);
