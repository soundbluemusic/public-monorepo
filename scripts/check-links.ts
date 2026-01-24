/**
 * 링크 무결성 검사 스크립트 (lychee 기반 - Rust)
 * - 모든 앱의 내부 링크가 404 없이 정상 작동하는지 확인
 * - 빌드된 정적 사이트의 preview 서버를 사용하여 검증
 */

import type { ChildProcess } from 'node:child_process';
import { execSync, spawn } from 'node:child_process';

interface AppConfig {
  name: string;
  port: number;
  url: string;
}

const apps: AppConfig[] = [
  { name: 'context', port: 3003, url: 'http://localhost:3003' },
  { name: 'permissive', port: 3004, url: 'http://localhost:3004' },
  { name: 'roots', port: 3005, url: 'http://localhost:3005' },
];

interface LycheeLink {
  url: string;
  status: { code: number } | { text: string };
}

interface LycheeResult {
  fail_map: Record<string, LycheeLink[]>;
  success_map: Record<string, LycheeLink[]>;
  error_map: Record<string, LycheeLink[]>;
  stats: {
    total: number;
    successful: number;
    failed: number;
    errors: number;
  };
}

interface LinkCheckResult {
  app: string;
  success: boolean;
  brokenLinks: number;
  totalLinks: number;
  brokenDetails: Array<{ url: string; status: number; parent: string }>;
}

function startPreviewServer(
  appName: string,
): Promise<{ process: ChildProcess; ready: Promise<void> }> {
  return new Promise((resolve, _reject) => {
    const previewProcess = spawn('pnpm', [`preview:${appName}`], {
      stdio: 'pipe',
      shell: true,
    });

    let _output = '';

    const ready = new Promise<void>((resolveReady, rejectReady) => {
      const timeout = setTimeout(() => {
        rejectReady(new Error(`${appName} preview server timeout`));
      }, 30000);

      previewProcess.stdout?.on('data', (data) => {
        const text = data.toString();
        _output += text;
        // Preview 서버가 준비되면 "Local:" 또는 "localhost" 문자열이 출력됨
        if (text.includes('Local:') || text.includes('localhost')) {
          clearTimeout(timeout);
          // 서버가 완전히 시작될 때까지 약간의 지연
          setTimeout(() => resolveReady(), 2000);
        }
      });

      previewProcess.stderr?.on('data', (data) => {
        _output += data.toString();
      });

      previewProcess.on('error', (error) => {
        clearTimeout(timeout);
        rejectReady(error);
      });

      previewProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          clearTimeout(timeout);
          rejectReady(new Error(`Preview process exited with code ${code}`));
        }
      });
    });

    resolve({ process: previewProcess, ready });
  });
}

async function checkLinks(url: string): Promise<{
  brokenLinks: number;
  totalLinks: number;
  brokenDetails: Array<{ url: string; status: number; parent: string }>;
}> {
  const brokenDetails: Array<{ url: string; status: number; parent: string }> = [];

  try {
    // lychee CLI 실행 (Rust 기반 - 훨씬 빠름)
    // --exclude: 외부 링크 및 /entry/* 경로 제외
    // --format json: JSON 출력
    // --no-progress: 진행 상태 표시 안함
    // --timeout 10: 10초 타임아웃
    const result = execSync(
      `lychee "${url}" --format json --no-progress --timeout 10 --exclude "^https?://(?!localhost)" --exclude "/entry/"`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 },
    );

    const lycheeResult: LycheeResult = JSON.parse(result);

    // 실패한 링크 수집
    for (const [parent, links] of Object.entries(lycheeResult.fail_map || {})) {
      for (const link of links) {
        const status =
          typeof link.status === 'object' && 'code' in link.status ? link.status.code : 0;
        brokenDetails.push({ url: link.url, status, parent });
      }
    }

    // 에러 링크도 실패로 처리
    for (const [parent, links] of Object.entries(lycheeResult.error_map || {})) {
      for (const link of links) {
        brokenDetails.push({ url: link.url, status: 0, parent });
      }
    }

    return {
      brokenLinks: lycheeResult.stats.failed + lycheeResult.stats.errors,
      totalLinks: lycheeResult.stats.total,
      brokenDetails,
    };
  } catch (error: unknown) {
    // lychee는 깨진 링크가 있으면 exit code 1 반환
    // 하지만 stdout에는 JSON 결과가 있음
    if (error instanceof Error && 'stdout' in error) {
      const stdout = (error as { stdout: string }).stdout;
      if (stdout) {
        try {
          const lycheeResult: LycheeResult = JSON.parse(stdout);

          for (const [parent, links] of Object.entries(lycheeResult.fail_map || {})) {
            for (const link of links) {
              const status =
                typeof link.status === 'object' && 'code' in link.status ? link.status.code : 0;
              brokenDetails.push({ url: link.url, status, parent });
            }
          }

          for (const [parent, links] of Object.entries(lycheeResult.error_map || {})) {
            for (const link of links) {
              brokenDetails.push({ url: link.url, status: 0, parent });
            }
          }

          return {
            brokenLinks: lycheeResult.stats.failed + lycheeResult.stats.errors,
            totalLinks: lycheeResult.stats.total,
            brokenDetails,
          };
        } catch {
          // JSON 파싱 실패 시 기본값 반환
        }
      }
    }

    // 완전한 실패
    throw error;
  }
}

