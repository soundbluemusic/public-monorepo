/**
 * 의존성 분석 스크립트
 * - 앱 간 중복 의존성 찾기
 * - 호이스팅 가능한 의존성 식별
 * - 일관성 문제 탐지
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface PackageJson {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface DependencyInfo {
  name: string;
  version: string;
  usedIn: string[];
  type: 'runtime' | 'dev' | 'peer';
}

const apps = ['context', 'permissive', 'roots'];
const packages = ['shared', 'shared-react'];

function loadPackageJson(type: 'apps' | 'packages', name: string): PackageJson {
  const path = join(process.cwd(), type, name, 'package.json');
  return JSON.parse(readFileSync(path, 'utf-8')) as PackageJson;
}

function analyzeDependencies(): void {
  console.log('\n📊 의존성 중복 분석\n');
  console.log('='.repeat(80));

  // 모든 패키지 로드
  const allPackages = new Map<string, PackageJson>();
  for (const app of apps) {
    allPackages.set(`apps/${app}`, loadPackageJson('apps', app));
  }
  for (const pkg of packages) {
    allPackages.set(`packages/${pkg}`, loadPackageJson('packages', pkg));
  }

  // 런타임 의존성 분석
  const runtimeDeps = new Map<string, DependencyInfo>();
  for (const [location, pkg] of allPackages) {
    if (pkg.dependencies) {
      for (const [dep, version] of Object.entries(pkg.dependencies)) {
        if (!dep.startsWith('@soundblue/')) {
          if (!runtimeDeps.has(dep)) {
            runtimeDeps.set(dep, {
              name: dep,
              version,
              usedIn: [],
              type: 'runtime',
            });
          }
          runtimeDeps.get(dep)?.usedIn.push(location);
        }
      }
    }
  }

  // devDependencies 분석
  const devDeps = new Map<string, DependencyInfo>();
  for (const [location, pkg] of allPackages) {
    if (pkg.devDependencies) {
      for (const [dep, version] of Object.entries(pkg.devDependencies)) {
        if (!dep.startsWith('@soundblue/')) {
          if (!devDeps.has(dep)) {
            devDeps.set(dep, { name: dep, version, usedIn: [], type: 'dev' });
          }
          devDeps.get(dep)?.usedIn.push(location);
        }
      }
    }
  }

  // 1. 런타임 의존성 중복
  console.log('\n📦 런타임 의존성 중복 (Runtime Dependencies)\n');
  const duplicateRuntime = Array.from(runtimeDeps.values())
    .filter((dep) => dep.usedIn.length > 1)
    .sort((a, b) => b.usedIn.length - a.usedIn.length);

  for (const dep of duplicateRuntime) {
    console.log(`  ${dep.name}@${dep.version}`);
    console.log(`    사용처 (${dep.usedIn.length}개): ${dep.usedIn.join(', ')}`);

    // 모든 앱에서 사용되면 호이스팅 가능
    const usedInAllApps = apps.every((app) => dep.usedIn.includes(`apps/${app}`));
    if (usedInAllApps) {
      console.log('    💡 권장: shared-react의 peerDependency로 이동 가능');
    }
    console.log('');
  }

  // 2. DevDependencies 중복
  console.log('\n🔧 DevDependencies 중복\n');
  const duplicateDev = Array.from(devDeps.values())
    .filter((dep) => dep.usedIn.length > 1)
    .sort((a, b) => b.usedIn.length - a.usedIn.length);

  for (const dep of duplicateDev) {
    console.log(`  ${dep.name}@${dep.version}`);
    console.log(`    사용처 (${dep.usedIn.length}개): ${dep.usedIn.join(', ')}`);

    // 모든 앱에서 사용되면 root로 호이스팅 가능
    const usedInAllApps = apps.every((app) => dep.usedIn.includes(`apps/${app}`));
    if (usedInAllApps) {
      console.log('    💡 권장: root package.json으로 호이스팅 가능');
    }
    console.log('');
  }

  // 3. 일관성 문제
  console.log('\n⚠️  일관성 문제 (Inconsistencies)\n');

  // workbox-window 체크
  const workboxUsers = Array.from(allPackages.entries())
    .filter(([_, pkg]) => pkg.devDependencies?.['workbox-window'] !== undefined)
    .map(([loc]) => loc);

  const pwaUsers = Array.from(allPackages.entries())
    .filter(([_, pkg]) => pkg.devDependencies?.['vite-plugin-pwa'] !== undefined)
    .map(([loc]) => loc);

  if (pwaUsers.length !== workboxUsers.length) {
    console.log('  vite-plugin-pwa vs workbox-window 불일치:');
    console.log(`    vite-plugin-pwa 사용: ${pwaUsers.join(', ')}`);
    console.log(`    workbox-window 사용: ${workboxUsers.join(', ')}`);
    console.log('    💡 권장: 모든 PWA 앱에 workbox-window 추가 또는 제거\n');
  }

  // @types/node 체크
  const nodeTypesUsers = Array.from(allPackages.entries())
    .filter(([loc]) => loc.startsWith('apps/'))
    .filter(([_, pkg]) => pkg.devDependencies?.['@types/node'] !== undefined)
    .map(([loc]) => loc);

  if (nodeTypesUsers.length > 0 && nodeTypesUsers.length < apps.length) {
    console.log('  @types/node 불일치:');
    console.log(`    사용: ${nodeTypesUsers.join(', ')}`);
    const notUsing = apps
      .filter((app) => !nodeTypesUsers.includes(`apps/${app}`))
      .map((app) => `apps/${app}`);
    console.log(`    미사용: ${notUsing.join(', ')}`);
    console.log('    💡 권장: 모든 앱에 추가 (Node.js API 사용 가능성)\n');
  }

  // 4. 통계
  console.log(`\n${'='.repeat(80)}`);
  console.log('\n📈 통계\n');
  console.log(`  중복된 런타임 의존성: ${duplicateRuntime.length}개`);
  console.log(`  중복된 DevDependencies: ${duplicateDev.length}개`);

  const hoistableRuntime = duplicateRuntime.filter((dep) =>
    apps.every((app) => dep.usedIn.includes(`apps/${app}`)),
  );
  const hoistableDev = duplicateDev.filter((dep) =>
    apps.every((app) => dep.usedIn.includes(`apps/${app}`)),
  );

  console.log(`  호이스팅 가능 런타임: ${hoistableRuntime.length}개 (shared-react로)`);
  console.log(`  호이스팅 가능 Dev: ${hoistableDev.length}개 (root로)`);

  // 5. 개선 권장사항
  console.log(`\n${'='.repeat(80)}`);
  console.log('\n🎯 100% 격리 달성 방안\n');

  console.log('**옵션 1: 완전 호이스팅 (권장하지 않음)**');
  console.log('  - 모든 공통 의존성을 root/shared-react로 이동');
  console.log('  - 장점: 중복 제거');
  console.log('  - 단점: 명시성 감소, 의존성 파악 어려움\n');

  console.log('**옵션 2: 선택적 호이스팅 (권장)**');
  console.log('  - DevDependencies만 root로 호이스팅');
  console.log('  - 런타임 의존성은 각 앱에 명시 (명확성 유지)');
  console.log('  - 일관성 문제만 해결 (workbox-window, @types/node)');
  console.log('  - 장점: 명시성 + 중복 최소화 균형\n');

  console.log('**옵션 3: 현재 유지 (가장 권장)**');
  console.log('  - 현재 구조 유지');
  console.log('  - 일관성 문제만 해결');
  console.log('  - 장점: 가장 명확하고 유지보수 쉬움');
  console.log('  - 현재도 95% 격리, 실질적으로 충분함\n');

  console.log(`${'='.repeat(80)}\n`);
}

analyzeDependencies();
