/**
 * Roots App - Field & Subfield Schema
 *
 * 수학 분야 및 소분류 스키마 정의
 */
import { z } from 'zod';
import { LocalizedTextSchema, MathFieldSchema } from './concept';

// ============================================
// 대분류 정보
// ============================================

export const MathFieldInfoSchema = z.object({
  id: MathFieldSchema,
  name: LocalizedTextSchema,
  description: LocalizedTextSchema,
  icon: z.string().min(1),
  color: z.string().min(1),
  order: z.number().int().min(0),
});

// ============================================
// 소분류 정보
// ============================================

export const MathSubfieldSchema = z.object({
  id: z.string().min(1),
  parentField: MathFieldSchema,
  name: LocalizedTextSchema,
  description: LocalizedTextSchema,
  order: z.number().int().min(0),
  icon: z.string().optional(),
});

// ============================================
// 수학 상수
// ============================================

export const MathConstantSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().min(1),
  name: LocalizedTextSchema,
  value: z.string().min(1),
  latex: z.string().min(1),
  description: LocalizedTextSchema,
  relatedConcepts: z.array(z.string()),
});

// ============================================
// 수학 기호
// ============================================

export const SymbolCategorySchema = z.enum([
  'operation',
  'set',
  'logic',
  'calculus',
  'greek',
  'relation',
]);

export const MathSymbolSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().min(1),
  category: SymbolCategorySchema,
  name: LocalizedTextSchema,
  latex: z.string().min(1),
  usage: z.string().min(1),
  relatedConcepts: z.array(z.string()),
});

// ============================================
// 유명 정리
// ============================================

export const FamousTheoremSchema = z.object({
  id: z.string().min(1),
  name: LocalizedTextSchema,
  statement: LocalizedTextSchema,
  latex: z.string().optional(),
  field: MathFieldSchema,
  prover: z.string().optional(),
  year: z.string().optional(),
  significance: z.string().min(1),
  relatedConcepts: z.array(z.string()),
});

// ============================================
// 타입 추론
// ============================================

export type MathFieldInfo = z.infer<typeof MathFieldInfoSchema>;
export type MathSubfield = z.infer<typeof MathSubfieldSchema>;
export type MathConstant = z.infer<typeof MathConstantSchema>;
export type SymbolCategory = z.infer<typeof SymbolCategorySchema>;
export type MathSymbol = z.infer<typeof MathSymbolSchema>;
export type FamousTheorem = z.infer<typeof FamousTheoremSchema>;
