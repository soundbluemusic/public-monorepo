/**
 * JSON File Loaders
 *
 * Node.js 환경에서 JSON 파일을 로드하는 유틸리티 모음입니다.
 * SSG(Static Site Generation) 빌드 시점에 데이터를 로드하는 데 사용됩니다.
 *
 * @module @soundblue/data/loaders
 * @environment build-only - Node.js 빌드 시점에만 실행됩니다. 클라이언트 번들에 포함되지 않습니다.
 *
 * @remarks
 * 이 모듈의 모든 함수는 동기(synchronous)로 파일을 읽습니다.
 * SSG 빌드 시점에서 사용되므로 동기 I/O가 성능에 영향을 주지 않습니다.
 *
 * @example 기본 사용법
 * ```ts
 * // 단일 JSON 파일 로드
 * import { loadJson } from '@soundblue/data/loaders';
 * const config = loadJson<AppConfig>('./config.json');
 *
 * // 디렉토리 전체 로드
 * import { loadJsonDirectory } from '@soundblue/data/loaders';
 * const allEntries = loadJsonDirectory<Entry>('./data/entries');
 * ```
 *
 * @example SSG prerender에서 사용
 * ```ts
 * // react-router.config.ts
 * import { loadJsonDirectoryFlat } from '@soundblue/data/loaders';
 *
 * export default {
 *   ssr: false,
 *   async prerender() {
 *     const entries = loadJsonDirectoryFlat<Entry>('./data/entries');
 *     return entries.map(e => `/entry/${e.id}`);
 *   },
 * };
 * ```
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

/**
 * 단일 JSON 파일을 로드하여 파싱합니다.
 *
 * @typeParam T - 반환될 데이터의 타입. JSON 구조와 일치해야 합니다.
 *
 * @param filePath - 로드할 JSON 파일의 절대 또는 상대 경로.
 *   상대 경로는 프로세스 실행 위치(cwd) 기준입니다.
 *
 * @returns 파싱된 JSON 데이터를 타입 T로 반환합니다.
 *   타입 안전성은 런타임에 검증되지 않으므로, 필요시 Zod 스키마로 추가 검증하세요.
 *
 * @throws {Error} 파일이 존재하지 않을 때 "File not found: {path}" 메시지와 함께 발생
 * @throws {SyntaxError} JSON 파싱 실패 시 발생 (잘못된 JSON 형식)
 *
 * @example 기본 사용법
 * ```ts
 * interface AppConfig {
 *   version: string;
 *   features: string[];
 * }
 *
 * const config = loadJson<AppConfig>('./config.json');
 * console.log(config.version); // 타입 안전
 * ```
 *
 * @example Zod 스키마와 함께 사용 (권장)
 * ```ts
 * import { z } from 'zod';
 *
 * const ConfigSchema = z.object({
 *   version: z.string(),
 *   features: z.array(z.string()),
 * });
 *
 * const rawConfig = loadJson<unknown>('./config.json');
 * const config = ConfigSchema.parse(rawConfig); // 런타임 검증
 * ```
 *
 * @example 에러 처리
 * ```ts
 * try {
 *   const data = loadJson<MyType>('./missing.json');
 * } catch (error) {
 *   if (error instanceof Error && error.message.includes('File not found')) {
 *     console.error('설정 파일이 없습니다. 기본값을 사용합니다.');
 *   }
 * }
 * ```
 *
 * @see {@link loadJsonDirectory} 디렉토리 내 여러 파일을 로드할 때
 * @see {@link loadJsonAsMap} ID 기반 Map으로 로드할 때
 */
