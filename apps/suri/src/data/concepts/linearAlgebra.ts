/**
 * @fileoverview 선형대수학 개념 데이터
 */
import type { MathConcept } from "../types";

export const linearAlgebraConcepts: MathConcept[] = [
  {
    id: "vector-basics",
    name: {
      ko: "벡터의 기초",
      en: "Vector Basics",
      ja: "ベクトルの基礎",
    },
    field: "linear-algebra",
    subfield: "vectors",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "벡터는 크기와 방향을 가진 양으로, 좌표계에서 숫자의 순서쌍으로 표현됩니다. 물리적으로는 힘, 속도 등을 나타냅니다.",
        formulas: [
          {
            latex: "\\vec{v} = \\begin{pmatrix} v_1 \\\\ v_2 \\\\ \\vdots \\\\ v_n \\end{pmatrix}",
            description: "n차원 벡터의 표현",
          },
          {
            latex: "|\\vec{v}| = \\sqrt{v_1^2 + v_2^2 + \\cdots + v_n^2}",
            description: "벡터의 크기(norm)",
          },
          {
            latex: "\\vec{u} + \\vec{v} = \\begin{pmatrix} u_1 + v_1 \\\\ u_2 + v_2 \\end{pmatrix}",
            description: "벡터의 덧셈",
          },
        ],
        examples: [
          {
            problem: "벡터 v = (3, 4)의 크기를 구하세요.",
            solution: "|v| = √(3² + 4²) = √(9 + 16) = √25 = 5",
          },
          {
            problem: "u = (1, 2), v = (3, -1)일 때 u + v를 구하세요.",
            solution: "u + v = (1+3, 2+(-1)) = (4, 1)",
          },
        ],
        applications: [
          { field: "물리학", description: "힘, 속도, 가속도 표현" },
          { field: "컴퓨터 그래픽스", description: "3D 좌표, 변환" },
          { field: "기계학습", description: "특성 벡터, 임베딩" },
        ],
      },
      en: {
        definition:
          "A vector is a quantity with magnitude and direction, represented as an ordered tuple of numbers in a coordinate system. Physically, it represents forces, velocities, etc.",
        formulas: [
          {
            latex: "\\vec{v} = \\begin{pmatrix} v_1 \\\\ v_2 \\\\ \\vdots \\\\ v_n \\end{pmatrix}",
            description: "n-dimensional vector representation",
          },
          {
            latex: "|\\vec{v}| = \\sqrt{v_1^2 + v_2^2 + \\cdots + v_n^2}",
            description: "Vector magnitude (norm)",
          },
          {
            latex: "\\vec{u} + \\vec{v} = \\begin{pmatrix} u_1 + v_1 \\\\ u_2 + v_2 \\end{pmatrix}",
            description: "Vector addition",
          },
        ],
        examples: [
          {
            problem: "Find the magnitude of vector v = (3, 4).",
            solution: "|v| = √(3² + 4²) = √(9 + 16) = √25 = 5",
          },
          {
            problem: "If u = (1, 2) and v = (3, -1), find u + v.",
            solution: "u + v = (1+3, 2+(-1)) = (4, 1)",
          },
        ],
        applications: [
          { field: "Physics", description: "Force, velocity, acceleration" },
          { field: "Computer Graphics", description: "3D coordinates, transforms" },
          { field: "Machine Learning", description: "Feature vectors, embeddings" },
        ],
      },
    },
    relations: {
      prerequisites: ["coordinate-system"],
      nextTopics: ["dot-product", "cross-product", "matrix-basics"],
      related: ["pythagorean-theorem"],
    },
    tags: ["벡터", "선형대수", "vector", "linear algebra"],
  },
  {
    id: "dot-product",
    name: {
      ko: "내적 (점곱)",
      en: "Dot Product",
      ja: "内積",
    },
    field: "linear-algebra",
    subfield: "vectors",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "내적(점곱)은 두 벡터를 곱해 스칼라를 얻는 연산입니다. 두 벡터의 유사도나 각도를 측정하는 데 사용됩니다.",
        formulas: [
          {
            latex: "\\vec{u} \\cdot \\vec{v} = u_1v_1 + u_2v_2 + \\cdots + u_nv_n",
            description: "내적의 대수적 정의",
          },
          {
            latex: "\\vec{u} \\cdot \\vec{v} = |\\vec{u}||\\vec{v}|\\cos\\theta",
            description: "내적의 기하학적 정의",
          },
          {
            latex: "\\cos\\theta = \\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{u}||\\vec{v}|}",
            description: "두 벡터 사이의 각도",
          },
        ],
        examples: [
          {
            problem: "u = (1, 2, 3), v = (4, 5, 6)의 내적을 구하세요.",
            solution: "u · v = 1×4 + 2×5 + 3×6 = 4 + 10 + 18 = 32",
          },
          {
            problem: "u = (1, 0), v = (0, 1)이 직교함을 보이세요.",
            solution: "u · v = 1×0 + 0×1 = 0. 내적이 0이면 직교합니다.",
          },
        ],
        applications: [
          { field: "기계학습", description: "코사인 유사도 계산" },
          { field: "물리학", description: "일(work) = 힘 · 변위" },
          { field: "컴퓨터 비전", description: "이미지 매칭" },
        ],
      },
      en: {
        definition:
          "The dot product is an operation that multiplies two vectors to produce a scalar. It measures similarity or angle between vectors.",
        formulas: [
          {
            latex: "\\vec{u} \\cdot \\vec{v} = u_1v_1 + u_2v_2 + \\cdots + u_nv_n",
            description: "Algebraic definition of dot product",
          },
          {
            latex: "\\vec{u} \\cdot \\vec{v} = |\\vec{u}||\\vec{v}|\\cos\\theta",
            description: "Geometric definition of dot product",
          },
          {
            latex: "\\cos\\theta = \\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{u}||\\vec{v}|}",
            description: "Angle between two vectors",
          },
        ],
        examples: [
          {
            problem: "Find the dot product of u = (1, 2, 3) and v = (4, 5, 6).",
            solution: "u · v = 1×4 + 2×5 + 3×6 = 4 + 10 + 18 = 32",
          },
          {
            problem: "Show that u = (1, 0) and v = (0, 1) are orthogonal.",
            solution: "u · v = 1×0 + 0×1 = 0. Zero dot product means orthogonal.",
          },
        ],
        applications: [
          { field: "Machine Learning", description: "Cosine similarity" },
          { field: "Physics", description: "Work = force · displacement" },
          { field: "Computer Vision", description: "Image matching" },
        ],
      },
    },
    relations: {
      prerequisites: ["vector-basics"],
      nextTopics: ["cross-product", "orthogonality"],
      related: ["cosine-similarity"],
    },
    tags: ["내적", "점곱", "dot product", "scalar product"],
  },
  {
    id: "cross-product",
    name: {
      ko: "외적 (벡터곱)",
      en: "Cross Product",
      ja: "外積",
    },
    field: "linear-algebra",
    subfield: "vectors",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "외적(벡터곱)은 3차원에서 두 벡터에 수직인 새로운 벡터를 생성하는 연산입니다. 크기는 두 벡터가 이루는 평행사변형의 넓이입니다.",
        formulas: [
          {
            latex: "\\vec{u} \\times \\vec{v} = \\begin{vmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix}",
            description: "외적의 행렬식 정의",
          },
          {
            latex: "|\\vec{u} \\times \\vec{v}| = |\\vec{u}||\\vec{v}|\\sin\\theta",
            description: "외적의 크기",
          },
        ],
        examples: [
          {
            problem: "u = (1, 0, 0), v = (0, 1, 0)의 외적을 구하세요.",
            solution: "u × v = (0×0 - 0×1, 0×0 - 1×0, 1×1 - 0×0) = (0, 0, 1) = k",
          },
        ],
        applications: [
          { field: "물리학", description: "토크 = r × F, 각운동량" },
          { field: "컴퓨터 그래픽스", description: "법선 벡터 계산" },
          { field: "전자기학", description: "로렌츠 힘" },
        ],
      },
      en: {
        definition:
          "The cross product creates a new vector perpendicular to two 3D vectors. Its magnitude equals the area of the parallelogram formed by the vectors.",
        formulas: [
          {
            latex: "\\vec{u} \\times \\vec{v} = \\begin{vmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix}",
            description: "Cross product determinant definition",
          },
          {
            latex: "|\\vec{u} \\times \\vec{v}| = |\\vec{u}||\\vec{v}|\\sin\\theta",
            description: "Magnitude of cross product",
          },
        ],
        examples: [
          {
            problem: "Find the cross product of u = (1, 0, 0) and v = (0, 1, 0).",
            solution: "u × v = (0×0 - 0×1, 0×0 - 1×0, 1×1 - 0×0) = (0, 0, 1) = k",
          },
        ],
        applications: [
          { field: "Physics", description: "Torque = r × F, angular momentum" },
          { field: "Computer Graphics", description: "Normal vector calculation" },
          { field: "Electromagnetism", description: "Lorentz force" },
        ],
      },
    },
    relations: {
      prerequisites: ["vector-basics", "determinant"],
      nextTopics: ["vector-spaces"],
      related: ["dot-product", "triple-product"],
    },
    tags: ["외적", "벡터곱", "cross product", "vector product"],
  },
  {
    id: "matrix-basics",
    name: {
      ko: "행렬의 기초",
      en: "Matrix Basics",
      ja: "行列の基礎",
    },
    field: "linear-algebra",
    subfield: "matrices",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "행렬은 숫자들을 직사각형 배열로 나타낸 것입니다. 선형 변환, 연립방정식, 데이터 표현 등에 사용됩니다.",
        formulas: [
          {
            latex: "A = \\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}",
            description: "2×2 행렬",
          },
          {
            latex: "(A + B)_{ij} = A_{ij} + B_{ij}",
            description: "행렬의 덧셈",
          },
          {
            latex: "(AB)_{ij} = \\sum_{k} A_{ik}B_{kj}",
            description: "행렬의 곱셈",
          },
        ],
        examples: [
          {
            problem:
              "A = [[1, 2], [3, 4]], B = [[5, 6], [7, 8]]일 때 A + B를 구하세요.",
            solution: "A + B = [[1+5, 2+6], [3+7, 4+8]] = [[6, 8], [10, 12]]",
          },
        ],
        applications: [
          { field: "컴퓨터 그래픽스", description: "회전, 스케일링, 변환" },
          { field: "데이터 과학", description: "데이터 테이블 표현" },
          { field: "물리학", description: "양자역학의 연산자" },
        ],
      },
      en: {
        definition:
          "A matrix is a rectangular array of numbers. It's used for linear transformations, systems of equations, and data representation.",
        formulas: [
          {
            latex: "A = \\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}",
            description: "2×2 matrix",
          },
          {
            latex: "(A + B)_{ij} = A_{ij} + B_{ij}",
            description: "Matrix addition",
          },
          {
            latex: "(AB)_{ij} = \\sum_{k} A_{ik}B_{kj}",
            description: "Matrix multiplication",
          },
        ],
        examples: [
          {
            problem:
              "If A = [[1, 2], [3, 4]] and B = [[5, 6], [7, 8]], find A + B.",
            solution: "A + B = [[1+5, 2+6], [3+7, 4+8]] = [[6, 8], [10, 12]]",
          },
        ],
        applications: [
          { field: "Computer Graphics", description: "Rotation, scaling, transforms" },
          { field: "Data Science", description: "Data table representation" },
          { field: "Physics", description: "Quantum mechanics operators" },
        ],
      },
    },
    relations: {
      prerequisites: ["vector-basics"],
      nextTopics: ["determinant", "matrix-inverse", "eigenvalues"],
      related: ["linear-transformation"],
    },
    tags: ["행렬", "선형대수", "matrix", "linear algebra"],
  },
  {
    id: "determinant",
    name: {
      ko: "행렬식",
      en: "Determinant",
      ja: "行列式",
    },
    field: "linear-algebra",
    subfield: "matrices",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "행렬식은 정사각행렬에서 계산되는 스칼라 값으로, 행렬의 가역성, 부피 변화 등을 나타냅니다.",
        formulas: [
          {
            latex: "\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc",
            description: "2×2 행렬식",
          },
          {
            latex: "\\det(AB) = \\det(A) \\cdot \\det(B)",
            description: "행렬식의 곱셈 성질",
          },
          {
            latex: "\\det(A^{-1}) = \\frac{1}{\\det(A)}",
            description: "역행렬의 행렬식",
          },
        ],
        examples: [
          {
            problem: "A = [[3, 1], [2, 4]]의 행렬식을 구하세요.",
            solution: "det(A) = 3×4 - 1×2 = 12 - 2 = 10",
          },
        ],
        applications: [
          { field: "기하학", description: "넓이, 부피 계산" },
          { field: "연립방정식", description: "크래머 공식" },
          { field: "선형대수", description: "역행렬 존재 여부 판단" },
        ],
      },
      en: {
        definition:
          "The determinant is a scalar value computed from a square matrix, representing invertibility, volume change, and more.",
        formulas: [
          {
            latex: "\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc",
            description: "2×2 determinant",
          },
          {
            latex: "\\det(AB) = \\det(A) \\cdot \\det(B)",
            description: "Product property of determinants",
          },
          {
            latex: "\\det(A^{-1}) = \\frac{1}{\\det(A)}",
            description: "Determinant of inverse",
          },
        ],
        examples: [
          {
            problem: "Find the determinant of A = [[3, 1], [2, 4]].",
            solution: "det(A) = 3×4 - 1×2 = 12 - 2 = 10",
          },
        ],
        applications: [
          { field: "Geometry", description: "Area, volume calculation" },
          { field: "Linear Systems", description: "Cramer's rule" },
          { field: "Linear Algebra", description: "Determining invertibility" },
        ],
      },
    },
    relations: {
      prerequisites: ["matrix-basics"],
      nextTopics: ["matrix-inverse", "eigenvalues"],
      related: ["cross-product"],
    },
    tags: ["행렬식", "선형대수", "determinant", "linear algebra"],
  },
  {
    id: "eigenvalues",
    name: {
      ko: "고유값과 고유벡터",
      en: "Eigenvalues and Eigenvectors",
      ja: "固有値と固有ベクトル",
    },
    field: "linear-algebra",
    subfield: "matrices",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "고유벡터는 행렬 변환 시 방향이 변하지 않는 벡터이고, 고유값은 그 벡터가 스케일되는 비율입니다.",
        formulas: [
          {
            latex: "A\\vec{v} = \\lambda\\vec{v}",
            description: "고유값 방정식",
          },
          {
            latex: "\\det(A - \\lambda I) = 0",
            description: "특성 방정식",
          },
        ],
        examples: [
          {
            problem: "A = [[2, 1], [1, 2]]의 고유값을 구하세요.",
            solution:
              "det(A - λI) = (2-λ)² - 1 = λ² - 4λ + 3 = (λ-1)(λ-3) = 0, λ = 1, 3",
          },
        ],
        history: {
          discoveredBy: "다비드 힐베르트 등",
          year: "19세기 말",
          background:
            "고유값 이론은 진동 분석, 양자역학 등 다양한 분야에서 독립적으로 발전했습니다.",
        },
        applications: [
          { field: "주성분 분석(PCA)", description: "차원 축소" },
          { field: "양자역학", description: "관측 가능량의 측정값" },
          { field: "구조공학", description: "진동 모드 분석" },
        ],
      },
      en: {
        definition:
          "An eigenvector is a vector that doesn't change direction under a matrix transformation; the eigenvalue is the scaling factor.",
        formulas: [
          {
            latex: "A\\vec{v} = \\lambda\\vec{v}",
            description: "Eigenvalue equation",
          },
          {
            latex: "\\det(A - \\lambda I) = 0",
            description: "Characteristic equation",
          },
        ],
        examples: [
          {
            problem: "Find the eigenvalues of A = [[2, 1], [1, 2]].",
            solution:
              "det(A - λI) = (2-λ)² - 1 = λ² - 4λ + 3 = (λ-1)(λ-3) = 0, λ = 1, 3",
          },
        ],
        history: {
          discoveredBy: "David Hilbert and others",
          year: "Late 19th century",
          background:
            "Eigenvalue theory developed independently in vibration analysis, quantum mechanics, etc.",
        },
        applications: [
          { field: "PCA", description: "Dimensionality reduction" },
          { field: "Quantum Mechanics", description: "Observable measurements" },
          { field: "Structural Engineering", description: "Vibration mode analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["matrix-basics", "determinant"],
      nextTopics: ["diagonalization", "svd"],
      related: ["spectral-theorem"],
    },
    tags: ["고유값", "고유벡터", "eigenvalue", "eigenvector"],
  },
  {
    id: "linear-transformation",
    name: {
      ko: "선형변환",
      en: "Linear Transformation",
      ja: "線形変換",
    },
    field: "linear-algebra",
    subfield: "linear-maps",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "선형변환은 벡터 공간 사이의 함수로, 덧셈과 스칼라 곱을 보존합니다. 행렬로 표현할 수 있습니다.",
        formulas: [
          {
            latex: "T(\\vec{u} + \\vec{v}) = T(\\vec{u}) + T(\\vec{v})",
            description: "덧셈 보존",
          },
          {
            latex: "T(c\\vec{v}) = cT(\\vec{v})",
            description: "스칼라 곱 보존",
          },
          {
            latex: "T(\\vec{x}) = A\\vec{x}",
            description: "행렬 표현",
          },
        ],
        examples: [
          {
            problem: "회전 변환이 선형변환임을 보이세요.",
            solution:
              "2D 회전 행렬 R = [[cosθ, -sinθ], [sinθ, cosθ]]로 표현되며, Rv₁ + Rv₂ = R(v₁ + v₂)를 만족합니다.",
          },
        ],
        applications: [
          { field: "컴퓨터 그래픽스", description: "회전, 반사, 투영" },
          { field: "신호 처리", description: "푸리에 변환" },
          { field: "기계학습", description: "신경망의 선형 층" },
        ],
      },
      en: {
        definition:
          "A linear transformation is a function between vector spaces that preserves addition and scalar multiplication. It can be represented by a matrix.",
        formulas: [
          {
            latex: "T(\\vec{u} + \\vec{v}) = T(\\vec{u}) + T(\\vec{v})",
            description: "Preserves addition",
          },
          {
            latex: "T(c\\vec{v}) = cT(\\vec{v})",
            description: "Preserves scalar multiplication",
          },
          {
            latex: "T(\\vec{x}) = A\\vec{x}",
            description: "Matrix representation",
          },
        ],
        examples: [
          {
            problem: "Show that rotation is a linear transformation.",
            solution:
              "2D rotation matrix R = [[cosθ, -sinθ], [sinθ, cosθ]] satisfies Rv₁ + Rv₂ = R(v₁ + v₂).",
          },
        ],
        applications: [
          { field: "Computer Graphics", description: "Rotation, reflection, projection" },
          { field: "Signal Processing", description: "Fourier transform" },
          { field: "Machine Learning", description: "Linear layers in neural networks" },
        ],
      },
    },
    relations: {
      prerequisites: ["vector-basics", "matrix-basics"],
      nextTopics: ["kernel-image", "eigenvalues"],
      related: ["function"],
    },
    tags: ["선형변환", "행렬", "linear transformation", "linear map"],
  },
];
