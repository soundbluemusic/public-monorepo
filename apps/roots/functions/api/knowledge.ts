/**
 * Knowledge D1 API Endpoint
 *
 * 학문/참고자료 데이터를 조회합니다.
 * - math_concepts: 수학 개념
 * - math_fields: 수학 분야
 * - math_subfields: 수학 세부 분야
 * - libraries: 라이브러리 문서
 * - web_apis: Web API 문서
 * - algorithms: 알고리즘 문서
 */

interface Env {
  KNOWLEDGE_DB: D1Database;
}

interface MathConceptRow {
  id: string;
  field_id: string;
  subfield_id: string | null;
  name_ko: string;
  name_en: string;
  definition_ko: string | null;
  definition_en: string | null;
  difficulty: string | null;
  tags: string | null;
  related: string | null;
  formula: string | null;
  examples: string | null;
}

interface MathFieldRow {
  id: string;
  name_ko: string;
  name_en: string;
  description_ko: string | null;
  description_en: string | null;
}

// CORS 헤더
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { KNOWLEDGE_DB } = context.env;
  const url = new URL(context.request.url);
  const type = url.searchParams.get('type') || 'overview';
  const fieldId = url.searchParams.get('field');
  const conceptId = url.searchParams.get('id');

  try {
    // 특정 개념 조회
    if (type === 'concept' && conceptId) {
      const { results } = await KNOWLEDGE_DB.prepare('SELECT * FROM math_concepts WHERE id = ?')
        .bind(conceptId)
        .all<MathConceptRow>();

      if (!results || results.length === 0) {
        return new Response(JSON.stringify({ error: 'Concept not found' }), {
          status: 404,
          headers: corsHeaders,
        });
      }

      const concept = results[0];
      return new Response(
        JSON.stringify({
          ...concept,
          tags: concept.tags ? JSON.parse(concept.tags) : [],
          related: concept.related ? JSON.parse(concept.related) : [],
          formula: concept.formula ? JSON.parse(concept.formula) : [],
          examples: concept.examples ? JSON.parse(concept.examples) : [],
        }),
        { headers: corsHeaders },
      );
    }

    // 분야별 개념 목록
    if (type === 'concepts') {
      let query =
        'SELECT id, field_id, subfield_id, name_ko, name_en, difficulty FROM math_concepts';
      const params: string[] = [];

      if (fieldId) {
        query += ' WHERE field_id = ?';
        params.push(fieldId);
      }

      query += ' ORDER BY field_id, name_ko';

      const stmt =
        params.length > 0
          ? KNOWLEDGE_DB.prepare(query).bind(...params)
          : KNOWLEDGE_DB.prepare(query);

      const { results } =
        await stmt.all<
          Pick<
            MathConceptRow,
            'id' | 'field_id' | 'subfield_id' | 'name_ko' | 'name_en' | 'difficulty'
          >
        >();

      return new Response(
        JSON.stringify({
          concepts: results || [],
          count: results?.length || 0,
        }),
        { headers: corsHeaders },
      );
    }

    // 분야 목록
    if (type === 'fields') {
      const { results } = await KNOWLEDGE_DB.prepare(
        'SELECT * FROM math_fields ORDER BY id',
      ).all<MathFieldRow>();

      return new Response(
        JSON.stringify({
          fields: results || [],
          count: results?.length || 0,
        }),
        { headers: corsHeaders },
      );
    }

    // 세부 분야 목록
    if (type === 'subfields') {
      let query = 'SELECT * FROM math_subfields';
      const params: string[] = [];

      if (fieldId) {
        query += ' WHERE field_id = ?';
        params.push(fieldId);
      }

      query += ' ORDER BY field_id, id';

      const stmt =
        params.length > 0
          ? KNOWLEDGE_DB.prepare(query).bind(...params)
          : KNOWLEDGE_DB.prepare(query);

      const { results } = await stmt.all();

      return new Response(
        JSON.stringify({
          subfields: results || [],
          count: results?.length || 0,
        }),
        { headers: corsHeaders },
      );
    }

    // 개요 (기본값)
    if (type === 'overview') {
      const [fields, concepts, libraries, webApis, algorithms] = await Promise.all([
        KNOWLEDGE_DB.prepare('SELECT COUNT(*) as count FROM math_fields').first<{
          count: number;
        }>(),
        KNOWLEDGE_DB.prepare('SELECT COUNT(*) as count FROM math_concepts').first<{
          count: number;
        }>(),
        KNOWLEDGE_DB.prepare('SELECT COUNT(*) as count FROM libraries').first<{ count: number }>(),
        KNOWLEDGE_DB.prepare('SELECT COUNT(*) as count FROM web_apis').first<{ count: number }>(),
        KNOWLEDGE_DB.prepare('SELECT COUNT(*) as count FROM algorithms').first<{ count: number }>(),
      ]);

      return new Response(
        JSON.stringify({
          counts: {
            fields: fields?.count || 0,
            concepts: concepts?.count || 0,
            libraries: libraries?.count || 0,
            webApis: webApis?.count || 0,
            algorithms: algorithms?.count || 0,
          },
        }),
        { headers: corsHeaders },
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Invalid type. Use: overview, fields, subfields, concepts, or concept',
      }),
      {
        status: 400,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error('Knowledge D1 query error:', error);
    return new Response(
      JSON.stringify({ error: 'Database query failed', details: String(error) }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
};
