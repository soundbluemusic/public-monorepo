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
    id: 'daily-life',
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
export const categoriesById = new Map<string, Category>(
  categories.map((c) => [c.id, c]),
);

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
