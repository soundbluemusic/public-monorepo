#!/usr/bin/env tsx
/**
 * 다국어 대응어 생성 + 자동검증 파이프라인 (하이브리드)
 *
 * Context 정체성("정확한 1:1, 번역기가 아님")을 지키기 위해, LLM이 생성한
 * 대응어를 역번역으로 교차검증하여 verified=true인 것만 통과시킨다.
 * 1:1이 애매하거나 검증 실패한 대응어는 저장하지 않으므로, 매핑 카드에는
 * 항상 검증된 대응어만 노출된다 (entry-converter가 verified=true만 추출).
 *
 * 사용법 (LLM 호출은 사용자의 API 환경에서 배치 실행):
 *   ANTHROPIC_API_KEY=sk-... pnpm --filter context exec \
 *     tsx scripts/generate-translations.ts --lang ja --category greetings [--limit 50] [--dry-run]
 *
 * 환경변수:
 *   ANTHROPIC_API_KEY   필수
 *   TRANSLATION_MODEL   모델 ID (기본 claude-sonnet-4-6)
 *
 * 흐름 (entry당, 빈도순 우선):
 *   1. 생성: 한국어+영어 → 1:1 대응어 후보 (1:1이 명확할 때만, 아니면 skip)
 *   2. 검증: 후보를 역번역하여 원본 한국어/영어 의미와 일치하는지 확인
 *   3. 일치할 때만 translations[lang]에 verified=true, source='llm-verified'로 저장
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.TRANSLATION_MODEL ?? 'claude-sonnet-4-6';
const API_URL = 'https://api.anthropic.com/v1/messages';

const LANG_NAMES: Record<string, string> = {
  ja: 'Japanese',
  es: 'Spanish',
  pt: 'Portuguese',
};

interface Candidate {
  ok: boolean;
  word?: string;
  reading?: string;
}

interface EntryTranslation {
  word: string;
  reading?: string;
  explanation: string;
  verified?: boolean;
  source?: string;
}

interface Entry {
  id: string;
  korean: string;
  frequency?: string;
  translations: Record<string, EntryTranslation>;
}

async function callLLM(system: string, user: string): Promise<string> {
  if (!API_KEY) throw new Error('ANTHROPIC_API_KEY 환경변수가 필요합니다.');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 256,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) {
    throw new Error(`LLM API ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { content: { text: string }[] };
  return data.content[0]?.text ?? '';
}

function parseJson<T>(text: string): T | null {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]) as T;
  } catch {
    return null;
  }
}

/** 1단계: 1:1 대응어 후보 생성 (1:1이 애매하면 ok:false) */
async function generateCandidate(
  lang: string,
  korean: string,
  english: string,
): Promise<Candidate | null> {
  const langName = LANG_NAMES[lang];
  const system =
    `You map Korean words to their EXACT 1:1 ${langName} equivalent for a ` +
    `dictionary of precise correspondences — NOT a translator. ` +
    `If there is no single clear 1:1 equivalent (the distinction does not exist ` +
    `in ${langName}, or it is ambiguous or needs a phrase), return {"ok":false}. ` +
    `Otherwise return {"ok":true,"word":"...","reading":"..."} where reading is ` +
    `kana for Japanese and omitted for Spanish/Portuguese. JSON only.`;
  const user = `Korean: ${korean}\nEnglish: ${english}\n${langName} 1:1 equivalent?`;
  const r = parseJson<Candidate>(await callLLM(system, user));
  if (!r || !r.ok || !r.word) return null;
  return r;
}

/** 2단계: 역번역 교차검증 (대응어가 원본 한국어/영어 의미와 일치?) */
async function backTranslateCheck(
  lang: string,
  word: string,
  korean: string,
  english: string,
): Promise<boolean> {
  const langName = LANG_NAMES[lang];
  const system =
    `You verify a 1:1 mapping. Given a ${langName} word, decide whether it means ` +
    `exactly the same as the Korean word (with the English gloss for context). ` +
    `Return {"match":true} or {"match":false}. JSON only.`;
  const user = `${langName}: ${word}\nKorean: ${korean}\nEnglish: ${english}\nSame meaning?`;
  const r = parseJson<{ match: boolean }>(await callLLM(system, user));
  return r?.match === true;
}

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const lang = arg('--lang');
  const category = arg('--category');
  const limit = Number(arg('--limit') ?? '0');
  const dryRun = process.argv.includes('--dry-run');

  if (!lang || !LANG_NAMES[lang]) {
    console.error('--lang ja|es|pt 가 필요합니다.');
    process.exit(1);
  }
  if (!category) {
    console.error('--category <name> 가 필요합니다.');
    process.exit(1);
  }

  const path = join('data/context/entries', `${category}.json`);
  if (!existsSync(path)) {
    console.error(`파일 없음: ${path}`);
    process.exit(1);
  }

  const entries = JSON.parse(readFileSync(path, 'utf8')) as Entry[];
  // 빈도순 우선 (common 먼저)
  const order = (e: Entry) => (e.frequency === 'common' ? 0 : 1);
  const sorted = [...entries].sort((a, b) => order(a) - order(b));

  let processed = 0;
  let verified = 0;
  let skipped = 0;

  for (const e of sorted) {
    if (limit && processed >= limit) break;
    if (e.translations[lang]?.verified) continue;
    const english = e.translations.en?.word;
    if (!english) continue;
    processed++;

    try {
      const cand = await generateCandidate(lang, e.korean, english);
      if (!cand?.word) {
        skipped++;
        console.log(`  skip (no clear 1:1): ${e.korean}`);
        continue;
      }
      const ok = await backTranslateCheck(lang, cand.word, e.korean, english);
      if (!ok) {
        skipped++;
        console.log(`  skip (failed verify): ${e.korean} -> ${cand.word}`);
        continue;
      }
      e.translations[lang] = {
        word: cand.word,
        ...(cand.reading ? { reading: cand.reading } : {}),
        explanation: `「${e.korean}」= ${cand.word}`,
        verified: true,
        source: 'llm-verified',
      };
      verified++;
      console.log(`  ✓ ${e.korean} -> ${cand.word}${cand.reading ? ` (${cand.reading})` : ''}`);
    } catch (err) {
      console.error(`  error: ${e.korean}:`, err instanceof Error ? err.message : err);
    }
  }

  if (!dryRun) {
    writeFileSync(path, `${JSON.stringify(entries, null, 2)}\n`);
  }
  console.log(
    `\n[${category}/${lang}] processed=${processed} verified=${verified} skipped=${skipped}${
      dryRun ? ' (dry-run, 미저장)' : ''
    }`,
  );
}

main();
