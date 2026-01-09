
import { lightEntries } from '../app/data/generated/entries';
import { entryIndex } from '../app/data/generated/entry-index';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('Verifying Remote Data Consistency...');

const BASE_URL = 'https://context.soundbluemusic.com';
const CHUNK_DIR = join(process.cwd(), 'apps/context/public/data/chunks');

async function checkRemote() {
    // 1. Identify all local Choseong keys from entryIndex
    // entryIndex keys are IDs, values are Choseongs.
    const choseongs = new Set<string>(Object.values(entryIndex));
    console.log(`Found ${choseongs.size} unique choseong chunks locally.`);

    const failures: string[] = [];

    for (const choseong of choseongs) {
        const filename = `entries-${choseong}.json`;
        const localPath = join(CHUNK_DIR, filename);

        if (!existsSync(localPath)) {
            console.error(`Local file missing: ${filename}`);
            continue;
        }

        const localData = JSON.parse(readFileSync(localPath, 'utf-8'));
        const localIds = new Set(localData.map((e: any) => e.id));

        // Fetch Remote
        // Handle Hangul in URL
        const encodedFilename = `entries-${encodeURIComponent(choseong)}.json`;
        const url = `${BASE_URL}/data/chunks/${encodedFilename}`;

        try {
            console.log(`Fetching ${url}...`);
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`[FAIL] Failed to fetch ${filename}: ${res.status}`);
                failures.push(`Missing Chunk: ${filename}`);
                continue;
            }

            const remoteData = await res.json();
            const remoteIds = new Set(remoteData.map((e: any) => e.id));

            // Compare: Are all Local IDs present in Remote?
            // If Local (Client) thinks it's there (based on Index), but Remote (R2) doesn't have it, CRASH.
            const missingInRemote = [...localIds].filter(id => !remoteIds.has(id));

            if (missingInRemote.length > 0) {
                console.error(`[FAIL] ${filename}: ${missingInRemote.length} IDs missing in remote!`);
                console.error(`Example missing: ${missingInRemote.slice(0, 3).join(', ')}`);
                failures.push(`${filename} (Remote Outdated, missing ${missingInRemote.length} entries)`);
            } else {
                console.log(`[OK] ${filename} matches.`);
            }

        } catch (e) {
            console.error(`Error checking ${filename}:`, e);
            failures.push(`Error: ${filename}`);
        }
    }

    console.log('\n--- Remote Verification Summary ---');
    if (failures.length > 0) {
        console.log(`Found ${failures.length} issues.`);
        console.log(failures.join('\n'));
    } else {
        console.log('✅ Remote R2 data is fully consistent with Local Build.');
    }
}

checkRemote();
