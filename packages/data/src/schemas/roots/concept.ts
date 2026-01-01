/**
 * Roots App - Concept Schema
 *
 * 수학 개념 문서의 Zod 스키마 정의
 */
import { z } from 'zod';
import { LocalizedTextSchema } from '../common';

export type { LocalizedText } from '../common';
// Re-export for backward compatibility
export { LocalizedTextSchema } from '../common';

// ============================================
// 기본 타입
// ============================================

export const LanguageSchema = z.enum(['ko', 'en']);

/**
 * 난이도 레벨 (1-5)
 * 1: 초등 (Elementary)
 * 2: 중등 (Middle School)
 * 3: 고등 (High School)
 * 4: 대학 (Undergraduate)
 * 5: 대학원+ (Graduate+)
 */
export const DifficultyLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

// ============================================
// 수학 분야 (18개 대분류 + 확장)
// ============================================

export const MathFieldSchema = z.enum([
  // 기본 18개
  'foundations',
  'algebra',
  'geometry',
  'trigonometry',
  'analysis',
  'linear-algebra',
  'probability',
  'discrete',
  'number-theory',
  'topology',
  'logic',
  'dynamics',
  'optimization',
  'numerical',
  'applied',
  'constants',
  'symbols',
  'theorems',
  // 확장 분야
  'abstract-algebra',
  'algebraic-geometry',
  'algebraic-topology',
  'calculus-of-variations',
  'category-theory',
  'combinatorics',
  'complex-analysis',
  'cryptography',
  'differential-geometry',
  'discrete-mathematics',
  'functional-analysis',
  'game-theory',
  'graph-theory',
  'harmonic-analysis',
  'homological-algebra',
  'information-theory',
  'lie-theory',
  'measure-theory',
  'numerical-analysis',
  'operations-research',
  'partial-differential-equations',
  'representation-theory',
  'set-theory',
  'statistics',
  'stochastic-processes',
  // 응용 분야
  'applied-cs',
  'applied-engineering',
  'applied-finance',
  'applied-music',
  'applied-physics',
]);

// ============================================
// 변수 설명
// ============================================

export const VariableSchema = z.object({
  symbol: z.string().min(1),
  meaning: z.string().min(1),
});

// ============================================
// 수학 공식
// ============================================

export const FormulaSchema = z.object({
  latex: z.string().min(1),
  description: z.string().min(1),
  variables: z.array(VariableSchema).optional(),
});

// ============================================
// 예제
// ============================================

export const ExampleSchema = z.object({
  problem: z.string().min(1),
  solution: z.string().min(1),
  latex: z.string().optional(),
  difficulty: DifficultyLevelSchema.optional(),
});

// ============================================
// 시각화
// ============================================

export const ChartDataPointSchema = z.object({
  x: z.number(),
  y: z.number(),
  label: z.string().optional(),
});

export const ChartDatasetSchema = z.object({
  label: z.string(),
  data: z.union([z.array(ChartDataPointSchema), z.array(z.number())]),
  borderColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  fill: z.boolean().optional(),
});

export const ChartDataSchema = z.object({
  labels: z.array(z.string()).optional(),
  datasets: z.array(ChartDatasetSchema),
});

export const VisualizationSchema = z.object({
  type: z.enum(['graph', 'diagram', 'animation', 'interactive']),
  description: z.string().min(1),
  data: ChartDataSchema.optional(),
  externalUrl: z.string().url().optional(),
});

// ============================================
// 응용 분야
// ============================================

export const ApplicationSchema = z.object({
  field: z.string().min(1),
  description: z.string().min(1),
  conceptLink: z.string().optional(),
});

// ============================================
// 개념 내용 상세
// ============================================

export const ConceptContentSchema = z.object({
  definition: z.string().min(1),
  formulas: z.array(z.union([z.string(), FormulaSchema])).optional(),
  examples: z.array(z.union([z.string(), ExampleSchema])),
  visualizations: z.array(VisualizationSchema).optional(),
  history: z
    .object({
      discoveredBy: z.string().optional(),
      year: z.string().optional(),
      background: z.string().optional(),
    })
    .optional(),
  applications: z.array(z.union([z.string(), ApplicationSchema])).optional(),
});

// ============================================
// 연관 관계
// ============================================

export const ConceptRelationsSchema = z.object({
  prerequisites: z.array(z.string()),
  nextTopics: z.array(z.string()),
  related: z.array(z.string()),
  applications: z.array(z.string()).optional(),
});

// ============================================
// 수학 개념 (메인 스키마)
// ============================================

export const MathConceptSchema = z.object({
  id: z.string().min(1).max(100),
  name: LocalizedTextSchema,
  field: MathFieldSchema,
  subfield: z.string().min(1),
  difficulty: DifficultyLevelSchema,
  content: z.object({
    ko: z.union([z.string(), ConceptContentSchema]),
    en: z.union([z.string(), ConceptContentSchema]),
  }),
  latex: z.string().optional(),
  relations: ConceptRelationsSchema,
  tags: z.array(z.string()),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// ============================================
// 타입 추론
// ============================================

export type Language = z.infer<typeof LanguageSchema>;
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>;
export type MathField = z.infer<typeof MathFieldSchema>;
export type Variable = z.infer<typeof VariableSchema>;
export type Formula = z.infer<typeof FormulaSchema>;
export type Example = z.infer<typeof ExampleSchema>;
export type ChartDataPoint = z.infer<typeof ChartDataPointSchema>;
export type ChartDataset = z.infer<typeof ChartDatasetSchema>;
export type ChartData = z.infer<typeof ChartDataSchema>;
export type Visualization = z.infer<typeof VisualizationSchema>;
export type Application = z.infer<typeof ApplicationSchema>;
export type ConceptContent = z.infer<typeof ConceptContentSchema>;
export type ConceptRelations = z.infer<typeof ConceptRelationsSchema>;
export type MathConcept = z.infer<typeof MathConceptSchema>;
