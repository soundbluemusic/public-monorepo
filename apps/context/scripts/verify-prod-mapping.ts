
import { lightEntries } from '../app/data/generated/entries';
import { entryToCategory, entryIndex } from '../app/data/generated/entry-index';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** Entry chunk 파일에 저장된 엔트리의 최소 타입 */
interface ChunkEntry {
  id: string;
}

console.log('Verifying Entry Mapping (Category + Choseong)...');

const failures: string[] = [];
const missingFiles: Set<string> = new Set();

// 1. Verify Category Chunks (ClientLoader / SSG)
const CAT_BASE_DIR = join(process.cwd(), 'apps/context/public/data/by-category-full/en');
console.log(`\nChecking Category Strategy (ClientLoader)...`);
console.log(`Base Dir: ${CAT_BASE_DIR}`);

const catJsonCache = new Map<string, ChunkEntry[]>();

for (const entry of lightEntries) {
    const id = entry.id;

    // --- Category Check ---
    const catId = entryToCategory[id];
    if (!catId) {
        // console.error(`[FAIL][CAT] ${id}: No category in entryToCategory`);
        // failures.push(`${id} (No Cat Index)`);
        // continue;
    } else {
        const filename = `${catId}.json`;
        const filepath = join(CAT_BASE_DIR, filename);

        if (!missingFiles.has(filepath) && !catJsonCache.has(filename)) {
            if (!existsSync(filepath)) {
                console.error(`[FAIL][CAT] ${id}: File missing ${filename}`);
                missingFiles.add(filepath);
                failures.push(`${id} (Cat File Missing)`);
            } else {
                try {
                    const json = JSON.parse(readFileSync(filepath, 'utf-8'));
                    catJsonCache.set(filename, json);
                } catch (_e) { console.error(`Failed to parse ${filename}`); }
            }
        }

        const entriesInChunk = catJsonCache.get(filename);
        if (entriesInChunk && !entriesInChunk.find((e) => e.id === id)) {
            console.error(`[FAIL][CAT] ${id}: Missing in ${filename}`);
            failures.push(`${id} (Missing in Cat JSON)`);
        }
    }
}

// 2. Verify Choseong Chunks (useEntryLoader / SPA Hover / Study)
const CHOSEONG_BASE_DIR = join(process.cwd(), 'apps/context/public/data/chunks');
console.log(`\nChecking Choseong Strategy (useEntryLoader)...`);
console.log(`Base Dir: ${CHOSEONG_BASE_DIR}`);

const choseongJsonCache = new Map<string, ChunkEntry[]>();

for (const entry of lightEntries) {
    const id = entry.id;

    // --- Choseong Check (entryIndex) ---
    // entryIndex maps ID -> Choseong Char (e.g. 'ㄱ')
    const choseong = entryIndex[id];

    if (!choseong) {
        console.error(`[FAIL][CHO] ${id}: No choseong in entryIndex`);
        failures.push(`${id} (No Choseong Index)`);
        continue;
    }

    const filename = `entries-${choseong}.json`;
    const filepath = join(CHOSEONG_BASE_DIR, filename);

    if (!missingFiles.has(filepath) && !choseongJsonCache.has(filename)) {
        if (!existsSync(filepath)) {
            console.error(`[FAIL][CHO] ${id}: File missing ${filename}`);
            missingFiles.add(filepath);
            failures.push(`${id} (Cho File Missing: ${filename})`);
        } else {
            try {
                const json = JSON.parse(readFileSync(filepath, 'utf-8'));
                choseongJsonCache.set(filename, json);
            } catch (_e) { console.error(`Failed to parse ${filename}`); }
        }
    }

    const entriesInChunk = choseongJsonCache.get(filename);
    if (entriesInChunk && !entriesInChunk.find((e) => e.id === id)) {
        console.error(`[FAIL][CHO] ${id}: Missing in ${filename}`);
        failures.push(`${id} (Missing in Cho JSON)`);
    }
}

console.log('\n--- Summary ---');
console.log(`Total Checked: ${lightEntries.length}`);
console.log(`Failures: ${failures.length}`);
if (failures.length > 0) {
    console.log('Failures detected!');
} else {
    console.log('✅ All mappings Verified (Category & Choseong)!');
}
