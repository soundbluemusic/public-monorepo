/**
 * 모든 카테고리 어휘 고품질 예문 생성 스크립트
 *
 * 각 어휘마다:
 * 1. 문장예문 4레벨 (beginner, intermediate, advanced, master)
 * 2. 대화예문 (2-4턴)
 *
 * 카테고리별 맥락에 맞는 자연스러운 예문 생성
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// ============================================
// 타입 정의
// ============================================

interface DialogueLine {
  speaker: 'A' | 'B';
  text: string;
  romanization: string;
  translation: string;
}

interface EntryDialogue {
  context: string;
  dialogue: DialogueLine[];
}

interface Examples {
  beginner: string;
  intermediate: string;
  advanced: string;
  master: string;
}

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
      examples: Examples;
      dialogue?: EntryDialogue;
    };
    en: {
      word: string;
      explanation: string;
      examples: Examples;
      dialogue?: EntryDialogue;
    };
  };
}

// ============================================
// 로마자 변환 (한글 → 로마자)
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
      result += ' ';
    } else if (/[?!.,]/.test(char)) {
      result += char;
    } else {
      result += char;
    }
  }
  return result.toLowerCase().replace(/\s+/g, ' ').trim();
}

// ============================================
// 조사 처리 헬퍼
// ============================================

/**
 * 한글 단어의 마지막 글자 받침 유무에 따라 올바른 조사를 붙여 반환합니다.
 * 예: josa('경찰서', '을/를') → '경찰서를'
 *     josa('학생', '을/를') → '학생을'
 */
function josa(
  word: string,
  type: '을/를' | '이/가' | '은/는' | '으로/로' | '이에요/예요' | '과/와' | '아/야',
): string {
  const lastChar = word.charCodeAt(word.length - 1);
  // 한글 범위가 아니면 받침 없는 것으로 처리
  const hasBatchim = lastChar >= 0xac00 && lastChar <= 0xd7a3 && (lastChar - 0xac00) % 28 !== 0;

  switch (type) {
    case '을/를':
      return word + (hasBatchim ? '을' : '를');
    case '이/가':
      return word + (hasBatchim ? '이' : '가');
    case '은/는':
      return word + (hasBatchim ? '은' : '는');
    case '으로/로':
      return word + (hasBatchim ? '으로' : '로');
    case '이에요/예요':
      return word + (hasBatchim ? '이에요' : '예요');
    case '과/와':
      return word + (hasBatchim ? '과' : '와');
    case '아/야':
      return word + (hasBatchim ? '아' : '야');
  }
}

// ============================================
// 카테고리별 예문 템플릿
// ============================================

interface ExampleTemplates {
  sentences: {
    ko: Examples;
    en: Examples;
  };
  dialogues: {
    context: { ko: string; en: string };
    lines: Array<{
      speaker: 'A' | 'B';
      ko: string;
      en: string;
    }>;
  }[];
}

type CategoryTemplates = Record<
  string,
  (korean: string, english: string, explanation: string, partOfSpeech: string) => ExampleTemplates
>;

