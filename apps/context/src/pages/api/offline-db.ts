import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const db = env.DB;

  try {
    const [entriesResult, conversationsResult] = await Promise.all([
      db
        .prepare(
          'SELECT id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations FROM entries',
        )
        .all<{
          id: string;
          korean: string;
          romanization: string;
          part_of_speech: string;
          category_id: string;
          difficulty: string;
          frequency: string | null;
          tags: string;
          translations: string;
        }>(),
      db.prepare('SELECT id, category_id, title_ko, title_en, dialogue FROM conversations').all<{
        id: string;
        category_id: string;
        title_ko: string;
        title_en: string;
        dialogue: string;
      }>(),
    ]);

    return new Response(
      JSON.stringify({
        entries: entriesResult.results,
        conversations: conversationsResult.results,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
        },
      },
    );
  } catch (e) {
    console.error('[offline-db] D1 error:', e);
    return new Response('Service Unavailable', { status: 503 });
  }
};
