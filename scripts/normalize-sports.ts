/**
 * sports.json 한국어 필드 정규화 스크립트
 *
 * 변환:
 * - "엠" → "미터" (100엠 → 100미터) - "엠티비"는 제외
 * - "(\d+)m " / "(\d+)m$" → "$1미터 " (자유형 50m → 자유형 50미터)
 * - "(\d+(\.\d+)?)km" → "$1킬로미터"
 * - "(\d+)kg" → "$1킬로그램"
 * - ID 재생성: 정규화된 korean 기반
 * - romanization 재생성
 * - tags에 종목 유형 태그 추가
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ============================================
// 로마자 변환 (generate-examples-all.ts에서 복사)
// ============================================
function toRomanization(korean: string): string {
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

  let result = '';
  for (const char of korean) {
    const code = char.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const syllableIndex = code - 0xac00;
      const cho = Math.floor(syllableIndex / 588);
      const jung = Math.floor((syllableIndex % 588) / 28);
      const jong = syllableIndex % 28;
      result += choList[cho] + jungList[jung] + jongList[jong];
    } else if (char === ' ') {
      result += '-';
    } else if (/[0-9.]/.test(char)) {
      result += char;
    } else {
      result += char;
    }
  }
  return result.toLowerCase().replace(/-+/g, '-').trim();
}

function koreanToId(korean: string): string {
  return `d-spo-${toRomanization(korean).replace(/\s+/g, '-')}`;
}

// ============================================
// korean 필드 정규화
// ============================================
function normalizeKorean(korean: string): string {
  let result = korean;

  // "엠티비"는 정상 한국어이므로 제외
  if (result === '엠티비') return result;

  // "엠" → "미터" (100엠 → 100미터)
  result = result.replace(/(\d+)엠/g, '$1미터');

  // "m" → "미터" (자유형 50m → 자유형 50미터)
  // 숫자 뒤의 m만 변환 (다른 맥락의 m은 변환하지 않음)
  result = result.replace(/(\d+)m\b/g, '$1미터');

  // "km" → "킬로미터"
  result = result.replace(/(\d+(?:\.\d+)?)km\b/g, '$1킬로미터');

  // "kg" → "킬로그램"
  result = result.replace(/(\d+)kg\b/g, '$1킬로그램');

  return result;
}

// ============================================
// 종목 유형 태그 판별
// ============================================
function classifySport(korean: string): string {
  // 수영 관련
  if (/자유형|배영|접영|평영|혼영|수영|다이빙|수구|싱크로|오픈워터/.test(korean)) return 'swimming';

  // 트랙 달리기
  if (/미터|달리기|허들|마라톤|릴레이|경보|단거리|중거리|장거리/.test(korean)) return 'track';

  // 체급/역도
  if (/킬로그램|급|역도|인상|용상|리프팅/.test(korean)) return 'weightlifting';

  // 필드 종목
  if (/던지기|뛰기|넘기|포환|원반|창|해머|멀리|높이|세단|장대/.test(korean)) return 'field';

  // 사이클
  if (/사이클|독주|경륜|BMX|엠티비/.test(korean)) return 'cycling';

  // 격투기
  if (/유도|태권도|복싱|레슬링|펜싱|가라테|무에타이|격투/.test(korean)) return 'combat';

  // 라켓
  if (/테니스|배드민턴|탁구|스쿼시|라켓/.test(korean)) return 'racket';

  // 구기
  if (/축구|농구|야구|배구|핸드볼|하키|럭비|풋살|소프트볼|크리켓|골프|볼링/.test(korean))
    return 'ball';

  // 동계
  if (/스키|스케이트|봅슬레이|루지|컬링|아이스|빙상|스노보드|바이애슬론/.test(korean))
    return 'winter';

  // 체조
  if (/체조|트램폴린|리듬|평균대|철봉|도마|링/.test(korean)) return 'gymnastics';

  // 수상
  if (/보트|카누|카약|요트|조정|세일링/.test(korean)) return 'water';

  // 사격/양궁
  if (/사격|양궁|활|권총|소총|클레이/.test(korean)) return 'shooting';

  // 승마
  if (/승마|마장마술|장애물/.test(korean)) return 'equestrian';

  return 'general';
}

// ============================================
// 메인
// ============================================
const sportsPath = resolve(import.meta.dirname, '../data/context/entries/sports.json');
const data = JSON.parse(readFileSync(sportsPath, 'utf-8'));

let changed = 0;
const idMap = new Map<string, string>(); // oldId → newId

for (const entry of data) {
  const original = entry.korean;
  const normalized = normalizeKorean(original);

  if (normalized !== original) {
    console.log(`[korean] "${original}" → "${normalized}"`);
    entry.korean = normalized;

    // romanization 재생성
    entry.romanization = toRomanization(normalized);

    // ID 재생성
    const newId = koreanToId(normalized);
    if (newId !== entry.id) {
      console.log(`  [id] "${entry.id}" → "${newId}"`);
      idMap.set(entry.id, newId);
      entry.id = newId;
    }

    // translations.ko.word도 동기화
    if (entry.translations?.ko?.word) {
      entry.translations.ko.word = normalized;
    }

    changed++;
  }

  // tags에 종목 유형 추가 (아직 없는 경우)
  const sportType = classifySport(entry.korean);
  if (!entry.tags) entry.tags = [];
  if (!entry.tags.includes(sportType)) {
    // 기존 태그에 sports만 있거나 비어있으면 종목 태그 추가
    if (
      !entry.tags.some((t: string) =>
        [
          'track',
          'swimming',
          'weightlifting',
          'field',
          'cycling',
          'combat',
          'racket',
          'ball',
          'winter',
          'gymnastics',
          'water',
          'shooting',
          'equestrian',
          'general',
        ].includes(t),
      )
    ) {
      entry.tags.push(sportType);
    }
  }
}

writeFileSync(sportsPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

console.log(`\n완료: ${changed}개 엔트리 정규화, 총 ${data.length}개 엔트리`);
console.log(`ID 변경: ${idMap.size}개`);
for (const [oldId, newId] of idMap) {
  console.log(`  ${oldId} → ${newId}`);
}
