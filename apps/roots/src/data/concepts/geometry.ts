/**
 * @fileoverview 기하학 개념 데이터
 */
import type { MathConcept } from '../types';

export const geometryConcepts: MathConcept[] = [
  // ============================================
  // 3.1 평면기하 Plane Geometry
  // ============================================
  {
    id: 'point-line-plane',
    name: {
      ko: '점, 선, 면',
      en: 'Point, Line, Plane',
      ja: '点・線・面',
    },
    field: 'geometry',
    subfield: 'plane-geometry',
    difficulty: 1,
    content: {
      ko: {
        definition:
          '점은 위치만 있고 크기가 없는 기하학적 대상이다. 선은 두 점을 잇는 가장 짧은 경로이다. 면은 길이와 너비를 가진 2차원 영역이다.',
        formulas: [
          {
            latex: '\\text{점 } P(x, y)',
            description: '좌표평면 위의 점',
          },
          {
            latex: 'ax + by + c = 0',
            description: '직선의 일반형',
          },
        ],
        examples: [
          {
            problem: '점 A(2, 3)과 점 B(5, 7)을 지나는 직선의 기울기를 구하시오.',
            solution: '기울기 m = (7-3)/(5-2) = 4/3',
            difficulty: 1,
          },
        ],
        applications: [
          { field: '건축', description: '설계 도면의 기본 요소' },
          { field: '컴퓨터 그래픽', description: '벡터 그래픽의 기초' },
        ],
      },
      en: {
        definition:
          'A point has position but no size. A line is the shortest path between two points. A plane is a 2-dimensional surface with length and width.',
        formulas: [
          {
            latex: '\\text{Point } P(x, y)',
            description: 'Point on coordinate plane',
          },
          {
            latex: 'ax + by + c = 0',
            description: 'General form of a line',
          },
        ],
        examples: [
          {
            problem: 'Find the slope of the line through A(2, 3) and B(5, 7).',
            solution: 'Slope m = (7-3)/(5-2) = 4/3',
            difficulty: 1,
          },
        ],
        applications: [
          { field: 'Architecture', description: 'Basic elements of blueprints' },
          { field: 'Computer Graphics', description: 'Foundation of vector graphics' },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ['angles', 'distance-formula'],
      related: ['coordinate-system'],
      applications: ['applied-engineering'],
    },
    tags: ['geometry', 'fundamental', 'point', 'line', 'plane'],
  },
  {
    id: 'angles',
    name: {
      ko: '각도',
      en: 'Angles',
      ja: '角度',
    },
    field: 'geometry',
    subfield: 'plane-geometry',
    difficulty: 1,
    content: {
      ko: {
        definition:
          '두 직선이 한 점에서 만날 때 생기는 벌어진 정도를 각이라 하고, 그 크기를 각도라 한다.',
        formulas: [
          {
            latex: '\\text{예각: } 0° < \\theta < 90°',
            description: '예각의 범위',
          },
          {
            latex: '\\text{직각: } \\theta = 90°',
            description: '직각',
          },
          {
            latex: '\\text{둔각: } 90° < \\theta < 180°',
            description: '둔각의 범위',
          },
          {
            latex: '\\text{평각: } \\theta = 180°',
            description: '평각 (일직선)',
          },
        ],
        examples: [
          {
            problem: '두 각이 보각일 때, 한 각이 35°이면 다른 각은?',
            solution: '보각의 합은 90°이므로\n다른 각 = 90° - 35° = 55°',
            difficulty: 1,
          },
          {
            problem: '두 각이 보충각일 때, 한 각이 120°이면 다른 각은?',
            solution: '보충각의 합은 180°이므로\n다른 각 = 180° - 120° = 60°',
            difficulty: 1,
          },
        ],
        applications: [
          { field: '건축', description: '구조물 설계' },
          { field: '항해', description: '방향 측정' },
        ],
      },
      en: {
        definition:
          'An angle is formed when two lines meet at a point. The measure of an angle indicates how far apart the lines are.',
        formulas: [
          {
            latex: '\\text{Acute: } 0° < \\theta < 90°',
            description: 'Acute angle range',
          },
          {
            latex: '\\text{Right: } \\theta = 90°',
            description: 'Right angle',
          },
          {
            latex: '\\text{Obtuse: } 90° < \\theta < 180°',
            description: 'Obtuse angle range',
          },
          {
            latex: '\\text{Straight: } \\theta = 180°',
            description: 'Straight angle',
          },
        ],
        examples: [
          {
            problem: 'If two angles are complementary and one is 35°, find the other.',
            solution: 'Complementary angles sum to 90°\nOther angle = 90° - 35° = 55°',
            difficulty: 1,
          },
          {
            problem: 'If two angles are supplementary and one is 120°, find the other.',
            solution: 'Supplementary angles sum to 180°\nOther angle = 180° - 120° = 60°',
            difficulty: 1,
          },
        ],
        applications: [
          { field: 'Architecture', description: 'Structural design' },
          { field: 'Navigation', description: 'Direction measurement' },
        ],
      },
    },
    relations: {
      prerequisites: ['point-line-plane'],
      nextTopics: ['triangle-basics', 'parallel-lines'],
      related: ['radians'],
      applications: ['applied-engineering'],
    },
    tags: ['geometry', 'angle', 'fundamental'],
  },
  {
    id: 'triangle-basics',
    name: {
      ko: '삼각형',
      en: 'Triangle',
      ja: '三角形',
    },
    field: 'geometry',
    subfield: 'plane-geometry',
    difficulty: 1,
    content: {
      ko: {
        definition: '세 개의 직선으로 둘러싸인 다각형이다. 세 내각의 합은 항상 180°이다.',
        formulas: [
          {
            latex: '\\angle A + \\angle B + \\angle C = 180°',
            description: '삼각형 내각의 합',
          },
          {
            latex: 'a + b > c',
            description: '삼각형 성립조건 (임의의 두 변의 합 > 나머지 한 변)',
          },
        ],
        examples: [
          {
            problem: '삼각형의 두 각이 50°와 70°일 때, 나머지 한 각은?',
            solution: '내각의 합 = 180°\n나머지 각 = 180° - 50° - 70° = 60°',
            difficulty: 1,
          },
          {
            problem: '변의 길이가 3, 4, 8인 삼각형이 존재하는지 판단하시오.',
            solution: '3 + 4 = 7 < 8\n삼각형 성립조건을 만족하지 않으므로 존재하지 않는다.',
            difficulty: 2,
          },
        ],
        applications: [
          { field: '건축', description: '트러스 구조' },
          { field: '측량', description: '삼각측량' },
        ],
      },
      en: {
        definition: 'A polygon with three sides. The sum of interior angles is always 180°.',
        formulas: [
          {
            latex: '\\angle A + \\angle B + \\angle C = 180°',
            description: 'Sum of interior angles',
          },
          {
            latex: 'a + b > c',
            description: 'Triangle inequality (sum of any two sides > third side)',
          },
        ],
        examples: [
          {
            problem: 'If two angles of a triangle are 50° and 70°, find the third.',
            solution: 'Sum of angles = 180°\nThird angle = 180° - 50° - 70° = 60°',
            difficulty: 1,
          },
          {
            problem: 'Can a triangle have sides of length 3, 4, and 8?',
            solution: '3 + 4 = 7 < 8\nTriangle inequality not satisfied, so no.',
            difficulty: 2,
          },
        ],
        applications: [
          { field: 'Architecture', description: 'Truss structures' },
          { field: 'Surveying', description: 'Triangulation' },
        ],
      },
    },
    relations: {
      prerequisites: ['angles'],
      nextTopics: ['pythagorean-theorem', 'triangle-area', 'similar-triangles'],
      related: ['polygon'],
      applications: ['applied-engineering'],
    },
    tags: ['geometry', 'triangle', 'fundamental'],
  },
  {
    id: 'pythagorean-theorem',
    name: {
      ko: '피타고라스 정리',
      en: 'Pythagorean Theorem',
      ja: 'ピタゴラスの定理',
    },
    field: 'geometry',
    subfield: 'plane-geometry',
    difficulty: 3,
    content: {
      ko: {
        definition: '직각삼각형에서 빗변의 제곱은 다른 두 변의 제곱의 합과 같다.',
        formulas: [
          {
            latex: 'a^2 + b^2 = c^2',
            description: '직각삼각형의 세 변 사이의 관계',
            variables: [
              { symbol: 'a', meaning: '직각을 이루는 한 변 (밑변)' },
              { symbol: 'b', meaning: '직각을 이루는 다른 변 (높이)' },
              { symbol: 'c', meaning: '빗변 (직각의 대변, 가장 긴 변)' },
            ],
          },
        ],
        examples: [
          {
            problem: '밑변이 3, 높이가 4인 직각삼각형의 빗변의 길이를 구하시오.',
            solution: 'c² = 3² + 4² = 9 + 16 = 25\n따라서 c = √25 = 5\n\n빗변의 길이는 5입니다.',
            latex: 'c = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5',
            difficulty: 2,
          },
          {
            problem: '빗변이 13, 한 변이 5인 직각삼각형의 나머지 한 변의 길이를 구하시오.',
            solution:
              '5² + b² = 13²\n25 + b² = 169\nb² = 144\nb = 12\n\n나머지 변의 길이는 12입니다.',
            latex: 'b = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12',
            difficulty: 3,
          },
        ],
        history: {
          discoveredBy: '피타고라스 (Pythagoras)',
          year: '기원전 6세기',
          background:
            '고대 그리스의 수학자 피타고라스가 증명한 것으로 알려져 있으나, 바빌로니아와 인도에서는 이보다 훨씬 이전에 이 관계를 알고 있었다.',
        },
        applications: [
          {
            field: '건축',
            description: '직각을 확인하고 대각선 거리를 계산하는 데 사용',
          },
          {
            field: '측량',
            description: '두 지점 사이의 직선 거리 계산',
          },
          {
            field: '컴퓨터 그래픽',
            description: '2D/3D 공간에서 거리 계산',
            conceptLink: 'distance-formula',
          },
        ],
      },
      en: {
        definition:
          'In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.',
        formulas: [
          {
            latex: 'a^2 + b^2 = c^2',
            description: 'Relationship between the three sides of a right triangle',
            variables: [
              { symbol: 'a', meaning: 'One leg of the right triangle' },
              { symbol: 'b', meaning: 'The other leg of the right triangle' },
              {
                symbol: 'c',
                meaning: 'Hypotenuse (the longest side, opposite the right angle)',
              },
            ],
          },
        ],
        examples: [
          {
            problem: 'Find the hypotenuse of a right triangle with legs of length 3 and 4.',
            solution: 'c² = 3² + 4² = 9 + 16 = 25\nTherefore c = √25 = 5\n\nThe hypotenuse is 5.',
            latex: 'c = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5',
            difficulty: 2,
          },
          {
            problem: 'Find the missing leg of a right triangle with hypotenuse 13 and one leg 5.',
            solution: '5² + b² = 13²\n25 + b² = 169\nb² = 144\nb = 12\n\nThe missing leg is 12.',
            latex: 'b = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12',
            difficulty: 3,
          },
        ],
        history: {
          discoveredBy: 'Pythagoras',
          year: '6th century BCE',
          background:
            'While attributed to the Greek mathematician Pythagoras, this relationship was known to Babylonians and Indians long before.',
        },
        applications: [
          {
            field: 'Architecture',
            description: 'Verifying right angles and calculating diagonal distances',
          },
          {
            field: 'Surveying',
            description: 'Calculating straight-line distances between points',
          },
          {
            field: 'Computer Graphics',
            description: 'Distance calculation in 2D/3D space',
            conceptLink: 'distance-formula',
          },
        ],
      },
    },
    relations: {
      prerequisites: ['triangle-basics', 'square-roots'],
      nextTopics: ['distance-formula', 'sine-cosine', 'law-of-cosines'],
      related: ['similar-triangles', 'euclidean-geometry'],
      applications: ['applied-engineering', 'applied-cs'],
    },
    tags: ['geometry', 'triangle', 'theorem', 'fundamental'],
  },
  {
    id: 'triangle-area',
    name: {
      ko: '삼각형의 넓이',
      en: 'Area of Triangle',
      ja: '三角形の面積',
    },
    field: 'geometry',
    subfield: 'plane-geometry',
    difficulty: 2,
    content: {
      ko: {
        definition: '삼각형의 넓이는 밑변과 높이의 곱의 절반이다.',
        formulas: [
          {
            latex: 'A = \\frac{1}{2} \\times b \\times h',
            description: '기본 공식: 밑변 × 높이 ÷ 2',
            variables: [
              { symbol: 'A', meaning: '삼각형의 넓이' },
              { symbol: 'b', meaning: '밑변의 길이' },
              { symbol: 'h', meaning: '밑변에 대한 높이' },
            ],
          },
          {
            latex: 'A = \\frac{1}{2}ab\\sin C',
            description: '두 변과 끼인각을 이용한 공식',
            variables: [
              { symbol: 'a, b', meaning: '두 변의 길이' },
              { symbol: 'C', meaning: '두 변 사이의 끼인각' },
            ],
          },
          {
            latex: 'A = \\sqrt{s(s-a)(s-b)(s-c)}',
            description: '헤론의 공식 (s = (a+b+c)/2)',
          },
        ],
        examples: [
          {
            problem: '밑변이 6cm, 높이가 4cm인 삼각형의 넓이를 구하시오.',
            solution: 'A = ½ × 6 × 4 = 12cm²',
            latex: 'A = \\frac{1}{2} \\times 6 \\times 4 = 12\\text{cm}^2',
            difficulty: 1,
          },
          {
            problem: '두 변의 길이가 각각 5cm, 8cm이고 끼인각이 30°인 삼각형의 넓이를 구하시오.',
            solution: 'A = ½ × 5 × 8 × sin30° = ½ × 5 × 8 × 0.5 = 10cm²',
            latex: 'A = \\frac{1}{2} \\times 5 \\times 8 \\times \\sin 30° = 10\\text{cm}^2',
            difficulty: 3,
          },
        ],
      },
      en: {
        definition: 'The area of a triangle is half the product of its base and height.',
        formulas: [
          {
            latex: 'A = \\frac{1}{2} \\times b \\times h',
            description: 'Basic formula: base × height ÷ 2',
            variables: [
              { symbol: 'A', meaning: 'Area of the triangle' },
              { symbol: 'b', meaning: 'Length of the base' },
              { symbol: 'h', meaning: 'Height perpendicular to the base' },
            ],
          },
          {
            latex: 'A = \\frac{1}{2}ab\\sin C',
            description: 'Formula using two sides and included angle',
            variables: [
              { symbol: 'a, b', meaning: 'Lengths of two sides' },
              { symbol: 'C', meaning: 'Angle between the two sides' },
            ],
          },
          {
            latex: 'A = \\sqrt{s(s-a)(s-b)(s-c)}',
            description: "Heron's formula (s = (a+b+c)/2)",
          },
        ],
        examples: [
          {
            problem: 'Find the area of a triangle with base 6cm and height 4cm.',
            solution: 'A = ½ × 6 × 4 = 12cm²',
            latex: 'A = \\frac{1}{2} \\times 6 \\times 4 = 12\\text{cm}^2',
            difficulty: 1,
          },
          {
            problem: 'Find the area of a triangle with sides 5cm and 8cm, and included angle 30°.',
            solution: 'A = ½ × 5 × 8 × sin30° = ½ × 5 × 8 × 0.5 = 10cm²',
            latex: 'A = \\frac{1}{2} \\times 5 \\times 8 \\times \\sin 30° = 10\\text{cm}^2',
            difficulty: 3,
          },
        ],
      },
    },
    relations: {
      prerequisites: ['triangle-basics'],
      nextTopics: ['polygon-area'],
      related: ['pythagorean-theorem', 'sine-cosine'],
      applications: ['applied-engineering'],
    },
    tags: ['geometry', 'triangle', 'area', 'fundamental'],
  },
  {
    id: 'similar-triangles',
    name: {
      ko: '닮은 삼각형',
      en: 'Similar Triangles',
      ja: '相似な三角形',
    },
    field: 'geometry',
    subfield: 'plane-geometry',
    difficulty: 2,
    content: {
      ko: {
        definition: '대응하는 각이 모두 같고, 대응하는 변의 비가 일정한 두 삼각형을 닮음이라 한다.',
        formulas: [
          {
            latex: "\\frac{a}{a'} = \\frac{b}{b'} = \\frac{c}{c'} = k",
            description: '닮음비 (scale factor)',
          },
          {
            latex: '\\frac{S_1}{S_2} = k^2',
            description: '넓이의 비 = 닮음비의 제곱',
          },
        ],
        examples: [
          {
            problem:
              '삼각형 ABC와 DEF가 닮음이고 닮음비가 2:3이다. ABC의 넓이가 8cm²일 때, DEF의 넓이는?',
            solution: '넓이의 비 = 닮음비² = (2/3)² = 4/9\n8 : S = 4 : 9\nS = 18cm²',
            difficulty: 2,
          },
        ],
        applications: [
          { field: '측량', description: '간접 거리 측정' },
          { field: '사진', description: '축소/확대 비율 계산' },
        ],
      },
      en: {
        definition:
          'Two triangles are similar if their corresponding angles are equal and their corresponding sides are proportional.',
        formulas: [
          {
            latex: "\\frac{a}{a'} = \\frac{b}{b'} = \\frac{c}{c'} = k",
            description: 'Scale factor (ratio of similarity)',
          },
          {
            latex: '\\frac{S_1}{S_2} = k^2',
            description: 'Ratio of areas = square of scale factor',
          },
        ],
        examples: [
          {
            problem:
              "Triangles ABC and DEF are similar with ratio 2:3. If ABC has area 8cm², find DEF's area.",
            solution: 'Area ratio = (2/3)² = 4/9\n8 : S = 4 : 9\nS = 18cm²',
            difficulty: 2,
          },
        ],
        applications: [
          { field: 'Surveying', description: 'Indirect distance measurement' },
          { field: 'Photography', description: 'Scale calculations' },
        ],
      },
    },
    relations: {
      prerequisites: ['triangle-basics', 'ratios'],
      nextTopics: ['congruent-triangles'],
      related: ['proportions'],
      applications: ['applied-engineering'],
    },
    tags: ['geometry', 'triangle', 'similarity'],
  },
  {
    id: 'congruent-triangles',
    name: {
      ko: '합동 삼각형',
      en: 'Congruent Triangles',
      ja: '合同な三角形',
    },
    field: 'geometry',
    subfield: 'plane-geometry',
    difficulty: 2,
    content: {
      ko: {
        definition:
          '모양과 크기가 완전히 같은 두 삼각형을 합동이라 한다. 대응하는 변과 각이 모두 같다.',
        formulas: [
          {
            latex: '\\triangle ABC \\cong \\triangle DEF',
            description: '합동 기호',
          },
        ],
        examples: [
          {
            problem: 'SSS 합동 조건을 설명하시오.',
            solution:
              '세 변의 길이가 각각 같으면 두 삼각형은 합동이다.\na = d, b = e, c = f이면 △ABC ≅ △DEF',
            difficulty: 1,
          },
          {
            problem: '합동 조건 5가지를 나열하시오.',
            solution: 'SSS (변변변)\nSAS (변각변)\nASA (각변각)\nAAS (각각변)\nRHS (직각빗변변)',
            difficulty: 2,
          },
        ],
        applications: [
          { field: '공학', description: '부품 호환성 설계' },
          { field: '건축', description: '대칭 구조물' },
        ],
      },
      en: {
        definition:
          'Two triangles are congruent if they have exactly the same shape and size. All corresponding sides and angles are equal.',
        formulas: [
          {
            latex: '\\triangle ABC \\cong \\triangle DEF',
            description: 'Congruence notation',
          },
        ],
        examples: [
          {
            problem: 'Explain the SSS congruence condition.',
            solution:
              'If three sides are respectively equal, triangles are congruent.\na = d, b = e, c = f implies △ABC ≅ △DEF',
            difficulty: 1,
          },
          {
            problem: 'List the 5 congruence conditions.',
            solution:
              'SSS (Side-Side-Side)\nSAS (Side-Angle-Side)\nASA (Angle-Side-Angle)\nAAS (Angle-Angle-Side)\nRHS (Right angle-Hypotenuse-Side)',
            difficulty: 2,
          },
        ],
        applications: [
          { field: 'Engineering', description: 'Component interchangeability' },
          { field: 'Architecture', description: 'Symmetric structures' },
        ],
      },
    },
    relations: {
      prerequisites: ['triangle-basics'],
      nextTopics: ['similar-triangles'],
      related: ['isometry'],
      applications: ['applied-engineering'],
    },
    tags: ['geometry', 'triangle', 'congruence'],
  },
  {
    id: 'quadrilaterals',
    name: {
      ko: '사각형',
      en: 'Quadrilaterals',
      ja: '四角形',
    },
    field: 'geometry',
    subfield: 'plane-geometry',
    difficulty: 2,
    content: {
      ko: {
        definition: '네 개의 직선으로 둘러싸인 다각형이다. 내각의 합은 360°이다.',
        formulas: [
          {
            latex: '\\text{정사각형 넓이: } A = s^2',
            description: '한 변의 길이가 s인 정사각형',
          },
          {
            latex: '\\text{직사각형 넓이: } A = l \\times w',
            description: '가로 l, 세로 w인 직사각형',
          },
          {
            latex: '\\text{평행사변형 넓이: } A = b \\times h',
            description: '밑변 b, 높이 h인 평행사변형',
          },
          {
            latex: '\\text{사다리꼴 넓이: } A = \\frac{(a + b)}{2} \\times h',
            description: '윗변 a, 아랫변 b, 높이 h인 사다리꼴',
          },
          {
            latex: '\\text{마름모 넓이: } A = \\frac{d_1 \\times d_2}{2}',
            description: '두 대각선이 d₁, d₂인 마름모',
          },
        ],
        examples: [
          {
            problem: '가로 8cm, 세로 5cm인 직사각형의 넓이와 둘레를 구하시오.',
            solution: '넓이 = 8 × 5 = 40cm²\n둘레 = 2(8 + 5) = 26cm',
            difficulty: 1,
          },
          {
            problem: '윗변 4cm, 아랫변 8cm, 높이 5cm인 사다리꼴의 넓이를 구하시오.',
            solution: 'A = (4 + 8)/2 × 5 = 6 × 5 = 30cm²',
            difficulty: 2,
          },
        ],
        applications: [
          { field: '건축', description: '방 면적 계산' },
          { field: '토지', description: '토지 면적 측량' },
        ],
      },
      en: {
        definition: 'A polygon with four sides. The sum of interior angles is 360°.',
        formulas: [
          {
            latex: '\\text{Square area: } A = s^2',
            description: 'Square with side s',
          },
          {
            latex: '\\text{Rectangle area: } A = l \\times w',
            description: 'Rectangle with length l, width w',
          },
          {
            latex: '\\text{Parallelogram area: } A = b \\times h',
            description: 'Parallelogram with base b, height h',
          },
          {
            latex: '\\text{Trapezoid area: } A = \\frac{(a + b)}{2} \\times h',
            description: 'Trapezoid with parallel sides a, b and height h',
          },
          {
            latex: '\\text{Rhombus area: } A = \\frac{d_1 \\times d_2}{2}',
            description: 'Rhombus with diagonals d₁, d₂',
          },
        ],
        examples: [
          {
            problem: 'Find the area and perimeter of a rectangle 8cm by 5cm.',
            solution: 'Area = 8 × 5 = 40cm²\nPerimeter = 2(8 + 5) = 26cm',
            difficulty: 1,
          },
          {
            problem: 'Find the area of a trapezoid with parallel sides 4cm and 8cm, height 5cm.',
            solution: 'A = (4 + 8)/2 × 5 = 6 × 5 = 30cm²',
            difficulty: 2,
          },
        ],
        applications: [
          { field: 'Architecture', description: 'Room area calculation' },
          { field: 'Land', description: 'Land surveying' },
        ],
      },
    },
    relations: {
      prerequisites: ['triangle-basics', 'angles'],
      nextTopics: ['polygon'],
      related: ['parallel-lines'],
      applications: ['applied-engineering'],
    },
    tags: ['geometry', 'quadrilateral', 'area'],
  },
  {
    id: 'circle-basics',
    name: {
      ko: '원',
      en: 'Circle',
      ja: '円',
    },
    field: 'geometry',
    subfield: 'plane-geometry',
    difficulty: 2,
    content: {
      ko: {
        definition: '평면 위에서 한 점(중심)으로부터 같은 거리에 있는 모든 점의 집합이다.',
        formulas: [
          {
            latex: 'C = 2\\pi r = \\pi d',
            description: '원의 둘레 (원주)',
            variables: [
              { symbol: 'r', meaning: '반지름' },
              { symbol: 'd', meaning: '지름 (d = 2r)' },
            ],
          },
          {
            latex: 'A = \\pi r^2',
            description: '원의 넓이',
          },
          {
            latex: '(x-a)^2 + (y-b)^2 = r^2',
            description: '중심 (a, b), 반지름 r인 원의 방정식',
          },
        ],
        examples: [
          {
            problem: '반지름이 7cm인 원의 둘레와 넓이를 구하시오. (π ≈ 3.14)',
            solution: '둘레 = 2π × 7 = 14π ≈ 43.96cm\n넓이 = π × 7² = 49π ≈ 153.86cm²',
            difficulty: 1,
          },
          {
            problem: '넓이가 100πcm²인 원의 반지름을 구하시오.',
            solution: 'πr² = 100π\nr² = 100\nr = 10cm',
            difficulty: 2,
          },
        ],
        applications: [
          { field: '공학', description: '바퀴, 기어 설계' },
          { field: '건축', description: '돔, 원형 구조물' },
        ],
      },
      en: {
        definition:
          'The set of all points in a plane that are at a fixed distance from a center point.',
        formulas: [
          {
            latex: 'C = 2\\pi r = \\pi d',
            description: 'Circumference',
            variables: [
              { symbol: 'r', meaning: 'radius' },
              { symbol: 'd', meaning: 'diameter (d = 2r)' },
            ],
          },
          {
            latex: 'A = \\pi r^2',
            description: 'Area of circle',
          },
          {
            latex: '(x-a)^2 + (y-b)^2 = r^2',
            description: 'Circle equation with center (a, b), radius r',
          },
        ],
        examples: [
          {
            problem: 'Find the circumference and area of a circle with radius 7cm. (π ≈ 3.14)',
            solution: 'Circumference = 2π × 7 = 14π ≈ 43.96cm\nArea = π × 7² = 49π ≈ 153.86cm²',
            difficulty: 1,
          },
          {
            problem: 'Find the radius of a circle with area 100π cm².',
            solution: 'πr² = 100π\nr² = 100\nr = 10cm',
            difficulty: 2,
          },
        ],
        applications: [
          { field: 'Engineering', description: 'Wheel, gear design' },
          { field: 'Architecture', description: 'Domes, circular structures' },
        ],
      },
    },
    relations: {
      prerequisites: ['point-line-plane'],
      nextTopics: ['radians', 'arc-sector'],
      related: ['pi-constant'],
      applications: ['applied-engineering'],
    },
    tags: ['geometry', 'circle', 'fundamental'],
  },
  {
    id: 'arc-sector',
    name: {
      ko: '호와 부채꼴',
      en: 'Arc and Sector',
      ja: '弧と扇形',
    },
    field: 'geometry',
    subfield: 'plane-geometry',
    difficulty: 2,
    content: {
      ko: {
        definition:
          '호는 원 위의 두 점 사이의 곡선 부분이고, 부채꼴은 두 반지름과 호로 둘러싸인 영역이다.',
        formulas: [
          {
            latex: 'l = \\frac{\\theta}{360°} \\times 2\\pi r = \\frac{\\theta \\pi r}{180}',
            description: '호의 길이 (θ는 중심각, degree)',
          },
          {
            latex: 'l = r\\theta',
            description: '호의 길이 (θ는 라디안)',
          },
          {
            latex: 'A = \\frac{\\theta}{360°} \\times \\pi r^2',
            description: '부채꼴의 넓이 (θ는 degree)',
          },
          {
            latex: 'A = \\frac{1}{2}r^2\\theta',
            description: '부채꼴의 넓이 (θ는 라디안)',
          },
        ],
        examples: [
          {
            problem: '반지름 10cm, 중심각 72°인 부채꼴의 호의 길이와 넓이를 구하시오.',
            solution:
              '호의 길이 = (72/360) × 2π × 10 = (1/5) × 20π = 4π cm\n넓이 = (72/360) × π × 100 = 20π cm²',
            difficulty: 2,
          },
        ],
        applications: [
          { field: '공학', description: '원형 파이프, 원호 설계' },
          { field: '그래픽', description: '파이 차트' },
        ],
      },
      en: {
        definition:
          'An arc is a portion of the circle between two points. A sector is the region bounded by two radii and an arc.',
        formulas: [
          {
            latex: 'l = \\frac{\\theta}{360°} \\times 2\\pi r',
            description: 'Arc length (θ in degrees)',
          },
          {
            latex: 'l = r\\theta',
            description: 'Arc length (θ in radians)',
          },
          {
            latex: 'A = \\frac{\\theta}{360°} \\times \\pi r^2',
            description: 'Sector area (θ in degrees)',
          },
          {
            latex: 'A = \\frac{1}{2}r^2\\theta',
            description: 'Sector area (θ in radians)',
          },
        ],
        examples: [
          {
            problem:
              'Find the arc length and area of a sector with radius 10cm and central angle 72°.',
            solution:
              'Arc length = (72/360) × 2π × 10 = (1/5) × 20π = 4π cm\nArea = (72/360) × π × 100 = 20π cm²',
            difficulty: 2,
          },
        ],
        applications: [
          { field: 'Engineering', description: 'Circular pipes, arc design' },
          { field: 'Graphics', description: 'Pie charts' },
        ],
      },
    },
    relations: {
      prerequisites: ['circle-basics', 'radians'],
      nextTopics: ['circular-motion'],
      related: ['angles'],
      applications: ['applied-engineering'],
    },
    tags: ['geometry', 'circle', 'arc', 'sector'],
  },

  // ============================================
  // 3.2 해석기하 Analytic Geometry
  // ============================================
  {
    id: 'distance-formula',
    name: {
      ko: '두 점 사이의 거리',
      en: 'Distance Formula',
      ja: '2点間の距離',
    },
    field: 'geometry',
    subfield: 'analytic-geometry',
    difficulty: 2,
    content: {
      ko: {
        definition: '좌표평면에서 두 점 사이의 직선 거리를 피타고라스 정리를 이용해 구한다.',
        formulas: [
          {
            latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
            description: '두 점 (x₁, y₁)과 (x₂, y₂) 사이의 거리',
          },
          {
            latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}',
            description: '3차원에서의 거리 공식',
          },
        ],
        examples: [
          {
            problem: '점 A(1, 2)와 점 B(4, 6) 사이의 거리를 구하시오.',
            solution: 'd = √[(4-1)² + (6-2)²]\n= √[9 + 16]\n= √25 = 5',
            latex: 'd = \\sqrt{3^2 + 4^2} = 5',
            difficulty: 2,
          },
        ],
        applications: [
          { field: 'GPS', description: '위치 간 거리 계산' },
          { field: '게임 개발', description: '충돌 감지' },
        ],
      },
      en: {
        definition:
          'The straight-line distance between two points in a coordinate plane, derived from the Pythagorean theorem.',
        formulas: [
          {
            latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
            description: 'Distance between (x₁, y₁) and (x₂, y₂)',
          },
          {
            latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}',
            description: '3D distance formula',
          },
        ],
        examples: [
          {
            problem: 'Find the distance between A(1, 2) and B(4, 6).',
            solution: 'd = √[(4-1)² + (6-2)²]\n= √[9 + 16]\n= √25 = 5',
            latex: 'd = \\sqrt{3^2 + 4^2} = 5',
            difficulty: 2,
          },
        ],
        applications: [
          { field: 'GPS', description: 'Distance between locations' },
          { field: 'Game Development', description: 'Collision detection' },
        ],
      },
    },
    relations: {
      prerequisites: ['pythagorean-theorem', 'coordinate-system'],
      nextTopics: ['midpoint-formula', 'slope'],
      related: ['euclidean-distance'],
      applications: ['applied-cs', 'applied-physics'],
    },
    tags: ['geometry', 'coordinate', 'distance', 'analytic'],
  },
  {
    id: 'midpoint-formula',
    name: {
      ko: '중점 공식',
      en: 'Midpoint Formula',
      ja: '中点の公式',
    },
    field: 'geometry',
    subfield: 'analytic-geometry',
    difficulty: 1,
    content: {
      ko: {
        definition: '두 점을 연결하는 선분의 중점 좌표를 구하는 공식이다.',
        formulas: [
          {
            latex: 'M = \\left( \\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2} \\right)',
            description: '중점 공식',
          },
        ],
        examples: [
          {
            problem: '점 A(2, 4)와 점 B(8, 10)의 중점을 구하시오.',
            solution: 'M = ((2+8)/2, (4+10)/2) = (5, 7)',
            difficulty: 1,
          },
        ],
        applications: [
          { field: '컴퓨터 그래픽', description: '객체 중심점 계산' },
          { field: '물리학', description: '무게중심' },
        ],
      },
      en: {
        definition:
          'A formula to find the coordinates of the midpoint of a line segment between two points.',
        formulas: [
          {
            latex: 'M = \\left( \\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2} \\right)',
            description: 'Midpoint formula',
          },
        ],
        examples: [
          {
            problem: 'Find the midpoint of A(2, 4) and B(8, 10).',
            solution: 'M = ((2+8)/2, (4+10)/2) = (5, 7)',
            difficulty: 1,
          },
        ],
        applications: [
          { field: 'Computer Graphics', description: 'Object center calculation' },
          { field: 'Physics', description: 'Center of mass' },
        ],
      },
    },
    relations: {
      prerequisites: ['point-line-plane'],
      nextTopics: ['section-formula'],
      related: ['distance-formula'],
      applications: ['applied-cs'],
    },
    tags: ['geometry', 'coordinate', 'midpoint', 'analytic'],
  },
  {
    id: 'slope',
    name: {
      ko: '기울기',
      en: 'Slope',
      ja: '傾き',
    },
    field: 'geometry',
    subfield: 'analytic-geometry',
    difficulty: 2,
    content: {
      ko: {
        definition:
          '직선의 기울어진 정도를 나타내는 값으로, 수평 변화량에 대한 수직 변화량의 비율이다.',
        formulas: [
          {
            latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\Delta y}{\\Delta x}',
            description: '두 점을 지나는 직선의 기울기',
          },
          {
            latex: 'y = mx + b',
            description: '기울기-절편 형태의 직선 방정식',
          },
          {
            latex: 'm_1 \\cdot m_2 = -1',
            description: '두 직선이 수직일 조건',
          },
        ],
        examples: [
          {
            problem: '점 (1, 2)와 (4, 8)을 지나는 직선의 기울기를 구하시오.',
            solution: 'm = (8-2)/(4-1) = 6/3 = 2',
            difficulty: 1,
          },
          {
            problem: '기울기가 3인 직선에 수직인 직선의 기울기는?',
            solution: 'm₁ × m₂ = -1이므로\nm₂ = -1/3',
            difficulty: 2,
          },
        ],
        applications: [
          { field: '물리학', description: '속도, 가속도 그래프 분석' },
          { field: '경제학', description: '한계비용, 한계수입' },
        ],
      },
      en: {
        definition:
          'A measure of how steep a line is, calculated as the ratio of vertical change to horizontal change.',
        formulas: [
          {
            latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\Delta y}{\\Delta x}',
            description: 'Slope of a line through two points',
          },
          {
            latex: 'y = mx + b',
            description: 'Slope-intercept form of a line',
          },
          {
            latex: 'm_1 \\cdot m_2 = -1',
            description: 'Condition for perpendicular lines',
          },
        ],
        examples: [
          {
            problem: 'Find the slope of the line through (1, 2) and (4, 8).',
            solution: 'm = (8-2)/(4-1) = 6/3 = 2',
            difficulty: 1,
          },
          {
            problem: 'What slope is perpendicular to a line with slope 3?',
            solution: 'm₁ × m₂ = -1, so\nm₂ = -1/3',
            difficulty: 2,
          },
        ],
        applications: [
          { field: 'Physics', description: 'Velocity, acceleration graphs' },
          { field: 'Economics', description: 'Marginal cost, marginal revenue' },
        ],
      },
    },
    relations: {
      prerequisites: ['point-line-plane'],
      nextTopics: ['linear-function', 'parallel-lines'],
      related: ['derivatives'],
      applications: ['applied-physics', 'applied-economics'],
    },
    tags: ['geometry', 'coordinate', 'slope', 'analytic'],
  },
  {
    id: 'conic-sections',
    name: {
      ko: '원뿔 곡선',
      en: 'Conic Sections',
      ja: '円錐曲線',
    },
    field: 'geometry',
    subfield: 'analytic-geometry',
    difficulty: 3,
    content: {
      ko: {
        definition: '원뿔을 평면으로 자를 때 생기는 곡선으로 원, 타원, 포물선, 쌍곡선이 있다.',
        formulas: [
          {
            latex: 'x^2 + y^2 = r^2',
            description: '원 (중심이 원점)',
          },
          {
            latex: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1',
            description: '타원 (중심이 원점)',
          },
          {
            latex: 'y = ax^2 + bx + c \\text{ 또는 } x^2 = 4py',
            description: '포물선',
          },
          {
            latex: '\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1',
            description: '쌍곡선 (중심이 원점)',
          },
        ],
        examples: [
          {
            problem: '타원 x²/9 + y²/4 = 1의 장축과 단축의 길이를 구하시오.',
            solution: 'a² = 9, b² = 4이므로 a = 3, b = 2\n장축 = 2a = 6\n단축 = 2b = 4',
            difficulty: 2,
          },
          {
            problem: '포물선 y = x²의 초점을 구하시오.',
            solution: 'y = x²을 x² = y로 쓰면\n4p = 1, p = 1/4\n초점: (0, 1/4)',
            difficulty: 3,
          },
        ],
        history: {
          discoveredBy: '아폴로니우스',
          year: '기원전 200년경',
          background: '페르가의 아폴로니우스가 원뿔 곡선을 체계적으로 연구했다.',
        },
        applications: [
          { field: '천문학', description: '행성 궤도' },
          { field: '공학', description: '위성 안테나, 반사경' },
        ],
      },
      en: {
        definition:
          'Curves formed by intersecting a cone with a plane: circle, ellipse, parabola, and hyperbola.',
        formulas: [
          {
            latex: 'x^2 + y^2 = r^2',
            description: 'Circle (centered at origin)',
          },
          {
            latex: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1',
            description: 'Ellipse (centered at origin)',
          },
          {
            latex: 'y = ax^2 + bx + c \\text{ or } x^2 = 4py',
            description: 'Parabola',
          },
          {
            latex: '\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1',
            description: 'Hyperbola (centered at origin)',
          },
        ],
        examples: [
          {
            problem: 'Find the major and minor axis lengths of ellipse x²/9 + y²/4 = 1.',
            solution: 'a² = 9, b² = 4, so a = 3, b = 2\nMajor axis = 2a = 6\nMinor axis = 2b = 4',
            difficulty: 2,
          },
          {
            problem: 'Find the focus of parabola y = x².',
            solution: 'Rewrite as x² = y\n4p = 1, p = 1/4\nFocus: (0, 1/4)',
            difficulty: 3,
          },
        ],
        history: {
          discoveredBy: 'Apollonius of Perga',
          year: 'c. 200 BCE',
          background: 'Apollonius systematically studied conic sections.',
        },
        applications: [
          { field: 'Astronomy', description: 'Planetary orbits' },
          { field: 'Engineering', description: 'Satellite dishes, reflectors' },
        ],
      },
    },
    relations: {
      prerequisites: ['circle-basics', 'quadratic-equation'],
      nextTopics: ['parametric-equations'],
      related: ['polar-coordinates'],
      applications: ['applied-physics', 'applied-engineering'],
    },
    tags: ['geometry', 'conic', 'analytic', 'advanced'],
  },

  // ============================================
  // 3.3 입체기하 Solid Geometry
  // ============================================
  {
    id: 'solid-geometry-basics',
    name: {
      ko: '입체도형',
      en: 'Solid Figures',
      ja: '立体図形',
    },
    field: 'geometry',
    subfield: 'solid-geometry',
    difficulty: 2,
    content: {
      ko: {
        definition: '3차원 공간에서 부피와 겉넓이를 가지는 도형이다.',
        formulas: [
          {
            latex: '\\text{정육면체: } V = s^3, \\quad S = 6s^2',
            description: '한 변이 s인 정육면체',
          },
          {
            latex: '\\text{직육면체: } V = lwh, \\quad S = 2(lw + wh + lh)',
            description: '가로 l, 세로 w, 높이 h인 직육면체',
          },
          {
            latex: '\\text{구: } V = \\frac{4}{3}\\pi r^3, \\quad S = 4\\pi r^2',
            description: '반지름 r인 구',
          },
          {
            latex: '\\text{원기둥: } V = \\pi r^2 h, \\quad S = 2\\pi r(r + h)',
            description: '밑면 반지름 r, 높이 h인 원기둥',
          },
          {
            latex: '\\text{원뿔: } V = \\frac{1}{3}\\pi r^2 h',
            description: '밑면 반지름 r, 높이 h인 원뿔',
          },
        ],
        examples: [
          {
            problem: '한 변이 4cm인 정육면체의 부피와 겉넓이를 구하시오.',
            solution: '부피 = 4³ = 64cm³\n겉넓이 = 6 × 4² = 96cm²',
            difficulty: 1,
          },
          {
            problem: '반지름 3cm인 구의 부피를 구하시오.',
            solution: 'V = (4/3)π × 3³ = (4/3)π × 27 = 36π cm³',
            difficulty: 2,
          },
        ],
        applications: [
          { field: '건축', description: '건물 공간 계산' },
          { field: '제조', description: '용기 용량 설계' },
        ],
      },
      en: {
        definition: 'Three-dimensional shapes with volume and surface area.',
        formulas: [
          {
            latex: '\\text{Cube: } V = s^3, \\quad S = 6s^2',
            description: 'Cube with side s',
          },
          {
            latex: '\\text{Rectangular prism: } V = lwh, \\quad S = 2(lw + wh + lh)',
            description: 'With length l, width w, height h',
          },
          {
            latex: '\\text{Sphere: } V = \\frac{4}{3}\\pi r^3, \\quad S = 4\\pi r^2',
            description: 'Sphere with radius r',
          },
          {
            latex: '\\text{Cylinder: } V = \\pi r^2 h, \\quad S = 2\\pi r(r + h)',
            description: 'Cylinder with radius r, height h',
          },
          {
            latex: '\\text{Cone: } V = \\frac{1}{3}\\pi r^2 h',
            description: 'Cone with radius r, height h',
          },
        ],
        examples: [
          {
            problem: 'Find the volume and surface area of a cube with side 4cm.',
            solution: 'Volume = 4³ = 64cm³\nSurface area = 6 × 4² = 96cm²',
            difficulty: 1,
          },
          {
            problem: 'Find the volume of a sphere with radius 3cm.',
            solution: 'V = (4/3)π × 3³ = (4/3)π × 27 = 36π cm³',
            difficulty: 2,
          },
        ],
        applications: [
          { field: 'Architecture', description: 'Building space calculation' },
          { field: 'Manufacturing', description: 'Container capacity design' },
        ],
      },
    },
    relations: {
      prerequisites: ['circle-basics', 'quadrilaterals'],
      nextTopics: ['surface-area', 'volume-formulas'],
      related: ['pi-constant'],
      applications: ['applied-engineering'],
    },
    tags: ['geometry', 'solid', '3D', 'volume'],
  },
];
