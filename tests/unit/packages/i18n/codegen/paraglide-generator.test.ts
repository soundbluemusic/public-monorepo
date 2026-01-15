/**
 * @fileoverview Unit tests for Paraglide Message Generator
 *
 * JSON 파일에서 Paraglide 호환 메시지 함수를 생성하는 코드 생성기를 테스트합니다.
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { generateParaglideMessages, type ParaglideConfig } from '@soundblue/i18n/codegen/paraglide-generator';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Paraglide Message Generator', () => {
  let tempDir: string;
  let messagesDir: string;
  let outputDir: string;

  beforeEach(() => {
    // 테스트용 임시 디렉토리 생성
    tempDir = join(tmpdir(), `paraglide-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    messagesDir = join(tempDir, 'messages');
    outputDir = join(tempDir, 'output');

    mkdirSync(messagesDir, { recursive: true });
    mkdirSync(outputDir, { recursive: true });
  });

  afterEach(() => {
    // 테스트 후 임시 디렉토리 정리
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  const createMessageFiles = (enMessages: Record<string, string>, koMessages: Record<string, string>) => {
    writeFileSync(join(messagesDir, 'en.json'), JSON.stringify(enMessages, null, 2));
    writeFileSync(join(messagesDir, 'ko.json'), JSON.stringify(koMessages, null, 2));
  };

  describe('generateParaglideMessages', () => {
    it('should generate message files from JSON', () => {
      createMessageFiles(
        { hello: 'Hello', world: 'World' },
        { hello: '안녕하세요', world: '세계' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      // Check output files exist
      expect(existsSync(join(outputDir, 'messages'))).toBe(true);
      expect(existsSync(join(outputDir, 'messages', '_index.js'))).toBe(true);
      expect(existsSync(join(outputDir, 'messages.js'))).toBe(true);
      expect(existsSync(join(outputDir, 'runtime.js'))).toBe(true);
    });

    it('should generate individual message files', () => {
      createMessageFiles(
        { greeting: 'Hello', farewell: 'Goodbye' },
        { greeting: '안녕', farewell: '안녕히 가세요' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      // Check individual message files
      expect(existsSync(join(outputDir, 'messages', 'greeting.js'))).toBe(true);
      expect(existsSync(join(outputDir, 'messages', 'farewell.js'))).toBe(true);
    });

    it('should include correct message content', () => {
      createMessageFiles(
        { test_message: 'Test English' },
        { test_message: 'Test Korean' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      const messageFile = readFileSync(join(outputDir, 'messages', 'test_message.js'), 'utf-8');

      expect(messageFile).toContain('Test English');
      expect(messageFile).toContain('Test Korean');
      expect(messageFile).toContain('getLocale');
    });

    it('should fallback to English when Korean translation is missing', () => {
      createMessageFiles(
        { only_english: 'Only in English' },
        {} // No Korean translation
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      const messageFile = readFileSync(join(outputDir, 'messages', 'only_english.js'), 'utf-8');

      // Korean should fallback to English
      expect(messageFile).toContain('Only in English');
      // Both en_ and ko_ functions should exist
      expect(messageFile).toContain('en_only_english');
      expect(messageFile).toContain('ko_only_english');
    });

    it('should skip $schema key', () => {
      createMessageFiles(
        { $schema: './schema.json', hello: 'Hello' },
        { $schema: './schema.json', hello: '안녕' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      // $schema should not create a file
      expect(existsSync(join(outputDir, 'messages', '$schema.js'))).toBe(false);
      // hello should create a file
      expect(existsSync(join(outputDir, 'messages', 'hello.js'))).toBe(true);
    });

    it('should apply keyTransformer if provided', () => {
      createMessageFiles(
        { 'my-key': 'My Value' },
        { 'my-key': '내 값' }
      );

      const config: ParaglideConfig = {
        messagesDir,
        outputDir,
        keyTransformer: (key) => key.replace(/-/g, '_'),
      };
      generateParaglideMessages(config);

      // Transformed key should be used for filename
      expect(existsSync(join(outputDir, 'messages', 'my_key.js'))).toBe(true);
    });

    it('should generate valid runtime.js', () => {
      createMessageFiles(
        { test: 'Test' },
        { test: '테스트' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      const runtimeFile = readFileSync(join(outputDir, 'runtime.js'), 'utf-8');

      expect(runtimeFile).toContain('getLocale');
      expect(runtimeFile).toContain('setLocale');
      expect(runtimeFile).toContain('onSetLocale');
      expect(runtimeFile).toContain("'ko'");
      expect(runtimeFile).toContain("'en'");
    });

    it('should generate valid messages.js', () => {
      createMessageFiles(
        { test: 'Test' },
        { test: '테스트' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      const messagesJs = readFileSync(join(outputDir, 'messages.js'), 'utf-8');

      expect(messagesJs).toContain("export * from './messages/_index.js'");
      expect(messagesJs).toContain("export * as m from './messages/_index.js'");
    });

    it('should generate _index.js with all exports', () => {
      createMessageFiles(
        { msg1: 'Message 1', msg2: 'Message 2', msg3: 'Message 3' },
        { msg1: '메시지 1', msg2: '메시지 2', msg3: '메시지 3' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      const indexJs = readFileSync(join(outputDir, 'messages', '_index.js'), 'utf-8');

      expect(indexJs).toContain("export * from './msg1.js'");
      expect(indexJs).toContain("export * from './msg2.js'");
      expect(indexJs).toContain("export * from './msg3.js'");
    });

    it('should escape backticks in message content', () => {
      createMessageFiles(
        { code_example: 'Use `const` for constants' },
        { code_example: '`const`를 사용하세요' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      const messageFile = readFileSync(join(outputDir, 'messages', 'code_example.js'), 'utf-8');

      // Backticks should be escaped
      expect(messageFile).toContain('\\`');
    });

    it('should handle empty message files', () => {
      createMessageFiles({}, {});

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      // Should still generate base files
      expect(existsSync(join(outputDir, 'runtime.js'))).toBe(true);
      expect(existsSync(join(outputDir, 'messages.js'))).toBe(true);
      expect(existsSync(join(outputDir, 'messages', '_index.js'))).toBe(true);
    });

    it('should handle messages with special characters', () => {
      createMessageFiles(
        { special: 'Hello & "World" <test>' },
        { special: '안녕 & "세계" <테스트>' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      const messageFile = readFileSync(join(outputDir, 'messages', 'special.js'), 'utf-8');

      expect(messageFile).toContain('Hello & "World" <test>');
      expect(messageFile).toContain('안녕 & "세계" <테스트>');
    });

    it('should log success message', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      createMessageFiles(
        { a: 'A', b: 'B', c: 'C' },
        { a: 'ㄱ', b: 'ㄴ', c: 'ㄷ' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      expect(consoleSpy).toHaveBeenCalledWith('✅ Generated 3 message functions');

      consoleSpy.mockRestore();
    });

    it('should create output directories if they do not exist', () => {
      const nestedOutputDir = join(outputDir, 'nested', 'deep', 'dir');

      createMessageFiles(
        { test: 'Test' },
        { test: '테스트' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir: nestedOutputDir };
      generateParaglideMessages(config);

      expect(existsSync(nestedOutputDir)).toBe(true);
      expect(existsSync(join(nestedOutputDir, 'messages'))).toBe(true);
    });
  });

  describe('Generated message functions', () => {
    it('should export message with original key name', () => {
      createMessageFiles(
        { 'my.key.name': 'Value' },
        { 'my.key.name': '값' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      const messageFile = readFileSync(join(outputDir, 'messages', 'my.key.name.js'), 'utf-8');

      // Should export with original key
      expect(messageFile).toContain('export { my.key.name as "my.key.name" }');
    });

    it('should generate locale-aware function', () => {
      createMessageFiles(
        { greeting: 'Hello' },
        { greeting: '안녕' }
      );

      const config: ParaglideConfig = { messagesDir, outputDir };
      generateParaglideMessages(config);

      const messageFile = readFileSync(join(outputDir, 'messages', 'greeting.js'), 'utf-8');

      // Should check locale and return appropriate translation
      expect(messageFile).toContain('if (locale === "en")');
      expect(messageFile).toContain('return en_greeting()');
      expect(messageFile).toContain('return ko_greeting()');
    });
  });
});
