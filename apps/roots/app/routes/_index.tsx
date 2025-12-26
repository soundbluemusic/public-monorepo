/**
 * @fileoverview 홈페이지 컴포넌트 - Apple 스타일 미니멀 디자인
 */
import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';
import { preloadSearchIndex } from '@/lib/search';
import { useEffect } from 'react';
import { Link } from 'react-router';
import styles from '../styles/pages.module.scss';

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
    colorClass: 'featuredCardBlue',
  },
  {
    id: 'derivative',
    icon: '∂',
    nameKo: '미분',
    nameEn: 'Derivative',
    descKo: '변화율과 접선의 기울기',
    descEn: 'Rate of change and slope of tangent',
    colorClass: 'featuredCardPurple',
  },
  {
    id: 'limit',
    icon: '→',
    nameKo: '극한',
    nameEn: 'Limit',
    descKo: '무한히 가까워지는 값',
    descEn: 'Value approached infinitely',
    colorClass: 'featuredCardGreen',
  },
  {
    id: 'matrices-basics',
    icon: '⊗',
    nameKo: '행렬',
    nameEn: 'Matrix',
    descKo: '수를 직사각형 배열로 나타낸 구조',
    descEn: 'Rectangular array of numbers',
    colorClass: 'featuredCardOrange',
  },
  {
    id: 'prime-numbers',
    icon: '🔢',
    nameKo: '소수',
    nameEn: 'Prime Numbers',
    descKo: '1과 자기 자신만으로 나누어지는 수',
    descEn: 'Numbers divisible only by 1 and itself',
    colorClass: 'featuredCardRed',
  },
  {
    id: 'complex-numbers',
    icon: 'ℂ',
    nameKo: '복소수',
    nameEn: 'Complex Numbers',
    descKo: '실수와 허수의 합',
    descEn: 'Sum of real and imaginary numbers',
    colorClass: 'featuredCardPink',
  },
  {
    id: 'vectors-basics',
    icon: '➡',
    nameKo: '벡터',
    nameEn: 'Vectors',
    descKo: '크기와 방향을 가진 양',
    descEn: 'Quantity with magnitude and direction',
    colorClass: 'featuredCardTeal',
  },
  {
    id: 'probability-basics',
    icon: '🎲',
    nameKo: '확률',
    nameEn: 'Probability',
    descKo: '사건이 일어날 가능성',
    descEn: 'Likelihood of an event occurring',
    colorClass: 'featuredCardIndigo',
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
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>{t('logoText')}</h1>
        <p className={styles.heroSubtitle}>{t('heroSubtitle')}</p>
      </div>

      {/* Featured Concepts Grid */}
      <section aria-labelledby="featured-concepts-heading">
        <h2 id="featured-concepts-heading" className={styles.srOnly}>
          {locale === 'ko' ? '주요 개념' : 'Featured Concepts'}
        </h2>
        <div className={styles.featuredGrid}>
          {FEATURED_CONCEPTS.map((concept) => (
            <Link
              key={concept.id}
              to={localePath(`/concept/${concept.id}`)}
              className={`${styles.featuredCard} ${styles[concept.colorClass]}`}
            >
              <div className={styles.featuredIcon}>{concept.icon}</div>
              <h3 className={styles.featuredName}>
                {locale === 'ko' ? concept.nameKo : concept.nameEn}
              </h3>
              <p className={styles.featuredDesc}>
                {locale === 'ko' ? concept.descKo : concept.descEn}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse All Link */}
      <div className={styles.browseAllLink}>
        <Link to={localePath('/browse')} className={styles.browseAllButton}>
          {t('browseAllConcepts')}
          <span>→</span>
        </Link>
      </div>
    </Layout>
  );
}
