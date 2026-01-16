/**
 * @fileoverview 카테고리 데이터 및 유틸리티 함수
 *
 * 한국어 단어 카테고리 정의와 색상 관련 유틸리티를 제공합니다.
 * 각 카테고리는 다국어 이름, 설명, 아이콘, 색상을 가집니다.
 *
 * @example
 * ```tsx
 * import { categories, getCategoryColor, getCategoryById } from '@/data/categories';
 *
 * // 전체 카테고리 렌더링
 * <For each={categories}>
 *   {(cat) => (
 *     <span class={getCategoryColor(cat.color)}>{cat.name[locale()]}</span>
 *   )}
 * </For>
 *
 * // ID로 카테고리 조회
 * const greetings = getCategoryById('greetings');
 * ```
 */
import type { Category, CategoryColor } from './types';

/** 카테고리 목록 (order 기준 정렬) */
export const categories: Category[] = [
  {
    id: 'greetings',
    name: {
      ko: '인사',
      en: 'Greetings',
    },
    description: {
      ko: '일상에서 사용하는 인사말',
      en: 'Everyday greetings and salutations',
    },
    icon: '―',
    color: 'yellow',
    order: 1,
  },
  {
    id: 'emotions',
    name: {
      ko: '감정',
      en: 'Emotions',
    },
    description: {
      ko: '감정과 기분을 표현하는 단어',
      en: 'Words expressing feelings and moods',
    },
    icon: '◐',
    color: 'pink',
    order: 2,
  },
  {
    id: 'daily-misc',
    name: {
      ko: '일상생활',
      en: 'Daily Life',
    },
    description: {
      ko: '일상생활에서 자주 쓰는 단어',
      en: 'Common words used in daily activities',
    },
    icon: '⌂',
    color: 'blue',
    order: 3,
  },
  {
    id: 'food',
    name: {
      ko: '음식',
      en: 'Food',
    },
    description: {
      ko: '음식과 식사 관련 단어',
      en: 'Food and dining related vocabulary',
    },
    icon: '○',
    color: 'orange',
    order: 4,
  },
  {
    id: 'travel',
    name: {
      ko: '여행',
      en: 'Travel',
    },
    description: {
      ko: '여행과 이동 관련 단어',
      en: 'Travel and transportation vocabulary',
    },
    icon: '→',
    color: 'teal',
    order: 5,
  },
  {
    id: 'work',
    name: {
      ko: '직장',
      en: 'Work',
    },
    description: {
      ko: '직장과 비즈니스 관련 단어',
      en: 'Work and business related vocabulary',
    },
    icon: '□',
    color: 'indigo',
    order: 6,
  },
  {
    id: 'culture',
    name: {
      ko: '문화',
      en: 'Culture',
    },
    description: {
      ko: '한국 문화 관련 단어',
      en: 'Korean culture related vocabulary',
    },
    icon: '◇',
    color: 'purple',
    order: 7,
  },
  {
    id: 'numbers',
    name: {
      ko: '숫자/시간',
      en: 'Numbers & Time',
    },
    description: {
      ko: '숫자와 시간 관련 단어',
      en: 'Numbers and time related vocabulary',
    },
    icon: '#',
    color: 'green',
    order: 8,
  },
  {
    id: 'music',
    name: {
      ko: '음악',
      en: 'Music',
    },
    description: {
      ko: '악기와 음악 관련 단어',
      en: 'Musical instruments and music vocabulary',
    },
    icon: '♪',
    color: 'red',
    order: 9,
  },
  {
    id: 'art',
    name: {
      ko: '예술',
      en: 'Art',
    },
    description: {
      ko: '미술과 예술 관련 단어',
      en: 'Art and creative expression vocabulary',
    },
    icon: '◎',
    color: 'purple',
    order: 10,
  },
  {
    id: 'sports',
    name: {
      ko: '스포츠',
      en: 'Sports',
    },
    description: {
      ko: '스포츠와 운동 관련 단어',
      en: 'Sports and exercise vocabulary',
    },
    icon: '●',
    color: 'green',
    order: 11,
  },
  {
    id: 'space',
    name: {
      ko: '우주',
      en: 'Space',
    },
    description: {
      ko: '우주와 천문학 관련 단어',
      en: 'Space and astronomy vocabulary',
    },
    icon: '☆',
    color: 'indigo',
    order: 12,
  },
  {
    id: 'physics',
    name: {
      ko: '물리학',
      en: 'Physics',
    },
    description: {
      ko: '물리학과 과학 관련 단어',
      en: 'Physics and science vocabulary',
    },
    icon: '∿',
    color: 'blue',
    order: 13,
  },
  {
    id: 'math',
    name: {
      ko: '수학',
      en: 'Mathematics',
    },
    description: {
      ko: '수학과 계산 관련 단어',
      en: 'Mathematics and calculation vocabulary',
    },
    icon: '∑',
    color: 'teal',
    order: 14,
  },
  {
    id: 'time-date',
    name: {
      ko: '시간/날짜',
      en: 'Time & Date',
    },
    description: {
      ko: '시간, 날짜, 요일 관련 단어',
      en: 'Time, date, and day-related vocabulary',
    },
    icon: '◴',
    color: 'blue',
    order: 15,
  },
  {
    id: 'family',
    name: {
      ko: '가족/관계',
      en: 'Family & Relationships',
    },
    description: {
      ko: '가족, 친척, 인간관계 관련 단어',
      en: 'Family, relatives, and relationship vocabulary',
    },
    icon: '∞',
    color: 'pink',
    order: 16,
  },
  {
    id: 'verbs-basic',
    name: {
      ko: '기본 동사',
      en: 'Basic Verbs',
    },
    description: {
      ko: 'TOPIK 필수 기본 동사',
      en: 'Essential basic verbs for TOPIK',
    },
    icon: '→',
    color: 'orange',
    order: 17,
  },
  {
    id: 'adjectives-basic',
    name: {
      ko: '기본 형용사',
      en: 'Basic Adjectives',
    },
    description: {
      ko: 'TOPIK 필수 기본 형용사',
      en: 'Essential basic adjectives for TOPIK',
    },
    icon: '◆',
    color: 'purple',
    order: 18,
  },
  {
    id: 'shopping',
    name: {
      ko: '쇼핑',
      en: 'Shopping',
    },
    description: {
      ko: '쇼핑과 구매 관련 단어',
      en: 'Shopping and purchasing vocabulary',
    },
    icon: '▢',
    color: 'pink',
    order: 19,
  },
  {
    id: 'transportation',
    name: {
      ko: '교통',
      en: 'Transportation',
    },
    description: {
      ko: '교통수단과 이동 관련 단어',
      en: 'Transportation and travel vocabulary',
    },
    icon: '⊳',
    color: 'blue',
    order: 20,
  },
  {
    id: 'coding',
    name: {
      ko: '코딩/개발',
      en: 'Coding & Development',
    },
    description: {
      ko: '웹 개발, TypeScript, React, PWA 관련 용어 (RRv7 + SSG + Tailwind v4)',
      en: 'Web development, TypeScript, React, PWA terminology (RRv7 + SSG + Tailwind v4)',
    },
    icon: '⌘',
    color: 'indigo',
    order: 21,
  },
  {
    id: 'countries',
    name: {
      ko: '국가',
      en: 'Countries',
    },
    description: {
      ko: '전 세계 국가와 지역의 이름',
      en: 'Names of countries and regions around the world',
    },
    icon: '◯',
    color: 'teal',
    order: 22,
  },
  {
    id: 'particles',
    name: {
      ko: '조사',
      en: 'Particles',
    },
    description: {
      ko: '문법적 관계를 나타내는 조사',
      en: 'Grammatical particles indicating relationships',
    },
    icon: '∘',
    color: 'indigo',
    order: 23,
  },
  {
    id: 'geography',
    name: {
      ko: '지리',
      en: 'Geography',
    },
    description: {
      ko: '대륙, 바다 등 지리 관련 단어',
      en: 'Geography-related words including continents and oceans',
    },
    icon: '◐',
    color: 'teal',
    order: 24,
  },
  {
    id: 'colors',
    name: {
      ko: '색깔',
      en: 'Colors',
    },
    description: {
      ko: '다양한 색깔과 색상 관련 단어',
      en: 'Various colors and color-related vocabulary',
    },
    icon: '◉',
    color: 'red',
    order: 25,
  },
  {
    id: 'actions',
    name: {
      ko: '동작',
      en: 'Actions',
    },
    description: {
      ko: '일상적인 동작과 행위 관련 단어',
      en: 'Common actions and activities vocabulary',
    },
    icon: '⤳',
    color: 'orange',
    order: 26,
  },
  {
    id: 'adverbs',
    name: {
      ko: '부사',
      en: 'Adverbs',
    },
    description: {
      ko: '동사, 형용사를 수식하는 부사',
      en: 'Adverbs modifying verbs and adjectives',
    },
    icon: '~',
    color: 'indigo',
    order: 27,
  },
  {
    id: 'anatomy',
    name: {
      ko: '해부학',
      en: 'Anatomy',
    },
    description: {
      ko: '인체 해부학 관련 단어',
      en: 'Human anatomy vocabulary',
    },
    icon: '♡',
    color: 'pink',
    order: 28,
  },
  {
    id: 'body-misc',
    name: {
      ko: '신체 기타',
      en: 'Body Misc',
    },
    description: {
      ko: '신체와 관련된 기타 단어',
      en: 'Miscellaneous body-related vocabulary',
    },
    icon: '⊕',
    color: 'teal',
    order: 29,
  },
  {
    id: 'body-parts',
    name: {
      ko: '신체 부위',
      en: 'Body Parts',
    },
    description: {
      ko: '신체 각 부위의 이름',
      en: 'Names of body parts',
    },
    icon: '⊙',
    color: 'pink',
    order: 30,
  },
  {
    id: 'compound-words',
    name: {
      ko: '합성어',
      en: 'Compound Words',
    },
    description: {
      ko: '두 개 이상의 단어가 결합된 합성어',
      en: 'Words formed by combining two or more words',
    },
    icon: '+',
    color: 'purple',
    order: 31,
  },
  {
    id: 'cultural-expressions',
    name: {
      ko: '문화 표현',
      en: 'Cultural Expressions',
    },
    description: {
      ko: '한국 문화 특유의 표현',
      en: 'Expressions unique to Korean culture',
    },
    icon: '◈',
    color: 'purple',
    order: 32,
  },
  {
    id: 'education',
    name: {
      ko: '교육',
      en: 'Education',
    },
    description: {
      ko: '학교와 교육 관련 단어',
      en: 'School and education vocabulary',
    },
    icon: '📖',
    color: 'blue',
    order: 33,
  },
  {
    id: 'events',
    name: {
      ko: '행사',
      en: 'Events',
    },
    description: {
      ko: '각종 행사와 이벤트 관련 단어',
      en: 'Various events and occasions vocabulary',
    },
    icon: '★',
    color: 'yellow',
    order: 34,
  },
  {
    id: 'gestures',
    name: {
      ko: '제스처',
      en: 'Gestures',
    },
    description: {
      ko: '몸짓과 제스처 관련 단어',
      en: 'Body language and gesture vocabulary',
    },
    icon: '✋',
    color: 'orange',
    order: 35,
  },
  {
    id: 'health',
    name: {
      ko: '건강',
      en: 'Health',
    },
    description: {
      ko: '건강과 웰빙 관련 단어',
      en: 'Health and wellness vocabulary',
    },
    icon: '✚',
    color: 'green',
    order: 36,
  },
  {
    id: 'home',
    name: {
      ko: '가정',
      en: 'Home',
    },
    description: {
      ko: '집과 가정생활 관련 단어',
      en: 'Home and household vocabulary',
    },
    icon: '⌂',
    color: 'teal',
    order: 37,
  },
  {
    id: 'idioms',
    name: {
      ko: '관용어',
      en: 'Idioms',
    },
    description: {
      ko: '한국어 관용 표현과 숙어',
      en: 'Korean idiomatic expressions',
    },
    icon: '≋',
    color: 'purple',
    order: 38,
  },
  {
    id: 'interjections',
    name: {
      ko: '감탄사',
      en: 'Interjections',
    },
    description: {
      ko: '감정을 표현하는 감탄사',
      en: 'Exclamations expressing emotions',
    },
    icon: '!',
    color: 'yellow',
    order: 39,
  },
  {
    id: 'legal',
    name: {
      ko: '법률',
      en: 'Legal',
    },
    description: {
      ko: '법률과 법적 용어',
      en: 'Legal terms and vocabulary',
    },
    icon: '§',
    color: 'indigo',
    order: 40,
  },
  {
    id: 'medical',
    name: {
      ko: '의료',
      en: 'Medical',
    },
    description: {
      ko: '의료와 병원 관련 단어',
      en: 'Medical and hospital vocabulary',
    },
    icon: '⚕',
    color: 'red',
    order: 41,
  },
  {
    id: 'nouns-common',
    name: {
      ko: '일반 명사',
      en: 'Common Nouns',
    },
    description: {
      ko: '일상에서 자주 쓰이는 일반 명사',
      en: 'Common nouns used in daily life',
    },
    icon: '▪',
    color: 'blue',
    order: 42,
  },
  {
    id: 'objects',
    name: {
      ko: '사물',
      en: 'Objects',
    },
    description: {
      ko: '일상 사물과 물건 관련 단어',
      en: 'Everyday objects and items vocabulary',
    },
    icon: '▣',
    color: 'teal',
    order: 43,
  },
  {
    id: 'onomatopoeia',
    name: {
      ko: '의성어/의태어',
      en: 'Onomatopoeia',
    },
    description: {
      ko: '소리와 모양을 흉내 내는 말',
      en: 'Words imitating sounds and appearances',
    },
    icon: '♬',
    color: 'yellow',
    order: 44,
  },
  {
    id: 'phrasal-verbs',
    name: {
      ko: '구동사',
      en: 'Phrasal Verbs',
    },
    description: {
      ko: '동사와 조사가 결합된 표현',
      en: 'Verb phrases with particles',
    },
    icon: '⇢',
    color: 'orange',
    order: 45,
  },
  {
    id: 'places',
    name: {
      ko: '장소',
      en: 'Places',
    },
    description: {
      ko: '다양한 장소와 위치 관련 단어',
      en: 'Various places and locations vocabulary',
    },
    icon: '⌖',
    color: 'green',
    order: 46,
  },
  {
    id: 'pronouns',
    name: {
      ko: '대명사',
      en: 'Pronouns',
    },
    description: {
      ko: '명사를 대신하는 대명사',
      en: 'Words replacing nouns',
    },
    icon: '⊛',
    color: 'indigo',
    order: 47,
  },
  {
    id: 'responses',
    name: {
      ko: '대답/응답',
      en: 'Responses',
    },
    description: {
      ko: '대화에서 사용하는 응답 표현',
      en: 'Response expressions in conversations',
    },
    icon: '↩',
    color: 'teal',
    order: 48,
  },
  {
    id: 'routines',
    name: {
      ko: '일과',
      en: 'Routines',
    },
    description: {
      ko: '일상 루틴과 습관 관련 단어',
      en: 'Daily routines and habits vocabulary',
    },
    icon: '↻',
    color: 'blue',
    order: 49,
  },
  {
    id: 'slang',
    name: {
      ko: '속어/은어',
      en: 'Slang',
    },
    description: {
      ko: '비격식 표현과 속어',
      en: 'Informal expressions and slang',
    },
    icon: '※',
    color: 'pink',
    order: 50,
  },
  {
    id: 'verb-stems',
    name: {
      ko: '동사 어간',
      en: 'Verb Stems',
    },
    description: {
      ko: '동사의 기본 어간 형태',
      en: 'Base stem forms of verbs',
    },
    icon: '⊢',
    color: 'orange',
    order: 51,
  },
  {
    id: 'verbs-common',
    name: {
      ko: '일반 동사',
      en: 'Common Verbs',
    },
    description: {
      ko: '자주 사용되는 일반 동사',
      en: 'Frequently used common verbs',
    },
    icon: '⊨',
    color: 'green',
    order: 52,
  },
];

