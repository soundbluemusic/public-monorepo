/**
 * SSG 빌드 검증 스크립트
 * - HTML 파일이 빈 껍데기가 아닌지 확인
 * - SEO 메타태그 존재 확인
 * - 최소 페이지 수 확인
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

interface AppConfig {
  name: string;
  outputDir: string;
  minPages: number;
  requiredMeta: string[];
}

const apps: AppConfig[] = [
  {
    name: 'context',
    outputDir: 'apps/context/.output/public',
    minPages: 50, // 최소 50개 HTML 페이지
    requiredMeta: ['title', 'description'],
  },
  {
    name: 'permissive',
    outputDir: 'apps/permissive/.output/public',
    minPages: 5,
    requiredMeta: ['title', 'description'],
  },
  {
    name: 'roots',
    outputDir: 'apps/roots/.output/public',
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
    const hasContent = content.includes('<div') && content.length > 1000;
    const hasMeta = {
      title: /<title[^>]*>.*?<\/title>/i.test(content),
      description: /<meta[^>]*name=["']description["'][^>]*>/i.test(content),
    };
    return { hasContent, hasMeta, contentLength: content.length };
  } catch {
    return { hasContent: false, hasMeta: {}, contentLength: 0 };
  }
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
      const routes = JSON.parse(routesContent);
      const routesPassed = routes.exclude?.includes('/*');
      console.log(`   ${routesPassed ? '✅' : '⚠️'} _routes.json: Functions 비활성화`);
    } catch {
      console.log('   ⚠️  _routes.json: 파일 없음 (Cloudflare Functions 오류 가능)');
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
