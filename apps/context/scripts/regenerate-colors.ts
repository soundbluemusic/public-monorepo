/**
 * Regenerate colors.json with proper examples
 * Run with: pnpm tsx apps/context/scripts/regenerate-colors.ts
 *
 * 470개 색상 어휘의 예문을 자연스러운 문장으로 재생성합니다.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// ============================================
// 타입 정의
// ============================================

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
    ko: TranslationContent;
    en: TranslationContent;
  };
  pronunciation: {
    korean: string;
    ipa: string;
  };
}

/** 예문 타입 */
interface Examples {
  beginner: string;
  intermediate: string;
  advanced: string;
  master: string;
}

/** 변형 타입 */
interface Variations {
  formal: string[];
  casual: string[];
  short: string[];
}

/** 대화 항목 타입 */
interface DialogueItem {
  speaker: 'A' | 'B';
  text: string;
  romanization: string;
  translation: string;
}

/** 대화 타입 */
interface Dialogue {
  context: string;
  dialogue: DialogueItem[];
}

/** 다국어 예문 반환 타입 */
interface LocalizedExamples {
  ko: Examples;
  en: Examples;
}

/** 다국어 변형 반환 타입 */
interface LocalizedVariations {
  ko: Variations;
  en: Variations;
}

/** 다국어 대화 반환 타입 */
interface LocalizedDialogue {
  ko: Dialogue;
  en: Dialogue;
}

interface TranslationContent {
  word: string;
  explanation: string;
  examples: Examples;
  variations: Variations;
  dialogue: Dialogue;
}

// ============================================
// 한글 조사 처리 유틸리티
// ============================================

