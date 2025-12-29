/**
 * Context App Schemas
 *
 * 한국어 사전 앱의 모든 스키마 및 타입 export
 */

export type {
  Category,
  Conversation,
  DialogueLine,
  LocalizedText,
} from './category';
// Category & Conversation schemas
export {
  CategorySchema,
  ConversationSchema,
  DialogueLineSchema,
  LocalizedTextSchema,
} from './category';
export type {
  Difficulty,
  Entry,
  Examples,
  Frequency,
  PartOfSpeech,
  Pronunciation,
  TranslationContent,
  Translations,
  Variations,
} from './entry';
// Entry schemas
export {
  DifficultySchema,
  EntrySchema,
  ExamplesSchema,
  FrequencySchema,
  PartOfSpeechSchema,
  PronunciationSchema,
  TranslationContentSchema,
  TranslationsSchema,
  VariationsSchema,
} from './entry';
