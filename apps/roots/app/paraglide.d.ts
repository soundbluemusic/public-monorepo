// Type declarations for generated Paraglide files
declare module '~/paraglide/messages.js' {
  /** Paraglide message function input type */
  type MessageInputs = Record<string, string | number>;

  /** Paraglide message function type */
  type MessageFunction = (inputs?: MessageInputs) => string;

  const messages: Record<string, MessageFunction>;
  export = messages;
}

declare module '~/paraglide/runtime.js' {
  export type Language = 'en' | 'ko';

  export function getLocale(): Language;
  export function setLocale(locale: Language, options?: { reload?: boolean }): void;

  export const baseLocale: Language;
  export const locales: readonly Language[];
}