function hasBatchim(word: string): boolean {
  const lastChar = word[word.length - 1];
  if (!lastChar) return false;
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

function eunNeun(word: string): string {
  return hasBatchim(word) ? '은' : '는';
}

function iGa(word: string): string {
  return hasBatchim(word) ? '이' : '가';
}

function eulReul(word: string): string {
  return hasBatchim(word) ? '을' : '를';
}

function euroRo(word: string): string {
  return hasBatchim(word) ? '으로' : '로';
}

function iYa(word: string): string {
  return hasBatchim(word) ? '이야' : '야';
}

function ieyo(word: string): string {
  return hasBatchim(word) ? '이에요' : '예요';
}

// ============================================
// 색상 분류
// ============================================

const BASIC_COLORS = new Set([
  '빨강',
  '빨간색',
  '주황',
  '주황색',
  '노랑',
  '노란색',
  '초록',
  '초록색',
  '파랑',
  '파란색',
  '보라',
  '보라색',
  '분홍',
  '분홍색',
  '갈색',
  '검정',
  '검은색',
  '흰색',
  '하얀색',
  '회색',
]);

const KOREAN_TRADITIONAL_COLORS = new Set([
  '단청 빨강',
  '오방색 청색',
  '오방색 적색',
  '오방색 황색',
  '오방색 백색',
  '오방색 흑색',
  '청자색',
  '한복 남색',
  '먹색',
  '쪽색',
  '옥색',
  '황제 노랑',
  '명나라 파랑',
  '주사',
  '진사',
  '단풍',
  '벚꽃',
  '벚꽃색',
  '진달래',
  '동백',
  '모란',
  '국화',
  '연꽃',
]);

const NATURE_COLORS = new Set([
  '하늘색',
  '바다 파랑',
  '숲 초록',
  '모래색',
  '흙색',
  '석양 오렌지',
  '새벽 분홍',
  '자정색',
  '황혼색',
  '얼음 파랑',
  '눈 흰색',
  '폭풍 회색',
]);

const FOOD_COLORS = new Set([
  '살몬',
  '토마토',
  '레몬',
  '라임',
  '체리',
  '딸기',
  '수박',
  '포도',
  '복숭아',
  '망고',
  '귤색',
  '바나나',
  '아보카도',
  '민트',
  '초콜릿',
  '카라멜',
  '바닐라',
  '커피',
  '모카',
  '라떼',
  '에스프레소',
  '꿀색',
  '버터',
  '크림',
  '와인',
  '샴페인',
  '머스타드',
  '시나몬',
  '생강색',
  '호박',
  '호박색',
  '밤색',
  '가지색',
]);

const GEM_COLORS = new Set([
  '루비',
  '사파이어',
  '에메랄드',
  '자수정',
  '토파즈',
  '진주',
  '오닉스',
  '제이드',
  '오팔',
  '가넷',
  '앰버',
  '흑요석',
  '라피스 라줄리',
  '말라카이트',
]);

const METAL_COLORS = new Set([
  '골드',
  '실버',
  '브론즈',
  '코퍼',
  '플래티넘',
  '로즈 골드',
  '브라스',
  '퓨터',
  '크롬',
  '티타늄',
]);

// ============================================
// 예문 생성 함수
// ============================================

function generateBasicColorExamples(korean: string, english: string): LocalizedExamples {
  const isColor = korean.endsWith('색');
  const baseColor = isColor ? korean.slice(0, -1) : korean;

  return {
    ko: {
      beginner: `${korean}${iGa(korean)} 예뻐요.`,
      intermediate: `이 옷${eunNeun('옷')} ${korean}${ieyo(korean)}`,
      advanced: `${korean}${eunNeun(korean)} 따뜻한 느낌을 줍니다.`,
      master: `인테리어에 ${korean}${eulReul(korean)} 포인트로 사용하면 공간이 화사해집니다.`,
    },
    en: {
      beginner: `${english} is pretty.`,
      intermediate: `This clothing is ${english.toLowerCase()}.`,
      advanced: `${english} gives a warm feeling.`,
      master: `Using ${english.toLowerCase()} as an accent in interior design brightens up the space.`,
    },
  };
}

function generateTraditionalColorExamples(korean: string, english: string): LocalizedExamples {
  return {
    ko: {
      beginner: `${korean}${iGa(korean)} 아름다워요.`,
      intermediate: `한복에 ${korean}${iGa(korean)} 많이 쓰여요.`,
      advanced: `${korean}${eunNeun(korean)} 한국 전통 건축에서 볼 수 있습니다.`,
      master: `${korean}${eunNeun(korean)} 한국의 전통 미술과 공예에서 중요한 역할을 합니다.`,
    },
    en: {
      beginner: `${english} is beautiful.`,
      intermediate: `${english} is often used in hanbok.`,
      advanced: `${english} can be seen in traditional Korean architecture.`,
      master: `${english} plays an important role in Korean traditional art and crafts.`,
    },
  };
}

function generateNatureColorExamples(korean: string, english: string): LocalizedExamples {
  return {
    ko: {
      beginner: `${korean}${iGa(korean)} 좋아요.`,
      intermediate: `자연에서 ${korean}${eulReul(korean)} 볼 수 있어요.`,
      advanced: `${korean}${eunNeun(korean)} 자연의 아름다움을 담고 있습니다.`,
      master: `사진작가들은 ${korean}${eulReul(korean)} 포착하기 위해 특정 시간대를 기다립니다.`,
    },
    en: {
      beginner: `I like ${english.toLowerCase()}.`,
      intermediate: `You can see ${english.toLowerCase()} in nature.`,
      advanced: `${english} captures the beauty of nature.`,
      master: `Photographers wait for specific times to capture ${english.toLowerCase()}.`,
    },
  };
}

function generateFoodColorExamples(korean: string, english: string): LocalizedExamples {
  return {
    ko: {
      beginner: `${korean}${iGa(korean)} 예뻐요.`,
      intermediate: `이 립스틱${eunNeun('립스틱')} ${korean}${ieyo(korean)}`,
      advanced: `${korean}${eunNeun(korean)} 따뜻하고 부드러운 느낌을 줍니다.`,
      master: `패션에서 ${korean}${eunNeun(korean)} 친근하고 자연스러운 이미지를 연출합니다.`,
    },
    en: {
      beginner: `${english} is pretty.`,
      intermediate: `This lipstick is ${english.toLowerCase()}.`,
      advanced: `${english} gives a warm and soft feeling.`,
      master: `In fashion, ${english.toLowerCase()} creates a friendly and natural image.`,
    },
  };
}

function generateGemColorExamples(korean: string, english: string): LocalizedExamples {
  return {
    ko: {
      beginner: `${korean}${iGa(korean)} 반짝여요.`,
      intermediate: `이 반지는 ${korean}${euroRo(korean)} 만들었어요.`,
      advanced: `${korean}${eunNeun(korean)} 고급스러운 느낌을 줍니다.`,
      master: `${korean}${eunNeun(korean)} 보석의 아름다움에서 영감을 받은 색상입니다.`,
    },
    en: {
      beginner: `${english} sparkles.`,
      intermediate: `This ring is made of ${english.toLowerCase()}.`,
      advanced: `${english} gives a luxurious feeling.`,
      master: `${english} is a color inspired by the beauty of gemstones.`,
    },
  };
}

function generateMetalColorExamples(korean: string, english: string): LocalizedExamples {
  return {
    ko: {
      beginner: `${korean}${iGa(korean)} 멋있어요.`,
      intermediate: `이 시계는 ${korean}${ieyo(korean)}`,
      advanced: `${korean}${eunNeun(korean)} 현대적이고 세련된 느낌을 줍니다.`,
      master: `인테리어 디자인에서 ${korean}${eunNeun(korean)} 고급스러운 액센트로 활용됩니다.`,
    },
    en: {
      beginner: `${english} looks cool.`,
      intermediate: `This watch is ${english.toLowerCase()}.`,
      advanced: `${english} gives a modern and sophisticated feeling.`,
      master: `In interior design, ${english.toLowerCase()} is used as a luxurious accent.`,
    },
  };
}

function generateCSSColorExamples(korean: string, english: string): LocalizedExamples {
  return {
    ko: {
      beginner: `${korean}${iGa(korean)} 예뻐요.`,
      intermediate: `웹사이트 배경을 ${korean}${euroRo(korean)} 했어요.`,
      advanced: `${korean}${eunNeun(korean)} 웹 디자인에서 자주 사용됩니다.`,
      master: `CSS에서 ${korean}${eunNeun(korean)} 표준 색상명으로 지정되어 있습니다.`,
    },
    en: {
      beginner: `${english} is pretty.`,
      intermediate: `I made the website background ${english.toLowerCase()}.`,
      advanced: `${english} is frequently used in web design.`,
      master: `In CSS, ${english.toLowerCase()} is designated as a standard color name.`,
    },
  };
}

function generateGenericColorExamples(korean: string, english: string): LocalizedExamples {
  return {
    ko: {
      beginner: `${korean}${iGa(korean)} 좋아요.`,
      intermediate: `이 색깔${eunNeun('색깔')} ${korean}${ieyo(korean)}`,
      advanced: `${korean}${eunNeun(korean)} 다양한 분야에서 사용됩니다.`,
      master: `디자이너들은 ${korean}${eulReul(korean)} 특별한 분위기를 연출할 때 사용합니다.`,
    },
    en: {
      beginner: `I like ${english.toLowerCase()}.`,
      intermediate: `This color is ${english.toLowerCase()}.`,
      advanced: `${english} is used in various fields.`,
      master: `Designers use ${english.toLowerCase()} to create a special atmosphere.`,
    },
  };
}

function getExamplesForColor(korean: string, english: string): LocalizedExamples {
  if (BASIC_COLORS.has(korean)) {
    return generateBasicColorExamples(korean, english);
  }
  if (KOREAN_TRADITIONAL_COLORS.has(korean)) {
    return generateTraditionalColorExamples(korean, english);
  }
  if (NATURE_COLORS.has(korean)) {
    return generateNatureColorExamples(korean, english);
  }
  if (FOOD_COLORS.has(korean)) {
    return generateFoodColorExamples(korean, english);
  }
  if (GEM_COLORS.has(korean)) {
    return generateGemColorExamples(korean, english);
  }
  if (METAL_COLORS.has(korean)) {
    return generateMetalColorExamples(korean, english);
  }
  // CSS 색상명 또는 기타
  return generateCSSColorExamples(korean, english);
}

// ============================================
// Variations 생성
// ============================================

function generateVariations(korean: string, english: string): LocalizedVariations {
  return {
    ko: {
      formal: [`${korean}입니다.`, `${korean}${iGa(korean)} 있습니다.`],
      casual: [`${korean}${iYa(korean)}.`, `${korean} 있어.`],
      short: [korean],
    },
    en: {
      formal: [`It is ${english.toLowerCase()}.`, `There is ${english.toLowerCase()}.`],
      casual: [`It's ${english.toLowerCase()}.`, `${english}, you know.`],
      short: [english],
    },
  };
}

// ============================================
// Dialogue 생성
// ============================================

function generateDialogue(
  korean: string,
  english: string,
  romanization: string,
): LocalizedDialogue {
  const ieyoSuffix = hasBatchim(korean) ? 'ieyo' : 'yeyo';
  return {
    ko: {
      context: '옷 가게에서',
      dialogue: [
        {
          speaker: 'A' as const,
          text: `이 옷${eunNeun('옷')} 무슨 색이에요?`,
          romanization: 'i oseun museun saegieyo?',
          translation: 'What color is this clothing?',
        },
        {
          speaker: 'B' as const,
          text: `${korean}${ieyo(korean)} 예쁘죠?`,
          romanization: `${romanization}${ieyoSuffix}. yeppeujo?`,
          translation: `It's ${english.toLowerCase()}. Pretty, right?`,
        },
      ],
    },
    en: {
      context: 'At a clothing store',
      dialogue: [
        {
          speaker: 'A' as const,
          text: 'What color is this clothing?',
          romanization: '',
          translation: `이 옷${eunNeun('옷')} 무슨 색이에요?`,
        },
        {
          speaker: 'B' as const,
          text: `It's ${english.toLowerCase()}. Pretty, right?`,
          romanization: '',
          translation: `${korean}${ieyo(korean)} 예쁘죠?`,
        },
      ],
    },
  };
}

// ============================================
// 메인 실행
// ============================================

async function main() {
  const colorsPath = join(process.cwd(), 'data/context/entries/colors.json');
  console.log('📂 Reading colors.json...');

  const entries: Entry[] = JSON.parse(readFileSync(colorsPath, 'utf-8'));
  console.log(`📊 Found ${entries.length} color entries`);

  let updated = 0;

  for (const entry of entries) {
    const korean = entry.korean;
    const englishKo = entry.translations.ko.word;
    const englishEn = entry.translations.en.word;
    const romanization = entry.romanization;

    // 예문 생성
    const examples = getExamplesForColor(korean, englishEn);

    // 한국어 번역 업데이트
    entry.translations.ko.explanation = `'${korean}'${eunNeun(korean)} '${englishEn}'를 의미합니다.`;
    entry.translations.ko.examples = examples.ko;

    // 영어 번역 업데이트
    entry.translations.en.explanation = `'${korean}' means '${englishEn}' in English.`;
    entry.translations.en.examples = examples.en;

    // Variations 업데이트
    const variations = generateVariations(korean, englishEn);
    entry.translations.ko.variations = variations.ko;
    entry.translations.en.variations = variations.en;

    // Dialogue 업데이트
    const dialogue = generateDialogue(korean, englishEn, romanization);
    entry.translations.ko.dialogue = dialogue.ko;
    entry.translations.en.dialogue = dialogue.en;

    updated++;

    if (updated % 50 === 0) {
      console.log(`⏳ Processed ${updated}/${entries.length} entries...`);
    }
  }

  // 결과 저장
  console.log('\n💾 Writing updated colors.json...');
  writeFileSync(colorsPath, JSON.stringify(entries, null, 2), 'utf-8');

  console.log(`\n✅ Successfully updated ${updated} color entries!`);
}

main().catch(console.error);
