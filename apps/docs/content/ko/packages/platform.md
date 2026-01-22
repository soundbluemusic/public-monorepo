---
title: "@soundblue/platform"
description: 클라이언트 측 영속성을 위한 Dexie.js 기반 IndexedDB 스토리지 - Layer 1 데이터 패키지
sidebar:
  order: 5
---

# @soundblue/platform

**Layer 1 (데이터)** — Dexie.js를 사용한 클라이언트 측 IndexedDB 스토리지.

## 개요

이 패키지는 사용자 데이터(북마크, 학습 진행도, 설정)를 브라우저의 IndexedDB에 저장하기 위한 통합 스토리지 API를 제공합니다.

| 속성 | 값 |
|------|-----|
| 레이어 | 1 (데이터) |
| 의존성 | dexie, @soundblue/core |
| React 필요 | 아니오 |
| 환경 | 클라이언트 전용 |

## 내보내기

### `/storage`

조건부 내보내기가 있는 메인 스토리지 API:

```typescript
// 브라우저 환경
import { storage } from '@soundblue/platform/storage';

// 빌드/SSG 환경 (no-op 반환)
import { storage } from '@soundblue/platform/storage';  // 안전, undefined/noop 반환
```

패키지는 조건부 내보내기 사용:
- **브라우저**: `./src/storage/index.browser.ts` - 전체 IndexedDB 구현
- **기본**: `./src/storage/index.noop.ts` - SSG 빌드용 no-op 스텁

## 스토리지 API

### 즐겨찾기

```typescript
import { storage } from '@soundblue/platform/storage';

// 즐겨찾기 추가
await storage.favorites.add({
  id: 'entry-hello',
  type: 'entry',
  addedAt: Date.now(),
});

// 모든 즐겨찾기 가져오기
const favorites = await storage.favorites.getAll();

// 즐겨찾기 제거
await storage.favorites.remove('entry-hello');

// 즐겨찾기 여부 확인
const isFavorited = await storage.favorites.has('entry-hello');
```

### 학습 진행도

```typescript
// 학습 완료 표시
await storage.studyProgress.markStudied('entry-hello');

// 학습 상태 가져오기
const isStudied = await storage.studyProgress.isStudied('entry-hello');

// 모든 학습 완료 항목 가져오기
const studiedIds = await storage.studyProgress.getAllStudied();

// 날짜별 학습 수 가져오기
const todayCount = await storage.studyProgress.getCountByDate(new Date());
```

### 최근 조회

```typescript
// 최근 조회에 추가
await storage.recentViews.add({
  id: 'entry-hello',
  type: 'entry',
  viewedAt: Date.now(),
});

// 최근 조회 가져오기 (최근 50개)
const recent = await storage.recentViews.getRecent(50);

// 모든 최근 조회 삭제
await storage.recentViews.clear();
```

### 설정

```typescript
// 설정 가져오기
const theme = await storage.settings.get('theme');  // 'light' | 'dark' | 'system'

// 설정 저장
await storage.settings.set('theme', 'dark');

// 모든 설정 가져오기
const allSettings = await storage.settings.getAll();
```

## SSG 호환성

스토리지 API는 SSG 안전하게 설계되었습니다:

```typescript
// SSG 빌드 중에는 no-op 구현 반환
import { storage } from '@soundblue/platform/storage';

// 모든 메서드는 안전한 기본값 반환
await storage.favorites.getAll();  // SSG 중 [] 반환
await storage.settings.get('theme');  // SSG 중 undefined 반환
```

## 모범 사례

1. **스토리지 API 사용** - 필요하지 않다면 Dexie 직접 접근 금지
2. **SSG 처리** - API가 SSG 빌드를 자동으로 처리
3. **비동기/대기** - 모든 스토리지 작업은 비동기