const categoryTemplates: CategoryTemplates = {
  // ============================================
  // 인사 (greetings)
  // ============================================
  greetings: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}" 라고 인사해요.`,
        intermediate: `한국에서는 "${korean}"라고 자주 말해요.`,
        advanced: `"${korean}"는 한국어에서 중요한 인사 표현입니다.`,
        master: `"${korean}"의 문화적 맥락을 이해하면 한국인과의 소통이 더 자연스러워집니다.`,
      },
      en: {
        beginner: `We say "${korean}" to greet.`,
        intermediate: `In Korea, people often say "${korean}".`,
        advanced: `"${korean}" is an important greeting expression in Korean.`,
        master: `Understanding the cultural context of "${korean}" makes communication with Koreans more natural.`,
      },
    },
    dialogues: [
      {
        context: { ko: '처음 만나서 인사하며', en: 'Meeting for the first time' },
        lines: [
          { speaker: 'A', ko: `${korean}!`, en: `${english}!` },
          { speaker: 'B', ko: '안녕하세요! 만나서 반갑습니다.', en: 'Hello! Nice to meet you.' },
          { speaker: 'A', ko: '저도 만나서 반가워요.', en: 'Nice to meet you too.' },
          { speaker: 'B', ko: '오늘 날씨가 좋네요!', en: 'The weather is nice today!' },
        ],
      },
    ],
  }),

  // ============================================
  // 음식 (food)
  // ============================================
  food: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 먹어요.`,
        intermediate: `${josa(korean, '이/가')} 맛있어요.`,
        advanced: `${josa(korean, '은/는')} 한국의 대표적인 음식 중 하나입니다.`,
        master: `${korean}의 조리법과 역사는 한국 식문화를 이해하는 데 중요합니다.`,
      },
      en: {
        beginner: `I eat ${english.toLowerCase()}.`,
        intermediate: `${english} is delicious.`,
        advanced: `${english} is one of Korea's representative foods.`,
        master: `The cooking method and history of ${english.toLowerCase()} is important for understanding Korean food culture.`,
      },
    },
    dialogues: [
      {
        context: { ko: '식당에서 주문하며', en: 'Ordering at a restaurant' },
        lines: [
          { speaker: 'A', ko: '뭐 드시겠어요?', en: 'What would you like?' },
          { speaker: 'B', ko: `${korean} 주세요.`, en: `${english}, please.` },
          { speaker: 'A', ko: '음료는요?', en: 'Any drinks?' },
          { speaker: 'B', ko: '물 주세요.', en: 'Water, please.' },
        ],
      },
    ],
  }),

  // ============================================
  // 일상생활 (daily-life)
  // ============================================
  'daily-life': (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `매일 ${josa(korean, '을/를')} 해요.`,
        intermediate: `${josa(korean, '은/는')} 일상에서 중요해요.`,
        advanced: `${josa(korean, '을/를')} 통해 규칙적인 생활을 유지합니다.`,
        master: `${korean}의 습관화는 삶의 질을 향상시키는 핵심입니다.`,
      },
      en: {
        beginner: `I ${english.toLowerCase()} every day.`,
        intermediate: `${english} is important in daily life.`,
        advanced: `Through ${english.toLowerCase()}, I maintain a regular lifestyle.`,
        master: `Making ${english.toLowerCase()} a habit is key to improving quality of life.`,
      },
    },
    dialogues: [
      {
        context: { ko: '일상에 대해 이야기하며', en: 'Talking about daily routines' },
        lines: [
          {
            speaker: 'A',
            ko: '아침에 보통 뭐 해요?',
            en: 'What do you usually do in the morning?',
          },
          {
            speaker: 'B',
            ko: `저는 ${josa(korean, '을/를')} 해요.`,
            en: `I ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '매일 해요?', en: 'Do you do it every day?' },
          { speaker: 'B', ko: '네, 거의 매일 해요.', en: 'Yes, almost every day.' },
        ],
      },
    ],
  }),

  // ============================================
  // 감정 (emotions)
  // ============================================
  emotions: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `저는 ${korean}해요.`,
        intermediate: `오늘은 좀 ${korean}한 기분이에요.`,
        advanced: `${korean}한 감정을 표현하는 것은 중요합니다.`,
        master: `${korean}이라는 감정의 뉘앙스를 이해하면 한국어 의사소통이 깊어집니다.`,
      },
      en: {
        beginner: `I feel ${english.toLowerCase()}.`,
        intermediate: `Today I feel a bit ${english.toLowerCase()}.`,
        advanced: `Expressing ${english.toLowerCase()} feelings is important.`,
        master: `Understanding the nuance of ${english.toLowerCase()} deepens Korean communication.`,
      },
    },
    dialogues: [
      {
        context: { ko: '친구와 감정을 나누며', en: 'Sharing feelings with a friend' },
        lines: [
          { speaker: 'A', ko: '오늘 기분이 어때요?', en: 'How do you feel today?' },
          { speaker: 'B', ko: `좀 ${korean}해요.`, en: `I feel a bit ${english.toLowerCase()}.` },
          { speaker: 'A', ko: '왜요? 무슨 일 있어요?', en: 'Why? What happened?' },
          { speaker: 'B', ko: '그냥 요즘 좀 그래요.', en: 'Just feeling that way lately.' },
        ],
      },
    ],
  }),

  // ============================================
  // 가족 (family)
  // ============================================
  family: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `제 ${josa(korean, '이에요/예요')}.`,
        intermediate: `${josa(korean, '과/와')} 함께 살아요.`,
        advanced: `${josa(korean, '과/와')}의 관계는 가정에서 중요합니다.`,
        master: `한국 문화에서 ${korean}의 역할은 전통적 가치관을 반영합니다.`,
      },
      en: {
        beginner: `This is my ${english.toLowerCase()}.`,
        intermediate: `I live with my ${english.toLowerCase()}.`,
        advanced: `The relationship with ${english.toLowerCase()} is important in the family.`,
        master: `The role of ${english.toLowerCase()} in Korean culture reflects traditional values.`,
      },
    },
    dialogues: [
      {
        context: { ko: '가족을 소개하며', en: 'Introducing family' },
        lines: [
          { speaker: 'A', ko: '가족이 어떻게 되세요?', en: 'Tell me about your family.' },
          {
            speaker: 'B',
            ko: `${josa(korean, '이/가')} 있어요.`,
            en: `I have a ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '같이 사세요?', en: 'Do you live together?' },
          { speaker: 'B', ko: '네, 같이 살아요.', en: 'Yes, we live together.' },
        ],
      },
    ],
  }),

  // ============================================
  // 직장 (work)
  // ============================================
  work: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `회사에서 ${josa(korean, '을/를')} 해요.`,
        intermediate: `${josa(korean, '이/가')} 제 업무예요.`,
        advanced: `${josa(korean, '은/는')} 직장 생활에서 필수적인 능력입니다.`,
        master: `${korean}의 전문성을 기르는 것이 커리어 발전의 핵심입니다.`,
      },
      en: {
        beginner: `I do ${english.toLowerCase()} at work.`,
        intermediate: `${english} is my job.`,
        advanced: `${english} is an essential skill in work life.`,
        master: `Developing expertise in ${english.toLowerCase()} is key to career advancement.`,
      },
    },
    dialogues: [
      {
        context: { ko: '직장에서 업무를 논의하며', en: 'Discussing work at the office' },
        lines: [
          { speaker: 'A', ko: '오늘 뭐 해야 해요?', en: 'What do we need to do today?' },
          {
            speaker: 'B',
            ko: `${josa(korean, '을/를')} 해야 해요.`,
            en: `We need to ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '언제까지요?', en: 'By when?' },
          { speaker: 'B', ko: '오늘 안에 끝내야 해요.', en: 'We need to finish by today.' },
        ],
      },
    ],
  }),

  // ============================================
  // 교통 (transportation)
  // ============================================
  transportation: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 타요.`,
        intermediate: `${josa(korean, '으로/로')} 출퇴근해요.`,
        advanced: `${josa(korean, '은/는')} 도시 교통의 중요한 수단입니다.`,
        master: `${korean} 시스템의 발전은 도시 인프라 현대화를 보여줍니다.`,
      },
      en: {
        beginner: `I take the ${english.toLowerCase()}.`,
        intermediate: `I commute by ${english.toLowerCase()}.`,
        advanced: `${english} is an important means of urban transportation.`,
        master: `The development of ${english.toLowerCase()} systems shows urban infrastructure modernization.`,
      },
    },
    dialogues: [
      {
        context: { ko: '교통수단에 대해 이야기하며', en: 'Talking about transportation' },
        lines: [
          { speaker: 'A', ko: '보통 뭐 타고 다녀요?', en: 'What do you usually take?' },
          {
            speaker: 'B',
            ko: `${josa(korean, '을/를')} 타요.`,
            en: `I take the ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '편해요?', en: 'Is it convenient?' },
          { speaker: 'B', ko: '네, 아주 편해요.', en: 'Yes, very convenient.' },
        ],
      },
    ],
  }),

  // ============================================
  // 쇼핑 (shopping)
  // ============================================
  shopping: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 사요.`,
        intermediate: `${josa(korean, '이/가')} 세일이에요.`,
        advanced: `${josa(korean, '을/를')} 구매할 때 품질을 확인해야 합니다.`,
        master: `${korean} 시장의 트렌드를 이해하면 현명한 소비가 가능합니다.`,
      },
      en: {
        beginner: `I buy ${english.toLowerCase()}.`,
        intermediate: `${english} is on sale.`,
        advanced: `When buying ${english.toLowerCase()}, you should check the quality.`,
        master: `Understanding ${english.toLowerCase()} market trends enables smart consumption.`,
      },
    },
    dialogues: [
      {
        context: { ko: '쇼핑하며', en: 'While shopping' },
        lines: [
          { speaker: 'A', ko: '뭐 찾으세요?', en: 'What are you looking for?' },
          {
            speaker: 'B',
            ko: `${josa(korean, '을/를')} 찾고 있어요.`,
            en: `I'm looking for ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '여기 있어요.', en: 'Here it is.' },
          { speaker: 'B', ko: '얼마예요?', en: 'How much is it?' },
        ],
      },
    ],
  }),

  // ============================================
  // 여행 (travel)
  // ============================================
  travel: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}에 가요.`,
        intermediate: `${korean}에서 여행했어요.`,
        advanced: `${josa(korean, '은/는')} 관광지로 유명합니다.`,
        master: `${korean}의 문화와 역사를 체험하는 것은 여행의 진정한 가치입니다.`,
      },
      en: {
        beginner: `I go to ${english.toLowerCase()}.`,
        intermediate: `I traveled in ${english.toLowerCase()}.`,
        advanced: `${english} is famous as a tourist destination.`,
        master: `Experiencing the culture and history of ${english.toLowerCase()} is the true value of travel.`,
      },
    },
    dialogues: [
      {
        context: { ko: '여행 계획을 세우며', en: 'Planning a trip' },
        lines: [
          { speaker: 'A', ko: '어디로 여행 가고 싶어요?', en: 'Where do you want to travel?' },
          {
            speaker: 'B',
            ko: `${korean}에 가고 싶어요.`,
            en: `I want to go to ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '왜 거기요?', en: 'Why there?' },
          { speaker: 'B', ko: '경치가 좋다고 들었어요.', en: 'I heard the scenery is beautiful.' },
        ],
      },
    ],
  }),

  // ============================================
  // 시간/날짜 (time-date)
  // ============================================
  'time-date': (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `지금 ${korean}이에요.`,
        intermediate: `${korean}에 만나요.`,
        advanced: `${korean}의 개념은 일정 관리에 필수적입니다.`,
        master: `${josa(korean, '을/를')} 효율적으로 활용하는 것이 생산성의 핵심입니다.`,
      },
      en: {
        beginner: `It's ${english.toLowerCase()} now.`,
        intermediate: `Let's meet at ${english.toLowerCase()}.`,
        advanced: `The concept of ${english.toLowerCase()} is essential for schedule management.`,
        master: `Efficiently utilizing ${english.toLowerCase()} is key to productivity.`,
      },
    },
    dialogues: [
      {
        context: { ko: '약속 시간을 정하며', en: 'Setting an appointment time' },
        lines: [
          { speaker: 'A', ko: '언제 만날까요?', en: 'When shall we meet?' },
          { speaker: 'B', ko: `${korean}에 어때요?`, en: `How about ${english.toLowerCase()}?` },
          { speaker: 'A', ko: '좋아요.', en: 'Sounds good.' },
          { speaker: 'B', ko: '그럼 그때 봐요.', en: 'See you then.' },
        ],
      },
    ],
  }),

  // ============================================
  // 나라 (countries)
  // ============================================
  countries: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}에서 왔어요.`,
        intermediate: `${josa(korean, '은/는')} 아름다운 나라예요.`,
        advanced: `${korean}의 문화는 독특한 특징을 가지고 있습니다.`,
        master: `${korean}의 역사와 사회를 이해하면 국제적 시야가 넓어집니다.`,
      },
      en: {
        beginner: `I'm from ${english}.`,
        intermediate: `${english} is a beautiful country.`,
        advanced: `The culture of ${english} has unique characteristics.`,
        master: `Understanding the history and society of ${english} broadens international perspective.`,
      },
    },
    dialogues: [
      {
        context: { ko: '출신 국가에 대해 이야기하며', en: 'Talking about home countries' },
        lines: [
          { speaker: 'A', ko: '어디서 오셨어요?', en: 'Where are you from?' },
          { speaker: 'B', ko: `${korean}에서 왔어요.`, en: `I'm from ${english}.` },
          { speaker: 'A', ko: '거기 어때요?', en: "What's it like there?" },
          { speaker: 'B', ko: '정말 좋아요. 꼭 가보세요.', en: "It's great. You should visit." },
        ],
      },
    ],
  }),

  // ============================================
  // 기본 동사 (verbs-basic)
  // ============================================
  'verbs-basic': (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `저는 ${korean}요.`,
        intermediate: `매일 ${korean}요.`,
        advanced: `${korean}는 것은 중요한 활동입니다.`,
        master: `${korean}는 행위의 다양한 맥락을 이해하면 표현력이 풍부해집니다.`,
      },
      en: {
        beginner: `I ${english.toLowerCase()}.`,
        intermediate: `I ${english.toLowerCase()} every day.`,
        advanced: `${english}ing is an important activity.`,
        master: `Understanding various contexts of ${english.toLowerCase()}ing enriches expression.`,
      },
    },
    dialogues: [
      {
        context: { ko: '일상 활동에 대해 이야기하며', en: 'Talking about daily activities' },
        lines: [
          { speaker: 'A', ko: '뭐 해요?', en: 'What are you doing?' },
          { speaker: 'B', ko: `${korean}요.`, en: `I ${english.toLowerCase()}.` },
          { speaker: 'A', ko: '자주 해요?', en: 'Do you do it often?' },
          { speaker: 'B', ko: '네, 거의 매일요.', en: 'Yes, almost every day.' },
        ],
      },
    ],
  }),

  // ============================================
  // 기본 형용사 (adjectives-basic)
  // ============================================
  'adjectives-basic': (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `이것은 ${korean}요.`,
        intermediate: `정말 ${korean}네요.`,
        advanced: `${korean}다는 것은 긍정적인/부정적인 특성입니다.`,
        master: `${korean}의 뉘앙스를 이해하면 미묘한 감정 표현이 가능합니다.`,
      },
      en: {
        beginner: `This is ${english.toLowerCase()}.`,
        intermediate: `It's really ${english.toLowerCase()}.`,
        advanced: `Being ${english.toLowerCase()} is a positive/negative characteristic.`,
        master: `Understanding the nuance of ${english.toLowerCase()} enables subtle emotional expression.`,
      },
    },
    dialogues: [
      {
        context: { ko: '무언가를 평가하며', en: 'Evaluating something' },
        lines: [
          { speaker: 'A', ko: '이거 어때요?', en: 'How is this?' },
          { speaker: 'B', ko: `${korean}요.`, en: `It's ${english.toLowerCase()}.` },
          { speaker: 'A', ko: '정말요?', en: 'Really?' },
          { speaker: 'B', ko: '네, 아주 좋아요.', en: 'Yes, very nice.' },
        ],
      },
    ],
  }),

  // ============================================
  // 조사 (particles)
  // ============================================
  particles: (korean, _english, explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 사용해요.`,
        intermediate: `이 문장에서 ${josa(korean, '이/가')} 필요해요.`,
        advanced: `"${korean}"의 올바른 사용은 한국어 문법의 핵심입니다.`,
        master: `"${korean}"의 미묘한 차이를 이해하면 자연스러운 한국어 구사가 가능합니다.`,
      },
      en: {
        beginner: `Use "${korean}".`,
        intermediate: `"${korean}" is needed in this sentence.`,
        advanced: `Correct use of "${korean}" is key to Korean grammar.`,
        master: `Understanding subtle differences in "${korean}" enables natural Korean speaking.`,
      },
    },
    dialogues: [
      {
        context: { ko: '한국어를 공부하며', en: 'Studying Korean' },
        lines: [
          {
            speaker: 'A',
            ko: `${josa(korean, '은/는')} 언제 써요?`,
            en: `When do you use "${korean}"?`,
          },
          { speaker: 'B', ko: `${explanation}`, en: `${explanation}` },
          { speaker: 'A', ko: '예문을 들어 주세요.', en: 'Please give me an example.' },
          { speaker: 'B', ko: '네, 여기 예문이 있어요.', en: 'Yes, here is an example.' },
        ],
      },
    ],
  }),

  // ============================================
  // 숫자 (numbers)
  // ============================================
  numbers: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}이에요.`,
        intermediate: `${korean}개 주세요.`,
        advanced: `${korean}의 발음과 사용법을 익히는 것이 중요합니다.`,
        master: `한국어 숫자 체계에서 ${korean}의 역할을 이해하면 수량 표현이 자연스러워집니다.`,
      },
      en: {
        beginner: `It's ${english.toLowerCase()}.`,
        intermediate: `Give me ${english.toLowerCase()}, please.`,
        advanced: `Learning the pronunciation and usage of ${english.toLowerCase()} is important.`,
        master: `Understanding the role of ${english.toLowerCase()} in Korean number system makes quantity expressions natural.`,
      },
    },
    dialogues: [
      {
        context: { ko: '물건을 셀 때', en: 'Counting items' },
        lines: [
          { speaker: 'A', ko: '몇 개 드릴까요?', en: 'How many would you like?' },
          { speaker: 'B', ko: `${korean}개 주세요.`, en: `${english}, please.` },
          { speaker: 'A', ko: '알겠습니다.', en: 'Got it.' },
          { speaker: 'B', ko: '감사합니다.', en: 'Thank you.' },
        ],
      },
    ],
  }),

  // ============================================
  // 스포츠 (sports)
  // ============================================
  sports: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 해요.`,
        intermediate: `${josa(korean, '을/를')} 좋아해요.`,
        advanced: `${josa(korean, '은/는')} 체력 향상에 좋습니다.`,
        master: `${korean}의 기술과 전략을 이해하면 경기 관람이 더 재미있습니다.`,
      },
      en: {
        beginner: `I play ${english.toLowerCase()}.`,
        intermediate: `I like ${english.toLowerCase()}.`,
        advanced: `${english} is good for improving fitness.`,
        master: `Understanding the techniques and strategies of ${english.toLowerCase()} makes watching games more enjoyable.`,
      },
    },
    dialogues: [
      {
        context: { ko: '취미로 운동에 대해 이야기하며', en: 'Talking about sports as hobby' },
        lines: [
          { speaker: 'A', ko: '운동 좋아해요?', en: 'Do you like sports?' },
          {
            speaker: 'B',
            ko: `네, ${josa(korean, '을/를')} 좋아해요.`,
            en: `Yes, I like ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '자주 해요?', en: 'Do you play often?' },
          { speaker: 'B', ko: '주말마다 해요.', en: 'I play every weekend.' },
        ],
      },
    ],
  }),

  // ============================================
  // 우주 (space)
  // ============================================
  space: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '이/가')} 보여요.`,
        intermediate: `${korean}에 대해 배웠어요.`,
        advanced: `${korean}의 연구는 우주 과학에서 중요합니다.`,
        master: `${korean}에 대한 탐구는 인류의 우주 이해를 넓혀왔습니다.`,
      },
      en: {
        beginner: `I can see ${english.toLowerCase()}.`,
        intermediate: `I learned about ${english.toLowerCase()}.`,
        advanced: `Research on ${english.toLowerCase()} is important in space science.`,
        master: `Exploration of ${english.toLowerCase()} has expanded humanity's understanding of space.`,
      },
    },
    dialogues: [
      {
        context: { ko: '우주에 대해 이야기하며', en: 'Talking about space' },
        lines: [
          {
            speaker: 'A',
            ko: '우주에서 제일 관심 있는 게 뭐예요?',
            en: 'What interests you most about space?',
          },
          {
            speaker: 'B',
            ko: `${josa(korean, '이/가')} 정말 신기해요.`,
            en: `${english} is really fascinating.`,
          },
          { speaker: 'A', ko: '왜요?', en: 'Why?' },
          {
            speaker: 'B',
            ko: '아직 모르는 게 너무 많아서요.',
            en: "Because there's still so much we don't know.",
          },
        ],
      },
    ],
  }),

  // ============================================
  // 물리학 (physics)
  // ============================================
  physics: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 배워요.`,
        intermediate: `${josa(korean, '은/는')} 중요한 개념이에요.`,
        advanced: `${korean}의 원리를 이해하는 것이 물리학 학습의 기초입니다.`,
        master: `${korean}에 대한 깊은 이해는 자연 현상을 설명하는 데 필수적입니다.`,
      },
      en: {
        beginner: `I learn about ${english.toLowerCase()}.`,
        intermediate: `${english} is an important concept.`,
        advanced: `Understanding the principle of ${english.toLowerCase()} is fundamental to physics.`,
        master: `Deep understanding of ${english.toLowerCase()} is essential for explaining natural phenomena.`,
      },
    },
    dialogues: [
      {
        context: { ko: '과학 수업에서', en: 'In science class' },
        lines: [
          { speaker: 'A', ko: '오늘 뭐 배웠어요?', en: 'What did you learn today?' },
          {
            speaker: 'B',
            ko: `${korean}에 대해 배웠어요.`,
            en: `I learned about ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '어려웠어요?', en: 'Was it difficult?' },
          {
            speaker: 'B',
            ko: '조금 어려웠지만 재미있었어요.',
            en: 'A bit difficult but interesting.',
          },
        ],
      },
    ],
  }),

  // ============================================
  // 음악 (music)
  // ============================================
  music: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 들어요.`,
        intermediate: `${josa(korean, '이/가')} 좋아요.`,
        advanced: `${josa(korean, '은/는')} 음악에서 중요한 요소입니다.`,
        master: `${korean}의 이론적 이해는 음악 감상의 깊이를 더합니다.`,
      },
      en: {
        beginner: `I listen to ${english.toLowerCase()}.`,
        intermediate: `I like ${english.toLowerCase()}.`,
        advanced: `${english} is an important element in music.`,
        master: `Theoretical understanding of ${english.toLowerCase()} adds depth to music appreciation.`,
      },
    },
    dialogues: [
      {
        context: { ko: '음악 취향에 대해 이야기하며', en: 'Talking about music taste' },
        lines: [
          { speaker: 'A', ko: '어떤 음악 좋아해요?', en: 'What kind of music do you like?' },
          {
            speaker: 'B',
            ko: `${josa(korean, '을/를')} 좋아해요.`,
            en: `I like ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '추천해 줄 수 있어요?', en: 'Can you recommend something?' },
          { speaker: 'B', ko: '물론이죠!', en: 'Of course!' },
        ],
      },
    ],
  }),

  // ============================================
  // 수학 (math)
  // ============================================
  math: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 배워요.`,
        intermediate: `${josa(korean, '이/가')} 어려워요.`,
        advanced: `${josa(korean, '은/는')} 수학의 기본 개념입니다.`,
        master: `${korean}의 원리를 이해하면 수학적 사고력이 향상됩니다.`,
      },
      en: {
        beginner: `I learn ${english.toLowerCase()}.`,
        intermediate: `${english} is difficult.`,
        advanced: `${english} is a fundamental concept in mathematics.`,
        master: `Understanding the principles of ${english.toLowerCase()} improves mathematical thinking.`,
      },
    },
    dialogues: [
      {
        context: { ko: '수학 공부를 하며', en: 'Studying math' },
        lines: [
          {
            speaker: 'A',
            ko: '수학 어떤 부분 공부해요?',
            en: 'What part of math are you studying?',
          },
          {
            speaker: 'B',
            ko: `${josa(korean, '을/를')} 공부하고 있어요.`,
            en: `I'm studying ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '어때요?', en: 'How is it?' },
          { speaker: 'B', ko: '점점 이해되고 있어요.', en: "I'm starting to understand it." },
        ],
      },
    ],
  }),

  // ============================================
  // 문화 (culture)
  // ============================================
  culture: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 좋아해요.`,
        intermediate: `${josa(korean, '은/는')} 한국 문화의 일부예요.`,
        advanced: `${josa(korean, '을/를')} 통해 한국 문화를 이해할 수 있습니다.`,
        master: `${korean}의 역사와 의미를 알면 한국 사회를 더 깊이 이해할 수 있습니다.`,
      },
      en: {
        beginner: `I like ${english.toLowerCase()}.`,
        intermediate: `${english} is part of Korean culture.`,
        advanced: `Through ${english.toLowerCase()}, you can understand Korean culture.`,
        master: `Knowing the history and meaning of ${english.toLowerCase()} helps understand Korean society more deeply.`,
      },
    },
    dialogues: [
      {
        context: { ko: '한국 문화에 대해 이야기하며', en: 'Talking about Korean culture' },
        lines: [
          {
            speaker: 'A',
            ko: '한국 문화에 관심 있어요?',
            en: 'Are you interested in Korean culture?',
          },
          {
            speaker: 'B',
            ko: `네, 특히 ${korean}에 관심 있어요.`,
            en: `Yes, especially in ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '어떤 점이 좋아요?', en: 'What do you like about it?' },
          { speaker: 'B', ko: '독특하고 아름다워요.', en: "It's unique and beautiful." },
        ],
      },
    ],
  }),

  // ============================================
  // 예술 (art)
  // ============================================
  art: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 봐요.`,
        intermediate: `${josa(korean, '이/가')} 아름다워요.`,
        advanced: `${josa(korean, '은/는')} 예술의 중요한 형식입니다.`,
        master: `${korean}의 미학적 가치를 이해하면 예술 감상이 풍요로워집니다.`,
      },
      en: {
        beginner: `I see ${english.toLowerCase()}.`,
        intermediate: `${english} is beautiful.`,
        advanced: `${english} is an important form of art.`,
        master: `Understanding the aesthetic value of ${english.toLowerCase()} enriches art appreciation.`,
      },
    },
    dialogues: [
      {
        context: { ko: '예술에 대해 이야기하며', en: 'Talking about art' },
        lines: [
          { speaker: 'A', ko: '예술 좋아해요?', en: 'Do you like art?' },
          {
            speaker: 'B',
            ko: `네, 특히 ${josa(korean, '을/를')} 좋아해요.`,
            en: `Yes, especially ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '직접 해봤어요?', en: 'Have you tried it yourself?' },
          { speaker: 'B', ko: '조금 해봤어요.', en: "I've tried a bit." },
        ],
      },
    ],
  }),

  // ============================================
  // 코딩 (coding)
  // ============================================
  coding: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 사용해요.`,
        intermediate: `${josa(korean, '이/가')} 프로그래밍에서 중요해요.`,
        advanced: `${korean}의 개념을 이해하면 코딩 실력이 향상됩니다.`,
        master: `${korean}의 심층적 이해는 효율적인 소프트웨어 개발의 핵심입니다.`,
      },
      en: {
        beginner: `I use ${english.toLowerCase()}.`,
        intermediate: `${english} is important in programming.`,
        advanced: `Understanding ${english.toLowerCase()} improves coding skills.`,
        master: `Deep understanding of ${english.toLowerCase()} is key to efficient software development.`,
      },
    },
    dialogues: [
      {
        context: { ko: '프로그래밍을 배우며', en: 'Learning programming' },
        lines: [
          { speaker: 'A', ko: '요즘 뭐 공부해요?', en: 'What are you studying these days?' },
          {
            speaker: 'B',
            ko: `${korean}에 대해 배우고 있어요.`,
            en: `I'm learning about ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '어때요?', en: 'How is it?' },
          { speaker: 'B', ko: '어렵지만 재미있어요.', en: 'Difficult but fun.' },
        ],
      },
    ],
  }),

  // ============================================
  // 동작 (actions)
  // ============================================
  actions: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 해요.`,
        intermediate: `매일 ${josa(korean, '을/를')} 연습해요.`,
        advanced: `${josa(korean, '은/는')} 기본적인 동작입니다.`,
        master: `${korean}의 정확한 수행은 효율적인 움직임의 기초입니다.`,
      },
      en: {
        beginner: `I ${english.toLowerCase()}.`,
        intermediate: `I practice ${english.toLowerCase()} every day.`,
        advanced: `${english} is a basic action.`,
        master: `Precise execution of ${english.toLowerCase()} is the foundation of efficient movement.`,
      },
    },
    dialogues: [
      {
        context: { ko: '동작을 설명하며', en: 'Explaining an action' },
        lines: [
          { speaker: 'A', ko: '지금 뭐 해요?', en: 'What are you doing now?' },
          {
            speaker: 'B',
            ko: `${josa(korean, '을/를')} 하고 있어요.`,
            en: `I'm ${english.toLowerCase()}ing.`,
          },
          { speaker: 'A', ko: '어렵지 않아요?', en: "Isn't it hard?" },
          {
            speaker: 'B',
            ko: '처음엔 어려웠는데 이제 괜찮아요.',
            en: "It was hard at first but now it's fine.",
          },
        ],
      },
    ],
  }),

  // ============================================
  // 부사 (adverbs)
  // ============================================
  adverbs: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean} 걸어요.`,
        intermediate: `그 사람은 ${korean} 일해요.`,
        advanced: `${korean}이라는 부사는 동작의 정도를 표현합니다.`,
        master: `${korean}의 적절한 사용은 문장의 표현력을 높입니다.`,
      },
      en: {
        beginner: `I walk ${english.toLowerCase()}.`,
        intermediate: `That person works ${english.toLowerCase()}.`,
        advanced: `The adverb "${korean}" expresses the degree of action.`,
        master: `Proper use of "${korean}" enhances the expressiveness of sentences.`,
      },
    },
    dialogues: [
      {
        context: { ko: '행동을 묘사하며', en: 'Describing behavior' },
        lines: [
          { speaker: 'A', ko: '어떻게 했어요?', en: 'How did you do it?' },
          { speaker: 'B', ko: `${korean} 했어요.`, en: `I did it ${english.toLowerCase()}.` },
          { speaker: 'A', ko: '잘했네요!', en: 'Well done!' },
          { speaker: 'B', ko: '고마워요.', en: 'Thanks.' },
        ],
      },
    ],
  }),

  // ============================================
  // 해부학/신체 (anatomy, body-parts, body-misc)
  // ============================================
  anatomy: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '이/가')} 아파요.`,
        intermediate: `${josa(korean, '은/는')} 중요한 신체 부위예요.`,
        advanced: `${korean}의 구조를 이해하면 건강 관리에 도움이 됩니다.`,
        master: `${korean}의 해부학적 기능은 인체의 복잡한 시스템을 보여줍니다.`,
      },
      en: {
        beginner: `My ${english.toLowerCase()} hurts.`,
        intermediate: `The ${english.toLowerCase()} is an important body part.`,
        advanced: `Understanding the structure of the ${english.toLowerCase()} helps with health management.`,
        master: `The anatomical function of the ${english.toLowerCase()} shows the complexity of the human body.`,
      },
    },
    dialogues: [
      {
        context: { ko: '병원에서 증상을 설명하며', en: 'Describing symptoms at the hospital' },
        lines: [
          { speaker: 'A', ko: '어디가 아프세요?', en: 'Where does it hurt?' },
          {
            speaker: 'B',
            ko: `${josa(korean, '이/가')} 아파요.`,
            en: `My ${english.toLowerCase()} hurts.`,
          },
          { speaker: 'A', ko: '언제부터요?', en: 'Since when?' },
          { speaker: 'B', ko: '어제부터 아팠어요.', en: 'Since yesterday.' },
        ],
      },
    ],
  }),

  // ============================================
  // 동물 (animals)
  // ============================================
  animals: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 좋아해요.`,
        intermediate: `${josa(korean, '이/가')} 귀여워요.`,
        advanced: `${josa(korean, '은/는')} 한국에서 인기 있는 동물입니다.`,
        master: `${korean}의 생태와 습성을 이해하면 자연에 대한 이해가 깊어집니다.`,
      },
      en: {
        beginner: `I like ${english.toLowerCase()}s.`,
        intermediate: `The ${english.toLowerCase()} is cute.`,
        advanced: `${english}s are popular animals in Korea.`,
        master: `Understanding the ecology and habits of ${english.toLowerCase()}s deepens our understanding of nature.`,
      },
    },
    dialogues: [
      {
        context: { ko: '좋아하는 동물에 대해 이야기하며', en: 'Talking about favorite animals' },
        lines: [
          { speaker: 'A', ko: '어떤 동물 좋아해요?', en: 'What animal do you like?' },
          {
            speaker: 'B',
            ko: `${josa(korean, '을/를')} 좋아해요.`,
            en: `I like ${english.toLowerCase()}s.`,
          },
          { speaker: 'A', ko: '키워 본 적 있어요?', en: 'Have you ever had one?' },
          { speaker: 'B', ko: '네, 어렸을 때 키웠어요.', en: 'Yes, I had one when I was young.' },
        ],
      },
    ],
  }),

  // ============================================
  // 옷 (clothing)
  // ============================================
  clothing: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 입어요.`,
        intermediate: `이 ${josa(korean, '이/가')} 예뻐요.`,
        advanced: `${josa(korean, '은/는')} 계절에 따라 다르게 입습니다.`,
        master: `${korean}의 스타일 변화는 한국 패션 트렌드를 반영합니다.`,
      },
      en: {
        beginner: `I wear ${english.toLowerCase()}.`,
        intermediate: `This ${english.toLowerCase()} is pretty.`,
        advanced: `We wear different ${english.toLowerCase()} depending on the season.`,
        master: `Style changes in ${english.toLowerCase()} reflect Korean fashion trends.`,
      },
    },
    dialogues: [
      {
        context: { ko: '옷 가게에서 쇼핑하며', en: 'Shopping at a clothing store' },
        lines: [
          { speaker: 'A', ko: '이거 어때요?', en: 'How about this?' },
          {
            speaker: 'B',
            ko: `이 ${josa(korean, '이/가')} 마음에 들어요.`,
            en: `I like this ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '입어 보세요.', en: 'Try it on.' },
          { speaker: 'B', ko: '네, 입어 볼게요.', en: "Okay, I'll try it on." },
        ],
      },
    ],
  }),

  // ============================================
  // 색깔 (colors)
  // ============================================
  colors: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}색을 좋아해요.`,
        intermediate: `이 옷은 ${korean}색이에요.`,
        advanced: `${korean}색은 한국 문화에서 특별한 의미가 있습니다.`,
        master: `${korean}색의 상징성은 전통과 현대에서 다르게 해석됩니다.`,
      },
      en: {
        beginner: `I like ${english.toLowerCase()}.`,
        intermediate: `This clothing is ${english.toLowerCase()}.`,
        advanced: `${english} has a special meaning in Korean culture.`,
        master: `The symbolism of ${english.toLowerCase()} is interpreted differently in tradition and modernity.`,
      },
    },
    dialogues: [
      {
        context: { ko: '색깔에 대해 이야기하며', en: 'Talking about colors' },
        lines: [
          { speaker: 'A', ko: '무슨 색 좋아해요?', en: 'What color do you like?' },
          { speaker: 'B', ko: `${korean}색을 좋아해요.`, en: `I like ${english.toLowerCase()}.` },
          { speaker: 'A', ko: '왜요?', en: 'Why?' },
          { speaker: 'B', ko: '보면 기분이 좋아져요.', en: 'It makes me feel good when I see it.' },
        ],
      },
    ],
  }),

  // ============================================
  // 합성어 (compound-words)
  // ============================================
  'compound-words': (korean, english, _explanation, partOfSpeech) => {
    if (partOfSpeech === 'verb') {
      return {
        sentences: {
          ko: {
            beginner: `오늘 ${korean}해요.`,
            intermediate: `자주 ${korean}하는 편이에요.`,
            advanced: `${korean}하는 것은 일상에서 흔한 활동입니다.`,
            master: `${korean}의 다양한 맥락을 이해하면 자연스러운 표현이 가능합니다.`,
          },
          en: {
            beginner: `I ${english.toLowerCase()} today.`,
            intermediate: `I tend to ${english.toLowerCase()} often.`,
            advanced: `${english}ing is a common activity in daily life.`,
            master: `Understanding various contexts of ${english.toLowerCase()} enables natural expression.`,
          },
        },
        dialogues: [
          {
            context: { ko: '일상에 대해 이야기하며', en: 'Talking about daily life' },
            lines: [
              { speaker: 'A', ko: '오늘 뭐 했어요?', en: 'What did you do today?' },
              { speaker: 'B', ko: `${korean}했어요.`, en: `I ${english.toLowerCase()}ed.` },
              { speaker: 'A', ko: '재미있었어요?', en: 'Was it fun?' },
              { speaker: 'B', ko: '네, 좋았어요.', en: 'Yes, it was good.' },
            ],
          },
        ],
      };
    }
    return {
      sentences: {
        ko: {
          beginner: `${josa(korean, '이/가')} 있어요.`,
          intermediate: `${korean}에서 가까워요.`,
          advanced: `${josa(korean, '은/는')} 우리 생활에서 자주 접하는 것입니다.`,
          master: `${korean}의 사용 맥락을 이해하면 어휘력이 향상됩니다.`,
        },
        en: {
          beginner: `There is a ${english.toLowerCase()}.`,
          intermediate: `It is close to the ${english.toLowerCase()}.`,
          advanced: `${english} is something we frequently encounter in daily life.`,
          master: `Understanding the context of ${english.toLowerCase()} improves vocabulary.`,
        },
      },
      dialogues: [
        {
          context: { ko: '장소를 찾으며', en: 'Looking for a place' },
          lines: [
            {
              speaker: 'A',
              ko: `${josa(korean, '이/가')} 어디에 있어요?`,
              en: `Where is the ${english.toLowerCase()}?`,
            },
            { speaker: 'B', ko: '저쪽에 있어요.', en: "It's over there." },
            { speaker: 'A', ko: '멀어요?', en: 'Is it far?' },
            { speaker: 'B', ko: '아니요, 가까워요.', en: "No, it's close." },
          ],
        },
      ],
    };
  },

  // ============================================
  // 접속사 (conjunctions)
  // ============================================
  conjunctions: (korean, english, explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}" 을 사용해서 문장을 만들어요.`,
        intermediate: `이 문장에서 "${korean}"의 역할이 중요해요.`,
        advanced: `"${korean}"의 올바른 사용은 문장 연결의 핵심입니다.`,
        master: `"${korean}"의 미묘한 차이를 이해하면 논리적인 한국어 표현이 가능합니다.`,
      },
      en: {
        beginner: `Make a sentence using "${korean}".`,
        intermediate: `The role of "${korean}" is important in this sentence.`,
        advanced: `Correct use of "${korean}" is key to connecting sentences.`,
        master: `Understanding the subtle differences of "${korean}" enables logical Korean expression.`,
      },
    },
    dialogues: [
      {
        context: { ko: '한국어 문법을 공부하며', en: 'Studying Korean grammar' },
        lines: [
          { speaker: 'A', ko: `"${korean}"은 언제 써요?`, en: `When do you use "${korean}"?` },
          { speaker: 'B', ko: `${explanation}`, en: `${explanation}` },
          { speaker: 'A', ko: '예문 하나 만들어 주세요.', en: 'Please make an example sentence.' },
          {
            speaker: 'B',
            ko: '비가 와요. 그래서 우산을 가져가요.',
            en: "It's raining. So I'll bring an umbrella.",
          },
        ],
      },
    ],
  }),

  // ============================================
  // 자음 (consonants, double-consonants)
  // ============================================
  consonants: (korean, english, explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}" 소리를 내 봐요.`,
        intermediate: `"${korean}"으로 시작하는 단어를 찾아봐요.`,
        advanced: `"${korean}"의 발음 위치와 방법을 이해하면 정확한 발음이 가능합니다.`,
        master: `"${korean}"의 음운론적 특성은 한국어 발음 체계의 핵심입니다.`,
      },
      en: {
        beginner: `Try making the "${korean}" sound.`,
        intermediate: `Find a word that starts with "${korean}".`,
        advanced: `Understanding the position and method of pronouncing "${korean}" enables accurate pronunciation.`,
        master: `The phonological characteristics of "${korean}" are central to the Korean pronunciation system.`,
      },
    },
    dialogues: [
      {
        context: { ko: '발음을 연습하며', en: 'Practicing pronunciation' },
        lines: [
          {
            speaker: 'A',
            ko: `"${korean}" 발음이 어려워요.`,
            en: `The "${korean}" pronunciation is difficult.`,
          },
          { speaker: 'B', ko: '천천히 따라해 봐요.', en: 'Try repeating slowly.' },
          { speaker: 'A', ko: `"${korean}"... 이렇게요?`, en: `"${korean}"... like this?` },
          { speaker: 'B', ko: '잘했어요!', en: 'Well done!' },
        ],
      },
    ],
  }),

  // ============================================
  // 문화 표현 (cultural-expressions)
  // ============================================
  'cultural-expressions': (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}"이라고 말해요.`,
        intermediate: `한국에서는 "${korean}"을 자주 사용해요.`,
        advanced: `"${korean}"은 한국 문화의 독특한 표현입니다.`,
        master: `"${korean}"의 문화적 맥락을 이해하면 한국인의 사고방식을 알 수 있습니다.`,
      },
      en: {
        beginner: `We say "${korean}".`,
        intermediate: `In Korea, people often use "${korean}".`,
        advanced: `"${korean}" is a unique expression in Korean culture.`,
        master: `Understanding the cultural context of "${korean}" reveals the Korean way of thinking.`,
      },
    },
    dialogues: [
      {
        context: { ko: '한국 문화를 배우며', en: 'Learning Korean culture' },
        lines: [
          { speaker: 'A', ko: `"${korean}"이 무슨 뜻이에요?`, en: `What does "${korean}" mean?` },
          { speaker: 'B', ko: `${english}라는 뜻이에요.`, en: `It means "${english}".` },
          { speaker: 'A', ko: '언제 사용해요?', en: 'When do you use it?' },
          {
            speaker: 'B',
            ko: '특별한 상황에서 많이 써요.',
            en: "It's often used in special situations.",
          },
        ],
      },
    ],
  }),

  // ============================================
  // 일상 기타 (daily-misc)
  // ============================================
  'daily-misc': (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '이/가')} 필요해요.`,
        intermediate: `매일 ${josa(korean, '을/를')} 사용해요.`,
        advanced: `${josa(korean, '은/는')} 일상생활에서 빠질 수 없습니다.`,
        master: `${korean}의 활용법을 알면 생활이 더 편리해집니다.`,
      },
      en: {
        beginner: `I need ${english.toLowerCase()}.`,
        intermediate: `I use ${english.toLowerCase()} every day.`,
        advanced: `${english} is indispensable in daily life.`,
        master: `Knowing how to use ${english.toLowerCase()} makes life more convenient.`,
      },
    },
    dialogues: [
      {
        context: { ko: '일상에 대해 이야기하며', en: 'Talking about daily life' },
        lines: [
          {
            speaker: 'A',
            ko: `${josa(korean, '이/가')} 있어요?`,
            en: `Do you have ${english.toLowerCase()}?`,
          },
          { speaker: 'B', ko: '네, 여기 있어요.', en: 'Yes, here it is.' },
          { speaker: 'A', ko: '고마워요.', en: 'Thanks.' },
          { speaker: 'B', ko: '필요하면 언제든 말해요.', en: 'Let me know whenever you need it.' },
        ],
      },
    ],
  }),

  // ============================================
  // 음료 (drinks)
  // ============================================
  drinks: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 마셔요.`,
        intermediate: `${josa(korean, '이/가')} 맛있어요.`,
        advanced: `${josa(korean, '은/는')} 한국에서 인기 있는 음료입니다.`,
        master: `${korean}의 다양한 종류와 문화적 의미를 이해하면 한국 음료 문화를 깊이 알 수 있습니다.`,
      },
      en: {
        beginner: `I drink ${english.toLowerCase()}.`,
        intermediate: `${english} is delicious.`,
        advanced: `${english} is a popular drink in Korea.`,
        master: `Understanding the varieties and cultural significance of ${english.toLowerCase()} deepens appreciation of Korean beverage culture.`,
      },
    },
    dialogues: [
      {
        context: { ko: '카페에서 주문하며', en: 'Ordering at a cafe' },
        lines: [
          { speaker: 'A', ko: '뭐 드시겠어요?', en: 'What would you like?' },
          { speaker: 'B', ko: `${korean} 주세요.`, en: `${english}, please.` },
          { speaker: 'A', ko: '뜨거운 거요, 차가운 거요?', en: 'Hot or cold?' },
          { speaker: 'B', ko: '차가운 걸로 주세요.', en: 'Cold, please.' },
        ],
      },
    ],
  }),

  // ============================================
  // 교육 (education)
  // ============================================
  education: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}에서 공부해요.`,
        intermediate: `${josa(korean, '은/는')} 중요한 교육 개념이에요.`,
        advanced: `${korean}에 대한 이해는 학습 능력 향상에 도움이 됩니다.`,
        master: `${korean}의 교육학적 가치는 현대 학습 이론에서 핵심적입니다.`,
      },
      en: {
        beginner: `I study at the ${english.toLowerCase()}.`,
        intermediate: `${english} is an important educational concept.`,
        advanced: `Understanding ${english.toLowerCase()} helps improve learning ability.`,
        master: `The pedagogical value of ${english.toLowerCase()} is central to modern learning theory.`,
      },
    },
    dialogues: [
      {
        context: { ko: '학교에 대해 이야기하며', en: 'Talking about school' },
        lines: [
          { speaker: 'A', ko: '요즘 뭐 배워요?', en: 'What are you learning these days?' },
          {
            speaker: 'B',
            ko: `${korean}에 대해 배우고 있어요.`,
            en: `I'm learning about ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '재미있어요?', en: 'Is it interesting?' },
          { speaker: 'B', ko: '네, 아주 재미있어요.', en: 'Yes, very interesting.' },
        ],
      },
    ],
  }),

  // ============================================
  // 행사 (events)
  // ============================================
  events: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}에 가요.`,
        intermediate: `${josa(korean, '이/가')} 곧 있어요.`,
        advanced: `${josa(korean, '은/는')} 한국의 중요한 행사입니다.`,
        master: `${korean}의 역사적 배경을 이해하면 한국 사회를 더 깊이 알 수 있습니다.`,
      },
      en: {
        beginner: `I go to the ${english.toLowerCase()}.`,
        intermediate: `The ${english.toLowerCase()} is coming soon.`,
        advanced: `${english} is an important event in Korea.`,
        master: `Understanding the historical background of ${english.toLowerCase()} deepens knowledge of Korean society.`,
      },
    },
    dialogues: [
      {
        context: { ko: '행사에 대해 이야기하며', en: 'Talking about events' },
        lines: [
          { speaker: 'A', ko: '이번 주말에 뭐 해요?', en: 'What are you doing this weekend?' },
          {
            speaker: 'B',
            ko: `${korean}에 가요.`,
            en: `I'm going to the ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '같이 가도 돼요?', en: 'Can I come too?' },
          { speaker: 'B', ko: '물론이요! 같이 가요.', en: "Of course! Let's go together." },
        ],
      },
    ],
  }),

  // ============================================
  // 제스처 (gestures)
  // ============================================
  gestures: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '을/를')} 해 봐요.`,
        intermediate: `한국에서 ${josa(korean, '은/는')} 이런 뜻이에요.`,
        advanced: `${korean}의 의미는 문화에 따라 다릅니다.`,
        master: `${korean}의 문화적 맥락을 이해하면 비언어 의사소통이 원활해집니다.`,
      },
      en: {
        beginner: `Try doing ${english.toLowerCase()}.`,
        intermediate: `In Korea, ${english.toLowerCase()} means this.`,
        advanced: `The meaning of ${english.toLowerCase()} varies across cultures.`,
        master: `Understanding the cultural context of ${english.toLowerCase()} improves nonverbal communication.`,
      },
    },
    dialogues: [
      {
        context: { ko: '제스처에 대해 이야기하며', en: 'Talking about gestures' },
        lines: [
          { speaker: 'A', ko: '이 동작이 무슨 뜻이에요?', en: 'What does this gesture mean?' },
          {
            speaker: 'B',
            ko: `${josa(korean, '은/는')} "${english}"라는 뜻이에요.`,
            en: `It means "${english}".`,
          },
          { speaker: 'A', ko: '한국에서만 그래요?', en: 'Is it only in Korea?' },
          {
            speaker: 'B',
            ko: '다른 나라에서는 다를 수 있어요.',
            en: 'It can be different in other countries.',
          },
        ],
      },
    ],
  }),

  // ============================================
  // 건강 (health)
  // ============================================
  health: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '이/가')} 중요해요.`,
        intermediate: `${korean}을 위해 운동해요.`,
        advanced: `${josa(korean, '은/는')} 건강한 생활의 기본입니다.`,
        master: `${korean}에 대한 올바른 이해는 질병 예방의 첫걸음입니다.`,
      },
      en: {
        beginner: `${english} is important.`,
        intermediate: `I exercise for ${english.toLowerCase()}.`,
        advanced: `${english} is the foundation of a healthy life.`,
        master: `Proper understanding of ${english.toLowerCase()} is the first step in disease prevention.`,
      },
    },
    dialogues: [
      {
        context: { ko: '건강에 대해 이야기하며', en: 'Talking about health' },
        lines: [
          { speaker: 'A', ko: '요즘 건강은 어때요?', en: 'How is your health these days?' },
          {
            speaker: 'B',
            ko: `${korean}에 신경 쓰고 있어요.`,
            en: `I'm paying attention to ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '잘하고 있네요.', en: "That's good." },
          {
            speaker: 'B',
            ko: '건강이 제일 중요하잖아요.',
            en: 'Health is the most important thing.',
          },
        ],
      },
    ],
  }),

  // ============================================
  // 집 (home)
  // ============================================
  home: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '이/가')} 있어요.`,
        intermediate: `${josa(korean, '이/가')} 깨끗해요.`,
        advanced: `${josa(korean, '은/는')} 편안한 집의 필수 요소입니다.`,
        master: `${korean}의 배치와 활용은 주거 문화를 반영합니다.`,
      },
      en: {
        beginner: `There is a ${english.toLowerCase()}.`,
        intermediate: `The ${english.toLowerCase()} is clean.`,
        advanced: `A ${english.toLowerCase()} is an essential element of a comfortable home.`,
        master: `The arrangement and use of ${english.toLowerCase()} reflects residential culture.`,
      },
    },
    dialogues: [
      {
        context: { ko: '집을 소개하며', en: 'Introducing the house' },
        lines: [
          { speaker: 'A', ko: '집이 어때요?', en: 'How is your house?' },
          {
            speaker: 'B',
            ko: `${josa(korean, '이/가')} 넓어요.`,
            en: `The ${english.toLowerCase()} is spacious.`,
          },
          { speaker: 'A', ko: '좋겠네요.', en: 'That sounds nice.' },
          { speaker: 'B', ko: '네, 마음에 들어요.', en: 'Yes, I like it.' },
        ],
      },
    ],
  }),

  // ============================================
  // 존댓말 (honorifics)
  // ============================================
  honorifics: (korean, english, explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}"이라고 말해요.`,
        intermediate: `웃어른에게 "${korean}"을 사용해요.`,
        advanced: `"${korean}"의 올바른 사용은 한국어 예절의 핵심입니다.`,
        master: `"${korean}"의 뉘앙스를 이해하면 상황에 맞는 존댓말 구사가 가능합니다.`,
      },
      en: {
        beginner: `We say "${korean}".`,
        intermediate: `Use "${korean}" with elders.`,
        advanced: `Correct use of "${korean}" is key to Korean etiquette.`,
        master: `Understanding the nuance of "${korean}" enables situationally appropriate honorific use.`,
      },
    },
    dialogues: [
      {
        context: { ko: '존댓말을 배우며', en: 'Learning honorifics' },
        lines: [
          {
            speaker: 'A',
            ko: '이 상황에서 어떻게 말해요?',
            en: 'How do you speak in this situation?',
          },
          { speaker: 'B', ko: `"${korean}"이라고 해요.`, en: `You say "${korean}".` },
          { speaker: 'A', ko: '왜 그렇게 말해야 해요?', en: 'Why do I have to say it that way?' },
          {
            speaker: 'B',
            ko: '한국에서는 예의가 중요해요.',
            en: 'Politeness is important in Korea.',
          },
        ],
      },
    ],
  }),

  // ============================================
  // 관용어 (idioms)
  // ============================================
  idioms: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}"이라는 표현이 있어요.`,
        intermediate: `"${korean}"을 일상에서 자주 써요.`,
        advanced: `"${korean}"은 한국어의 독특한 관용 표현입니다.`,
        master: `"${korean}"의 유래를 알면 한국 문화에 대한 이해가 깊어집니다.`,
      },
      en: {
        beginner: `There is an expression "${korean}".`,
        intermediate: `We often use "${korean}" in daily life.`,
        advanced: `"${korean}" is a unique Korean idiomatic expression.`,
        master: `Knowing the origin of "${korean}" deepens understanding of Korean culture.`,
      },
    },
    dialogues: [
      {
        context: { ko: '관용어를 배우며', en: 'Learning idioms' },
        lines: [
          { speaker: 'A', ko: `"${korean}"이 무슨 뜻이에요?`, en: `What does "${korean}" mean?` },
          { speaker: 'B', ko: `"${english}"라는 뜻이에요.`, en: `It means "${english}".` },
          { speaker: 'A', ko: '재미있는 표현이네요!', en: "That's an interesting expression!" },
          {
            speaker: 'B',
            ko: '한국어에는 이런 표현이 많아요.',
            en: 'Korean has many expressions like this.',
          },
        ],
      },
    ],
  }),

  // ============================================
  // 감탄사 (interjections)
  // ============================================
  interjections: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}! 놀랐어요.`,
        intermediate: `한국 사람들은 "${korean}"을 자주 말해요.`,
        advanced: `"${korean}"은 감정을 즉각적으로 표현하는 감탄사입니다.`,
        master: `"${korean}"의 사용 빈도와 맥락은 한국어 화자의 감정 표현 방식을 보여줍니다.`,
      },
      en: {
        beginner: `${korean}! I was surprised.`,
        intermediate: `Korean people often say "${korean}".`,
        advanced: `"${korean}" is an interjection that immediately expresses emotion.`,
        master: `The frequency and context of "${korean}" reveals how Korean speakers express emotions.`,
      },
    },
    dialogues: [
      {
        context: { ko: '놀라운 일이 생겼을 때', en: 'When something surprising happens' },
        lines: [
          { speaker: 'A', ko: `${korean}! 이거 봐요!`, en: `${english}! Look at this!` },
          { speaker: 'B', ko: '뭔데요?', en: 'What is it?' },
          { speaker: 'A', ko: '정말 신기하지 않아요?', en: "Isn't it amazing?" },
          {
            speaker: 'B',
            ko: `${korean}, 진짜 신기하네요!`,
            en: `${english}, that's really amazing!`,
          },
        ],
      },
    ],
  }),

  // ============================================
  // 법률 (legal)
  // ============================================
  legal: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '이/가')} 뭐예요?`,
        intermediate: `${josa(korean, '은/는')} 법에서 중요해요.`,
        advanced: `${korean}의 개념을 이해하면 법적 권리를 보호할 수 있습니다.`,
        master: `${korean}에 대한 정확한 이해는 법률 문해력의 핵심입니다.`,
      },
      en: {
        beginner: `What is ${english.toLowerCase()}?`,
        intermediate: `${english} is important in law.`,
        advanced: `Understanding ${english.toLowerCase()} helps protect legal rights.`,
        master: `Accurate understanding of ${english.toLowerCase()} is central to legal literacy.`,
      },
    },
    dialogues: [
      {
        context: { ko: '법률 상담을 받으며', en: 'Getting legal consultation' },
        lines: [
          {
            speaker: 'A',
            ko: `${josa(korean, '이/가')} 뭔지 모르겠어요.`,
            en: `I don't understand ${english.toLowerCase()}.`,
          },
          { speaker: 'B', ko: '쉽게 설명해 드릴게요.', en: "I'll explain it simply." },
          { speaker: 'A', ko: '감사합니다.', en: 'Thank you.' },
          {
            speaker: 'B',
            ko: '궁금한 점 있으면 물어보세요.',
            en: 'Ask if you have any questions.',
          },
        ],
      },
    ],
  }),

  // ============================================
  // 의학 (medical)
  // ============================================
  medical: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '이/가')} 뭐예요?`,
        intermediate: `${josa(korean, '은/는')} 병원에서 자주 듣는 말이에요.`,
        advanced: `${korean}에 대한 이해는 건강 관리에 중요합니다.`,
        master: `${korean}의 의학적 의미를 정확히 아는 것은 환자-의사 소통의 기본입니다.`,
      },
      en: {
        beginner: `What is ${english.toLowerCase()}?`,
        intermediate: `${english} is a term often heard at hospitals.`,
        advanced: `Understanding ${english.toLowerCase()} is important for health management.`,
        master: `Knowing the medical meaning of ${english.toLowerCase()} is fundamental to patient-doctor communication.`,
      },
    },
    dialogues: [
      {
        context: { ko: '병원에서 진료를 받으며', en: 'At a medical appointment' },
        lines: [
          { speaker: 'A', ko: '어디가 불편하세요?', en: 'What seems to be the problem?' },
          {
            speaker: 'B',
            ko: `${korean}에 대해 물어보고 싶어요.`,
            en: `I'd like to ask about ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '네, 설명해 드리겠습니다.', en: "Yes, I'll explain." },
          { speaker: 'B', ko: '감사합니다, 선생님.', en: 'Thank you, doctor.' },
        ],
      },
    ],
  }),

  // ============================================
  // 자연 (nature)
  // ============================================
  nature: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '이/가')} 예뻐요.`,
        intermediate: `${josa(korean, '을/를')} 보러 갔어요.`,
        advanced: `${josa(korean, '은/는')} 자연의 아름다움을 보여줍니다.`,
        master: `${korean}의 생태적 가치를 이해하면 환경 보호의 중요성을 알 수 있습니다.`,
      },
      en: {
        beginner: `The ${english.toLowerCase()} is beautiful.`,
        intermediate: `I went to see the ${english.toLowerCase()}.`,
        advanced: `${english} shows the beauty of nature.`,
        master: `Understanding the ecological value of ${english.toLowerCase()} reveals the importance of environmental protection.`,
      },
    },
    dialogues: [
      {
        context: { ko: '자연에 대해 이야기하며', en: 'Talking about nature' },
        lines: [
          { speaker: 'A', ko: '주말에 어디 갔어요?', en: 'Where did you go on the weekend?' },
          {
            speaker: 'B',
            ko: `${josa(korean, '을/를')} 보러 갔어요.`,
            en: `I went to see the ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '어땠어요?', en: 'How was it?' },
          { speaker: 'B', ko: '정말 아름다웠어요.', en: 'It was really beautiful.' },
        ],
      },
    ],
  }),

  // ============================================
  // 일반 명사 (nouns-common)
  // ============================================
  'nouns-common': (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '이/가')} 있어요.`,
        intermediate: `${josa(korean, '을/를')} 사용해요.`,
        advanced: `${josa(korean, '은/는')} 일상에서 자주 접하는 것입니다.`,
        master: `${korean}의 다양한 쓰임을 이해하면 어휘력이 풍부해집니다.`,
      },
      en: {
        beginner: `There is a ${english.toLowerCase()}.`,
        intermediate: `I use ${english.toLowerCase()}.`,
        advanced: `${english} is something we frequently encounter in daily life.`,
        master: `Understanding the various uses of ${english.toLowerCase()} enriches vocabulary.`,
      },
    },
    dialogues: [
      {
        context: { ko: '물건에 대해 이야기하며', en: 'Talking about objects' },
        lines: [
          {
            speaker: 'A',
            ko: `${josa(korean, '이/가')} 어디 있어요?`,
            en: `Where is the ${english.toLowerCase()}?`,
          },
          { speaker: 'B', ko: '여기 있어요.', en: 'Here it is.' },
          { speaker: 'A', ko: '고마워요.', en: 'Thanks.' },
          { speaker: 'B', ko: '천만에요.', en: "You're welcome." },
        ],
      },
    ],
  }),

  // ============================================
  // 물건 (objects)
  // ============================================
  objects: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '이/가')} 필요해요.`,
        intermediate: `${josa(korean, '을/를')} 찾고 있어요.`,
        advanced: `${josa(korean, '은/는')} 생활에 필수적인 물건입니다.`,
        master: `${korean}의 발전 과정은 기술과 문화의 변화를 반영합니다.`,
      },
      en: {
        beginner: `I need a ${english.toLowerCase()}.`,
        intermediate: `I'm looking for a ${english.toLowerCase()}.`,
        advanced: `A ${english.toLowerCase()} is an essential item in life.`,
        master: `The development of ${english.toLowerCase()} reflects changes in technology and culture.`,
      },
    },
    dialogues: [
      {
        context: { ko: '물건을 찾으며', en: 'Looking for an item' },
        lines: [
          {
            speaker: 'A',
            ko: `${josa(korean, '이/가')} 어디 있어요?`,
            en: `Where is the ${english.toLowerCase()}?`,
          },
          { speaker: 'B', ko: '책상 위에 있어요.', en: "It's on the desk." },
          { speaker: 'A', ko: '아, 찾았어요!', en: 'Ah, I found it!' },
          { speaker: 'B', ko: '다행이네요.', en: "That's good." },
        ],
      },
    ],
  }),

  // ============================================
  // 의성어 (onomatopoeia)
  // ============================================
  onomatopoeia: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}" 소리가 나요.`,
        intermediate: `비가 "${korean}" 내려요.`,
        advanced: `"${korean}"은 한국어의 풍부한 의성어 중 하나입니다.`,
        master: `"${korean}"의 미묘한 뉘앙스를 이해하면 감각적인 한국어 표현이 가능합니다.`,
      },
      en: {
        beginner: `It makes a "${korean}" sound.`,
        intermediate: `The rain falls "${korean}".`,
        advanced: `"${korean}" is one of Korean's rich onomatopoeias.`,
        master: `Understanding the subtle nuances of "${korean}" enables sensory Korean expression.`,
      },
    },
    dialogues: [
      {
        context: { ko: '소리를 묘사하며', en: 'Describing sounds' },
        lines: [
          { speaker: 'A', ko: '밖에서 무슨 소리 나요?', en: 'What sound is coming from outside?' },
          { speaker: 'B', ko: `"${korean}" 소리가 나요.`, en: `I hear a "${korean}" sound.` },
          { speaker: 'A', ko: '뭔 소리일까요?', en: 'What could it be?' },
          { speaker: 'B', ko: '바람 소리인 것 같아요.', en: "I think it's the wind." },
        ],
      },
    ],
  }),

  // ============================================
  // 구동사 (phrasal-verbs)
  // ============================================
  'phrasal-verbs': (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `오늘 ${korean}했어요.`,
        intermediate: `자주 ${korean}하는 편이에요.`,
        advanced: `${korean}하는 것은 일상적인 표현입니다.`,
        master: `${korean}의 다양한 활용을 이해하면 자연스러운 한국어 구사가 가능합니다.`,
      },
      en: {
        beginner: `I ${english.toLowerCase()}ed today.`,
        intermediate: `I tend to ${english.toLowerCase()} often.`,
        advanced: `${english}ing is a common expression.`,
        master: `Understanding various uses of "${english.toLowerCase()}" enables natural Korean speaking.`,
      },
    },
    dialogues: [
      {
        context: { ko: '일상 대화에서', en: 'In daily conversation' },
        lines: [
          { speaker: 'A', ko: '오늘 뭐 했어요?', en: 'What did you do today?' },
          { speaker: 'B', ko: `${korean}했어요.`, en: `I ${english.toLowerCase()}ed.` },
          { speaker: 'A', ko: '그랬군요.', en: 'I see.' },
          { speaker: 'B', ko: '네, 바쁜 하루였어요.', en: 'Yes, it was a busy day.' },
        ],
      },
    ],
  }),

  // ============================================
  // 장소 (places)
  // ============================================
  places: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}에 가요.`,
        intermediate: `${korean}에서 만나요.`,
        advanced: `${josa(korean, '은/는')} 사람들이 자주 찾는 장소입니다.`,
        master: `${korean}의 사회적 기능을 이해하면 한국의 도시 문화를 알 수 있습니다.`,
      },
      en: {
        beginner: `I go to the ${english.toLowerCase()}.`,
        intermediate: `Let's meet at the ${english.toLowerCase()}.`,
        advanced: `The ${english.toLowerCase()} is a place people often visit.`,
        master: `Understanding the social function of ${english.toLowerCase()} reveals Korean urban culture.`,
      },
    },
    dialogues: [
      {
        context: { ko: '길을 물어보며', en: 'Asking for directions' },
        lines: [
          {
            speaker: 'A',
            ko: `${josa(korean, '이/가')} 어디에 있어요?`,
            en: `Where is the ${english.toLowerCase()}?`,
          },
          { speaker: 'B', ko: '이 길로 쭉 가면 있어요.', en: 'Go straight down this road.' },
          { speaker: 'A', ko: '걸어서 얼마나 걸려요?', en: 'How long does it take on foot?' },
          { speaker: 'B', ko: '한 5분이면 돼요.', en: 'About 5 minutes.' },
        ],
      },
    ],
  }),

  // ============================================
  // 직업 (professions)
  // ============================================
  professions: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `저는 ${josa(korean, '이에요/예요')}.`,
        intermediate: `${josa(korean, '이/가')} 되고 싶어요.`,
        advanced: `${josa(korean, '은/는')} 사회에서 중요한 역할을 합니다.`,
        master: `${korean}의 전문성과 윤리는 직업의 사회적 가치를 결정합니다.`,
      },
      en: {
        beginner: `I am a ${english.toLowerCase()}.`,
        intermediate: `I want to become a ${english.toLowerCase()}.`,
        advanced: `A ${english.toLowerCase()} plays an important role in society.`,
        master: `The expertise and ethics of a ${english.toLowerCase()} determine the social value of the profession.`,
      },
    },
    dialogues: [
      {
        context: { ko: '직업에 대해 이야기하며', en: 'Talking about occupations' },
        lines: [
          { speaker: 'A', ko: '직업이 뭐예요?', en: 'What do you do for a living?' },
          {
            speaker: 'B',
            ko: `저는 ${josa(korean, '이에요/예요')}.`,
            en: `I'm a ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '멋있네요!', en: "That's cool!" },
          {
            speaker: 'B',
            ko: '감사합니다. 보람 있는 일이에요.',
            en: "Thank you. It's rewarding work.",
          },
        ],
      },
    ],
  }),

  // ============================================
  // 대명사 (pronouns)
  // ============================================
  pronouns: (korean, english, explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}"을 사용해요.`,
        intermediate: `"${korean}"은 자주 쓰는 대명사예요.`,
        advanced: `"${korean}"의 올바른 사용은 한국어 문법의 기본입니다.`,
        master: `"${korean}"의 사용 맥락을 이해하면 격식과 비격식 표현을 구분할 수 있습니다.`,
      },
      en: {
        beginner: `We use "${korean}".`,
        intermediate: `"${korean}" is a frequently used pronoun.`,
        advanced: `Correct use of "${korean}" is fundamental to Korean grammar.`,
        master: `Understanding the context of "${korean}" helps distinguish formal and informal expressions.`,
      },
    },
    dialogues: [
      {
        context: { ko: '한국어를 배우며', en: 'Learning Korean' },
        lines: [
          { speaker: 'A', ko: `"${korean}"은 언제 써요?`, en: `When do you use "${korean}"?` },
          { speaker: 'B', ko: `${explanation}`, en: `${explanation}` },
          { speaker: 'A', ko: '아, 이해했어요.', en: 'Ah, I understand.' },
          { speaker: 'B', ko: '잘하고 있어요!', en: "You're doing well!" },
        ],
      },
    ],
  }),

  // ============================================
  // 응답 (responses)
  // ============================================
  responses: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}"이라고 대답해요.`,
        intermediate: `한국에서는 "${korean}"이라고 자주 말해요.`,
        advanced: `"${korean}"은 대화에서 자연스러운 응답 표현입니다.`,
        master: `"${korean}"의 상황별 사용법을 이해하면 대화가 자연스러워집니다.`,
      },
      en: {
        beginner: `We answer "${korean}".`,
        intermediate: `In Korea, people often say "${korean}".`,
        advanced: `"${korean}" is a natural response expression in conversation.`,
        master: `Understanding the situational use of "${korean}" makes conversation more natural.`,
      },
    },
    dialogues: [
      {
        context: { ko: '대화 중에', en: 'During a conversation' },
        lines: [
          { speaker: 'A', ko: '이거 괜찮아요?', en: 'Is this okay?' },
          { speaker: 'B', ko: `${korean}!`, en: `${english}!` },
          { speaker: 'A', ko: '정말요?', en: 'Really?' },
          { speaker: 'B', ko: `${korean}, 진짜요.`, en: `${english}, for real.` },
        ],
      },
    ],
  }),

  // ============================================
  // 일과 (routines)
  // ============================================
  routines: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `매일 ${josa(korean, '을/를')} 해요.`,
        intermediate: `아침마다 ${josa(korean, '을/를')} 합니다.`,
        advanced: `${josa(korean, '은/는')} 건강한 생활 습관의 일부입니다.`,
        master: `${korean}의 규칙적인 실천은 자기 관리 능력을 보여줍니다.`,
      },
      en: {
        beginner: `I ${english.toLowerCase()} every day.`,
        intermediate: `I ${english.toLowerCase()} every morning.`,
        advanced: `${english} is part of a healthy lifestyle.`,
        master: `Regular practice of ${english.toLowerCase()} demonstrates self-management ability.`,
      },
    },
    dialogues: [
      {
        context: { ko: '하루 일과에 대해 이야기하며', en: 'Talking about daily routines' },
        lines: [
          {
            speaker: 'A',
            ko: '아침에 보통 뭐 해요?',
            en: 'What do you usually do in the morning?',
          },
          { speaker: 'B', ko: `${josa(korean, '을/를')} 해요.`, en: `I ${english.toLowerCase()}.` },
          { speaker: 'A', ko: '매일요?', en: 'Every day?' },
          { speaker: 'B', ko: '네, 거의 매일이요.', en: 'Yes, almost every day.' },
        ],
      },
    ],
  }),

  // ============================================
  // 계절 (seasons)
  // ============================================
  seasons: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${josa(korean, '이/가')} 좋아요.`,
        intermediate: `${korean}에는 날씨가 좋아요.`,
        advanced: `${josa(korean, '은/는')} 한국에서 특별한 계절입니다.`,
        master: `${korean}의 기후 특성은 한국의 문화와 생활에 큰 영향을 미칩니다.`,
      },
      en: {
        beginner: `I like ${english.toLowerCase()}.`,
        intermediate: `The weather is nice in ${english.toLowerCase()}.`,
        advanced: `${english} is a special season in Korea.`,
        master: `The climate characteristics of ${english.toLowerCase()} greatly influence Korean culture and lifestyle.`,
      },
    },
    dialogues: [
      {
        context: { ko: '계절에 대해 이야기하며', en: 'Talking about seasons' },
        lines: [
          { speaker: 'A', ko: '어떤 계절을 좋아해요?', en: 'What season do you like?' },
          {
            speaker: 'B',
            ko: `${josa(korean, '을/를')} 좋아해요.`,
            en: `I like ${english.toLowerCase()}.`,
          },
          { speaker: 'A', ko: '왜요?', en: 'Why?' },
          { speaker: 'B', ko: '날씨가 따뜻해서요.', en: 'Because the weather is warm.' },
        ],
      },
    ],
  }),

  // ============================================
  // 속어 (slang)
  // ============================================
  slang: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}"이라고 말해요.`,
        intermediate: `친구들끼리 "${korean}"을 자주 써요.`,
        advanced: `"${korean}"은 젊은 세대에서 유행하는 표현입니다.`,
        master: `"${korean}"의 유래와 사용 맥락을 이해하면 한국의 대중문화를 알 수 있습니다.`,
      },
      en: {
        beginner: `We say "${korean}".`,
        intermediate: `Friends often use "${korean}".`,
        advanced: `"${korean}" is an expression popular among the younger generation.`,
        master: `Understanding the origin and context of "${korean}" reveals Korean pop culture.`,
      },
    },
    dialogues: [
      {
        context: { ko: '친구와 대화하며', en: 'Chatting with a friend' },
        lines: [
          { speaker: 'A', ko: `"${korean}"이 무슨 뜻이야?`, en: `What does "${korean}" mean?` },
          { speaker: 'B', ko: `"${english}"라는 뜻이야.`, en: `It means "${english}".` },
          { speaker: 'A', ko: '아, 그렇구나!', en: 'Oh, I see!' },
          { speaker: 'B', ko: '요즘 많이 쓰는 말이야.', en: "It's a common word these days." },
        ],
      },
    ],
  }),

  // ============================================
  // 동사 어간 (verb-stems)
  // ============================================
  'verb-stems': (korean, english, explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}"으로 문장을 만들어요.`,
        intermediate: `"${korean}"에 다양한 어미를 붙일 수 있어요.`,
        advanced: `"${korean}"의 활용법을 알면 다양한 표현이 가능합니다.`,
        master: `"${korean}"의 불규칙 활용을 이해하면 한국어 문법 체계가 보입니다.`,
      },
      en: {
        beginner: `Make a sentence with "${korean}".`,
        intermediate: `You can attach various endings to "${korean}".`,
        advanced: `Knowing how to conjugate "${korean}" enables various expressions.`,
        master: `Understanding irregular conjugation of "${korean}" reveals the Korean grammar system.`,
      },
    },
    dialogues: [
      {
        context: { ko: '한국어 문법을 공부하며', en: 'Studying Korean grammar' },
        lines: [
          {
            speaker: 'A',
            ko: `"${korean}"은 어떻게 활용해요?`,
            en: `How do you conjugate "${korean}"?`,
          },
          { speaker: 'B', ko: `${explanation}`, en: `${explanation}` },
          { speaker: 'A', ko: '예문 하나 만들어 주세요.', en: 'Please make an example sentence.' },
          {
            speaker: 'B',
            ko: `"${korean}아/어요"처럼 쓸 수 있어요.`,
            en: `You can use it like "${korean}아/어요".`,
          },
        ],
      },
    ],
  }),

  // ============================================
  // 일반 동사 (verbs-common)
  // ============================================
  'verbs-common': (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `오늘 ${korean}해요.`,
        intermediate: `자주 ${korean}하는 편이에요.`,
        advanced: `${korean}하는 것은 중요한 일상 활동입니다.`,
        master: `${korean}의 다양한 맥락을 이해하면 자연스러운 한국어 구사가 가능합니다.`,
      },
      en: {
        beginner: `I ${english.toLowerCase()} today.`,
        intermediate: `I tend to ${english.toLowerCase()} often.`,
        advanced: `${english}ing is an important daily activity.`,
        master: `Understanding various contexts of ${english.toLowerCase()} enables natural Korean speaking.`,
      },
    },
    dialogues: [
      {
        context: { ko: '일상 대화에서', en: 'In daily conversation' },
        lines: [
          { speaker: 'A', ko: '오늘 뭐 할 거예요?', en: 'What will you do today?' },
          { speaker: 'B', ko: `${korean}할 거예요.`, en: `I'll ${english.toLowerCase()}.` },
          { speaker: 'A', ko: '좋겠다!', en: 'Sounds nice!' },
          { speaker: 'B', ko: '같이 할래요?', en: 'Want to join?' },
        ],
      },
    ],
  }),

  // ============================================
  // 모음 (vowels-basic, vowels-compound)
  // ============================================
  'vowels-basic': (korean, english, explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}" 소리를 내 봐요.`,
        intermediate: `"${korean}"가 들어가는 단어를 찾아봐요.`,
        advanced: `"${korean}"의 정확한 발음은 한국어 학습의 기본입니다.`,
        master: `"${korean}"의 음성학적 특성을 이해하면 발음이 정확해집니다.`,
      },
      en: {
        beginner: `Try making the "${korean}" sound.`,
        intermediate: `Find a word that contains "${korean}".`,
        advanced: `Accurate pronunciation of "${korean}" is fundamental to learning Korean.`,
        master: `Understanding the phonetic characteristics of "${korean}" improves pronunciation accuracy.`,
      },
    },
    dialogues: [
      {
        context: { ko: '발음을 연습하며', en: 'Practicing pronunciation' },
        lines: [
          {
            speaker: 'A',
            ko: `"${korean}" 발음이 어려워요.`,
            en: `The "${korean}" pronunciation is hard.`,
          },
          { speaker: 'B', ko: '입 모양을 잘 봐요.', en: 'Watch the mouth shape carefully.' },
          { speaker: 'A', ko: `"${korean}"... 이렇게요?`, en: `"${korean}"... like this?` },
          { speaker: 'B', ko: '맞아요, 잘했어요!', en: "That's right, well done!" },
        ],
      },
    ],
  }),

  // ============================================
  // 날씨 (weather)
  // ============================================
  weather: (korean, english, _explanation, _partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `오늘 ${josa(korean, '이에요/예요')}.`,
        intermediate: `${korean} 날씨에는 뭐 해요?`,
        advanced: `${josa(korean, '은/는')} 한국의 계절 변화를 보여줍니다.`,
        master: `${korean}에 대한 다양한 표현을 알면 자연스러운 일상 대화가 가능합니다.`,
      },
      en: {
        beginner: `Today is ${english.toLowerCase()}.`,
        intermediate: `What do you do in ${english.toLowerCase()} weather?`,
        advanced: `${english} shows the seasonal changes in Korea.`,
        master: `Knowing various expressions for ${english.toLowerCase()} enables natural daily conversation.`,
      },
    },
    dialogues: [
      {
        context: { ko: '날씨에 대해 이야기하며', en: 'Talking about weather' },
        lines: [
          { speaker: 'A', ko: '오늘 날씨 어때요?', en: "How's the weather today?" },
          {
            speaker: 'B',
            ko: `오늘은 ${josa(korean, '이에요/예요')}.`,
            en: `It's ${english.toLowerCase()} today.`,
          },
          { speaker: 'A', ko: '우산 가져가야 해요?', en: 'Should I bring an umbrella?' },
          { speaker: 'B', ko: '그러는 게 좋을 것 같아요.', en: 'I think you should.' },
        ],
      },
    ],
  }),
};

