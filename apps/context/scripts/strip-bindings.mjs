/**
 * Astro가 빌드 시 자동으로 추가하는 SESSION KV 바인딩을 dist/server/wrangler.json에서 제거합니다.
 * wrangler.toml에 SESSION 바인딩이 없으므로 deploy 시 충돌이 발생합니다.
 */
import fs from 'node:fs';
import path from 'node:path';

const wranglerJsonPath = path.join(process.cwd(), 'dist/server/wrangler.json');

if (!fs.existsSync(wranglerJsonPath)) {
  console.log('No dist/server/wrangler.json found, skipping strip-bindings.');
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(wranglerJsonPath, 'utf8'));

if (config.kv_namespaces) {
  const before = config.kv_namespaces.length;
  config.kv_namespaces = config.kv_namespaces.filter((kv) => kv.binding !== 'SESSION');
  const after = config.kv_namespaces.length;
  if (before !== after) {
    console.log(`Removed ${before - after} SESSION KV binding(s) from wrangler.json`);
  }
  if (config.kv_namespaces.length === 0) {
    delete config.kv_namespaces;
  }
}

fs.writeFileSync(wranglerJsonPath, JSON.stringify(config, null, 2) + '\n');
console.log('strip-bindings: done');
