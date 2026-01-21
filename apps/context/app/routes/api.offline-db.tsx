/**
 * @fileoverview Offline Database Dump API
 *
 * Context 앱의 오프라인 기능을 위한 D1 데이터베이스 덤프 API입니다.
 * PWA 환경에서 오프라인 사용을 지원하기 위해 전체 데이터를 JSON으로 제공합니다.
 *
 * @module api/offline-db
 * @environment server-only (Cloudflare Workers)
 *
 * ## API Specification
 *
 * | 항목 | 값 |
 * |------|-----|
 * | **URL** | `GET /api/offline-db` |
 * | **Method** | `GET`, `HEAD` |
 * | **Auth** | 없음 (공개 API) |
 * | **Rate Limit** | Cloudflare 기본 (없음) |
 *
 * ## Request
 *
 * ```http
 * GET /api/offline-db HTTP/1.1
 * Host: context.soundbluemusic.com
 * Accept: application/json
 * Accept-Encoding: gzip
 * ```
 *
 * HEAD 요청은 버전 확인에 사용됩니다:
 *
 * ```http
 * HEAD /api/offline-db HTTP/1.1
 * Host: context.soundbluemusic.com
 * ```
 *
 * ## Response
 *
 * ### Success (200 OK)
 *
 * ```json
 * {
 *   "version": 1705555200000,
 *   "tables": {
 *     "entries": [
 *       {
 *         "id": "annyeong",
 *         "korean": "안녕",
 *         "romanization": "annyeong",
 *         "part_of_speech": "noun",
 *         "category_id": "greetings",
 *         "difficulty": "beginner",
 *         "frequency": "common",
 *         "tags": "[\"greeting\", \"informal\"]",
 *         "translations": "{\"en\": \"hello\", \"ko\": \"인사말\"}"
 *       }
 *     ],
 *     "categories": [
 *       {
 *         "id": "greetings",
 *         "name_ko": "인사",
 *         "name_en": "Greetings",
 *         "description_ko": "일상적인 인사 표현",
 *         "description_en": "Common greeting expressions",
 *         "icon": "👋",
 *         "color": "blue",
 *         "sort_order": 1
 *       }
 *     ],
 *     "conversations": [
 *       {
 *         "id": "greeting-01",
 *         "category_id": "greetings",
 *         "title_ko": "아침 인사",
 *         "title_en": "Morning Greeting",
 *         "dialogue": "[{\"speaker\":\"A\",\"text\":\"안녕하세요!\"}]"
 *       }
 *     ]
 *   },
 *   "meta": {
 *     "entriesCount": 16836,
 *     "categoriesCount": 52,
 *     "conversationsCount": 53
 *   }
 * }
 * ```
 *
 * ### Response Headers
 *
 * | Header | Value | Description |
 * |--------|-------|-------------|
 * | `Content-Type` | `application/json` | JSON 형식 |
 * | `Cache-Control` | `public, max-age=3600` | 1시간 캐시 |
 * | `X-Data-Version` | `1705555200000` | 데이터 버전 (타임스탬프) |
 * | `Content-Encoding` | `gzip` | Cloudflare 자동 압축 |
 *
 * ### Error Responses
 *
 * | Status | Error | Description |
 * |--------|-------|-------------|
 * | `503` | `Database not available` | D1 바인딩 누락 또는 연결 실패 |
 * | `500` | `Failed to export database` | 쿼리 실행 오류 |
 *
 * ```json
 * {
 *   "error": "Database not available"
 * }
 * ```
 *
 * ## Usage Example
 *
 * ### 클라이언트 측 (JavaScript)
 *
 * ```typescript
 * import { getOfflineSQLite } from '@soundblue/platform/sqlite';
 *
 * // 오프라인 DB 다운로드 (권장)
 * const sqlite = getOfflineSQLite();
 * await sqlite.download((progress) => {
 *   console.log(`${progress.phase}: ${progress.percent}%`);
 * });
 *
 * // 직접 fetch (저수준)
 * const response = await fetch('/api/offline-db');
 * const data = await response.json();
 * console.log(`Loaded ${data.meta.entriesCount} entries`);
 * ```
 *
 * ### 버전 확인 (HEAD 요청)
 *
 * ```typescript
 * const response = await fetch('/api/offline-db', { method: 'HEAD' });
 * const serverVersion = response.headers.get('X-Data-Version');
 * console.log(`Server version: ${serverVersion}`);
 * ```
 *
 * ## Related Files
 *
 * | File | Description |
 * |------|-------------|
 * | `packages/platform/src/sqlite/index.browser.ts` | 클라이언트 IndexedDB 어댑터 |
 * | `packages/platform/src/sqlite/types.ts` | TypeScript 타입 정의 |
 * | `apps/context/app/services/offline-db.ts` | 오프라인 서비스 래퍼 |
 * | `apps/context/wrangler.toml` | D1 바인딩 설정 |
 *
 * ## Performance Notes
 *
 * - **응답 크기**: 약 3-5MB (gzip 압축 시 ~800KB)
 * - **응답 시간**: ~200ms (D1 cold start 시 ~500ms)
 * - **캐싱**: Cloudflare CDN 1시간 캐시 + 브라우저 캐시
 * - **압축**: Cloudflare가 Accept-Encoding: gzip 헤더에 따라 자동 압축
 *
 * ## Security Considerations
 *
 * - 공개 데이터만 포함 (사용자 데이터 없음)
 * - 인증 불필요 (공개 API)
 * - CORS: 동일 출처만 허용 (기본)
 *
 * @see {@link https://developers.cloudflare.com/d1/} Cloudflare D1 Documentation
 * @see {@link https://dexie.org/} Dexie.js (클라이언트 IndexedDB 라이브러리)
 */

