/**
 * D1 → SQLite 덤프 API
 *
 * 오프라인 모드를 위해 D1 데이터베이스 전체를 SQLite 형식으로 내보냅니다.
 * 클라이언트는 이 데이터를 OPFS에 저장하여 오프라인에서 사용합니다.
 */

interface CloudflareEnv {
  DB: D1Database;
}

interface LoaderArgs {
  context: { cloudflare?: { env: CloudflareEnv } };
}

/**
 * D1 데이터를 JSON으로 덤프
 * SQLite 파일 대신 JSON으로 반환하여 wa-sqlite에서 INSERT로 복원
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
    // 모든 테이블 데이터 조회
    const [entries, categories, conversations] = await Promise.all([
      db.prepare('SELECT * FROM entries').all(),
      db.prepare('SELECT * FROM categories').all(),
      db.prepare('SELECT * FROM conversations').all(),
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
