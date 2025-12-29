/**
 * @soundblue/data - Schemas
 *
 * 모든 앱의 스키마 및 타입을 통합 export
 *
 * 충돌 방지를 위해 앱별 네임스페이스 사용 권장:
 * - import { EntrySchema } from '@soundblue/data/schemas/context'
 * - import { MathConceptSchema } from '@soundblue/data/schemas/roots'
 */

export type {
  Category,
  Conversation,
  DialogueLine,
  Difficulty,
  Entry,
  Examples,
  Frequency,
  LocalizedText as ContextLocalizedText,
  PartOfSpeech,
  Pronunciation,
  TranslationContent,
  Translations,
  Variations,
} from './context';
// Context App - 명시적 export
// Context의 LocalizedText를 ContextLocalizedText로 re-export
export {
  CategorySchema,
  ConversationSchema,
  DialogueLineSchema,
  DifficultySchema,
  EntrySchema,
  ExamplesSchema,
  FrequencySchema,
  LocalizedTextSchema as ContextLocalizedTextSchema,
  PartOfSpeechSchema,
  PronunciationSchema,
  TranslationContentSchema,
  TranslationsSchema,
  VariationsSchema,
} from './context';
export type { Library, WebAPI } from './permissive';
// Permissive App
export { LibrarySchema, WebAPISchema } from './permissive';
export type {
  Application,
  ChartData,
  ChartDataPoint,
  ChartDataset,
  ConceptContent,
  ConceptRelations,
  DifficultyLevel,
  Example as RootsExample,
  FamousTheorem,
  Formula,
  Language,
  LocalizedText as RootsLocalizedText,
  MathConcept,
  MathConstant,
  MathField,
  MathFieldInfo,
  MathSubfield,
  MathSymbol,
  SymbolCategory,
  Variable,
  Visualization,
} from './roots';
// Roots App - 명시적 export
// Roots의 LocalizedText와 Example은 별칭으로 export
export {
  ApplicationSchema,
  ChartDataPointSchema,
  ChartDataSchema,
  ChartDatasetSchema,
  ConceptContentSchema,
  ConceptRelationsSchema,
  DifficultyLevelSchema,
  ExampleSchema as RootsExampleSchema,
  FamousTheoremSchema,
  FormulaSchema,
  LanguageSchema,
  LocalizedTextSchema as RootsLocalizedTextSchema,
  MathConceptSchema,
  MathConstantSchema,
  MathFieldInfoSchema,
  MathFieldSchema,
  MathSubfieldSchema,
  MathSymbolSchema,
  SymbolCategorySchema,
  VariableSchema,
  VisualizationSchema,
} from './roots';
