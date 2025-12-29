/**
 * Permissive 데이터 변환 스크립트
 *
 * TypeScript 데이터 파일을 JSON으로 변환
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const DATA_DIR = join(ROOT, 'apps/permissive/app/data');
const OUTPUT_DIR = join(ROOT, 'data/permissive');

async function main() {
  console.log('🔄 Permissive 데이터 변환 시작...\n');

  // Libraries
  const librariesModule = await import(join(DATA_DIR, 'libraries.ts'));
  const libraries = librariesModule.libraries;
  writeFileSync(join(OUTPUT_DIR, 'libraries.json'), JSON.stringify(libraries, null, 2));
  console.log(`  ✓ libraries.ts → libraries.json (${libraries.length} libraries)`);

  // Web APIs
  const webApisModule = await import(join(DATA_DIR, 'web-apis.ts'));
  const webApis = webApisModule.webApis;
  writeFileSync(join(OUTPUT_DIR, 'web-apis.json'), JSON.stringify(webApis, null, 2));
  console.log(`  ✓ web-apis.ts → web-apis.json (${webApis.length} APIs)`);

  console.log('\n✅ 변환 완료');
}

main().catch(console.error);
