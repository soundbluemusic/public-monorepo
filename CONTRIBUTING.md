# Contributing (기여 가이드)

이 프로젝트에 기여해 주셔서 감사합니다. 아래 규칙을 준수해 주세요.

---

## Getting Started

```bash
# 1. Fork & Clone
git clone https://github.com/YOUR_USERNAME/public-monorepo.git
cd public-monorepo

# 2. Install dependencies
pnpm install

# 3. Run development server
pnpm dev:context     # → http://localhost:3003
```

---

## Critical Rules (필수 규칙)

### 1. SPA Mode Prohibited (SPA 모드 금지)

> **이 프로젝트는 SSR과 SSG 모드만 사용합니다. SPA 모드는 절대 금지.**

| App | Mode | Data Source |
|:----|:-----|:------------|
| Context | SSR + D1 | Cloudflare D1 |
| Permissive | SSR | In-memory |
| Roots | SSG | TypeScript |

| Prohibited | Why |
|:-----------|:----|
| SPA (Client-side only) | SEO 불가, 빈 HTML |
| Empty `<div id="root">` | 검색엔진 크롤링 실패 |

```typescript
// Context, Permissive (SSR)
export default { ssr: true, ... }

// Roots (SSG)
export default { ssr: false, async prerender() { ... } }
```

### 2. No Hardcoding (for wrong reasons)

| Prohibited | Allowed |
|:-----------|:--------|
| Magic numbers to pass tests | Named constants with JSDoc |
| Mock data to bypass errors | Type-safe enums |
| Fallback values hiding bugs | CSS design tokens |

### 3. No Overfitting / No Quick Fixes

> **모든 수정은 일반적인 해결책이어야 함. 특정 케이스만 해결하는 코드 금지.**

| Prohibited | Required |
|:-----------|:---------|
| Conditions targeting specific test cases only | General solutions for all similar cases |
| Branching on error message strings | Proper error type handling |
| Exception handling for specific IDs/values | Uniform validation logic |
| Hiding symptoms with try-catch | Fixing root causes |
| Workarounds at call sites instead of source | Fixing the actual problem location |

**Checklist before any fix:**
1. Does this fix work for all similar inputs?
2. Can I explain WHY this problem occurred?
3. Will this code still work if new tests are added?
4. Will another developer understand this in 6 months?

### 4. Data Principles

| Principle | Description |
|:----------|:------------|
| **Single Source of Truth** | All data defined in `data/` directory only |
| **No External DB** | localStorage / IndexedDB only |
| **Open Source Only** | All dependencies must be open source |
| **Web Standards Only** | No vendor-specific APIs |

### 5. UI Verification Required

> **모든 변경사항은 실제 UI에서 확인되어야 완료입니다.**

| Prohibited | Required |
|:-----------|:---------|
| 코드만 수정하고 "완료" 주장 | 로컬 서버에서 실제 페이지 확인 |
| 빌드 성공만으로 기능 작동 가정 | 영어/한국어 페이지 모두 확인 |
| UI 불일치 무시 | 인터랙션 테스트 (클릭, 입력 등) |

---

## Pull Request Process

1. **Branch naming**: `feat/description`, `fix/description`, `docs/description`
2. **Commit message**: [Conventional Commits](https://www.conventionalcommits.org/) 형식
3. **Tests**: `pnpm test` 통과 필수
4. **Build**: `pnpm build` 성공 필수
5. **Lint**: `pnpm lint` 통과 필수

---

## Code Style

- **Formatter**: Biome
- **Lint**: Biome
- **TypeScript**: Strict mode

```bash
pnpm lint      # Check
pnpm format    # Auto-fix
```

---

## Package Layer Rules

```
L3 (apps, ui, features) → L2 (i18n, search, seo, pwa) → L1 (data, platform) → L0 (core, config)
```

- **하위 레이어만 import 가능** (L3 → L2 OK, L2 → L3 금지)
- **순환 의존 금지** (같은 레이어 간 상호 import 금지)

자세한 내용: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Dependency Management (의존성 관리)

### No Downgrade Policy (다운그레이드 금지)

> **문제 해결을 위한 버전 다운그레이드는 임시방편이며 기술 부채를 누적시킵니다.**
> **항상 미래를 향해 전진해야 합니다.**

| Situation | ❌ Prohibited | ✅ Allowed |
|:----------|:-------------|:-----------|
| 호환성 에러 | 이전 버전으로 다운그레이드 | 최신 버전에 맞게 코드 수정 |
| 의존성 충돌 | 모든 패키지 버전 낮춤 | `pnpm.overrides`로 격리 |
| 빌드 실패 | "작동하던 버전"으로 복구 | 근본 원인 분석 후 수정 |
| peerDeps 경고 | 요구 버전보다 낮은 버전 설치 | 요구 버전 이상으로 업그레이드 |

### Why No Downgrade?

수학적 증명과 같이, **한번 검증된 것(빌드, 테스트 통과)은 변경되지 않아야 합니다.**

- 다운그레이드는 증상만 숨기고 근본 원인을 해결하지 않음
- 시간이 지나면 더 큰 업그레이드 장벽이 됨
- 보안 패치, 버그 수정, 성능 개선을 놓치게 됨

### Problem-Solving Priority

1. **근본 원인 분석** - 에러 메시지와 스택 트레이스 정확히 파악
2. **업그레이드 경로 탐색** - 최신 안정 버전으로 업그레이드
3. **코드 수정** - API 변경사항에 맞게 코드 업데이트
4. **격리 (마지막 수단)** - `pnpm.overrides`로 특정 패키지만 버전 고정

```jsonc
// ❌ 금지: 다운그레이드
{
  "dependencies": {
    "@astrojs/starlight": "^0.29.0"  // 0.30에서 에러 나서 낮춤
  }
}

// ✅ 허용: 업그레이드 + 설정 수정
{
  "dependencies": {
    "@astrojs/starlight": "^0.36.0",  // 최신 버전
    "astro": "^5.0.0"                  // 요구사항 충족
  }
}

// ✅ 허용: 격리 (충돌하는 의존성만 고정)
{
  "pnpm": {
    "overrides": {
      "zod": "^3.25.0"  // 특정 패키지 충돌 격리
    }
  }
}
```

### Exception (예외)

- 보안 취약점이 있는 최신 버전만 예외적으로 다운그레이드 허용
- 이 경우에도 보안 패치가 나오면 즉시 업그레이드 필수

---

## Questions?

- [GitHub Issues](https://github.com/soundbluemusic/public-monorepo/issues)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
