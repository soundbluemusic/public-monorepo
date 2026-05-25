import { readFileSync, writeFileSync } from 'node:fs';

const path = 'dist/server/wrangler.json';
const config = JSON.parse(readFileSync(path, 'utf8'));

// SESSION KV binding is auto-injected by @astrojs/cloudflare adapter but not used.
// Wrangler deploy requires an `id` field for KV namespaces — strip it to avoid failure.
if (config.kv_namespaces) {
  config.kv_namespaces = config.kv_namespaces.filter((kv) => kv.binding !== 'SESSION');
}

writeFileSync(path, JSON.stringify(config));
console.log('✓ Stripped unused SESSION binding from dist/server/wrangler.json');
