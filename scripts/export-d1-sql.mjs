#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const DEFAULT_BATCH_SIZE = 100;

// 일시적 오류(네트워크 단절, 429, 5xx)에 대한 재시도 설정
const MAX_API_ATTEMPTS = 4;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith('--')) {
      throw new Error(`Unexpected positional argument: ${arg}`);
    }

    const key = arg.slice(2);
    if (key === 'use-wrangler') {
      args.useWrangler = true;
      continue;
    }
    if (key === 'check') {
      args.check = true;
      continue;
    }

    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

function getRequiredArg(args, key) {
  const value = args[key];
  if (!value) {
    throw new Error(`Missing required argument --${key}`);
  }

  return value;
}

function quoteIdentifier(identifier) {
  return `"${String(identifier).replaceAll('"', '""')}"`;
}

function quoteString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function sqlLiteral(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : quoteString(value);
  }

  if (typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }

  if (typeof value === 'string') {
    return quoteString(value);
  }

  if (
    Array.isArray(value) &&
    value.every((byte) => Number.isInteger(byte) && byte >= 0 && byte <= 255)
  ) {
    return `X'${bytesToHex(value)}'`;
  }

  if (value && typeof value === 'object' && value.type === 'Buffer' && Array.isArray(value.data)) {
    return `X'${bytesToHex(value.data)}'`;
  }

  return quoteString(JSON.stringify(value));
}

function getRowsFromWrangler(stdout) {
  const payload = JSON.parse(stdout);
  const firstResult = Array.isArray(payload) ? payload[0] : payload;

  if (!firstResult?.success) {
    throw new Error(`Wrangler D1 query failed: ${JSON.stringify(payload)}`);
  }

  return firstResult.results ?? [];
}

function createWranglerQuery({ databaseName, configPath }) {
  return function query(sql) {
    const result = spawnSync(
      'pnpm',
      [
        '--filter',
        'context',
        'exec',
        'wrangler',
        'd1',
        'execute',
        databaseName,
        '--config',
        configPath,
        '--remote',
        '--command',
        sql,
        '--json',
      ],
      {
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 100,
      },
    );

    if (result.status !== 0) {
      throw new Error(result.stderr || result.stdout || `Wrangler exited with ${result.status}`);
    }

    return getRowsFromWrangler(result.stdout);
  };
}

function createApiQuery({ accountId, apiToken, databaseId }) {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  return async function query(sql) {
    let lastError;

    for (let attempt = 1; attempt <= MAX_API_ATTEMPTS; attempt += 1) {
      let response;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sql }),
        });
      } catch (networkError) {
        // 네트워크 단절 등은 일시적일 수 있으므로 백오프 후 재시도
        lastError =
          networkError instanceof Error ? networkError : new Error(String(networkError));
        if (attempt < MAX_API_ATTEMPTS) {
          await sleep(2 ** attempt * 1000);
          continue;
        }
        throw new Error(
          `Cloudflare D1 request failed for ${databaseId} after ${MAX_API_ATTEMPTS} attempts: ${lastError.message}`,
        );
      }

      const payload = await response.json().catch(() => null);

      if (response.ok && payload?.success) {
        const firstResult = payload.result?.[0];
        if (!firstResult?.success) {
          throw new Error(
            `Cloudflare D1 query returned an unsuccessful result: ${JSON.stringify(payload)}`,
          );
        }

        return firstResult.results ?? [];
      }

      const errors = payload?.errors?.map((error) => error.message).join('; ');
      const detail = errors || response.statusText || 'unknown Cloudflare API error';

      // 429/5xx는 일시적 → 재시도. 그 외(400/401/403 등)는 결정적 오류이므로 즉시 실패.
      if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_API_ATTEMPTS) {
        lastError = new Error(`HTTP ${response.status}: ${detail}`);
        await sleep(2 ** attempt * 1000);
        continue;
      }

      throw new Error(
        `Cloudflare D1 query failed for ${databaseId} (HTTP ${response.status}): ${detail}. ` +
          'Ensure the GitHub secret token has Account D1 Read (or Edit) permission and CLOUDFLARE_ACCOUNT_ID is correct.',
      );
    }

    throw lastError ?? new Error(`Cloudflare D1 query failed for ${databaseId}`);
  };
}

async function maybeQuery(query, sql) {
  try {
    return await query(sql);
  } catch (error) {
    if (error instanceof Error && /no such table|no such column/i.test(error.message)) {
      return null;
    }

    throw error;
  }
}

async function tableHasRowId(query, tableName) {
  const sql = `SELECT rowid FROM ${quoteIdentifier(tableName)} LIMIT 0`;
  const rows = await maybeQuery(query, sql);
  return rows !== null;
}

async function getTableColumns(query, tableName) {
  const pragmaRows = await query(`PRAGMA table_info(${quoteIdentifier(tableName)})`);
  return pragmaRows.map((row) => row.name).filter(Boolean);
}

