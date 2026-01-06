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
  greetings: (korean, english, explanation, partOfSpeech) => ({
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
  food: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}을/를 먹어요.`,
        intermediate: `${korean}이/가 맛있어요.`,
        advanced: `${korean}은/는 한국의 대표적인 음식 중 하나입니다.`,
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
  'daily-life': (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `매일 ${korean}을/를 해요.`,
        intermediate: `${korean}은/는 일상에서 중요해요.`,
        advanced: `${korean}을/를 통해 규칙적인 생활을 유지합니다.`,
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
          { speaker: 'B', ko: `저는 ${korean}을/를 해요.`, en: `I ${english.toLowerCase()}.` },
          { speaker: 'A', ko: '매일 해요?', en: 'Do you do it every day?' },
          { speaker: 'B', ko: '네, 거의 매일 해요.', en: 'Yes, almost every day.' },
        ],
      },
    ],
  }),

  // ============================================
  // 감정 (emotions)
  // ============================================
  emotions: (korean, english, explanation, partOfSpeech) => ({
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
  family: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `제 ${korean}이에요/예요.`,
        intermediate: `${korean}과/와 함께 살아요.`,
        advanced: `${korean}과/와의 관계는 가정에서 중요합니다.`,
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
          { speaker: 'B', ko: `${korean}이/가 있어요.`, en: `I have a ${english.toLowerCase()}.` },
          { speaker: 'A', ko: '같이 사세요?', en: 'Do you live together?' },
          { speaker: 'B', ko: '네, 같이 살아요.', en: 'Yes, we live together.' },
        ],
      },
    ],
  }),

  // ============================================
  // 직장 (work)
  // ============================================
  work: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `회사에서 ${korean}을/를 해요.`,
        intermediate: `${korean}이/가 제 업무예요.`,
        advanced: `${korean}은/는 직장 생활에서 필수적인 능력입니다.`,
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
            ko: `${korean}을/를 해야 해요.`,
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
  transportation: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}을/를 타요.`,
        intermediate: `${korean}으로/로 출퇴근해요.`,
        advanced: `${korean}은/는 도시 교통의 중요한 수단입니다.`,
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
          { speaker: 'B', ko: `${korean}을/를 타요.`, en: `I take the ${english.toLowerCase()}.` },
          { speaker: 'A', ko: '편해요?', en: 'Is it convenient?' },
          { speaker: 'B', ko: '네, 아주 편해요.', en: 'Yes, very convenient.' },
        ],
      },
    ],
  }),

  // ============================================
  // 쇼핑 (shopping)
  // ============================================
  shopping: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}을/를 사요.`,
        intermediate: `${korean}이/가 세일이에요.`,
        advanced: `${korean}을/를 구매할 때 품질을 확인해야 합니다.`,
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
            ko: `${korean}을/를 찾고 있어요.`,
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
  travel: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}에 가요.`,
        intermediate: `${korean}에서 여행했어요.`,
        advanced: `${korean}은/는 관광지로 유명합니다.`,
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
  'time-date': (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `지금 ${korean}이에요.`,
        intermediate: `${korean}에 만나요.`,
        advanced: `${korean}의 개념은 일정 관리에 필수적입니다.`,
        master: `${korean}을/를 효율적으로 활용하는 것이 생산성의 핵심입니다.`,
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
  countries: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}에서 왔어요.`,
        intermediate: `${korean}은/는 아름다운 나라예요.`,
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
  'verbs-basic': (korean, english, explanation, partOfSpeech) => ({
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
  'adjectives-basic': (korean, english, explanation, partOfSpeech) => ({
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
  particles: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `"${korean}"을/를 사용해요.`,
        intermediate: `이 문장에서 "${korean}"이/가 필요해요.`,
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
          { speaker: 'A', ko: `"${korean}"은/는 언제 써요?`, en: `When do you use "${korean}"?` },
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
  numbers: (korean, english, explanation, partOfSpeech) => ({
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
  sports: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}을/를 해요.`,
        intermediate: `${korean}을/를 좋아해요.`,
        advanced: `${korean}은/는 체력 향상에 좋습니다.`,
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
            ko: `네, ${korean}을/를 좋아해요.`,
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
  space: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}이/가 보여요.`,
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
            ko: `${korean}이/가 정말 신기해요.`,
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
  physics: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}을/를 배워요.`,
        intermediate: `${korean}은/는 중요한 개념이에요.`,
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
  music: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}을/를 들어요.`,
        intermediate: `${korean}이/가 좋아요.`,
        advanced: `${korean}은/는 음악에서 중요한 요소입니다.`,
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
          { speaker: 'B', ko: `${korean}을/를 좋아해요.`, en: `I like ${english.toLowerCase()}.` },
          { speaker: 'A', ko: '추천해 줄 수 있어요?', en: 'Can you recommend something?' },
          { speaker: 'B', ko: '물론이죠!', en: 'Of course!' },
        ],
      },
    ],
  }),

  // ============================================
  // 수학 (math)
  // ============================================
  math: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}을/를 배워요.`,
        intermediate: `${korean}이/가 어려워요.`,
        advanced: `${korean}은/는 수학의 기본 개념입니다.`,
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
            ko: `${korean}을/를 공부하고 있어요.`,
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
  culture: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}을/를 좋아해요.`,
        intermediate: `${korean}은/는 한국 문화의 일부예요.`,
        advanced: `${korean}을/를 통해 한국 문화를 이해할 수 있습니다.`,
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
  art: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}을/를 봐요.`,
        intermediate: `${korean}이/가 아름다워요.`,
        advanced: `${korean}은/는 예술의 중요한 형식입니다.`,
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
            ko: `네, 특히 ${korean}을/를 좋아해요.`,
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
  coding: (korean, english, explanation, partOfSpeech) => ({
    sentences: {
      ko: {
        beginner: `${korean}을/를 사용해요.`,
        intermediate: `${korean}이/가 프로그래밍에서 중요해요.`,
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
};

// 기본 템플릿 (해당하는 category가 없을 때)
function defaultTemplate(
  korean: string,
  english: string,
  explanation: string,
  partOfSpeech: string,
): ExampleTemplates {
  return {
    sentences: {
      ko: {
        beginner: `${korean}이에요/예요.`,
        intermediate: `${korean}에 대해 배웠어요.`,
        advanced: `${korean}의 개념은 중요합니다.`,
        master: `${korean}에 대한 이해는 학습에 필수적입니다.`,
      },
      en: {
        beginner: `It's ${english.toLowerCase()}.`,
        intermediate: `I learned about ${english.toLowerCase()}.`,
        advanced: `The concept of ${english.toLowerCase()} is important.`,
        master: `Understanding ${english.toLowerCase()} is essential for learning.`,
      },
    },
    dialogues: [
      {
        context: { ko: '공부하며', en: 'While studying' },
        lines: [
          { speaker: 'A', ko: `${korean}이/가 뭐예요?`, en: `What is ${english.toLowerCase()}?` },
          { speaker: 'B', ko: `${explanation}`, en: `${explanation}` },
          { speaker: 'A', ko: '예를 들어 줄 수 있어요?', en: 'Can you give me an example?' },
          { speaker: 'B', ko: '네, 여기 있어요.', en: 'Yes, here it is.' },
        ],
      },
    ],
  };
}

// ============================================
// 메인 처리 로직
// ============================================

function generateExamplesForEntry(entry: Entry): Entry {
  const korean = entry.korean;
  const english = entry.translations.en.word;
  const explanation = entry.translations.ko.explanation;
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
