# Roots 앱 수학 공식 로딩 최적화 계획

> **Note (2025):** This document contains the original optimization plan. Since writing this plan, the math rendering implementation has been changed from KaTeX to browser-native MathML. See `app/components/math/LaTeX.tsx` for current implementation.
>
> **참고 (2025):** 이 문서는 원래의 최적화 계획을 담고 있습니다. 계획 작성 이후, 수학 렌더링 구현이 KaTeX에서 브라우저 네이티브 MathML로 변경되었습니다. 현재 구현은 `app/components/math/LaTeX.tsx`를 참조하세요.

## 📊 현재 상태 분석

### 주요 병목 현상 (Critical Bottlenecks)

1. **단일 거대 JSON 파일**
   - 52개 개념 파일 → 1개 `concepts.json` (500KB-1MB+, 압축 기준)
   - 단일 개념 조회에도 전체 파일 다운로드 필요
   - 네트워크 워터폴: HTML → JS → concepts.json

2. **코드 스플리팅 부재**
   - 모든 개념 데이터가 빌드 시 단일 번들로 통합
   - 동적 임포트 없음

3. **LaTeX 파서 성능**
   - 메모이제이션 없이 매 렌더마다 정규식 체인 실행
   - ~300줄 문자열 교체 작업 반복

4. **프리로딩 전략 부재**
   - 홈페이지에서 개념 데이터 선제 로딩 없음
   - `<link rel="prefetch">` 미사용

---

## 🎯 최적화 전략 (3단계)

### Phase 1: 즉시 적용 가능한 개선 (Quick Wins)
> 기존 구조 유지하면서 성능 개선 (1-2시간 작업)

#### 1.1 LaTeX 파서 메모이제이션
**문제**: 동일 수식을 매 렌더마다 파싱
**해결**:
- `LaTeX.tsx`에 `useMemo` 추가
- 파싱 결과 캐싱 (Map 기반)

**예상 효과**: 렌더링 시간 50-70% 감소

```typescript
// Before
export function LaTeX({ children }: LaTeXProps) {
  const parsed = parseLatex(children);
  return <span>{parsed}</span>;
}

// After
const parseCache = new Map<string, string>();

export function LaTeX({ children }: LaTeXProps) {
  const parsed = useMemo(() => {
    if (parseCache.has(children)) {
      return parseCache.get(children)!;
    }
    const result = parseLatex(children);
    parseCache.set(children, result);
    return result;
  }, [children]);

  return <span>{parsed}</span>;
}
```

#### 1.2 개념 카드 가상화 (Virtual Scrolling)
**문제**: 필드 페이지에서 50+ 개념 카드 동시 렌더링
**해결**: `react-window` 또는 `@tanstack/react-virtual` 사용

**예상 효과**: 초기 렌더링 시간 60-80% 감소

#### 1.3 이미지 최적화
**문제**: 현재는 없지만 미래 대비
**해결**: WebP 포맷, `loading="lazy"` 속성

---

### Phase 2: 데이터 로딩 구조 개선 (Medium Impact)
> 빌드 스크립트 + 로딩 로직 변경 (3-4시간 작업)

#### 2.1 필드별 JSON 분할
**현재 구조**:
```
public/concepts.json (전체 개념)
```

**개선 구조**:
```
public/concepts/
  ├── algebra.json
  ├── geometry.json
  ├── calculus.json
  ├── ... (18개 필드)
  └── index.json (메타데이터만)
```

**구현 단계**:
1. `generate-search-index.ts` 수정
   - 필드별로 개념 그룹화
   - 각 필드를 별도 JSON 파일로 저장
   - `index.json`은 필드명과 파일 경로만 포함

2. `lib/concepts.ts` 수정
   ```typescript
   // Before
   const response = await fetch('/concepts.json');

   // After
   const field = getFieldForConcept(conceptId);
   const response = await fetch(`/concepts/${field}.json`);
   ```

**예상 효과**:
- 평균 다운로드 크기 94% 감소 (1MB → 50KB)
- Time to Interactive 70% 개선

#### 2.2 동적 임포트로 코드 스플리팅
**해결**:
- React Router의 lazy loading 활용
- 개념 데이터를 필요할 때만 로드

