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

// 대표 개념 (Featured Concepts)
const FEATURED_CONCEPTS = [
  {
    id: 'pythagorean-theorem',
    icon: '📐',
    nameKo: '피타고라스 정리',
    nameEn: 'Pythagorean Theorem',
    descKo: '직각삼각형의 세 변의 관계',
    descEn: 'Relationship between sides of right triangles',
    color: 'bg-blue-50 dark:bg-blue-950/30',
    hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-950/50',
  },
  {
    id: 'derivative',
    icon: '∂',
    nameKo: '미분',
    nameEn: 'Derivative',
    descKo: '변화율과 접선의 기울기',
    descEn: 'Rate of change and slope of tangent',
    color: 'bg-purple-50 dark:bg-purple-950/30',
    hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-950/50',
  },
  {
    id: 'limit',
    icon: '→',
    nameKo: '극한',
    nameEn: 'Limit',
    descKo: '무한히 가까워지는 값',
    descEn: 'Value approached infinitely',
    color: 'bg-green-50 dark:bg-green-950/30',
    hoverColor: 'hover:bg-green-100 dark:hover:bg-green-950/50',
  },
  {
    id: 'matrices-basics',
    icon: '⊗',
    nameKo: '행렬',
    nameEn: 'Matrix',
    descKo: '수를 직사각형 배열로 나타낸 구조',
    descEn: 'Rectangular array of numbers',
    color: 'bg-orange-50 dark:bg-orange-950/30',
    hoverColor: 'hover:bg-orange-100 dark:hover:bg-orange-950/50',
  },
  {
    id: 'prime-numbers',
    icon: '🔢',
    nameKo: '소수',
    nameEn: 'Prime Numbers',
    descKo: '1과 자기 자신만으로 나누어지는 수',
    descEn: 'Numbers divisible only by 1 and itself',
    color: 'bg-red-50 dark:bg-red-950/30',
    hoverColor: 'hover:bg-red-100 dark:hover:bg-red-950/50',
  },
  {
    id: 'complex-numbers',
    icon: 'ℂ',
    nameKo: '복소수',
    nameEn: 'Complex Numbers',
    descKo: '실수와 허수의 합',
    descEn: 'Sum of real and imaginary numbers',
    color: 'bg-pink-50 dark:bg-pink-950/30',
    hoverColor: 'hover:bg-pink-100 dark:hover:bg-pink-950/50',
  },
  {
    id: 'vectors-basics',
    icon: '➡',
    nameKo: '벡터',
    nameEn: 'Vectors',
    descKo: '크기와 방향을 가진 양',
    descEn: 'Quantity with magnitude and direction',
    color: 'bg-teal-50 dark:bg-teal-950/30',
    hoverColor: 'hover:bg-teal-100 dark:hover:bg-teal-950/50',
  },
  {
    id: 'probability-basics',
    icon: '🎲',
    nameKo: '확률',
    nameEn: 'Probability',
    descKo: '사건이 일어날 가능성',
    descEn: 'Likelihood of an event occurring',
    color: 'bg-indigo-50 dark:bg-indigo-950/30',
    hoverColor: 'hover:bg-indigo-100 dark:hover:bg-indigo-950/50',
  },
];

export default function HomePage() {
  // Debug: check if HomePage is rendering on client
  if (typeof window !== 'undefined') {
    console.log('[roots/_index] HomePage rendering on client!');
  }

  const { locale, localePath, t } = useI18n();

  // 검색 인덱스 프리로드
  useEffect(() => {
    console.log('[roots/_index] useEffect running!');
    preloadSearchIndex();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center mb-16 pt-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-text-primary tracking-tight">
          {t('logoText')}
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary font-light">{t('heroSubtitle')}</p>
      </div>

      {/* Featured Concepts Grid */}
      <section aria-labelledby="featured-concepts-heading">
        <h2 id="featured-concepts-heading" className="sr-only">
          {locale === 'ko' ? '주요 개념' : 'Featured Concepts'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {FEATURED_CONCEPTS.map((concept) => (
            <Link
              key={concept.id}
              to={localePath(`/concept/${concept.id}`)}
              className={`${concept.color} ${concept.hoverColor} rounded-2xl p-8 transition-all duration-200 border border-border-primary/50 hover:shadow-lg hover:scale-[1.02]`}
            >
              <div className="text-4xl mb-4">{concept.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">
                {locale === 'ko' ? concept.nameKo : concept.nameEn}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {locale === 'ko' ? concept.descKo : concept.descEn}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse All Link */}
      <div className="text-center py-8">
        <Link
          to={localePath('/browse')}
          className="inline-flex items-center gap-2 text-lg font-medium text-accent-primary hover:text-accent-hover transition-colors"
        >
          {t('browseAllConcepts')}
          <span className="text-xl">→</span>
        </Link>
      </div>
    </Layout>
  );
}
