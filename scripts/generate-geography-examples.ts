/**
 * 지리 어휘 고품질 예문 생성 스크립트
 *
 * 각 어휘마다:
 * 1. 문장예문 4레벨 (beginner, intermediate, advanced, master)
 * 2. 대화예문 (2-4턴)
 *
 * subcategory별 맥락에 맞는 자연스러운 예문 생성
 */

import { readFileSync, writeFileSync } from 'node:fs';
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
    } else if (char === '?' || char === '.' || char === '!' || char === ',') {
      result += char;
    } else {
      result += char;
    }
  }
  return result.toLowerCase().replace(/\s+/g, ' ').trim();
}

// ============================================
// Subcategory별 예문 템플릿
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

type SubcategoryTemplates = Record<
  string,
  (korean: string, english: string, explanation: string) => ExampleTemplates
>;

const subcategoryTemplates: SubcategoryTemplates = {
  // 대양 (5대양)
  ocean: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 정말 넓어요.`,
        intermediate: `${korean}을 건너는 비행은 오래 걸립니다.`,
        advanced: `${korean}은 전 세계 해양 생태계에서 중요한 역할을 합니다.`,
        master: `${korean}의 해류는 지구 기후 시스템에 결정적인 영향을 미칩니다.`,
      },
      en: {
        beginner: `The ${english} is really vast.`,
        intermediate: `Flights across the ${english} take a long time.`,
        advanced: `The ${english} plays a crucial role in the global marine ecosystem.`,
        master: `The ocean currents of the ${english} have a decisive impact on Earth's climate system.`,
      },
    },
    dialogues: [
      {
        context: { ko: '세계 지리 수업에서', en: 'In a world geography class' },
        lines: [
          {
            speaker: 'A',
            ko: `세계에서 가장 큰 바다가 뭐예요?`,
            en: 'What is the largest ocean in the world?',
          },
          {
            speaker: 'B',
            ko: `${korean}이 가장 커요. 지구 표면의 3분의 1을 차지해요.`,
            en: `The ${english} is the largest. It covers one-third of Earth's surface.`,
          },
          { speaker: 'A', ko: '와, 정말 넓네요!', en: "Wow, it's really vast!" },
          {
            speaker: 'B',
            ko: '네, 그래서 많은 나라들이 그 바다에 의존하고 있어요.',
            en: "Yes, that's why many countries depend on that ocean.",
          },
        ],
      },
    ],
  }),

  // 대륙 (6대륙)
  continent: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}에 가보고 싶어요.`,
        intermediate: `${korean}은 다양한 문화를 가지고 있어요.`,
        advanced: `${korean}의 역사는 인류 문명 발전에 큰 영향을 끼쳤습니다.`,
        master: `${korean}의 지정학적 위치는 현대 국제 관계에서 중요한 의미를 가집니다.`,
      },
      en: {
        beginner: `I want to visit ${english}.`,
        intermediate: `${english} has diverse cultures.`,
        advanced: `The history of ${english} has greatly influenced the development of human civilization.`,
        master: `The geopolitical position of ${english} holds significant meaning in modern international relations.`,
      },
    },
    dialogues: [
      {
        context: { ko: '여행 계획을 세우며', en: 'Planning a trip' },
        lines: [
          {
            speaker: 'A',
            ko: '다음 휴가 때 어디로 가고 싶어요?',
            en: 'Where do you want to go for your next vacation?',
          },
          {
            speaker: 'B',
            ko: `${korean}에 가보고 싶어요. 한 번도 가본 적이 없거든요.`,
            en: `I want to visit ${english}. I've never been there.`,
          },
          {
            speaker: 'A',
            ko: '거기 어떤 나라에 관심 있어요?',
            en: 'Which country there are you interested in?',
          },
          {
            speaker: 'B',
            ko: `${korean}의 자연환경이 정말 다양해서 여러 곳을 둘러보고 싶어요.`,
            en: `The natural environment in ${english} is so diverse, I want to explore several places.`,
          },
        ],
      },
    ],
  }),

  // 바다 (지역 바다)
  sea: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}는 아름다워요.`,
        intermediate: `${korean}에서 낚시를 해봤어요.`,
        advanced: `${korean}은 역사적으로 중요한 무역로였습니다.`,
        master: `${korean}의 해양 자원과 생태계 보존은 국제적 협력이 필요한 과제입니다.`,
      },
      en: {
        beginner: `The ${english} is beautiful.`,
        intermediate: `I went fishing in the ${english}.`,
        advanced: `The ${english} was historically an important trade route.`,
        master: `The marine resources and ecosystem preservation of the ${english} requires international cooperation.`,
      },
    },
    dialogues: [
      {
        context: { ko: '휴가 경험을 이야기하며', en: 'Talking about vacation experiences' },
        lines: [
          { speaker: 'A', ko: '지난 여름에 어디 다녀왔어요?', en: 'Where did you go last summer?' },
          {
            speaker: 'B',
            ko: `${korean} 근처로 여행 갔었어요. 바다가 정말 예뻤어요.`,
            en: `I traveled near the ${english}. The sea was really beautiful.`,
          },
          { speaker: 'A', ko: '해산물도 먹어봤어요?', en: 'Did you try the seafood?' },
          {
            speaker: 'B',
            ko: `네, ${korean}에서 잡은 생선이 정말 신선했어요.`,
            en: `Yes, the fish caught from the ${english} was really fresh.`,
          },
        ],
      },
    ],
  }),

  // 해협
  strait: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 좁아요.`,
        intermediate: `배가 ${korean}을 지나갔어요.`,
        advanced: `${korean}은 두 대륙을 연결하는 중요한 항로입니다.`,
        master: `${korean}의 전략적 가치는 역사적으로 많은 국제 분쟁의 원인이 되었습니다.`,
      },
      en: {
        beginner: `The ${english} is narrow.`,
        intermediate: `The ship passed through the ${english}.`,
        advanced: `The ${english} is an important shipping route connecting two continents.`,
        master: `The strategic value of the ${english} has historically been a cause of many international disputes.`,
      },
    },
    dialogues: [
      {
        context: { ko: '지리 숙제를 하며', en: 'Doing geography homework' },
        lines: [
          { speaker: 'A', ko: '해협이 뭐예요?', en: 'What is a strait?' },
          {
            speaker: 'B',
            ko: '두 육지 사이의 좁은 바닷길이에요.',
            en: "It's a narrow water passage between two landmasses.",
          },
          { speaker: 'A', ko: `${korean}도 해협이에요?`, en: `Is the ${english} a strait?` },
          {
            speaker: 'B',
            ko: `네, ${korean}은 아주 중요한 해협이에요. 많은 배들이 지나가요.`,
            en: `Yes, the ${english} is a very important strait. Many ships pass through it.`,
          },
        ],
      },
    ],
  }),

  // 만/걸프
  gulf: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}에 배가 많아요.`,
        intermediate: `${korean} 주변 도시들은 항구로 유명해요.`,
        advanced: `${korean}은 주변 국가들의 경제에 큰 영향을 미칩니다.`,
        master: `${korean}의 자원 개발과 환경 보호 사이의 균형은 지역 정책의 핵심 과제입니다.`,
      },
      en: {
        beginner: `There are many ships in the ${english}.`,
        intermediate: `Cities around the ${english} are famous for their ports.`,
        advanced: `The ${english} has a significant impact on the economies of surrounding countries.`,
        master: `Balancing resource development and environmental protection in the ${english} is a key regional policy challenge.`,
      },
    },
    dialogues: [
      {
        context: { ko: '뉴스를 보며', en: 'Watching the news' },
        lines: [
          {
            speaker: 'A',
            ko: `${korean}이 뉴스에 자주 나오네요.`,
            en: `The ${english} appears in the news often.`,
          },
          {
            speaker: 'B',
            ko: '네, 그 지역은 에너지 자원이 풍부해서 경제적으로 중요해요.',
            en: 'Yes, that region is economically important because of its rich energy resources.',
          },
          {
            speaker: 'A',
            ko: '석유가 많이 나온다고 들었어요.',
            en: "I heard there's a lot of oil there.",
          },
          {
            speaker: 'B',
            ko: `맞아요, ${korean} 주변 국가들은 석유 수출로 부유해졌어요.`,
            en: `That's right, countries around the ${english} became wealthy from oil exports.`,
          },
        ],
      },
    ],
  }),

  // 반도
  peninsula: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 바다로 둘러싸여 있어요.`,
        intermediate: `${korean}에서 해산물이 유명해요.`,
        advanced: `${korean}의 지형은 그 지역의 역사와 문화 발전에 영향을 주었습니다.`,
        master: `${korean}의 지정학적 위치는 역사적으로 강대국들의 관심을 끌어왔습니다.`,
      },
      en: {
        beginner: `${english} is surrounded by sea.`,
        intermediate: `Seafood is famous in ${english}.`,
        advanced: `The geography of ${english} influenced the historical and cultural development of the region.`,
        master: `The geopolitical position of ${english} has historically attracted the attention of major powers.`,
      },
    },
    dialogues: [
      {
        context: { ko: '지리 공부를 하며', en: 'Studying geography' },
        lines: [
          { speaker: 'A', ko: '반도가 뭐예요?', en: 'What is a peninsula?' },
          {
            speaker: 'B',
            ko: '삼면이 바다로 둘러싸인 땅이에요.',
            en: "It's land surrounded by water on three sides.",
          },
          { speaker: 'A', ko: `${korean}도 반도예요?`, en: `Is ${english} a peninsula?` },
          {
            speaker: 'B',
            ko: `네, ${korean}은 대표적인 반도 지형이에요.`,
            en: `Yes, ${english} is a typical peninsula landform.`,
          },
        ],
      },
    ],
  }),

  // 섬/군도
  island: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}에 가고 싶어요.`,
        intermediate: `${korean}은 관광지로 유명해요.`,
        advanced: `${korean}의 고유한 생태계는 연구 가치가 높습니다.`,
        master: `${korean}의 지속 가능한 발전은 관광과 환경 보존의 균형을 필요로 합니다.`,
      },
      en: {
        beginner: `I want to go to ${english}.`,
        intermediate: `${english} is famous as a tourist destination.`,
        advanced: `The unique ecosystem of ${english} has high research value.`,
        master: `Sustainable development of ${english} requires a balance between tourism and environmental conservation.`,
      },
    },
    dialogues: [
      {
        context: { ko: '휴양지를 추천받으며', en: 'Getting vacation recommendations' },
        lines: [
          {
            speaker: 'A',
            ko: '휴가 때 섬에 가고 싶은데 추천해 주세요.',
            en: 'I want to go to an island for vacation. Any recommendations?',
          },
          {
            speaker: 'B',
            ko: `${korean} 어때요? 경치가 정말 아름다워요.`,
            en: `How about ${english}? The scenery is really beautiful.`,
          },
          { speaker: 'A', ko: '거기 뭐가 좋아요?', en: "What's good there?" },
          {
            speaker: 'B',
            ko: `해변도 예쁘고 ${korean}만의 독특한 문화도 경험할 수 있어요.`,
            en: `The beaches are beautiful and you can experience the unique culture of ${english}.`,
          },
        ],
      },
    ],
  }),

  // 군도
  archipelago: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}에는 섬이 많아요.`,
        intermediate: `${korean}은 여러 섬으로 이루어져 있어요.`,
        advanced: `${korean}의 각 섬마다 독특한 문화가 발달했습니다.`,
        master: `${korean}의 해양 영토 관리는 복잡한 국제법적 쟁점을 포함합니다.`,
      },
      en: {
        beginner: `${english} has many islands.`,
        intermediate: `${english} is made up of several islands.`,
        advanced: `Each island in ${english} has developed its own unique culture.`,
        master: `The maritime territorial management of ${english} involves complex international law issues.`,
      },
    },
    dialogues: [
      {
        context: { ko: '군도에 대해 배우며', en: 'Learning about archipelagos' },
        lines: [
          { speaker: 'A', ko: '군도가 뭐예요?', en: 'What is an archipelago?' },
          {
            speaker: 'B',
            ko: '여러 개의 섬이 모여 있는 것을 군도라고 해요.',
            en: 'A group of islands is called an archipelago.',
          },
          {
            speaker: 'A',
            ko: `${korean}은 섬이 몇 개예요?`,
            en: `How many islands are in ${english}?`,
          },
          {
            speaker: 'B',
            ko: `${korean}은 수천 개의 섬으로 이루어져 있어요.`,
            en: `${english} consists of thousands of islands.`,
          },
        ],
      },
    ],
  }),

  // 산맥
  'mountain-range': (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 높아요.`,
        intermediate: `${korean}을 등산하는 것은 도전적이에요.`,
        advanced: `${korean}은 여러 나라에 걸쳐 있어 국경을 형성합니다.`,
        master: `${korean}의 형성은 판 구조론을 이해하는 데 중요한 사례입니다.`,
      },
      en: {
        beginner: `${english} is high.`,
        intermediate: `Hiking ${english} is challenging.`,
        advanced: `${english} spans multiple countries and forms borders.`,
        master: `The formation of ${english} is an important case for understanding plate tectonics.`,
      },
    },
    dialogues: [
      {
        context: { ko: '등산 계획을 세우며', en: 'Planning a mountain trip' },
        lines: [
          {
            speaker: 'A',
            ko: '세계에서 가장 유명한 산맥이 뭐예요?',
            en: 'What is the most famous mountain range in the world?',
          },
          {
            speaker: 'B',
            ko: `${korean}이 가장 유명하죠. 정말 웅장해요.`,
            en: `${english} is the most famous. It's really magnificent.`,
          },
          { speaker: 'A', ko: '거기 가본 적 있어요?', en: 'Have you been there?' },
          {
            speaker: 'B',
            ko: `아니요, 하지만 언젠가 ${korean}을 등반하고 싶어요.`,
            en: `No, but someday I want to climb ${english}.`,
          },
        ],
      },
    ],
  }),

  mountainRange: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 높아요.`,
        intermediate: `${korean}을 등산하는 것은 도전적이에요.`,
        advanced: `${korean}은 여러 나라에 걸쳐 있어 국경을 형성합니다.`,
        master: `${korean}의 형성은 판 구조론을 이해하는 데 중요한 사례입니다.`,
      },
      en: {
        beginner: `${english} is high.`,
        intermediate: `Hiking ${english} is challenging.`,
        advanced: `${english} spans multiple countries and forms borders.`,
        master: `The formation of ${english} is an important case for understanding plate tectonics.`,
      },
    },
    dialogues: [
      {
        context: { ko: '등산 계획을 세우며', en: 'Planning a mountain trip' },
        lines: [
          {
            speaker: 'A',
            ko: '세계에서 가장 유명한 산맥이 뭐예요?',
            en: 'What is the most famous mountain range in the world?',
          },
          {
            speaker: 'B',
            ko: `${korean}이 가장 유명하죠. 정말 웅장해요.`,
            en: `${english} is the most famous. It's really magnificent.`,
          },
          { speaker: 'A', ko: '거기 가본 적 있어요?', en: 'Have you been there?' },
          {
            speaker: 'B',
            ko: `아니요, 하지만 언젠가 ${korean}을 등반하고 싶어요.`,
            en: `No, but someday I want to climb ${english}.`,
          },
        ],
      },
    ],
  }),

  // 산
  mountain: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 아름다워요.`,
        intermediate: `${korean} 정상에서 보는 경치가 최고예요.`,
        advanced: `${korean}은 등반가들에게 도전적인 목표입니다.`,
        master: `${korean}의 등반 역사는 인간 탐험 정신의 상징입니다.`,
      },
      en: {
        beginner: `${english} is beautiful.`,
        intermediate: `The view from the summit of ${english} is the best.`,
        advanced: `${english} is a challenging goal for climbers.`,
        master: `The climbing history of ${english} symbolizes the human spirit of exploration.`,
      },
    },
    dialogues: [
      {
        context: { ko: '등산 경험을 나누며', en: 'Sharing hiking experiences' },
        lines: [
          { speaker: 'A', ko: '어떤 산을 올라봤어요?', en: 'What mountains have you climbed?' },
          {
            speaker: 'B',
            ko: `${korean}에 가봤어요. 정말 힘들었어요.`,
            en: `I've been to ${english}. It was really tough.`,
          },
          { speaker: 'A', ko: '정상까지 올라갔어요?', en: 'Did you make it to the summit?' },
          {
            speaker: 'B',
            ko: `네, ${korean} 정상의 경치는 잊을 수 없어요.`,
            en: `Yes, the view from the top of ${english} is unforgettable.`,
          },
        ],
      },
    ],
  }),

  // 사막
  desert: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 뜨거워요.`,
        intermediate: `${korean}에서 낙타를 탔어요.`,
        advanced: `${korean}의 생태계는 극한 환경에 적응한 독특한 생물들이 있습니다.`,
        master: `${korean}의 사막화 확산은 기후 변화의 심각한 영향을 보여줍니다.`,
      },
      en: {
        beginner: `${english} is hot.`,
        intermediate: `I rode a camel in ${english}.`,
        advanced: `The ecosystem of ${english} has unique organisms adapted to extreme environments.`,
        master: `The expansion of desertification in ${english} shows the serious effects of climate change.`,
      },
    },
    dialogues: [
      {
        context: {
          ko: '사막 여행 경험을 이야기하며',
          en: 'Talking about desert travel experiences',
        },
        lines: [
          { speaker: 'A', ko: '사막에 가본 적 있어요?', en: 'Have you been to a desert?' },
          {
            speaker: 'B',
            ko: `네, ${korean}에 다녀왔어요. 정말 신기한 경험이었어요.`,
            en: `Yes, I visited ${english}. It was an amazing experience.`,
          },
          { speaker: 'A', ko: '밤에는 어땠어요?', en: 'What was it like at night?' },
          {
            speaker: 'B',
            ko: `${korean}의 밤하늘 별이 정말 아름다웠어요.`,
            en: `The night sky stars in ${english} were really beautiful.`,
          },
        ],
      },
    ],
  }),

  // 강
  river: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 길어요.`,
        intermediate: `${korean}에서 배를 탔어요.`,
        advanced: `${korean}은 주변 지역의 농업과 문명 발달에 핵심적이었습니다.`,
        master: `${korean}의 수자원 관리는 상류와 하류 국가들 간의 협력이 필요합니다.`,
      },
      en: {
        beginner: `${english} is long.`,
        intermediate: `I took a boat on ${english}.`,
        advanced: `${english} was essential to agriculture and civilization development in surrounding areas.`,
        master: `Water resource management of ${english} requires cooperation between upstream and downstream countries.`,
      },
    },
    dialogues: [
      {
        context: { ko: '강 유람선 투어를 계획하며', en: 'Planning a river cruise tour' },
        lines: [
          {
            speaker: 'A',
            ko: '유람선 투어 어디가 좋을까요?',
            en: 'Where would be good for a river cruise tour?',
          },
          {
            speaker: 'B',
            ko: `${korean} 유람선이 인기 있어요. 경치가 아름다워요.`,
            en: `A ${english} cruise is popular. The scenery is beautiful.`,
          },
          {
            speaker: 'A',
            ko: '강 주변에 볼거리가 많아요?',
            en: 'Are there many things to see around the river?',
          },
          {
            speaker: 'B',
            ko: `네, ${korean} 주변에는 역사적인 도시들이 많아요.`,
            en: `Yes, there are many historic cities along ${english}.`,
          },
        ],
      },
    ],
  }),

  // 호수
  lake: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 맑아요.`,
        intermediate: `${korean}에서 수영했어요.`,
        advanced: `${korean}은 주변 지역의 중요한 수원지입니다.`,
        master: `${korean}의 생태계 보존은 지역 생물 다양성 유지에 필수적입니다.`,
      },
      en: {
        beginner: `${english} is clear.`,
        intermediate: `I swam in ${english}.`,
        advanced: `${english} is an important water source for the surrounding area.`,
        master: `Preserving the ecosystem of ${english} is essential for maintaining regional biodiversity.`,
      },
    },
    dialogues: [
      {
        context: { ko: '호수 여행을 계획하며', en: 'Planning a lake trip' },
        lines: [
          { speaker: 'A', ko: '호수 여행 어디가 좋아요?', en: 'Where is good for a lake trip?' },
          {
            speaker: 'B',
            ko: `${korean}을 추천해요. 물이 정말 맑아요.`,
            en: `I recommend ${english}. The water is really clear.`,
          },
          { speaker: 'A', ko: '거기서 뭘 할 수 있어요?', en: 'What can you do there?' },
          {
            speaker: 'B',
            ko: `${korean}에서 카약도 타고 낚시도 할 수 있어요.`,
            en: `You can kayak and fish at ${english}.`,
          },
        ],
      },
    ],
  }),

  // 폭포
  waterfall: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 멋져요.`,
        intermediate: `${korean}의 소리가 우렁차요.`,
        advanced: `${korean}은 수력 발전의 잠재력을 가지고 있습니다.`,
        master: `${korean}의 관광 개발과 자연 보존 사이의 균형이 중요합니다.`,
      },
      en: {
        beginner: `${english} is magnificent.`,
        intermediate: `The sound of ${english} is thunderous.`,
        advanced: `${english} has potential for hydroelectric power generation.`,
        master: `Balancing tourism development and nature conservation at ${english} is important.`,
      },
    },
    dialogues: [
      {
        context: { ko: '폭포 관광지를 이야기하며', en: 'Talking about waterfall tourist spots' },
        lines: [
          {
            speaker: 'A',
            ko: '세계에서 가장 유명한 폭포가 뭐예요?',
            en: 'What is the most famous waterfall in the world?',
          },
          {
            speaker: 'B',
            ko: `${korean}이 가장 유명해요. 정말 장관이에요.`,
            en: `${english} is the most famous. It's truly spectacular.`,
          },
          { speaker: 'A', ko: '가까이 가서 볼 수 있어요?', en: 'Can you get close to see it?' },
          {
            speaker: 'B',
            ko: `네, ${korean} 가까이 가면 물보라가 엄청나요.`,
            en: `Yes, the spray is tremendous when you get close to ${english}.`,
          },
        ],
      },
    ],
  }),

  // 평원/고원
  plain: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 넓어요.`,
        intermediate: `${korean}에서 농사를 많이 지어요.`,
        advanced: `${korean}은 농업과 목축업의 중심지입니다.`,
        master: `${korean}의 토지 이용 변화는 지역 생태계에 큰 영향을 미칩니다.`,
      },
      en: {
        beginner: `${english} is wide.`,
        intermediate: `There is a lot of farming in ${english}.`,
        advanced: `${english} is a center for agriculture and livestock.`,
        master: `Land use changes in ${english} have significant impacts on regional ecosystems.`,
      },
    },
    dialogues: [
      {
        context: { ko: '지리 수업에서', en: 'In geography class' },
        lines: [
          {
            speaker: 'A',
            ko: '평원이랑 고원의 차이가 뭐예요?',
            en: "What's the difference between a plain and a plateau?",
          },
          {
            speaker: 'B',
            ko: '평원은 낮고 평평한 땅이고, 고원은 높고 평평한 땅이에요.',
            en: 'A plain is low flat land, and a plateau is high flat land.',
          },
          {
            speaker: 'A',
            ko: `${korean}은 어떤 지형이에요?`,
            en: `What kind of terrain is ${english}?`,
          },
          {
            speaker: 'B',
            ko: `${korean}은 농업에 아주 중요한 지역이에요.`,
            en: `${english} is a very important area for agriculture.`,
          },
        ],
      },
    ],
  }),

  // 고원
  plateau: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 높아요.`,
        intermediate: `${korean}의 공기는 맑아요.`,
        advanced: `${korean}의 고도는 그 지역의 기후에 큰 영향을 미칩니다.`,
        master: `${korean}의 지질학적 형성 과정은 지구 역사를 이해하는 데 중요합니다.`,
      },
      en: {
        beginner: `${english} is high.`,
        intermediate: `The air in ${english} is fresh.`,
        advanced: `The altitude of ${english} greatly affects the regional climate.`,
        master: `The geological formation process of ${english} is important for understanding Earth's history.`,
      },
    },
    dialogues: [
      {
        context: { ko: '고원 여행을 계획하며', en: 'Planning a plateau trip' },
        lines: [
          {
            speaker: 'A',
            ko: '고원에 가면 고산병이 걱정돼요.',
            en: "I'm worried about altitude sickness when going to plateaus.",
          },
          { speaker: 'B', ko: '천천히 적응하면 괜찮아요.', en: "It's okay if you adapt slowly." },
          { speaker: 'A', ko: `${korean}은 얼마나 높아요?`, en: `How high is ${english}?` },
          {
            speaker: 'B',
            ko: `${korean}은 평균 해발 4,000미터가 넘어요.`,
            en: `${english} averages over 4,000 meters above sea level.`,
          },
        ],
      },
    ],
  }),

  // 협곡/계곡
  canyon: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 깊어요.`,
        intermediate: `${korean}의 경치는 장관이에요.`,
        advanced: `${korean}은 수백만 년의 침식 작용으로 형성되었습니다.`,
        master: `${korean}의 지층은 지구의 지질학적 역사를 보여주는 귀중한 기록입니다.`,
      },
      en: {
        beginner: `${english} is deep.`,
        intermediate: `The scenery of ${english} is spectacular.`,
        advanced: `${english} was formed by millions of years of erosion.`,
        master: `The rock layers of ${english} are a valuable record showing Earth's geological history.`,
      },
    },
    dialogues: [
      {
        context: { ko: '자연 경관을 이야기하며', en: 'Talking about natural scenery' },
        lines: [
          {
            speaker: 'A',
            ko: '세계에서 가장 유명한 협곡이 어디예요?',
            en: 'Where is the most famous canyon in the world?',
          },
          {
            speaker: 'B',
            ko: `${korean}이 가장 유명해요. 정말 깊고 웅장해요.`,
            en: `${english} is the most famous. It's really deep and magnificent.`,
          },
          { speaker: 'A', ko: '어떻게 만들어졌어요?', en: 'How was it formed?' },
          {
            speaker: 'B',
            ko: `${korean}은 강물이 오랜 시간 땅을 깎아서 만들어졌어요.`,
            en: `${english} was created by a river eroding the land over a long time.`,
          },
        ],
      },
    ],
  }),

  // 곶/해안
  coastal: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}에 배가 있어요.`,
        intermediate: `${korean}은 등대로 유명해요.`,
        advanced: `${korean}은 항해에서 중요한 지표입니다.`,
        master: `${korean}의 해양 생태계는 기후 변화의 영향을 직접 받고 있습니다.`,
      },
      en: {
        beginner: `There are boats at ${english}.`,
        intermediate: `${english} is famous for its lighthouse.`,
        advanced: `${english} is an important landmark for navigation.`,
        master: `The marine ecosystem of ${english} is directly affected by climate change.`,
      },
    },
    dialogues: [
      {
        context: { ko: '해안 드라이브를 계획하며', en: 'Planning a coastal drive' },
        lines: [
          {
            speaker: 'A',
            ko: '해안 드라이브 어디가 좋아요?',
            en: 'Where is good for a coastal drive?',
          },
          {
            speaker: 'B',
            ko: `${korean} 근처가 경치가 아름다워요.`,
            en: `The area near ${english} has beautiful scenery.`,
          },
          { speaker: 'A', ko: '일몰 볼 수 있어요?', en: 'Can we watch the sunset?' },
          {
            speaker: 'B',
            ko: `네, ${korean}에서 보는 일몰이 유명해요.`,
            en: `Yes, the sunset viewed from ${english} is famous.`,
          },
        ],
      },
    ],
  }),

  cape: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}에 등대가 있어요.`,
        intermediate: `${korean}은 바다로 쭉 뻗어 있어요.`,
        advanced: `${korean}은 역사적으로 항해의 중요한 이정표였습니다.`,
        master: `${korean}의 지리적 위치는 해양 무역 발전에 결정적 역할을 했습니다.`,
      },
      en: {
        beginner: `There is a lighthouse at ${english}.`,
        intermediate: `${english} extends far into the sea.`,
        advanced: `${english} was historically an important milestone for navigation.`,
        master: `The geographical position of ${english} played a decisive role in maritime trade development.`,
      },
    },
    dialogues: [
      {
        context: { ko: '역사 수업에서', en: 'In history class' },
        lines: [
          {
            speaker: 'A',
            ko: '대항해 시대에 곶이 왜 중요했어요?',
            en: 'Why were capes important during the Age of Exploration?',
          },
          {
            speaker: 'B',
            ko: '항해의 이정표 역할을 했어요.',
            en: 'They served as landmarks for navigation.',
          },
          {
            speaker: 'A',
            ko: `${korean}도 그런 역할을 했어요?`,
            en: `Did ${english} play such a role?`,
          },
          {
            speaker: 'B',
            ko: `네, ${korean}은 아주 중요한 항로의 기점이었어요.`,
            en: `Yes, ${english} was a very important starting point for shipping routes.`,
          },
        ],
      },
    ],
  }),

  // 일반 용어
  term: (korean, english, explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}이 뭐예요?`,
        intermediate: `${korean}에 대해 배웠어요.`,
        advanced: `${korean}의 개념은 지리학에서 중요합니다.`,
        master: `${korean}에 대한 이해는 지구 시스템을 종합적으로 파악하는 데 필수적입니다.`,
      },
      en: {
        beginner: `What is ${english.toLowerCase()}?`,
        intermediate: `I learned about ${english.toLowerCase()}.`,
        advanced: `The concept of ${english.toLowerCase()} is important in geography.`,
        master: `Understanding ${english.toLowerCase()} is essential for comprehensively grasping Earth systems.`,
      },
    },
    dialogues: [
      {
        context: { ko: '지리 용어를 공부하며', en: 'Studying geography terms' },
        lines: [
          {
            speaker: 'A',
            ko: `${korean}이 무슨 뜻이에요?`,
            en: `What does ${english.toLowerCase()} mean?`,
          },
          { speaker: 'B', ko: `${explanation}`, en: `${explanation}` },
          { speaker: 'A', ko: '예를 들어 줄 수 있어요?', en: 'Can you give me an example?' },
          {
            speaker: 'B',
            ko: `${korean}의 예로는 여러 가지가 있어요.`,
            en: `There are many examples of ${english.toLowerCase()}.`,
          },
        ],
      },
    ],
  }),

  // 지역 구분
  region: (korean, english, _explanation) => ({
    sentences: {
      ko: {
        beginner: `${korean}은 어디예요?`,
        intermediate: `${korean}의 문화가 독특해요.`,
        advanced: `${korean}은 지리적으로 중요한 위치에 있습니다.`,
        master: `${korean}의 지역적 특성은 그 지역의 정치, 경제, 문화 발전에 영향을 미쳤습니다.`,
      },
      en: {
        beginner: `Where is ${english}?`,
        intermediate: `The culture of ${english} is unique.`,
        advanced: `${english} is in a geographically important location.`,
        master: `The regional characteristics of ${english} have influenced the political, economic, and cultural development of the area.`,
      },
    },
    dialogues: [
      {
        context: { ko: '세계 지역을 공부하며', en: 'Studying world regions' },
        lines: [
          { speaker: 'A', ko: `${korean}이 어디에 있어요?`, en: `Where is ${english}?` },
          {
            speaker: 'B',
            ko: `${korean}은 지도에서 여기 있어요.`,
            en: `${english} is here on the map.`,
          },
          {
            speaker: 'A',
            ko: '거기는 어떤 특징이 있어요?',
            en: 'What are the characteristics there?',
          },
          {
            speaker: 'B',
            ko: `${korean}은 다양한 문화와 자연환경으로 유명해요.`,
            en: `${english} is famous for its diverse culture and natural environment.`,
          },
        ],
      },
    ],
  }),
};

// 기본 템플릿 (해당하는 subcategory가 없을 때)
function defaultTemplate(korean: string, english: string, explanation: string): ExampleTemplates {
  return {
    sentences: {
      ko: {
        beginner: `${korean}은/는 유명해요.`,
        intermediate: `${korean}에 대해 알게 되었어요.`,
        advanced: `${korean}의 특성은 지리학적으로 중요합니다.`,
        master: `${korean}은/는 지구 시스템을 이해하는 데 중요한 요소입니다.`,
      },
      en: {
        beginner: `${english} is famous.`,
        intermediate: `I learned about ${english}.`,
        advanced: `The characteristics of ${english} are geographically important.`,
        master: `${english} is an important element in understanding Earth systems.`,
      },
    },
    dialogues: [
      {
        context: { ko: '지리를 공부하며', en: 'Studying geography' },
        lines: [
          { speaker: 'A', ko: `${korean}에 대해 알아요?`, en: `Do you know about ${english}?` },
          {
            speaker: 'B',
            ko: `네, ${korean}은 지리에서 중요해요.`,
            en: `Yes, ${english} is important in geography.`,
          },
          { speaker: 'A', ko: '왜 중요해요?', en: 'Why is it important?' },
          { speaker: 'B', ko: `${explanation}`, en: `${explanation}` },
        ],
      },
    ],
  };
}

// ============================================
// 메인 처리 로직
// ============================================

function getSubcategory(tags: string[]): string {
  // geography 태그 제외하고 첫 번째 구체적 태그 반환
  const specificTags = tags.filter((t) => t !== 'geography');
  return specificTags[0] || 'term';
}

function generateExamplesForEntry(entry: Entry): Entry {
  const korean = entry.korean;
  const english = entry.translations.en.word;
  const explanation = entry.translations.ko.explanation;
  const subcategory = getSubcategory(entry.tags);

  // 해당 subcategory 템플릿 가져오기
  const templateFn = subcategoryTemplates[subcategory] || defaultTemplate;
  const templates = templateFn(korean, english, explanation);

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
        romanization: '', // 영어는 로마자 변환 불필요
        translation: line.ko,
      })),
    };
  }

  return entry;
}

function main() {
  console.log('📖 Loading geography entries...');

  const inputPath = join(ROOT_DIR, 'data/context/entries/geography.json');
  const entries: Entry[] = JSON.parse(readFileSync(inputPath, 'utf-8'));

  console.log(`   Found ${entries.length} entries`);

  // subcategory별 통계
  const subcategoryStats: Record<string, number> = {};

  console.log('\n🔄 Generating examples for each entry...');

  const updatedEntries = entries.map((entry) => {
    const subcategory = getSubcategory(entry.tags);
    subcategoryStats[subcategory] = (subcategoryStats[subcategory] || 0) + 1;
    return generateExamplesForEntry(entry);
  });

  console.log('\n📊 Subcategory distribution:');
  for (const [subcategory, count] of Object.entries(subcategoryStats).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${count.toString().padStart(4)} ${subcategory}`);
  }

  // 저장
  const outputPath = join(ROOT_DIR, 'data/context/entries/geography.json');
  writeFileSync(outputPath, JSON.stringify(updatedEntries, null, 2), 'utf-8');

  console.log(`\n✅ Updated ${entries.length} entries with high-quality examples`);
  console.log(`   - 4-level sentence examples (ko/en)`);
  console.log(`   - Contextual dialogue examples (ko/en)`);
}

main();
