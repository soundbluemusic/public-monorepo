/**
 * Cloudflare R2에 파일 업로드 스크립트 (rclone 사용)
 *
 * rclone은 S3 호환 API로 32개 병렬 업로드하여 wrangler보다 10-50배 빠릅니다.
 * 34,676개 SSG 파일을 몇 분 내에 동기화할 수 있습니다.
 *
 * @module apps/context/scripts/upload-to-r2
 * @environment build-only (Node.js CLI)
 *
 * @description
 * 이 스크립트는 다음을 수행합니다:
 * 1. rclone 설치 여부 확인
 * 2. 환경 변수로 rclone.conf 동적 생성
 * 3. `rclone sync`로 로컬 → R2 동기화 (삭제 포함)
 *
 * @example CLI 실행 - 데이터 파일 업로드
 * ```bash
 * # public/data 폴더를 R2에 업로드
 * pnpm tsx scripts/upload-to-r2.ts data
 * ```
 *
 * @example CLI 실행 - SSG HTML 업로드
 * ```bash
 * # 빌드된 entry 페이지를 R2에 업로드
 * pnpm build:r2  # 먼저 빌드
 * pnpm tsx scripts/upload-to-r2.ts entries
 * ```
 *
 * @example 환경 변수 설정 (.env 또는 export)
 * ```bash
 * export CLOUDFLARE_ACCOUNT_ID="your-account-id"
 * export R2_ACCESS_KEY_ID="your-access-key"
 * export R2_SECRET_ACCESS_KEY="your-secret-key"
 * ```
 *
 * @remarks
 * - **wrangler 대신 rclone 사용 이유**: wrangler는 단일 스레드로 대량 파일 처리에 부적합
 * - **rclone sync 동작**: 소스에 없는 파일은 R2에서 자동 삭제됨
 * - **GitHub Actions**: `deploy-context-r2.yml`에서 자동 실행됨
 *
 * @see {@link https://rclone.org/s3/#cloudflare-r2 | rclone R2 설정 문서}
 * @see {@link ../../.github/workflows/deploy-context-r2.yml | deploy-context-r2.yml} R2 배포 워크플로우
 * @see {@link ./verify-remote-data.ts | verify-remote-data.ts} 업로드 후 검증 스크립트
 */

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * R2 버킷 이름.
 * 모든 정적 사이트 자산을 저장하는 공유 버킷입니다.
 */
const BUCKET_NAME = 'all-sites-static';

/**
 * R2 내 Context 앱 전용 경로 접두사.
 * 버킷 내에서 앱별로 경로를 분리합니다.
 */
const R2_PREFIX = 'public-monorepo/context';

/**
 * 업로드 대상 타입.
 *
 * @typedef {'data' | 'entries'} UploadTarget
 * @property data - public/data 폴더 (JSON 청크 파일)
 * @property entries - build/client/entry 폴더 (SSG HTML 파일)
 */
type UploadTarget = 'data' | 'entries';

/**
 * rclone CLI 도구가 시스템에 설치되어 있는지 확인합니다.
 *
 * `rclone version` 명령어를 실행하여 설치 여부를 판단합니다.
 *
 * @returns {boolean} rclone이 설치되어 있으면 true, 아니면 false
 *
 * @example
 * ```typescript
 * if (!checkRclone()) {
 *   console.error('rclone을 먼저 설치하세요');
 *   process.exit(1);
 * }
 * ```
 */
function checkRclone(): boolean {
  try {
    execSync('rclone version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * 환경 변수를 사용하여 rclone 설정 파일을 동적으로 생성합니다.
 *
 * `~/.config/rclone/rclone.conf`에 Cloudflare R2용 S3 호환 설정을 작성합니다.
 * 기존 설정 파일이 있으면 덮어씁니다.
 *
 * @throws 필수 환경 변수가 없으면 오류 메시지 출력 후 process.exit(1)
 *
 * @example 생성되는 설정 파일 형식
 * ```ini
 * [r2]
 * type = s3
 * provider = Cloudflare
 * access_key_id = <R2_ACCESS_KEY_ID>
 * secret_access_key = <R2_SECRET_ACCESS_KEY>
 * endpoint = https://<CLOUDFLARE_ACCOUNT_ID>.r2.cloudflarestorage.com
 * acl = private
 * ```
 *
 * @remarks
 * - GitHub Actions에서는 secrets로 환경 변수 주입
 * - 로컬에서는 .env 파일 또는 export로 설정
 *
 * @see {@link https://rclone.org/s3/#cloudflare-r2 | rclone Cloudflare R2 설정}
 */
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

/**
 * rclone sync 명령어로 로컬 디렉토리를 R2에 동기화합니다.
 *
 * 최적화된 옵션으로 병렬 업로드를 수행합니다:
 * - `--checksum`: 파일 내용 해시로 변경 감지 (시간 기반보다 정확)
 * - `--transfers 32`: 32개 파일 동시 업로드
 * - `--checkers 32`: 32개 파일 동시 비교
 * - `--fast-list`: 메모리 사용량 증가하지만 API 호출 감소
 *
 * @param localDir - 업로드할 로컬 디렉토리 경로
 * @param r2Path - R2 버킷 내 대상 경로 (버킷명 제외)
 *
 * @throws rclone 실행 실패 시 오류 출력 후 process.exit(1)
 *
 * @example
 * ```typescript
 * // public/data → r2:all-sites-static/public-monorepo/context/data
 * uploadWithRclone('public/data', 'public-monorepo/context/data');
 * ```
 *
 * @remarks
 * **중요**: `rclone sync`는 양방향 동기화가 아닙니다.
 * 소스(로컬)에 없는 파일은 대상(R2)에서 **자동 삭제**됩니다.
 *
 * @see {@link https://rclone.org/commands/rclone_sync/ | rclone sync 문서}
 */
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

/**
 * 지정된 대상에 따라 R2 업로드를 실행합니다.
 *
 * @param target - 업로드 대상 ('data' 또는 'entries')
 *
 * @description
 * - **data**: `public/data/` 폴더의 JSON 청크 파일들을 업로드
 * - **entries**: `build/client/entry/` 및 `build/client/ko/entry/`의 SSG HTML 업로드
 *
 * @example data 업로드
 * ```bash
 * pnpm tsx scripts/upload-to-r2.ts data
 * # public/data → r2:bucket/public-monorepo/context/data
 * ```
 *
 * @example entries 업로드
 * ```bash
 * pnpm tsx scripts/upload-to-r2.ts entries
 * # build/client/entry → r2:bucket/public-monorepo/context/entry
 * # build/client/ko/entry → r2:bucket/public-monorepo/context/ko/entry
 * ```
 *
 * @remarks
 * - entries 업로드 전 반드시 `pnpm build:r2` 실행 필요
 * - 한국어 엔트리 디렉토리가 없으면 영어만 업로드
 *
 * @see {@link uploadWithRclone} 실제 rclone 명령어 실행
 */
async function uploadFiles(target: UploadTarget): Promise<void> {
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
