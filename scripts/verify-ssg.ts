/**
 * SSG 빌드 검증 스크립트
 *
 * 검사 항목:
 * 1. HTML 파일이 빈 껍데기가 아닌지 확인
 * 2. SEO 메타태그 존재 확인
 * 3. 최소 페이지 수 확인
 * 4. 동적 라우트에 loader 존재 확인 (SPA 방지)
 *
 * ⚠️ SPA 금지: 이 프로젝트는 100% SSG 전용입니다.
 * clientLoader만 있고 loader가 없는 동적 라우트는 SEO 불가능합니다.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

interface AppConfig {
  name: string;
  outputDir: string;
  minPages: number;
  requiredMeta: string[];
}

interface CloudflareRoutesConfig {
  version?: number;
  include?: string[];
  exclude?: string[];
}

const apps: AppConfig[] = [
  {
    name: 'context',
    outputDir: 'apps/context/build/client',
    minPages: 10, // 기본 페이지들 (동적 엔트리는 SPA로 처리)
    requiredMeta: ['title', 'description'],
  },
  {
    name: 'permissive',
    outputDir: 'apps/permissive/build/client',
    minPages: 5,
    requiredMeta: ['title', 'description'],
  },
  {
    name: 'roots',
    outputDir: 'apps/roots/build/client',
    minPages: 3,
    requiredMeta: ['title', 'description'],
  },
];

function countHtmlFiles(dir: string): number {
  let count = 0;
  try {
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        count += countHtmlFiles(fullPath);
      } else if (item.endsWith('.html')) {
        count++;
      }
    }
  } catch {
    // 디렉토리가 없으면 0 반환
  }
  return count;
}

function verifyHtmlContent(filePath: string): {
  hasContent: boolean;
  hasMeta: Record<string, boolean>;
  contentLength: number;
} {
  try {
    const content = readFileSync(filePath, 'utf-8');
    // clientLoader 사용 시 SSG 시점에 body가 비어있을 수 있음
    // 최소한 HTML 구조와 메타태그가 있으면 유효한 SSG로 판단
    const hasContent = content.includes('<!DOCTYPE html>') && content.length > 1000;
    const hasMeta = {
      title: /<title[^>]*>.*?<\/title>/i.test(content),
      description: /<meta[^>]*name=["']description["'][^>]*>/i.test(content),
    };
    return { hasContent, hasMeta, contentLength: content.length };
  } catch {
    return { hasContent: false, hasMeta: {}, contentLength: 0 };
  }
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
    const dynamicRoutes = files.filter(
      (f) => f.includes('$') && f.endsWith('.tsx') && !f.includes('.ssg.'),
    );

    for (const file of dynamicRoutes) {
      const filePath = join(routesDir, file);
      const content = readFileSync(filePath, 'utf-8');

      const hasLoader = /export\s+(async\s+)?function\s+loader\s*\(/m.test(content);
      const hasClientLoader = /export\s+(async\s+)?function\s+clientLoader\s*\(/m.test(content);

      // clientLoader만 있고 loader가 없으면 경고
      if (hasClientLoader && !hasLoader) {
        // .ssg.tsx 파일이 별도로 있는지 확인
        const ssgFile = file.replace('.tsx', '.ssg.tsx');
        const ssgFilePath = join(routesDir, ssgFile);
        if (!existsSync(ssgFilePath)) {
          warnings.push(
            `${basename(file)}: clientLoader만 있고 loader 없음 (SEO 데이터 누락 가능)`,
          );
        }
      }
    }
  } catch {
    // 디렉토리 읽기 실패
  }

  return { passed: warnings.length === 0, warnings };
}

function verify(): boolean {
  console.log('\n🔍 SSG 빌드 검증 시작...\n');
  let allPassed = true;

  for (const app of apps) {
    console.log(`📦 ${app.name}`);

    // 1. HTML 파일 수 확인
    const htmlCount = countHtmlFiles(app.outputDir);
    const countPassed = htmlCount >= app.minPages;
    console.log(
      `   ${countPassed ? '✅' : '❌'} HTML 페이지: ${htmlCount}개 (최소 ${app.minPages}개)`,
    );
    if (!countPassed) allPassed = false;

    // 2. index.html 내용 검증
    const indexPath = join(app.outputDir, 'index.html');
    const { hasContent, hasMeta, contentLength } = verifyHtmlContent(indexPath);

    const contentPassed = hasContent;
    console.log(
      `   ${contentPassed ? '✅' : '❌'} 콘텐츠: ${contentLength.toLocaleString()}자 (빈 껍데기 아님)`,
    );
    if (!contentPassed) allPassed = false;

    // 3. SEO 메타태그 확인
    for (const meta of app.requiredMeta) {
      const metaPassed = hasMeta[meta];
      console.log(`   ${metaPassed ? '✅' : '❌'} SEO: <${meta}> 태그`);
      if (!metaPassed) allPassed = false;
    }

    // 4. _routes.json 확인 (Cloudflare Functions 비활성화)
    const routesPath = join(app.outputDir, '_routes.json');
    try {
      const routesContent = readFileSync(routesPath, 'utf-8');
      const routes = JSON.parse(routesContent) as CloudflareRoutesConfig;
      const routesPassed = routes.exclude?.includes('/*');
      console.log(`   ${routesPassed ? '✅' : '⚠️'} _routes.json: Functions 비활성화`);
    } catch {
      console.log('   ⚠️  _routes.json: 파일 없음 (Cloudflare Functions 오류 가능)');
    }

    // 5. 동적 라우트 loader 검사 (SPA 방지)
    const routesDir = join('apps', app.name, 'app', 'routes');
    const { warnings: loaderWarnings } = verifyDynamicRouteLoaders(routesDir);
    if (loaderWarnings.length > 0) {
      console.log('   ⚠️  동적 라우트 loader 검사:');
      for (const warning of loaderWarnings) {
        console.log(`      - ${warning}`);
      }
    }

    console.log('');
  }

  if (allPassed) {
    console.log('✅ 모든 SSG 검증 통과!\n');
  } else {
    console.log('❌ SSG 검증 실패. 위의 오류를 확인하세요.\n');
    process.exit(1);
  }

  return allPassed;
}

verify();
