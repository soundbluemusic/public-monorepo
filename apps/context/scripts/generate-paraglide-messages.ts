#!/usr/bin/env tsx
/**
 * Paraglide Message Generator for Context App
 */
import { join } from 'node:path';
import { generateParaglideMessages } from '@soundblue/i18n/codegen';

generateParaglideMessages({
  messagesDir: join(process.cwd(), 'project.inlang/messages'),
  outputDir: join(process.cwd(), 'app/paraglide'),
});
