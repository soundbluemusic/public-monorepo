/**
 * @fileoverview JSON 기반 데이터 로더 유틸리티
 *
 * 앱들이 JSON 파일에서 데이터를 쉽게 로드하고 타입 검증할 수 있게 합니다.
 * 빌드 타임에 사용되며, 런타임에는 이미 로드된 데이터를 사용합니다.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * 디렉토리 내 모든 JSON 파일을 로드하여 배열로 반환
 *
 * @example
 * ```ts
 * // apps/context/src/data/entries/*.json 로드
 * const entries = loadJsonDirectory<MeaningEntry>('./src/data/entries');
 * ```
 */
export function loadJsonDirectory<T>(dirPath: string): T[] {
  if (!existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return [];
  }

  const files = readdirSync(dirPath).filter((f) => f.endsWith('.json'));
  const items: T[] = [];

  for (const file of files) {
    const filePath = join(dirPath, file);
    try {
      const content = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      // 배열인 경우 펼쳐서 추가
      if (Array.isArray(data)) {
        items.push(...data);
      } else {
        items.push(data);
      }
    } catch (error) {
      console.error(`Failed to load ${filePath}:`, error);
    }
  }

  return items;
}

/**
 * 단일 JSON 파일 로드
 *
 * @example
 * ```ts
 * const categories = loadJsonFile<Category[]>('./src/data/categories.json');
 * ```
 */
export function loadJsonFile<T>(filePath: string): T | null {
  if (!existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error);
    return null;
  }
}

/**
 * JSON 파일들을 ID 기준 Map으로 로드
 *
 * @example
 * ```ts
 * const entriesMap = loadJsonAsMap<MeaningEntry>('./src/data/entries', 'id');
 * const entry = entriesMap.get('annyeong');
 * ```
 */
export function loadJsonAsMap<T extends Record<string, unknown>>(
  dirPath: string,
  keyField: keyof T,
): Map<string, T> {
  const items = loadJsonDirectory<T>(dirPath);
  return new Map(items.map((item) => [String(item[keyField]), item]));
}

/**
 * JSON 파일들을 특정 필드 기준으로 그룹화
 *
 * @example
 * ```ts
 * const entriesByCategory = groupJsonBy<MeaningEntry>('./src/data/entries', 'categoryId');
 * const greetings = entriesByCategory.get('greetings');
 * ```
 */
export function groupJsonBy<T extends Record<string, unknown>>(
  dirPath: string,
  groupField: keyof T,
): Map<string, T[]> {
  const items = loadJsonDirectory<T>(dirPath);
  const grouped = new Map<string, T[]>();

  for (const item of items) {
    const key = String(item[groupField]);
    const existing = grouped.get(key) ?? [];
    existing.push(item);
    grouped.set(key, existing);
  }

  return grouped;
}

/**
 * 데이터 유효성 검사 헬퍼
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * 필수 필드 검사
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  item: T,
  requiredFields: (keyof T)[],
  itemId?: string,
): ValidationResult {
  const errors: string[] = [];
  const prefix = itemId ? `[${itemId}] ` : '';

  for (const field of requiredFields) {
    if (item[field] === undefined || item[field] === null) {
      errors.push(`${prefix}Missing required field: ${String(field)}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 중복 ID 검사
 */
export function checkDuplicateIds<T extends { id: string }>(items: T[]): ValidationResult {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const item of items) {
    if (seen.has(item.id)) {
      duplicates.push(item.id);
    }
    seen.add(item.id);
  }

  return {
    valid: duplicates.length === 0,
    errors: duplicates.map((id) => `Duplicate ID found: ${id}`),
  };
}
