/**
 * @fileoverview 카테고리 세분화 스크립트
 *
 * 너무 넓은 카테고리를 의미론적으로 세분화합니다:
 * - basic-words (2189) → slang, pronouns, adverbs, responses, verbs-common, nouns-common
 * - daily-life (1984) → places, home, routines, events, objects
 * - body (2136) → actions, anatomy, gestures, health
 *
 * @usage pnpm refine-categories
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = join(__dirname, '../public/data/by-category-full');
const ENTRIES_SOURCE_DIR = join(__dirname, '../app/data/entries'); // 소스 JSON 디렉토리
const CATEGORIES_FILE = join(__dirname, '../app/data/categories.json');

interface OriginalEntry {
  id: string;
  korean: string;
  romanization: string;
  pronunciation?: { korean: string; ipa?: string };
  partOfSpeech: string;
  categoryId: string;
  difficulty: string;
  frequency?: string;
  tags: string[];
  hasDialogue?: boolean;
  translation: {
    word: string;
    explanation: string;
    examples?: {
      beginner: string;
      intermediate: string;
      advanced: string;
      master?: string;
    };
    variations?: {
      formal?: string[];
      casual?: string[];
      short?: string[];
    };
  };
}

interface Category {
  id: string;
  name: { ko: string; en: string };
  description: { ko: string; en: string };
  icon: string;
  color: string;
  order: number;
}

// ============================================================================
// 분류 규칙 정의
// ============================================================================

/** basic-words 세분화 규칙 */
const BASIC_WORDS_RULES = {
  // 슬랭/구어체/신조어
  slang: {
    koreanKeywords: [
      '대박',
      '짱',
      '굿',
      '헐',
      '쩐다',
      '존',
      '개',
      '킹',
      '갓',
      '워라밸',
      '갓생',
      'TMI',
      'MBTI',
      '인싸',
      '아싸',
      '꿀잼',
      '노잼',
      '핵',
      '존맛',
      '레전드',
      '오글',
      '쪽팔',
      '민망',
      'ㅋㅋㅋ',
      'ㅎㅎㅎ',
      '크크크',
      '웃기',
      '찐',
    ],
    englishKeywords: ['awesome', 'omg', 'lol', 'cool', 'cringe', 'vibes', 'slay'],
  },

  // 대명사/지시어
  pronouns: {
    exactKorean: [
      '나',
      '너',
      '저',
      '우리',
      '너희',
      '그',
      '그녀',
      '이것',
      '저것',
      '그것',
      '여기',
      '저기',
      '거기',
      '이거',
      '저거',
      '그거',
      '뭐',
      '뭘',
      '누구',
      '얘',
      '쟤',
      '걔',
      '이분',
      '저분',
      '그분',
    ],
    koreanPrefixes: ['누구', '무엇', '어디', '언제', '어떻게', '왜'],
  },

  // 부사/강조어/정도표현
  adverbs: {
    koreanKeywords: [
      '진짜',
      '정말',
      '너무',
      '완전',
      '엄청',
      '매우',
      '아주',
      '상당히',
      '굉장히',
      '되게',
      '겁나',
      '심하게',
      '살짝',
      '약간',
      '조금',
      '많이',
      '적게',
      '빨리',
      '천천히',
      '갑자기',
      '드디어',
      '결국',
      '아직',
      '벌써',
      '이미',
      '곧',
      '항상',
      '자주',
      '가끔',
      '절대',
    ],
    englishKeywords: [
      'really',
      'very',
      'so',
      'too',
      'super',
      'totally',
      'quite',
      'extremely',
      'always',
      'never',
      'often',
      'sometimes',
    ],
  },

  // 감탄사/응답어
  responses: {
    exactKorean: [
      '예',
      '네',
      '응',
      '어',
      '아니',
      '아뇨',
      '그래',
      '좋아',
      '괜찮아',
      '괜찮',
      '야',
      '에이',
      '어머',
      '아이고',
      '세상에',
      '맙소사',
      '진짜요',
      '정말요',
      '그렇구나',
      '알겠어',
    ],
    englishKeywords: ['yes', 'no', 'yeah', 'okay', 'oh', 'hey', 'ugh', 'wow', 'oops', 'hmm'],
  },

  // 기본 동사 어간/활용형
  'verbs-common': {
    verbPatterns: true, // 동사 활용형 패턴 감지
    koreanSuffixes: ['다', '요', '어', '았', '었', '겠', '지', '니', '고', '면', '서'],
    commonVerbs: [
      '가',
      '오',
      '하',
      '되',
      '보',
      '알',
      '모르',
      '있',
      '없',
      '만나',
      '만들',
      '찾',
      '사',
      '팔',
      '먹',
      '마시',
      '자',
      '일어나',
      '듣',
      '말하',
      '읽',
      '쓰',
      '배우',
      '가르치',
      '살',
      '죽',
      '좋아하',
      '싫어하',
      '사랑하',
      '원하',
      '필요하',
      '싶',
      '기다리',
    ],
  },
};

