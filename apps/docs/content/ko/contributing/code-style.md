---
title: 코드 스타일 가이드
description: 모노레포의 코딩 규칙 및 스타일 가이드라인
sidebar:
  order: 2
---

# 코드 스타일 가이드

이 프로젝트는 린팅과 포맷팅에 **Biome**을 사용합니다. 모든 코드는 병합 전에 린트 검사를 통과해야 합니다.

## 빠른 명령어

```bash
pnpm lint      # 문제 확인
pnpm format    # 포맷팅 자동 수정
pnpm typecheck # TypeScript 검증
```

## 일반 원칙

### 1. TypeScript Strict 모드

모든 코드는 엄격하게 타입이 지정되어야 합니다. 꼭 필요한 경우가 아니면 `any`를 피하세요.

```typescript
// ✅ 좋음
function getEntry(id: string): Entry | undefined {
  return entries.find(e => e.id === id);
}

// ❌ 나쁨
function getEntry(id: any): any {
  return entries.find(e => e.id === id);
}
```

### 2. 함수형 스타일

함수형 프로그래밍 패턴을 선호합니다.

```typescript
// ✅ 좋음
const filtered = entries.filter(e => e.category === 'greetings');
const mapped = entries.map(e => e.word);

// ❌ 나쁨
const filtered = [];
for (const e of entries) {
  if (e.category === 'greetings') {
    filtered.push(e);
  }
}
```

### 3. 불변성

데이터를 직접 변경하지 마세요. 새 객체/배열을 생성하세요.

```typescript
// ✅ 좋음
const updated = { ...entry, word: '새 단어' };
const newList = [...entries, newEntry];

// ❌ 나쁨
entry.word = '새 단어';
entries.push(newEntry);
```

## 명명 규칙

### 파일

| 타입 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `SearchBar.tsx` |
| 훅 | camelCase + `use` 접두사 | `useSearch.ts` |
| 유틸리티 | camelCase | `formatDate.ts` |
| 타입 | camelCase 또는 PascalCase | `types.ts`, `Entry.ts` |
| 상수 | SCREAMING_SNAKE_CASE | `constants.ts` |

### 변수 & 함수

```typescript
// 변수: camelCase
const searchQuery = '안녕';
const isLoading = false;

// 함수: camelCase, 동사 접두사
function getEntry(id: string) {}
function handleClick() {}
function formatDate(date: Date) {}

// 컴포넌트: PascalCase
function SearchBar() {}
function EntryCard({ entry }: Props) {}

// 상수: SCREAMING_SNAKE_CASE
const MAX_RESULTS = 50;
const API_BASE_URL = 'https://api.example.com';
```

## React 컴포넌트

### 함수 컴포넌트

컴포넌트에는 함수 선언을 사용하세요:

```typescript
// ✅ 권장
function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  return <input placeholder={placeholder} />;
}

// ✅ 허용
const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  return <input placeholder={placeholder} />;
};
```

### Props 구조분해

함수 시그니처에서 props를 구조분해하세요:

```typescript
// ✅ 좋음
function EntryCard({ entry, onFavorite }: EntryCardProps) {
  return <div>{entry.word}</div>;
}

// ❌ 나쁨
function EntryCard(props: EntryCardProps) {
  return <div>{props.entry.word}</div>;
}
```

## CSS & 스타일링

### Tailwind CSS v4

Tailwind 유틸리티 클래스를 사용하세요:

```tsx
// ✅ 좋음
<div className="flex items-center gap-4 p-4 bg-(--bg-secondary)">

// ❌ 나쁨 - 인라인 스타일
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
```

### 클래스명 병합

조건부 클래스에는 `cn()`을 사용하세요:

```typescript
import { cn } from '@soundblue/core/utils';

<button
  className={cn(
    'px-4 py-2 rounded-lg font-medium',
    variant === 'primary' && 'bg-blue-500 text-white',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
```

### CSS 변수

디자인 토큰을 사용하세요:

```tsx
// ✅ 좋음 - 디자인 토큰 사용
<div className="bg-(--bg-primary) text-(--text-primary)">

// ❌ 나쁨 - 하드코딩된 색상
<div className="bg-white text-gray-900">
```
