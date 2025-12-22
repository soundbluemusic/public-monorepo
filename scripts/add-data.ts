#!/usr/bin/env tsx
/**
 * @fileoverview 데이터 추가 CLI 도구
 *
 * 각 앱에 새로운 데이터를 쉽게 추가할 수 있는 CLI 도구입니다.
 *
 * ## 사용법
 *
 * ### 1. 대화형 모드 (사용자용)
 *   pnpm add-data context greetings
 *   pnpm add-data permissive library
 *
 * ### 2. JSON 직접 입력 (Claude용) - 권장
 *   pnpm add-data context greetings --json '{"id":"test",...}'
 *   pnpm add-data permissive library --json '{"id":"lib-id","name":"Lib",...}'
 *
 * ### 3. 파일에서 읽기
 *   pnpm add-data context greetings --file ./new-entry.json
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import * as readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ============================================
// 타입 정의
// ============================================

interface ContextEntry {
  id: string;
  korean: string;
  romanization: string;
  pronunciation?: string;
  hanja?: string;
  partOfSpeech: string;
  categoryId: string;
  difficulty: string;
  frequency?: string;
  tags: string[];
  translations: {
    ko: {
      word: string;
      explanation: string;
      examples?: string[];
      variations?: { formal?: string[]; casual?: string[]; short?: string[] };
    };
    en: {
      word: string;
      explanation: string;
      examples?: string[];
      variations?: { formal?: string[]; casual?: string[]; short?: string[] };
    };
  };
}

interface LibraryEntry {
  name: string;
  description: string;
  descriptionKo: string;
  category: string;
  license: string;
  github: string;
  npm?: string;
  stars: string;
  features?: string[];
  featuresKo?: string[];
  usedHere?: boolean;
  alternatives?: string[];
}

// ============================================
// Readline 유틸리티
// ============================================

let rl: readline.Interface | null = null;

function getReadline(): readline.Interface {
  if (!rl) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  return rl;
}

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    getReadline().question(prompt, resolve);
  });
}

function close(): void {
  if (rl) {
    rl.close();
    rl = null;
  }
}

// ============================================
// 유효성 검사
// ============================================

function validateContextEntry(entry: ContextEntry): string[] {
  const errors: string[] = [];
  const required = [
    'id',
    'korean',
    'romanization',
    'partOfSpeech',
    'categoryId',
    'difficulty',
    'tags',
    'translations',
  ];

  for (const field of required) {
    if (!(field in entry) || entry[field as keyof ContextEntry] === undefined) {
      errors.push(`필수 필드 누락: ${field}`);
    }
  }

  if (entry.translations) {
    if (!entry.translations.ko?.word || !entry.translations.ko?.explanation) {
      errors.push('translations.ko.word와 explanation 필수');
    }
    if (!entry.translations.en?.word || !entry.translations.en?.explanation) {
      errors.push('translations.en.word와 explanation 필수');
    }
  }

  const validDifficulties = ['beginner', 'intermediate', 'advanced'];
  if (entry.difficulty && !validDifficulties.includes(entry.difficulty)) {
    errors.push(`difficulty는 ${validDifficulties.join('/')} 중 하나여야 함`);
  }

  const validPoS = [
    'noun',
    'verb',
    'adjective',
    'adverb',
    'particle',
    'interjection',
    'conjunction',
    'pronoun',
    'determiner',
    'expression',
  ];
  if (entry.partOfSpeech && !validPoS.includes(entry.partOfSpeech)) {
    errors.push(`partOfSpeech는 ${validPoS.join('/')} 중 하나여야 함`);
  }

  return errors;
}

function validateLibraryEntry(id: string, entry: LibraryEntry): string[] {
  const errors: string[] = [];
  const required = [
    'name',
    'description',
    'descriptionKo',
    'category',
    'license',
    'github',
    'stars',
  ];

  for (const field of required) {
    if (!(field in entry) || !entry[field as keyof LibraryEntry]) {
      errors.push(`필수 필드 누락: ${field}`);
    }
  }

  if (!id || !/^[a-z0-9-]+$/.test(id)) {
    errors.push('id는 소문자, 숫자, 하이픈만 허용');
  }

  if (entry.github && !entry.github.startsWith('https://github.com/')) {
    errors.push('github URL 형식이 올바르지 않음');
  }

  return errors;
}

// ============================================
// Context 앱 데이터 추가
// ============================================

function addContextEntryDirect(
  categoryId: string,
  entry: ContextEntry,
): { success: boolean; message: string } {
  const filePath = join(ROOT, `apps/context/src/data/entries/${categoryId}.json`);
  const dir = dirname(filePath);

  // 디렉토리 확인
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // categoryId 자동 설정
  entry.categoryId = categoryId;

  // 유효성 검사
  const errors = validateContextEntry(entry);
  if (errors.length > 0) {
    return { success: false, message: `유효성 오류:\n  - ${errors.join('\n  - ')}` };
  }

  // 기존 데이터 로드
  let entries: ContextEntry[] = [];
  if (existsSync(filePath)) {
    entries = JSON.parse(readFileSync(filePath, 'utf-8'));
  }

  // 중복 ID 검사
  if (entries.some((e) => e.id === entry.id)) {
    return { success: false, message: `중복 ID: ${entry.id}` };
  }

  // 추가 및 저장
  entries.push(entry);
  writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf-8');

  return {
    success: true,
    message: `✅ "${entry.korean}" (${entry.id}) 추가됨\n   파일: ${filePath}\n   pnpm --filter context load-entries 실행하여 반영`,
  };
}

async function addContextEntryInteractive(categoryId: string) {
  console.log(`\n📝 Adding new entry to context/${categoryId}\n`);

  const id = await question('ID (영문, 예: annyeong): ');
  const korean = await question('한국어 (예: 안녕): ');
  const romanization = await question('로마자 표기 (예: annyeong): ');
  const partOfSpeech = await question('품사 (noun/verb/adjective/expression): ');
  const difficulty = await question('난이도 (beginner/intermediate/advanced): ');
  const tagsStr = await question('태그 (쉼표로 구분, 예: casual,greeting): ');
  const koWord = await question('한국어 번역 단어: ');
  const koExplanation = await question('한국어 설명: ');
  const enWord = await question('영어 번역 (예: Hello): ');
  const enExplanation = await question('영어 설명: ');

  const newEntry: ContextEntry = {
    id,
    korean,
    romanization,
    partOfSpeech,
    categoryId,
    difficulty,
    tags: tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    translations: {
      ko: { word: koWord, explanation: koExplanation },
      en: { word: enWord, explanation: enExplanation },
    },
  };

  const result = addContextEntryDirect(categoryId, newEntry);
  console.log(`\n${result.message}\n`);
}

// ============================================
// Permissive 앱 데이터 추가
// ============================================

function addLibraryDirect(id: string, entry: LibraryEntry): { success: boolean; message: string } {
  const filePath = join(ROOT, 'apps/permissive/src/data/libraries.json');

  // 유효성 검사
  const errors = validateLibraryEntry(id, entry);
  if (errors.length > 0) {
    return { success: false, message: `유효성 오류:\n  - ${errors.join('\n  - ')}` };
  }

  // 기존 데이터 로드
  let libraries: Record<string, LibraryEntry> = {};
  if (existsSync(filePath)) {
    libraries = JSON.parse(readFileSync(filePath, 'utf-8'));
  }

  // 중복 ID 검사
  if (id in libraries) {
    return { success: false, message: `중복 ID: ${id}` };
  }

  // 추가 및 저장
  libraries[id] = entry;
  writeFileSync(filePath, JSON.stringify(libraries, null, 2), 'utf-8');

  return {
    success: true,
    message: `✅ "${entry.name}" (${id}) 추가됨\n   파일: ${filePath}`,
  };
}

async function addLibraryInteractive() {
  console.log('\n📦 Adding new library to permissive\n');

  const id = await question('ID (영문 소문자, 예: react): ');
  const name = await question('라이브러리 이름 (예: React): ');
  const description = await question('영문 설명: ');
  const descriptionKo = await question('한글 설명: ');
  const category = await question('카테고리 (Frameworks/Styling/Build/Testing): ');
  const license = await question('라이선스 (예: MIT): ');
  const github = await question('GitHub URL: ');
  const npm = await question('npm 패키지명 (없으면 엔터): ');
  const stars = await question('GitHub stars (예: 10k): ');
  const featuresStr = await question('영문 기능 (쉼표 구분): ');
  const featuresKoStr = await question('한글 기능 (쉼표 구분): ');
  const alternativesStr = await question('대안 라이브러리 (쉼표 구분): ');

  const newLibrary: LibraryEntry = {
    name,
    description,
    descriptionKo,
    category,
    license,
    github,
    stars,
  };

  if (npm) newLibrary.npm = npm;
  if (featuresStr)
    newLibrary.features = featuresStr
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);
  if (featuresKoStr)
    newLibrary.featuresKo = featuresKoStr
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);
  if (alternativesStr)
    newLibrary.alternatives = alternativesStr
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

  const result = addLibraryDirect(id, newLibrary);
  console.log(`\n${result.message}\n`);
}

// ============================================
// 메인
// ============================================

function printHelp(): void {
  console.log(`
📊 데이터 추가 CLI 도구

사용법:
  pnpm add-data <app> <type> [options]

옵션:
  --json '<json>'    JSON 문자열로 직접 데이터 전달 (Claude 권장)
  --file <path>      JSON 파일에서 데이터 읽기
  --help             도움말 표시

예시:
  # 대화형 모드
  pnpm add-data context greetings
  pnpm add-data permissive library

  # JSON 직접 입력 (Claude용)
  pnpm add-data context greetings --json '{
    "id": "gomapda",
    "korean": "고맙다",
    "romanization": "gomapda",
    "partOfSpeech": "verb",
    "difficulty": "beginner",
    "tags": ["gratitude", "casual"],
    "translations": {
      "ko": { "word": "고맙다", "explanation": "감사를 표현하는 반말" },
      "en": { "word": "Thanks", "explanation": "Casual way to express gratitude" }
    }
  }'

  pnpm add-data permissive library --json '{
    "id": "zustand",
    "name": "Zustand",
    "description": "Bear necessities for state management",
    "descriptionKo": "심플한 상태 관리 라이브러리",
    "category": "State Management",
    "license": "MIT",
    "github": "https://github.com/pmndrs/zustand",
    "npm": "zustand",
    "stars": "40k",
    "features": ["Minimal API", "No boilerplate"],
    "featuresKo": ["최소한의 API", "보일러플레이트 없음"]
  }'

지원하는 앱:
  - context: 한국어 단어 사전 (카테고리: greetings, emotions, daily-life, food, travel, work, culture, numbers, music, art, sports, space, physics, math)
  - permissive: 오픈소스 라이브러리 목록 (타입: library)
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // 도움말
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  if (args.length < 2) {
    printHelp();
    process.exit(0);
  }

  const [app, type] = args;

  // --json 또는 --file 옵션 파싱
  const jsonIdx = args.indexOf('--json');
  const fileIdx = args.indexOf('--file');

  let jsonData: ContextEntry | (LibraryEntry & { id?: string }) | null = null;

  if (jsonIdx !== -1 && args[jsonIdx + 1]) {
    try {
      jsonData = JSON.parse(args[jsonIdx + 1]);
    } catch (error: unknown) {
      console.error('❌ JSON 파싱 오류:', error);
      process.exit(1);
    }
  } else if (fileIdx !== -1 && args[fileIdx + 1]) {
    const filePath = args[fileIdx + 1];
    if (!existsSync(filePath)) {
      console.error(`❌ 파일을 찾을 수 없음: ${filePath}`);
      process.exit(1);
    }
    try {
      jsonData = JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch (error: unknown) {
      console.error('❌ 파일 JSON 파싱 오류:', error);
      process.exit(1);
    }
  }

  try {
    if (app === 'context') {
      if (jsonData) {
        // Non-interactive 모드
        const result = addContextEntryDirect(type, jsonData as ContextEntry);
        console.log(result.message);
        process.exit(result.success ? 0 : 1);
      } else {
        // Interactive 모드
        await addContextEntryInteractive(type);
      }
    } else if (app === 'permissive' && type === 'library') {
      if (jsonData) {
        // Non-interactive 모드
        const data = jsonData as LibraryEntry & { id?: string };
        const id = data.id || '';
        data.id = undefined;
        const result = addLibraryDirect(id, data as LibraryEntry);
        console.log(result.message);
        process.exit(result.success ? 0 : 1);
      } else {
        // Interactive 모드
        await addLibraryInteractive();
      }
    } else {
      console.error(`❌ Unknown app or type: ${app} ${type}`);
      printHelp();
      process.exit(1);
    }
  } finally {
    close();
  }
}

main().catch((error) => {
  console.error('Error:', error);
  close();
  process.exit(1);
});