/** daily-life 세분화 규칙 */
const DAILY_LIFE_RULES = {
  // 장소/시설
  places: {
    koreanKeywords: [
      '집',
      '학교',
      '회사',
      '병원',
      '은행',
      '마트',
      '편의점',
      '약국',
      '우체국',
      '경찰서',
      '소방서',
      '도서관',
      '공원',
      '카페',
      '식당',
      '호텔',
      '역',
      '공항',
      '버스',
      '지하철',
      '택시',
      '주차장',
      '주유소',
      '세탁소',
      '미용실',
      '헬스장',
      '수영장',
      '찜질방',
      '노래방',
      'PC방',
      '아파트',
      '빌딩',
      '상가',
    ],
    englishKeywords: [
      'store',
      'shop',
      'station',
      'office',
      'center',
      'hospital',
      'bank',
      'school',
      'library',
      'park',
      'restaurant',
      'cafe',
      'hotel',
      'airport',
    ],
  },

  // 가정/주거
  home: {
    koreanKeywords: [
      '방',
      '거실',
      '부엌',
      '화장실',
      '침대',
      '소파',
      '책상',
      '의자',
      '창문',
      '문',
      '벽',
      '바닥',
      '천장',
      '계단',
      '엘리베이터',
      '베란다',
      '현관',
      '열쇠',
      '냉장고',
      '세탁기',
      '에어컨',
      '히터',
      '청소기',
      '전자레인지',
      '가스레인지',
    ],
    englishKeywords: [
      'room',
      'kitchen',
      'bathroom',
      'bedroom',
      'living room',
      'furniture',
      'appliance',
    ],
  },

  // 일상 루틴/행동
  routines: {
    koreanKeywords: [
      '샤워',
      '목욕',
      '양치',
      '세수',
      '화장',
      '옷',
      '신발',
      '가방',
      '출근',
      '퇴근',
      '등교',
      '하교',
      '아침',
      '점심',
      '저녁',
      '밥',
      '식사',
      '잠',
      '청소',
      '빨래',
      '요리',
      '설거지',
      '쇼핑',
    ],
    englishKeywords: [
      'shower',
      'bath',
      'brush',
      'wash',
      'wake up',
      'sleep',
      'eat',
      'cook',
      'clean',
      'laundry',
    ],
  },

  // 이벤트/행사
  events: {
    koreanKeywords: [
      '생일',
      '결혼',
      '졸업',
      '입학',
      '취업',
      '이사',
      '여행',
      '휴가',
      '회식',
      '파티',
      '모임',
      '약속',
      '소개팅',
      '데이트',
      '기념일',
      '축하',
      '선물',
      '카드',
    ],
    englishKeywords: ['birthday', 'wedding', 'party', 'meeting', 'date', 'anniversary', 'vacation'],
  },

  // 일상 물건
  objects: {
    koreanKeywords: [
      '칫솔',
      '치약',
      '비누',
      '수건',
      '휴지',
      '거울',
      '빗',
      '드라이기',
      '면도기',
      '화장품',
      '향수',
      '지갑',
      '핸드폰',
      '충전기',
      '이어폰',
      '안경',
      '시계',
      '우산',
      '마스크',
    ],
    englishKeywords: [
      'toothbrush',
      'soap',
      'towel',
      'mirror',
      'phone',
      'wallet',
      'glasses',
      'watch',
    ],
  },
};

