/**
 * 지리 어휘 MD → JSON 변환 스크립트
 *
 * .claude/generated/geography-vocabulary.md 파일을 파싱하여
 * data/context/entries/geography.json에 추가합니다.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

interface Entry {
  id: string;
  korean: string;
  romanization: string;
  partOfSpeech: string;
  categoryId: string;
  difficulty: string;
  frequency: string;
  tags: string[];
  translations: {
    ko: {
      word: string;
      explanation: string;
      examples: {
        beginner: string;
        intermediate: string;
        advanced: string;
        master: string;
      };
    };
    en: {
      word: string;
      explanation: string;
      examples: {
        beginner: string;
        intermediate: string;
        advanced: string;
        master: string;
      };
    };
  };
}

// 한글을 로마자로 변환 (간단한 규칙 기반)
function toRomanization(korean: string): string {
  // 간단한 변환 - 실제로는 더 복잡한 규칙 필요

  // 간단한 변환 - 실제로는 더 복잡한 규칙 필요
  let result = '';
  for (const char of korean) {
    const code = char.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      // 한글 음절
      const syllableIndex = code - 0xac00;
      const cho = Math.floor(syllableIndex / 588);
      const jung = Math.floor((syllableIndex % 588) / 28);
      const jong = syllableIndex % 28;

      const choList = [
        'g',
        'kk',
        'n',
        'd',
        'tt',
        'r',
        'm',
        'b',
        'pp',
        's',
        'ss',
        '',
        'j',
        'jj',
        'ch',
        'k',
        't',
        'p',
        'h',
      ];
      const jungList = [
        'a',
        'ae',
        'ya',
        'yae',
        'eo',
        'e',
        'yeo',
        'ye',
        'o',
        'wa',
        'wae',
        'oe',
        'yo',
        'u',
        'wo',
        'we',
        'wi',
        'yu',
        'eu',
        'ui',
        'i',
      ];
      const jongList = [
        '',
        'k',
        'k',
        'k',
        'n',
        'n',
        'n',
        't',
        'l',
        'l',
        'l',
        'l',
        'l',
        'l',
        'l',
        'l',
        'm',
        'p',
        'p',
        's',
        's',
        'ng',
        't',
        't',
        'k',
        't',
        'p',
        't',
      ];

      result += choList[cho] + jungList[jung] + jongList[jong];
    } else if (char === ' ') {
      result += ' ';
    } else {
      result += char;
    }
  }
  return result.toLowerCase().replace(/\s+/g, ' ').trim();
}

// 영어를 kebab-case ID로 변환
function toId(english: string): string {
  return english
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// 태그 결정
function getTags(section: string, _korean: string): string[] {
  const tags: string[] = ['geography'];

  if (section.includes('5대양') || section.includes('Ocean')) {
    tags.push('ocean');
  } else if (section.includes('6대주') || section.includes('Continent')) {
    tags.push('continent');
  } else if (section.includes('바다') || section.includes('Sea')) {
    tags.push('sea');
  } else if (section.includes('해협') || section.includes('Strait')) {
    tags.push('strait');
  } else if (section.includes('만') || section.includes('Gulf') || section.includes('Bay')) {
    tags.push('gulf');
  } else if (section.includes('반도') || section.includes('Peninsula')) {
    tags.push('peninsula');
  } else if (section.includes('섬') || section.includes('Island') || section.includes('군도')) {
    tags.push('island');
  } else if (section.includes('산맥') || section.includes('Mountain Range')) {
    tags.push('mountain-range');
  } else if (section.includes('주요 산') || section.includes('Major Mountain')) {
    tags.push('mountain');
  } else if (section.includes('사막') || section.includes('Desert')) {
    tags.push('desert');
  } else if (section.includes('강') || section.includes('River')) {
    tags.push('river');
  } else if (section.includes('호수') || section.includes('Lake')) {
    tags.push('lake');
  } else if (section.includes('폭포') || section.includes('Waterfall')) {
    tags.push('waterfall');
  } else if (
    section.includes('평원') ||
    section.includes('고원') ||
    section.includes('Plain') ||
    section.includes('Plateau')
  ) {
    tags.push('plain');
  } else if (
    section.includes('협곡') ||
    section.includes('계곡') ||
    section.includes('Canyon') ||
    section.includes('Valley')
  ) {
    tags.push('canyon');
  } else if (section.includes('곶') || section.includes('Cape') || section.includes('해안')) {
    tags.push('coastal');
  } else if (section.includes('일반 용어') || section.includes('General')) {
    tags.push('term');
  } else if (section.includes('지역 구분') || section.includes('Regional')) {
    tags.push('region');
  }

  return tags;
}

// 난이도 결정
function getDifficulty(korean: string, _english: string): string {
  // 기본 지리 용어는 beginner
  const beginnerTerms = ['대륙', '대양', '바다', '섬', '산', '강', '호수', '사막', '평원', '고원'];
  const intermediateTerms = ['해협', '만', '반도', '폭포', '협곡', '계곡'];

  for (const term of beginnerTerms) {
    if (korean.includes(term)) return 'beginner';
  }
  for (const term of intermediateTerms) {
    if (korean.includes(term)) return 'intermediate';
  }

  // 길이에 따른 난이도
  if (korean.length <= 3) return 'beginner';
  if (korean.length <= 5) return 'intermediate';
  return 'advanced';
}

// 예문 생성
function generateExamples(
  korean: string,
  english: string,
  explanation: string,
): { ko: Entry['translations']['ko']['examples']; en: Entry['translations']['en']['examples'] } {
  const isPlace = !explanation.includes('~') && !explanation.includes('의');

  if (isPlace) {
    return {
      ko: {
        beginner: `${korean}은/는 유명합니다.`,
        intermediate: `${korean}에 가고 싶습니다.`,
        advanced: `${korean}의 지리적 특성은 독특합니다.`,
        master: `${korean}은/는 세계 지리에서 중요한 위치를 차지합니다.`,
      },
      en: {
        beginner: `${english} is famous.`,
        intermediate: `I want to visit ${english}.`,
        advanced: `The geographical features of ${english} are unique.`,
        master: `${english} holds an important position in world geography.`,
      },
    };
  }

  return {
    ko: {
      beginner: `이것은 ${korean}입니다.`,
      intermediate: `${korean}에 대해 배웠습니다.`,
      advanced: `${korean}의 개념을 이해하는 것이 중요합니다.`,
      master: `${korean}은/는 지리학에서 핵심적인 용어입니다.`,
    },
    en: {
      beginner: `This is ${english.toLowerCase()}.`,
      intermediate: `I learned about ${english.toLowerCase()}.`,
      advanced: `Understanding the concept of ${english.toLowerCase()} is important.`,
      master: `${english} is a key term in geography.`,
    },
  };
}

// MD 파일 파싱
function parseMdFile(content: string): Entry[] {
  const entries: Entry[] = [];
  const lines = content.split('\n');

  let currentSection = '';
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 섹션 헤더 감지
    if (line.startsWith('## ') || line.startsWith('### ')) {
      currentSection = line.replace(/^#+\s*/, '');
      inTable = false;
      continue;
    }

    // 테이블 헤더 감지
    if (line.startsWith('| English') || line.startsWith('|---')) {
      inTable = true;
      continue;
    }

    // 테이블 행 파싱
    if (inTable && line.startsWith('|') && !line.startsWith('|---')) {
      const cells = line
        .split('|')
        .map((c) => c.trim())
        .filter((c) => c);

      if (cells.length >= 3) {
        const english = cells[0];
        const korean = cells[1];
        const explanation = cells[2];

        // 빈 셀이나 헤더 무시
        if (!english || !korean || english === 'English' || korean === '한국어') {
          continue;
        }

        const id = toId(english);

        // 중복 체크
        if (entries.some((e) => e.id === id)) {
          continue;
        }

        const tags = getTags(currentSection, korean);
        const difficulty = getDifficulty(korean, english);
        const examples = generateExamples(korean, english, explanation);

        const entry: Entry = {
          id,
          korean,
          romanization: toRomanization(korean),
          partOfSpeech: 'noun',
          categoryId: 'geography',
          difficulty,
          frequency: 'occasional',
          tags,
          translations: {
            ko: {
              word: korean,
              explanation: explanation || `${english}의 한국어 표현입니다.`,
              examples: examples.ko,
            },
            en: {
              word: english,
              explanation: explanation || `Korean expression for ${korean}.`,
              examples: examples.en,
            },
          },
        };

        entries.push(entry);
      }
    }
  }

  return entries;
}

