/**
 * /api/offline-db API 라우트
 *
 * D1 데이터베이스 전체 덤프를 반환합니다.
 * TanStack Start 공식 API 라우트 패턴 사용.
 */
import { createFileRoute } from '@tanstack/react-router';

/**
 * D1 데이터베이스에 접근하는 헬퍼 함수
 */
function getD1Database(): D1Database | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { env } = require('cloudflare:workers') as { env: { DB?: D1Database } };
    return env.DB ?? null;
  } catch (error) {
    console.error('[API] Failed to access Cloudflare env:', error);
    return null;
  }
}

export const Route = createFileRoute('/api/offline-db')({
  server: {
    handlers: {
      GET: async () => {
        const db = getD1Database();

        if (!db) {
          return Response.json({ error: 'Database not available' }, { status: 503 });
        }

        try {
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
            db
              .prepare(`SELECT id, category_id, title_ko, title_en, dialogue FROM conversations`)
              .all(),
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

          return new Response(JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=3600',
              'X-Data-Version': String(data.version),
            },
          });
        } catch (error) {
          console.error('Failed to dump D1 database:', error);
          return Response.json(
            {
              error: 'Failed to export database',
              message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
