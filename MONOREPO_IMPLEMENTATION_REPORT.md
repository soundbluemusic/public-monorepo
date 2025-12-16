# 모노레포 구현 보고서

## 1. 프로젝트 분석 요약

### 1.1 Context (korean-vocab-database)
| 항목 | 내용 |
|------|------|
| 목적 | 한국어 어휘 데이터베이스 |
| 프레임워크 | SolidStart 1.0.10 |
| Tailwind | v3.4.16 (PostCSS 방식) |
| 렌더링 | SSR: false (Static) |
| 특수 기능 | PWA (vite-plugin-pwa) |
| Node 요구사항 | >=18 |

**주요 의존성:**
- @solidjs/start ^1.0.10
- solid-js ^1.9.3
- vite-plugin-pwa ^0.21.1
- workbox-window ^7.3.0

**디렉토리 구조:**
```
src/
├── app.tsx
├── app.css
├── components/
│   ├── Layout.tsx
│   ├── SearchModal.tsx
│   └── Sidebar.tsx
├── data/
│   ├── categories.ts
│   ├── entries.ts
│   └── types.ts
└── routes/
    ├── index.tsx
    ├── browse.tsx
    ├── about.tsx
    ├── contribute.tsx
    ├── entry/[entryId].tsx
    └── category/[categoryId]/
```

---

### 1.2 Permissive
| 항목 | 내용 |
|------|------|
| 목적 | 무료 웹 개발 리소스 가이드 |
| 프레임워크 | SolidStart 1.1.0 |
| Tailwind | v4.0.0 (@tailwindcss/vite) |
| 렌더링 | Static Prerender |
| 특수 기능 | i18n, 차트, 검색 |
| Node 요구사항 | >=20 |

**주요 의존성:**
- @solidjs/start ^1.1.0
- solid-js ^1.9.4
- chart.js ^4.4.7
- fuse.js ^7.0.0
- lucide-solid ^0.469.0

**디렉토리 구조:**
```
src/
├── app.tsx
├── components/
│   ├── ui/
│   └── layout/
├── data/
├── i18n/
├── styles/
│   └── global.css
├── types/
└── routes/
    ├── index.tsx
    ├── libraries.tsx
    └── web-api/
```

---

## 2. 주요 차이점 분석

### 2.1 Tailwind CSS 버전 충돌
| 프로젝트 | 버전 | 설정 방식 |
|---------|------|----------|
| Context | v3.4.16 | PostCSS + tailwind.config.js |
| Permissive | v4.0.0 | @tailwindcss/vite 플러그인 |

**영향:** Tailwind v4는 설정 방식이 완전히 변경됨. CSS-first 접근 방식 사용.

### 2.2 SolidStart 버전
- Context: ^1.0.10
- Permissive: ^1.1.0

**권장:** 둘 다 ^1.1.0으로 통일

### 2.3 Node 버전 요구사항
- Context: >=18
- Permissive: >=20

**권장:** 모노레포 전체 >=20 적용

---

## 3. 모노레포 구현 방안

### 3.1 권장 구조
```
public-monorepo/
├── package.json              # 루트 워크스페이스 설정
├── pnpm-workspace.yaml       # pnpm 워크스페이스 정의
├── turbo.json                # Turborepo 설정 (선택)
├── tsconfig.base.json        # 공유 TypeScript 설정
├── .gitignore
├── .prettierrc
├── eslint.config.js
│
├── apps/
│   ├── context/              # Context 앱
│   │   ├── package.json
│   │   ├── app.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   │
│   └── permissive/           # Permissive 앱
│       ├── package.json
│       ├── app.config.ts
│       ├── tsconfig.json
│       └── src/
│
└── packages/
    ├── ui/                   # 공유 UI 컴포넌트 (향후)
    │   ├── package.json
    │   └── src/
    │
    ├── config/               # 공유 설정
    │   ├── tailwind/
    │   ├── typescript/
    │   └── eslint/
    │
    └── utils/                # 공유 유틸리티 (향후)
        ├── package.json
        └── src/
```

### 3.2 루트 파일 설정

#### pnpm-workspace.yaml
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

