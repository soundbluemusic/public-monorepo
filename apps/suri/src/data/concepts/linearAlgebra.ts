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

  // ===== 6.2 행렬 연산 (Matrix Operations) =====
  {
    id: "matrix-inverse",
    name: {
      ko: "역행렬",
      en: "Matrix Inverse",
      ja: "逆行列",
    },
    field: "linear-algebra",
    subfield: "matrices",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "역행렬은 원래 행렬과 곱하면 항등행렬이 되는 행렬입니다. 행렬식이 0이 아닐 때만 존재합니다.",
        formulas: [
          {
            latex: "AA^{-1} = A^{-1}A = I",
            description: "역행렬의 정의",
          },
          {
            latex: "A^{-1} = \\frac{1}{\\det(A)} \\text{adj}(A)",
            description: "역행렬 공식 (수반행렬 사용)",
          },
          {
            latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}",
            description: "2×2 역행렬",
          },
        ],
        examples: [
          {
            problem: "A = [[2, 1], [5, 3]]의 역행렬을 구하세요.",
            solution:
              "det(A) = 6 - 5 = 1\nA⁻¹ = [[3, -1], [-5, 2]]",
          },
        ],
        applications: [
          { field: "연립방정식", description: "Ax = b의 해: x = A⁻¹b" },
          { field: "컴퓨터 그래픽스", description: "변환의 역변환" },
        ],
      },
      en: {
        definition:
          "The inverse matrix, when multiplied by the original, gives the identity matrix. It exists only when the determinant is non-zero.",
        formulas: [
          {
            latex: "AA^{-1} = A^{-1}A = I",
            description: "Definition of inverse",
          },
          {
            latex: "A^{-1} = \\frac{1}{\\det(A)} \\text{adj}(A)",
            description: "Inverse formula (using adjugate)",
          },
        ],
        examples: [
          {
            problem: "Find the inverse of A = [[2, 1], [5, 3]].",
            solution: "det(A) = 6 - 5 = 1\nA⁻¹ = [[3, -1], [-5, 2]]",
          },
        ],
        applications: [
          { field: "Linear Systems", description: "Solution of Ax = b: x = A⁻¹b" },
          { field: "Computer Graphics", description: "Inverse transformations" },
        ],
      },
    },
    relations: {
      prerequisites: ["matrix-basics", "determinant"],
      nextTopics: ["cramers-rule"],
      related: ["singular-matrix"],
    },
    tags: ["역행렬", "가역행렬", "matrix inverse", "invertible"],
  },
  {
    id: "matrix-rank",
    name: {
      ko: "행렬의 계수 (랭크)",
      en: "Matrix Rank",
      ja: "行列のランク",
    },
    field: "linear-algebra",
    subfield: "matrices",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "행렬의 계수(랭크)는 선형 독립인 행(또는 열)의 최대 개수입니다. 연립방정식의 해의 존재와 유일성을 판단합니다.",
        formulas: [
          {
            latex: "\\text{rank}(A) = \\text{dim}(\\text{Col}(A)) = \\text{dim}(\\text{Row}(A))",
            description: "랭크의 정의",
          },
          {
            latex: "\\text{rank}(A) + \\text{nullity}(A) = n",
            description: "계수-퇴화차수 정리",
          },
        ],
        examples: [
          {
            problem: "A = [[1, 2, 3], [2, 4, 6]]의 랭크를 구하세요.",
            solution:
              "두 번째 행 = 2 × 첫 번째 행이므로 선형 종속\nrank(A) = 1",
          },
        ],
        applications: [
          { field: "연립방정식", description: "해의 존재성, 유일성 판단" },
          { field: "데이터 과학", description: "행렬 압축, 저랭크 근사" },
        ],
      },
      en: {
        definition:
          "Matrix rank is the maximum number of linearly independent rows (or columns). It determines the existence and uniqueness of solutions to linear systems.",
        formulas: [
          {
            latex: "\\text{rank}(A) = \\text{dim}(\\text{Col}(A))",
            description: "Definition of rank",
          },
          {
            latex: "\\text{rank}(A) + \\text{nullity}(A) = n",
            description: "Rank-nullity theorem",
          },
        ],
        examples: [
          {
            problem: "Find the rank of A = [[1, 2, 3], [2, 4, 6]].",
            solution:
              "Row 2 = 2 × Row 1, linearly dependent\nrank(A) = 1",
          },
        ],
        applications: [
          { field: "Linear Systems", description: "Existence and uniqueness of solutions" },
          { field: "Data Science", description: "Matrix compression, low-rank approximation" },
        ],
      },
    },
    relations: {
      prerequisites: ["matrix-basics", "linear-independence"],
      nextTopics: ["null-space"],
      related: ["row-echelon"],
    },
    tags: ["랭크", "계수", "matrix rank", "linear independence"],
  },
  {
    id: "gaussian-elimination",
    name: {
      ko: "가우스 소거법",
      en: "Gaussian Elimination",
      ja: "ガウス消去法",
    },
    field: "linear-algebra",
    subfield: "matrices",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "가우스 소거법은 행 연산을 통해 행렬을 행 사다리꼴로 변환하여 연립방정식을 푸는 알고리즘입니다.",
        formulas: [
          {
            latex: "\\begin{pmatrix} 1 & * & * \\\\ 0 & 1 & * \\\\ 0 & 0 & 1 \\end{pmatrix}",
            description: "기약 행 사다리꼴 (RREF)",
          },
        ],
        examples: [
          {
            problem: "x + 2y = 5, 3x + y = 6을 가우스 소거법으로 풀이하세요.",
            solution:
              "[[1, 2, 5], [3, 1, 6]] → R2 - 3R1 → [[1, 2, 5], [0, -5, -9]]\ny = 9/5, x = 5 - 18/5 = 7/5",
          },
        ],
        history: {
          discoveredBy: "카를 프리드리히 가우스",
          year: "19세기 초",
          background:
            "고대 중국의 산술에서도 유사한 방법이 사용되었습니다.",
        },
        applications: [
          { field: "수치 해석", description: "연립방정식 풀이" },
          { field: "컴퓨터 과학", description: "LU 분해의 기초" },
        ],
      },
      en: {
        definition:
          "Gaussian elimination transforms a matrix to row echelon form using row operations to solve linear systems.",
        formulas: [
          {
            latex: "\\begin{pmatrix} 1 & * & * \\\\ 0 & 1 & * \\\\ 0 & 0 & 1 \\end{pmatrix}",
            description: "Reduced row echelon form (RREF)",
          },
        ],
        examples: [
          {
            problem: "Solve x + 2y = 5, 3x + y = 6 using Gaussian elimination.",
            solution:
              "[[1, 2, 5], [3, 1, 6]] → R2 - 3R1 → [[1, 2, 5], [0, -5, -9]]\ny = 9/5, x = 7/5",
          },
        ],
        history: {
          discoveredBy: "Carl Friedrich Gauss",
          year: "Early 19th century",
          background:
            "Similar methods were used in ancient Chinese arithmetic.",
        },
        applications: [
          { field: "Numerical Analysis", description: "Solving linear systems" },
          { field: "Computer Science", description: "Foundation for LU decomposition" },
        ],
      },
    },
    relations: {
      prerequisites: ["matrix-basics"],
      nextTopics: ["lu-decomposition"],
      related: ["matrix-inverse"],
    },
    tags: ["가우스소거법", "행연산", "Gaussian elimination", "row operations"],
  },

  // ===== 6.3 벡터 공간 (Vector Spaces) =====
  {
    id: "vector-spaces",
    name: {
      ko: "벡터 공간",
      en: "Vector Spaces",
      ja: "ベクトル空間",
    },
    field: "linear-algebra",
    subfield: "vector-spaces",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "벡터 공간은 벡터의 덧셈과 스칼라 곱이 정의되고 특정 공리를 만족하는 집합입니다.",
        formulas: [
          {
            latex: "\\vec{u} + \\vec{v} = \\vec{v} + \\vec{u}",
            description: "교환법칙",
          },
          {
            latex: "c(\\vec{u} + \\vec{v}) = c\\vec{u} + c\\vec{v}",
            description: "분배법칙",
          },
          {
            latex: "1 \\cdot \\vec{v} = \\vec{v}",
            description: "항등원",
          },
        ],
        examples: [
          {
            problem: "ℝ²가 벡터 공간임을 간단히 설명하세요.",
            solution:
              "두 벡터의 합과 스칼라 곱이 ℝ²에 속하고, 모든 공리(교환, 결합, 분배법칙 등)를 만족합니다.",
          },
        ],
        applications: [
          { field: "물리학", description: "상태 공간" },
          { field: "함수해석", description: "함수 공간" },
        ],
      },
      en: {
        definition:
          "A vector space is a set with vector addition and scalar multiplication satisfying certain axioms.",
        formulas: [
          {
            latex: "\\vec{u} + \\vec{v} = \\vec{v} + \\vec{u}",
            description: "Commutative property",
          },
          {
            latex: "c(\\vec{u} + \\vec{v}) = c\\vec{u} + c\\vec{v}",
            description: "Distributive property",
          },
        ],
        examples: [
          {
            problem: "Briefly explain why ℝ² is a vector space.",
            solution:
              "The sum of two vectors and scalar multiples remain in ℝ², satisfying all axioms.",
          },
        ],
        applications: [
          { field: "Physics", description: "State spaces" },
          { field: "Functional Analysis", description: "Function spaces" },
        ],
      },
    },
    relations: {
      prerequisites: ["vector-basics"],
      nextTopics: ["basis", "dimension"],
      related: ["subspace"],
    },
    tags: ["벡터공간", "선형대수", "vector space", "linear algebra"],
  },
  {
    id: "basis-dimension",
    name: {
      ko: "기저와 차원",
      en: "Basis and Dimension",
      ja: "基底と次元",
    },
    field: "linear-algebra",
    subfield: "vector-spaces",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "기저는 벡터 공간을 생성하는 선형 독립인 벡터들의 집합입니다. 차원은 기저 벡터의 개수입니다.",
        formulas: [
          {
            latex: "\\dim(V) = |\\mathcal{B}|",
            description: "차원 = 기저의 크기",
          },
          {
            latex: "\\vec{v} = c_1\\vec{b}_1 + c_2\\vec{b}_2 + \\cdots + c_n\\vec{b}_n",
            description: "기저에 대한 좌표 표현",
          },
        ],
        examples: [
          {
            problem: "ℝ³의 표준 기저를 쓰세요.",
            solution:
              "{e₁, e₂, e₃} = {(1,0,0), (0,1,0), (0,0,1)}, dim(ℝ³) = 3",
          },
        ],
        applications: [
          { field: "데이터 과학", description: "특성 공간의 차원" },
          { field: "물리학", description: "좌표계 선택" },
        ],
      },
      en: {
        definition:
          "A basis is a set of linearly independent vectors that span the vector space. Dimension is the number of basis vectors.",
        formulas: [
          {
            latex: "\\dim(V) = |\\mathcal{B}|",
            description: "Dimension = size of basis",
          },
        ],
        examples: [
          {
            problem: "Write the standard basis for ℝ³.",
            solution: "{e₁, e₂, e₃} = {(1,0,0), (0,1,0), (0,0,1)}, dim(ℝ³) = 3",
          },
        ],
        applications: [
          { field: "Data Science", description: "Feature space dimensions" },
          { field: "Physics", description: "Coordinate system selection" },
        ],
      },
    },
    relations: {
      prerequisites: ["vector-spaces", "linear-independence"],
      nextTopics: ["change-of-basis"],
      related: ["span"],
    },
    tags: ["기저", "차원", "basis", "dimension"],
  },
  {
    id: "linear-independence",
    name: {
      ko: "선형 독립",
      en: "Linear Independence",
      ja: "線形独立",
    },
    field: "linear-algebra",
    subfield: "vector-spaces",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "벡터들이 선형 독립이면, 영벡터를 만드는 유일한 선형 조합은 모든 계수가 0인 경우입니다.",
        formulas: [
          {
            latex: "c_1\\vec{v}_1 + c_2\\vec{v}_2 + \\cdots + c_n\\vec{v}_n = \\vec{0} \\Rightarrow c_1 = c_2 = \\cdots = c_n = 0",
            description: "선형 독립의 정의",
          },
        ],
        examples: [
          {
            problem: "(1, 0)과 (0, 1)이 선형 독립임을 보이세요.",
            solution:
              "c₁(1,0) + c₂(0,1) = (0,0)\n(c₁, c₂) = (0, 0)만 가능\n→ 선형 독립",
          },
        ],
        applications: [
          { field: "선형대수", description: "기저 판정" },
          { field: "데이터 분석", description: "다중공선성 검출" },
        ],
      },
      en: {
        definition:
          "Vectors are linearly independent if the only linear combination giving the zero vector has all coefficients equal to zero.",
        formulas: [
          {
            latex: "c_1\\vec{v}_1 + \\cdots + c_n\\vec{v}_n = \\vec{0} \\Rightarrow c_i = 0",
            description: "Definition of linear independence",
          },
        ],
        examples: [
          {
            problem: "Show (1, 0) and (0, 1) are linearly independent.",
            solution:
              "c₁(1,0) + c₂(0,1) = (0,0)\nOnly (c₁, c₂) = (0, 0) works\n→ Linearly independent",
          },
        ],
        applications: [
          { field: "Linear Algebra", description: "Basis determination" },
          { field: "Data Analysis", description: "Multicollinearity detection" },
        ],
      },
    },
    relations: {
      prerequisites: ["vector-basics"],
      nextTopics: ["basis-dimension"],
      related: ["span"],
    },
    tags: ["선형독립", "선형종속", "linear independence", "linear dependence"],
  },

  // ===== 6.4 내적 공간 (Inner Product Spaces) =====
  {
    id: "inner-product-spaces",
    name: {
      ko: "내적 공간",
      en: "Inner Product Spaces",
      ja: "内積空間",
    },
    field: "linear-algebra",
    subfield: "inner-product",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "내적 공간은 내적이 정의된 벡터 공간입니다. 내적을 통해 길이, 각도, 직교성을 정의합니다.",
        formulas: [
          {
            latex: "\\langle \\vec{u}, \\vec{v} \\rangle",
            description: "내적 표기",
          },
          {
            latex: "\\langle \\vec{v}, \\vec{v} \\rangle \\geq 0",
            description: "양정치성",
          },
          {
            latex: "\\langle \\vec{u}, \\vec{v} \\rangle = \\overline{\\langle \\vec{v}, \\vec{u} \\rangle}",
            description: "켤레 대칭성",
          },
        ],
        examples: [
          {
            problem: "ℝⁿ에서 표준 내적을 정의하세요.",
            solution:
              "⟨u, v⟩ = u₁v₁ + u₂v₂ + ... + uₙvₙ = Σuᵢvᵢ",
          },
        ],
        applications: [
          { field: "양자역학", description: "상태 벡터의 확률 진폭" },
          { field: "신호처리", description: "신호 상관 관계" },
        ],
      },
      en: {
        definition:
          "An inner product space is a vector space with an inner product. It defines length, angle, and orthogonality.",
        formulas: [
          {
            latex: "\\langle \\vec{u}, \\vec{v} \\rangle",
            description: "Inner product notation",
          },
          {
            latex: "\\langle \\vec{v}, \\vec{v} \\rangle \\geq 0",
            description: "Positive definiteness",
          },
        ],
        examples: [
          {
            problem: "Define the standard inner product in ℝⁿ.",
            solution: "⟨u, v⟩ = u₁v₁ + u₂v₂ + ... + uₙvₙ = Σuᵢvᵢ",
          },
        ],
        applications: [
          { field: "Quantum Mechanics", description: "Probability amplitudes of states" },
          { field: "Signal Processing", description: "Signal correlation" },
        ],
      },
    },
    relations: {
      prerequisites: ["vector-spaces", "dot-product"],
      nextTopics: ["orthogonality", "gram-schmidt"],
      related: ["hilbert-space"],
    },
    tags: ["내적공간", "내적", "inner product space"],
  },
  {
    id: "orthogonality",
    name: {
      ko: "직교성",
      en: "Orthogonality",
      ja: "直交性",
    },
    field: "linear-algebra",
    subfield: "inner-product",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "두 벡터가 직교하면 그들의 내적은 0입니다. 직교 집합의 벡터들은 선형 독립입니다.",
        formulas: [
          {
            latex: "\\vec{u} \\perp \\vec{v} \\Leftrightarrow \\langle \\vec{u}, \\vec{v} \\rangle = 0",
            description: "직교의 정의",
          },
          {
            latex: "\\|\\vec{u} + \\vec{v}\\|^2 = \\|\\vec{u}\\|^2 + \\|\\vec{v}\\|^2",
            description: "피타고라스 정리 (직교할 때)",
          },
        ],
        examples: [
          {
            problem: "(1, 0)과 (0, 1)이 직교함을 보이세요.",
            solution: "⟨(1, 0), (0, 1)⟩ = 1×0 + 0×1 = 0 → 직교",
          },
        ],
        applications: [
          { field: "신호처리", description: "직교 주파수 분할" },
          { field: "통계학", description: "독립 성분 분석" },
        ],
      },
      en: {
        definition:
          "Two vectors are orthogonal if their inner product is zero. Orthogonal sets are linearly independent.",
        formulas: [
          {
            latex: "\\vec{u} \\perp \\vec{v} \\Leftrightarrow \\langle \\vec{u}, \\vec{v} \\rangle = 0",
            description: "Definition of orthogonality",
          },
        ],
        examples: [
          {
            problem: "Show (1, 0) and (0, 1) are orthogonal.",
            solution: "⟨(1, 0), (0, 1)⟩ = 1×0 + 0×1 = 0 → orthogonal",
          },
        ],
        applications: [
          { field: "Signal Processing", description: "Orthogonal frequency division" },
          { field: "Statistics", description: "Independent component analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["dot-product"],
      nextTopics: ["gram-schmidt", "orthonormal-basis"],
      related: ["projection"],
    },
    tags: ["직교", "수직", "orthogonal", "perpendicular"],
  },
  {
    id: "gram-schmidt",
    name: {
      ko: "그람-슈미트 직교화",
      en: "Gram-Schmidt Process",
      ja: "グラム・シュミット直交化",
    },
    field: "linear-algebra",
    subfield: "inner-product",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "그람-슈미트 과정은 선형 독립인 벡터들로부터 정규 직교 기저를 만드는 알고리즘입니다.",
        formulas: [
          {
            latex: "\\vec{u}_1 = \\vec{v}_1",
            description: "첫 번째 벡터",
          },
          {
            latex: "\\vec{u}_k = \\vec{v}_k - \\sum_{j=1}^{k-1} \\text{proj}_{\\vec{u}_j}(\\vec{v}_k)",
            description: "k번째 직교 벡터",
          },
          {
            latex: "\\hat{e}_k = \\frac{\\vec{u}_k}{\\|\\vec{u}_k\\|}",
            description: "정규화",
          },
        ],
        examples: [
          {
            problem: "{(1, 1), (1, 0)}을 직교화하세요.",
            solution:
              "u₁ = (1, 1)\nproj = ⟨(1,0), (1,1)⟩/⟨(1,1), (1,1)⟩ × (1,1) = (1/2, 1/2)\nu₂ = (1, 0) - (1/2, 1/2) = (1/2, -1/2)",
          },
        ],
        applications: [
          { field: "수치 해석", description: "QR 분해" },
          { field: "신호처리", description: "직교 기저 생성" },
        ],
      },
      en: {
        definition:
          "The Gram-Schmidt process creates an orthonormal basis from linearly independent vectors.",
        formulas: [
          {
            latex: "\\vec{u}_k = \\vec{v}_k - \\sum_{j=1}^{k-1} \\text{proj}_{\\vec{u}_j}(\\vec{v}_k)",
            description: "kth orthogonal vector",
          },
          {
            latex: "\\hat{e}_k = \\frac{\\vec{u}_k}{\\|\\vec{u}_k\\|}",
            description: "Normalization",
          },
        ],
        examples: [
          {
            problem: "Orthogonalize {(1, 1), (1, 0)}.",
            solution:
              "u₁ = (1, 1)\nu₂ = (1, 0) - proj = (1/2, -1/2)",
          },
        ],
        applications: [
          { field: "Numerical Analysis", description: "QR decomposition" },
          { field: "Signal Processing", description: "Orthogonal basis generation" },
        ],
      },
    },
    relations: {
      prerequisites: ["orthogonality", "inner-product-spaces"],
      nextTopics: ["qr-decomposition"],
      related: ["projection"],
    },
    tags: ["그람슈미트", "직교화", "Gram-Schmidt", "orthogonalization"],
  },

  // ===== 6.5 행렬 분해 (Matrix Decomposition) =====
  {
    id: "diagonalization",
    name: {
      ko: "대각화",
      en: "Diagonalization",
      ja: "対角化",
    },
    field: "linear-algebra",
    subfield: "matrix-decomposition",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "대각화는 행렬을 대각행렬로 변환하는 것입니다. n개의 선형 독립인 고유벡터가 있으면 대각화 가능합니다.",
        formulas: [
          {
            latex: "A = PDP^{-1}",
            description: "대각화 (D는 대각행렬, P는 고유벡터 행렬)",
          },
          {
            latex: "A^n = PD^nP^{-1}",
            description: "행렬 거듭제곱 계산",
          },
        ],
        examples: [
          {
            problem: "A = [[4, 1], [2, 3]]를 대각화하세요.",
            solution:
              "고유값: λ = 5, 2\n고유벡터: v₁ = (1, 1), v₂ = (1, -2)\nP = [[1, 1], [1, -2]], D = [[5, 0], [0, 2]]",
          },
        ],
        applications: [
          { field: "미분방정식", description: "연립 미분방정식 풀이" },
          { field: "마르코프 체인", description: "정상 상태 계산" },
        ],
      },
      en: {
        definition:
          "Diagonalization transforms a matrix to diagonal form. A matrix is diagonalizable if it has n linearly independent eigenvectors.",
        formulas: [
          {
            latex: "A = PDP^{-1}",
            description: "Diagonalization (D is diagonal, P is eigenvector matrix)",
          },
          {
            latex: "A^n = PD^nP^{-1}",
            description: "Matrix power computation",
          },
        ],
        examples: [
          {
            problem: "Diagonalize A = [[4, 1], [2, 3]].",
            solution:
              "Eigenvalues: λ = 5, 2\nP = [[1, 1], [1, -2]], D = [[5, 0], [0, 2]]",
          },
        ],
        applications: [
          { field: "Differential Equations", description: "Solving systems of ODEs" },
          { field: "Markov Chains", description: "Steady state computation" },
        ],
      },
    },
    relations: {
      prerequisites: ["eigenvalues"],
      nextTopics: ["svd"],
      related: ["spectral-theorem"],
    },
    tags: ["대각화", "고유값분해", "diagonalization", "eigendecomposition"],
  },
  {
    id: "svd",
    name: {
      ko: "특이값 분해 (SVD)",
      en: "Singular Value Decomposition",
      ja: "特異値分解",
    },
    field: "linear-algebra",
    subfield: "matrix-decomposition",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "특이값 분해(SVD)는 모든 행렬을 세 행렬의 곱으로 분해합니다. 데이터 분석과 차원 축소에 핵심적입니다.",
        formulas: [
          {
            latex: "A = U\\Sigma V^T",
            description: "SVD (U, V는 직교행렬, Σ는 대각행렬)",
          },
          {
            latex: "\\sigma_i = \\sqrt{\\lambda_i(A^TA)}",
            description: "특이값 (AᵀA의 고유값의 제곱근)",
          },
        ],
        examples: [
          {
            problem: "SVD의 기하학적 의미를 설명하세요.",
            solution:
              "선형변환 A는 회전(V), 스케일링(Σ), 또 다른 회전(U)의 조합입니다.",
          },
        ],
        history: {
          discoveredBy: "유진 벨트라미, 카밀 조르단",
          year: "19세기 후반",
          background:
            "1960년대 수치 알고리즘 개발로 실용화되었습니다.",
        },
        applications: [
          { field: "추천 시스템", description: "잠재 요인 분석" },
          { field: "이미지 압축", description: "저랭크 근사" },
          { field: "자연어 처리", description: "잠재 의미 분석" },
        ],
      },
      en: {
        definition:
          "Singular Value Decomposition (SVD) factors any matrix into three matrices. It's fundamental to data analysis and dimensionality reduction.",
        formulas: [
          {
            latex: "A = U\\Sigma V^T",
            description: "SVD (U, V orthogonal, Σ diagonal)",
          },
          {
            latex: "\\sigma_i = \\sqrt{\\lambda_i(A^TA)}",
            description: "Singular values (square roots of eigenvalues of AᵀA)",
          },
        ],
        examples: [
          {
            problem: "Explain the geometric meaning of SVD.",
            solution:
              "Linear transformation A is a composition of rotation (V), scaling (Σ), and another rotation (U).",
          },
        ],
        history: {
          discoveredBy: "Eugenio Beltrami, Camille Jordan",
          year: "Late 19th century",
          background:
            "Became practical with numerical algorithms developed in the 1960s.",
        },
        applications: [
          { field: "Recommender Systems", description: "Latent factor analysis" },
          { field: "Image Compression", description: "Low-rank approximation" },
          { field: "NLP", description: "Latent semantic analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["eigenvalues", "orthogonality"],
      nextTopics: ["pca"],
      related: ["matrix-rank"],
    },
    tags: ["특이값분해", "SVD", "singular value decomposition"],
  },
  {
    id: "lu-decomposition",
    name: {
      ko: "LU 분해",
      en: "LU Decomposition",
      ja: "LU分解",
    },
    field: "linear-algebra",
    subfield: "matrix-decomposition",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "LU 분해는 행렬을 하삼각행렬(L)과 상삼각행렬(U)의 곱으로 분해합니다. 연립방정식을 효율적으로 풉니다.",
        formulas: [
          {
            latex: "A = LU",
            description: "LU 분해",
          },
          {
            latex: "PA = LU",
            description: "피봇팅을 사용한 LU 분해",
          },
        ],
        examples: [
          {
            problem: "Ax = b를 LU 분해로 푸는 과정을 설명하세요.",
            solution:
              "1. A = LU로 분해\n2. Ly = b를 전방 대입으로 풀이\n3. Ux = y를 후방 대입으로 풀이",
          },
        ],
        applications: [
          { field: "수치 해석", description: "연립방정식 풀이" },
          { field: "행렬식", description: "효율적인 det 계산" },
        ],
      },
      en: {
        definition:
          "LU decomposition factors a matrix into lower (L) and upper (U) triangular matrices. It efficiently solves linear systems.",
        formulas: [
          {
            latex: "A = LU",
            description: "LU decomposition",
          },
          {
            latex: "PA = LU",
            description: "LU with pivoting",
          },
        ],
        examples: [
          {
            problem: "Explain solving Ax = b using LU decomposition.",
            solution:
              "1. Factor A = LU\n2. Solve Ly = b by forward substitution\n3. Solve Ux = y by back substitution",
          },
        ],
        applications: [
          { field: "Numerical Analysis", description: "Solving linear systems" },
          { field: "Determinants", description: "Efficient det computation" },
        ],
      },
    },
    relations: {
      prerequisites: ["gaussian-elimination", "matrix-basics"],
      nextTopics: ["cholesky"],
      related: ["qr-decomposition"],
    },
    tags: ["LU분해", "삼각행렬", "LU decomposition", "triangular matrix"],
  },
  {
    id: "qr-decomposition",
    name: {
      ko: "QR 분해",
      en: "QR Decomposition",
      ja: "QR分解",
    },
    field: "linear-algebra",
    subfield: "matrix-decomposition",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "QR 분해는 행렬을 직교행렬(Q)과 상삼각행렬(R)의 곱으로 분해합니다. 최소제곱 문제와 고유값 계산에 사용됩니다.",
        formulas: [
          {
            latex: "A = QR",
            description: "QR 분해 (Q는 직교, R은 상삼각)",
          },
          {
            latex: "Q^TQ = I",
            description: "Q의 직교성",
          },
        ],
        examples: [
          {
            problem: "QR 분해가 최소제곱 문제에 어떻게 사용되는지 설명하세요.",
            solution:
              "Ax ≈ b의 최소제곱해: A = QR일 때\nRx = Q^Tb를 풀면 됩니다.",
          },
        ],
        applications: [
          { field: "최소제곱법", description: "선형 회귀" },
          { field: "수치 해석", description: "고유값 알고리즘" },
        ],
      },
      en: {
        definition:
          "QR decomposition factors a matrix into an orthogonal matrix (Q) and upper triangular matrix (R). Used for least squares and eigenvalue computation.",
        formulas: [
          {
            latex: "A = QR",
            description: "QR decomposition (Q orthogonal, R upper triangular)",
          },
        ],
        examples: [
          {
            problem: "How is QR used for least squares?",
            solution:
              "For Ax ≈ b: with A = QR\nSolve Rx = Q^Tb",
          },
        ],
        applications: [
          { field: "Least Squares", description: "Linear regression" },
          { field: "Numerical Analysis", description: "Eigenvalue algorithms" },
        ],
      },
    },
    relations: {
      prerequisites: ["gram-schmidt", "matrix-basics"],
      nextTopics: ["eigenvalue-algorithms"],
      related: ["lu-decomposition"],
    },
    tags: ["QR분해", "직교행렬", "QR decomposition", "orthogonal matrix"],
  },
];
