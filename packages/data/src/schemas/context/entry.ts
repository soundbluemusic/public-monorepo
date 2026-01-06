/**
 * Context App - Entry Schema
 *
 * 한국어 사전 항목의 Zod 스키마 정의
 */
import { z } from 'zod';

// ============================================
// 기본 타입
// ============================================

export const PartOfSpeechSchema = z.enum([
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'particle',
  'interjection',
  'conjunction',
  'determiner',
  'numeral',
  'suffix',
  'prefix',
  'phrase',
  'expression',
]);

export const DifficultySchema = z.enum(['beginner', 'intermediate', 'advanced', 'master']);

export const FrequencySchema = z.enum(['common', 'uncommon', 'rare']);

// ============================================
// 발음 정보
// ============================================

export const PronunciationSchema = z.object({
  korean: z.string().min(1),
  ipa: z.string().optional(),
});

// ============================================
// 예문 (난이도별)
// ============================================

export const ExamplesSchema = z.object({
  beginner: z.string().min(1),
  intermediate: z.string().min(1),
  advanced: z.string().min(1),
  master: z.string().optional(),
});

// ============================================
// 대화예문 (어휘별)
// ============================================

export const DialogueLineSchema = z.object({
  speaker: z.enum(['A', 'B']),
  text: z.string().min(1),
  romanization: z.string().min(1),
  translation: z.string().min(1),
});

export const EntryDialogueSchema = z.object({
  context: z.string().min(1), // 대화 상황 설명 (예: "친구와 여행 계획을 세우며")
  dialogue: z.array(DialogueLineSchema).min(2).max(6),
});

// ============================================
// 변형 표현
// ============================================

export const VariationsSchema = z.object({
  formal: z.array(z.string()).optional(),
  casual: z.array(z.string()).optional(),
  short: z.array(z.string()).optional(),
});

// ============================================
// 번역 내용 (언어별)
// ============================================

export const TranslationContentSchema = z.object({
  word: z.string().min(1),
  explanation: z.string().min(1),
  examples: ExamplesSchema,
  dialogue: EntryDialogueSchema.optional(), // 어휘별 대화예문
  variations: VariationsSchema.optional(),
});

// ============================================
// 번역 (다국어)
// ============================================

export const TranslationsSchema = z.object({
  ko: TranslationContentSchema,
  en: TranslationContentSchema,
});

// ============================================
// Entry 메인 스키마
// ============================================

export const EntrySchema = z.object({
  id: z.string().min(1).max(100),
  korean: z.string().min(1),
  romanization: z.string().min(1),
  partOfSpeech: PartOfSpeechSchema,
  categoryId: z.string().min(1),
  difficulty: DifficultySchema,
  frequency: FrequencySchema,
  tags: z.array(z.string()),
  translations: TranslationsSchema,
  pronunciation: PronunciationSchema,
});

// ============================================
// 타입 추론
// ============================================

export type PartOfSpeech = z.infer<typeof PartOfSpeechSchema>;
export type Difficulty = z.infer<typeof DifficultySchema>;
export type Frequency = z.infer<typeof FrequencySchema>;
export type Pronunciation = z.infer<typeof PronunciationSchema>;
export type Examples = z.infer<typeof ExamplesSchema>;
export type DialogueLine = z.infer<typeof DialogueLineSchema>;
export type EntryDialogue = z.infer<typeof EntryDialogueSchema>;
export type Variations = z.infer<typeof VariationsSchema>;
export type TranslationContent = z.infer<typeof TranslationContentSchema>;
export type Translations = z.infer<typeof TranslationsSchema>;
export type Entry = z.infer<typeof EntrySchema>;
