# Tools PWA 스펙 → Context/Permissive/Roots 적용 분석 보고서

> **이 monorepo의 모든 앱은 100% SSG (Static Site Generation) 정적 사이트입니다.**
>
> - 빌드 설정: `preset: "static"` in `app.config.ts`
> - 빌드 출력: `.output/public`
> - 서버 없음 (No SSR, No API)

---

## 요약

**결론:** Tools 앱 스펙의 **30~40%만 필요**, 나머지는 과도한 엔지니어링

Tools 앱은 WASM, AudioWorklet, SharedArrayBuffer 등 **특수 웹 기술**을 사용하는 복잡한 앱이라 저 정도 스펙이 필요합니다. 반면 Context/Permissive/Roots는 **100% SSG 정적 사이트**로 단순한 구조입니다.

---

## 1. 앱 특성 비교

| 특성 | Tools | Context | Permissive | Roots |
|------|-------|---------|------------|-------|
| **용도** | Web DAW, 리듬게임 | 한국어 사전 | 웹개발 자료 | 수학 문서 |
| **빌드 방식** | SSG | **100% SSG** | **100% SSG** | **100% SSG** |
| **빌드 출력** | `.output/public` | `.output/public` | `.output/public` | `.output/public` |
| **특수 기술** | WASM, AudioWorklet, SharedArrayBuffer | 없음 | 없음 | KaTeX (수식) |
| **외부 API** | 없음 | 없음 | 없음 | 없음 |
| **마이크 사용** | ✅ (Tuner) | ❌ | ❌ | ❌ |
| **대용량 파일** | ✅ (오디오, WASM) | ❌ | ❌ | ❌ |
| **실시간 처리** | ✅ | ❌ | ❌ | ❌ |

**핵심 차이:** Tools는 "앱"이고, Context/Permissive/Roots는 "100% SSG 정적 문서 사이트"

---

## 2. Tools 스펙 항목별 필요성 분석

### ✅ 필수 (그대로 적용)

| 항목 | 이유 |
|------|------|
| `manifest.json` 기본 설정 | PWA 설치에 필수 |
| 아이콘 (192x192, 512x512) | 설치 시 필수, 최소 2개면 충분 |
| `registerType: 'autoUpdate'` | 사용자 경험 최선 |
| `globPatterns` (html, js, css, 이미지) | SSG 프리캐싱 핵심 |
| `cleanupOutdatedCaches: true` | 캐시 관리 필수 |

### ⚠️ 선택적 (적용 권장하나 단순화)

| 항목 | Tools | Context/Permissive | 권장 |
|------|-------|-------------------|------|
| 아이콘 개수 | 10개 | 4개면 충분 | 72, 192, 512, maskable-512 |
| Screenshots | 2개 | 없어도 됨 | 생략 |
| Shortcuts | 2개 | 1개 또는 생략 | 메인 기능만 |
| `skipWaiting` | ✅ | 선택 | 권장 |
| `clientsClaim` | ✅ | 선택 | 권장 |
| `navigationPreload` | ✅ | 불필요 | 생략 (SSG는 프리캐시) |

### ❌ 불필요 (제거)

| 항목 | 이유 |
|------|------|
| **WASM 캐싱** (`*.wasm`) | WASM 사용 안함 |
| **Audio 캐싱** (`*.wav, *.mp3`) | 오디오 파일 없음 |
| **NetworkFirst for HTML** | SSG는 모든 HTML 프리캐시, CacheFirst가 더 적합 |
| **`networkTimeoutSeconds: 3`** | 서버 응답 대기 불필요 |
| **COOP/COEP 헤더** | SharedArrayBuffer 사용 안함 |
| **마이크 Permission Policy** | 마이크 사용 안함 |
| **useServiceWorker 훅** | 업데이트 UI 불필요 (autoUpdate면 충분) |
| **OfflineIndicator 업데이트 버튼** | 자동 업데이트면 불필요 |

---

## 3. Runtime Caching 전략 비교

### Tools (6가지 전략)
```
HTML → NetworkFirst (3초 타임아웃)
WASM → CacheFirst (30일)
Audio → CacheFirst (30일)
Fonts → CacheFirst (60일)
Images → CacheFirst (30일)
JS/CSS → StaleWhileRevalidate (7일)
```

### Context/Permissive (2가지면 충분)
```
모든 정적 파일 → Precache (빌드 시 자동)
Google Fonts → CacheFirst (1년)
```

**왜 단순해도 되는가?**
- SSG는 모든 파일이 빌드 시점에 확정됨
- Precache가 runtimeCaching보다 우선 → 추가 전략 불필요
- 외부 리소스(폰트)만 runtimeCaching 필요

---

## 4. HTTP Headers 비교

