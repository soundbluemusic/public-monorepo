---
name: ssg-check
description: SSG 규칙 위반 검사. ssr:false 유지, prerender() 존재, orphan DOM 정리 로직 확인
---

# SSG Check 스킬

SSG(Static Site Generation) 규칙 위반을 검사하는 스킬입니다.

> ⚠️ **중요**: 이 프로젝트는 100% SSG 전용입니다.
> SPA 모드는 SEO 불가능으로 인해 **절대 허용되지 않습니다**.

## 자동 실행 지시

**이 스킬이 호출되면 즉시 다음을 수행하세요:**

1. Bash tool로 `pnpm verify:ssg` 실행
2. 동적 라우트 loader 검사 (아래 참조)
3. 결과 분석 후 요약 출력
4. 오류 발견 시 해당 파일 확인 및 수정 제안

```bash
pnpm verify:ssg
```

## 검사 항목

| 항목 | 기준 | SEO 영향 |
| --- | --- | --- |
| `ssr: false` | react-router.config.ts에서 유지 | SSG 모드 필수 |
| `prerender()` | 함수 존재 및 라우트 반환 | 페이지 생성 필수 |
| HTML 출력 | 빈 `<div id="root">` 없음 | 콘텐츠 포함 필수 |
| orphan DOM 정리 | entry.client.tsx 로직 유지 | hydration 버그 방지 |
| **동적 라우트 loader** | `$param` 라우트에 loader 필수 | **SEO 데이터 필수** |

## 동적 라우트 loader 검사 (신규)

**prerender 목록에 있는 동적 라우트는 반드시 `loader`가 있어야 합니다.**

```bash
# 동적 라우트 파일에서 loader 존재 확인
grep -r "export async function loader" apps/*/app/routes/\*\.\$*.tsx
```

### SPA 패턴 (금지됨)

```typescript
// ❌ clientLoader만 있음 → 빌드된 HTML에 데이터 없음 → SEO 불가
export async function clientLoader({ params }) {
  return { data: await fetchData(params.id) };
}
```

### SSG 패턴 (필수)

```typescript
// ✅ loader + clientLoader 둘 다 있음 → HTML에 데이터 포함 → SEO 가능
export async function loader({ params }) {
  return { data: await fetchData(params.id) };
}

export async function clientLoader({ params, serverLoader }) {
  try { return await serverLoader(); }
  catch { return { data: await fetchData(params.id) }; }
}
```

## 오류 발견 시 자동 수정 (필수)

**loader 누락 오류 발견 시, 즉시 자동으로 수정하세요:**

1. 위반 파일 Read로 확인
2. 기존 clientLoader 코드 분석
3. **loader 함수 자동 추가** (clientLoader 로직 복사)
4. clientLoader를 serverLoader 패턴으로 변경
5. Edit tool로 파일 수정
6. `pnpm verify:ssg` 재실행하여 수정 확인

### 자동 수정 템플릿

기존 코드:

```typescript
export async function clientLoader({ params }) {
  const data = await fetchData(params.id);
  return { data };
}
```

자동 변환 결과:

```typescript
interface LoaderData {
  data: DataType;
}

// SSG 빌드 시 실행
export async function loader({ params }): Promise<LoaderData> {
  const data = await fetchData(params.id);
  return { data };
}

// 클라이언트 네비게이션 시 실행
export async function clientLoader({
  params,
  serverLoader,
}: {
  params: { id: string };
  serverLoader: () => Promise<LoaderData>;
}): Promise<LoaderData> {
  try {
    return await serverLoader();
  } catch {
    const data = await fetchData(params.id);
    return { data };
  }
}
```

## 서브에이전트 활용

복잡한 수정이 필요한 경우, Task tool을 사용하여 서브에이전트를 호출하세요:

```yaml
Task tool 호출 예시:
- subagent_type: "general-purpose"
- prompt: "apps/context/app/routes/($locale).conversations.$categoryId.tsx 파일의 clientLoader를 loader + clientLoader 패턴으로 변환해줘. SSG 빌드 시 데이터가 HTML에 포함되어야 함."
```

## 관련 파일

- `apps/*/react-router.config.ts`
- `apps/*/app/entry.client.tsx`
- `apps/*/app/routes/*.tsx` (동적 라우트)
- `scripts/verify-ssg.ts`