/**
 * 카테고리 색상에 해당하는 Tailwind 클래스 반환
 *
 * 라이트/다크 모드 모두 지원하는 배경색과 텍스트색을 반환합니다.
 *
 * @param color - 카테고리 색상
 * @returns Tailwind CSS 클래스 문자열 (예: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")
 *
 * @example
 * ```tsx
 * <span class={getCategoryColor('red')}>카테고리</span>
 * ```
 */
export function getCategoryColor(color: CategoryColor): string {
  const colors: Record<CategoryColor, string> = {
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  };
  return colors[color];
}

/**
 * 카테고리 배경색 클래스 반환 (단색)
 *
 * 배지, 아이콘 배경 등에 사용할 단일 배경색을 반환합니다.
 *
 * @param color - 카테고리 색상
 * @returns Tailwind CSS 배경색 클래스 (예: "bg-red-500")
 *
 * @example
 * ```tsx
 * <div class={`${getCategoryBgColor('blue')} p-2 rounded`}>아이콘</div>
 * ```
 */
export function getCategoryBgColor(color: CategoryColor): string {
  const colors: Record<CategoryColor, string> = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    teal: 'bg-teal-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  };
  return colors[color];
}

// ============================================================================
// Pre-computed Map for O(1) lookup
// ============================================================================

/** ID → Category 맵 (O(1) 조회용) */
export const categoriesById = new Map<string, Category>(categories.map((c) => [c.id, c]));

/**
 * ID로 카테고리 조회 (O(1))
 *
 * @param id - 카테고리 ID (예: 'greetings', 'emotions')
 * @returns 카테고리 객체 또는 undefined (미발견 시)
 *
 * @example
 * ```tsx
 * const category = getCategoryById('greetings');
 * if (category) {
 *   console.log(category.name.ko); // '인사'
 * }
 * ```
 */
export function getCategoryById(id: string): Category | undefined {
  return categoriesById.get(id);
}
