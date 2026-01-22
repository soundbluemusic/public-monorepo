---
title: Pull Request 가이드
description: Pull Request를 생성하고 제출하는 방법
sidebar:
  order: 3
---

# Pull Request 가이드

이 가이드는 모노레포에 효과적인 Pull Request를 생성하는 방법을 설명합니다.

## 시작하기 전에

1. **기존 이슈 확인** — 변경 사항이 이미 진행 중일 수 있습니다
2. **새 기능이나 큰 변경은 먼저 이슈 열기**
3. 외부 기여자라면 **저장소 Fork**

## Pull Request 생성

### 1. 기능 브랜치 생성

```bash
# main 브랜치 업데이트
git checkout main
git pull origin main

# 기능 브랜치 생성
git checkout -b feat/your-feature
```

### 2. 변경 수행

- [코드 스타일 가이드](/public-monorepo/ko/contributing/code-style/) 따르기
- 커밋은 집중적이고 원자적으로
- 명확한 커밋 메시지 작성

### 3. 품질 검사 실행

제출 전 모든 검사가 통과해야 합니다:

```bash
# 린트 검사
pnpm lint

# 타입 검사
pnpm typecheck

# 단위 테스트
pnpm test

# 모든 앱 빌드
pnpm build
```

### 4. Push 및 PR 생성

```bash
git push origin feat/your-feature
```

그런 다음 GitHub에서 Pull Request를 엽니다.

## PR 제목 형식

[Conventional Commits](https://www.conventionalcommits.org/) 형식 사용:

```
<type>(<scope>): <description>
```

### 타입

| 타입 | 설명 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서만 |
| `style` | 포맷팅, 코드 변경 없음 |
| `refactor` | 코드 변경, 기능/수정 없음 |
| `perf` | 성능 개선 |
| `test` | 테스트 추가 |
| `chore` | 빌드, 의존성 등 |

### 예시

```
feat(context): 로마자 표기 검색 지원 추가
fix(search): 특수 문자 빈 결과 해결
docs(readme): 설치 지침 업데이트
refactor(ui): Button 컴포넌트 추출
perf(search): 인덱스 로딩 최적화
test(i18n): 로케일 라우팅 테스트 추가
chore(deps): react-router v7.12로 업데이트
```

### 스코프 (선택)

| 스코프 | 설명 |
|--------|------|
| `context` | Context 앱 |
| `permissive` | Permissive 앱 |
| `roots` | Roots 앱 |
| `ui` | @soundblue/ui 패키지 |
| `search` | @soundblue/search 패키지 |
| `i18n` | @soundblue/i18n 패키지 |
| `core` | @soundblue/core 패키지 |
| `deps` | 의존성 |
| `docs` | 문서 |

## PR 설명 템플릿

```markdown
## 요약
<!-- 변경 사항 간략 설명 -->

## 변경 사항
<!-- 구체적인 변경 사항 목록 -->
- X 기능 추가
- Y 버그 수정
- Z 컴포넌트 업데이트

## 테스트
<!-- 어떻게 테스트했나요? -->
- [ ] 단위 테스트 통과
- [ ] 브라우저에서 수동 테스트
- [ ] EN과 KO 모두 테스트

## 스크린샷 (UI 변경 시)
<!-- 스크린샷 또는 GIF 추가 -->

## 관련 이슈
<!-- 관련 이슈 링크 -->
Fixes #123
Closes #456
```

## 리뷰 과정

### 리뷰어가 확인하는 것

1. **코드 품질** - 스타일 가이드 준수, TypeScript 오류 없음
2. **정확성** - 문제 해결, 회귀 없음
3. **아키텍처** - 레이어 규칙 준수
4. **테스트** - 필요시 테스트 추가/업데이트
5. **문서** - 코드 자체 문서화

## 병합 요건

PR은 다음 조건 충족 시 병합 가능:

- [ ] 모든 CI 검사 통과
- [ ] 메인테이너로부터 최소 1개 승인
- [ ] 미해결 대화 없음
- [ ] main과 최신 상태

## 병합 후

1. 기능 브랜치 삭제
2. 업데이트된 main 브랜치 pull
3. 기여를 축하하세요! 🎉