// 카테고리 별칭 매핑 (동일한 템플릿 재사용)
categoryTemplates['double-consonants'] = categoryTemplates.consonants;
categoryTemplates['vowels-compound'] = categoryTemplates['vowels-basic'];
categoryTemplates['body-parts'] = categoryTemplates.anatomy;
categoryTemplates['body-misc'] = categoryTemplates.anatomy;

// 품사별 기본 템플릿 (해당하는 category가 없을 때)
function defaultTemplate(
  korean: string,
  english: string,
  explanation: string,
  partOfSpeech: string,
): ExampleTemplates {
  switch (partOfSpeech) {
    case 'verb':
      return {
        sentences: {
          ko: {
            beginner: `오늘 ${korean}해요.`,
            intermediate: `자주 ${korean}하는 편이에요.`,
            advanced: `${korean}하는 것은 중요한 활동입니다.`,
            master: `${korean}의 다양한 맥락을 이해하면 자연스러운 표현이 가능합니다.`,
          },
          en: {
            beginner: `I ${english.toLowerCase()} today.`,
            intermediate: `I tend to ${english.toLowerCase()} often.`,
            advanced: `${english}ing is an important activity.`,
            master: `Understanding various contexts of ${english.toLowerCase()} enables natural expression.`,
          },
        },
        dialogues: [
          {
            context: { ko: '일상 대화에서', en: 'In daily conversation' },
            lines: [
              { speaker: 'A', ko: '오늘 뭐 했어요?', en: 'What did you do today?' },
              { speaker: 'B', ko: `${korean}했어요.`, en: `I ${english.toLowerCase()}ed.` },
              { speaker: 'A', ko: '어땠어요?', en: 'How was it?' },
              { speaker: 'B', ko: '좋았어요.', en: 'It was good.' },
            ],
          },
        ],
      };

    case 'adjective':
      return {
        sentences: {
          ko: {
            beginner: `이것은 ${korean}해요.`,
            intermediate: `정말 ${korean}하네요.`,
            advanced: `${korean}하다는 것은 상태를 나타내는 중요한 표현입니다.`,
            master: `${korean}의 뉘앙스를 이해하면 미묘한 감정 표현이 가능합니다.`,
          },
          en: {
            beginner: `This is ${english.toLowerCase()}.`,
            intermediate: `It's really ${english.toLowerCase()}.`,
            advanced: `Being ${english.toLowerCase()} is an important expression describing a state.`,
            master: `Understanding the nuance of "${english.toLowerCase()}" enables subtle emotional expression.`,
          },
        },
        dialogues: [
          {
            context: { ko: '무언가를 평가하며', en: 'Evaluating something' },
            lines: [
              { speaker: 'A', ko: '이거 어때요?', en: 'How is this?' },
              { speaker: 'B', ko: `${korean}해요.`, en: `It's ${english.toLowerCase()}.` },
              { speaker: 'A', ko: '정말요?', en: 'Really?' },
              { speaker: 'B', ko: '네, 확실해요.', en: 'Yes, definitely.' },
            ],
          },
        ],
      };

    case 'adverb':
      return {
        sentences: {
          ko: {
            beginner: `${korean} 해요.`,
            intermediate: `그 사람은 ${korean} 말해요.`,
            advanced: `"${korean}"은 동작의 정도를 표현하는 부사입니다.`,
            master: `"${korean}"의 적절한 사용은 문장의 표현력을 높입니다.`,
          },
          en: {
            beginner: `I do it ${english.toLowerCase()}.`,
            intermediate: `That person speaks ${english.toLowerCase()}.`,
            advanced: `"${korean}" is an adverb that expresses the degree of action.`,
            master: `Proper use of "${korean}" enhances the expressiveness of sentences.`,
          },
        },
        dialogues: [
          {
            context: { ko: '행동을 묘사하며', en: 'Describing an action' },
            lines: [
              { speaker: 'A', ko: '어떻게 했어요?', en: 'How did you do it?' },
              { speaker: 'B', ko: `${korean} 했어요.`, en: `I did it ${english.toLowerCase()}.` },
              { speaker: 'A', ko: '잘했어요!', en: 'Well done!' },
              { speaker: 'B', ko: '감사합니다.', en: 'Thank you.' },
            ],
          },
        ],
      };

    default:
      // 명사 및 기타 품사
      return {
        sentences: {
          ko: {
            beginner: `${josa(korean, '이/가')} 있어요.`,
            intermediate: `${josa(korean, '을/를')} 배웠어요.`,
            advanced: `${josa(korean, '은/는')} 중요한 개념입니다.`,
            master: `${korean}에 대한 이해는 학습에 필수적입니다.`,
          },
          en: {
            beginner: `There is ${english.toLowerCase()}.`,
            intermediate: `I learned about ${english.toLowerCase()}.`,
            advanced: `${english} is an important concept.`,
            master: `Understanding ${english.toLowerCase()} is essential for learning.`,
          },
        },
        dialogues: [
          {
            context: { ko: '공부하며', en: 'While studying' },
            lines: [
              {
                speaker: 'A',
                ko: `${josa(korean, '이/가')} 뭐예요?`,
                en: `What is ${english.toLowerCase()}?`,
              },
              { speaker: 'B', ko: `${explanation}`, en: `${explanation}` },
              { speaker: 'A', ko: '아, 그렇군요.', en: 'Ah, I see.' },
              { speaker: 'B', ko: '더 궁금한 것 있어요?', en: 'Do you have more questions?' },
            ],
          },
        ],
      };
  }
}