/**
 * Cloudflare Workers 환경 변수 인터페이스
 *
 * @interface CloudflareEnv
 * @property {D1Database} DB - Cloudflare D1 데이터베이스 바인딩
 */
interface CloudflareEnv {
  DB: D1Database;
}

/**
 * React Router loader 함수의 인자 타입
 *
 * @interface LoaderArgs
 * @property {object} context - Cloudflare Workers 컨텍스트
 * @property {object} [context.cloudflare] - Cloudflare 환경
 * @property {CloudflareEnv} [context.cloudflare.env] - 환경 변수 (D1 바인딩 포함)
 */
interface LoaderArgs {
  context: { cloudflare?: { env: CloudflareEnv } };
}

/**
 * D1 데이터베이스를 JSON으로 덤프하는 loader 함수
 *
 * Cloudflare D1의 모든 테이블 데이터를 JSON 형식으로 반환합니다.
 * 클라이언트는 이 데이터를 IndexedDB에 저장하여 오프라인에서 사용합니다.
 *
 * @async
 * @function loader
 * @param {LoaderArgs} args - loader 인자
 * @param {object} args.context - Cloudflare Workers 컨텍스트
 * @returns {Promise<Response>} JSON 응답 또는 에러 응답
 *
 * @example
 * // 이 함수는 React Router가 자동으로 호출합니다.
 * // GET /api/offline-db 요청 시 실행됩니다.
 *
 * @throws {Response} 503 - D1 바인딩이 없거나 연결 실패 시
 * @throws {Response} 500 - 데이터베이스 쿼리 오류 시
 */
export async function loader({ context }: LoaderArgs) {
  const env = context.cloudflare?.env;
  const db = env?.DB;

  if (!db) {
    return new Response(JSON.stringify({ error: 'Database not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 모든 테이블 데이터 조회 (명시적 컬럼 선택)
    const [entries, categories, conversations] = await Promise.all([
      db
        .prepare(
          `SELECT id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations
           FROM entries`,
        )
        .all(),
      db
        .prepare(
          `SELECT id, name_ko, name_en, description_ko, description_en, icon, color, sort_order
           FROM categories`,
        )
        .all(),
      db.prepare(`SELECT id, category_id, title_ko, title_en, dialogue FROM conversations`).all(),
    ]);

    const data = {
      version: Date.now(),
      tables: {
        entries: entries.results,
        categories: categories.results,
        conversations: conversations.results,
      },
      meta: {
        entriesCount: entries.results.length,
        categoriesCount: categories.results.length,
        conversationsCount: conversations.results.length,
      },
    };

    const jsonString = JSON.stringify(data);

    // gzip 압축은 Cloudflare가 자동으로 처리 (Accept-Encoding: gzip)
    return new Response(jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // 1시간 캐시
        'X-Data-Version': String(data.version),
      },
    });
  } catch (error) {
    console.error('Failed to dump D1 database:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to export database',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
