/**
 * @fileoverview Context App i18n
 *
 * createI18nProvider Factory를 사용하여 앱별 메시지 주입.
 * DRY 원칙: 공통 로직은 @soundblue/i18n/react에서 관리.
 */
import { createI18nProvider } from '@soundblue/i18n/react';

import enMessages from '../../project.inlang/messages/en.json';
import koMessages from '../../project.inlang/messages/ko.json';

// Re-export for backward compatibility
export type { Language } from '@soundblue/i18n';

/**
 * i18n 메시지 키 타입 (컴파일 타임 검증)
 */
export type MessageKey = keyof typeof enMessages;

/**
 * 모든 유효한 메시지 키 배열 (런타임 검증용)
 */
export const MESSAGE_KEYS = Object.keys(enMessages) as MessageKey[];

// Factory로 Provider와 훅 생성
const i18n = createI18nProvider<MessageKey>(
  {
    en: enMessages,
    ko: koMessages as Record<MessageKey, string>,
  },
  { enableEnglishFallback: true },
);

export const { I18nProvider, useI18n, useLocale, useT, useTDynamic, isMessageKey } = i18n;
