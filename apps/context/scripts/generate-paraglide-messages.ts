#!/usr/bin/env tsx

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MESSAGES_DIR = join(process.cwd(), 'project.inlang/messages');
const OUTPUT_DIR = join(process.cwd(), 'app/paraglide');
const MESSAGES_OUTPUT_DIR = join(OUTPUT_DIR, 'messages');

// Read message files
const enMessages = JSON.parse(readFileSync(join(MESSAGES_DIR, 'en.json'), 'utf-8'));
const koMessages = JSON.parse(readFileSync(join(MESSAGES_DIR, 'ko.json'), 'utf-8'));

// Create output directories
mkdirSync(OUTPUT_DIR, { recursive: true });
mkdirSync(MESSAGES_OUTPUT_DIR, { recursive: true });

// Generate message functions
const messageKeys = Object.keys(enMessages).filter((key) => key !== '$schema');
const messageExports: string[] = [];

for (const key of messageKeys) {
  const en = enMessages[key];
  const ko = koMessages[key];

  const functionName = key;
  const filename = `${key.toLowerCase()}.js`;

  const content = `/* eslint-disable */
import { getLocale } from '../runtime.js';
/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

const en_${functionName} = () => {
  return \`${en.replace(/`/g, '\\`')}\`;
};

const ko_${functionName} = () => {
  return \`${ko.replace(/`/g, '\\`')}\`;
};

/**
 * @param {{}} inputs
 * @param {{ locale?: "en" | "ko" }} options
 * @returns {LocalizedString}
 */
const ${functionName} = (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  if (locale === "en") return en_${functionName}();
  return ko_${functionName}();
};

export { ${functionName} as "${key}" };
`;

  writeFileSync(join(MESSAGES_OUTPUT_DIR, filename), content, 'utf-8');
  messageExports.push(`export * from './${filename}';`);
}

// Generate _index.js
const indexContent = `/* eslint-disable */
/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */
${messageExports.join('\n')}
`;

writeFileSync(join(MESSAGES_OUTPUT_DIR, '_index.js'), indexContent, 'utf-8');

// Generate messages.js
const messagesJsContent = `/* eslint-disable */
export * from './messages/_index.js';
// enabling auto-import by exposing all messages as m
export * as m from './messages/_index.js';
`;

writeFileSync(join(OUTPUT_DIR, 'messages.js'), messagesJsContent, 'utf-8');

// Generate runtime.js (minimal version)
const runtimeJsContent = `/* eslint-disable */

// Initialize locale from URL path (for SSR/SSG support)
function getInitialLocale() {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/ko/') || pathname === '/ko') {
      return 'ko';
    }
  }
  // For SSR/SSG, check if global __PARAGLIDE_INITIAL_LOCALE__ is set
  if (typeof globalThis !== 'undefined' && globalThis.__PARAGLIDE_INITIAL_LOCALE__) {
    return globalThis.__PARAGLIDE_INITIAL_LOCALE__;
  }
  return 'en';
}

let currentLocale = getInitialLocale();

export function getLocale() {
  return currentLocale;
}

export function setLocale(locale, options = {}) {
  currentLocale = locale;
  if (options.reload !== false && typeof window !== 'undefined') {
    window.location.reload();
  }
}

export function onSetLocale(callback) {
  // Stub for compatibility
}
`;

writeFileSync(join(OUTPUT_DIR, 'runtime.js'), runtimeJsContent, 'utf-8');

console.log(`✅ Generated ${messageKeys.length} message functions`);