/** body 세분화 규칙 */
const BODY_RULES = {
  // 신체 동작/자세
  actions: {
    koreanKeywords: [
      '서다',
      '앉다',
      '눕다',
      '걷다',
      '뛰다',
      '달리다',
      '점프',
      '기다',
      '구르다',
      '들다',
      '놓다',
      '잡다',
      '밀다',
      '당기다',
      '던지다',
      '받다',
      '차다',
      '때리다',
      '돌다',
      '숙이다',
      '펴다',
      '접다',
      '흔들다',
      '두드리다',
    ],
    englishKeywords: [
      'stand',
      'sit',
      'lie',
      'walk',
      'run',
      'jump',
      'crawl',
      'roll',
      'lift',
      'grab',
      'push',
      'pull',
      'throw',
      'kick',
      'hit',
      'turn',
      'bend',
      'stretch',
    ],
  },

  // 해부학/신체 부위
  anatomy: {
    koreanKeywords: [
      '근육',
      '뼈',
      '관절',
      '인대',
      '힘줄',
      '신경',
      '혈관',
      '동맥',
      '정맥',
      '척추',
      '골반',
      '늑골',
      '두개골',
      '대퇴골',
      '경골',
      '비골',
      '쇄골',
      '견갑골',
      '골격',
      '연골',
      '세포',
      '조직',
      '기관',
      '장기',
    ],
    englishKeywords: [
      'muscle',
      'bone',
      'joint',
      'ligament',
      'tendon',
      'nerve',
      'artery',
      'vein',
      'spine',
      'skull',
      'pelvis',
      'cartilage',
      'tissue',
      'organ',
    ],
  },

  // 표정/제스처/비언어
  gestures: {
    koreanKeywords: [
      '웃다',
      '울다',
      '찡그리다',
      '눈살',
      '미소',
      '눈물',
      '눈웃음',
      '윙크',
      '고개',
      '끄덕',
      '젓다',
      '손짓',
      '손가락질',
      '악수',
      '박수',
      '포옹',
      '키스',
      '인사',
      '절하다',
      '눈빛',
      '표정',
      '제스처',
    ],
    englishKeywords: [
      'smile',
      'cry',
      'frown',
      'wink',
      'nod',
      'shake',
      'wave',
      'clap',
      'hug',
      'kiss',
      'bow',
      'gesture',
      'expression',
    ],
  },

  // 신체 부위 (일반)
  'body-parts': {
    koreanKeywords: [
      '머리',
      '얼굴',
      '눈',
      '코',
      '입',
      '귀',
      '이마',
      '뺨',
      '턱',
      '목',
      '어깨',
      '팔',
      '손',
      '손가락',
      '손목',
      '팔꿈치',
      '가슴',
      '배',
      '등',
      '허리',
      '엉덩이',
      '다리',
      '무릎',
      '발',
      '발가락',
      '발목',
    ],
    englishKeywords: [
      'head',
      'face',
      'eye',
      'nose',
      'mouth',
      'ear',
      'neck',
      'shoulder',
      'arm',
      'hand',
      'finger',
      'chest',
      'back',
      'waist',
      'leg',
      'knee',
      'foot',
      'toe',
    ],
  },

  // 건강/상태
  health: {
    koreanKeywords: [
      '아프다',
      '통증',
      '열',
      '기침',
      '감기',
      '두통',
      '복통',
      '피로',
      '졸음',
      '배고픔',
      '목마름',
      '땀',
      '호흡',
      '맥박',
      '혈압',
      '체온',
      '건강',
      '병',
      '상처',
      '멍',
      '염증',
    ],
    englishKeywords: [
      'pain',
      'ache',
      'fever',
      'cough',
      'cold',
      'tired',
      'hungry',
      'thirsty',
      'sweat',
      'breath',
      'pulse',
      'healthy',
      'sick',
      'wound',
      'injury',
    ],
  },
};

// ============================================================================
// 분류 함수
// ============================================================================

