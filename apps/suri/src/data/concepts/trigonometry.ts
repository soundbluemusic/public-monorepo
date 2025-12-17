/**
 * @fileoverview 삼각법 개념 데이터
 */
import type { MathConcept } from "../types";

export const trigonometryConcepts: MathConcept[] = [
  {
    id: "sine-cosine",
    name: {
      ko: "사인과 코사인",
      en: "Sine and Cosine",
      ja: "サインとコサイン",
    },
    field: "trigonometry",
    subfield: "trig-functions",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "직각삼각형에서 사인(sin)은 대변/빗변, 코사인(cos)은 인접변/빗변의 비율입니다. 단위원에서는 각도 θ에 대해 점의 좌표가 (cos θ, sin θ)입니다.",
        formulas: [
          {
            latex: "\\sin \\theta = \\frac{\\text{대변}}{\\text{빗변}}",
            description: "사인의 정의 (직각삼각형)",
          },
          {
            latex: "\\cos \\theta = \\frac{\\text{인접변}}{\\text{빗변}}",
            description: "코사인의 정의 (직각삼각형)",
          },
          {
            latex: "\\sin^2 \\theta + \\cos^2 \\theta = 1",
            description: "피타고라스 항등식",
          },
        ],
        examples: [
          {
            problem: "θ = 30°일 때 sin θ와 cos θ의 값을 구하세요.",
            solution: "sin 30° = 1/2, cos 30° = √3/2",
          },
          {
            problem: "sin θ = 3/5일 때, cos θ를 구하세요 (0° < θ < 90°).",
            solution:
              "sin²θ + cos²θ = 1이므로, cos²θ = 1 - 9/25 = 16/25, cos θ = 4/5",
          },
        ],
        history: {
          discoveredBy: "히파르코스",
          year: "기원전 190-120년경",
          background:
            "고대 그리스의 천문학자 히파르코스가 삼각법의 기초를 세웠습니다.",
        },
        applications: [
          { field: "물리학", description: "파동, 진동, 회전 운동 분석" },
          { field: "공학", description: "신호 처리, 전자 회로 설계" },
          { field: "컴퓨터 그래픽스", description: "회전 변환, 애니메이션" },
        ],
      },
      en: {
        definition:
          "In a right triangle, sine (sin) is the ratio of opposite/hypotenuse, and cosine (cos) is adjacent/hypotenuse. On the unit circle, for angle θ, the point coordinates are (cos θ, sin θ).",
        formulas: [
          {
            latex: "\\sin \\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}",
            description: "Definition of sine (right triangle)",
          },
          {
            latex: "\\cos \\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}",
            description: "Definition of cosine (right triangle)",
          },
          {
            latex: "\\sin^2 \\theta + \\cos^2 \\theta = 1",
            description: "Pythagorean identity",
          },
        ],
        examples: [
          {
            problem: "Find sin θ and cos θ when θ = 30°.",
            solution: "sin 30° = 1/2, cos 30° = √3/2",
          },
          {
            problem: "If sin θ = 3/5, find cos θ (0° < θ < 90°).",
            solution:
              "Since sin²θ + cos²θ = 1, cos²θ = 1 - 9/25 = 16/25, cos θ = 4/5",
          },
        ],
        history: {
          discoveredBy: "Hipparchus",
          year: "c. 190-120 BCE",
          background:
            "Ancient Greek astronomer Hipparchus established the foundations of trigonometry.",
        },
        applications: [
          { field: "Physics", description: "Wave, oscillation, rotation analysis" },
          { field: "Engineering", description: "Signal processing, circuit design" },
          { field: "Computer Graphics", description: "Rotation transforms, animation" },
        ],
      },
    },
    relations: {
      prerequisites: ["pythagorean-theorem"],
      nextTopics: ["tangent", "inverse-trig"],
      related: ["unit-circle", "radians"],
    },
    tags: ["삼각함수", "사인", "코사인", "trigonometry", "sine", "cosine"],
  },
  {
    id: "tangent",
    name: {
      ko: "탄젠트",
      en: "Tangent",
      ja: "タンジェント",
    },
    field: "trigonometry",
    subfield: "trig-functions",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "탄젠트(tan)는 사인을 코사인으로 나눈 값으로, 직각삼각형에서는 대변/인접변의 비율입니다.",
        formulas: [
          {
            latex: "\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}",
            description: "탄젠트의 정의",
          },
          {
            latex: "\\tan \\theta = \\frac{\\text{대변}}{\\text{인접변}}",
            description: "직각삼각형에서의 탄젠트",
          },
          {
            latex: "1 + \\tan^2 \\theta = \\sec^2 \\theta",
            description: "탄젠트 항등식",
          },
        ],
        examples: [
          {
            problem: "tan 45°의 값을 구하세요.",
            solution: "tan 45° = sin 45° / cos 45° = (√2/2) / (√2/2) = 1",
          },
        ],
      },
      en: {
        definition:
          "Tangent (tan) is the ratio of sine to cosine, or in a right triangle, the ratio of opposite to adjacent side.",
        formulas: [
          {
            latex: "\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}",
            description: "Definition of tangent",
          },
          {
            latex: "\\tan \\theta = \\frac{\\text{opposite}}{\\text{adjacent}}",
            description: "Tangent in a right triangle",
          },
          {
            latex: "1 + \\tan^2 \\theta = \\sec^2 \\theta",
            description: "Tangent identity",
          },
        ],
        examples: [
          {
            problem: "Find the value of tan 45°.",
            solution: "tan 45° = sin 45° / cos 45° = (√2/2) / (√2/2) = 1",
          },
        ],
      },
    },
    relations: {
      prerequisites: ["sine-cosine"],
      nextTopics: ["inverse-trig", "trig-identities"],
      related: ["cotangent", "secant"],
    },
    tags: ["삼각함수", "탄젠트", "trigonometry", "tangent"],
  },
  {
    id: "unit-circle",
    name: {
      ko: "단위원",
      en: "Unit Circle",
      ja: "単位円",
    },
    field: "trigonometry",
    subfield: "trig-functions",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "단위원은 원점을 중심으로 반지름이 1인 원입니다. 삼각함수를 정의하고 시각화하는 데 핵심적인 도구입니다.",
        formulas: [
          {
            latex: "x^2 + y^2 = 1",
            description: "단위원의 방정식",
          },
          {
            latex: "(x, y) = (\\cos \\theta, \\sin \\theta)",
            description: "단위원 위의 점",
          },
        ],
        examples: [
          {
            problem: "단위원에서 θ = π/4일 때 좌표를 구하세요.",
            solution: "(cos π/4, sin π/4) = (√2/2, √2/2)",
          },
        ],
        applications: [
          { field: "수학", description: "삼각함수의 기하학적 정의" },
          { field: "물리학", description: "원운동, 회전 시스템" },
        ],
      },
      en: {
        definition:
          "The unit circle is a circle with radius 1 centered at the origin. It's a fundamental tool for defining and visualizing trigonometric functions.",
        formulas: [
          {
            latex: "x^2 + y^2 = 1",
            description: "Unit circle equation",
          },
          {
            latex: "(x, y) = (\\cos \\theta, \\sin \\theta)",
            description: "Point on unit circle",
          },
        ],
        examples: [
          {
            problem: "Find the coordinates on the unit circle when θ = π/4.",
            solution: "(cos π/4, sin π/4) = (√2/2, √2/2)",
          },
        ],
        applications: [
          { field: "Mathematics", description: "Geometric definition of trig functions" },
          { field: "Physics", description: "Circular motion, rotation systems" },
        ],
      },
    },
    relations: {
      prerequisites: ["sine-cosine"],
      nextTopics: ["radians", "trig-identities"],
      related: ["complex-numbers"],
    },
    tags: ["단위원", "삼각함수", "unit circle", "trigonometry"],
  },
  {
    id: "radians",
    name: {
      ko: "라디안",
      en: "Radians",
      ja: "ラジアン",
    },
    field: "trigonometry",
    subfield: "trig-functions",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "라디안은 호의 길이가 반지름과 같을 때의 중심각입니다. 360° = 2π 라디안입니다.",
        formulas: [
          {
            latex: "\\theta_{\\text{rad}} = \\frac{\\pi}{180} \\times \\theta_{\\text{deg}}",
            description: "도(degree)를 라디안으로 변환",
          },
          {
            latex: "s = r\\theta",
            description: "호의 길이 (θ는 라디안)",
          },
          {
            latex: "A = \\frac{1}{2}r^2\\theta",
            description: "부채꼴의 넓이 (θ는 라디안)",
          },
        ],
        examples: [
          {
            problem: "90°를 라디안으로 변환하세요.",
            solution: "90° × (π/180) = π/2 라디안",
          },
          {
            problem: "반지름이 5이고 중심각이 π/3 라디안인 호의 길이를 구하세요.",
            solution: "s = rθ = 5 × (π/3) = 5π/3",
          },
        ],
      },
      en: {
        definition:
          "A radian is the angle where the arc length equals the radius. 360° = 2π radians.",
        formulas: [
          {
            latex: "\\theta_{\\text{rad}} = \\frac{\\pi}{180} \\times \\theta_{\\text{deg}}",
            description: "Convert degrees to radians",
          },
          {
            latex: "s = r\\theta",
            description: "Arc length (θ in radians)",
          },
          {
            latex: "A = \\frac{1}{2}r^2\\theta",
            description: "Sector area (θ in radians)",
          },
        ],
        examples: [
          {
            problem: "Convert 90° to radians.",
            solution: "90° × (π/180) = π/2 radians",
          },
          {
            problem: "Find the arc length with radius 5 and central angle π/3 radians.",
            solution: "s = rθ = 5 × (π/3) = 5π/3",
          },
        ],
      },
    },
    relations: {
      prerequisites: ["circle-basics"],
      nextTopics: ["unit-circle", "trig-functions"],
      related: ["pi-constant"],
    },
    tags: ["라디안", "각도", "radians", "angle"],
  },
  {
    id: "trig-identities",
    name: {
      ko: "삼각 항등식",
      en: "Trigonometric Identities",
      ja: "三角関数の恒等式",
    },
    field: "trigonometry",
    subfield: "trig-identities",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "삼각 항등식은 모든 각도에서 성립하는 삼각함수 간의 등식입니다.",
        formulas: [
          {
            latex: "\\sin^2\\theta + \\cos^2\\theta = 1",
            description: "피타고라스 항등식",
          },
          {
            latex: "\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B",
            description: "사인의 덧셈정리",
          },
          {
            latex: "\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B",
            description: "코사인의 덧셈정리",
          },
          {
            latex: "\\sin 2\\theta = 2\\sin\\theta\\cos\\theta",
            description: "배각공식 (사인)",
          },
          {
            latex: "\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta",
            description: "배각공식 (코사인)",
          },
        ],
        examples: [
          {
            problem: "sin 75°를 sin과 cos의 특수각을 사용해 구하세요.",
            solution:
              "sin 75° = sin(45° + 30°) = sin45°cos30° + cos45°sin30° = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4",
          },
        ],
      },
      en: {
        definition:
          "Trigonometric identities are equations involving trigonometric functions that hold true for all angles.",
        formulas: [
          {
            latex: "\\sin^2\\theta + \\cos^2\\theta = 1",
            description: "Pythagorean identity",
          },
          {
            latex: "\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B",
            description: "Sine addition formula",
          },
          {
            latex: "\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B",
            description: "Cosine addition formula",
          },
          {
            latex: "\\sin 2\\theta = 2\\sin\\theta\\cos\\theta",
            description: "Double angle formula (sine)",
          },
          {
            latex: "\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta",
            description: "Double angle formula (cosine)",
          },
        ],
        examples: [
          {
            problem: "Find sin 75° using special angles.",
            solution:
              "sin 75° = sin(45° + 30°) = sin45°cos30° + cos45°sin30° = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4",
          },
        ],
      },
    },
    relations: {
      prerequisites: ["sine-cosine", "tangent"],
      nextTopics: ["inverse-trig", "trig-equations"],
      related: ["euler-formula"],
    },
    tags: ["항등식", "삼각함수", "identities", "trigonometry"],
  },
  {
    id: "inverse-trig",
    name: {
      ko: "역삼각함수",
      en: "Inverse Trigonometric Functions",
      ja: "逆三角関数",
    },
    field: "trigonometry",
    subfield: "trig-functions",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "역삼각함수는 삼각함수의 역함수로, 비율 값으로부터 각도를 구합니다. arcsin, arccos, arctan 등이 있습니다.",
        formulas: [
          {
            latex: "y = \\arcsin x \\Leftrightarrow \\sin y = x, \\quad -\\frac{\\pi}{2} \\leq y \\leq \\frac{\\pi}{2}",
            description: "아크사인의 정의",
          },
          {
            latex: "y = \\arccos x \\Leftrightarrow \\cos y = x, \\quad 0 \\leq y \\leq \\pi",
            description: "아크코사인의 정의",
          },
          {
            latex: "y = \\arctan x \\Leftrightarrow \\tan y = x, \\quad -\\frac{\\pi}{2} < y < \\frac{\\pi}{2}",
            description: "아크탄젠트의 정의",
          },
        ],
        examples: [
          {
            problem: "arcsin(1/2)를 구하세요.",
            solution: "sin(π/6) = 1/2이므로, arcsin(1/2) = π/6 (또는 30°)",
          },
          {
            problem: "arctan(1)을 구하세요.",
            solution: "tan(π/4) = 1이므로, arctan(1) = π/4 (또는 45°)",
          },
        ],
        applications: [
          { field: "물리학", description: "각도 계산, 궤적 분석" },
          { field: "공학", description: "로봇 역기구학, 제어 시스템" },
        ],
      },
      en: {
        definition:
          "Inverse trigonometric functions are the inverse functions of trigonometric functions, finding angles from ratio values. They include arcsin, arccos, and arctan.",
        formulas: [
          {
            latex: "y = \\arcsin x \\Leftrightarrow \\sin y = x, \\quad -\\frac{\\pi}{2} \\leq y \\leq \\frac{\\pi}{2}",
            description: "Definition of arcsine",
          },
          {
            latex: "y = \\arccos x \\Leftrightarrow \\cos y = x, \\quad 0 \\leq y \\leq \\pi",
            description: "Definition of arccosine",
          },
          {
            latex: "y = \\arctan x \\Leftrightarrow \\tan y = x, \\quad -\\frac{\\pi}{2} < y < \\frac{\\pi}{2}",
            description: "Definition of arctangent",
          },
        ],
        examples: [
          {
            problem: "Find arcsin(1/2).",
            solution: "Since sin(π/6) = 1/2, arcsin(1/2) = π/6 (or 30°)",
          },
          {
            problem: "Find arctan(1).",
            solution: "Since tan(π/4) = 1, arctan(1) = π/4 (or 45°)",
          },
        ],
        applications: [
          { field: "Physics", description: "Angle calculation, trajectory analysis" },
          { field: "Engineering", description: "Robot inverse kinematics, control systems" },
        ],
      },
    },
    relations: {
      prerequisites: ["sine-cosine", "tangent"],
      nextTopics: ["trig-equations"],
      related: ["inverse-function"],
    },
    tags: ["역삼각함수", "아크사인", "inverse trig", "arcsine"],
  },
  {
    id: "law-of-sines",
    name: {
      ko: "사인 법칙",
      en: "Law of Sines",
      ja: "正弦定理",
    },
    field: "trigonometry",
    subfield: "triangle-trig",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "사인 법칙은 삼각형의 각 변의 길이와 대각의 사인 값의 비가 일정함을 나타냅니다.",
        formulas: [
          {
            latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R",
            description: "사인 법칙 (R은 외접원의 반지름)",
          },
        ],
        examples: [
          {
            problem:
              "삼각형에서 A = 30°, B = 45°, a = 5일 때, b를 구하세요.",
            solution:
              "a/sin A = b/sin B에서 5/sin30° = b/sin45°, 5/(1/2) = b/(√2/2), b = 5√2",
          },
        ],
        applications: [
          { field: "측량학", description: "거리 측정, 지도 제작" },
          { field: "항해", description: "선박 위치 결정" },
        ],
      },
      en: {
        definition:
          "The Law of Sines states that the ratio of each side length to the sine of its opposite angle is constant in a triangle.",
        formulas: [
          {
            latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R",
            description: "Law of Sines (R is circumradius)",
          },
        ],
        examples: [
          {
            problem:
              "In a triangle with A = 30°, B = 45°, and a = 5, find b.",
            solution:
              "From a/sin A = b/sin B: 5/sin30° = b/sin45°, 5/(1/2) = b/(√2/2), b = 5√2",
          },
        ],
        applications: [
          { field: "Surveying", description: "Distance measurement, mapping" },
          { field: "Navigation", description: "Ship positioning" },
        ],
      },
    },
    relations: {
      prerequisites: ["sine-cosine", "triangle-basics"],
      nextTopics: ["law-of-cosines"],
      related: ["circumcircle"],
    },
    tags: ["사인법칙", "삼각형", "law of sines", "triangle"],
  },
  {
    id: "law-of-cosines",
    name: {
      ko: "코사인 법칙",
      en: "Law of Cosines",
      ja: "余弦定理",
    },
    field: "trigonometry",
    subfield: "triangle-trig",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "코사인 법칙은 삼각형의 한 변의 길이를 다른 두 변과 그 사이각을 이용해 구하는 공식입니다. 피타고라스 정리의 일반화입니다.",
        formulas: [
          {
            latex: "c^2 = a^2 + b^2 - 2ab\\cos C",
            description: "코사인 법칙",
          },
          {
            latex: "\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}",
            description: "코사인 법칙 (각도 계산용)",
          },
        ],
        examples: [
          {
            problem: "a = 5, b = 7, C = 60°일 때 c를 구하세요.",
            solution:
              "c² = 5² + 7² - 2(5)(7)cos60° = 25 + 49 - 70(1/2) = 39, c = √39",
          },
        ],
        history: {
          discoveredBy: "고대 그리스 수학자들",
          background:
            "유클리드의 원론에서 기하학적 형태로 등장했으며, 현대적 공식은 삼각법 발전과 함께 정립되었습니다.",
        },
        applications: [
          { field: "측량학", description: "삼각측량" },
          { field: "GPS", description: "위치 결정 알고리즘" },
        ],
      },
      en: {
        definition:
          "The Law of Cosines relates one side of a triangle to the other two sides and their included angle. It generalizes the Pythagorean theorem.",
        formulas: [
          {
            latex: "c^2 = a^2 + b^2 - 2ab\\cos C",
            description: "Law of Cosines",
          },
          {
            latex: "\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}",
            description: "Law of Cosines (for finding angles)",
          },
        ],
        examples: [
          {
            problem: "Find c when a = 5, b = 7, and C = 60°.",
            solution:
              "c² = 5² + 7² - 2(5)(7)cos60° = 25 + 49 - 70(1/2) = 39, c = √39",
          },
        ],
        history: {
          discoveredBy: "Ancient Greek mathematicians",
          background:
            "Appeared in geometric form in Euclid's Elements; the modern formula developed with trigonometry.",
        },
        applications: [
          { field: "Surveying", description: "Triangulation" },
          { field: "GPS", description: "Positioning algorithms" },
        ],
      },
    },
    relations: {
      prerequisites: ["pythagorean-theorem", "sine-cosine"],
      nextTopics: ["law-of-sines"],
      related: ["herons-formula"],
    },
    tags: ["코사인법칙", "삼각형", "law of cosines", "triangle"],
  },

  // ===== 4.3 역삼각함수 (Inverse Trigonometric) =====
  {
    id: "arcsin",
    name: {
      ko: "아크사인 (arcsin)",
      en: "Arcsine (arcsin)",
      ja: "アークサイン",
    },
    field: "trigonometry",
    subfield: "inverse-trig",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "아크사인(arcsin)은 사인 함수의 역함수로, 주어진 값에 대한 각도를 반환합니다. 정의역은 [-1, 1], 치역은 [-π/2, π/2]입니다.",
        formulas: [
          {
            latex: "y = \\arcsin(x) \\Leftrightarrow x = \\sin(y)",
            description: "아크사인의 정의",
          },
          {
            latex: "\\frac{d}{dx}\\arcsin(x) = \\frac{1}{\\sqrt{1-x^2}}",
            description: "아크사인의 도함수",
          },
          {
            latex: "\\arcsin(x) = \\sum_{n=0}^{\\infty} \\frac{(2n)!}{4^n(n!)^2(2n+1)}x^{2n+1}",
            description: "테일러 급수",
          },
        ],
        examples: [
          {
            problem: "arcsin(√3/2)를 구하세요.",
            solution: "sin(π/3) = √3/2이므로, arcsin(√3/2) = π/3 (60°)",
          },
        ],
        applications: [
          { field: "물리학", description: "투사체 각도 계산" },
          { field: "공학", description: "역기구학" },
        ],
      },
      en: {
        definition:
          "Arcsine (arcsin) is the inverse function of sine, returning the angle for a given value. Domain is [-1, 1], range is [-π/2, π/2].",
        formulas: [
          {
            latex: "y = \\arcsin(x) \\Leftrightarrow x = \\sin(y)",
            description: "Definition of arcsine",
          },
          {
            latex: "\\frac{d}{dx}\\arcsin(x) = \\frac{1}{\\sqrt{1-x^2}}",
            description: "Derivative of arcsine",
          },
        ],
        examples: [
          {
            problem: "Find arcsin(√3/2).",
            solution: "Since sin(π/3) = √3/2, arcsin(√3/2) = π/3 (60°)",
          },
        ],
        applications: [
          { field: "Physics", description: "Projectile angle calculation" },
          { field: "Engineering", description: "Inverse kinematics" },
        ],
      },
    },
    relations: {
      prerequisites: ["sine-cosine"],
      nextTopics: ["arccos", "arctan"],
      related: ["inverse-trig"],
    },
    tags: ["아크사인", "역삼각함수", "arcsine", "inverse trig"],
  },
  {
    id: "arccos",
    name: {
      ko: "아크코사인 (arccos)",
      en: "Arccosine (arccos)",
      ja: "アークコサイン",
    },
    field: "trigonometry",
    subfield: "inverse-trig",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "아크코사인(arccos)은 코사인 함수의 역함수입니다. 정의역은 [-1, 1], 치역은 [0, π]입니다.",
        formulas: [
          {
            latex: "y = \\arccos(x) \\Leftrightarrow x = \\cos(y)",
            description: "아크코사인의 정의",
          },
          {
            latex: "\\frac{d}{dx}\\arccos(x) = -\\frac{1}{\\sqrt{1-x^2}}",
            description: "아크코사인의 도함수",
          },
          {
            latex: "\\arcsin(x) + \\arccos(x) = \\frac{\\pi}{2}",
            description: "아크사인과 아크코사인의 관계",
          },
        ],
        examples: [
          {
            problem: "arccos(0)를 구하세요.",
            solution: "cos(π/2) = 0이므로, arccos(0) = π/2",
          },
        ],
      },
      en: {
        definition:
          "Arccosine (arccos) is the inverse function of cosine. Domain is [-1, 1], range is [0, π].",
        formulas: [
          {
            latex: "y = \\arccos(x) \\Leftrightarrow x = \\cos(y)",
            description: "Definition of arccosine",
          },
          {
            latex: "\\frac{d}{dx}\\arccos(x) = -\\frac{1}{\\sqrt{1-x^2}}",
            description: "Derivative of arccosine",
          },
        ],
        examples: [
          {
            problem: "Find arccos(0).",
            solution: "Since cos(π/2) = 0, arccos(0) = π/2",
          },
        ],
      },
    },
    relations: {
      prerequisites: ["sine-cosine"],
      nextTopics: ["arctan"],
      related: ["arcsin"],
    },
    tags: ["아크코사인", "역삼각함수", "arccosine", "inverse trig"],
  },
  {
    id: "arctan",
    name: {
      ko: "아크탄젠트 (arctan)",
      en: "Arctangent (arctan)",
      ja: "アークタンジェント",
    },
    field: "trigonometry",
    subfield: "inverse-trig",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "아크탄젠트(arctan)는 탄젠트 함수의 역함수입니다. 정의역은 (-∞, ∞), 치역은 (-π/2, π/2)입니다.",
        formulas: [
          {
            latex: "y = \\arctan(x) \\Leftrightarrow x = \\tan(y)",
            description: "아크탄젠트의 정의",
          },
          {
            latex: "\\frac{d}{dx}\\arctan(x) = \\frac{1}{1+x^2}",
            description: "아크탄젠트의 도함수",
          },
          {
            latex: "\\arctan(x) = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{2n+1}",
            description: "그레고리-라이프니츠 급수 (|x| ≤ 1)",
          },
        ],
        examples: [
          {
            problem: "arctan(1)을 구하세요.",
            solution: "tan(π/4) = 1이므로, arctan(1) = π/4",
          },
        ],
        applications: [
          { field: "컴퓨터 그래픽스", description: "atan2 함수로 각도 계산" },
          { field: "수학", description: "π의 계산 (마친 공식)" },
        ],
      },
      en: {
        definition:
          "Arctangent (arctan) is the inverse function of tangent. Domain is (-∞, ∞), range is (-π/2, π/2).",
        formulas: [
          {
            latex: "y = \\arctan(x) \\Leftrightarrow x = \\tan(y)",
            description: "Definition of arctangent",
          },
          {
            latex: "\\frac{d}{dx}\\arctan(x) = \\frac{1}{1+x^2}",
            description: "Derivative of arctangent",
          },
        ],
        examples: [
          {
            problem: "Find arctan(1).",
            solution: "Since tan(π/4) = 1, arctan(1) = π/4",
          },
        ],
        applications: [
          { field: "Computer Graphics", description: "Angle calculation using atan2" },
          { field: "Mathematics", description: "Computing π (Machin's formula)" },
        ],
      },
    },
    relations: {
      prerequisites: ["tangent"],
      nextTopics: ["hyperbolic-functions"],
      related: ["arcsin", "arccos"],
    },
    tags: ["아크탄젠트", "역삼각함수", "arctangent", "inverse trig"],
  },

  // ===== 4.4 쌍곡선 함수 (Hyperbolic Functions) =====
  {
    id: "sinh-cosh",
    name: {
      ko: "쌍곡선 사인과 코사인",
      en: "Hyperbolic Sine and Cosine",
      ja: "双曲線サインとコサイン",
    },
    field: "trigonometry",
    subfield: "hyperbolic",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "쌍곡선 함수는 지수함수로 정의되며, 쌍곡선과의 관계에서 이름이 유래했습니다. sinh와 cosh는 기본 쌍곡선 함수입니다.",
        formulas: [
          {
            latex: "\\sinh(x) = \\frac{e^x - e^{-x}}{2}",
            description: "쌍곡선 사인의 정의",
          },
          {
            latex: "\\cosh(x) = \\frac{e^x + e^{-x}}{2}",
            description: "쌍곡선 코사인의 정의",
          },
          {
            latex: "\\cosh^2(x) - \\sinh^2(x) = 1",
            description: "쌍곡선 항등식",
          },
          {
            latex: "\\frac{d}{dx}\\sinh(x) = \\cosh(x)",
            description: "sinh의 도함수",
          },
          {
            latex: "\\frac{d}{dx}\\cosh(x) = \\sinh(x)",
            description: "cosh의 도함수",
          },
        ],
        examples: [
          {
            problem: "sinh(0)과 cosh(0)을 구하세요.",
            solution:
              "sinh(0) = (e⁰ - e⁰)/2 = 0, cosh(0) = (e⁰ + e⁰)/2 = 1",
          },
        ],
        history: {
          discoveredBy: "빈센초 리카티",
          year: "1757",
          background:
            "쌍곡선 함수는 원과 쌍곡선의 기하학적 유사성에서 발견되었습니다.",
        },
        applications: [
          { field: "물리학", description: "현수선(catenary) 곡선" },
          { field: "특수 상대성", description: "속도 덧셈 공식" },
          { field: "공학", description: "전송선 이론" },
        ],
      },
      en: {
        definition:
          "Hyperbolic functions are defined using exponential functions and named for their relationship to hyperbolas. sinh and cosh are the basic hyperbolic functions.",
        formulas: [
          {
            latex: "\\sinh(x) = \\frac{e^x - e^{-x}}{2}",
            description: "Definition of hyperbolic sine",
          },
          {
            latex: "\\cosh(x) = \\frac{e^x + e^{-x}}{2}",
            description: "Definition of hyperbolic cosine",
          },
          {
            latex: "\\cosh^2(x) - \\sinh^2(x) = 1",
            description: "Hyperbolic identity",
          },
        ],
        examples: [
          {
            problem: "Find sinh(0) and cosh(0).",
            solution: "sinh(0) = (e⁰ - e⁰)/2 = 0, cosh(0) = (e⁰ + e⁰)/2 = 1",
          },
        ],
        history: {
          discoveredBy: "Vincenzo Riccati",
          year: "1757",
          background:
            "Hyperbolic functions were discovered from geometric analogies between circles and hyperbolas.",
        },
        applications: [
          { field: "Physics", description: "Catenary curve" },
          { field: "Special Relativity", description: "Velocity addition" },
          { field: "Engineering", description: "Transmission line theory" },
        ],
      },
    },
    relations: {
      prerequisites: ["exponential-logarithm"],
      nextTopics: ["tanh", "inverse-hyperbolic"],
      related: ["sine-cosine", "euler-formula"],
    },
    tags: ["쌍곡선함수", "sinh", "cosh", "hyperbolic"],
  },
  {
    id: "tanh",
    name: {
      ko: "쌍곡선 탄젠트 (tanh)",
      en: "Hyperbolic Tangent (tanh)",
      ja: "双曲線タンジェント",
    },
    field: "trigonometry",
    subfield: "hyperbolic",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "쌍곡선 탄젠트(tanh)는 sinh를 cosh로 나눈 함수입니다. 값의 범위는 (-1, 1)입니다.",
        formulas: [
          {
            latex: "\\tanh(x) = \\frac{\\sinh(x)}{\\cosh(x)} = \\frac{e^x - e^{-x}}{e^x + e^{-x}}",
            description: "쌍곡선 탄젠트의 정의",
          },
          {
            latex: "\\frac{d}{dx}\\tanh(x) = \\text{sech}^2(x) = 1 - \\tanh^2(x)",
            description: "tanh의 도함수",
          },
          {
            latex: "\\lim_{x \\to \\pm\\infty} \\tanh(x) = \\pm 1",
            description: "점근선",
          },
        ],
        examples: [
          {
            problem: "tanh(0)을 구하세요.",
            solution: "tanh(0) = sinh(0)/cosh(0) = 0/1 = 0",
          },
        ],
        applications: [
          { field: "머신러닝", description: "활성화 함수" },
          { field: "신호 처리", description: "시그모이드 형태의 변환" },
          { field: "통계학", description: "피셔 z-변환" },
        ],
      },
      en: {
        definition:
          "Hyperbolic tangent (tanh) is sinh divided by cosh. Its range is (-1, 1).",
        formulas: [
          {
            latex: "\\tanh(x) = \\frac{\\sinh(x)}{\\cosh(x)} = \\frac{e^x - e^{-x}}{e^x + e^{-x}}",
            description: "Definition of hyperbolic tangent",
          },
          {
            latex: "\\frac{d}{dx}\\tanh(x) = \\text{sech}^2(x) = 1 - \\tanh^2(x)",
            description: "Derivative of tanh",
          },
        ],
        examples: [
          {
            problem: "Find tanh(0).",
            solution: "tanh(0) = sinh(0)/cosh(0) = 0/1 = 0",
          },
        ],
        applications: [
          { field: "Machine Learning", description: "Activation function" },
          { field: "Signal Processing", description: "Sigmoid-like transformation" },
          { field: "Statistics", description: "Fisher z-transformation" },
        ],
      },
    },
    relations: {
      prerequisites: ["sinh-cosh"],
      nextTopics: ["inverse-hyperbolic"],
      related: ["tangent", "sigmoid"],
    },
    tags: ["쌍곡선탄젠트", "tanh", "hyperbolic tangent"],
  },
  {
    id: "inverse-hyperbolic",
    name: {
      ko: "역쌍곡선 함수",
      en: "Inverse Hyperbolic Functions",
      ja: "逆双曲線関数",
    },
    field: "trigonometry",
    subfield: "hyperbolic",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "역쌍곡선 함수는 쌍곡선 함수의 역함수입니다. 자연로그로 표현될 수 있습니다.",
        formulas: [
          {
            latex: "\\text{arsinh}(x) = \\ln(x + \\sqrt{x^2 + 1})",
            description: "역쌍곡선 사인",
          },
          {
            latex: "\\text{arcosh}(x) = \\ln(x + \\sqrt{x^2 - 1}), \\quad x \\geq 1",
            description: "역쌍곡선 코사인",
          },
          {
            latex: "\\text{artanh}(x) = \\frac{1}{2}\\ln\\left(\\frac{1+x}{1-x}\\right), \\quad |x| < 1",
            description: "역쌍곡선 탄젠트",
          },
        ],
        examples: [
          {
            problem: "arsinh(0)을 구하세요.",
            solution: "arsinh(0) = ln(0 + √(0 + 1)) = ln(1) = 0",
          },
        ],
        applications: [
          { field: "적분", description: "특정 적분의 해" },
          { field: "물리학", description: "상대론적 속도 변환" },
        ],
      },
      en: {
        definition:
          "Inverse hyperbolic functions are the inverses of hyperbolic functions. They can be expressed using natural logarithms.",
        formulas: [
          {
            latex: "\\text{arsinh}(x) = \\ln(x + \\sqrt{x^2 + 1})",
            description: "Inverse hyperbolic sine",
          },
          {
            latex: "\\text{arcosh}(x) = \\ln(x + \\sqrt{x^2 - 1}), \\quad x \\geq 1",
            description: "Inverse hyperbolic cosine",
          },
          {
            latex: "\\text{artanh}(x) = \\frac{1}{2}\\ln\\left(\\frac{1+x}{1-x}\\right), \\quad |x| < 1",
            description: "Inverse hyperbolic tangent",
          },
        ],
        examples: [
          {
            problem: "Find arsinh(0).",
            solution: "arsinh(0) = ln(0 + √(0 + 1)) = ln(1) = 0",
          },
        ],
        applications: [
          { field: "Integration", description: "Solutions to certain integrals" },
          { field: "Physics", description: "Relativistic velocity transformation" },
        ],
      },
    },
    relations: {
      prerequisites: ["sinh-cosh", "natural-logarithm"],
      nextTopics: [],
      related: ["inverse-trig"],
    },
    tags: ["역쌍곡선함수", "arsinh", "inverse hyperbolic"],
  },

  // ===== 추가 삼각 개념 =====
  {
    id: "trig-graphs",
    name: {
      ko: "삼각함수 그래프",
      en: "Trigonometric Graphs",
      ja: "三角関数のグラフ",
    },
    field: "trigonometry",
    subfield: "trig-functions",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "삼각함수의 그래프는 주기적인 파동 형태를 보입니다. 진폭, 주기, 위상 변이로 특성화됩니다.",
        formulas: [
          {
            latex: "y = A\\sin(Bx + C) + D",
            description: "일반적인 사인 함수",
          },
          {
            latex: "\\text{진폭} = |A|, \\quad \\text{주기} = \\frac{2\\pi}{|B|}",
            description: "진폭과 주기",
          },
          {
            latex: "\\text{위상 변이} = -\\frac{C}{B}, \\quad \\text{수직 이동} = D",
            description: "위상과 수직 이동",
          },
        ],
        examples: [
          {
            problem: "y = 3sin(2x)의 진폭과 주기를 구하세요.",
            solution: "진폭 = 3, 주기 = 2π/2 = π",
          },
        ],
        applications: [
          { field: "물리학", description: "파동 분석" },
          { field: "음향학", description: "소리 파형" },
          { field: "전자공학", description: "AC 회로 분석" },
        ],
      },
      en: {
        definition:
          "Trigonometric graphs show periodic wave patterns. They are characterized by amplitude, period, and phase shift.",
        formulas: [
          {
            latex: "y = A\\sin(Bx + C) + D",
            description: "General sine function",
          },
          {
            latex: "\\text{Amplitude} = |A|, \\quad \\text{Period} = \\frac{2\\pi}{|B|}",
            description: "Amplitude and period",
          },
        ],
        examples: [
          {
            problem: "Find the amplitude and period of y = 3sin(2x).",
            solution: "Amplitude = 3, Period = 2π/2 = π",
          },
        ],
        applications: [
          { field: "Physics", description: "Wave analysis" },
          { field: "Acoustics", description: "Sound waveforms" },
          { field: "Electronics", description: "AC circuit analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["sine-cosine"],
      nextTopics: ["fourier-series"],
      related: ["periodic-functions"],
    },
    tags: ["삼각함수그래프", "주기함수", "trig graphs", "periodic"],
  },
  {
    id: "half-angle",
    name: {
      ko: "반각 공식",
      en: "Half-Angle Formulas",
      ja: "半角公式",
    },
    field: "trigonometry",
    subfield: "trig-identities",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "반각 공식은 각도의 절반에 대한 삼각함수 값을 원래 각도로 표현합니다.",
        formulas: [
          {
            latex: "\\sin\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1 - \\cos\\theta}{2}}",
            description: "사인의 반각 공식",
          },
          {
            latex: "\\cos\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1 + \\cos\\theta}{2}}",
            description: "코사인의 반각 공식",
          },
          {
            latex: "\\tan\\frac{\\theta}{2} = \\frac{1 - \\cos\\theta}{\\sin\\theta} = \\frac{\\sin\\theta}{1 + \\cos\\theta}",
            description: "탄젠트의 반각 공식",
          },
        ],
        examples: [
          {
            problem: "cos(15°)를 반각 공식으로 구하세요.",
            solution:
              "cos(15°) = cos(30°/2) = √((1 + cos30°)/2) = √((1 + √3/2)/2) = √((2 + √3)/4)",
          },
        ],
      },
      en: {
        definition:
          "Half-angle formulas express trigonometric functions of half an angle in terms of the original angle.",
        formulas: [
          {
            latex: "\\sin\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1 - \\cos\\theta}{2}}",
            description: "Half-angle formula for sine",
          },
          {
            latex: "\\cos\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1 + \\cos\\theta}{2}}",
            description: "Half-angle formula for cosine",
          },
        ],
        examples: [
          {
            problem: "Find cos(15°) using half-angle formula.",
            solution:
              "cos(15°) = cos(30°/2) = √((1 + cos30°)/2) = √((1 + √3/2)/2) = √((2 + √3)/4)",
          },
        ],
      },
    },
    relations: {
      prerequisites: ["trig-identities"],
      nextTopics: ["double-angle"],
      related: ["power-reduction"],
    },
    tags: ["반각공식", "삼각항등식", "half-angle", "trig identities"],
  },
  {
    id: "product-sum",
    name: {
      ko: "곱을 합으로 바꾸는 공식",
      en: "Product-to-Sum Formulas",
      ja: "積和公式",
    },
    field: "trigonometry",
    subfield: "trig-identities",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "곱을 합으로 바꾸는 공식은 삼각함수의 곱을 합이나 차로 변환합니다.",
        formulas: [
          {
            latex: "\\sin A \\cos B = \\frac{1}{2}[\\sin(A+B) + \\sin(A-B)]",
            description: "sin × cos",
          },
          {
            latex: "\\cos A \\cos B = \\frac{1}{2}[\\cos(A-B) + \\cos(A+B)]",
            description: "cos × cos",
          },
          {
            latex: "\\sin A \\sin B = \\frac{1}{2}[\\cos(A-B) - \\cos(A+B)]",
            description: "sin × sin",
          },
        ],
        examples: [
          {
            problem: "sin(3x)cos(x)를 합으로 바꾸세요.",
            solution: "sin(3x)cos(x) = ½[sin(4x) + sin(2x)]",
          },
        ],
        applications: [
          { field: "적분", description: "삼각함수 적분 간소화" },
          { field: "신호 처리", description: "주파수 변조" },
        ],
      },
      en: {
        definition:
          "Product-to-sum formulas convert products of trigonometric functions into sums or differences.",
        formulas: [
          {
            latex: "\\sin A \\cos B = \\frac{1}{2}[\\sin(A+B) + \\sin(A-B)]",
            description: "sin × cos",
          },
          {
            latex: "\\cos A \\cos B = \\frac{1}{2}[\\cos(A-B) + \\cos(A+B)]",
            description: "cos × cos",
          },
        ],
        examples: [
          {
            problem: "Convert sin(3x)cos(x) to a sum.",
            solution: "sin(3x)cos(x) = ½[sin(4x) + sin(2x)]",
          },
        ],
        applications: [
          { field: "Integration", description: "Simplifying trig integrals" },
          { field: "Signal Processing", description: "Frequency modulation" },
        ],
      },
    },
    relations: {
      prerequisites: ["trig-identities"],
      nextTopics: ["fourier-series"],
      related: ["sum-to-product"],
    },
    tags: ["적화공식", "삼각항등식", "product-to-sum", "trig identities"],
  },
];
