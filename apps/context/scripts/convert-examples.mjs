/**
 * 예문 배열을 레벨별 객체로 변환하는 스크립트
 *
 * 변환 전: "examples": ["초급", "중급", "고급", "마스터"]
 * 변환 후: "examples": { "beginner": "초급", "intermediate": "중급", "advanced": "고급", "master": "마스터" }
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entriesDir = path.join(__dirname, '../app/data/entries');

// JSON 파일 목록
const jsonFiles = [
  'greetings.json',
  'food.json',
  'emotions.json',
  'daily-life.json',
  'art.json',
  'culture.json',
  'math.json',
  'music.json',
  'numbers.json',
  'physics.json',
  'space.json',
  'sports.json',
  'travel.json',
  'work.json',
];

function convertExamples(examples) {
  if (!examples || !Array.isArray(examples)) {
    return undefined;
  }

  // 4개 예문이 있으면 레벨별로 매핑
  if (examples.length >= 4) {
    return {
      beginner: examples[0],
      intermediate: examples[1],
      advanced: examples[2],
      master: examples[3],
    };
  }

  // 4개 미만이면 빈 문자열로 채움
  return {
    beginner: examples[0] || '',
    intermediate: examples[1] || '',
    advanced: examples[2] || '',
    master: examples[3] || '',
  };
}

function processEntry(entry) {
  const newEntry = { ...entry };

  if (newEntry.translations) {
    if (newEntry.translations.ko && Array.isArray(newEntry.translations.ko.examples)) {
      newEntry.translations.ko.examples = convertExamples(newEntry.translations.ko.examples);
    }
    if (newEntry.translations.en && Array.isArray(newEntry.translations.en.examples)) {
      newEntry.translations.en.examples = convertExamples(newEntry.translations.en.examples);
    }
  }

  return newEntry;
}

let totalConverted = 0;

for (const file of jsonFiles) {
  const filePath = path.join(entriesDir, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  ${file} 파일 없음, 스킵`);
    continue;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const entries = JSON.parse(content);

    if (!Array.isArray(entries)) {
      console.log(`⏭️  ${file} 배열이 아님, 스킵`);
      continue;
    }

    const convertedEntries = entries.map(processEntry);

    // 예쁘게 JSON 포맷팅
    const output = `${JSON.stringify(convertedEntries, null, 2)}\n`;
    fs.writeFileSync(filePath, output, 'utf-8');

    console.log(`✅ ${file}: ${entries.length}개 엔트리 변환 완료`);
    totalConverted += entries.length;
  } catch (error) {
    console.error(`❌ ${file} 처리 실패:`, error.message);
  }
}

console.log(`\n🎉 총 ${totalConverted}개 엔트리 변환 완료!`);
