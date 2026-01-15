/**
 * R2 원격 데이터 일관성 검증 스크립트
 *
 * 로컬 빌드 데이터와 R2에 배포된 데이터가 일치하는지 검증합니다.
 * 배포 후 데이터 누락이나 동기화 문제를 감지하는 데 사용됩니다.
 *
 * @module apps/context/scripts/verify-remote-data
 * @environment build-only (Node.js CLI)
 *
 * @description
 * 이 스크립트는 다음을 수행합니다:
 * 1. 로컬 entry-index에서 모든 초성(choseong) 청크 키 추출
 * 2. 각 청크에 대해 로컬 JSON과 원격 R2 JSON 비교
 * 3. 원격에 누락된 엔트리 ID 감지 및 보고
 *
 * @example CLI 실행
 * ```bash
 * # apps/context 디렉토리에서 실행
 * pnpm tsx scripts/verify-remote-data.ts
 *
 * # 또는 루트에서 실행
 * pnpm tsx apps/context/scripts/verify-remote-data.ts
 * ```
 *
 * @example 출력 예시 (성공)
 * ```
 * Verifying Remote Data Consistency...
 * Found 14 unique choseong chunks locally.
 * Fetching https://context.soundbluemusic.com/data/chunks/entries-%E3%84%B1.json...
 * [OK] entries-ㄱ.json matches.
 * ...
 * --- Remote Verification Summary ---
 * ✅ Remote R2 data is fully consistent with Local Build.
 * ```
 *
 * @example 출력 예시 (실패)
 * ```
 * [FAIL] entries-ㄴ.json: 5 IDs missing in remote!
 * Example missing: hello, world, test
 * --- Remote Verification Summary ---
 * Found 1 issues.
 * entries-ㄴ.json (Remote Outdated, missing 5 entries)
 * ```
 *
 * @remarks
 * - 배포 직후 CDN 전파 지연으로 인해 일시적 불일치가 발생할 수 있음
 * - 30초 정도 대기 후 재실행 권장
 * - CI/CD에서는 `deploy-context-r2.yml`의 검증 단계에서 자동 실행됨
 *
 * @see {@link ../app/data/generated/entry-index | entry-index} 초성별 엔트리 매핑
 * @see {@link ../../.github/workflows/deploy-context-r2.yml | deploy-context-r2.yml} R2 배포 워크플로우
 */

import { entryIndex } from '../app/data/generated/entry-index';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Entry chunk 파일에 저장된 엔트리의 최소 타입.
 *
 * 청크 파일(entries-{choseong}.json)의 각 항목은 최소한 id를 포함합니다.
 * 실제 파일에는 더 많은 필드가 있지만, 검증에는 id만 필요합니다.
 *
 * @interface ChunkEntry
 */
interface ChunkEntry {
  /** 엔트리의 고유 식별자 (예: "hello", "world") */
  id: string;
}

/**
 * 검증 대상 프로덕션 URL.
 * Cloudflare Pages + R2 조합으로 서빙되는 실제 사이트 주소입니다.
 */
const BASE_URL = 'https://context.soundbluemusic.com';

/**
 * 로컬 청크 파일이 저장된 디렉토리 경로.
 * prebuild 단계에서 생성된 JSON 청크 파일들이 위치합니다.
 */
const CHUNK_DIR = join(process.cwd(), 'apps/context/public/data/chunks');

/**
 * 원격 R2 데이터와 로컬 빌드 데이터의 일관성을 검증합니다.
 *
 * 각 초성(choseong) 청크에 대해:
 * 1. 로컬 파일에서 모든 엔트리 ID 추출
 * 2. 원격 URL에서 동일한 청크 fetch
 * 3. 원격에 없는 로컬 ID가 있으면 실패로 기록
 *
 * @returns {Promise<void>} 검증 완료 후 결과를 콘솔에 출력
 *
 * @throws 네트워크 오류 시 개별 청크 검증 실패로 기록 (전체 중단 없음)
 *
 * @example
 * ```typescript
 * // 직접 호출 (일반적으로 CLI에서 실행)
 * await checkRemote();
 * ```
 *
 * @remarks
 * - 한글 초성은 URL 인코딩되어 전송됨 (예: ㄱ → %E3%84%B1)
 * - 로컬에 있지만 원격에 없는 경우만 실패로 간주
 * - 원격에만 있는 추가 데이터는 무시 (이전 버전 잔여 데이터 가능)
 */
async function checkRemote(): Promise<void> {
  console.log('Verifying Remote Data Consistency...');

  // 1. entry-index에서 모든 초성 키 추출
  // entryIndex: { [entryId: string]: choseong } 형태
  const choseongs = new Set<string>(Object.values(entryIndex));
  console.log(`Found ${choseongs.size} unique choseong chunks locally.`);

  const failures: string[] = [];

  for (const choseong of choseongs) {
    const filename = `entries-${choseong}.json`;
    const localPath = join(CHUNK_DIR, filename);

    // 로컬 파일 존재 확인
    if (!existsSync(localPath)) {
      console.error(`Local file missing: ${filename}`);
      continue;
    }

    // 로컬 데이터 로드 및 ID 추출
    const localData: ChunkEntry[] = JSON.parse(readFileSync(localPath, 'utf-8'));
    const localIds = new Set(localData.map((e) => e.id));

    // 원격 데이터 fetch (한글 URL 인코딩 처리)
    const encodedFilename = `entries-${encodeURIComponent(choseong)}.json`;
    const url = `${BASE_URL}/data/chunks/${encodedFilename}`;

    try {
      console.log(`Fetching ${url}...`);
      const res = await fetch(url);

      if (!res.ok) {
        console.error(`[FAIL] Failed to fetch ${filename}: ${res.status}`);
        failures.push(`Missing Chunk: ${filename}`);
        continue;
      }

      const remoteData: ChunkEntry[] = await res.json();
      const remoteIds = new Set(remoteData.map((e) => e.id));

      // 비교: 로컬에 있는 ID가 원격에도 있는지 확인
      // 클라이언트가 로컬 인덱스 기반으로 요청하면 원격에 없을 경우 404 발생
      const missingInRemote = [...localIds].filter((id) => !remoteIds.has(id));

      if (missingInRemote.length > 0) {
        console.error(`[FAIL] ${filename}: ${missingInRemote.length} IDs missing in remote!`);
        console.error(`Example missing: ${missingInRemote.slice(0, 3).join(', ')}`);
        failures.push(`${filename} (Remote Outdated, missing ${missingInRemote.length} entries)`);
      } else {
        console.log(`[OK] ${filename} matches.`);
      }
    } catch (e) {
      console.error(`Error checking ${filename}:`, e);
      failures.push(`Error: ${filename}`);
    }
  }

  // 최종 결과 출력
  console.log('\n--- Remote Verification Summary ---');
  if (failures.length > 0) {
    console.log(`Found ${failures.length} issues.`);
    console.log(failures.join('\n'));
  } else {
    console.log('✅ Remote R2 data is fully consistent with Local Build.');
  }
}

// CLI 실행
checkRemote();
