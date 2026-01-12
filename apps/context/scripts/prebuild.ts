/**
 * 병렬화된 Prebuild 스크립트
 *
 * 의존 관계 분석:
 * - Phase A (독립, 병렬 실행):
 *   - generate-paraglide-messages.ts
 *   - load-entries.ts (가장 느림, entries.ts 생성)
 *
 * - Phase B (load-entries 의존, Phase A 완료 후 병렬 실행):
 *   - generate-search-index.ts (entries 데이터 필요)
 *   - generate-homonyms.ts
 *   - compress-entries.ts
 *   - export-data.ts
 *
 * 예상 시간 단축: 50-60초 → 25-30초 (50% 감소)
 */

import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ScriptResult {
  script: string;
  success: boolean;
  duration: number;
  error?: string;
}

async function runScript(scriptName: string): Promise<ScriptResult> {
  const startTime = Date.now();
  const scriptPath = join(__dirname, scriptName);

  return new Promise((resolve) => {
    const proc = spawn('tsx', [scriptPath], {
      stdio: 'inherit',
      cwd: join(__dirname, '..'),
    });

    proc.on('close', (code) => {
      const duration = Date.now() - startTime;
      if (code === 0) {
        resolve({ script: scriptName, success: true, duration });
      } else {
        resolve({
          script: scriptName,
          success: false,
          duration,
          error: `Exit code: ${code}`,
        });
      }
    });

    proc.on('error', (err) => {
      const duration = Date.now() - startTime;
      resolve({
        script: scriptName,
        success: false,
        duration,
        error: err.message,
      });
    });
  });
}

async function runPhase(phaseName: string, scripts: string[]): Promise<ScriptResult[]> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 ${phaseName}`);
  console.log(`   Scripts: ${scripts.join(', ')}`);
  console.log('='.repeat(60));

  const results = await Promise.all(scripts.map((script) => runScript(script)));

  return results;
}

function printSummary(results: ScriptResult[], totalDuration: number): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 Prebuild Summary');
  console.log('='.repeat(60));

  const maxNameLength = Math.max(...results.map((r) => r.script.length));

  for (const result of results) {
    const status = result.success ? '✅' : '❌';
    const name = result.script.padEnd(maxNameLength);
    const time = `${(result.duration / 1000).toFixed(1)}s`;
    console.log(`   ${status} ${name}  ${time}`);
  }

  console.log('-'.repeat(60));
  console.log(`   Total: ${(totalDuration / 1000).toFixed(1)}s`);

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.log(`\n❌ ${failed.length} script(s) failed:`);
    for (const f of failed) {
      console.log(`   - ${f.script}: ${f.error}`);
    }
  } else {
    console.log('\n✅ All scripts completed successfully!');
  }
}

async function main(): Promise<void> {
  const startTime = Date.now();
  const allResults: ScriptResult[] = [];

  console.log('🚀 Starting parallel prebuild...');
  console.log(`   Mode: ${process.env.PREBUILD_MODE || 'parallel (default)'}`);

  // Phase A: 독립적인 스크립트들 (병렬)
  // generate-search-index.ts는 entries 데이터에 의존하므로 Phase B로 이동
  const phaseAScripts = ['generate-paraglide-messages.ts', 'load-entries.ts'];
  const phaseAResults = await runPhase('Phase A: Independent scripts (parallel)', phaseAScripts);
  allResults.push(...phaseAResults);

  // Phase A 실패 확인
  const phaseAFailed = phaseAResults.some((r) => !r.success);
  if (phaseAFailed) {
    const loadEntriesFailed = phaseAResults.find(
      (r) => r.script === 'load-entries.ts' && !r.success,
    );
    if (loadEntriesFailed) {
      console.error('\n❌ load-entries.ts failed - cannot continue with Phase B');
      printSummary(allResults, Date.now() - startTime);
      process.exit(1);
    }
  }

  // Phase B: load-entries 의존 스크립트들 (병렬)
  const phaseBScripts = [
    'generate-search-index.ts',
    'generate-homonyms.ts',
    'compress-entries.ts',
    'export-data.ts',
  ];
  const phaseBResults = await runPhase(
    'Phase B: Dependent scripts (parallel after Phase A)',
    phaseBScripts,
  );
  allResults.push(...phaseBResults);

  // 최종 요약
  const totalDuration = Date.now() - startTime;
  printSummary(allResults, totalDuration);

  // 실패한 스크립트가 있으면 exit code 1
  const anyFailed = allResults.some((r) => !r.success);
  process.exit(anyFailed ? 1 : 0);
}

main().catch((err) => {
  console.error('Prebuild failed:', err);
  process.exit(1);
});