// ============================================
// 메인 처리 로직
// ============================================

function generateExamplesForEntry(entry: Entry): Entry {
  // translations 구조가 올바르지 않은 entry는 스킵
  if (
    !entry.translations ||
    typeof entry.translations.ko !== 'object' ||
    typeof entry.translations.en !== 'object'
  ) {
    return entry;
  }

  const korean = entry.korean;
  const english = entry.translations.en?.word || entry.korean;
  const explanation = entry.translations.ko?.explanation || '';
  const categoryId = entry.categoryId;
  const partOfSpeech = entry.partOfSpeech;

  // 해당 category 템플릿 가져오기
  const templateFn = categoryTemplates[categoryId] || defaultTemplate;
  const templates = templateFn(korean, english, explanation, partOfSpeech);

  // 문장예문 업데이트
  entry.translations.ko.examples = templates.sentences.ko;
  entry.translations.en.examples = templates.sentences.en;

  // 대화예문 추가 (첫 번째 템플릿 사용)
  if (templates.dialogues.length > 0) {
    const dialogueTemplate = templates.dialogues[0];

    entry.translations.ko.dialogue = {
      context: dialogueTemplate.context.ko,
      dialogue: dialogueTemplate.lines.map((line) => ({
        speaker: line.speaker,
        text: line.ko,
        romanization: toRomanization(line.ko),
        translation: line.en,
      })),
    };

    entry.translations.en.dialogue = {
      context: dialogueTemplate.context.en,
      dialogue: dialogueTemplate.lines.map((line) => ({
        speaker: line.speaker,
        text: line.en,
        romanization: '',
        translation: line.ko,
      })),
    };
  }

  return entry;
}

