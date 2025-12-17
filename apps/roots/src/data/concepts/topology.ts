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
];
