/**
 * @fileoverview 위상수학 개념 데이터
 */
import type { MathConcept } from "../types";

export const topologyConcepts: MathConcept[] = [
  {
    id: "topological-space",
    name: {
      ko: "위상공간",
      en: "Topological Space",
      ja: "位相空間",
    },
    field: "topology",
    subfield: "general-topology",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "위상공간은 집합과 그 위에 정의된 열린 집합들의 모임(위상)으로 이루어진 구조입니다. 연속성, 수렴, 연결성 등을 정의할 수 있게 합니다.",
        formulas: [
          {
            latex: "\\emptyset, X \\in \\tau",
            description: "공집합과 전체집합은 열린집합",
          },
          {
            latex: "\\bigcup_{\\alpha} U_\\alpha \\in \\tau",
            description: "열린집합의 임의의 합집합은 열린집합",
          },
          {
            latex: "U_1 \\cap U_2 \\in \\tau",
            description: "열린집합의 유한 교집합은 열린집합",
          },
        ],
        examples: [
          {
            problem: "실수 직선 ℝ에서 열린 구간이 열린집합임을 설명하세요.",
            solution:
              "표준 위상에서 (a,b)는 열린집합입니다. 모든 점 x ∈ (a,b)에 대해 x를 포함하는 열린 구간이 (a,b) 안에 있기 때문입니다.",
          },
        ],
        history: {
          discoveredBy: "펠릭스 하우스도르프",
          year: "1914년",
          background:
            "하우스도르프가 위상공간의 공리적 정의를 제시했습니다.",
        },
        applications: [
          { field: "해석학", description: "연속함수의 일반화" },
          { field: "대수기하학", description: "다양체의 정의" },
          { field: "양자역학", description: "힐베르트 공간" },
        ],
      },
      en: {
        definition:
          "A topological space is a structure consisting of a set and a collection of open sets (topology). It allows defining continuity, convergence, and connectedness.",
        formulas: [
          {
            latex: "\\emptyset, X \\in \\tau",
            description: "Empty set and whole set are open",
          },
          {
            latex: "\\bigcup_{\\alpha} U_\\alpha \\in \\tau",
            description: "Arbitrary union of open sets is open",
          },
          {
            latex: "U_1 \\cap U_2 \\in \\tau",
            description: "Finite intersection of open sets is open",
          },
        ],
        examples: [
          {
            problem: "Explain why open intervals are open sets in ℝ.",
            solution:
              "In standard topology, (a,b) is open because for every x ∈ (a,b), there exists an open interval containing x within (a,b).",
          },
        ],
        history: {
          discoveredBy: "Felix Hausdorff",
          year: "1914",
          background:
            "Hausdorff gave the axiomatic definition of topological spaces.",
        },
        applications: [
          { field: "Analysis", description: "Generalization of continuous functions" },
          { field: "Algebraic Geometry", description: "Definition of manifolds" },
          { field: "Quantum Mechanics", description: "Hilbert spaces" },
        ],
      },
    },
    relations: {
      prerequisites: ["sets", "real-analysis"],
      nextTopics: ["continuity-topology", "compactness"],
      related: ["metric-space"],
    },
    tags: ["위상공간", "열린집합", "topological space", "open set"],
  },
  {
    id: "continuity-topology",
    name: {
      ko: "연속성 (위상적)",
      en: "Continuity (Topological)",
      ja: "連続性",
    },
    field: "topology",
    subfield: "general-topology",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "위상공간 사이의 함수 f: X → Y가 연속이라는 것은 Y의 모든 열린집합의 역상이 X에서 열린집합인 것입니다.",
        formulas: [
          {
            latex: "f^{-1}(V) \\in \\tau_X \\text{ for all } V \\in \\tau_Y",
            description: "연속의 위상적 정의",
          },
        ],
        examples: [
          {
            problem: "상수함수가 연속임을 보이세요.",
            solution:
              "f(x) = c일 때, 열린집합 V의 역상은 c ∈ V이면 X 전체, c ∉ V이면 공집합입니다. 둘 다 열린집합입니다.",
          },
        ],
        applications: [
          { field: "해석학", description: "ε-δ 연속성의 일반화" },
          { field: "위상적 성질", description: "연속 변환 하에서 보존되는 성질" },
        ],
      },
      en: {
        definition:
          "A function f: X → Y between topological spaces is continuous if the preimage of every open set in Y is open in X.",
        formulas: [
          {
            latex: "f^{-1}(V) \\in \\tau_X \\text{ for all } V \\in \\tau_Y",
            description: "Topological definition of continuity",
          },
        ],
        examples: [
          {
            problem: "Show that constant functions are continuous.",
            solution:
              "For f(x) = c, preimage of open V is X if c ∈ V, or ∅ if c ∉ V. Both are open.",
          },
        ],
        applications: [
          { field: "Analysis", description: "Generalization of ε-δ continuity" },
          { field: "Topological Properties", description: "Properties preserved under continuous maps" },
        ],
      },
    },
    relations: {
      prerequisites: ["topological-space", "function"],
      nextTopics: ["homeomorphism", "compactness"],
      related: ["limits"],
    },
    tags: ["연속", "위상", "continuity", "topology"],
  },
  {
    id: "homeomorphism",
    name: {
      ko: "위상동형사상",
      en: "Homeomorphism",
      ja: "同相写像",
    },
    field: "topology",
    subfield: "general-topology",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "위상동형사상은 연속이고 역함수도 연속인 전단사 함수입니다. 위상동형인 공간은 위상적으로 같은 것으로 봅니다.",
        formulas: [
          {
            latex: "f: X \\to Y \\text{ homeomorphism} \\Leftrightarrow f, f^{-1} \\text{ continuous bijection}",
            description: "위상동형사상의 정의",
          },
        ],
        examples: [
          {
            problem: "구와 정육면체가 위상동형임을 설명하세요.",
            solution:
              "구를 연속적으로 변형하여 정육면체로 만들 수 있습니다(자르거나 붙이지 않고). 둘 다 종수 0인 닫힌 곡면입니다.",
          },
          {
            problem: "원과 직선이 위상동형이 아님을 설명하세요.",
            solution:
              "원에서 한 점을 제거하면 연결되지만, 직선에서 한 점을 제거하면 두 조각으로 나뉩니다.",
          },
        ],
        applications: [
          { field: "분류 문제", description: "위상공간의 분류" },
          { field: "물리학", description: "상전이, 위상적 결함" },
        ],
      },
      en: {
        definition:
          "A homeomorphism is a continuous bijection with a continuous inverse. Homeomorphic spaces are topologically identical.",
        formulas: [
          {
            latex: "f: X \\to Y \\text{ homeomorphism} \\Leftrightarrow f, f^{-1} \\text{ continuous bijection}",
            description: "Definition of homeomorphism",
          },
        ],
        examples: [
          {
            problem: "Explain why a sphere and cube are homeomorphic.",
            solution:
              "A sphere can be continuously deformed into a cube (without cutting or gluing). Both are closed surfaces of genus 0.",
          },
          {
            problem: "Explain why a circle and line are not homeomorphic.",
            solution:
              "Removing a point from a circle leaves it connected, but removing a point from a line disconnects it.",
          },
        ],
        applications: [
          { field: "Classification", description: "Classification of spaces" },
          { field: "Physics", description: "Phase transitions, topological defects" },
        ],
      },
    },
    relations: {
      prerequisites: ["continuity-topology", "bijection"],
      nextTopics: ["fundamental-group", "manifolds"],
      related: ["isomorphism"],
    },
    tags: ["위상동형", "연속", "homeomorphism", "topology"],
  },
  {
    id: "compactness",
    name: {
      ko: "컴팩트성",
      en: "Compactness",
      ja: "コンパクト性",
    },
    field: "topology",
    subfield: "general-topology",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "위상공간이 컴팩트하다는 것은 모든 열린 덮개가 유한 부분덮개를 가진다는 것입니다. ℝⁿ에서는 닫혀 있고 유계인 것과 동치입니다.",
        formulas: [
          {
            latex: "X = \\bigcup_{\\alpha} U_\\alpha \\Rightarrow X = \\bigcup_{i=1}^{n} U_{\\alpha_i}",
            description: "컴팩트성의 정의",
          },
        ],
        examples: [
          {
            problem: "[0, 1]이 컴팩트함을 하이네-보렐 정리로 설명하세요.",
            solution:
              "[0, 1]은 닫혀 있고 유계이므로 하이네-보렐 정리에 의해 컴팩트합니다.",
          },
          {
            problem: "(0, 1)이 컴팩트하지 않음을 보이세요.",
            solution:
              "열린 덮개 {(1/n, 1) : n ≥ 2}는 유한 부분덮개가 없습니다.",
          },
        ],
        applications: [
          { field: "해석학", description: "연속함수의 최대최소 존재" },
          { field: "함수해석학", description: "컴팩트 연산자" },
        ],
      },
      en: {
        definition:
          "A space is compact if every open cover has a finite subcover. In ℝⁿ, this is equivalent to being closed and bounded.",
        formulas: [
          {
            latex: "X = \\bigcup_{\\alpha} U_\\alpha \\Rightarrow X = \\bigcup_{i=1}^{n} U_{\\alpha_i}",
            description: "Definition of compactness",
          },
        ],
        examples: [
          {
            problem: "Explain why [0, 1] is compact using Heine-Borel.",
            solution:
              "[0, 1] is closed and bounded, so by Heine-Borel theorem it's compact.",
          },
          {
            problem: "Show (0, 1) is not compact.",
            solution:
              "The open cover {(1/n, 1) : n ≥ 2} has no finite subcover.",
          },
        ],
        applications: [
          { field: "Analysis", description: "Existence of max/min of continuous functions" },
          { field: "Functional Analysis", description: "Compact operators" },
        ],
      },
    },
    relations: {
      prerequisites: ["topological-space"],
      nextTopics: ["heine-borel", "sequential-compactness"],
      related: ["completeness"],
    },
    tags: ["컴팩트", "열린덮개", "compact", "open cover"],
  },
  {
    id: "connectedness",
    name: {
      ko: "연결성",
      en: "Connectedness",
      ja: "連結性",
    },
    field: "topology",
    subfield: "general-topology",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "위상공간이 연결되었다는 것은 두 개의 서로소인 비어있지 않은 열린집합으로 분리될 수 없다는 것입니다.",
        formulas: [
          {
            latex: "X \\neq U \\cup V \\text{ for disjoint nonempty open } U, V",
            description: "연결성의 정의",
          },
        ],
        examples: [
          {
            problem: "실수 직선 ℝ이 연결됨을 설명하세요.",
            solution:
              "ℝ을 두 서로소 열린집합으로 나눌 수 없습니다. 중간값 정리가 이를 보장합니다.",
          },
          {
            problem: "ℚ (유리수)가 연결되지 않음을 보이세요.",
            solution:
              "ℚ = (ℚ ∩ (-∞, √2)) ∪ (ℚ ∩ (√2, ∞))로 나뉩니다.",
          },
        ],
        applications: [
          { field: "해석학", description: "중간값 정리" },
          { field: "그래프 이론", description: "연결 그래프" },
        ],
      },
      en: {
        definition:
          "A topological space is connected if it cannot be separated into two disjoint nonempty open sets.",
        formulas: [
          {
            latex: "X \\neq U \\cup V \\text{ for disjoint nonempty open } U, V",
            description: "Definition of connectedness",
          },
        ],
        examples: [
          {
            problem: "Explain why ℝ is connected.",
            solution:
              "ℝ cannot be split into two disjoint open sets. The intermediate value theorem ensures this.",
          },
          {
            problem: "Show ℚ is not connected.",
            solution:
              "ℚ = (ℚ ∩ (-∞, √2)) ∪ (ℚ ∩ (√2, ∞)) gives a separation.",
          },
        ],
        applications: [
          { field: "Analysis", description: "Intermediate value theorem" },
          { field: "Graph Theory", description: "Connected graphs" },
        ],
      },
    },
    relations: {
      prerequisites: ["topological-space"],
      nextTopics: ["path-connectedness", "components"],
      related: ["intermediate-value-theorem"],
    },
    tags: ["연결", "위상", "connected", "topology"],
  },
  {
    id: "euler-characteristic",
    name: {
      ko: "오일러 지표",
      en: "Euler Characteristic",
      ja: "オイラー標数",
    },
    field: "topology",
    subfield: "algebraic-topology",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "오일러 지표는 위상공간의 위상불변량으로, 다면체의 경우 꼭짓점 - 모서리 + 면으로 계산됩니다.",
        formulas: [
          {
            latex: "\\chi = V - E + F",
            description: "다면체의 오일러 공식",
          },
          {
            latex: "\\chi(S^2) = 2, \\quad \\chi(T^2) = 0",
            description: "구와 토러스의 오일러 지표",
          },
          {
            latex: "\\chi = 2 - 2g",
            description: "종수 g인 곡면의 오일러 지표",
          },
        ],
        examples: [
          {
            problem: "정육면체의 오일러 지표를 계산하세요.",
            solution: "V=8, E=12, F=6이므로 χ = 8 - 12 + 6 = 2",
          },
          {
            problem: "도넛(토러스)의 오일러 지표는?",
            solution: "토러스는 종수 1이므로 χ = 2 - 2(1) = 0",
          },
        ],
        history: {
          discoveredBy: "레온하르트 오일러",
          year: "1752년",
          background:
            "오일러가 다면체에 대해 V - E + F = 2를 발견했습니다.",
        },
        applications: [
          { field: "기하학", description: "곡면 분류" },
          { field: "컴퓨터 그래픽스", description: "메시 검증" },
          { field: "분자화학", description: "분자 구조 분석" },
        ],
      },
      en: {
        definition:
          "The Euler characteristic is a topological invariant, calculated for polyhedra as vertices - edges + faces.",
        formulas: [
          {
            latex: "\\chi = V - E + F",
            description: "Euler's formula for polyhedra",
          },
          {
            latex: "\\chi(S^2) = 2, \\quad \\chi(T^2) = 0",
            description: "Euler characteristic of sphere and torus",
          },
          {
            latex: "\\chi = 2 - 2g",
            description: "Euler characteristic of genus g surface",
          },
        ],
        examples: [
          {
            problem: "Calculate the Euler characteristic of a cube.",
            solution: "V=8, E=12, F=6, so χ = 8 - 12 + 6 = 2",
          },
          {
            problem: "What is the Euler characteristic of a torus?",
            solution: "A torus has genus 1, so χ = 2 - 2(1) = 0",
          },
        ],
        history: {
          discoveredBy: "Leonhard Euler",
          year: "1752",
          background:
            "Euler discovered V - E + F = 2 for polyhedra.",
        },
        applications: [
          { field: "Geometry", description: "Surface classification" },
          { field: "Computer Graphics", description: "Mesh validation" },
          { field: "Chemistry", description: "Molecular structure analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["graph-theory"],
      nextTopics: ["genus", "homology"],
      related: ["polyhedra"],
    },
    tags: ["오일러", "위상불변량", "Euler", "characteristic"],
  },

  // ===== 10.4 대수적 위상수학 (Algebraic Topology) =====
  {
    id: "fundamental-group",
    name: {
      ko: "기본군",
      en: "Fundamental Group",
      ja: "基本群",
    },
    field: "topology",
    subfield: "algebraic-topology",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "기본군 π₁(X)은 공간 X의 기저점에서 시작하고 끝나는 루프들의 동치류로 이루어진 군입니다. 공간의 '구멍'을 대수적으로 측정합니다.",
        formulas: [
          {
            latex: "\\pi_1(S^1) \\cong \\mathbb{Z}",
            description: "원의 기본군은 정수군",
          },
          {
            latex: "\\pi_1(S^n) = 0 \\text{ for } n \\geq 2",
            description: "2차원 이상 구의 기본군은 자명",
          },
          {
            latex: "\\pi_1(T^2) \\cong \\mathbb{Z} \\times \\mathbb{Z}",
            description: "토러스의 기본군",
          },
        ],
        examples: [
          {
            problem: "원 S¹의 기본군이 ℤ임을 직관적으로 설명하세요.",
            solution:
              "원을 n바퀴 감는 루프는 서로 다른 동치류를 나타냅니다. 반시계방향은 양수, 시계방향은 음수로 정수에 대응됩니다.",
          },
        ],
        history: {
          discoveredBy: "앙리 푸앵카레",
          year: "1895년",
          background:
            "푸앵카레가 위상수학의 대수화를 시작하며 기본군을 도입했습니다.",
        },
        applications: [
          { field: "위상수학", description: "공간 분류" },
          { field: "물리학", description: "양자장론의 위상" },
          { field: "로봇공학", description: "경로 계획" },
        ],
      },
      en: {
        definition:
          "The fundamental group π₁(X) consists of equivalence classes of loops starting and ending at a base point. It measures 'holes' algebraically.",
        formulas: [
          {
            latex: "\\pi_1(S^1) \\cong \\mathbb{Z}",
            description: "Circle's fundamental group is integers",
          },
          {
            latex: "\\pi_1(S^n) = 0 \\text{ for } n \\geq 2",
            description: "Higher spheres have trivial π₁",
          },
        ],
        examples: [
          {
            problem: "Intuitively explain why π₁(S¹) ≅ ℤ.",
            solution:
              "A loop wrapping n times around the circle represents a different class. Counterclockwise is positive, clockwise negative, corresponding to integers.",
          },
        ],
        history: {
          discoveredBy: "Henri Poincaré",
          year: "1895",
          background:
            "Poincaré introduced the fundamental group, beginning algebraic topology.",
        },
        applications: [
          { field: "Topology", description: "Space classification" },
          { field: "Physics", description: "Topology in QFT" },
          { field: "Robotics", description: "Path planning" },
        ],
      },
    },
    relations: {
      prerequisites: ["homeomorphism", "group-theory"],
      nextTopics: ["homology", "covering-spaces"],
      related: ["homotopy"],
    },
    tags: ["기본군", "루프", "fundamental group", "homotopy"],
  },
  {
    id: "metric-space",
    name: {
      ko: "거리공간",
      en: "Metric Space",
      ja: "距離空間",
    },
    field: "topology",
    subfield: "general-topology",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "거리공간은 거리함수(메트릭)가 정의된 집합입니다. 위상공간의 중요한 예로, 거리에서 위상이 유도됩니다.",
        formulas: [
          {
            latex: "d(x, y) \\geq 0 \\text{ (비음성)}",
            description: "거리는 항상 0 이상",
          },
          {
            latex: "d(x, y) = 0 \\Leftrightarrow x = y",
            description: "동일성",
          },
          {
            latex: "d(x, y) = d(y, x)",
            description: "대칭성",
          },
          {
            latex: "d(x, z) \\leq d(x, y) + d(y, z)",
            description: "삼각부등식",
          },
        ],
        examples: [
          {
            problem: "유클리드 거리가 메트릭 공리를 만족함을 확인하세요.",
            solution:
              "d(x,y) = √((x₁-y₁)² + ...) ≥ 0 ✓, d(x,x) = 0 ✓, 대칭 ✓, 삼각부등식은 민코프스키 부등식에서 유도 ✓",
          },
        ],
        applications: [
          { field: "해석학", description: "수렴, 완비성 정의" },
          { field: "컴퓨터 과학", description: "최근접 이웃 탐색" },
          { field: "기계학습", description: "거리 기반 분류" },
        ],
      },
      en: {
        definition:
          "A metric space is a set with a distance function (metric). An important example of topological spaces where topology is induced by the metric.",
        formulas: [
          {
            latex: "d(x, y) \\geq 0",
            description: "Non-negativity",
          },
          {
            latex: "d(x, y) = 0 \\Leftrightarrow x = y",
            description: "Identity",
          },
          {
            latex: "d(x, y) = d(y, x)",
            description: "Symmetry",
          },
          {
            latex: "d(x, z) \\leq d(x, y) + d(y, z)",
            description: "Triangle inequality",
          },
        ],
        examples: [
          {
            problem: "Verify Euclidean distance satisfies metric axioms.",
            solution:
              "d(x,y) = √((x₁-y₁)² + ...) ≥ 0 ✓, d(x,x) = 0 ✓, symmetric ✓, triangle inequality from Minkowski ✓",
          },
        ],
        applications: [
          { field: "Analysis", description: "Convergence, completeness" },
          { field: "Computer Science", description: "Nearest neighbor search" },
          { field: "Machine Learning", description: "Distance-based classification" },
        ],
      },
    },
    relations: {
      prerequisites: ["real-numbers"],
      nextTopics: ["topological-space", "completeness"],
      related: ["normed-space"],
    },
    tags: ["거리공간", "메트릭", "metric space", "distance"],
  },

  // ===== 10.5 호모토피와 피복공간 =====
  {
    id: "homotopy",
    name: {
      ko: "호모토피",
      en: "Homotopy",
      ja: "ホモトピー",
    },
    field: "topology",
    subfield: "algebraic-topology",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "두 연속함수 f, g: X → Y가 호모토픽하다는 것은 f를 g로 연속적으로 변형할 수 있다는 것입니다. 이 관계는 동치관계이며 위상적 성질을 연구하는 데 핵심적입니다.",
        formulas: [
          {
            latex: "H: X \\times [0,1] \\to Y, \\quad H(x,0) = f(x), \\quad H(x,1) = g(x)",
            description: "호모토피의 정의",
          },
          {
            latex: "f \\simeq g \\text{ (f와 g는 호모토픽)}",
            description: "호모토피 동치 표기",
          },
        ],
        examples: [
          {
            problem: "ℝ²에서 원점을 제외한 두 루프가 호모토픽이 아님을 설명하세요.",
            solution:
              "원점을 한 번 감는 루프와 감지 않는 루프는 연속 변형으로 서로 변환 불가능합니다. 기본군이 다른 원소를 나타냅니다.",
          },
        ],
        applications: [
          { field: "위상수학", description: "공간 분류" },
          { field: "로봇공학", description: "경로 동치성" },
          { field: "물리학", description: "양자장론의 위상" },
        ],
      },
      en: {
        definition:
          "Two continuous functions f, g: X → Y are homotopic if f can be continuously deformed into g. This equivalence relation is fundamental for studying topological properties.",
        formulas: [
          {
            latex: "H: X \\times [0,1] \\to Y, \\quad H(x,0) = f(x), \\quad H(x,1) = g(x)",
            description: "Definition of homotopy",
          },
          {
            latex: "f \\simeq g \\text{ (f and g are homotopic)}",
            description: "Homotopy equivalence notation",
          },
        ],
        examples: [
          {
            problem: "Explain why two loops in ℝ² minus origin may not be homotopic.",
            solution:
              "A loop winding once around origin cannot be continuously deformed to one not winding. They represent different elements in the fundamental group.",
          },
        ],
        applications: [
          { field: "Topology", description: "Space classification" },
          { field: "Robotics", description: "Path equivalence" },
          { field: "Physics", description: "Topology in QFT" },
        ],
      },
    },
    relations: {
      prerequisites: ["continuity-topology", "fundamental-group"],
      nextTopics: ["homology", "homotopy-groups"],
      related: ["path-connectedness"],
    },
    tags: ["호모토피", "연속변형", "homotopy", "deformation"],
  },
  {
    id: "covering-space",
    name: {
      ko: "피복공간",
      en: "Covering Space",
      ja: "被覆空間",
    },
    field: "topology",
    subfield: "algebraic-topology",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "피복공간은 국소적으로 저공간과 동형인 공간입니다. 피복사상 p: E → B는 각 점의 근방이 E에서 서로소 열린집합들의 합집합으로 균등하게 덮입니다.",
        formulas: [
          {
            latex: "p^{-1}(U) = \\bigsqcup_{\\alpha} V_\\alpha",
            description: "균등 피복 조건",
          },
          {
            latex: "\\mathbb{R} \\xrightarrow{p} S^1, \\quad p(t) = e^{2\\pi it}",
            description: "실수직선이 원의 보편피복",
          },
        ],
        examples: [
          {
            problem: "ℝ이 S¹의 피복공간임을 설명하세요.",
            solution:
              "p(t) = e^{2πit}는 ℝ을 S¹ 위로 사상합니다. S¹의 각 점 근방은 ℝ에서 무한히 많은 구간들로 덮입니다.",
          },
        ],
        applications: [
          { field: "위상수학", description: "기본군 계산" },
          { field: "복소해석", description: "다가함수의 리만면" },
          { field: "물리학", description: "게이지 이론" },
        ],
      },
      en: {
        definition:
          "A covering space is locally homeomorphic to the base space. The covering map p: E → B has each point's neighborhood evenly covered by disjoint open sets in E.",
        formulas: [
          {
            latex: "p^{-1}(U) = \\bigsqcup_{\\alpha} V_\\alpha",
            description: "Evenly covered condition",
          },
          {
            latex: "\\mathbb{R} \\xrightarrow{p} S^1, \\quad p(t) = e^{2\\pi it}",
            description: "Real line as universal cover of circle",
          },
        ],
        examples: [
          {
            problem: "Explain why ℝ is a covering space of S¹.",
            solution:
              "p(t) = e^{2πit} maps ℝ onto S¹. Each neighborhood in S¹ is covered by infinitely many intervals in ℝ.",
          },
        ],
        applications: [
          { field: "Topology", description: "Fundamental group computation" },
          { field: "Complex Analysis", description: "Riemann surfaces of multi-valued functions" },
          { field: "Physics", description: "Gauge theory" },
        ],
      },
    },
    relations: {
      prerequisites: ["fundamental-group", "homeomorphism"],
      nextTopics: ["universal-cover", "deck-transformations"],
      related: ["homotopy"],
    },
    tags: ["피복공간", "피복사상", "covering", "space"],
  },
  {
    id: "homology",
    name: {
      ko: "호몰로지",
      en: "Homology",
      ja: "ホモロジー",
    },
    field: "topology",
    subfield: "algebraic-topology",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "호몰로지는 공간의 '구멍'을 대수적으로 측정하는 방법입니다. n차 호몰로지 군 Hₙ(X)는 n차원 구멍(cycle)과 경계의 관계를 나타냅니다.",
        formulas: [
          {
            latex: "H_n(X) = \\ker \\partial_n / \\text{im} \\partial_{n+1}",
            description: "호몰로지 군의 정의",
          },
          {
            latex: "H_0(S^n) \\cong H_n(S^n) \\cong \\mathbb{Z}, \\quad H_k(S^n) = 0 \\text{ otherwise}",
            description: "n-구의 호몰로지",
          },
        ],
        examples: [
          {
            problem: "토러스 T²의 호몰로지 군을 구하세요.",
            solution:
              "H₀(T²) = ℤ (연결), H₁(T²) = ℤ × ℤ (두 개의 독립적 루프), H₂(T²) = ℤ (방향 있는 곡면)",
          },
        ],
        history: {
          discoveredBy: "에미 뇌터",
          year: "1920년대",
          background:
            "뇌터가 호몰로지를 군론의 관점에서 체계화했습니다.",
        },
        applications: [
          { field: "데이터 과학", description: "위상 데이터 분석 (TDA)" },
          { field: "물리학", description: "호몰로지 양자장론" },
          { field: "센서 네트워크", description: "커버리지 분석" },
        ],
      },
      en: {
        definition:
          "Homology algebraically measures 'holes' in spaces. The n-th homology group Hₙ(X) captures n-dimensional holes through cycles and boundaries.",
        formulas: [
          {
            latex: "H_n(X) = \\ker \\partial_n / \\text{im} \\partial_{n+1}",
            description: "Definition of homology group",
          },
          {
            latex: "H_0(S^n) \\cong H_n(S^n) \\cong \\mathbb{Z}, \\quad H_k(S^n) = 0 \\text{ otherwise}",
            description: "Homology of n-sphere",
          },
        ],
        examples: [
          {
            problem: "Find the homology groups of torus T².",
            solution:
              "H₀(T²) = ℤ (connected), H₁(T²) = ℤ × ℤ (two independent loops), H₂(T²) = ℤ (orientable surface)",
          },
        ],
        history: {
          discoveredBy: "Emmy Noether",
          year: "1920s",
          background:
            "Noether systematized homology from a group-theoretic perspective.",
        },
        applications: [
          { field: "Data Science", description: "Topological Data Analysis (TDA)" },
          { field: "Physics", description: "Homological QFT" },
          { field: "Sensor Networks", description: "Coverage analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["fundamental-group", "group-theory"],
      nextTopics: ["cohomology", "betti-numbers"],
      related: ["euler-characteristic"],
    },
    tags: ["호몰로지", "대수적위상", "homology", "algebraic topology"],
  },
  {
    id: "manifold",
    name: {
      ko: "다양체",
      en: "Manifold",
      ja: "多様体",
    },
    field: "topology",
    subfield: "differential-topology",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "n차원 다양체는 국소적으로 ℝⁿ과 동형인 위상공간입니다. 미분다양체는 추가로 미분 구조를 가져 미적분을 할 수 있습니다.",
        formulas: [
          {
            latex: "\\phi_\\alpha: U_\\alpha \\to \\mathbb{R}^n",
            description: "좌표 차트",
          },
          {
            latex: "\\phi_\\beta \\circ \\phi_\\alpha^{-1} \\text{ is smooth}",
            description: "전이 함수의 매끄러움",
          },
        ],
        examples: [
          {
            problem: "2차원 구면 S²이 2차원 다양체임을 설명하세요.",
            solution:
              "S²의 각 점 근방을 평면의 열린집합으로 동형사상할 수 있습니다. 예: 입체사영으로 북극점을 제외한 부분을 ℝ²로 사상.",
          },
        ],
        applications: [
          { field: "물리학", description: "일반상대론의 시공간" },
          { field: "로봇공학", description: "형상공간" },
          { field: "기계학습", description: "다양체 학습" },
        ],
      },
      en: {
        definition:
          "An n-dimensional manifold is locally homeomorphic to ℝⁿ. A differentiable manifold has additional smooth structure enabling calculus.",
        formulas: [
          {
            latex: "\\phi_\\alpha: U_\\alpha \\to \\mathbb{R}^n",
            description: "Coordinate chart",
          },
          {
            latex: "\\phi_\\beta \\circ \\phi_\\alpha^{-1} \\text{ is smooth}",
            description: "Smoothness of transition functions",
          },
        ],
        examples: [
          {
            problem: "Explain why the 2-sphere S² is a 2-manifold.",
            solution:
              "Each neighborhood of S² can be homeomorphically mapped to an open set in the plane. E.g., stereographic projection maps S² minus north pole to ℝ².",
          },
        ],
        applications: [
          { field: "Physics", description: "Spacetime in general relativity" },
          { field: "Robotics", description: "Configuration space" },
          { field: "Machine Learning", description: "Manifold learning" },
        ],
      },
    },
    relations: {
      prerequisites: ["topological-space", "homeomorphism"],
      nextTopics: ["tangent-bundle", "riemannian-manifold"],
      related: ["metric-space"],
    },
    tags: ["다양체", "미분다양체", "manifold", "differential"],
  },
  {
    id: "path-connectedness",
    name: {
      ko: "경로연결성",
      en: "Path Connectedness",
      ja: "弧状連結性",
    },
    field: "topology",
    subfield: "general-topology",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "공간이 경로연결이라는 것은 임의의 두 점을 연속 경로로 연결할 수 있다는 것입니다. 경로연결이면 연결이지만 역은 성립하지 않습니다.",
        formulas: [
          {
            latex: "\\gamma: [0,1] \\to X, \\quad \\gamma(0) = x, \\quad \\gamma(1) = y",
            description: "x에서 y로의 경로",
          },
        ],
        examples: [
          {
            problem: "위상학자의 사인곡선이 연결이지만 경로연결이 아님을 설명하세요.",
            solution:
              "S = {(x, sin(1/x)) : x > 0} ∪ {(0, y) : -1 ≤ y ≤ 1}. 연결이지만 (1,sin1)에서 (0,0)으로 가는 연속 경로는 없습니다.",
          },
        ],
        applications: [
          { field: "위상수학", description: "공간 분류" },
          { field: "네트워크", description: "연결성 분석" },
          { field: "로봇공학", description: "경로 존재성" },
        ],
      },
      en: {
        definition:
          "A space is path-connected if any two points can be joined by a continuous path. Path-connected implies connected, but not vice versa.",
        formulas: [
          {
            latex: "\\gamma: [0,1] \\to X, \\quad \\gamma(0) = x, \\quad \\gamma(1) = y",
            description: "Path from x to y",
          },
        ],
        examples: [
          {
            problem: "Explain why topologist's sine curve is connected but not path-connected.",
            solution:
              "S = {(x, sin(1/x)) : x > 0} ∪ {(0, y) : -1 ≤ y ≤ 1}. It's connected but no continuous path from (1,sin1) to (0,0) exists.",
          },
        ],
        applications: [
          { field: "Topology", description: "Space classification" },
          { field: "Networks", description: "Connectivity analysis" },
          { field: "Robotics", description: "Path existence" },
        ],
      },
    },
    relations: {
      prerequisites: ["connectedness", "continuity-topology"],
      nextTopics: ["fundamental-group"],
      related: ["simply-connected"],
    },
    tags: ["경로연결", "연결성", "path connected", "connected"],
  },
];