// 기존 geography.json 로드
function loadExistingEntries(): Entry[] {
  const filePath = join(ROOT_DIR, 'data/context/entries/geography.json');
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

// 메인 함수
function main() {
  console.log('📖 Reading geography vocabulary MD file...');

  const mdPath = join(ROOT_DIR, '.claude/generated/geography-vocabulary.md');
  const mdContent = readFileSync(mdPath, 'utf-8');

  console.log('🔄 Parsing MD content...');
  const newEntries = parseMdFile(mdContent);
  console.log(`   Found ${newEntries.length} entries in MD file`);

  console.log('📂 Loading existing geography.json...');
  const existingEntries = loadExistingEntries();
  console.log(`   Found ${existingEntries.length} existing entries`);

  // 기존 ID 목록
  const existingIds = new Set(existingEntries.map((e) => e.id));

  // 새 항목만 추가
  const entriesToAdd = newEntries.filter((e) => !existingIds.has(e.id));
  console.log(`   ${entriesToAdd.length} new entries to add`);

  // 병합
  const mergedEntries = [...existingEntries, ...entriesToAdd];

  // ID로 정렬
  mergedEntries.sort((a, b) => a.id.localeCompare(b.id));

  // 저장
  const outputPath = join(ROOT_DIR, 'data/context/entries/geography.json');
  writeFileSync(outputPath, JSON.stringify(mergedEntries, null, 2), 'utf-8');

  console.log(`\n✅ Saved ${mergedEntries.length} entries to geography.json`);
  console.log(`   Added: ${entriesToAdd.length} new entries`);
  console.log(`   Existing: ${existingEntries.length} entries`);
}

main();
