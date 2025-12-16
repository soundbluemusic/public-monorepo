# Context & Permissive 모노레포 통합 보고서

## 1. 현재 상황

### 1.1 기존 soundblue-monorepo 구조
```
soundblue-monorepo/
├── apps/
│   ├── sound-blue/     # 메인 웹사이트
│   ├── tools/          # 음악 도구 앱
│   └── dialogue/       # 대화형 학습 도구
├── packages/           # (비어있음)
├── package.json
├── pnpm-workspace.yaml
└── biome.json
```

### 1.2 기존 모노레포 기술 스택
| 항목 | 사용 기술 |
|------|----------|
| 패키지 매니저 | pnpm 10.x |
| 프레임워크 | SolidJS + SolidStart |
| 빌드 도구 | Vinxi |
| 스타일링 | **Tailwind CSS v4** |
| 린터/포매터 | **Biome** |
| 테스트 | Vitest + Playwright |
| 배포 | Cloudflare Pages (Static) |
| Path Alias | `@/*` → `./src/*` |

### 1.3 추가할 프로젝트

#### Context (korean-vocab-database)
| 항목 | 현재 | 변경 필요 |
|------|------|----------|
| SolidStart | ^1.0.10 | → ^1.1.0+ |
| Tailwind | **v3 (PostCSS)** | → **v4 (Vite)** |
| 린터 | 없음 | → Biome |
| 테스트 | 없음 | → Vitest |
| Path Alias | `~/*` | → `@/*` |
| PWA | vite-plugin-pwa | 유지 |

#### Permissive
| 항목 | 현재 | 변경 필요 |
|------|------|----------|
| SolidStart | ^1.1.0 | 유지 |
| Tailwind | v4 | 유지 |
| 린터 | ESLint + Prettier | → Biome |
| 테스트 | 없음 | → Vitest |
| Path Alias | `~/*` | → `@/*` |
| i18n | 자체 구현 | 유지 |

---

## 2. 통합 후 구조

```
soundblue-monorepo/
├── apps/
│   ├── sound-blue/        # 기존
│   ├── tools/             # 기존
│   ├── dialogue/          # 기존
│   ├── context/           # 새로 추가 (한국어 어휘 DB)
│   └── permissive/        # 새로 추가 (웹개발 리소스)
├── packages/
│   └── (향후 공유 패키지)
├── package.json
├── pnpm-workspace.yaml
├── biome.json             # 루트 Biome 설정
└── tsconfig.base.json     # 공유 TS 설정
```

---

## 3. 마이그레이션 작업

### 3.1 Context - Tailwind v3 → v4 마이그레이션

**제거할 파일:**
- `tailwind.config.js`
- `postcss.config.js`

**package.json 변경:**
```diff
  "devDependencies": {
-   "autoprefixer": "^10.4.20",
-   "postcss": "^8.4.49",
-   "tailwindcss": "^3.4.16",
+   "@tailwindcss/vite": "^4.0.0",
+   "tailwindcss": "^4.0.0",
  }
```

**app.config.ts 변경:**
```typescript
import { defineConfig } from '@solidjs/start/config';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      VitePWA({ /* 기존 PWA 설정 유지 */ }),
    ],
  },
});
```

**app.css → global.css 변경:**
```css
@import "tailwindcss";

@theme {
  /* Context 커스텀 색상 */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  --color-accent-500: #d946ef;
  --color-accent-600: #c026d3;

  /* 폰트 */
  --font-sans: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
}

/* 기존 커스텀 애니메이션 */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 3.2 Path Alias 변경 (`~/*` → `@/*`)

**tsconfig.json (각 앱):**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/data/*": ["./src/data/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  },
  "include": ["src/**/*", "app.config.ts"]
}
```

**코드 변경 (전체 검색/치환):**
```bash
# Context
find apps/context/src -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|from "~/|from "@/|g' {} \;

# Permissive
find apps/permissive/src -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|from "~/|from "@/|g' {} \;
```

### 3.3 Biome 설정 적용

**제거할 파일 (Permissive):**
- `.prettierrc`
- `eslint.config.js`

**package.json에서 제거:**
```diff
  "devDependencies": {
-   "eslint": "^9.17.0",
-   "eslint-plugin-solid": "^0.14.5",
-   "prettier": "^3.4.2",
  }
