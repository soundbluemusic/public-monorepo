/**
 * @fileoverview 기하학 개념 데이터
 * 3.1 평면기하: 점/선/면, 각도, 삼각형, 사각형, 원
 * 3.2 입체기하: 다면체, 원기둥/원뿔/구, 부피/표면적
 * 3.3 해석기하: 좌표계, 직선/곡선 방정식, 원뿔곡선
 * 3.4 비유클리드: 쌍곡/구면 기하, 곡률
 * 3.5 미분기하: 곡선론, 곡면론, 다양체
 * 3.6 리만기하: 리만 다양체, 측지선, 곡률 텐서
 * 3.7 심플렉틱: 심플렉틱 형식, 해밀턴 역학
 * 3.8 대수기하: 대수적 다양체, 스킴, 층 이론
 * 3.9 사영기하: 사영공간, 동차좌표
 */
import type { MathConcept } from "../types";

export const geometryConcepts: MathConcept[] = [
  // ========================================
  // 3.1 평면기하 (Plane Geometry)
  // ========================================
  {
    id: "point-line-plane",
    name: {
      ko: "점, 선, 면",
      en: "Point, Line, Plane",
      ja: "点、線、面",
    },
    field: "geometry",
    subfield: "plane-geometry",
    difficulty: 1,
    content: {
      ko: {
        definition: "기하학의 기본 요소로, 점은 위치만 가지고, 선은 길이만 가지며, 면은 넓이만 가진다.",
        formulas: [
          {
            latex: "\\text{점: 차원 0, 선: 차원 1, 면: 차원 2}",
            description: "기하학적 차원",
          },
        ],
        examples: [
          {
            problem: "두 점을 지나는 직선은 몇 개인가?",
            solution: "오직 하나. 두 점을 지나는 직선은 유일하게 결정된다.",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "건축", description: "설계의 기초" },
          { field: "CAD", description: "컴퓨터 지원 설계" },
        ],
      },
      en: {
        definition: "Basic elements of geometry: a point has only position, a line has only length, a plane has only area.",
        formulas: [
          {
            latex: "\\text{Point: dimension 0, Line: dimension 1, Plane: dimension 2}",
            description: "Geometric dimensions",
          },
        ],
        examples: [
          {
            problem: "How many lines pass through two points?",
            solution: "Exactly one. A line through two points is uniquely determined.",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "Architecture", description: "Foundation of design" },
          { field: "CAD", description: "Computer-aided design" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["angles", "triangles"],
      related: ["euclidean-geometry"],
      applications: [],
    },
    tags: ["geometry", "fundamental", "basic"],
  },
  {
    id: "angles",
    name: {
      ko: "각도",
      en: "Angles",
      ja: "角度",
    },
    field: "geometry",
    subfield: "plane-geometry",
    difficulty: 1,
    content: {
      ko: {
        definition: "두 직선이나 두 평면이 만나서 이루는 정도를 나타내는 양이다.",
        formulas: [
          {
            latex: "\\text{직각} = 90°, \\quad \\text{평각} = 180°, \\quad \\text{주각} = 360°",
            description: "기본 각도",
          },
          {
            latex: "\\text{맞꼭지각은 서로 같다}",
            description: "맞꼭지각 성질",
          },
          {
            latex: "\\text{동위각, 엇각이 같으면 두 직선은 평행}",
            description: "평행선과 각",
          },
        ],
        examples: [
          {
            problem: "두 직선이 교차할 때 생기는 맞꼭지각이 55°이면 나머지 각은?",
            solution: "맞꼭지각: 55°, 55°\n나머지: 180° - 55° = 125°, 125°",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "건축", description: "구조물 설계" },
          { field: "항해", description: "방위 측정" },
        ],
      },
      en: {
        definition: "A measure of the amount of turn between two lines or planes meeting at a point.",
        formulas: [
          {
            latex: "\\text{Right angle} = 90°, \\quad \\text{Straight} = 180°, \\quad \\text{Full} = 360°",
            description: "Basic angles",
          },
          {
            latex: "\\text{Vertical angles are equal}",
            description: "Vertical angle property",
          },
          {
            latex: "\\text{Corresponding/alternate angles equal} \\Rightarrow \\text{parallel lines}",
            description: "Parallel lines and angles",
          },
        ],
        examples: [
          {
            problem: "Two lines cross forming a 55° angle. What are the other angles?",
            solution: "Vertical angles: 55°, 55°\nOthers: 180° - 55° = 125°, 125°",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "Architecture", description: "Structural design" },
          { field: "Navigation", description: "Bearing measurements" },
        ],
      },
    },
    relations: {
      prerequisites: ["point-line-plane"],
      nextTopics: ["triangles", "parallel-lines"],
      related: ["trigonometry-basics"],
      applications: [],
    },
    tags: ["geometry", "angle", "fundamental"],
  },
  {
    id: "triangles",
    name: {
      ko: "삼각형",
      en: "Triangles",
      ja: "三角形",
    },
    field: "geometry",
    subfield: "plane-geometry",
    difficulty: 2,
    content: {
      ko: {
        definition: "세 개의 변과 세 개의 각으로 이루어진 다각형이다.",
        formulas: [
          {
            latex: "\\text{내각의 합} = 180°",
            description: "삼각형 내각의 합",
          },
          {
            latex: "A = \\frac{1}{2}bh",
            description: "삼각형의 넓이",
          },
          {
            latex: "a^2 + b^2 = c^2 \\quad (\\text{직각삼각형})",
            description: "피타고라스 정리",
          },
        ],
        examples: [
          {
            problem: "두 내각이 60°, 70°인 삼각형의 나머지 각은?",
            solution: "180° - 60° - 70° = 50°",
            difficulty: 1,
          },
          {
            problem: "밑변 8, 높이 5인 삼각형의 넓이는?",
            solution: "A = ½ × 8 × 5 = 20",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "구조공학", description: "트러스 구조" },
          { field: "측량", description: "삼각측량" },
        ],
      },
      en: {
        definition: "A polygon with three sides and three angles.",
        formulas: [
          {
            latex: "\\text{Sum of interior angles} = 180°",
            description: "Triangle angle sum",
          },
          {
            latex: "A = \\frac{1}{2}bh",
            description: "Area of triangle",
          },
          {
            latex: "a^2 + b^2 = c^2 \\quad (\\text{right triangle})",
            description: "Pythagorean theorem",
          },
        ],
        examples: [
          {
            problem: "Two angles of a triangle are 60° and 70°. Find the third angle.",
            solution: "180° - 60° - 70° = 50°",
            difficulty: 1,
          },
          {
            problem: "Find the area of a triangle with base 8 and height 5.",
            solution: "A = ½ × 8 × 5 = 20",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "Structural Engineering", description: "Truss structures" },
          { field: "Surveying", description: "Triangulation" },
        ],
      },
    },
    relations: {
      prerequisites: ["angles", "point-line-plane"],
      nextTopics: ["pythagorean-theorem", "similar-triangles", "congruent-triangles"],
      related: ["quadrilaterals"],
      applications: [],
    },
    tags: ["geometry", "triangle", "polygon", "fundamental"],
  },
  {
    id: "pythagorean-theorem",
    name: {
      ko: "피타고라스 정리",
      en: "Pythagorean Theorem",
      ja: "ピタゴラスの定理",
    },
    field: "geometry",
    subfield: "plane-geometry",
    difficulty: 2,
    content: {
      ko: {
        definition: "직각삼각형에서 빗변의 제곱은 다른 두 변의 제곱의 합과 같다.",
        formulas: [
          {
            latex: "a^2 + b^2 = c^2",
            description: "피타고라스 정리",
            variables: [
              { symbol: "a, b", meaning: "직각을 이루는 두 변" },
              { symbol: "c", meaning: "빗변" },
            ],
          },
        ],
        examples: [
          {
            problem: "두 변이 3, 4인 직각삼각형의 빗변은?",
            solution: "c² = 3² + 4² = 9 + 16 = 25\nc = 5",
            difficulty: 1,
          },
          {
            problem: "빗변 13, 한 변 5인 직각삼각형의 나머지 변은?",
            solution: "b² = 13² - 5² = 169 - 25 = 144\nb = 12",
            difficulty: 2,
          },
        ],
        history: {
          discoveredBy: "피타고라스",
          year: "기원전 6세기",
          background: "바빌로니아, 인도에서 이미 알려진 관계를 증명",
        },
        applications: [
          { field: "건축", description: "직각 확인, 대각선 계산" },
          { field: "측량", description: "거리 계산" },
        ],
      },
      en: {
        definition: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.",
        formulas: [
          {
            latex: "a^2 + b^2 = c^2",
            description: "Pythagorean theorem",
            variables: [
              { symbol: "a, b", meaning: "The two legs" },
              { symbol: "c", meaning: "Hypotenuse" },
            ],
          },
        ],
        examples: [
          {
            problem: "Find the hypotenuse of a right triangle with legs 3 and 4.",
            solution: "c² = 3² + 4² = 9 + 16 = 25\nc = 5",
            difficulty: 1,
          },
          {
            problem: "Find the leg of a right triangle with hypotenuse 13 and one leg 5.",
            solution: "b² = 13² - 5² = 169 - 25 = 144\nb = 12",
            difficulty: 2,
          },
        ],
        history: {
          discoveredBy: "Pythagoras",
          year: "6th century BCE",
          background: "Proved a relationship already known in Babylon and India",
        },
        applications: [
          { field: "Architecture", description: "Checking right angles, diagonal calculations" },
          { field: "Surveying", description: "Distance calculations" },
        ],
      },
    },
    relations: {
      prerequisites: ["triangles"],
      nextTopics: ["distance-formula", "trigonometry-basics"],
      related: ["similar-triangles"],
      applications: [],
    },
    tags: ["geometry", "triangle", "theorem", "fundamental"],
  },
  {
    id: "quadrilaterals",
    name: {
      ko: "사각형",
      en: "Quadrilaterals",
      ja: "四角形",
    },
    field: "geometry",
    subfield: "plane-geometry",
    difficulty: 2,
    content: {
      ko: {
        definition: "네 개의 변과 네 개의 각으로 이루어진 다각형이다.",
        formulas: [
          {
            latex: "\\text{내각의 합} = 360°",
            description: "사각형 내각의 합",
          },
          {
            latex: "A_{\\text{직사각형}} = l \\times w",
            description: "직사각형 넓이",
          },
          {
            latex: "A_{\\text{평행사변형}} = b \\times h",
            description: "평행사변형 넓이",
          },
          {
            latex: "A_{\\text{사다리꼴}} = \\frac{(a+b)h}{2}",
            description: "사다리꼴 넓이",
          },
        ],
        examples: [
          {
            problem: "가로 8, 세로 5인 직사각형의 넓이와 둘레는?",
            solution: "넓이 = 8 × 5 = 40\n둘레 = 2(8+5) = 26",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "건축", description: "바닥 면적 계산" },
          { field: "토지", description: "토지 면적 측량" },
        ],
      },
      en: {
        definition: "A polygon with four sides and four angles.",
        formulas: [
          {
            latex: "\\text{Sum of interior angles} = 360°",
            description: "Quadrilateral angle sum",
          },
          {
            latex: "A_{\\text{rectangle}} = l \\times w",
            description: "Rectangle area",
          },
          {
            latex: "A_{\\text{parallelogram}} = b \\times h",
            description: "Parallelogram area",
          },
          {
            latex: "A_{\\text{trapezoid}} = \\frac{(a+b)h}{2}",
            description: "Trapezoid area",
          },
        ],
        examples: [
          {
            problem: "Find the area and perimeter of a rectangle 8 by 5.",
            solution: "Area = 8 × 5 = 40\nPerimeter = 2(8+5) = 26",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "Architecture", description: "Floor area calculation" },
          { field: "Land", description: "Land area surveying" },
        ],
      },
    },
    relations: {
      prerequisites: ["triangles"],
      nextTopics: ["polygons", "circle"],
      related: ["parallelogram-properties"],
      applications: [],
    },
    tags: ["geometry", "quadrilateral", "polygon"],
  },
  {
    id: "circle",
    name: {
      ko: "원",
      en: "Circle",
      ja: "円",
    },
    field: "geometry",
    subfield: "plane-geometry",
    difficulty: 2,
    content: {
      ko: {
        definition: "평면 위에서 한 점으로부터 같은 거리에 있는 모든 점들의 집합이다.",
        formulas: [
          {
            latex: "C = 2\\pi r = \\pi d",
            description: "원의 둘레",
          },
          {
            latex: "A = \\pi r^2",
            description: "원의 넓이",
          },
          {
            latex: "\\text{호의 길이} = \\frac{\\theta}{360°} \\times 2\\pi r",
            description: "호의 길이 (도 단위)",
          },
          {
            latex: "\\text{부채꼴 넓이} = \\frac{\\theta}{360°} \\times \\pi r^2",
            description: "부채꼴 넓이",
          },
        ],
        examples: [
          {
            problem: "반지름 7인 원의 둘레와 넓이를 구하시오.",
            solution: "둘레 = 2π × 7 = 14π ≈ 43.98\n넓이 = π × 7² = 49π ≈ 153.94",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "공학", description: "기어, 바퀴 설계" },
          { field: "물리학", description: "원운동" },
        ],
      },
      en: {
        definition: "The set of all points in a plane at a fixed distance from a center point.",
        formulas: [
          {
            latex: "C = 2\\pi r = \\pi d",
            description: "Circumference",
          },
          {
            latex: "A = \\pi r^2",
            description: "Area",
          },
          {
            latex: "\\text{Arc length} = \\frac{\\theta}{360°} \\times 2\\pi r",
            description: "Arc length (degrees)",
          },
          {
            latex: "\\text{Sector area} = \\frac{\\theta}{360°} \\times \\pi r^2",
            description: "Sector area",
          },
        ],
        examples: [
          {
            problem: "Find the circumference and area of a circle with radius 7.",
            solution: "Circumference = 2π × 7 = 14π ≈ 43.98\nArea = π × 7² = 49π ≈ 153.94",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Engineering", description: "Gear, wheel design" },
          { field: "Physics", description: "Circular motion" },
        ],
      },
    },
    relations: {
      prerequisites: ["point-line-plane"],
      nextTopics: ["conic-sections", "trigonometry-basics"],
      related: ["pi"],
      applications: [],
    },
    tags: ["geometry", "circle", "fundamental"],
  },

  // ========================================
  // 3.2 입체기하 (Solid Geometry)
  // ========================================
  {
    id: "polyhedra",
    name: {
      ko: "다면체",
      en: "Polyhedra",
      ja: "多面体",
    },
    field: "geometry",
    subfield: "solid-geometry",
    difficulty: 3,
    content: {
      ko: {
        definition: "평면 다각형으로 둘러싸인 3차원 도형이다.",
        formulas: [
          {
            latex: "V - E + F = 2",
            description: "오일러 공식 (꼭짓점 - 모서리 + 면 = 2)",
          },
          {
            latex: "\\text{정다면체: 정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체}",
            description: "5가지 정다면체 (플라톤 입체)",
          },
        ],
        examples: [
          {
            problem: "정육면체의 꼭짓점, 모서리, 면의 수를 구하고 오일러 공식을 확인하시오.",
            solution: "V = 8, E = 12, F = 6\n8 - 12 + 6 = 2 ✓",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "건축", description: "돔 구조" },
          { field: "화학", description: "분자 구조" },
        ],
      },
      en: {
        definition: "A 3D shape bounded by flat polygonal faces.",
        formulas: [
          {
            latex: "V - E + F = 2",
            description: "Euler's formula (Vertices - Edges + Faces = 2)",
          },
          {
            latex: "\\text{Platonic solids: tetrahedron, cube, octahedron, dodecahedron, icosahedron}",
            description: "The 5 Platonic solids",
          },
        ],
        examples: [
          {
            problem: "Find V, E, F for a cube and verify Euler's formula.",
            solution: "V = 8, E = 12, F = 6\n8 - 12 + 6 = 2 ✓",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Architecture", description: "Dome structures" },
          { field: "Chemistry", description: "Molecular structures" },
        ],
      },
    },
    relations: {
      prerequisites: ["quadrilaterals", "triangles"],
      nextTopics: ["prisms-pyramids"],
      related: ["euler-characteristic"],
      applications: [],
    },
    tags: ["geometry", "solid", "3D"],
  },
  {
    id: "cylinder-cone-sphere",
    name: {
      ko: "원기둥, 원뿔, 구",
      en: "Cylinder, Cone, Sphere",
      ja: "円柱、円錐、球",
    },
    field: "geometry",
    subfield: "solid-geometry",
    difficulty: 3,
    content: {
      ko: {
        definition: "곡면으로 이루어진 대표적인 3차원 도형이다.",
        formulas: [
          {
            latex: "V_{\\text{원기둥}} = \\pi r^2 h, \\quad S = 2\\pi r(r+h)",
            description: "원기둥 부피, 겉넓이",
          },
          {
            latex: "V_{\\text{원뿔}} = \\frac{1}{3}\\pi r^2 h",
            description: "원뿔 부피",
          },
          {
            latex: "V_{\\text{구}} = \\frac{4}{3}\\pi r^3, \\quad S = 4\\pi r^2",
            description: "구 부피, 겉넓이",
          },
        ],
        examples: [
          {
            problem: "반지름 3, 높이 10인 원기둥의 부피는?",
            solution: "V = π × 3² × 10 = 90π ≈ 282.74",
            difficulty: 2,
          },
          {
            problem: "반지름 6인 구의 부피와 겉넓이는?",
            solution: "V = (4/3)π × 6³ = 288π\nS = 4π × 6² = 144π",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "공학", description: "탱크, 파이프 설계" },
          { field: "물리학", description: "천체 역학" },
        ],
      },
      en: {
        definition: "Common 3D shapes with curved surfaces.",
        formulas: [
          {
            latex: "V_{\\text{cylinder}} = \\pi r^2 h, \\quad S = 2\\pi r(r+h)",
            description: "Cylinder volume, surface area",
          },
          {
            latex: "V_{\\text{cone}} = \\frac{1}{3}\\pi r^2 h",
            description: "Cone volume",
          },
          {
            latex: "V_{\\text{sphere}} = \\frac{4}{3}\\pi r^3, \\quad S = 4\\pi r^2",
            description: "Sphere volume, surface area",
          },
        ],
        examples: [
          {
            problem: "Find the volume of a cylinder with radius 3 and height 10.",
            solution: "V = π × 3² × 10 = 90π ≈ 282.74",
            difficulty: 2,
          },
          {
            problem: "Find the volume and surface area of a sphere with radius 6.",
            solution: "V = (4/3)π × 6³ = 288π\nS = 4π × 6² = 144π",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Engineering", description: "Tank, pipe design" },
          { field: "Physics", description: "Celestial mechanics" },
        ],
      },
    },
    relations: {
      prerequisites: ["circle"],
      nextTopics: ["surface-integrals"],
      related: ["volume-of-revolution"],
      applications: [],
    },
    tags: ["geometry", "solid", "3D", "curved"],
  },

  // ========================================
  // 3.3 해석기하 (Analytic Geometry)
  // ========================================
  {
    id: "coordinate-system",
    name: {
      ko: "좌표계",
      en: "Coordinate System",
      ja: "座標系",
    },
    field: "geometry",
    subfield: "analytic-geometry",
    difficulty: 2,
    content: {
      ko: {
        definition: "점의 위치를 숫자로 나타내는 체계이다.",
        formulas: [
          {
            latex: "(x, y) \\text{ - 직교 좌표}",
            description: "2차원 직교(데카르트) 좌표",
          },
          {
            latex: "(r, \\theta) \\text{ - 극좌표}",
            description: "극좌표",
          },
          {
            latex: "x = r\\cos\\theta, \\quad y = r\\sin\\theta",
            description: "극좌표 → 직교좌표 변환",
          },
        ],
        examples: [
          {
            problem: "극좌표 (4, 60°)를 직교좌표로 변환하시오.",
            solution: "x = 4cos60° = 4 × 0.5 = 2\ny = 4sin60° = 4 × (√3/2) = 2√3",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "GPS", description: "위치 추적" },
          { field: "게임", description: "캐릭터 위치" },
        ],
      },
      en: {
        definition: "A system to represent positions of points using numbers.",
        formulas: [
          {
            latex: "(x, y) \\text{ - Cartesian coordinates}",
            description: "2D Cartesian coordinates",
          },
          {
            latex: "(r, \\theta) \\text{ - Polar coordinates}",
            description: "Polar coordinates",
          },
          {
            latex: "x = r\\cos\\theta, \\quad y = r\\sin\\theta",
            description: "Polar to Cartesian conversion",
          },
        ],
        examples: [
          {
            problem: "Convert polar coordinates (4, 60°) to Cartesian.",
            solution: "x = 4cos60° = 4 × 0.5 = 2\ny = 4sin60° = 4 × (√3/2) = 2√3",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "GPS", description: "Location tracking" },
          { field: "Gaming", description: "Character positions" },
        ],
      },
    },
    relations: {
      prerequisites: ["point-line-plane"],
      nextTopics: ["distance-formula", "line-equation"],
      related: ["trigonometry-basics"],
      applications: [],
    },
    tags: ["geometry", "coordinate", "analytic"],
  },
  {
    id: "line-equation",
    name: {
      ko: "직선의 방정식",
      en: "Line Equation",
      ja: "直線の方程式",
    },
    field: "geometry",
    subfield: "analytic-geometry",
    difficulty: 2,
    content: {
      ko: {
        definition: "좌표평면 위의 직선을 수식으로 나타낸 것이다.",
        formulas: [
          {
            latex: "y = mx + b",
            description: "기울기-절편 형식",
          },
          {
            latex: "y - y_1 = m(x - x_1)",
            description: "점-기울기 형식",
          },
          {
            latex: "ax + by + c = 0",
            description: "일반형",
          },
          {
            latex: "m = \\frac{y_2 - y_1}{x_2 - x_1}",
            description: "두 점을 지나는 직선의 기울기",
          },
        ],
        examples: [
          {
            problem: "(1, 2)와 (4, 8)을 지나는 직선의 방정식을 구하시오.",
            solution: "m = (8-2)/(4-1) = 2\ny - 2 = 2(x - 1)\ny = 2x",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "경제학", description: "선형 모델" },
          { field: "물리학", description: "등속 운동" },
        ],
      },
      en: {
        definition: "A mathematical expression representing a straight line in the coordinate plane.",
        formulas: [
          {
            latex: "y = mx + b",
            description: "Slope-intercept form",
          },
          {
            latex: "y - y_1 = m(x - x_1)",
            description: "Point-slope form",
          },
          {
            latex: "ax + by + c = 0",
            description: "General form",
          },
          {
            latex: "m = \\frac{y_2 - y_1}{x_2 - x_1}",
            description: "Slope through two points",
          },
        ],
        examples: [
          {
            problem: "Find the equation of the line through (1, 2) and (4, 8).",
            solution: "m = (8-2)/(4-1) = 2\ny - 2 = 2(x - 1)\ny = 2x",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Economics", description: "Linear models" },
          { field: "Physics", description: "Uniform motion" },
        ],
      },
    },
    relations: {
      prerequisites: ["coordinate-system"],
      nextTopics: ["conic-sections", "distance-point-line"],
      related: ["linear-function"],
      applications: [],
    },
    tags: ["geometry", "line", "analytic", "equation"],
  },
  {
    id: "conic-sections",
    name: {
      ko: "원뿔곡선",
      en: "Conic Sections",
      ja: "円錐曲線",
    },
    field: "geometry",
    subfield: "analytic-geometry",
    difficulty: 4,
    content: {
      ko: {
        definition: "원뿔을 평면으로 자를 때 생기는 곡선: 원, 타원, 포물선, 쌍곡선이다.",
        formulas: [
          {
            latex: "x^2 + y^2 = r^2",
            description: "원",
          },
          {
            latex: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1",
            description: "타원",
          },
          {
            latex: "y = ax^2 + bx + c",
            description: "포물선",
          },
          {
            latex: "\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1",
            description: "쌍곡선",
          },
        ],
        examples: [
          {
            problem: "타원 x²/25 + y²/9 = 1의 장축과 단축의 길이는?",
            solution: "a = 5, b = 3\n장축 = 2a = 10, 단축 = 2b = 6",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "천문학", description: "행성 궤도" },
          { field: "위성", description: "포물면 안테나" },
        ],
      },
      en: {
        definition: "Curves formed by intersecting a cone with a plane: circle, ellipse, parabola, hyperbola.",
        formulas: [
          {
            latex: "x^2 + y^2 = r^2",
            description: "Circle",
          },
          {
            latex: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1",
            description: "Ellipse",
          },
          {
            latex: "y = ax^2 + bx + c",
            description: "Parabola",
          },
          {
            latex: "\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1",
            description: "Hyperbola",
          },
        ],
        examples: [
          {
            problem: "Find the major and minor axes of ellipse x²/25 + y²/9 = 1.",
            solution: "a = 5, b = 3\nMajor axis = 2a = 10, Minor axis = 2b = 6",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Astronomy", description: "Planetary orbits" },
          { field: "Satellites", description: "Parabolic antennas" },
        ],
      },
    },
    relations: {
      prerequisites: ["circle", "quadratic-equation"],
      nextTopics: ["parametric-curves"],
      related: ["kepler-laws"],
      applications: [],
    },
    tags: ["geometry", "conic", "curve", "analytic"],
  },

  // ========================================
  // 3.4 비유클리드 기하 (Non-Euclidean Geometry)
  // ========================================
  {
    id: "hyperbolic-geometry",
    name: {
      ko: "쌍곡 기하학",
      en: "Hyperbolic Geometry",
      ja: "双曲幾何学",
    },
    field: "geometry",
    subfield: "non-euclidean-geometry",
    difficulty: 5,
    content: {
      ko: {
        definition: "평행선 공준이 성립하지 않아, 한 점을 지나고 주어진 직선에 평행한 직선이 무한히 많은 기하학이다.",
        formulas: [
          {
            latex: "\\text{삼각형 내각의 합} < 180°",
            description: "쌍곡 기하에서 삼각형 내각의 합",
          },
          {
            latex: "ds^2 = \\frac{dx^2 + dy^2}{y^2}",
            description: "푸앵카레 상반평면 모형의 거리",
          },
        ],
        examples: [
          {
            problem: "쌍곡 기하에서 삼각형 내각이 각각 40°, 50°, 60°일 때 결손각(defect)은?",
            solution: "결손각 = 180° - (40° + 50° + 60°) = 30°\n넓이는 결손각에 비례",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "상대성이론", description: "시공간 기하학" },
          { field: "네트워크", description: "계층적 데이터 임베딩" },
        ],
      },
      en: {
        definition: "A geometry where the parallel postulate fails; infinitely many lines through a point are parallel to a given line.",
        formulas: [
          {
            latex: "\\text{Sum of angles in triangle} < 180°",
            description: "Triangle angle sum in hyperbolic geometry",
          },
          {
            latex: "ds^2 = \\frac{dx^2 + dy^2}{y^2}",
            description: "Poincaré half-plane metric",
          },
        ],
        examples: [
          {
            problem: "In hyperbolic geometry, if triangle angles are 40°, 50°, 60°, find the defect.",
            solution: "Defect = 180° - (40° + 50° + 60°) = 30°\nArea is proportional to defect",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "Relativity", description: "Spacetime geometry" },
          { field: "Networks", description: "Hierarchical data embedding" },
        ],
      },
    },
    relations: {
      prerequisites: ["plane-geometry"],
      nextTopics: ["curvature"],
      related: ["spherical-geometry"],
      applications: [],
    },
    tags: ["geometry", "non-euclidean", "hyperbolic"],
  },
  {
    id: "spherical-geometry",
    name: {
      ko: "구면 기하학",
      en: "Spherical Geometry",
      ja: "球面幾何学",
    },
    field: "geometry",
    subfield: "non-euclidean-geometry",
    difficulty: 4,
    content: {
      ko: {
        definition: "구의 표면에서의 기하학으로, 평행선이 존재하지 않는다.",
        formulas: [
          {
            latex: "\\text{삼각형 내각의 합} > 180°",
            description: "구면 삼각형 내각의 합",
          },
          {
            latex: "A = R^2(A + B + C - \\pi)",
            description: "구면 삼각형의 넓이 (초과각 공식)",
          },
        ],
        examples: [
          {
            problem: "구면에서 세 직각으로 이루어진 삼각형의 내각의 합은?",
            solution: "90° + 90° + 90° = 270° > 180°",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "항해", description: "대권항로 계산" },
          { field: "천문학", description: "천구 좌표계" },
        ],
      },
      en: {
        definition: "Geometry on the surface of a sphere; no parallel lines exist.",
        formulas: [
          {
            latex: "\\text{Sum of angles in triangle} > 180°",
            description: "Spherical triangle angle sum",
          },
          {
            latex: "A = R^2(A + B + C - \\pi)",
            description: "Spherical triangle area (excess formula)",
          },
        ],
        examples: [
          {
            problem: "What is the angle sum of a spherical triangle with three right angles?",
            solution: "90° + 90° + 90° = 270° > 180°",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "Navigation", description: "Great circle routes" },
          { field: "Astronomy", description: "Celestial coordinates" },
        ],
      },
    },
    relations: {
      prerequisites: ["plane-geometry", "circle"],
      nextTopics: ["curvature"],
      related: ["hyperbolic-geometry"],
      applications: [],
    },
    tags: ["geometry", "non-euclidean", "spherical"],
  },

  // ========================================
  // 3.5 미분기하 (Differential Geometry)
  // ========================================
  {
    id: "curve-theory",
    name: {
      ko: "곡선론",
      en: "Curve Theory",
      ja: "曲線論",
    },
    field: "geometry",
    subfield: "differential-geometry",
    difficulty: 4,
    content: {
      ko: {
        definition: "미분을 이용하여 곡선의 기하학적 성질을 연구한다.",
        formulas: [
          {
            latex: "\\kappa = \\frac{|\\mathbf{r}' \\times \\mathbf{r}''|}{|\\mathbf{r}'|^3}",
            description: "곡률",
          },
          {
            latex: "\\tau = \\frac{(\\mathbf{r}' \\times \\mathbf{r}'') \\cdot \\mathbf{r}'''}{|\\mathbf{r}' \\times \\mathbf{r}''|^2}",
            description: "비틀림 (torsion)",
          },
        ],
        examples: [
          {
            problem: "반지름 R인 원의 곡률을 구하시오.",
            solution: "원의 곡률 κ = 1/R (일정)",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "도로설계", description: "곡선 도로의 안전 설계" },
          { field: "로봇공학", description: "경로 계획" },
        ],
      },
      en: {
        definition: "Study of geometric properties of curves using differential calculus.",
        formulas: [
          {
            latex: "\\kappa = \\frac{|\\mathbf{r}' \\times \\mathbf{r}''|}{|\\mathbf{r}'|^3}",
            description: "Curvature",
          },
          {
            latex: "\\tau = \\frac{(\\mathbf{r}' \\times \\mathbf{r}'') \\cdot \\mathbf{r}'''}{|\\mathbf{r}' \\times \\mathbf{r}''|^2}",
            description: "Torsion",
          },
        ],
        examples: [
          {
            problem: "Find the curvature of a circle with radius R.",
            solution: "Curvature κ = 1/R (constant)",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Road Design", description: "Safe curve design" },
          { field: "Robotics", description: "Path planning" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivatives", "vectors"],
      nextTopics: ["surface-theory"],
      related: ["parametric-curves"],
      applications: [],
    },
    tags: ["geometry", "differential", "curve"],
  },
  {
    id: "surface-theory",
    name: {
      ko: "곡면론",
      en: "Surface Theory",
      ja: "曲面論",
    },
    field: "geometry",
    subfield: "differential-geometry",
    difficulty: 5,
    content: {
      ko: {
        definition: "미분을 이용하여 곡면의 기하학적 성질을 연구한다.",
        formulas: [
          {
            latex: "K = \\kappa_1 \\cdot \\kappa_2",
            description: "가우스 곡률 (주곡률의 곱)",
          },
          {
            latex: "H = \\frac{\\kappa_1 + \\kappa_2}{2}",
            description: "평균 곡률",
          },
        ],
        examples: [
          {
            problem: "구면의 가우스 곡률을 구하시오.",
            solution: "반지름 R인 구의 가우스 곡률 K = 1/R² (양수, 일정)",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "건축", description: "곡면 지붕 설계" },
          { field: "의학", description: "각막 곡률 측정" },
        ],
      },
      en: {
        definition: "Study of geometric properties of surfaces using differential calculus.",
        formulas: [
          {
            latex: "K = \\kappa_1 \\cdot \\kappa_2",
            description: "Gaussian curvature (product of principal curvatures)",
          },
          {
            latex: "H = \\frac{\\kappa_1 + \\kappa_2}{2}",
            description: "Mean curvature",
          },
        ],
        examples: [
          {
            problem: "Find the Gaussian curvature of a sphere.",
            solution: "For sphere of radius R: K = 1/R² (positive, constant)",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "Architecture", description: "Curved roof design" },
          { field: "Medicine", description: "Corneal curvature measurement" },
        ],
      },
    },
    relations: {
      prerequisites: ["curve-theory", "partial-derivatives"],
      nextTopics: ["riemannian-geometry"],
      related: ["gauss-bonnet"],
      applications: [],
    },
    tags: ["geometry", "differential", "surface"],
  },
  {
    id: "manifolds",
    name: {
      ko: "다양체",
      en: "Manifolds",
      ja: "多様体",
    },
    field: "geometry",
    subfield: "differential-geometry",
    difficulty: 5,
    content: {
      ko: {
        definition: "국소적으로 유클리드 공간과 닮은 위상 공간이다.",
        formulas: [
          {
            latex: "M^n: \\forall p \\in M, \\exists U_p \\cong \\mathbb{R}^n",
            description: "n차원 다양체의 정의",
          },
        ],
        examples: [
          {
            problem: "원(S¹)과 구면(S²)이 다양체인 이유를 설명하시오.",
            solution: "원의 각 점 주변은 직선과, 구면의 각 점 주변은 평면과 국소적으로 닮음",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "물리학", description: "상태 공간" },
          { field: "데이터 과학", description: "차원 축소" },
        ],
      },
      en: {
        definition: "A topological space locally resembling Euclidean space.",
        formulas: [
          {
            latex: "M^n: \\forall p \\in M, \\exists U_p \\cong \\mathbb{R}^n",
            description: "Definition of n-dimensional manifold",
          },
        ],
        examples: [
          {
            problem: "Explain why circle (S¹) and sphere (S²) are manifolds.",
            solution: "Near any point, circle looks like a line and sphere looks like a plane",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "Physics", description: "State spaces" },
          { field: "Data Science", description: "Dimensionality reduction" },
        ],
      },
    },
    relations: {
      prerequisites: ["surface-theory", "topology-basics"],
      nextTopics: ["riemannian-manifolds"],
      related: ["tangent-space"],
      applications: [],
    },
    tags: ["geometry", "differential", "manifold", "advanced"],
  },

  // ========================================
  // 3.6 리만 기하 (Riemannian Geometry)
  // ========================================
  {
    id: "riemannian-manifolds",
    name: {
      ko: "리만 다양체",
      en: "Riemannian Manifolds",
      ja: "リーマン多様体",
    },
    field: "geometry",
    subfield: "riemannian-geometry",
    difficulty: 5,
    content: {
      ko: {
        definition: "각 점에서 내적이 정의된 다양체로, 길이와 각도를 측정할 수 있다.",
        formulas: [
          {
            latex: "ds^2 = g_{ij}dx^i dx^j",
            description: "리만 계량 텐서",
          },
          {
            latex: "\\langle v, w \\rangle_p = g_p(v, w)",
            description: "접공간에서의 내적",
          },
        ],
        examples: [
          {
            problem: "유클리드 공간의 리만 계량을 쓰시오.",
            solution: "ds² = dx² + dy² + dz² (g_ij = δ_ij)",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "일반상대론", description: "시공간의 기하학" },
          { field: "기계학습", description: "정보 기하학" },
        ],
      },
      en: {
        definition: "A manifold with an inner product defined at each point, enabling measurement of lengths and angles.",
        formulas: [
          {
            latex: "ds^2 = g_{ij}dx^i dx^j",
            description: "Riemannian metric tensor",
          },
          {
            latex: "\\langle v, w \\rangle_p = g_p(v, w)",
            description: "Inner product in tangent space",
          },
        ],
        examples: [
          {
            problem: "Write the Riemannian metric for Euclidean space.",
            solution: "ds² = dx² + dy² + dz² (g_ij = δ_ij)",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "General Relativity", description: "Spacetime geometry" },
          { field: "Machine Learning", description: "Information geometry" },
        ],
      },
    },
    relations: {
      prerequisites: ["manifolds"],
      nextTopics: ["geodesics", "curvature-tensor"],
      related: ["metric-spaces"],
      applications: [],
    },
    tags: ["geometry", "riemannian", "advanced"],
  },
  {
    id: "geodesics",
    name: {
      ko: "측지선",
      en: "Geodesics",
      ja: "測地線",
    },
    field: "geometry",
    subfield: "riemannian-geometry",
    difficulty: 5,
    content: {
      ko: {
        definition: "곡면이나 다양체 위에서 두 점 사이의 최단 경로이다.",
        formulas: [
          {
            latex: "\\frac{d^2x^k}{dt^2} + \\Gamma^k_{ij}\\frac{dx^i}{dt}\\frac{dx^j}{dt} = 0",
            description: "측지선 방정식",
          },
        ],
        examples: [
          {
            problem: "구면에서의 측지선은 무엇인가?",
            solution: "대원(great circle): 구의 중심을 지나는 평면과 구면의 교선",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "항공", description: "최단 비행경로" },
          { field: "GPS", description: "위성 궤도" },
        ],
      },
      en: {
        definition: "The shortest path between two points on a surface or manifold.",
        formulas: [
          {
            latex: "\\frac{d^2x^k}{dt^2} + \\Gamma^k_{ij}\\frac{dx^i}{dt}\\frac{dx^j}{dt} = 0",
            description: "Geodesic equation",
          },
        ],
        examples: [
          {
            problem: "What are geodesics on a sphere?",
            solution: "Great circles: intersections of the sphere with planes through its center",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "Aviation", description: "Shortest flight paths" },
          { field: "GPS", description: "Satellite orbits" },
        ],
      },
    },
    relations: {
      prerequisites: ["riemannian-manifolds"],
      nextTopics: ["curvature-tensor"],
      related: ["calculus-of-variations"],
      applications: [],
    },
    tags: ["geometry", "riemannian", "geodesic"],
  },

  // ========================================
  // 3.7 심플렉틱 기하 (Symplectic Geometry)
  // ========================================
  {
    id: "symplectic-geometry",
    name: {
      ko: "심플렉틱 기하학",
      en: "Symplectic Geometry",
      ja: "シンプレクティック幾何学",
    },
    field: "geometry",
    subfield: "symplectic-geometry",
    difficulty: 5,
    content: {
      ko: {
        definition: "비퇴화 닫힌 2-형식이 정의된 짝수 차원 다양체의 기하학이다.",
        formulas: [
          {
            latex: "\\omega = \\sum_i dp_i \\wedge dq_i",
            description: "표준 심플렉틱 형식",
          },
          {
            latex: "d\\omega = 0, \\quad \\omega^n \\neq 0",
            description: "닫힌 형식, 비퇴화 조건",
          },
        ],
        examples: [
          {
            problem: "2차원 위상 공간에서 심플렉틱 형식을 쓰시오.",
            solution: "ω = dp ∧ dq (위치 q, 운동량 p)",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "고전역학", description: "해밀턴 역학" },
          { field: "양자역학", description: "정준 양자화" },
        ],
      },
      en: {
        definition: "Geometry of even-dimensional manifolds with a nondegenerate closed 2-form.",
        formulas: [
          {
            latex: "\\omega = \\sum_i dp_i \\wedge dq_i",
            description: "Standard symplectic form",
          },
          {
            latex: "d\\omega = 0, \\quad \\omega^n \\neq 0",
            description: "Closed form, nondegeneracy condition",
          },
        ],
        examples: [
          {
            problem: "Write the symplectic form for 2D phase space.",
            solution: "ω = dp ∧ dq (position q, momentum p)",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "Classical Mechanics", description: "Hamiltonian mechanics" },
          { field: "Quantum Mechanics", description: "Canonical quantization" },
        ],
      },
    },
    relations: {
      prerequisites: ["differential-forms", "manifolds"],
      nextTopics: ["hamiltonian-systems"],
      related: ["classical-mechanics"],
      applications: [],
    },
    tags: ["geometry", "symplectic", "physics", "advanced"],
  },

  // ========================================
  // 3.8 대수기하 (Algebraic Geometry)
  // ========================================
  {
    id: "algebraic-varieties",
    name: {
      ko: "대수적 다양체",
      en: "Algebraic Varieties",
      ja: "代数多様体",
    },
    field: "geometry",
    subfield: "algebraic-geometry",
    difficulty: 5,
    content: {
      ko: {
        definition: "다항방정식의 해집합으로 정의되는 기하학적 대상이다.",
        formulas: [
          {
            latex: "V(f) = \\{(x_1, ..., x_n) : f(x_1, ..., x_n) = 0\\}",
            description: "아핀 다양체",
          },
          {
            latex: "V(I) = \\{p : f(p) = 0, \\forall f \\in I\\}",
            description: "아이디얼로 정의된 다양체",
          },
        ],
        examples: [
          {
            problem: "V(x² + y² - 1)은 어떤 도형인가?",
            solution: "원점 중심, 반지름 1인 원",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "암호학", description: "타원곡선 암호" },
          { field: "로봇공학", description: "기구학" },
        ],
      },
      en: {
        definition: "Geometric objects defined as solution sets of polynomial equations.",
        formulas: [
          {
            latex: "V(f) = \\{(x_1, ..., x_n) : f(x_1, ..., x_n) = 0\\}",
            description: "Affine variety",
          },
          {
            latex: "V(I) = \\{p : f(p) = 0, \\forall f \\in I\\}",
            description: "Variety defined by ideal",
          },
        ],
        examples: [
          {
            problem: "What is V(x² + y² - 1)?",
            solution: "A circle centered at origin with radius 1",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Cryptography", description: "Elliptic curve cryptography" },
          { field: "Robotics", description: "Kinematics" },
        ],
      },
    },
    relations: {
      prerequisites: ["polynomial", "ring-theory"],
      nextTopics: ["schemes", "sheaves"],
      related: ["commutative-algebra"],
      applications: [],
    },
    tags: ["geometry", "algebraic", "variety", "advanced"],
  },

  // ========================================
  // 3.9 사영기하 (Projective Geometry)
  // ========================================
  {
    id: "projective-space",
    name: {
      ko: "사영 공간",
      en: "Projective Space",
      ja: "射影空間",
    },
    field: "geometry",
    subfield: "projective-geometry",
    difficulty: 4,
    content: {
      ko: {
        definition: "유클리드 공간에 무한원점을 추가하여 평행선이 한 점에서 만나도록 확장한 공간이다.",
        formulas: [
          {
            latex: "\\mathbb{P}^n = (\\mathbb{R}^{n+1} \\setminus \\{0\\}) / \\sim",
            description: "n차원 실사영공간",
          },
          {
            latex: "[x:y:z] \\sim [\\lambda x: \\lambda y: \\lambda z]",
            description: "동차좌표의 동치관계",
          },
        ],
        examples: [
          {
            problem: "사영평면 P²에서 두 직선의 교점의 개수는?",
            solution: "항상 정확히 1개 (무한원점 포함)",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "컴퓨터 비전", description: "투시 변환" },
          { field: "미술", description: "원근법" },
        ],
      },
      en: {
        definition: "An extension of Euclidean space with points at infinity so parallel lines meet.",
        formulas: [
          {
            latex: "\\mathbb{P}^n = (\\mathbb{R}^{n+1} \\setminus \\{0\\}) / \\sim",
            description: "n-dimensional real projective space",
          },
          {
            latex: "[x:y:z] \\sim [\\lambda x: \\lambda y: \\lambda z]",
            description: "Homogeneous coordinate equivalence",
          },
        ],
        examples: [
          {
            problem: "In projective plane P², how many intersection points do two lines have?",
            solution: "Always exactly 1 (including points at infinity)",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "Computer Vision", description: "Perspective transformations" },
          { field: "Art", description: "Perspective drawing" },
        ],
      },
    },
    relations: {
      prerequisites: ["coordinate-system", "linear-algebra-basics"],
      nextTopics: ["projective-transformations"],
      related: ["cross-ratio"],
      applications: [],
    },
    tags: ["geometry", "projective", "space"],
  },
  {
    id: "homogeneous-coordinates",
    name: {
      ko: "동차 좌표",
      en: "Homogeneous Coordinates",
      ja: "同次座標",
    },
    field: "geometry",
    subfield: "projective-geometry",
    difficulty: 4,
    content: {
      ko: {
        definition: "n차원 공간의 점을 n+1개의 좌표로 나타내어 사영 변환을 행렬로 표현할 수 있게 한다.",
        formulas: [
          {
            latex: "(x, y) \\leftrightarrow [x:y:1]",
            description: "2D 데카르트 → 동차좌표",
          },
          {
            latex: "[X:Y:W] \\to (X/W, Y/W)",
            description: "동차좌표 → 데카르트 (W ≠ 0)",
          },
        ],
        examples: [
          {
            problem: "점 (3, 4)의 동차좌표를 여러 가지로 표현하시오.",
            solution: "[3:4:1] = [6:8:2] = [9:12:3] = ...",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "3D 그래픽", description: "변환 행렬" },
          { field: "로봇공학", description: "좌표 변환" },
        ],
      },
      en: {
        definition: "Representing n-dimensional points with n+1 coordinates for projective transformations.",
        formulas: [
          {
            latex: "(x, y) \\leftrightarrow [x:y:1]",
            description: "2D Cartesian → Homogeneous",
          },
          {
            latex: "[X:Y:W] \\to (X/W, Y/W)",
            description: "Homogeneous → Cartesian (W ≠ 0)",
          },
        ],
        examples: [
          {
            problem: "Express point (3, 4) in various homogeneous coordinates.",
            solution: "[3:4:1] = [6:8:2] = [9:12:3] = ...",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "3D Graphics", description: "Transformation matrices" },
          { field: "Robotics", description: "Coordinate transformations" },
        ],
      },
    },
    relations: {
      prerequisites: ["projective-space"],
      nextTopics: ["projective-transformations"],
      related: ["matrix-transformations"],
      applications: [],
    },
    tags: ["geometry", "projective", "coordinates"],
  },
];