```typescript
// routes/concept.$conceptId.tsx
export async function clientLoader({ params }) {
  const { getConceptById } = await import('../lib/concepts');
  return getConceptById(params.conceptId);
}
```

#### 2.3 스켈레톤 UI 개선
**현재**: 단순 로딩 스피너
**개선**:
- 개념 카드 형태의 스켈레톤
- 점진적 렌더링 (제목 → 정의 → 예제)

---

### Phase 3: 대규모 확장 대비 (Long-term Architecture)
> "세상 모든 수학" 수준의 데이터 처리 (1-2일 작업)

#### 3.1 IndexedDB 기반 클라이언트 캐싱
**목표**: 방문한 개념을 영구 저장, 오프라인 지원

**구현**:
```typescript
// lib/db.ts
import { openDB } from 'idb';

const db = await openDB('roots-concepts', 1, {
  upgrade(db) {
    db.createObjectStore('concepts', { keyPath: 'id' });
  },
});

export async function getCachedConcept(id: string) {
  // 1. IndexedDB 확인
  const cached = await db.get('concepts', id);
  if (cached) return cached;

  // 2. 네트워크에서 가져오기
  const fresh = await fetchConcept(id);

  // 3. 캐시에 저장
  await db.put('concepts', fresh);
  return fresh;
}
```

**예상 효과**:
- 재방문 시 로딩 시간 100% 제거
- 오프라인에서도 열람 가능 (PWA 강화)

#### 3.2 스트리밍 JSON 파싱
**문제**: 거대 JSON 파일 파싱 시 메인 스레드 블로킹
**해결**: Web Worker + Streaming API

```typescript
// lib/stream-parser.ts
const response = await fetch('/concepts/large-field.json');
const reader = response.body.getReader();
const decoder = new TextDecoder();

// JSON을 청크 단위로 파싱하여 점진적 렌더링
for await (const chunk of readChunks(reader)) {
  const concepts = parseJSONChunk(decoder.decode(chunk));
  postMessage({ type: 'concepts', data: concepts });
}
```

#### 3.3 Link Prefetching 전략
**호버/포커스 시 선제 로딩**:

