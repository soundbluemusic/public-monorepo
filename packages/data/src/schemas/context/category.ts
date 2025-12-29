/**
 * Context App - Category Schema
 *
 * 카테고리 및 대화 스키마 정의
 */
import { z } from 'zod';

// ============================================
// 다국어 텍스트
// ============================================

export const LocalizedTextSchema = z.object({
  ko: z.string().min(1),
  en: z.string().min(1),
});

// ============================================
// 카테고리
// ============================================

export const CategorySchema = z.object({
  id: z.string().min(1).max(100),
  name: LocalizedTextSchema,
  description: LocalizedTextSchema.optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

// ============================================
// 대화 라인
// ============================================

export const DialogueLineSchema = z.object({
  speaker: z.string().min(1),
  ko: z.string().min(1),
  en: z.string().min(1),
});

// ============================================
// 대화 (Conversation)
// ============================================

export const ConversationSchema = z.object({
  id: z.string().min(1).max(100),
  categoryId: z.string().min(1),
  title: LocalizedTextSchema,
  dialogue: z.array(DialogueLineSchema).min(1),
});

// ============================================
// 타입 추론
// ============================================

export type LocalizedText = z.infer<typeof LocalizedTextSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type DialogueLine = z.infer<typeof DialogueLineSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
