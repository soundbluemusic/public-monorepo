---
title: "@soundblue/data"
description: 타입 안전 데이터 처리를 위한 Zod 스키마와 데이터 로더 - Layer 1 데이터 패키지
sidebar:
  order: 4
---

# @soundblue/data

**Layer 1 (데이터)** — 타입 안전 JSON 데이터 처리를 위한 Zod 스키마와 데이터 로더.

## 개요

이 패키지는 애플리케이션에서 사용되는 모든 데이터 타입에 대한 스키마를 정의하고 빌드 시점에 JSON 파일을 읽기 위한 로더를 제공합니다.

| 속성 | 값 |
|------|-----|
| 레이어 | 1 (데이터) |
| 의존성 | zod |
| React 필요 | 아니오 |

## 내보내기

### `/schemas`

데이터 검증을 위한 Zod 스키마.

```typescript
import { EntrySchema, CategorySchema } from '@soundblue/data/schemas';
import { ConceptSchema, FieldSchema } from '@soundblue/data/schemas/roots';
import { LibrarySchema, WebApiSchema } from '@soundblue/data/schemas/permissive';
```

### `/schemas/context`

Context (한국어 사전) 앱용 스키마.

```typescript
import {
  EntrySchema,
  CategorySchema,
  ConversationSchema,
  type Entry,
  type Category,
  type Conversation
} from '@soundblue/data/schemas/context';

// 항목 스키마 (사전 항목)
const entry = EntrySchema.parse({
  id: 'hello',
  word: '안녕',
  romanization: 'annyeong',
  translations: {
    en: 'hello',
    explanation: '일반적인 인사'
  },
  category: 'greetings',
  difficulty: 'beginner'
});

// TypeScript 타입 추론
type Entry = z.infer<typeof EntrySchema>;
```

### `/schemas/roots`

Roots (수학) 앱용 스키마.

```typescript
import {
  ConceptSchema,
  FieldSchema,
  type Concept,
  type Field
} from '@soundblue/data/schemas/roots';

// 수학 개념
const concept = ConceptSchema.parse({
  id: 'quadratic-formula',
  title: '이차 방정식',
  field: 'algebra',
  prerequisites: ['polynomials'],
  formula: 'x = (-b ± √(b²-4ac)) / 2a'
});
```

### `/loaders`

빌드 시점용 데이터 로딩 유틸리티.

```typescript
import {
  loadJson,
  loadJsonDirectory,
  createDataLoader
} from '@soundblue/data/loaders';

// 단일 JSON 파일 로드
const config = await loadJson<Config>('data/config.json');

// 디렉토리의 모든 JSON 파일 로드
const entries = await loadJsonDirectory<Entry>('data/context/entries');

// 스키마 검증이 포함된 타입화된 로더 생성
const loadEntries = createDataLoader(EntrySchema, 'data/context/entries');
const validatedEntries = await loadEntries();
```

## 모범 사례

1. **항상 검증** - 로드 시점에 Zod 스키마로 데이터 검증
2. **단일 소스** - 모든 데이터는 `data/` 디렉토리에 존재
3. **타입 추론** - TypeScript 타입에 `z.infer<typeof Schema>` 사용
