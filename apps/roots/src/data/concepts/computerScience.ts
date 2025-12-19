/**
 * @fileoverview 컴퓨터과학 수학 개념 데이터
 */
import type { MathConcept } from '../types';

export const computerScienceConcepts: MathConcept[] = [
  {
    id: 'big-o-notation',
    name: {
      ko: 'Big-O 표기법',
      en: 'Big-O Notation',
    },
    field: 'applied-cs',
    subfield: 'complexity',
    difficulty: 3,
    content: {
      ko: {
        definition:
          'Big-O 표기법은 알고리즘의 시간/공간 복잡도를 입력 크기에 따른 증가율로 표현합니다. 최악의 경우를 나타냅니다.',
        formulas: [
          {
            latex: 'O(1) < O(\\log n) < O(n) < O(n\\log n) < O(n^2) < O(2^n) < O(n!)',
            description: '복잡도 순서',
          },
          {
            latex:
              'f(n) = O(g(n)) \\Leftrightarrow \\exists c, n_0: f(n) \\leq c \\cdot g(n), \\forall n > n_0',
            description: 'Big-O 정의',
          },
        ],
        examples: [
          {
            problem: '배열에서 특정 값 찾기의 복잡도는?',
            solution: '선형 탐색: O(n), 이진 탐색(정렬된 경우): O(log n)',
          },
          {
            problem: '3n² + 5n + 1의 Big-O는?',
            solution: 'O(n²) - 최고차항만 남김',
          },
        ],
        applications: [
          { field: '알고리즘 설계', description: '효율적인 알고리즘 선택' },
          { field: '면접', description: '코딩 인터뷰 필수 지식' },
          { field: '시스템 설계', description: '확장성 분석' },
        ],
      },
      en: {
        definition:
          'Big-O notation expresses algorithm complexity as growth rate relative to input size. Represents worst case.',
        formulas: [
          {
            latex: 'O(1) < O(\\log n) < O(n) < O(n\\log n) < O(n^2) < O(2^n) < O(n!)',
            description: 'Complexity order',
          },
          {
            latex:
              'f(n) = O(g(n)) \\Leftrightarrow \\exists c, n_0: f(n) \\leq c \\cdot g(n), \\forall n > n_0',
            description: 'Big-O definition',
          },
        ],
        examples: [
          {
            problem: 'Complexity of finding value in array?',
            solution: 'Linear search: O(n), Binary search (sorted): O(log n)',
          },
          {
            problem: 'Big-O of 3n² + 5n + 1?',
            solution: 'O(n²) - keep highest order term',
          },
        ],
        applications: [
          { field: 'Algorithm Design', description: 'Choosing efficient algorithms' },
          { field: 'Interviews', description: 'Essential coding interview knowledge' },
          { field: 'System Design', description: 'Scalability analysis' },
        ],
      },
    },
    relations: {
      prerequisites: ['limits', 'logarithm'],
      nextTopics: ['sorting-algorithms', 'data-structures'],
      related: ['recurrence-relations'],
    },
    tags: ['복잡도', '알고리즘', 'Big-O', 'complexity'],
  },
  {
    id: 'binary-representation',
    name: {
      ko: '이진 표현',
      en: 'Binary Representation',
    },
    field: 'applied-cs',
    subfield: 'fundamentals',
    difficulty: 2,
    content: {
      ko: {
        definition:
          '이진법은 0과 1만으로 수를 표현하는 체계입니다. 컴퓨터의 모든 데이터는 내부적으로 이진수로 저장됩니다.',
        formulas: [
          {
            latex: '(a_n a_{n-1}...a_1 a_0)_2 = \\sum_{i=0}^{n} a_i \\cdot 2^i',
            description: '이진수를 십진수로 변환',
          },
          {
            latex: '1 \\text{ byte} = 8 \\text{ bits} = 2^8 = 256 \\text{ values}',
            description: '바이트와 비트',
          },
          {
            latex: '\\text{AND, OR, XOR, NOT}',
            description: '비트 연산',
          },
        ],
        examples: [
          {
            problem: '이진수 1101을 십진수로 변환하세요.',
            solution: '1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8+4+0+1 = 13',
          },
          {
            problem: '십진수 25를 이진수로 변환하세요.',
            solution: '25 = 16+8+1 = 2⁴+2³+2⁰ = 11001₂',
          },
        ],
        applications: [
          { field: '하드웨어', description: 'CPU, 메모리 동작' },
          { field: '네트워크', description: 'IP 주소, 서브넷' },
          { field: '그래픽', description: 'RGB 색상 표현' },
        ],
      },
      en: {
        definition:
          'Binary uses only 0 and 1 to represent numbers. All computer data is internally stored as binary.',
        formulas: [
          {
            latex: '(a_n a_{n-1}...a_1 a_0)_2 = \\sum_{i=0}^{n} a_i \\cdot 2^i',
            description: 'Binary to decimal conversion',
          },
          {
            latex: '1 \\text{ byte} = 8 \\text{ bits} = 2^8 = 256 \\text{ values}',
            description: 'Bytes and bits',
          },
          {
            latex: '\\text{AND, OR, XOR, NOT}',
            description: 'Bitwise operations',
          },
        ],
        examples: [
          {
            problem: 'Convert binary 1101 to decimal.',
            solution: '1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8+4+0+1 = 13',
          },
          {
            problem: 'Convert decimal 25 to binary.',
            solution: '25 = 16+8+1 = 2⁴+2³+2⁰ = 11001₂',
          },
        ],
        applications: [
          { field: 'Hardware', description: 'CPU, memory operation' },
          { field: 'Networking', description: 'IP addresses, subnets' },
          { field: 'Graphics', description: 'RGB color representation' },
        ],
      },
    },
    relations: {
      prerequisites: ['exponents'],
      nextTopics: ['floating-point', 'bitwise-operations'],
      related: ['hexadecimal', 'octal'],
    },
    tags: ['이진법', '비트', 'binary', 'computer'],
  },
  {
    id: 'computer-graphics-math',
    name: {
      ko: '컴퓨터 그래픽스 수학',
      en: 'Computer Graphics Mathematics',
    },
    field: 'applied-cs',
    subfield: 'graphics',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '컴퓨터 그래픽스는 선형대수(행렬 변환), 기하학, 미적분학을 활용하여 2D/3D 이미지를 생성합니다.',
        formulas: [
          {
            latex:
              "\\begin{pmatrix} x' \\\\ y' \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} a & b & t_x \\\\ c & d & t_y \\\\ 0 & 0 & 1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\\\ 1 \\end{pmatrix}",
            description: '2D 아핀 변환 (동차좌표)',
          },
          {
            latex:
              'R_z(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}',
            description: 'Z축 회전 행렬',
          },
          {
            latex: '\\vec{n} \\cdot \\vec{l} = |\\vec{n}||\\vec{l}|\\cos\\theta',
            description: '램버트 조명 (내적 활용)',
          },
        ],
        examples: [
          {
            problem: '점 (3,2)를 원점 기준 90° 회전하면?',
            solution: "(x',y') = (3cos90° - 2sin90°, 3sin90° + 2cos90°) = (-2, 3)",
          },
          {
            problem: '2배 확대 후 (5,3) 이동하는 행렬은?',
            solution: 'Scale(2) × Translate(5,3) 순서로 행렬 곱',
          },
        ],
        applications: [
          { field: '게임', description: '캐릭터/카메라 변환' },
          { field: '영화', description: 'VFX, 3D 렌더링' },
          { field: 'CAD', description: '설계 도구' },
        ],
      },
      en: {
        definition:
          'Computer graphics uses linear algebra (matrix transforms), geometry, and calculus to generate 2D/3D images.',
        formulas: [
          {
            latex:
              "\\begin{pmatrix} x' \\\\ y' \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} a & b & t_x \\\\ c & d & t_y \\\\ 0 & 0 & 1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\\\ 1 \\end{pmatrix}",
            description: '2D affine transform (homogeneous)',
          },
          {
            latex:
              'R_z(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}',
            description: 'Z-axis rotation matrix',
          },
          {
            latex: '\\vec{n} \\cdot \\vec{l} = |\\vec{n}||\\vec{l}|\\cos\\theta',
            description: 'Lambert lighting (dot product)',
          },
        ],
        examples: [
          {
            problem: 'Rotate point (3,2) by 90° around origin?',
            solution: "(x',y') = (3cos90° - 2sin90°, 3sin90° + 2cos90°) = (-2, 3)",
          },
          {
            problem: 'Matrix for 2× scale then translate (5,3)?',
            solution: 'Scale(2) × Translate(5,3) matrix multiplication',
          },
        ],
        applications: [
          { field: 'Games', description: 'Character/camera transforms' },
          { field: 'Film', description: 'VFX, 3D rendering' },
          { field: 'CAD', description: 'Design tools' },
        ],
      },
    },
    relations: {
      prerequisites: ['matrix', 'trigonometry', 'vectors'],
      nextTopics: ['ray-tracing', 'shaders'],
      related: ['linear-transformations'],
    },
    tags: ['그래픽스', '행렬', 'graphics', 'transformation'],
  },
  {
    id: 'information-theory-basics',
    name: {
      ko: '정보 이론 기초',
      en: 'Information Theory Basics',
    },
    field: 'applied-cs',
    subfield: 'information',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '정보 이론은 정보의 양과 전송을 수학적으로 다룹니다. 데이터 압축과 통신의 이론적 기반입니다.',
        formulas: [
          {
            latex: 'H(X) = -\\sum_{i} p_i \\log_2 p_i',
            description: '샤논 엔트로피',
          },
          {
            latex: 'I(x) = -\\log_2 p(x)',
            description: '정보량 (비트)',
          },
          {
            latex: 'C = B \\log_2(1 + \\frac{S}{N})',
            description: '샤논-하틀리 정리 (채널 용량)',
          },
        ],
        examples: [
          {
            problem: '공정한 동전의 엔트로피는?',
            solution: 'H = -½log₂(½) - ½log₂(½) = 1 비트',
          },
          {
            problem: '8개 동일 확률 결과의 엔트로피는?',
            solution: 'H = -8 × (1/8)log₂(1/8) = log₂(8) = 3 비트',
          },
        ],
        history: {
          discoveredBy: '클로드 섀넌',
          year: '1948년',
          background: "벨 연구소에서 발표한 '통신의 수학적 이론'으로 정보 시대의 기초를 놓음",
        },
        applications: [
          { field: '압축', description: 'ZIP, MP3, JPEG 알고리즘' },
          { field: '통신', description: '채널 코딩' },
          { field: '머신러닝', description: '교차 엔트로피 손실' },
        ],
      },
      en: {
        definition:
          'Information theory mathematically studies information quantity and transmission. Foundation of compression and communication.',
        formulas: [
          {
            latex: 'H(X) = -\\sum_{i} p_i \\log_2 p_i',
            description: 'Shannon entropy',
          },
          {
            latex: 'I(x) = -\\log_2 p(x)',
            description: 'Information content (bits)',
          },
          {
            latex: 'C = B \\log_2(1 + \\frac{S}{N})',
            description: 'Shannon-Hartley theorem (channel capacity)',
          },
        ],
        examples: [
          {
            problem: 'Entropy of fair coin?',
            solution: 'H = -½log₂(½) - ½log₂(½) = 1 bit',
          },
          {
            problem: 'Entropy of 8 equally likely outcomes?',
            solution: 'H = -8 × (1/8)log₂(1/8) = log₂(8) = 3 bits',
          },
        ],
        history: {
          discoveredBy: 'Claude Shannon',
          year: '1948',
          background:
            "Published 'Mathematical Theory of Communication' at Bell Labs, founding information age",
        },
        applications: [
          { field: 'Compression', description: 'ZIP, MP3, JPEG algorithms' },
          { field: 'Communication', description: 'Channel coding' },
          { field: 'Machine Learning', description: 'Cross-entropy loss' },
        ],
      },
    },
    relations: {
      prerequisites: ['logarithm', 'probability-basics'],
      nextTopics: ['huffman-coding', 'error-correction'],
      related: ['cryptography-math'],
    },
    tags: ['정보이론', '엔트로피', 'information theory', 'Shannon'],
  },
  {
    id: 'machine-learning-math',
    name: {
      ko: '머신러닝 수학',
      en: 'Machine Learning Mathematics',
    },
    field: 'applied-cs',
    subfield: 'ml',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '머신러닝은 선형대수, 미적분, 확률/통계를 기반으로 데이터에서 패턴을 학습합니다.',
        formulas: [
          {
            latex: '\\hat{y} = \\sigma(\\vec{w} \\cdot \\vec{x} + b)',
            description: '뉴런 출력 (활성화 함수 σ)',
          },
          {
            latex: 'L = -\\sum_i y_i \\log(\\hat{y}_i)',
            description: '교차 엔트로피 손실',
          },
          {
            latex: '\\vec{w} \\leftarrow \\vec{w} - \\alpha \\nabla_w L',
            description: '경사하강법 업데이트',
          },
          {
            latex: 'P(y|x) = \\frac{P(x|y)P(y)}{P(x)}',
            description: '베이즈 분류',
          },
        ],
        examples: [
          {
            problem: '시그모이드 σ(0)의 값은?',
            solution: 'σ(0) = 1/(1+e⁰) = 1/2 = 0.5',
          },
          {
            problem: '선형회귀의 손실함수는?',
            solution: 'MSE = (1/n)Σ(yᵢ - ŷᵢ)²',
          },
        ],
        applications: [
          { field: '이미지 인식', description: 'CNN, 컴퓨터 비전' },
          { field: '자연어 처리', description: '번역, 챗봇' },
          { field: '추천 시스템', description: '넷플릭스, 유튜브' },
        ],
      },
      en: {
        definition:
          'ML uses linear algebra, calculus, probability/statistics to learn patterns from data.',
        formulas: [
          {
            latex: '\\hat{y} = \\sigma(\\vec{w} \\cdot \\vec{x} + b)',
            description: 'Neuron output (activation σ)',
          },
          {
            latex: 'L = -\\sum_i y_i \\log(\\hat{y}_i)',
            description: 'Cross-entropy loss',
          },
          {
            latex: '\\vec{w} \\leftarrow \\vec{w} - \\alpha \\nabla_w L',
            description: 'Gradient descent update',
          },
          {
            latex: 'P(y|x) = \\frac{P(x|y)P(y)}{P(x)}',
            description: 'Bayes classification',
          },
        ],
        examples: [
          {
            problem: 'Value of sigmoid σ(0)?',
            solution: 'σ(0) = 1/(1+e⁰) = 1/2 = 0.5',
          },
          {
            problem: 'Loss function for linear regression?',
            solution: 'MSE = (1/n)Σ(yᵢ - ŷᵢ)²',
          },
        ],
        applications: [
          { field: 'Image Recognition', description: 'CNN, computer vision' },
          { field: 'NLP', description: 'Translation, chatbots' },
          { field: 'Recommendations', description: 'Netflix, YouTube' },
        ],
      },
    },
    relations: {
      prerequisites: ['matrix', 'partial-derivative', 'probability-basics', 'gradient-descent'],
      nextTopics: ['deep-learning', 'backpropagation'],
      related: ['optimization', 'statistics'],
    },
    tags: ['머신러닝', '딥러닝', 'machine learning', 'AI'],
  },
  {
    id: 'hashing-math',
    name: {
      ko: '해싱의 수학',
      en: 'Mathematics of Hashing',
    },
    field: 'applied-cs',
    subfield: 'data-structures',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '해시 함수는 임의 크기 데이터를 고정 크기로 매핑합니다. 빠른 검색과 데이터 무결성 확인에 사용됩니다.',
        formulas: [
          {
            latex: 'h(k) = k \\mod m',
            description: '나눗셈 해시 (테이블 크기 m)',
          },
          {
            latex: 'h(k) = \\lfloor m(kA \\mod 1) \\rfloor',
            description: '곱셈 해시 (A는 상수)',
          },
          {
            latex: 'P(\\text{충돌}) \\approx \\frac{n^2}{2m}',
            description: '생일 역설 (n개 항목, m개 슬롯)',
          },
        ],
        examples: [
          {
            problem: '테이블 크기 10에서 h(27)은?',
            solution: 'h(27) = 27 mod 10 = 7',
          },
          {
            problem: '365일 중 23명이면 생일 충돌 확률은?',
            solution: '약 50% (생일 역설)',
          },
        ],
        applications: [
          { field: '데이터베이스', description: '해시 테이블, 인덱싱' },
          { field: '보안', description: '비밀번호 저장, SHA' },
          { field: '블록체인', description: '작업 증명' },
        ],
      },
      en: {
        definition:
          'Hash functions map arbitrary data to fixed size. Used for fast lookup and data integrity.',
        formulas: [
          {
            latex: 'h(k) = k \\mod m',
            description: 'Division hash (table size m)',
          },
          {
            latex: 'h(k) = \\lfloor m(kA \\mod 1) \\rfloor',
            description: 'Multiplication hash (constant A)',
          },
          {
            latex: 'P(\\text{collision}) \\approx \\frac{n^2}{2m}',
            description: 'Birthday paradox (n items, m slots)',
          },
        ],
        examples: [
          {
            problem: 'h(27) with table size 10?',
            solution: 'h(27) = 27 mod 10 = 7',
          },
          {
            problem: 'Probability of shared birthday among 23 people?',
            solution: 'About 50% (birthday paradox)',
          },
        ],
        applications: [
          { field: 'Databases', description: 'Hash tables, indexing' },
          { field: 'Security', description: 'Password storage, SHA' },
          { field: 'Blockchain', description: 'Proof of work' },
        ],
      },
    },
    relations: {
      prerequisites: ['modular-arithmetic', 'probability-basics'],
      nextTopics: ['cryptographic-hash', 'bloom-filters'],
      related: ['birthday-paradox'],
    },
    tags: ['해시', '자료구조', 'hashing', 'data structures'],
  },
];