```typescript
// components/ConceptLink.tsx
export function ConceptLink({ conceptId, children }) {
  const [prefetched, setPrefetched] = useState(false);

  const handleMouseEnter = () => {
    if (!prefetched) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/concepts/${getFieldForConcept(conceptId)}.json`;
      document.head.appendChild(link);
      setPrefetched(true);
    }
  };

  return (
    <Link
      to={`/concept/${conceptId}`}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
    >
      {children}
    </Link>
  );
}
```

**예상 효과**: 체감 로딩 시간 80% 감소

#### 3.4 서비스 워커 최적화
**현재**: 기본 PWA 캐싱
**개선**:
- Stale-While-Revalidate 전략
- 사용 빈도 기반 우선순위 캐싱
- 백그라운드 동기화로 인기 개념 선제 캐싱

```typescript
// public/sw.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/concepts/')) {
    event.respondWith(
      caches.open('concepts-v1').then((cache) =>
        cache.match(event.request).then((cached) => {
          const fresh = fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
          });
          return cached || fresh; // Stale-While-Revalidate
        })
      )
    );
  }
});
```

---

## 🔬 대안 기술 비교

### A. 수학 렌더링 라이브러리

| 라이브러리 | 번들 크기 | 렌더링 속도 | LaTeX 지원 | 추천도 |
|-----------|---------|-----------|-----------|-------|
| **현재 (Custom Parser)** | 0KB | 빠름 | 제한적 | ⭐⭐⭐⭐ (유지) |
| KaTeX | 200KB | 매우 빠름 | 완전 | ⭐⭐⭐ (복잡한 수식 시) |
| MathJax v3 | 80KB | 보통 | 완전 | ⭐⭐ (SSG에 비효율적) |
| Temml | 50KB | 빠름 | 완전 | ⭐⭐⭐ (대안으로 고려) |

**권장**: 현재 Custom Parser 유지 + 필요 시 Temml로 업그레이드

### B. 데이터 저장 전략

| 방식 | 초기 로딩 | 확장성 | 오프라인 | 추천도 |
|-----|---------|-------|---------|-------|
| **단일 JSON** | 느림 | 나쁨 | 불가능 | ❌ (현재 상태) |
| **필드별 JSON** | 빠름 | 좋음 | 가능 | ✅ (Phase 2 권장) |
| **IndexedDB** | 매우 빠름 | 우수 | 완벽 | ✅ (Phase 3 권장) |
| SQLite WASM | 보통 | 우수 | 완벽 | ⚠️ (오버엔지니어링) |

**권장**: Phase 2 (필드별 JSON) + Phase 3 (IndexedDB 캐싱)

### C. 렌더링 최적화

| 기법 | 구현 난이도 | 성능 향상 | 호환성 | 추천도 |
|-----|-----------|---------|--------|-------|
| **useMemo** | 쉬움 | +50% | 완벽 | ✅ (Phase 1 필수) |
| **Virtual Scrolling** | 보통 | +70% | 완벽 | ✅ (Phase 1 권장) |
| **Web Worker** | 어려움 | +30% | 좋음 | ⚠️ (과도한 최적화) |
| **Streaming Parsing** | 매우 어려움 | +20% | 좋음 | ⚠️ (수만 개념 이상 시) |

**권장**: useMemo + Virtual Scrolling (Phase 1)

---

## 📈 예상 성능 개선

### Before (현재)

| 지표 | 값 |
|-----|---|
| 초기 로딩 시간 | ~3-5초 |
| Time to Interactive | ~4-6초 |
| concepts.json 크기 | ~1MB |
| 개념 페이지 렌더링 | ~200ms |
| Lighthouse Performance | ~70-80 |

### After (Phase 1 + 2 + 3 완료 시)

| 지표 | 값 | 개선율 |
|-----|---|-------|
| 초기 로딩 시간 | ~0.5-1초 | **80-90%** ↓ |
| Time to Interactive | ~1-2초 | **70-80%** ↓ |
| 평균 JSON 크기 | ~50KB | **95%** ↓ |
| 개념 페이지 렌더링 | ~50ms | **75%** ↓ |
| Lighthouse Performance | ~95+ | **25점** ↑ |
| 재방문 로딩 시간 | ~0ms (캐시) | **100%** ↓ |

---

## 🚀 권장 실행 순서

### 1주차: Phase 1 (Quick Wins)
- [ ] LaTeX 파서 메모이제이션 (1시간)
- [ ] 가상 스크롤링 추가 (1-2시간)
- [ ] Lighthouse 측정 및 비교

### 2주차: Phase 2 (구조 개선)
- [ ] 필드별 JSON 분할 스크립트 작성 (2시간)
- [ ] 로딩 로직 리팩토링 (2시간)
- [ ] 동적 임포트 적용 (1시간)
- [ ] 성능 테스트 (1시간)

### 3주차: Phase 3 (선택적)
- [ ] IndexedDB 캐싱 구현 (4시간)
- [ ] Link Prefetching (2시간)
- [ ] 서비스 워커 최적화 (2시간)

---

## ⚠️ 주의사항 (절대 규칙 준수)

1. **100% SSG 유지**
   - 모든 최적화는 클라이언트 사이드에서만
   - 서버 로직/API 절대 금지

2. **로컬 스토리지 Only**
   - IndexedDB는 OK (브라우저 내장 API)
   - 외부 DB/CMS 절대 금지

3. **오픈소스 Only**
   - 모든 라이브러리는 오픈소스 확인
   - 예: `idb` (ISC 라이선스), `react-window` (MIT)

4. **기존 기능 보존**
   - 검색 기능 유지
   - 즐겨찾기 기능 유지
   - 오프라인 PWA 기능 유지

---

## 🎯 결론

**최우선 권장사항**: Phase 1 + Phase 2

- **Phase 1**: 즉시 적용 가능, 큰 효과
- **Phase 2**: 구조적 개선, 확장성 확보
- **Phase 3**: 선택적, "세상 모든 수학" 수준의 데이터에 대비

**예상 총 작업 시간**: 8-10시간 (Phase 1+2)
**예상 성능 개선**: 로딩 시간 80% 감소, Lighthouse 95+ 달성

**핵심 메시지**:
> 거대한 단일 JSON을 필드별로 분할하고 + LaTeX 파싱을 메모이제이션하면, 대부분의 성능 문제가 해결됩니다.
