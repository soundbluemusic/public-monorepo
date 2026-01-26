#!/usr/bin/env tsx

/**
 * Deprecated Imports Checker
 *
 * deprecated된 import 패턴을 감지하여 빌드 전에 경고합니다.
 *
 * 사용법:
 *   pnpm check:deprecated  # deprecated import 검사
 *
 * 추가된 이유:
 *   - lightEntries가 빈 배열을 반환하도록 변경되었으나, 기존 코드에서 계속 사용하면
 *     런타임에 "Something went wrong" 오류가 발생함
 *   - 빌드 시점에 미리 감지하여 fetch 기반 로딩으로 마이그레이션 유도
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { globSync } from 'glob';

interface DeprecatedPattern {
  pattern: RegExp;
  message: string;
  suggestion: string;
  severity: 'error' | 'warning';
}

interface Violation {
  file: string;
  line: number;
  pattern: string;
  message: string;
  suggestion: string;
  severity: 'error' | 'warning';
  code: string;
}

/**
 * Deprecated import patterns
 * 새로운 deprecated 패턴 추가 시 여기에 등록
 */
const DEPRECATED_PATTERNS: DeprecatedPattern[] = [
  {
    // lightEntries는 deprecated - 빈 배열 반환
    pattern: /import\s*\{[^}]*\blightEntries\b[^}]*\}\s*from\s*['"]@\/data\/entries['"]/,
    message: 'lightEntries is deprecated and returns empty array',
    suggestion: 'Use fetch("/data/browse/alphabetical/*.json") instead',
    severity: 'error',
  },
  {
    // allEntries도 deprecated일 수 있음
    pattern: /import\s*\{[^}]*\ballEntries\b[^}]*\}\s*from\s*['"]@\/data\/entries['"]/,
    message: 'allEntries is deprecated for client-side use',
    suggestion: 'Use D1 database queries via createServerFn for SSR',
    severity: 'warning',
  },
  {
    // 직접 entries 파일 import (SSR 안전하지 않음)
    pattern: /import\s+(?:\*\s+as\s+\w+|\{[^}]+\})\s+from\s*['"]\.\.\/data\/generated\/entries['"]/,
    message: 'Direct import from generated entries is deprecated',
    suggestion: 'Use D1 queries or fetch-based loading',
    severity: 'warning',
  },
];

/**
 * 검사할 파일 패턴
 */
const FILE_PATTERNS = [
  'apps/context/app/**/*.{ts,tsx}',
  'apps/roots/app/**/*.{ts,tsx}',
  'apps/permissive/app/**/*.{ts,tsx}',
  'packages/**/src/**/*.{ts,tsx}',
];

/**
 * 제외할 파일 패턴
 */
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/.turbo/**',
  '**/dist/**',
  '**/build/**',
  '**/*.d.ts',
  '**/routeTree.gen.ts',
  '**/paraglide/**',
];

function checkFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const deprecated of DEPRECATED_PATTERNS) {
      if (deprecated.pattern.test(line)) {
        violations.push({
          file: filePath,
          line: i + 1,
          pattern: deprecated.pattern.source,
          message: deprecated.message,
          suggestion: deprecated.suggestion,
          severity: deprecated.severity,
          code: line.trim(),
        });
      }
    }
  }

  return violations;
}

function formatViolation(v: Violation): string {
  const icon = v.severity === 'error' ? '❌' : '⚠️';
  return `${icon} ${v.file}:${v.line}
   └─ ${v.message}
   └─ Code: ${v.code.substring(0, 80)}${v.code.length > 80 ? '...' : ''}
   └─ Fix: ${v.suggestion}`;
}

async function main() {
  console.log('\n🔍 Deprecated Imports 검사 시작...\n');
  console.log('='.repeat(60));

  const rootDir = resolve(process.cwd());
  const allFiles: string[] = [];

  // 파일 수집
  for (const pattern of FILE_PATTERNS) {
    const files = globSync(pattern, {
      cwd: rootDir,
      ignore: EXCLUDE_PATTERNS,
      absolute: true,
    });
    allFiles.push(...files);
  }

  console.log(`\n검사 대상 파일: ${allFiles.length}개\n`);

  // 검사 실행
  const allViolations: Violation[] = [];
  for (const file of allFiles) {
    const violations = checkFile(file);
    allViolations.push(...violations);
  }

  // 결과 출력
  console.log('='.repeat(60));

  if (allViolations.length === 0) {
    console.log('\n✅ Deprecated import가 발견되지 않았습니다!\n');
    process.exit(0);
  }

  const errors = allViolations.filter((v) => v.severity === 'error');
  const warnings = allViolations.filter((v) => v.severity === 'warning');

  console.log(`\n📊 검사 결과: ${errors.length}개 에러, ${warnings.length}개 경고\n`);

  if (errors.length > 0) {
    console.log('❌ 에러 (반드시 수정 필요):\n');
    for (const violation of errors) {
      console.log(formatViolation(violation));
      console.log('');
    }
  }

  if (warnings.length > 0) {
    console.log('⚠️  경고 (권장 수정):\n');
    for (const violation of warnings) {
      console.log(formatViolation(violation));
      console.log('');
    }
  }

  console.log('='.repeat(60));
  console.log('\n수정 방법:');
  console.log('  1. lightEntries → fetch("/data/browse/alphabetical/*.json") 사용');
  console.log('  2. allEntries → createServerFn + D1 쿼리 사용 (SSR)');
  console.log('  3. 직접 import → fetch 기반 로딩으로 변경');
  console.log('\n참고: apps/context/app/components/my-learning/useMyLearningData.ts\n');

  // 에러가 있으면 실패
  if (errors.length > 0) {
    process.exit(1);
  }

  // 경고만 있으면 성공 (CI에서는 통과)
  process.exit(0);
}

main().catch((err) => {
  console.error('검사 중 오류 발생:', err);
  process.exit(1);
});
