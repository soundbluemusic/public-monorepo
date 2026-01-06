#!/usr/bin/env npx tsx
/**
 * 한국 지리 어휘 JSON 변환 스크립트
 *
 * korea-geography-vocabulary.md 파일을 파싱하여 geography.json에 추가합니다.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

interface Entry {
  id: string;
  korean: string;
  romanization: string;
  partOfSpeech: string;
  categoryId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  frequency: 'common' | 'occasional' | 'rare';
  tags: string[];
  translations: {
    ko: {
      word: string;
      explanation: string;
      examples: {
        beginner: string;
        intermediate: string;
        advanced: string;
        master?: string;
      };
    };
    en: {
      word: string;
      explanation: string;
      examples: {
        beginner: string;
        intermediate: string;
        advanced: string;
        master?: string;
      };
    };
  };
}

// 로마자 변환 (간단한 규칙 기반)
function toRomanization(korean: string): string {
  const romanMap: Record<string, string> = {
    // 초성
    ㄱ: 'g',
    ㄲ: 'kk',
    ㄴ: 'n',
    ㄷ: 'd',
    ㄸ: 'tt',
    ㄹ: 'r',
    ㅁ: 'm',
    ㅂ: 'b',
    ㅃ: 'pp',
    ㅅ: 's',
    ㅆ: 'ss',
    ㅇ: '',
    ㅈ: 'j',
    ㅉ: 'jj',
    ㅊ: 'ch',
    ㅋ: 'k',
    ㅌ: 't',
    ㅍ: 'p',
    ㅎ: 'h',
    // 중성
    ㅏ: 'a',
    ㅐ: 'ae',
    ㅑ: 'ya',
    ㅒ: 'yae',
    ㅓ: 'eo',
    ㅔ: 'e',
    ㅕ: 'yeo',
    ㅖ: 'ye',
    ㅗ: 'o',
    ㅘ: 'wa',
    ㅙ: 'wae',
    ㅚ: 'oe',
    ㅛ: 'yo',
    ㅜ: 'u',
    ㅝ: 'wo',
    ㅞ: 'we',
    ㅟ: 'wi',
    ㅠ: 'yu',
    ㅡ: 'eu',
    ㅢ: 'ui',
    ㅣ: 'i',
    // 종성
  };

  // 자주 사용되는 지명 로마자 표기
  const knownRomanizations: Record<string, string> = {
    서울: 'seoul',
    서울특별시: 'seoul-teukbyeolsi',
    부산: 'busan',
    부산광역시: 'busan-gwangyeoksi',
    대구: 'daegu',
    대구광역시: 'daegu-gwangyeoksi',
    인천: 'incheon',
    인천광역시: 'incheon-gwangyeoksi',
    광주: 'gwangju',
    광주광역시: 'gwangju-gwangyeoksi',
    대전: 'daejeon',
    대전광역시: 'daejeon-gwangyeoksi',
    울산: 'ulsan',
    울산광역시: 'ulsan-gwangyeoksi',
    세종: 'sejong',
    세종특별자치시: 'sejong-teukbyeol-jachisi',
    세종시: 'sejong-si',
    제주: 'jeju',
    제주도: 'jejudo',
    제주특별자치도: 'jeju-teukbyeol-jachido',
    경기도: 'gyeonggi-do',
    강원도: 'gangwon-do',
    강원특별자치도: 'gangwon-teukbyeol-jachido',
    충청북도: 'chungcheongbuk-do',
    충청남도: 'chungcheongnam-do',
    전라북도: 'jeollabuk-do',
    전북특별자치도: 'jeonbuk-teukbyeol-jachido',
    전라남도: 'jeollanam-do',
    경상북도: 'gyeongsangbuk-do',
    경상남도: 'gyeongsangnam-do',
    한강: 'hangang',
    낙동강: 'nakdonggang',
    금강: 'geumgang',
    섬진강: 'seomjingang',
    영산강: 'yeongsangang',
    한라산: 'hallasan',
    지리산: 'jirisan',
    설악산: 'seoraksan',
    북한산: 'bukhansan',
    독도: 'dokdo',
    울릉도: 'ulleungdo',
    대한민국: 'daehan-minguk',
    한반도: 'hanbando',
  };

  if (knownRomanizations[korean]) {
    return knownRomanizations[korean];
  }

  // 간단한 변환: 공백으로 분리된 단어들을 하이픈으로 연결
  return korean
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '');
}

// ID 생성 (영어 단어 기반)
function toId(english: string): string {
  return english
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// 태그 결정
function determineTags(description: string, sectionTitle: string): string[] {
  const tags: string[] = ['korea', 'geography'];

  // 섹션별 태그
  if (sectionTitle.includes('행정구역') || sectionTitle.includes('Administrative')) {
    tags.push('administrative');
  }
  if (sectionTitle.includes('특별시') || sectionTitle.includes('Special City')) {
    tags.push('city', 'special-city');
  }
  if (sectionTitle.includes('광역시') || sectionTitle.includes('Metropolitan')) {
    tags.push('city', 'metropolitan');
  }
  if (sectionTitle.includes('도') && sectionTitle.includes('Province')) {
    tags.push('province');
  }
  if (sectionTitle.includes('자치구') || description.includes('구')) {
    tags.push('district');
  }
  if (sectionTitle.includes('산') || sectionTitle.includes('Mountain')) {
    tags.push('mountain');
  }
  if (sectionTitle.includes('강') || sectionTitle.includes('River')) {
    tags.push('river');
  }
  if (sectionTitle.includes('호수') || sectionTitle.includes('Lake')) {
    tags.push('lake');
  }
  if (sectionTitle.includes('섬') || sectionTitle.includes('Island')) {
    tags.push('island');
  }
  if (sectionTitle.includes('해변') || sectionTitle.includes('Beach')) {
    tags.push('beach');
  }
  if (sectionTitle.includes('국립공원') || sectionTitle.includes('National Park')) {
    tags.push('national-park');
  }
  if (sectionTitle.includes('댐') || sectionTitle.includes('Dam')) {
    tags.push('dam');
  }
  if (sectionTitle.includes('해협') || sectionTitle.includes('Strait')) {
    tags.push('strait');
  }
  if (sectionTitle.includes('만') || sectionTitle.includes('Bay')) {
    tags.push('bay');
  }
  if (sectionTitle.includes('반도') || sectionTitle.includes('Peninsula')) {
    tags.push('peninsula');
  }
  if (sectionTitle.includes('평야') || sectionTitle.includes('Plain')) {
    tags.push('plain');
  }
  if (sectionTitle.includes('곶') || sectionTitle.includes('Cape')) {
    tags.push('cape', 'landmark');
  }

  return [...new Set(tags)];
}

// 난이도 결정 (DifficultyLevel: beginner | intermediate | advanced)
function determineDifficulty(
  korean: string,
  _english: string,
  tags: string[],
): 'beginner' | 'intermediate' | 'advanced' {
  // 주요 도시/지역은 beginner
  const beginnerPlaces = [
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '제주',
    '한강',
    '한라산',
    '독도',
    '대한민국',
    '한반도',
  ];
  if (beginnerPlaces.some((p) => korean.includes(p))) {
    return 'beginner';
  }

  // 도청 소재지, 주요 관광지는 intermediate
  if (
    tags.includes('province') ||
    tags.includes('metropolitan') ||
    tags.includes('national-park')
  ) {
    return 'intermediate';
  }

  // 군/읍/면 단위, 전문 용어는 advanced
  if (korean.includes('군') || korean.includes('읍') || korean.includes('면')) {
    return 'advanced';
  }

  // 해협, 분지 등 전문 용어도 advanced
  if (tags.includes('strait') || tags.includes('basin') || korean.includes('분지')) {
    return 'advanced';
  }

  return 'intermediate';
}

// 빈도 결정
function determineFrequency(korean: string, tags: string[]): 'common' | 'occasional' | 'rare' {
  const commonPlaces = [
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '제주',
    '한강',
    '한라산',
    '설악산',
    '지리산',
    '독도',
    '강남',
    '홍대',
    '명동',
  ];
  if (commonPlaces.some((p) => korean.includes(p))) {
    return 'common';
  }

  if (
    tags.includes('province') ||
    tags.includes('metropolitan') ||
    tags.includes('national-park')
  ) {
    return 'occasional';
  }

  return 'rare';
}

// 예문 생성
function generateExamples(
  korean: string,
  english: string,
  description: string,
  tags: string[],
): {
  ko: { beginner: string; intermediate: string; advanced: string; master: string };
  en: { beginner: string; intermediate: string; advanced: string; master: string };
} {
  // 산
  if (tags.includes('mountain')) {
    return {
      ko: {
        beginner: `${korean}은/는 아름답습니다.`,
        intermediate: `${korean}에 등산하러 갔습니다.`,
        advanced: `${korean}은/는 많은 등산객이 찾는 명소입니다.`,
        master: `${korean}의 생태계와 지질학적 특성은 연구 가치가 높습니다.`,
      },
      en: {
        beginner: `${english} is beautiful.`,
        intermediate: `I went hiking at ${english}.`,
        advanced: `${english} is a popular destination for many hikers.`,
        master: `The ecosystem and geological features of ${english} are of high research value.`,
      },
    };
  }

  // 강
  if (tags.includes('river')) {
    return {
      ko: {
        beginner: `${korean}은/는 깁니다.`,
        intermediate: `${korean} 근처에서 산책했습니다.`,
        advanced: `${korean}은/는 주변 지역의 주요 수자원입니다.`,
        master: `${korean}의 유역은 역사적으로 문명 발전에 중요한 역할을 했습니다.`,
      },
      en: {
        beginner: `${english} is long.`,
        intermediate: `I took a walk near ${english}.`,
        advanced: `${english} is a major water source for the surrounding area.`,
        master: `The basin of ${english} has historically played an important role in civilization development.`,
      },
    };
  }

  // 섬
  if (tags.includes('island')) {
    return {
      ko: {
        beginner: `${korean}에 가고 싶습니다.`,
        intermediate: `${korean}은/는 아름다운 해변이 있습니다.`,
        advanced: `${korean}은/는 독특한 문화와 자연환경을 가지고 있습니다.`,
        master: `${korean}의 생태계는 본토와 다른 특성을 보입니다.`,
      },
      en: {
        beginner: `I want to go to ${english}.`,
        intermediate: `${english} has beautiful beaches.`,
        advanced: `${english} has a unique culture and natural environment.`,
        master: `The ecosystem of ${english} shows different characteristics from the mainland.`,
      },
    };
  }

  // 해변
  if (tags.includes('beach')) {
    return {
      ko: {
        beginner: `${korean}에서 수영했습니다.`,
        intermediate: `${korean}은/는 여름에 사람이 많습니다.`,
        advanced: `${korean}은/는 해수욕과 서핑으로 유명합니다.`,
        master: `${korean}의 해안 지형은 오랜 시간에 걸쳐 형성되었습니다.`,
      },
      en: {
        beginner: `I swam at ${english}.`,
        intermediate: `${english} is crowded in summer.`,
        advanced: `${english} is famous for swimming and surfing.`,
        master: `The coastal terrain of ${english} was formed over a long period of time.`,
      },
    };
  }

  // 국립공원
  if (tags.includes('national-park')) {
    return {
      ko: {
        beginner: `${korean}에 갔습니다.`,
        intermediate: `${korean}에서 캠핑을 했습니다.`,
        advanced: `${korean}은/는 다양한 야생동물의 서식지입니다.`,
        master: `${korean}의 보전 정책은 생태계 보호에 기여하고 있습니다.`,
      },
      en: {
        beginner: `I went to ${english}.`,
        intermediate: `I went camping at ${english}.`,
        advanced: `${english} is a habitat for various wildlife.`,
        master: `The conservation policies of ${english} contribute to ecosystem protection.`,
      },
    };
  }

  // 도시/지역
  if (tags.includes('city') || tags.includes('district') || tags.includes('province')) {
    return {
      ko: {
        beginner: `${korean}에 삽니다.`,
        intermediate: `${korean}에서 친구를 만났습니다.`,
        advanced: `${korean}은/는 역사적으로 중요한 지역입니다.`,
        master: `${korean}의 도시 발전은 한국 현대화의 축소판입니다.`,
      },
      en: {
        beginner: `I live in ${english}.`,
        intermediate: `I met a friend in ${english}.`,
        advanced: `${english} is a historically important area.`,
        master: `The urban development of ${english} is a microcosm of Korea's modernization.`,
      },
    };
  }

  // 댐/호수
  if (tags.includes('dam') || tags.includes('lake')) {
    return {
      ko: {
        beginner: `${korean}은/는 큽니다.`,
        intermediate: `${korean}에서 낚시를 했습니다.`,
        advanced: `${korean}은/는 수력 발전과 용수 공급에 중요합니다.`,
        master: `${korean}의 건설은 주변 생태계에 큰 영향을 미쳤습니다.`,
      },
      en: {
        beginner: `${english} is large.`,
        intermediate: `I went fishing at ${english}.`,
        advanced: `${english} is important for hydroelectric power and water supply.`,
        master: `The construction of ${english} has significantly affected the surrounding ecosystem.`,
      },
    };
  }

  // 기본 (지리 일반)
  return {
    ko: {
      beginner: `${korean}을/를 배웠습니다.`,
      intermediate: `${korean}은/는 한국의 중요한 지리 요소입니다.`,
      advanced: `${korean}은/는 한국 지리를 이해하는 데 필수적입니다.`,
      master: `${korean}에 대한 이해는 한국 문화와 역사를 깊이 있게 파악하는 데 도움이 됩니다.`,
    },
    en: {
      beginner: `I learned about ${english}.`,
      intermediate: `${english} is an important geographical element of Korea.`,
      advanced: `${english} is essential for understanding Korean geography.`,
      master: `Understanding ${english} helps to deeply grasp Korean culture and history.`,
    },
  };
}

// MD 파일 파싱
function parseMarkdownFile(content: string): Entry[] {
  const entries: Entry[] = [];
  const lines = content.split('\n');

  let currentSection = '';
  let currentSubSection = '';
  const existingIds = new Set<string>();

  for (const rawLine of lines) {
    const line = rawLine?.trim() ?? '';
    if (!line) continue;

    // 섹션 헤더 감지
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '');
      continue;
    }
    if (line.startsWith('### ')) {
      currentSubSection = line.replace('### ', '');
      continue;
    }
    if (line.startsWith('#### ')) {
      currentSubSection = line.replace('#### ', '');
      continue;
    }

    // 테이블 행 파싱 (| English | 한국어 | 설명 | 형식)
    if (line.startsWith('|') && !line.includes('---') && !line.includes('English')) {
      const parts = line
        .split('|')
        .map((p) => p.trim())
        .filter((p) => p);
      if (parts.length >= 2) {
        const english = parts[0] ?? '';
        const korean = parts[1] ?? '';
        const description = parts[2] ?? '';

        // 빈 값 스킵
        if (!english || !korean || korean === '한국어') continue;

        // ID 생성
        let id = toId(english);
        if (!id || existingIds.has(id)) {
          // 중복 시 korean 기반 ID 생성
          id = toId(korean.replace(/[^a-zA-Z0-9가-힣\s]/g, ''));
          if (!id) id = `geo-${existingIds.size}`;
          if (existingIds.has(id)) {
            id = `${id}-${existingIds.size}`;
          }
        }
        existingIds.add(id);

        // 태그 결정
        const sectionContext = `${currentSection} ${currentSubSection}`;
        const tags = determineTags(description, sectionContext);

        // 난이도 및 빈도 결정
        const difficulty = determineDifficulty(korean, english, tags);
        const frequency = determineFrequency(korean, tags);

        // 로마자 표기
        const romanization = toRomanization(korean);

        // 예문 생성
        const examples = generateExamples(korean, english, description, tags);

        const entry: Entry = {
          id,
          korean,
          romanization,
          partOfSpeech: 'noun',
          categoryId: 'geography',
          difficulty,
          frequency,
          tags,
          translations: {
            ko: {
              word: korean,
              explanation: description || `${korean}에 대한 설명입니다.`,
              examples: examples.ko,
            },
            en: {
              word: english,
              explanation: description || `Information about ${english}.`,
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

// 메인 함수
async function main() {
  const projectRoot = path.resolve(import.meta.dirname, '..');
  const repoRoot = path.resolve(projectRoot, '../..');

  // MD 파일 읽기
  const mdPath = path.join(repoRoot, 'data/context/korea-geography-vocabulary.md');
  const mdContent = fs.readFileSync(mdPath, 'utf-8');

  console.log('📖 Parsing korea-geography-vocabulary.md...');
  const newEntries = parseMarkdownFile(mdContent);
  console.log(`   Found ${newEntries.length} entries`);

  // 기존 geography.json 읽기
  const jsonPath = path.join(projectRoot, 'app/data/entries/geography.json');
  let existingEntries: Entry[] = [];
  if (fs.existsSync(jsonPath)) {
    existingEntries = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`📂 Existing entries: ${existingEntries.length}`);
  }

  // 기존 ID 수집
  const existingIds = new Set(existingEntries.map((e) => e.id));

  // 새 엔트리만 추가 (중복 제외)
  const entriesToAdd = newEntries.filter((e) => !existingIds.has(e.id));
  console.log(`➕ New entries to add: ${entriesToAdd.length}`);

  // 병합
  const mergedEntries = [...existingEntries, ...entriesToAdd];
  console.log(`📝 Total entries after merge: ${mergedEntries.length}`);

  // 저장
  fs.writeFileSync(jsonPath, JSON.stringify(mergedEntries, null, 2), 'utf-8');
  console.log(`✅ Saved to ${jsonPath}`);

  // data/context/entries에도 복사
  const dataEntriesPath = path.join(repoRoot, 'data/context/entries/geography.json');
  fs.writeFileSync(dataEntriesPath, JSON.stringify(mergedEntries, null, 2), 'utf-8');
  console.log(`✅ Copied to ${dataEntriesPath}`);

  // 통계 출력
  const tagCounts: Record<string, number> = {};
  for (const entry of mergedEntries) {
    for (const tag of entry.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }

  console.log('\n📊 Tag distribution:');
  Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([tag, count]) => {
      console.log(`   ${tag}: ${count}`);
    });
}

main().catch(console.error);
