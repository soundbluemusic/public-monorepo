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
  DialogueLine as EntryDialogueLine,
  Difficulty,
  Entry,
  EntryDialogue,
  Examples,
  Frequency,
  PartOfSpeech,
  Pronunciation,
  TranslationContent,
  Translations,
  Variations,
} from './entry';
// Entry schemas
// Entry dialogue schemas (별도 이름으로 export - category.ts와 구분)
export {
  DialogueLineSchema as EntryDialogueLineSchema,
  DifficultySchema,
  EntryDialogueSchema,
  EntrySchema,
  ExamplesSchema,
  FrequencySchema,
  PartOfSpeechSchema,
  PronunciationSchema,
  TranslationContentSchema,
  TranslationsSchema,
  VariationsSchema,
} from './entry';