#### package.json (루트)
```json
{
  "name": "soundblue-monorepo",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "dev:context": "pnpm --filter @soundblue/context dev",
    "dev:permissive": "pnpm --filter @soundblue/permissive dev",
    "build:context": "pnpm --filter @soundblue/context build",
    "build:permissive": "pnpm --filter @soundblue/permissive build",
    "lint": "turbo lint",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "turbo": "^2.3.0",
    "prettier": "^3.4.2"
  },
  "engines": {
    "node": ">=20"
  },
  "packageManager": "pnpm@9.14.2"
}
```

#### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".output/**", ".vinxi/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

---

## 4. 구현 단계

### Phase 1: 기본 구조 설정
1. 루트 워크스페이스 파일 생성
2. apps/ 디렉토리 생성
3. packages/ 디렉토리 생성

### Phase 2: 프로젝트 마이그레이션
1. Context 프로젝트를 apps/context/로 이동
2. Permissive 프로젝트를 apps/permissive/로 이동
3. 각 프로젝트의 package.json 수정 (이름 변경: @soundblue/context, @soundblue/permissive)

### Phase 3: 의존성 통합
1. 공통 devDependencies를 루트로 호이스팅
2. 각 앱별 고유 의존성 유지
3. pnpm install로 의존성 설치

### Phase 4: 설정 통합 (선택적)
1. 공유 tsconfig.base.json 생성
2. 공유 ESLint/Prettier 설정
3. 공유 Tailwind 설정 (버전 통일 시)

---

## 5. Tailwind 버전 통일 권장사항

### 옵션 A: Tailwind v4로 통일 (권장)
**장점:**
- 최신 버전, 향후 지원
- CSS-first 접근 방식으로 더 간결
- 빌드 성능 향상

**단점:**
- Context의 tailwind.config.js 마이그레이션 필요
- 커스텀 색상/폰트 설정 CSS로 이전 필요

**마이그레이션 작업:**
```css
/* Context의 app.css에 추가 */
@import "tailwindcss";

@theme {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  /* ... 기존 색상 설정 */

  --font-sans: "Pretendard", system-ui, sans-serif;
}
```

### 옵션 B: 각 프로젝트 독립 Tailwind 유지
**장점:**
- 마이그레이션 불필요
- 기존 설정 그대로 사용

**단점:**
- 스타일 일관성 유지 어려움
- 향후 공유 컴포넌트 패키지 생성 시 복잡

---

## 6. 예상 이슈 및 해결 방안

### 6.1 포트 충돌
각 앱이 동시에 개발 서버 실행 시 포트 충돌 발생 가능

**해결:**
```typescript
// apps/context/app.config.ts
export default defineConfig({
  server: { port: 3000 }
});

// apps/permissive/app.config.ts
export default defineConfig({
  server: { port: 3001 }
});
```

### 6.2 경로 별칭 (Path Aliases)
`~/` 경로 별칭이 각 앱에서 독립적으로 작동해야 함

**해결:**
각 앱의 tsconfig.json에서 baseUrl을 해당 앱 기준으로 설정
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "~/*": ["./src/*"] }
  }
}
```

### 6.3 빌드 출력 경로
각 앱의 빌드 결과물이 독립적으로 생성되어야 함

**해결:**
SolidStart의 기본 설정으로 각 앱 디렉토리 내 .output/ 생성됨

---

## 7. 최종 권장 사항

| 항목 | 권장 사항 |
|------|----------|
| 패키지 매니저 | pnpm (워크스페이스 지원) |
| 빌드 도구 | Turborepo (캐싱, 병렬 빌드) |
| Node 버전 | >=20 |
| Tailwind | v4로 통일 (장기적) |
| TypeScript | 공유 base 설정 사용 |
| 린팅 | 루트 레벨 ESLint + Prettier |

---

## 8. 구현 체크리스트

- [ ] 루트 package.json 생성
- [ ] pnpm-workspace.yaml 생성
- [ ] turbo.json 생성
- [ ] tsconfig.base.json 생성
- [ ] apps/context/ 디렉토리 생성 및 마이그레이션
- [ ] apps/permissive/ 디렉토리 생성 및 마이그레이션
- [ ] packages/config/ 디렉토리 생성
- [ ] 의존성 설치 및 테스트
- [ ] 개발 서버 동시 실행 테스트
- [ ] 빌드 테스트
- [ ] (선택) Tailwind v4 통일

---

*보고서 작성일: 2025-12-16*
