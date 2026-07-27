import type { LibraryEnrichment } from '../library-enrichment-types';

export const runtimeWasmEnrichment: Record<string, LibraryEnrichment> = {
  Bun: {
    useCases: {
      en: 'All-in-one JavaScript runtime + package manager + bundler. Drop-in for Node.js with much faster startup',
      ko: 'JavaScript 런타임 + 패키지 매니저 + 번들러 통합. 훨씬 빠른 시작 속도로 Node.js drop-in',
    },
    codeExample: `// server.ts — run with: bun server.ts
Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response('Hello from Bun');
  },
});`,
  },
  Deno: {
    useCases: {
      en: 'Secure-by-default JS/TS runtime with URL imports, built-in formatter/linter/test runner, native Web APIs',
      ko: '기본 보안 JS/TS 런타임. URL import, 내장 포매터/린터/테스트, 네이티브 Web API',
    },
    codeExample: `// server.ts — run with: deno run --allow-net server.ts
Deno.serve((req) => new Response('Hello from Deno'));`,
  },
  'Node.js': {
    useCases: {
      en: 'The original JS server runtime. Vast ecosystem (npm), wide hosting support, baseline target for libraries',
      ko: '원조 JS 서버 런타임. 거대한 생태계(npm), 폭넓은 호스팅 지원, 라이브러리의 기본 타겟',
    },
    codeExample: `// server.mjs
import { createServer } from 'node:http';

createServer((req, res) => {
  res.end('Hello from Node');
}).listen(3000);`,
  },
};
