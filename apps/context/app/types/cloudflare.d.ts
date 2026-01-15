/**
 * Cloudflare 환경 타입 정의
 *
 * wrangler.toml의 바인딩과 매핑됩니다.
 */

declare global {
  interface CloudflareEnv {
    /** D1 데이터베이스 바인딩 */
    DB: D1Database;
    /** R2 버킷 바인딩 (레거시, SSR에서는 사용 안 함) */
    BUCKET?: R2Bucket;
  }
}

export {};
