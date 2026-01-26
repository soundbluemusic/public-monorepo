/**
 * SSR 빌드 검증 스크립트
 *
 * 검사 항목:
 * 1. 서버 번들 존재 확인 (dist/server/)
 * 2. 클라이언트 자산 존재 확인 (dist/client/assets/)
 * 3. 동적 라우트에 loader 존재 확인 (SPA 방지)
 * 4. params.locale 사용 금지 (URL pathname에서 추출해야 함)
 *
 * ⚠️ SPA 금지: 이 프로젝트는 SSR만 사용합니다.
 *   - Context: SSR + D1
 *   - Permissive: SSR
 *   - Roots: SSR
 * clientLoader만 있고 loader가 없는 동적 라우트는 SEO 불가능합니다.
 *
 * ⚠️ params.locale 금지: ($locale) 라우트에서 params.locale은 항상 undefined입니다.
 * routes.ts에서 'ko/entry/:entryId' 형태로 정의하면 'ko'는 고정 문자열이 됩니다.
 * 반드시 getLocaleFromPath(url.pathname) 또는 getLocaleFromPath(window.location.pathname)을 사용하세요.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

interface AppConfig {
  name: string;
  serverDir: string;
  clientDir: string;
  routesDir: string;
}

const apps: AppConfig[] = [
  {
    name: 'context',
    serverDir: 'apps/context/dist/server',
    clientDir: 'apps/context/dist/client',
    routesDir: 'apps/context/app/routes',
  },
  {
    name: 'permissive',
    serverDir: 'apps/permissive/dist/server',
    clientDir: 'apps/permissive/dist/client',
    routesDir: 'apps/permissive/app/routes',
  },
  {
    name: 'roots',
    serverDir: 'apps/roots/dist/server',
    clientDir: 'apps/roots/dist/client',
    routesDir: 'apps/roots/app/routes',
  },
];

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

/**
 * 동적 라우트 파일에서 params.locale 사용 여부 확인
 * params.locale은 ($locale) 라우트에서 항상 undefined이므로 사용 금지
 *
 * ✅ 올바른 패턴:
 * - loader: getLocaleFromPath(new URL(request.url).pathname)
 * - clientLoader: getLocaleFromPath(window.location.pathname)
 *
 * ❌ 금지 패턴:
 * - params.locale === 'ko'
 * - params.locale || 'en'
 * - const locale = params.locale
 */
function verifyNoParamsLocale(routesDir: string): {
  passed: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!existsSync(routesDir)) {
    return { passed: true, errors: [] };
  }

  try {
    const files = readdirSync(routesDir);
    // ($locale) 라우트 파일들만 검사
    const localeRoutes = files.filter((f) => f.startsWith('($locale)') && f.endsWith('.tsx'));

    for (const file of localeRoutes) {
      const filePath = join(routesDir, file);
      const content = readFileSync(filePath, 'utf-8');

      // params.locale 사용 패턴 감지
      const paramsLocalePatterns = [
        /params\.locale\s*===?\s*['"]ko['"]/g, // params.locale === 'ko'
        /params\.locale\s*===?\s*['"]en['"]/g, // params.locale === 'en'
        /params\.locale\s*\|\|/g, // params.locale ||
        /const\s+locale\s*=\s*params\.locale/g, // const locale = params.locale
        /let\s+locale\s*=\s*params\.locale/g, // let locale = params.locale
        /params\.locale\s*\?\s*['"]ko['"]/g, // params.locale ? 'ko'
      ];

      for (const pattern of paramsLocalePatterns) {
        const matches = content.match(pattern);
        if (matches) {
          errors.push(
            `${basename(file)}: params.locale 사용 금지 - "${matches[0]}" 발견. getLocaleFromPath() 사용 필요`,
          );
        }
      }
    }
  } catch {
    // 디렉토리 읽기 실패
  }

  return { passed: errors.length === 0, errors };
}

/**
 * 동적 라우트 파일에서 loader 존재 여부 확인
 * SPA 방지: clientLoader만 있고 loader가 없으면 SEO 불가능
 */
function verifyDynamicRouteLoaders(routesDir: string): {
  passed: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (!existsSync(routesDir)) {
    return { passed: true, warnings: [] };
  }

  try {
    const files = readdirSync(routesDir);
    const dynamicRoutes = files.filter((f) => f.includes('$') && f.endsWith('.tsx'));

    for (const file of dynamicRoutes) {
      const filePath = join(routesDir, file);
      const content = readFileSync(filePath, 'utf-8');

      const hasLoader = /export\s+(async\s+)?function\s+loader\s*\(/m.test(content);
      const hasClientLoader = /export\s+(async\s+)?function\s+clientLoader\s*\(/m.test(content);

      // clientLoader만 있고 loader가 없으면 경고
      if (hasClientLoader && !hasLoader) {
        warnings.push(`${basename(file)}: clientLoader만 있고 loader 없음 (SEO 데이터 누락 가능)`);
      }
    }
  } catch {
    // 디렉토리 읽기 실패
  }

  return { passed: warnings.length === 0, warnings };
}

function verify(): boolean {
  console.log('\n🔍 SSR 빌드 검증 시작...\n');
  let allPassed = true;

  for (const app of apps) {
    console.log(`📦 ${app.name}`);

    // 1. 서버 번들 확인
    const serverResult = verifyServerBundle(app.serverDir);
    console.log(`   ${serverResult.passed ? '✅' : '❌'} 서버 번들: ${serverResult.details}`);
    if (!serverResult.passed) allPassed = false;

    // 2. 클라이언트 자산 확인
    const clientResult = verifyClientAssets(app.clientDir);
    console.log(`   ${clientResult.passed ? '✅' : '❌'} 클라이언트 자산: ${clientResult.details}`);
    if (!clientResult.passed) allPassed = false;

    // 3. 동적 라우트 loader 검사 (SPA 방지)
    const { warnings: loaderWarnings } = verifyDynamicRouteLoaders(app.routesDir);
    if (loaderWarnings.length > 0) {
      console.log('   ⚠️  동적 라우트 loader 검사:');
      for (const warning of loaderWarnings) {
        console.log(`      - ${warning}`);
      }
    } else {
      console.log('   ✅ 동적 라우트 loader 검사 통과');
    }

    // 4. params.locale 사용 금지 검사 (항상 undefined이므로)
    const { passed: paramsLocalePassed, errors: paramsLocaleErrors } = verifyNoParamsLocale(
      app.routesDir,
    );
    if (!paramsLocalePassed) {
      console.log('   ❌ params.locale 사용 금지 위반:');
      for (const error of paramsLocaleErrors) {
        console.log(`      - ${error}`);
      }
      allPassed = false;
    } else {
      console.log('   ✅ params.locale 사용 금지 검사 통과');
    }

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