function processCategory(categoryFile: string): { name: string; updated: number } {
  const inputPath = join(ROOT_DIR, 'data/context/entries', categoryFile);
  const entries: Entry[] = JSON.parse(readFileSync(inputPath, 'utf-8'));
  const categoryName = categoryFile.replace('.json', '');

  // geography는 이미 처리했으므로 스킵
  if (categoryName === 'geography') {
    return { name: categoryName, updated: 0 };
  }

  const updatedEntries = entries.map((entry) => generateExamplesForEntry(entry));

  writeFileSync(inputPath, JSON.stringify(updatedEntries, null, 2), 'utf-8');

  return { name: categoryName, updated: entries.length };
}

function main() {
  console.log('📖 Loading all category files...\n');

  const entriesDir = join(ROOT_DIR, 'data/context/entries');
  const categoryFiles = readdirSync(entriesDir).filter((f) => f.endsWith('.json'));

  console.log(`Found ${categoryFiles.length} categories\n`);

  let totalUpdated = 0;
  const results: { name: string; updated: number }[] = [];

  for (const file of categoryFiles) {
    const result = processCategory(file);
    results.push(result);
    totalUpdated += result.updated;

    if (result.updated > 0) {
      console.log(`✅ ${result.name}: ${result.updated} entries updated`);
    } else {
      console.log(`⏭️  ${result.name}: skipped (already processed)`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Total categories: ${categoryFiles.length}`);
  console.log(`   Total entries updated: ${totalUpdated}`);
  console.log(`   - 4-level sentence examples (ko/en)`);
  console.log(`   - Contextual dialogue examples (ko/en)`);
}

main();
