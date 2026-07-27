import type { Library } from '../library-types';

export const mathScienceLibraries: Library[] = [
  {
    name: 'Math.js',
    description: 'Extensive math library for JavaScript',
    descriptionKo: 'JavaScript용 광범위한 수학 라이브러리',
    categories: ['Math & Science'],
    license: 'Apache-2.0',
    github: 'https://github.com/josdejong/mathjs',
    website: 'https://mathjs.org',
    npm: 'mathjs',
    stars: '14k',
    trending: true,
    yearReleased: 2013,
    tags: ['Math', 'Algebra', 'Expression'],
    useCases: {
      en: 'Scientific calculations, matrix operations, expression parsing, unit conversions',
      ko: '과학 계산, 행렬 연산, 수식 파싱, 단위 변환',
    },
    codeExample: `import { evaluate, matrix, multiply } from 'mathjs';
evaluate('sqrt(3^2 + 4^2)'); // 5
const A = matrix([[1, 2], [3, 4]]);
multiply(A, 2);`,
  },
  {
    name: 'Simple Statistics',
    description: 'Statistical methods in JavaScript',
    descriptionKo: 'JavaScript 통계 메서드',
    categories: ['Math & Science'],
    license: 'ISC',
    github: 'https://github.com/simple-statistics/simple-statistics',
    website: 'https://simple-statistics.github.io/',
    npm: 'simple-statistics',
    stars: '3k',
    yearReleased: 2012,
    tags: ['Statistics', 'Math', 'Data'],
    useCases: {
      en: 'Mean, median, standard deviation, regression, probability distributions',
      ko: '평균, 중앙값, 표준편차, 회귀분석, 확률 분포',
    },
    codeExample: `import ss from 'simple-statistics';
ss.mean([1, 2, 3]); // 2
ss.standardDeviation([1, 2, 3]); // 0.816...
ss.linearRegression([[0, 0], [1, 1]]);`,
  },
  {
    name: 'stdlib',
    description: 'Standard library for JavaScript numerical computing',
    descriptionKo: 'JavaScript 수치 컴퓨팅 표준 라이브러리',
    categories: ['Math & Science'],
    license: 'Apache-2.0',
    github: 'https://github.com/stdlib-js/stdlib',
    website: 'https://stdlib.io',
    npm: '@stdlib/stdlib',
    stars: '4k',
    yearReleased: 2016,
    tags: ['Math', 'Scientific', 'Statistics'],
    useCases: {
      en: 'Scientific computing, statistical functions, special functions, random number generation',
      ko: '과학 계산, 통계 함수, 특수 함수, 난수 생성',
    },
    codeExample: `import linspace from '@stdlib/array-base-linspace';
import sin from '@stdlib/math-base-special-sin';
const x = linspace(0, 2 * Math.PI, 100);
const y = x.map(sin);`,
  },
];
