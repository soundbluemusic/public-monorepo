/**
 * R2에 파일 업로드 스크립트 (rclone 사용)
 *
 * rclone은 S3 호환 API로 병렬 업로드하여 wrangler보다 10-50배 빠름
 *
 * 환경 변수 필요:
 *   R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, CLOUDFLARE_ACCOUNT_ID
 *
 * Usage:
 *   pnpm tsx scripts/upload-to-r2.ts data     # public/data 폴더 업로드
 *   pnpm tsx scripts/upload-to-r2.ts entries  # entry 폴더만 업로드 (SSG HTML)
 */

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const BUCKET_NAME = 'all-sites-static';
const R2_PREFIX = 'public-monorepo/context';

type UploadTarget = 'data' | 'entries';

function checkRclone(): boolean {
  try {
    execSync('rclone version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function configureRclone(): void {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error('❌ 환경 변수가 설정되지 않았습니다:');
    console.error('   CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
    console.error('');
    console.error('💡 GitHub Actions에서 실행하거나 .env 파일을 설정하세요.');
    process.exit(1);
  }

  const configDir = join(homedir(), '.config', 'rclone');
  const configPath = join(configDir, 'rclone.conf');

  mkdirSync(configDir, { recursive: true });

  const config = `[r2]
type = s3
provider = Cloudflare
access_key_id = ${accessKeyId}
secret_access_key = ${secretAccessKey}
endpoint = https://${accountId}.r2.cloudflarestorage.com
acl = private
`;

  writeFileSync(configPath, config);
  console.log('✅ rclone 설정 완료');
}

function uploadWithRclone(localDir: string, r2Path: string): void {
  console.log(`📤 Uploading: ${localDir} → r2:${BUCKET_NAME}/${r2Path}`);

  const result = spawnSync(
    'rclone',
    [
      'sync',
      localDir,
      `r2:${BUCKET_NAME}/${r2Path}`,
      '--checksum',
      '--transfers',
      '32',
      '--checkers',
      '32',
      '--fast-list',
      '--stats',
      '5s',
      '--stats-one-line',
      '-v',
    ],
    { stdio: 'inherit' },
  );

  if (result.status !== 0) {
    console.error(`❌ rclone 실행 실패 (exit code: ${result.status})`);
    process.exit(1);
  }
}

async function uploadFiles(target: UploadTarget) {
  console.log('🚀 R2 업로드 시작 (rclone 사용)\n');

  // rclone 설치 확인
  if (!checkRclone()) {
    console.error('❌ rclone이 설치되어 있지 않습니다.');
    console.error('   설치: brew install rclone (macOS) 또는 https://rclone.org/install/');
    process.exit(1);
  }

  // rclone 설정
  configureRclone();
  console.log('');

  const startTime = Date.now();

  if (target === 'data') {
    const localDir = 'public/data';
    if (!existsSync(localDir)) {
      console.error(`❌ Directory not found: ${localDir}`);
      process.exit(1);
    }
    uploadWithRclone(localDir, `${R2_PREFIX}/data`);
  } else if (target === 'entries') {
    // entry 폴더만 업로드 (정적 페이지는 Pages에서 서빙)
    const entryDir = 'build/client/entry';
    const koEntryDir = 'build/client/ko/entry';

    if (!existsSync(entryDir)) {
      console.error(`❌ Directory not found: ${entryDir}`);
      console.error('   먼저 pnpm build:r2 실행이 필요합니다.');
      process.exit(1);
    }

    // 영어 엔트리
    console.log('\n📁 English entries (/entry/*)');
    uploadWithRclone(entryDir, `${R2_PREFIX}/entry`);

    // 한국어 엔트리
    if (existsSync(koEntryDir)) {
      console.log('\n📁 Korean entries (/ko/entry/*)');
      uploadWithRclone(koEntryDir, `${R2_PREFIX}/ko/entry`);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n');
  console.log(`✅ Upload complete!`);
  console.log(`   Time: ${elapsed}s`);
}

// CLI
const target = process.argv[2] as UploadTarget;

if (!target || !['data', 'entries'].includes(target)) {
  console.log('Usage: pnpm tsx scripts/upload-to-r2.ts <target>');
  console.log('  target: data | entries');
  console.log('');
  console.log('환경 변수 필요:');
  console.log('  CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
  process.exit(1);
}

uploadFiles(target);
