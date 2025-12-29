/**
 * Permissive App - Library Schema
 *
 * 오픈소스 라이브러리 스키마 정의
 */
import { z } from 'zod';

// ============================================
// 라이브러리 스키마
// ============================================

export const LibrarySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  descriptionKo: z.string().min(1),
  category: z.string().min(1),
  license: z.string().min(1),
  github: z.string().url(),
  website: z.string().url().optional(),
  npm: z.string().optional(),
  stars: z.string().min(1),
  usedHere: z.boolean().optional(),
  trending: z.boolean().optional(),
  yearReleased: z.number().int().min(1990).optional(),
  tags: z.array(z.string()).optional(),
});

// ============================================
// 타입 추론
// ============================================

export type Library = z.infer<typeof LibrarySchema>;
