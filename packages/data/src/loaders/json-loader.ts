/**
 * JSON 파일 로더
 *
 * Node.js 환경에서 JSON 파일을 로드하는 유틸리티
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

/**
 * 단일 JSON 파일 로드
 */
export function loadJson<T>(filePath: string): T {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

/**
 * 디렉토리 내 모든 JSON 파일 로드
 */
export function loadJsonDirectory<T>(dirPath: string): { name: string; data: T }[] {
  if (!existsSync(dirPath)) {
    throw new Error(`Directory not found: ${dirPath}`);
  }

  const files = readdirSync(dirPath).filter((f) => f.endsWith('.json'));

  return files.map((file) => ({
    name: basename(file, '.json'),
    data: loadJson<T>(join(dirPath, file)),
  }));
}

/**
 * 디렉토리 내 모든 JSON 파일을 배열로 병합
 */
export function loadJsonDirectoryFlat<T>(dirPath: string): T[] {
  const files = loadJsonDirectory<T[]>(dirPath);
  return files.flatMap((f) => f.data);
}

/**
 * JSON 파일을 Map으로 로드 (id 기준)
 */
export function loadJsonAsMap<T extends { id: string }>(filePath: string): Map<string, T> {
  const data = loadJson<T[]>(filePath);
  return new Map(data.map((item) => [item.id, item]));
}