function matchesRule(
  entry: OriginalEntry,
  rule: {
    koreanKeywords?: string[];
    englishKeywords?: string[];
    exactKorean?: string[];
    koreanPrefixes?: string[];
    koreanSuffixes?: string[];
    commonVerbs?: string[];
    verbPatterns?: boolean;
  },
): boolean {
  const korean = entry.korean.toLowerCase();
  const english = entry.translation.word.toLowerCase();

  // Exact match
  if (rule.exactKorean?.includes(entry.korean)) return true;

  // Korean keyword match
  if (rule.koreanKeywords?.some((k) => korean.includes(k.toLowerCase()))) return true;

  // Korean prefix match
  if (rule.koreanPrefixes?.some((p) => korean.startsWith(p.toLowerCase()))) return true;

  // English keyword match
  if (rule.englishKeywords?.some((k) => english.includes(k.toLowerCase()))) return true;

  // Verb patterns (동사 활용형)
  if (rule.verbPatterns && rule.commonVerbs) {
    if (rule.commonVerbs.some((v) => korean.startsWith(v))) return true;
    // 동사 어미로 끝나는 경우
    if (
      rule.koreanSuffixes?.some((s) => korean.endsWith(s)) &&
      !korean.includes(' ') &&
      korean.length <= 6
    ) {
      // 짧은 단어 + 동사 어미 = 동사 활용형일 가능성 높음
      return true;
    }
  }

  return false;
}

function classifyEntry(
  entry: OriginalEntry,
  rules: Record<string, Record<string, unknown>>,
  defaultCategory: string,
): string {
  for (const [category, rule] of Object.entries(rules)) {
    if (matchesRule(entry, rule as Parameters<typeof matchesRule>[1])) {
      return category;
    }
  }
  return defaultCategory;
}

// ============================================================================
// 새 카테고리 정의
// ============================================================================

const NEW_CATEGORIES: Category[] = [
  // basic-words 세분화
  {
    id: 'slang',
    name: { ko: '슬랭/신조어', en: 'Slang & Trends' },
    description: {
      ko: '인터넷 신조어, 유행어, 줄임말',
      en: 'Internet slang, trending words, abbreviations',
    },
    icon: '🔥',
    color: 'orange',
    order: 101,
  },
  {
    id: 'pronouns',
    name: { ko: '대명사/지시어', en: 'Pronouns & Demonstratives' },
    description: {
      ko: '인칭대명사, 지시대명사, 의문사',
      en: 'Personal pronouns, demonstratives, interrogatives',
    },
    icon: '👉',
    color: 'blue',
    order: 102,
  },
  {
    id: 'adverbs',
    name: { ko: '부사/강조어', en: 'Adverbs & Intensifiers' },
    description: { ko: '정도, 빈도, 시간 부사', en: 'Degree, frequency, and time adverbs' },
    icon: '⚡',
    color: 'yellow',
    order: 103,
  },
  {
    id: 'responses',
    name: { ko: '감탄사/응답어', en: 'Interjections & Responses' },
    description: { ko: '감탄사, 응답어, 추임새', en: 'Interjections, responses, filler words' },
    icon: '💬',
    color: 'green',
    order: 104,
  },
  {
    id: 'verbs-common',
    name: { ko: '기본 동사', en: 'Common Verbs' },
    description: { ko: '일상에서 자주 쓰는 기본 동사', en: 'Frequently used basic verbs' },
    icon: '🏃',
    color: 'purple',
    order: 105,
  },

  // daily-life 세분화
  {
    id: 'places',
    name: { ko: '장소/시설', en: 'Places & Facilities' },
    description: { ko: '공공장소, 상업시설, 교통시설', en: 'Public places, shops, transportation' },
    icon: '🏢',
    color: 'teal',
    order: 111,
  },
  {
    id: 'home',
    name: { ko: '가정/주거', en: 'Home & Living' },
    description: { ko: '집, 가구, 가전제품', en: 'House, furniture, appliances' },
    icon: '🏠',
    color: 'indigo',
    order: 112,
  },
  {
    id: 'routines',
    name: { ko: '일상 루틴', en: 'Daily Routines' },
    description: {
      ko: '아침 루틴, 위생, 일상 활동',
      en: 'Morning routines, hygiene, daily activities',
    },
    icon: '🌅',
    color: 'yellow',
    order: 113,
  },
  {
    id: 'events',
    name: { ko: '행사/이벤트', en: 'Events & Occasions' },
    description: {
      ko: '생일, 결혼, 기념일, 모임',
      en: 'Birthdays, weddings, anniversaries, gatherings',
    },
    icon: '🎉',
    color: 'pink',
    order: 114,
  },
  {
    id: 'objects',
    name: { ko: '일상 물건', en: 'Everyday Objects' },
    description: { ko: '개인용품, 생활용품', en: 'Personal items, household items' },
    icon: '🧴',
    color: 'green',
    order: 115,
  },

  // body 세분화
  {
    id: 'actions',
    name: { ko: '신체 동작', en: 'Body Actions' },
    description: {
      ko: '걷기, 뛰기, 들기 등 신체 동작',
      en: 'Walking, running, lifting and other body movements',
    },
    icon: '🏃',
    color: 'red',
    order: 121,
  },
  {
    id: 'anatomy',
    name: { ko: '해부학', en: 'Anatomy' },
    description: {
      ko: '근육, 뼈, 관절 등 해부학 용어',
      en: 'Muscles, bones, joints and anatomical terms',
    },
    icon: '🦴',
    color: 'purple',
    order: 122,
  },
  {
    id: 'gestures',
    name: { ko: '표정/제스처', en: 'Expressions & Gestures' },
    description: {
      ko: '표정, 손짓, 비언어적 표현',
      en: 'Facial expressions, hand gestures, non-verbal communication',
    },
    icon: '🙌',
    color: 'orange',
    order: 123,
  },
  {
    id: 'body-parts',
    name: { ko: '신체 부위', en: 'Body Parts' },
    description: { ko: '머리, 팔, 다리 등 신체 부위', en: 'Head, arms, legs and other body parts' },
    icon: '🫀',
    color: 'red',
    order: 124,
  },
  {
    id: 'health',
    name: { ko: '건강/상태', en: 'Health & Conditions' },
    description: { ko: '건강, 통증, 신체 상태', en: 'Health, pain, physical conditions' },
    icon: '💊',
    color: 'green',
    order: 125,
  },
];

