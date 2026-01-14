#!/usr/bin/env tsx
/**
 * Quality Gate - 병렬 품질 검사 통합 스크립트
 *
 * 사용법:
 *   pnpm quality        # 전체 검사
 *   pnpm quality:quick  # 빠른 검사 (링크 검사 제외)
 *
 * 검사 항목:
 *   - SSG 규칙 검사 (ssr:false, prerender 존재)
 *   - Layer 규칙 검사 (순환 의존성)
 *   - 링크 무결성 검사 (프로덕션 URL)
 */

import { type ChildProcess, spawn } from 'node:child_process';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  output: string;
  errors: string[];
}

interface CheckConfig {
  name: string;
  command: string;
  args: string[];
  skipInQuick?: boolean;
  parser?: (output: string) => string[];
}

const checks: CheckConfig[] = [
  {
    name: 'SSG Check',
    command: 'tsx',
    args: ['scripts/verify-ssg.ts'],
    parser: (output) => {
      const errors: string[] = [];
      if (output.includes('❌')) {
        const lines = output.split('\n').filter((l) => l.includes('❌'));
        errors.push(...lines);
      }
      return errors;
    },
  },
  {
    name: 'Layer Check',
    command: 'pnpm',
    args: ['check:circular'],
    parser: (output) => {
      const errors: string[] = [];
      if (output.includes('Circular')) {
        const lines = output.split('\n').filter((l) => l.includes('→'));
        errors.push(...lines);
      }
      return errors;
    },
  },
  {
    name: 'TypeCheck',
    command: 'pnpm',
    args: ['typecheck'],
    parser: (output) => {
      const errors: string[] = [];
      const errorMatch = output.match(/error TS\d+/g);
      if (errorMatch) {
        errors.push(...errorMatch);
      }
      return errors;
    },
  },
  {
    name: 'Lint',
    command: 'pnpm',
    args: ['lint'],
    parser: (output) => {
      const errors: string[] = [];
      if (output.includes('error')) {
        const lines = output.split('\n').filter((l) => l.includes('error'));
        errors.push(...lines.slice(0, 10)); // 최대 10개
      }
      return errors;
    },
  },
  {
    name: 'Link Check (Prod)',
    command: 'lychee',
    args: ['--config', '.lychee.toml', 'https://context.soundbluemusic.com', '--no-progress'],
    skipInQuick: true,
    parser: (output) => {
      const errors: string[] = [];
      if (output.includes('Errors')) {
        const lines = output.split('\n').filter((l) => l.includes('[4') || l.includes('[5'));
        errors.push(...lines);
      }
      return errors;
    },
  },
];

function runCheck(config: CheckConfig): Promise<CheckResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    let output = '';

    const proc: ChildProcess = spawn(config.command, config.args, {
      shell: true,
      stdio: 'pipe',
    });

    proc.stdout?.on('data', (data) => {
      output += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      output += data.toString();
    });

    proc.on('close', (code) => {
      const duration = Date.now() - start;
      const errors = config.parser ? config.parser(output) : [];

      resolve({
        name: config.name,
        status: code === 0 ? 'pass' : 'fail',
        duration,
        output,
        errors,
      });
    });

    proc.on('error', (err) => {
      resolve({
        name: config.name,
        status: 'fail',
        duration: Date.now() - start,
        output: err.message,
        errors: [err.message],
      });
    });
  });
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

async function main() {
  const isQuick = process.argv.includes('--quick');
  const isJson = process.argv.includes('--json');

  console.log('\n🔍 Quality Gate 시작...\n');
  console.log('='.repeat(60));

  const checksToRun = checks.filter((c) => !isQuick || !c.skipInQuick);

  console.log(`\n실행할 검사: ${checksToRun.map((c) => c.name).join(', ')}\n`);

  // 병렬 실행
  const startTime = Date.now();
  const results = await Promise.all(checksToRun.map(runCheck));
  const totalDuration = Date.now() - startTime;

  // 결과 출력
  console.log('\n📊 검사 결과:\n');
  console.log('='.repeat(60));

  let allPassed = true;
  const failedChecks: CheckResult[] = [];

  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : result.status === 'skip' ? '⏭️' : '❌';
    console.log(`${icon} ${result.name} (${formatDuration(result.duration)})`);

    if (result.status === 'fail') {
      allPassed = false;
      failedChecks.push(result);

      if (result.errors.length > 0) {
        for (const error of result.errors.slice(0, 5)) {
          console.log(`   └─ ${error}`);
        }
        if (result.errors.length > 5) {
          console.log(`   └─ ... 외 ${result.errors.length - 5}개`);
        }
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n⏱️  총 소요 시간: ${formatDuration(totalDuration)}`);

  // JSON 출력 (CI 연동용)
  if (isJson) {
    const jsonOutput = {
      success: allPassed,
      duration: totalDuration,
      results: results.map((r) => ({
        name: r.name,
        status: r.status,
        duration: r.duration,
        errorCount: r.errors.length,
      })),
    };
    console.log('\n📄 JSON Output:');
    console.log(JSON.stringify(jsonOutput, null, 2));
  }

  // 최종 결과
  console.log('\n');
  if (allPassed) {
    console.log('✅ Quality Gate 통과!\n');
    process.exit(0);
  } else {
    console.log('❌ Quality Gate 실패\n');
    console.log('실패한 검사:');
    for (const failed of failedChecks) {
      console.log(`  - ${failed.name}`);
    }
    console.log('\n위 오류를 수정한 후 다시 실행하세요.\n');
    process.exit(1);
  }
}

main();
