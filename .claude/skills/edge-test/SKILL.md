---
name: edge-test
description: 엣지 케이스 테스트 자동 생성. 함수 분석 → 경계값/예외 상황 식별 → 테스트 코드 자동 작성
---

# Edge Test 스킬

함수의 엣지 케이스(경계값, 예외 상황)를 분석하고 테스트 코드를 자동 생성하는 스킬입니다.

## 사용법

```
/edge-test [파일경로 또는 함수명]
```

## 예시

- `/edge-test packages/core/src/utils/chunk.ts` - 특정 파일의 모든 함수
- `/edge-test validateId` - 특정 함수 검색 및 테스트
- `/edge-test packages/search/` - 디렉토리 내 모든 함수

## 자동 실행 지시

**이 스킬이 호출되면 다음 단계를 순서대로 수행하세요:**

### 1단계: 대상 파일/함수 식별

인자가 파일 경로인 경우:
```typescript
// 해당 파일을 Read tool로 읽고 export된 함수 목록 추출
```

인자가 함수명인 경우:
```typescript
// Grep으로 함수 정의 위치 검색
// 예: "export function validateId" 또는 "export const validateId"
```

### 2단계: 함수 시그니처 분석

각 함수에 대해 분석:

| 분석 항목 | 설명 |
|----------|------|
| 파라미터 타입 | `number`, `string`, `array`, `object` 등 |
| 반환 타입 | 반환값 또는 `void` |
| 조건문 | `if`, `switch`, 삼항 연산자 |
| 에러 처리 | `throw`, `try-catch` |
| 반복문 | `for`, `while`, `map`, `reduce` |

### 3단계: 엣지 케이스 식별

타입별 자동 식별 규칙:

#### 숫자 (number)
- `0` - 제로 값
- `-1` - 음수
- `Number.MAX_SAFE_INTEGER` - 최대값
- `Number.MIN_SAFE_INTEGER` - 최소값
- `Infinity`, `-Infinity` - 무한대
- `NaN` - 숫자가 아님

#### 문자열 (string)
- `''` - 빈 문자열
- `' '` - 공백만
- `'a'.repeat(10000)` - 매우 긴 문자열
- 특수문자: `\n`, `\t`, `\0`
- 유니코드: 이모지, 한글, 제로폭 문자

#### 배열 (array)
- `[]` - 빈 배열
- `[null]`, `[undefined]` - 특수 요소
- 매우 큰 배열 (10만+ 요소)
- 중첩 배열

#### 객체 (object)
- `{}` - 빈 객체
- `null`, `undefined`
- 순환 참조
- 프로토타입 오염 키: `__proto__`, `constructor`

### 4단계: 테스트 코드 생성

기존 테스트 파일이 있으면 해당 파일에 추가, 없으면 새로 생성.

#### 테스트 파일 위치 규칙

| 소스 파일 | 테스트 파일 |
|----------|------------|
| `packages/core/src/utils/chunk.ts` | `tests/unit/packages/core/utils/chunk.test.ts` |
| `packages/search/src/core/engine.ts` | `tests/unit/packages/search/core/engine.test.ts` |

#### 테스트 코드 템플릿

```typescript
describe('[함수명] - Edge Cases', () => {
  describe('숫자 경계값', () => {
    it('should handle zero', () => {
      // 테스트 코드
    });

    it('should handle negative numbers', () => {
      // 테스트 코드
    });

    it('should handle very large numbers', () => {
      // 테스트 코드
    });
  });

  describe('문자열 경계값', () => {
    it('should handle empty string', () => {
      // 테스트 코드
    });

    it('should handle special characters', () => {
      // 테스트 코드
    });
  });

  describe('에러 처리', () => {
    it('should throw on invalid input', () => {
      expect(() => 함수(invalidInput)).toThrow();
    });
  });
});
```

### 5단계: 테스트 실행 및 검증

```bash
# 생성된 테스트만 실행
pnpm test [테스트파일경로] --run

# 커버리지 확인
pnpm test [테스트파일경로] --coverage --run
```

### 6단계: 결과 요약

```
## 엣지 케이스 테스트 생성 결과

### 분석 대상
- 파일: [파일경로]
- 함수: [함수 목록]

### 생성된 테스트
| 함수 | 추가된 테스트 | 커버리지 변화 |
|------|-------------|--------------|
| validateId | 5개 | 70% → 95% |
| chunkArray | 3개 | 80% → 92% |

### 테스트 결과
✅ 모든 테스트 통과 / ❌ N개 실패

### 실패한 테스트 (있는 경우)
- [테스트명]: [실패 이유] → [수정 제안]
```

## 우선순위 기준

| 우선순위 | 기준 | 예시 |
|---------|------|------|
| 🔴 높음 | 보안/안정성 | 입력 검증, XSS 방지 |
| 🟡 중간 | 성능/메모리 | 대용량 데이터 처리 |
| 🟢 낮음 | 완전성 | 모든 코드 경로 |

## 주의사항

1. **기존 테스트 보존**: 기존 테스트를 삭제하거나 수정하지 않음
2. **중복 방지**: 이미 테스트된 케이스는 건너뜀
3. **하드코딩 금지**: 테스트 통과용 매직 넘버 사용 금지
4. **실제 동작 검증**: 함수의 실제 동작을 확인 후 예상 결과 작성

## 관련 파일

- `EDGE_CASE_TEST_PLAN.md` - 전체 테스트 계획서
- `tests/unit/` - 테스트 파일 디렉토리
- `vitest.config.ts` - Vitest 설정