async function checkApp(app: AppConfig): Promise<LinkCheckResult> {
  console.log(`\n📦 ${app.name} 링크 검사 시작...`);

  let previewProcess: ChildProcess | null = null;

  try {
    // Preview 서버 시작
    const { process, ready } = await startPreviewServer(app.name);
    previewProcess = process;
    await ready;

    console.log(`   ✓ Preview 서버 시작됨: ${app.url}`);

    // 링크 체크 실행 (lychee 사용 - Rust 기반)
    const { brokenLinks, totalLinks, brokenDetails } = await checkLinks(app.url);

    if (brokenLinks === 0) {
      console.log(`   ✅ 모든 링크 정상 (${totalLinks}개 검사, 404 없음)`);
      return { app: app.name, success: true, brokenLinks: 0, totalLinks, brokenDetails: [] };
    }
    console.log(`   ❌ 깨진 링크 발견: ${brokenLinks}개 / ${totalLinks}개`);
    for (const detail of brokenDetails) {
      console.log(`      - ${detail.url} (${detail.status}) from ${detail.parent}`);
    }
    return { app: app.name, success: false, brokenLinks, totalLinks, brokenDetails };
  } catch (error: unknown) {
    console.log(`   ❌ 오류 발생: ${error instanceof Error ? error.message : String(error)}`);
    return {
      app: app.name,
      success: false,
      brokenLinks: -1,
      totalLinks: 0,
      brokenDetails: [],
    };
  } finally {
    // Preview 서버 종료
    if (previewProcess) {
      previewProcess.kill();
      // 프로세스가 완전히 종료될 때까지 대기
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

async function main(): Promise<void> {
  console.log('\n🔗 링크 무결성 검사 시작 (lychee - Rust)...\n');
  console.log('='.repeat(60));

  const results: LinkCheckResult[] = [];

  // 각 앱을 순차적으로 검사 (병렬 실행 시 포트 충돌 방지)
  for (const app of apps) {
    const result = await checkApp(app);
    results.push(result);
  }

  // 결과 요약
  console.log(`\n${'='.repeat(60)}`);
  console.log('\n📊 검사 결과 요약:\n');

  let allPassed = true;
  let totalLinksChecked = 0;
  let totalBroken = 0;

  for (const result of results) {
    const status = result.success ? '✅' : '❌';
    totalLinksChecked += result.totalLinks;
    totalBroken += result.brokenLinks > 0 ? result.brokenLinks : 0;
    console.log(
      `${status} ${result.app}: ${result.brokenLinks === 0 ? `모든 링크 정상 (${result.totalLinks}개)` : `${result.brokenLinks}개 깨진 링크`}`,
    );
    if (!result.success) {
      allPassed = false;
    }
  }

  console.log(`\n   총 검사: ${totalLinksChecked}개 링크, 깨진 링크: ${totalBroken}개`);
  console.log(`\n${'='.repeat(60)}\n`);

  if (allPassed) {
    console.log('✅ 모든 앱의 링크 무결성 검증 통과!\n');
    process.exit(0);
  }
  console.log('❌ 링크 무결성 검증 실패. 위의 오류를 확인하세요.\n');
  process.exit(1);
}

main();
