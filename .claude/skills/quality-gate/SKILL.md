---
name: quality-gate
description: 병렬 품질 검사 통합. SSG, Layer, Link, TypeCheck, Lint를 동시 실행하여 전체 품질 검증
---

# Quality Gate 스킬

모든 품질 검사를 병렬로 실행하는 통합 스킬입니다.

## 사용법

```text
/quality-gate
/quality-gate --quick
```

## 실행 방법

**이 스킬을 실행하면 다음 명령어를 Bash로 실행하세요:**

```bash
# 전체 검사 (프로덕션 링크 포함)
pnpm quality

# 빠른 검사 (링크 검사 제외)
pnpm quality:quick

# JSON 출력 (CI 연동)
pnpm quality --json
```

## 검사 항목

| 검사           | 명령어              | 설명                       |
| -------------- | ------------------- | -------------------------- |
| SSG Check      | `pnpm verify:ssg`   | SSG 규칙 위반 검출         |
| Layer Check    | `pnpm check:circular` | 순환 의존성 검출          |
| TypeCheck      | `pnpm typecheck`    | TypeScript 타입 오류       |
| Lint           | `pnpm lint`         | 코드 스타일 오류           |
| Link Check     | `lychee`            | 프로덕션 링크 무결성       |

## 병렬 실행 구조

```text
pnpm quality
    ├── SSG Check ────────┐
    ├── Layer Check ──────┼── 병렬 실행
    ├── TypeCheck ────────┤
    ├── Lint ─────────────┤
    └── Link Check ───────┘
              ↓
         결과 집계 → Pass/Fail
```

## 반환 형식

```text
🔍 Quality Gate 시작...

실행할 검사: SSG Check, Layer Check, TypeCheck, Lint, Link Check (Prod)

📊 검사 결과:
==================================================
✅ SSG Check (1.2s)
✅ Layer Check (3.4s)
✅ TypeCheck (5.6s)
✅ Lint (2.1s)
✅ Link Check (Prod) (12.3s)

⏱️  총 소요 시간: 12.3s

✅ Quality Gate 통과!
```

## 오류 발생 시

```text
📊 검사 결과:
==================================================
✅ SSG Check (1.2s)
❌ Layer Check (3.4s)
   └─ Circular dependency detected: search → seo → search
✅ TypeCheck (5.6s)
❌ Lint (2.1s)
   └─ error: Missing semicolon
   └─ error: Unused variable 'foo'

❌ Quality Gate 실패

실패한 검사:
  - Layer Check
  - Lint

위 오류를 수정한 후 다시 실행하세요.
```

## 옵션

| 옵션      | 설명                               |
| --------- | ---------------------------------- |
| `--quick` | 링크 검사 제외 (빠른 피드백용)     |
| `--json`  | JSON 형식 출력 (CI 연동용)         |

## 관련 스킬

- `/ssg-check` - SSG 규칙만 검사
- `/layer-check` - 레이어 규칙만 검사
- `/link-check` - 링크 무결성만 검사

## 관련 파일

- `scripts/quality-gate.ts` - 통합 검사 스크립트
- `scripts/verify-ssg.ts` - SSG 검증 스크립트
- `.lychee.toml` - lychee 설정
