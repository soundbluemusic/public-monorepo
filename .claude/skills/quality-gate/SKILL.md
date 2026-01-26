---
name: quality-gate
description: 병렬 품질 검사 통합. HTML, Layer, Link, TypeCheck, Lint를 동시 실행하여 전체 품질 검증
---

# Quality Gate 스킬

모든 품질 검사를 병렬로 실행하는 통합 스킬입니다.

## 자동 실행 지시

**이 스킬이 호출되면 즉시 다음을 수행하세요:**

1. Bash tool로 `pnpm quality:quick` 실행
2. 결과 분석 후 요약 출력
3. 오류 발견 시 근본 원인 분석 및 수정 제안

```bash
pnpm quality:quick
```

프로덕션 링크 검사까지 포함하려면:

```bash
pnpm quality
```

## 검사 항목

| 검사        | 명령어                | 설명                 |
| ----------- | --------------------- | -------------------- |
| SSR Check   | `pnpm verify:ssr`     | SSR 빌드 검증        |
| Layer Check | `pnpm check:circular` | 순환 의존성 검출     |
| TypeCheck   | `pnpm typecheck`      | TypeScript 타입 오류 |
| Lint        | `pnpm lint`           | 코드 스타일 오류     |
| Link Check  | `lychee`              | 프로덕션 링크 무결성 |

## 오류 발견 시 자동 처리

1. **오류 파싱**: 출력에서 실패한 검사 식별
2. **근본 원인 분석**: 해당 파일/라인 확인
3. **수정 제안**: 구체적인 수정 방법 제시
4. **자동 수정**: 사용자 승인 후 Edit tool로 수정

## 관련 파일

- `scripts/quality-gate.ts` - 통합 검사 스크립트