export function loadJson<T>(filePath: string): T {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

/**
 * 디렉토리 내 모든 JSON 파일을 로드합니다.
 *
 * 디렉토리를 스캔하여 `.json` 확장자를 가진 모든 파일을 로드하고,
 * 파일명(확장자 제외)과 데이터를 쌍으로 반환합니다.
 *
 * @typeParam T - 각 JSON 파일의 데이터 타입. 모든 파일이 동일한 구조를 가져야 합니다.
 *
 * @param dirPath - 스캔할 디렉토리의 절대 또는 상대 경로.
 *   하위 디렉토리는 스캔하지 않습니다 (shallow scan).
 *
 * @returns 파일명과 데이터 쌍의 배열. 파일 시스템 정렬 순서로 반환됩니다.
 *   - `name`: 파일명 (확장자 제외, e.g., "greetings" from "greetings.json")
 *   - `data`: 파싱된 JSON 데이터
 *
 * @throws {Error} 디렉토리가 존재하지 않을 때 "Directory not found: {path}" 메시지와 함께 발생
 * @throws {SyntaxError} 디렉토리 내 JSON 파일 중 하나라도 파싱 실패 시 발생
 *
 * @example 카테고리별 데이터 로드
 * ```ts
 * // data/entries/
 * // ├── greetings.json  → [{ id: "hello", ... }, { id: "bye", ... }]
 * // ├── food.json       → [{ id: "rice", ... }]
 * // └── weather.json    → [{ id: "sunny", ... }]
 *
 * interface Entry { id: string; word: string; }
 *
 * const categories = loadJsonDirectory<Entry[]>('./data/entries');
 * // → [
 * //     { name: 'food', data: [{ id: 'rice', ... }] },
 * //     { name: 'greetings', data: [{ id: 'hello', ... }, { id: 'bye', ... }] },
 * //     { name: 'weather', data: [{ id: 'sunny', ... }] },
 * //   ]
 *
 * // 카테고리별 처리
 * for (const { name, data } of categories) {
 *   console.log(`${name}: ${data.length} entries`);
 * }
 * ```
 *
 * @example 특정 카테고리 찾기
 * ```ts
 * const categories = loadJsonDirectory<Entry[]>('./data/entries');
 * const greetings = categories.find(c => c.name === 'greetings');
 * ```
 *
 * @remarks
 * - 숨김 파일 (`.`로 시작하는 파일)도 `.json`으로 끝나면 포함됩니다.
 * - 빈 디렉토리의 경우 빈 배열 `[]`을 반환합니다.
 * - 하위 디렉토리는 스캔하지 않습니다. 재귀 스캔이 필요하면 별도 구현이 필요합니다.
 *
 * @see {@link loadJsonDirectoryFlat} 모든 파일을 하나의 배열로 병합할 때
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
 * 디렉토리 내 모든 JSON 파일의 배열을 하나로 병합합니다.
 *
 * 각 JSON 파일이 배열을 포함하고 있을 때, 모든 배열을 하나로 flat하게 합칩니다.
 * 카테고리별로 분리된 데이터를 전체 목록으로 만들 때 유용합니다.
 *
 * @typeParam T - 배열 내 개별 아이템의 타입.
 *   각 JSON 파일은 `T[]` 형태여야 합니다.
 *
 * @param dirPath - 스캔할 디렉토리 경로.
 *
 * @returns 모든 JSON 파일의 배열을 병합한 단일 배열.
 *   파일 순서는 파일 시스템 정렬 순서를 따르며, 각 파일 내 순서는 유지됩니다.
 *
 * @throws {Error} 디렉토리가 존재하지 않을 때
 * @throws {SyntaxError} JSON 파싱 실패 시
 * @throws {TypeError} JSON 파일 내용이 배열이 아닐 때 (flatMap 실패)
 *
 * @example 모든 엔트리를 단일 배열로
 * ```ts
 * // data/entries/
 * // ├── greetings.json  → [{ id: "hello" }, { id: "bye" }]
 * // ├── food.json       → [{ id: "rice" }]
 *
 * interface Entry { id: string; }
 *
 * const allEntries = loadJsonDirectoryFlat<Entry>('./data/entries');
 * // → [{ id: "rice" }, { id: "hello" }, { id: "bye" }]
 *
 * console.log(`Total: ${allEntries.length} entries`);
 * ```
 *
 * @example SSG prerender 경로 생성
 * ```ts
 * // react-router.config.ts
 * export default {
 *   ssr: false,
 *   async prerender() {
 *     const entries = loadJsonDirectoryFlat<Entry>('./data/entries');
 *
 *     // generateI18nRoutes로 영어/한국어 경로 생성
 *     return generateI18nRoutes(entries, (e) => `/entry/${e.id}`);
 *     // → ['/entry/hello', '/ko/entry/hello', '/entry/rice', '/ko/entry/rice', ...]
 *   },
 * };
 * ```
 *
 * @remarks
 * 내부적으로 {@link loadJsonDirectory}를 사용하므로, 동일한 제약사항이 적용됩니다.
 * 각 JSON 파일은 반드시 배열 `[]` 형태여야 합니다. 객체 `{}`면 TypeError가 발생합니다.
 *
 * @see {@link loadJsonDirectory} 카테고리 정보를 유지하면서 로드할 때
 */
export function loadJsonDirectoryFlat<T>(dirPath: string): T[] {
  const files = loadJsonDirectory<T[]>(dirPath);
  return files.flatMap((f) => f.data);
}

/**
 * JSON 파일을 ID 기반 Map으로 로드합니다.
 *
 * 배열 형태의 JSON 데이터를 `id` 필드 기준으로 Map에 저장합니다.
 * O(1) 시간 복잡도로 ID 기반 조회가 필요할 때 사용합니다.
 *
 * @typeParam T - 배열 내 개별 아이템의 타입. 반드시 `id: string` 필드를 포함해야 합니다.
 *
 * @param filePath - 로드할 JSON 파일 경로. 파일 내용은 `T[]` 배열 형태여야 합니다.
 *
 * @returns ID를 키로, 아이템을 값으로 가지는 Map.
 *   동일한 ID가 여러 개 있으면 마지막 아이템이 유지됩니다.
 *
 * @throws {Error} 파일이 존재하지 않을 때
 * @throws {SyntaxError} JSON 파싱 실패 시
 *
 * @example 기본 사용법
 * ```ts
 * // libraries.json
 * // [{ "id": "react", "name": "React" }, { "id": "vue", "name": "Vue" }]
 *
 * interface Library { id: string; name: string; }
 *
 * const libraryMap = loadJsonAsMap<Library>('./libraries.json');
 *
 * // O(1) 조회
 * const react = libraryMap.get('react');
 * // → { id: 'react', name: 'React' }
 *
 * // 존재 여부 확인
 * if (libraryMap.has('angular')) { ... }
 *
 * // 전체 순회
 * for (const [id, library] of libraryMap) {
 *   console.log(`${id}: ${library.name}`);
 * }
 * ```
 *
 * @example loader에서 ID 기반 조회
 * ```ts
 * // routes/library.$libraryId.tsx
 * const libraryMap = loadJsonAsMap<Library>('./data/libraries.json');
 *
 * export async function loader({ params }: Route.LoaderArgs) {
 *   const library = libraryMap.get(params.libraryId);
 *   if (!library) {
 *     throw new Response('Not Found', { status: 404 });
 *   }
 *   return { library };
 * }
 * ```
 *
 * @remarks
 * - 중복 ID가 있으면 경고 없이 마지막 값으로 덮어씁니다.
 * - ID 필드가 없는 아이템이 있으면 `undefined` 키로 Map에 저장됩니다.
 * - 대규모 데이터셋에서 반복 조회 시 배열 `find()`보다 훨씬 효율적입니다.
 *
 * @see {@link loadJson} Map 변환 없이 원본 배열로 로드할 때
 */
export function loadJsonAsMap<T extends { id: string }>(filePath: string): Map<string, T> {
  const data = loadJson<T[]>(filePath);
  return new Map(data.map((item) => [item.id, item]));
}
