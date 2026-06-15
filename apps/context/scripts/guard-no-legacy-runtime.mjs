/**
 * Astro v6 마이그레이션 가드.
 *
 * Astro v6에서 `Astro.locals.runtime.env`는 제거되었고 접근 시 throw됩니다
 * (@astrojs/cloudflare 13.5+ handler.js 참고). 새 패턴:
 *
 *     import { env } from 'cloudflare:workers';
 *     const db = env.DB;
 *
 * 이 스크립트는 src/에서 옛 패턴을 발견하면 빌드를 중단시킵니다.
 */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pattern = String.raw`(Astro\.)?locals\.runtime`;

let output = '';
try {
  output = execSync(`grep -rEn "${pattern}" src/ app/ 2>/dev/null || true`, {
    cwd: projectRoot,
    encoding: 'utf8',
  }).trim();
} catch (e) {
  console.error('[guard-no-legacy-runtime] grep failed:', e.message);
  process.exit(2);
}

if (output) {
  console.error('[guard-no-legacy-runtime] Astro v6에서 제거된 `Astro.locals.runtime` 패턴 발견:');
  console.error('');
  for (const line of output.split('\n')) console.error(`  ${line}`);
  console.error('');
  console.error("→ 대신 다음 패턴 사용:");
  console.error("    import { env } from 'cloudflare:workers';");
  console.error("    const db = env.DB;");
  process.exit(1);
}

console.log('[guard-no-legacy-runtime] OK');
