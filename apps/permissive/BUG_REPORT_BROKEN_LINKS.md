# 버그 리포트: 링크 클릭 시 빈 화면 문제

## 문제 현상
- 사이드바 또는 페이지 내 링크 클릭 시 **검정색 빈 화면** 표시
- 홈페이지(`/`)만 정상 작동

## 원인 분석

### 근본 원인: **라우트 파일 미존재**

SolidStart는 **파일 기반 라우팅**을 사용합니다. 즉, 각 URL 경로에 해당하는 파일이 `src/routes/` 디렉토리에 있어야 합니다.

**현재 상태:**
```
src/routes/
└── index.tsx     ← 오직 이 파일만 존재 (/ 경로)
```

**필요한 상태:**
```
src/routes/
├── index.tsx              ← / (존재함 ✅)
├── quick-start.tsx        ← /quick-start (없음 ❌)
├── compare.tsx            ← /compare (없음 ❌)
├── web-api/
│   ├── index.tsx          ← /web-api (없음 ❌)
│   ├── dom.tsx            ← /web-api/dom (없음 ❌)
│   ├── fetch.tsx          ← /web-api/fetch (없음 ❌)
│   ├── storage.tsx        ← /web-api/storage (없음 ❌)
│   ├── canvas.tsx         ← /web-api/canvas (없음 ❌)
│   └── workers.tsx        ← /web-api/workers (없음 ❌)
├── opensource/
│   ├── index.tsx          ← /opensource (없음 ❌)
│   ├── frameworks.tsx     ← /opensource/frameworks (없음 ❌)
│   ├── state.tsx          ← /opensource/state (없음 ❌)
│   ├── routing.tsx        ← /opensource/routing (없음 ❌)
│   ├── styling.tsx        ← /opensource/styling (없음 ❌)
│   └── build.tsx          ← /opensource/build (없음 ❌)
└── rankings/
    ├── index.tsx          ← /rankings (없음 ❌)
    ├── popular.tsx        ← /rankings/popular (없음 ❌)
    ├── lightweight.tsx    ← /rankings/lightweight (없음 ❌)
    ├── growing.tsx        ← /rankings/growing (없음 ❌)
    └── downloads.tsx      ← /rankings/downloads (없음 ❌)
```

## 네비게이션에 정의된 링크 vs 실제 라우트 파일

| 링크 경로 | 파일 존재 여부 | 상태 |
|-----------|---------------|------|
| `/` | `src/routes/index.tsx` | ✅ 작동 |
| `/quick-start` | 없음 | ❌ 빈 화면 |
| `/web-api` | 없음 | ❌ 빈 화면 |
| `/web-api/dom` | 없음 | ❌ 빈 화면 |
| `/web-api/fetch` | 없음 | ❌ 빈 화면 |
| `/web-api/storage` | 없음 | ❌ 빈 화면 |
| `/web-api/canvas` | 없음 | ❌ 빈 화면 |
| `/web-api/workers` | 없음 | ❌ 빈 화면 |
| `/opensource` | 없음 | ❌ 빈 화면 |
| `/opensource/frameworks` | 없음 | ❌ 빈 화면 |
| `/opensource/state` | 없음 | ❌ 빈 화면 |
| `/opensource/routing` | 없음 | ❌ 빈 화면 |
| `/opensource/styling` | 없음 | ❌ 빈 화면 |
| `/opensource/build` | 없음 | ❌ 빈 화면 |
| `/rankings` | 없음 | ❌ 빈 화면 |
| `/rankings/popular` | 없음 | ❌ 빈 화면 |
| `/rankings/lightweight` | 없음 | ❌ 빈 화면 |
| `/rankings/growing` | 없음 | ❌ 빈 화면 |
| `/rankings/downloads` | 없음 | ❌ 빈 화면 |
| `/compare` | 없음 | ❌ 빈 화면 |

**총계:** 20개 링크 중 1개만 작동 (5%)

## 해결 방안

### 방안 1: 모든 페이지 생성 (권장)
각 경로에 해당하는 페이지 컴포넌트 파일을 생성합니다.

**생성할 파일 수:** 19개

### 방안 2: 임시 플레이스홀더 페이지
"준비 중" 메시지를 보여주는 공통 컴포넌트로 모든 미구현 페이지를 대체합니다.

### 방안 3: Catch-all 라우트 사용
`src/routes/[...404].tsx` 파일을 생성하여 존재하지 않는 경로를 처리합니다.

---

## 권장 조치

**즉시 수정 필요:** 방안 2 또는 3으로 빈 화면 문제를 우선 해결한 후, 점진적으로 실제 페이지를 구현합니다.

---

**작성일:** 2025-12-15
**문제 유형:** 라우팅 오류
**심각도:** 높음 (사이트 네비게이션 불가)
