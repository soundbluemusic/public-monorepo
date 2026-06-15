/**
 * SSR 빌드 검증 스크립트
 *
 * 검사 항목:
 * 1. Astro SSR 모드 확인 (astro.config.mjs의 output: 'server')
 * 2. 서버 번들 존재 확인 (dist/server/)
 * 3. 클라이언트 자산 존재 확인 (dist/client/)
 *
 * ⚠️ SPA 금지: 이 프로젝트는 SSR만 사용합니다 (SEO 필수).
 *   - Context: SSR + D1
 *   - Permissive: SSR
 *   - Roots: SSR
 * output: 'static'으로 바뀌면 빈 HTML이 생성되어 검색 엔진 노출이 불가능합니다.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

interface AppConfig {
  name: string;
  serverDir: string;
  clientDir: string;
  astroConfig: string;
}

const apps: AppConfig[] = [
  {
    name: 'context',
    serverDir: 'apps/context/dist/server',
    clientDir: 'apps/context/dist/client',
    astroConfig: 'apps/context/astro.config.mjs',
  },
  {
    name: 'permissive',
    serverDir: 'apps/permissive/dist/server',
    clientDir: 'apps/permissive/dist/client',
    astroConfig: 'apps/permissive/astro.config.mjs',
  },
  {
    name: 'roots',
    serverDir: 'apps/roots/dist/server',
    clientDir: 'apps/roots/dist/client',
    astroConfig: 'apps/roots/astro.config.mjs',
  },
];

/**
 * Astro SSR 모드 확인
 * astro.config.mjs에 output: 'server'가 있어야 함 (SPA 방지).
 * output: 'static'은 빈 HTML을 생성하여 SEO가 불가능하므로 금지.
 */
function verifyAstroSSR(astroConfig: string): {
  passed: boolean;
  details: string;
} {
  if (!existsSync(astroConfig)) {
    return { passed: false, details: 'astro.config.mjs 없음' };
  }

  const content = readFileSync(astroConfig, 'utf-8');
  if (/output:\s*['"]server['"]/.test(content)) {
    return { passed: true, details: "output: 'server'" };
  }
  if (/output:\s*['"]static['"]/.test(content)) {
    return { passed: false, details: "output: 'static' 발견 (SPA 금지 — SSR 필수)" };
  }
  return { passed: false, details: "output: 'server' 설정 없음" };
}

/**
 * 서버 번들 존재 여부 확인
 * SSR 앱은 dist/server/ 디렉토리에 번들이 있어야 함
 */
function verifyServerBundle(serverDir: string): {
  passed: boolean;
  details: string;
} {
  if (!existsSync(serverDir)) {
    return { passed: false, details: '서버 디렉토리 없음' };
  }

  try {
    const files = readdirSync(serverDir);
    const hasBundle = files.some((f) => f.endsWith('.js') || f.endsWith('.mjs'));
    if (hasBundle) {
      return { passed: true, details: `${files.length}개 파일` };
    }
    return { passed: false, details: '서버 번들 없음' };
  } catch {
    return { passed: false, details: '디렉토리 읽기 실패' };
  }
}

/**
 * 클라이언트 자산 존재 여부 확인
 * SSR 앱도 dist/client/assets/ 디렉토리에 정적 자산이 있어야 함
 */
function verifyClientAssets(clientDir: string): {
  passed: boolean;
  details: string;
} {
  const assetsDir = join(clientDir, 'assets');

  if (!existsSync(assetsDir)) {
    // assets 디렉토리가 없어도 client 디렉토리가 있으면 OK
    if (existsSync(clientDir)) {
      return { passed: true, details: 'assets 없음 (허용)' };
    }
    return { passed: false, details: '클라이언트 디렉토리 없음' };
  }

  try {
    const files = readdirSync(assetsDir);
    const jsFiles = files.filter((f) => f.endsWith('.js'));
    const cssFiles = files.filter((f) => f.endsWith('.css'));
    return {
      passed: true,
      details: `JS ${jsFiles.length}개, CSS ${cssFiles.length}개`,
    };
  } catch {
    return { passed: false, details: '디렉토리 읽기 실패' };
  }
}

function verify(): boolean {
  console.log('\n🔍 SSR 빌드 검증 시작...\n');
  let allPassed = true;

  for (const app of apps) {
    console.log(`📦 ${app.name}`);

    // 1. Astro SSR 모드 확인 (SPA 방지 — SEO 필수)
    const ssrResult = verifyAstroSSR(app.astroConfig);
    console.log(`   ${ssrResult.passed ? '✅' : '❌'} SSR 모드: ${ssrResult.details}`);
    if (!ssrResult.passed) allPassed = false;

    // 2. 서버 번들 확인
    const serverResult = verifyServerBundle(app.serverDir);
    console.log(`   ${serverResult.passed ? '✅' : '❌'} 서버 번들: ${serverResult.details}`);
    if (!serverResult.passed) allPassed = false;

    // 3. 클라이언트 자산 확인
    const clientResult = verifyClientAssets(app.clientDir);
    console.log(`   ${clientResult.passed ? '✅' : '❌'} 클라이언트 자산: ${clientResult.details}`);
    if (!clientResult.passed) allPassed = false;

    console.log('');
  }

  if (allPassed) {
    console.log('✅ 모든 SSR 검증 통과!\n');
  } else {
    console.log('❌ SSR 검증 실패. 위의 오류를 확인하세요.\n');
    process.exit(1);
  }

  return allPassed;
}

verify();
