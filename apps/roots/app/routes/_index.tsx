/**
 * @fileoverview 홈페이지 컴포넌트 - Apple 스타일 미니멀 디자인
 */
import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';
import { preloadSearchIndex } from '@/lib/search';
import { useEffect } from 'react';
import { Link } from 'react-router';

import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const locale = location.pathname.startsWith('/ko') ? 'ko' : 'en';
  const title = locale === 'ko' ? '수리 - 수학 문서' : 'Roots - Math Documentation';
  const description =
    locale === 'ko' ? '누구나 쉽게 배우는 수학 개념 사전' : 'Learn math concepts easily';
  return [{ title }, { name: 'description', content: description }];
};

// Featured card color classes mapping
const featuredCardColors = {
  blue: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20',
  purple: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20',
  green: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20',
  orange: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20',
  red: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20',
  pink: 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20',
  teal: 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/20',
  indigo: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20',
} as const;

type FeaturedCardColor = keyof typeof featuredCardColors;

// 대표 개념 (Featured Concepts)
const FEATURED_CONCEPTS: ReadonlyArray<{
  id: string;
  icon: string;
  nameKo: string;
  nameEn: string;
  descKo: string;
  descEn: string;
  colorClass: FeaturedCardColor;
}> = [
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

export default function HomePage() {
  const { locale, localePath, t } = useI18n();

  // 검색 인덱스 프리로드
  useEffect(() => {
    preloadSearchIndex();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center py-12 mb-8">
        <h1 className="text-4xl font-bold text-(--text-primary) mb-3">{t('logoText')}</h1>
        <p className="text-lg text-(--text-secondary)">{t('heroSubtitle')}</p>
      </div>

      {/* Featured Concepts Grid */}
      <section aria-labelledby="featured-concepts-heading">
        <h2 id="featured-concepts-heading" className="sr-only">
          {locale === 'ko' ? '주요 개념' : 'Featured Concepts'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURED_CONCEPTS.map((concept) => (
            <Link
              key={concept.id}
              to={localePath(`/concept/${concept.id}`)}
              className={`block p-4 rounded-xl border no-underline transition-all hover:-translate-y-0.5 hover:shadow-md ${featuredCardColors[concept.colorClass]}`}
            >
              <div className="text-3xl mb-2">{concept.icon}</div>
              <h3 className="text-base font-medium text-(--text-primary) mb-1">
                {locale === 'ko' ? concept.nameKo : concept.nameEn}
              </h3>
              <p className="text-sm text-(--text-secondary) leading-snug">
                {locale === 'ko' ? concept.descKo : concept.descEn}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse All Link */}
      <div className="text-center mt-12">
        <Link
          to={localePath('/browse')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-(--accent-primary) font-medium transition-colors hover:bg-(--bg-tertiary)"
        >
          {t('browseAllConcepts')}
          <span>→</span>
        </Link>
      </div>
    </Layout>
  );
}