### Tools (112줄)
```
# 보안
X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, CSP

# WASM/AudioWorklet 특수 헤더
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp

# 권한
Permissions-Policy: microphone=(self)

# 캐시 (파일 타입별 세분화)
*.wasm → 1년 immutable
*.html → must-revalidate
```

### Context/Permissive (20줄이면 충분)
```
# 보안 (기본만)
X-Content-Type-Options: nosniff
X-Frame-Options: DENY

# 캐시 (단순화)
/*.html → max-age=0, must-revalidate
/assets/* → max-age=31536000, immutable
```

**불필요한 이유:**
- COOP/COEP → SharedArrayBuffer 안 씀
- 마이크 권한 → 마이크 안 씀
- WASM 캐시 → WASM 안 씀
- 복잡한 CSP → 인라인 스크립트 없으면 기본 CSP도 과함

---

## 5. 커스텀 Hooks 필요성

### Tools
| 훅 | 용도 | 필요 여부 |
|----|------|----------|
| `useServiceWorker()` | SW 상태 관리, 수동 업데이트 | ❌ autoUpdate면 불필요 |
| `useOnlineStatus()` | 오프라인 감지 | ⚠️ 있으면 좋음 |

### Context/Permissive 권장
| 훅 | 용도 | 복잡도 |
|----|------|--------|
| `useOnlineStatus()` | 오프라인 배너 표시 | 낮음 (20줄) |

**useServiceWorker가 불필요한 이유:**
- `registerType: 'autoUpdate'`가 모든 걸 자동 처리
- 사용자가 "업데이트" 버튼 누를 필요 없음
- 백그라운드에서 새 SW 다운로드 → 다음 방문 시 자동 적용

---

## 6. UI 컴포넌트 필요성

### Tools의 OfflineIndicator
```
- 오프라인 배너
- 온라인 복귀 토스트
- 업데이트 가능 배너 + 버튼
```

### Context/Permissive 권장
```
- 오프라인 배너 (선택적)
- 나머지 불필요
```

**간소화 이유:**
- SSG + 완전 프리캐싱 → 오프라인에서도 100% 동작
- 사용자가 오프라인인지 알 필요 거의 없음
- "오프라인 모드" 배너는 오히려 불안감 유발 가능

---

## 7. 권장 스펙 (Context/Permissive/Roots용 - 100% SSG)

### manifest.json (최소화)
```json
{
  "name": "앱 이름",
  "short_name": "짧은 이름",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Workbox 설정 (최소화)
```typescript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{html,js,css,png,svg,ico,woff2}'],
    cleanupOutdatedCaches: true,
    // runtimeCaching은 외부 폰트만
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
        handler: 'CacheFirst',
        options: { cacheName: 'fonts', expiration: { maxAgeSeconds: 365 * 24 * 60 * 60 } }
      }
    ]
  }
})
```

### HTTP Headers (최소화, Cloudflare용)
```
/*
  X-Content-Type-Options: nosniff

/*.html
  Cache-Control: max-age=0, must-revalidate

/assets/*
  Cache-Control: max-age=31536000, immutable
```

### 커스텀 코드
```
useOnlineStatus() 훅 → 20줄
OfflineIndicator 컴포넌트 → 15줄 (선택적)
```

---

## 8. 결론

### Tools 스펙이 복잡한 이유
| 요구사항 | 결과 |
|----------|------|
| WASM 사용 | COOP/COEP 헤더, wasm 캐싱 필요 |
| AudioWorklet | SharedArrayBuffer 필요 |
| 대용량 오디오 | 오디오 캐싱 전략 필요 |
| 실시간 처리 | NetworkFirst + 타임아웃 필요 |

### Context/Permissive/Roots가 단순해도 되는 이유
| 특성 | 결과 |
|------|------|
| **100% SSG** | 프리캐시만으로 완전 오프라인 |
| **빌드 출력** | `.output/public` (정적 파일만) |
| 정적 콘텐츠 | 복잡한 캐싱 전략 불필요 |
| 특수 API 없음 | 특수 헤더 불필요 |
| 서버 없음 | NetworkFirst, Background Sync 불필요 |

### 최종 권장사항

| 구분 | Tools | Context/Permissive/Roots |
|------|-------|--------------------------|
| **빌드 방식** | SSG | **100% SSG** |
| **빌드 출력** | `.output/public` | `.output/public` |
| manifest.json | 50줄 | 20줄 |
| Workbox 설정 | 80줄 | 15줄 |
| HTTP Headers | 112줄 | 10줄 |
| 커스텀 훅 | 2개 (100줄) | 1개 (20줄) |
| UI 컴포넌트 | 1개 (50줄) | 선택적 (15줄) |
| **총 복잡도** | **높음** | **낮음** |

**한 줄 요약:** Tools 스펙의 30%만 가져오면 됨. Context/Permissive/Roots는 100% SSG 정적 사이트라서 단순한 설정으로 충분함.