async function dumpTableData({ lines, query, tableName, batchSize }) {
  const columns = await getTableColumns(query, tableName);
  if (columns.length === 0) {
    return 0;
  }

  const countRows = await query(`SELECT COUNT(*) AS count FROM ${quoteIdentifier(tableName)}`);
  const rowCount = Number(countRows[0]?.count ?? 0);
  if (rowCount === 0) {
    return 0;
  }

  const columnSql = columns.map(quoteIdentifier).join(', ');
  const insertPrefix = `INSERT INTO ${quoteIdentifier(tableName)} (${columnSql}) VALUES`;
  const orderBy = (await tableHasRowId(query, tableName)) ? ' ORDER BY rowid' : '';
  let dumpedRows = 0;

  lines.push('');
  lines.push(`-- Data for ${quoteIdentifier(tableName)}`);

  for (let offset = 0; offset < rowCount; offset += batchSize) {
    const rows = await query(
      `SELECT ${columnSql} FROM ${quoteIdentifier(tableName)}${orderBy} LIMIT ${batchSize} OFFSET ${offset}`,
    );

    for (const row of rows) {
      const values = columns.map((column) => sqlLiteral(row[column])).join(', ');
      lines.push(`${insertPrefix} (${values});`);
      dumpedRows += 1;
    }
  }

  return dumpedRows;
}

async function dumpSql({ query, databaseName, outputPath, batchSize }) {
  const schemaRows = await query(`
    SELECT type, name, tbl_name, sql
    FROM sqlite_master
    WHERE sql IS NOT NULL
      AND name NOT LIKE 'sqlite_%'
      AND name != '_cf_KV'
    ORDER BY
      CASE type
        WHEN 'table' THEN 0
        WHEN 'view' THEN 3
        WHEN 'index' THEN 4
        WHEN 'trigger' THEN 5
        ELSE 6
      END,
      name
  `);

  const tableRows = schemaRows.filter((row) => row.type === 'table');
  const postDataSchemaRows = schemaRows.filter((row) => row.type !== 'table');
  const lines = [
    `-- D1 SQL backup for ${databaseName}`,
    `-- Generated at ${new Date().toISOString()}`,
    'PRAGMA foreign_keys=OFF;',
    '',
  ];

  for (const row of tableRows) {
    lines.push(`${row.sql};`);
  }

  let totalRows = 0;
  for (const row of tableRows) {
    const tableName = row.name;
    const dumpedRows = await dumpTableData({ lines, query, tableName, batchSize });
    totalRows += dumpedRows;
    console.log(`Dumped ${dumpedRows} rows from ${tableName}`);
  }

  const sequenceRows = await maybeQuery(
    query,
    'SELECT name, seq FROM sqlite_sequence ORDER BY name',
  );
  if (sequenceRows?.length) {
    lines.push('');
    lines.push('-- AUTOINCREMENT state');
    lines.push('DELETE FROM sqlite_sequence;');
    for (const row of sequenceRows) {
      lines.push(
        `INSERT INTO sqlite_sequence (name, seq) VALUES (${sqlLiteral(row.name)}, ${sqlLiteral(row.seq)});`,
      );
    }
  }

  if (postDataSchemaRows.length > 0) {
    lines.push('');
    lines.push('-- Indexes, views, and triggers');
    for (const row of postDataSchemaRows) {
      lines.push(`${row.sql};`);
    }
  }

  lines.push('');

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, lines.join('\n'));

  return {
    outputPath,
    tables: tableRows.length,
    rows: totalRows,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const databaseName = getRequiredArg(args, 'database-name');
  const batchSize = Number(args['batch-size'] ?? DEFAULT_BATCH_SIZE);

  if (!Number.isInteger(batchSize) || batchSize < 1) {
    throw new Error('--batch-size must be a positive integer');
  }

  const useWrangler = Boolean(args.useWrangler);
  const query = useWrangler
    ? createWranglerQuery({
        databaseName,
        configPath: resolve(getRequiredArg(args, 'config')),
      })
    : createApiQuery({
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        apiToken: process.env.CLOUDFLARE_API_TOKEN,
        databaseId: getRequiredArg(args, 'database-id'),
      });

  if (!useWrangler && (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN)) {
    throw new Error('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required for API export');
  }

  // Preflight: 토큰/계정/DB 읽기 권한만 검증하고 종료 (덤프 없음)
  if (args.check) {
    const rows = await query('SELECT 1 AS ok');
    if (rows?.[0]?.ok !== 1) {
      throw new Error(`Preflight check failed for ${databaseName}: unexpected response from D1`);
    }
    console.log(`Preflight OK: "${databaseName}" is reachable and the token can read it`);
    return;
  }

  const outputPath = resolve(getRequiredArg(args, 'output'));
  const result = await dumpSql({ query, databaseName, outputPath, batchSize });
  console.log(`Wrote ${result.outputPath} (${result.tables} tables, ${result.rows} rows)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
