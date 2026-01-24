/**
 * @fileoverview Unit tests for common schemas
 */

// LocalizedTextSchema is re-exported from context and roots
// Using context's version for testing
import { LocalizedTextSchema } from '@soundblue/data/schemas/context';
import { describe, expect, it } from 'vitest';

describe('LocalizedTextSchema', () => {
  it('should validate valid localized text', () => {
    const validData = { ko: '안녕하세요', en: 'Hello' };
    const result = LocalizedTextSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty ko string', () => {
    const invalidData = { ko: '', en: 'Hello' };
    const result = LocalizedTextSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject empty en string', () => {
    const invalidData = { ko: '안녕하세요', en: '' };
    const result = LocalizedTextSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject missing ko field', () => {
    const invalidData = { en: 'Hello' };
    const result = LocalizedTextSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject missing en field', () => {
    const invalidData = { ko: '안녕하세요' };
    const result = LocalizedTextSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject non-string values', () => {
    const invalidData = { ko: 123, en: 'Hello' };
    const result = LocalizedTextSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