```

**각 앱 scripts 통일:**
```json
{
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start",
    "lint": "biome lint .",
    "lint:fix": "biome lint --write .",
    "format": "biome format --write .",
    "check": "biome check .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

### 3.4 테스트 설정 추가

**vitest.config.ts (각 앱에 추가):**
```typescript
import { defineConfig } from 'vitest/config';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    globals: true,
  },
});
```

**src/test/setup.ts:**
```typescript
import '@testing-library/jest-dom/vitest';

// Browser API 모킹
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
```

---

## 4. 루트 설정 파일

### 4.1 package.json (루트)
```json
{
  "name": "soundblue-monorepo",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:main": "pnpm --filter sound-blue dev",
    "dev:tools": "pnpm --filter tools dev",
    "dev:dialogue": "pnpm --filter dialogue dev",
    "dev:context": "pnpm --filter context dev",
    "dev:permissive": "pnpm --filter permissive dev",

    "build:context": "pnpm --filter context build",
    "build:permissive": "pnpm --filter permissive build",

    "lint": "biome lint .",
    "format": "biome format --write .",
    "check": "biome check ."
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.0"
  },
  "engines": {
    "node": ">=20"
  },
  "packageManager": "pnpm@10.25.0"
}
```

### 4.2 pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 4.3 tsconfig.base.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 4.4 biome.json (루트)
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedImports": "error",
        "noUnusedVariables": "warn"
      },
      "style": {
        "useImportType": "error"
      },
      "suspicious": {
        "noExplicitAny": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all",
      "semicolons": "always"
    }
  }
}
```

---

## 5. Cloudflare Pages 설정

### 5.1 프로젝트별 설정

| 프로젝트 | Build command | Build output | Watch paths |
|---------|---------------|--------------|-------------|
| context | `cd apps/context && pnpm i && pnpm build` | `apps/context/.output/public` | `/apps/context/**` |
| permissive | `cd apps/permissive && pnpm i && pnpm build` | `apps/permissive/.output/public` | `/apps/permissive/**` |

### 5.2 Build watch paths 설정 (중요!)

Cloudflare Dashboard → 각 프로젝트 → Settings → Build configuration

```
Context 프로젝트:
  Build watch paths: /apps/context/**

Permissive 프로젝트:
  Build watch paths: /apps/permissive/**
```

이렇게 하면 해당 폴더 변경 시에만 빌드 트리거됨.

---

## 6. 개발 서버 포트 설정

각 앱이 다른 포트를 사용하도록 설정:

| 앱 | 포트 |
|----|------|
| sound-blue | 3000 |
| tools | 3001 |
| dialogue | 3002 |
| context | 3003 |
| permissive | 3004 |

**app.config.ts에 추가:**
```typescript
export default defineConfig({
  vite: {
    server: {
      port: 3003, // context
    },
  },
});
```

---

## 7. 구현 단계 (체크리스트)

### Phase 1: 레포 클론 및 이동
- [ ] Context 레포 클론
- [ ] Permissive 레포 클론
- [ ] `.git` 폴더 제거 (git history 분리)
- [ ] `apps/context/`로 이동
- [ ] `apps/permissive/`로 이동

### Phase 2: Context 마이그레이션
- [ ] Tailwind v3 → v4 마이그레이션
- [ ] `tailwind.config.js` 제거
- [ ] `postcss.config.js` 제거
- [ ] `app.css` → Tailwind v4 CSS 변환
- [ ] Path alias `~/` → `@/` 변경
- [ ] package.json 의존성 업데이트
- [ ] SolidStart 버전 업데이트
- [ ] Biome 적용 (린트 에러 수정)
- [ ] 테스트 설정 추가

### Phase 3: Permissive 마이그레이션
- [ ] ESLint/Prettier 제거
- [ ] Path alias `~/` → `@/` 변경
- [ ] Biome 적용 (린트 에러 수정)
- [ ] 테스트 설정 추가

### Phase 4: 루트 설정
- [ ] 루트 package.json 스크립트 추가
- [ ] tsconfig.base.json 생성 (없다면)
- [ ] 루트 biome.json 확인

### Phase 5: 검증
- [ ] `pnpm install` 전체 실행
- [ ] 각 앱 `pnpm dev` 정상 동작 확인
- [ ] 각 앱 `pnpm build` 정상 동작 확인
- [ ] `pnpm lint` 전체 실행
- [ ] `pnpm typecheck` 전체 실행

### Phase 6: Cloudflare 설정
- [ ] Context Pages 프로젝트 생성
- [ ] Permissive Pages 프로젝트 생성
- [ ] Build watch paths 설정
- [ ] 배포 테스트

---

## 8. 예상 소요 작업

| 작업 | 난이도 | 비고 |
|------|--------|------|
| Context Tailwind 마이그레이션 | 중 | 커스텀 색상 변환 필요 |
| Path alias 변경 | 하 | 검색/치환으로 가능 |
| Biome 적용 | 하 | 자동 수정 가능 |
| 테스트 설정 | 하 | 템플릿 복사 |
| Cloudflare 설정 | 하 | Dashboard에서 설정 |

---

## 9. 주의사항

1. **Git History**: 기존 레포의 git history는 보존하지 않음 (필요시 git subtree 사용)
2. **PWA 설정**: Context의 PWA 설정은 그대로 유지
3. **i18n**: Permissive의 i18n 구조 그대로 유지
4. **데이터 스크립트**: Permissive의 `scripts/` 폴더는 그대로 유지

---

*보고서 작성일: 2025-12-16*
*기존 soundblue-monorepo 설정 기준으로 작성*
