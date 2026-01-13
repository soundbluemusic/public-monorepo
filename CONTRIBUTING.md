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

### 1. SSG Mode Only

> **이 프로젝트는 100% SSG 전용입니다. 다른 렌더링 모드로 전환 절대 금지.**

| Prohibited | Why |
|:-----------|:----|
| SPA (Client-side only) | SEO 불가, 빈 HTML |
| SSR (Server-side rendering) | 서버 비용, 복잡성 |
| ISR (Incremental Static) | 서버 필요 |
| Edge/Serverless Functions | 벤더 종속 |
| Empty `<div id="root">` | 검색엔진 크롤링 실패 |

```typescript
// react-router.config.ts - Never change ssr to true
export default {
  ssr: false,
  async prerender() {
    return ['/', '/ko', ...allRoutes];
  },
}
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

## Questions?

- [GitHub Issues](https://github.com/soundbluemusic/public-monorepo/issues)
- [Documentation](https://soundbluemusic.github.io/public-monorepo)