// ============================================================================
// 메인 실행
// ============================================================================

async function main() {
  console.log('🔧 카테고리 세분화 시작...\n');

  const stats = {
    'basic-words': {} as Record<string, number>,
    'daily-life': {} as Record<string, number>,
    body: {} as Record<string, number>,
  };

  // 각 locale 처리
  for (const locale of ['en', 'ko']) {
    console.log(`📁 ${locale}/ 처리 중...`);

    const sourceDir = join(SOURCE_DIR, locale);
    if (!existsSync(sourceDir)) {
      console.warn(`  ⚠️ ${sourceDir} 없음, 스킵`);
      continue;
    }

    // 새 카테고리별 엔트리 모음
    const newCategories: Record<string, OriginalEntry[]> = {};

    // 1. basic-words 세분화
    const basicPath = join(sourceDir, 'basic-words.json');
    if (existsSync(basicPath)) {
      const basicEntries: OriginalEntry[] = JSON.parse(readFileSync(basicPath, 'utf-8'));
      console.log(`  📦 basic-words: ${basicEntries.length}개`);

      const remaining: OriginalEntry[] = [];
      for (const entry of basicEntries) {
        const newCat = classifyEntry(entry, BASIC_WORDS_RULES, 'basic-words');
        if (newCat !== 'basic-words') {
          if (!newCategories[newCat]) newCategories[newCat] = [];
          const updated = { ...entry, categoryId: newCat };
          newCategories[newCat].push(updated);
          stats['basic-words'][newCat] = (stats['basic-words'][newCat] || 0) + 1;
        } else {
          remaining.push(entry);
        }
      }
      // 남은 것도 저장 (nouns-common으로)
      if (remaining.length > 0) {
        newCategories['nouns-common'] = remaining.map((e) => ({
          ...e,
          categoryId: 'nouns-common',
        }));
        stats['basic-words']['nouns-common'] = remaining.length;
      }
    }

    // 2. daily-life 세분화
    const dailyPath = join(sourceDir, 'daily-life.json');
    if (existsSync(dailyPath)) {
      const dailyEntries: OriginalEntry[] = JSON.parse(readFileSync(dailyPath, 'utf-8'));
      console.log(`  📦 daily-life: ${dailyEntries.length}개`);

      const remaining: OriginalEntry[] = [];
      for (const entry of dailyEntries) {
        const newCat = classifyEntry(entry, DAILY_LIFE_RULES, 'daily-life');
        if (newCat !== 'daily-life') {
          if (!newCategories[newCat]) newCategories[newCat] = [];
          const updated = { ...entry, categoryId: newCat };
          newCategories[newCat].push(updated);
          stats['daily-life'][newCat] = (stats['daily-life'][newCat] || 0) + 1;
        } else {
          remaining.push(entry);
        }
      }
      // 남은 것은 daily-misc로
      if (remaining.length > 0) {
        newCategories['daily-misc'] = remaining.map((e) => ({ ...e, categoryId: 'daily-misc' }));
        stats['daily-life']['daily-misc'] = remaining.length;
      }
    }

    // 3. body 세분화
    const bodyPath = join(sourceDir, 'body.json');
    if (existsSync(bodyPath)) {
      const bodyEntries: OriginalEntry[] = JSON.parse(readFileSync(bodyPath, 'utf-8'));
      console.log(`  📦 body: ${bodyEntries.length}개`);

      const remaining: OriginalEntry[] = [];
      for (const entry of bodyEntries) {
        const newCat = classifyEntry(entry, BODY_RULES, 'body');
        if (newCat !== 'body') {
          if (!newCategories[newCat]) newCategories[newCat] = [];
          const updated = { ...entry, categoryId: newCat };
          newCategories[newCat].push(updated);
          stats['body'][newCat] = (stats['body'][newCat] || 0) + 1;
        } else {
          remaining.push(entry);
        }
      }
      // 남은 것은 body-misc로
      if (remaining.length > 0) {
        newCategories['body-misc'] = remaining.map((e) => ({ ...e, categoryId: 'body-misc' }));
        stats['body']['body-misc'] = remaining.length;
      }
    }

    // 새 카테고리 파일 저장
    for (const [catId, entries] of Object.entries(newCategories)) {
      if (entries.length === 0) continue;
      const outputPath = join(sourceDir, `${catId}.json`);
      writeFileSync(outputPath, JSON.stringify(entries, null, 2));
      console.log(`    ✓ ${catId}.json: ${entries.length}개`);
    }

    // 원본 파일 삭제 (백업 후)
    for (const oldCat of ['basic-words', 'daily-life', 'body']) {
      const oldPath = join(sourceDir, `${oldCat}.json`);
      if (existsSync(oldPath)) {
        const backupPath = join(sourceDir, `_backup_${oldCat}.json`);
        const content = readFileSync(oldPath, 'utf-8');
        writeFileSync(backupPath, content);
        // 원본 삭제
        const fs = await import('node:fs/promises');
        await fs.unlink(oldPath);
        console.log(`    🗑️ ${oldCat}.json 삭제 (백업: _backup_${oldCat}.json)`);
      }
    }
  }

  // 카테고리 정의 업데이트
  console.log('\n📝 카테고리 정의 업데이트...');
  const existingCategories: Category[] = JSON.parse(readFileSync(CATEGORIES_FILE, 'utf-8'));

  // 기존 basic-words, daily-life, body 제거
  const filteredCategories = existingCategories.filter(
    (c) => !['basic-words', 'daily-life', 'body'].includes(c.id),
  );

  // misc 카테고리 추가
  const miscCategories: Category[] = [
    {
      id: 'nouns-common',
      name: { ko: '기본 명사', en: 'Common Nouns' },
      description: { ko: '자주 쓰이는 기본 명사', en: 'Frequently used common nouns' },
      icon: '📦',
      color: 'blue',
      order: 106,
    },
    {
      id: 'daily-misc',
      name: { ko: '일상 기타', en: 'Daily Misc' },
      description: { ko: '기타 일상 관련 어휘', en: 'Other daily life vocabulary' },
      icon: '📋',
      color: 'teal',
      order: 116,
    },
    {
      id: 'body-misc',
      name: { ko: '신체 기타', en: 'Body Misc' },
      description: { ko: '기타 신체 관련 어휘', en: 'Other body-related vocabulary' },
      icon: '🫁',
      color: 'purple',
      order: 126,
    },
  ];

  // 새 카테고리 추가
  const updatedCategories = [...filteredCategories, ...NEW_CATEGORIES, ...miscCategories].sort(
    (a, b) => a.order - b.order,
  );

  writeFileSync(CATEGORIES_FILE, JSON.stringify(updatedCategories, null, 2));
  console.log(`  ✓ ${updatedCategories.length}개 카테고리 저장`);

  // 결과 출력
  console.log('\n' + '='.repeat(60));
  console.log('📊 세분화 결과');
  console.log('='.repeat(60));

  for (const [source, targets] of Object.entries(stats)) {
    console.log(`\n${source}:`);
    for (const [target, count] of Object.entries(targets).sort((a, b) => b[1] - a[1])) {
      console.log(`  → ${target}: ${count}개`);
    }
  }

  // ============================================================================
  // 소스 디렉토리 (app/data/entries/) 업데이트
  // ============================================================================
  console.log('\n📁 소스 디렉토리 업데이트 (app/data/entries/)...');

  if (existsSync(ENTRIES_SOURCE_DIR)) {
    // 영어 번역 데이터에서 소스 JSON 생성 (by-category-full/en/ 기준)
    const enDir = join(SOURCE_DIR, 'en');

    // 기존 파일 백업 후 삭제
    for (const oldCat of ['basic-words', 'daily-life', 'body']) {
      const oldPath = join(ENTRIES_SOURCE_DIR, `${oldCat}.json`);
      if (existsSync(oldPath)) {
        const fs = await import('node:fs/promises');
        await fs.unlink(oldPath);
        console.log(`  🗑️ ${oldCat}.json 삭제`);
      }
    }

    // 새 카테고리 파일 복사 (en 데이터를 소스로 사용)
    const newCategoryIds = [
      'slang',
      'pronouns',
      'adverbs',
      'responses',
      'verbs-common',
      'nouns-common',
      'places',
      'home',
      'routines',
      'events',
      'objects',
      'daily-misc',
      'actions',
      'anatomy',
      'gestures',
      'body-parts',
      'health',
      'body-misc',
    ];

    for (const catId of newCategoryIds) {
      const enPath = join(enDir, `${catId}.json`);
      if (existsSync(enPath)) {
        const enEntries: OriginalEntry[] = JSON.parse(readFileSync(enPath, 'utf-8'));

        // ko 번역 데이터 로드
        const koPath = join(SOURCE_DIR, 'ko', `${catId}.json`);
        const koEntries: OriginalEntry[] = existsSync(koPath)
          ? JSON.parse(readFileSync(koPath, 'utf-8'))
          : [];
        const koMap = new Map(koEntries.map((e) => [e.id, e]));

        // MeaningEntry 형태로 병합 (en + ko)
        const mergedEntries = enEntries.map((enEntry) => {
          const koEntry = koMap.get(enEntry.id);
          return {
            id: enEntry.id,
            korean: enEntry.korean,
            romanization: enEntry.romanization,
            pronunciation: enEntry.pronunciation,
            partOfSpeech: enEntry.partOfSpeech,
            categoryId: enEntry.categoryId,
            difficulty: enEntry.difficulty,
            frequency: enEntry.frequency,
            tags: enEntry.tags,
            hasDialogue: enEntry.hasDialogue,
            translations: {
              en: enEntry.translation,
              ko: koEntry?.translation || enEntry.translation,
            },
          };
        });

        const outputPath = join(ENTRIES_SOURCE_DIR, `${catId}.json`);
        writeFileSync(outputPath, JSON.stringify(mergedEntries, null, 2));
        console.log(`  ✓ ${catId}.json: ${mergedEntries.length}개`);
      }
    }
  }

  console.log('\n✅ 세분화 완료!');
  console.log('\n⚠️ 다음 명령어를 실행하세요:');
  console.log('   pnpm load-entries && pnpm compress-entries && pnpm build:context');
}

main().catch((error) => {
  console.error('❌ 세분화 실패:', error);
  process.exit(1);
});
