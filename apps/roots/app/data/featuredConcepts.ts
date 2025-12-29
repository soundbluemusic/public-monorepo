/**
 * @fileoverview Featured concepts for homepage
 *
 * 홈페이지에 표시되는 대표 개념 데이터.
 * 데이터와 UI를 분리하여 유지보수성 향상.
 */

/** Featured card color class names */
export const featuredCardColors = {
  blue: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20',
  purple: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20',
  green: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20',
  orange: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20',
  red: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20',
  pink: 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20',
  teal: 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/20',
  indigo: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20',
} as const;

export type FeaturedCardColor = keyof typeof featuredCardColors;

export interface FeaturedConcept {
  id: string;
  icon: string;
  nameKo: string;
  nameEn: string;
  descKo: string;
  descEn: string;
  colorClass: FeaturedCardColor;
}

/** Featured concepts displayed on homepage */
export const FEATURED_CONCEPTS: ReadonlyArray<FeaturedConcept> = [
  {
    id: 'pythagorean-theorem',
    icon: '△',
    nameKo: '피타고라스 정리',
    nameEn: 'Pythagorean Theorem',
    descKo: '직각삼각형의 세 변의 관계',
    descEn: 'Relationship between sides of right triangles',
    colorClass: 'blue',
  },
  {
    id: 'derivative',
    icon: '∂',
    nameKo: '미분',
    nameEn: 'Derivative',
    descKo: '변화율과 접선의 기울기',
    descEn: 'Rate of change and slope of tangent',
    colorClass: 'purple',
  },
  {
    id: 'limit',
    icon: '→',
    nameKo: '극한',
    nameEn: 'Limit',
    descKo: '무한히 가까워지는 값',
    descEn: 'Value approached infinitely',
    colorClass: 'green',
  },
  {
    id: 'matrices-basics',
    icon: '⊗',
    nameKo: '행렬',
    nameEn: 'Matrix',
    descKo: '수를 직사각형 배열로 나타낸 구조',
    descEn: 'Rectangular array of numbers',
    colorClass: 'orange',
  },
  {
    id: 'prime-numbers',
    icon: 'ℕ',
    nameKo: '소수',
    nameEn: 'Prime Numbers',
    descKo: '1과 자기 자신만으로 나누어지는 수',
    descEn: 'Numbers divisible only by 1 and itself',
    colorClass: 'red',
  },
  {
    id: 'complex-numbers',
    icon: 'ℂ',
    nameKo: '복소수',
    nameEn: 'Complex Numbers',
    descKo: '실수와 허수의 합',
    descEn: 'Sum of real and imaginary numbers',
    colorClass: 'pink',
  },
  {
    id: 'vectors-basics',
    icon: '➡',
    nameKo: '벡터',
    nameEn: 'Vectors',
    descKo: '크기와 방향을 가진 양',
    descEn: 'Quantity with magnitude and direction',
    colorClass: 'teal',
  },
  {
    id: 'probability-basics',
    icon: '⁝',
    nameKo: '확률',
    nameEn: 'Probability',
    descKo: '사건이 일어날 가능성',
    descEn: 'Likelihood of an event occurring',
    colorClass: 'indigo',
  },
];
