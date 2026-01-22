/**
 * Remove duplicate entries from context JSON files
 * Keeps the first occurrence of each korean word per file
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ENTRIES_DIR = '/Volumes/X10 Pro/monorepo-project/public-monorepo/data/context/entries';

interface Entry {
  korean: string;
  [key: string]: unknown;
}

function dedupeFile(filePath: string): { before: number; after: number; removed: string[] } {
  const content = readFileSync(filePath, 'utf-8');
  const entries: Entry[] = JSON.parse(content);

  const seen = new Set<string>();
  const removed: string[] = [];
  const deduped: Entry[] = [];

  for (const entry of entries) {
    const key = entry.korean;
    if (seen.has(key)) {
      removed.push(key);
    } else {
      seen.add(key);
      deduped.push(entry);
    }
  }

  if (removed.length > 0) {
    writeFileSync(filePath, `${JSON.stringify(deduped, null, 2)}\n`, 'utf-8');
  }

  return {
    before: entries.length,
    after: deduped.length,
    removed,
  };
}

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Deduplicating context entries');
  console.log(`${'='.repeat(60)}\n`);

  const files = readdirSync(ENTRIES_DIR).filter((f) => f.endsWith('.json'));
  let totalRemoved = 0;

  for (const file of files) {
    const filePath = join(ENTRIES_DIR, file);
    const result = dedupeFile(filePath);

    if (result.removed.length > 0) {
      console.log(`${file}:`);
      console.log(`  ${result.before} → ${result.after} (removed ${result.removed.length})`);

      // Show some examples of removed duplicates
      const examples = result.removed.slice(0, 5);
      if (examples.length > 0) {
        console.log(`  Examples: ${examples.join(', ')}${result.removed.length > 5 ? '...' : ''}`);
      }
      console.log('');
      totalRemoved += result.removed.length;
    }
  }

  console.log('='.repeat(60));
  console.log(`Total removed: ${totalRemoved} duplicates`);
  console.log('='.repeat(60));
}

main();
