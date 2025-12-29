/**
 * Permissive App - WebAPI Schema
 *
 * Web API 스키마 정의
 */
import { z } from 'zod';

// ============================================
// Web API 스키마
// ============================================

export const WebAPISchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  descriptionKo: z.string().min(1),
  category: z.string().min(1),
  support: z.string().min(1),
  mdnUrl: z.string().url(),
  trending: z.boolean().optional(),
  yearStable: z.number().int().min(1990).optional(),
});

// ============================================
// 타입 추론
// ============================================

export type WebAPI = z.infer<typeof WebAPISchema>;
