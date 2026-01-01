/**
 * Common Schemas
 *
 * 여러 앱에서 공유되는 공통 스키마 정의
 * SSOT (Single Source of Truth) 원칙 적용
 */
import { z } from 'zod';

// ============================================
// 다국어 텍스트 (공통)
// ============================================

/**
 * LocalizedTextSchema - 한국어/영어 다국어 텍스트
 *
 * Context, Roots 앱 모두에서 사용되는 공통 스키마
 */
export const LocalizedTextSchema = z.object({
  ko: z.string().min(1),
  en: z.string().min(1),
});

export type LocalizedText = z.infer<typeof LocalizedTextSchema>;
