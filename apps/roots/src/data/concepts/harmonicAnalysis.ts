import type { MathConcept } from '../types';

export const harmonicAnalysisConcepts: MathConcept[] = [
  {
    id: 'fourier-series-advanced',
    name: {
      ko: '푸리에 급수 심화',
      en: 'Fourier Series (Advanced)',
      ja: 'フーリエ級数（発展）',
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 4,
    content: {
      ko: '주기함수를 삼각함수의 급수로 전개합니다. 수렴 조건, 기브스 현상, 파세발 정리가 핵심 주제입니다.',
      en: "Expansion of periodic functions as series of trigonometric functions. Convergence conditions, Gibbs phenomenon, and Parseval's theorem are key topics.",
      ja: '周期関数を三角関数の級数に展開します。収束条件、ギブス現象、パーセバル定理が核心的主題です。',
    },
    latex:
      'f(x) = \\sum_{n=-\\infty}^{\\infty} c_n e^{inx}, \\quad \\sum|c_n|^2 = \\frac{1}{2\\pi}\\int|f|^2 dx',
    relations: {
      prerequisites: ['fourier-series', 'convergence'],
      nextTopics: ['fourier-transform-advanced', 'distribution-theory'],
      related: ['parseval-theorem', 'fejer-kernel'],
      applications: ['signal-processing', 'heat-equation'],
    },
    tags: ['harmonic-analysis', 'fourier', 'series'],
  },
  {
    id: 'fourier-transform-advanced',
    name: {
      ko: '푸리에 변환 심화',
      en: 'Fourier Transform (Advanced)',
      ja: 'フーリエ変換（発展）',
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 4,
    content: {
      ko: '함수를 주파수 영역으로 변환합니다. 슈워츠 공간, 플랑슈렐 정리, 역변환이 핵심입니다.',
      en: 'Transforms functions to frequency domain. Schwartz space, Plancherel theorem, and inverse transform are essential.',
      ja: '関数を周波数領域に変換します。シュワルツ空間、プランシュレル定理、逆変換が核心です。',
    },
    latex:
      '\\hat{f}(\\xi) = \\int_{\\mathbb{R}^n} f(x)e^{-2\\pi i x \\cdot \\xi}dx, \\quad \\|\\hat{f}\\|_2 = \\|f\\|_2',
    relations: {
      prerequisites: ['fourier-transform', 'lebesgue-integral'],
      nextTopics: ['distribution-theory', 'wavelets'],
      related: ['convolution-theorem', 'uncertainty-principle'],
      applications: ['quantum-mechanics', 'image-processing', 'pde'],
    },
    tags: ['harmonic-analysis', 'fourier', 'transform'],
  },
  {
    id: 'distribution-theory',
    name: {
      ko: '초함수론',
      en: 'Distribution Theory',
      ja: '超関数論',
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 5,
    content: {
      ko: '시험함수 공간 위의 연속 선형 범함수입니다. 디랙 델타 같은 특이 객체를 미분 가능하게 다룹니다.',
      en: 'Continuous linear functionals on test function spaces. Allows differentiation of singular objects like Dirac delta.',
      ja: 'テスト関数空間上の連続線形汎関数です。ディラックデルタのような特異対象を微分可能に扱います。',
    },
    latex:
      "\\langle T, \\phi \\rangle, \\quad \\langle T', \\phi \\rangle = -\\langle T, \\phi' \\rangle, \\quad \\delta(x) = \\lim_{\\epsilon \\to 0} \\frac{1}{\\epsilon}\\phi(x/\\epsilon)",
    relations: {
      prerequisites: ['functional-analysis', 'test-functions'],
      nextTopics: ['sobolev-spaces', 'pseudodifferential-operators'],
      related: ['schwartz-space', 'tempered-distributions'],
      applications: ['pde', 'quantum-field-theory'],
    },
    tags: ['harmonic-analysis', 'distribution', 'generalized-function'],
  },
  {
    id: 'wavelets',
    name: {
      ko: '웨이블릿',
      en: 'Wavelets',
      ja: 'ウェーブレット',
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 4,
    content: {
      ko: '국소화된 진동 함수의 족입니다. 시간-주파수 분석에서 푸리에 분석의 한계를 보완합니다.',
      en: 'A family of localized oscillating functions. Complements limitations of Fourier analysis in time-frequency analysis.',
      ja: '局所化された振動関数の族です。時間-周波数分析でフーリエ分析の限界を補完します。',
    },
    latex:
      '\\psi_{a,b}(t) = \\frac{1}{\\sqrt{|a|}}\\psi\\left(\\frac{t-b}{a}\\right), \\quad \\int \\psi(t)dt = 0',
    relations: {
      prerequisites: ['fourier-transform-advanced', 'inner-product'],
      nextTopics: ['multiresolution-analysis', 'discrete-wavelet'],
      related: ['haar-wavelet', 'daubechies-wavelet'],
      applications: ['image-compression', 'denoising', 'data-analysis'],
    },
    tags: ['harmonic-analysis', 'wavelet', 'time-frequency'],
  },
  {
    id: 'spherical-harmonics',
    name: {
      ko: '구면 조화 함수',
      en: 'Spherical Harmonics',
      ja: '球面調和関数',
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 4,
    content: {
      ko: '구면 위 라플라시안의 고유함수입니다. 구면 위 함수의 정규직교 기저를 형성합니다.',
      en: 'Eigenfunctions of the Laplacian on the sphere. Form an orthonormal basis for functions on the sphere.',
      ja: '球面上のラプラシアンの固有関数です。球面上の関数の正規直交基底を形成します。',
    },
    latex: 'Y_l^m(\\theta, \\phi), \\quad \\Delta_{S^2} Y_l^m = -l(l+1)Y_l^m',
    relations: {
      prerequisites: ['laplacian', 'orthonormal-basis'],
      nextTopics: ['representation-theory', 'quantum-angular-momentum'],
      related: ['legendre-polynomials', 'zonal-harmonics'],
      applications: ['quantum-mechanics', 'geophysics', 'computer-graphics'],
    },
    tags: ['harmonic-analysis', 'spherical', 'eigenfunction'],
  },
  {
    id: 'singular-integrals',
    name: {
      ko: '특이 적분',
      en: 'Singular Integrals',
      ja: '特異積分',
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 5,
    content: {
      ko: '커널이 특이점을 갖는 적분 연산자입니다. 힐베르트 변환과 칼데론-지그문트 이론이 핵심입니다.',
      en: 'Integral operators with singular kernels. Hilbert transform and Calderón-Zygmund theory are central.',
      ja: 'カーネルが特異点を持つ積分作用素です。ヒルベルト変換とカルデロン・ジグムント理論が核心です。',
    },
    latex: 'Tf(x) = \\text{p.v.} \\int K(x-y)f(y)dy, \\quad |K(x)| \\leq \\frac{C}{|x|^n}',
    relations: {
      prerequisites: ['lebesgue-integral', 'operator-theory'],
      nextTopics: ['calderon-zygmund', 'bmo-space'],
      related: ['hilbert-transform', 'riesz-transform'],
      applications: ['pde', 'complex-analysis'],
    },
    tags: ['harmonic-analysis', 'singular', 'operator'],
  },
  {
    id: 'fourier-analysis-groups',
    name: {
      ko: '군 위의 푸리에 해석',
      en: 'Fourier Analysis on Groups',
      ja: '群上のフーリエ解析',
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 5,
    content: {
      ko: '국소 콤팩트 아벨 군 위에서 푸리에 해석을 일반화합니다. 폰트랴긴 쌍대성이 핵심 정리입니다.',
      en: 'Generalizes Fourier analysis to locally compact abelian groups. Pontryagin duality is the key theorem.',
      ja: '局所コンパクトアーベル群上でフーリエ解析を一般化します。ポントリャーギン双対性が核心定理です。',
    },
    latex: '\\hat{G} = \\text{Hom}(G, S^1), \\quad \\hat{\\hat{G}} \\cong G',
    relations: {
      prerequisites: ['group-theory', 'fourier-transform-advanced'],
      nextTopics: ['noncommutative-harmonic-analysis', 'representation-theory'],
      related: ['character-group', 'haar-measure'],
      applications: ['number-theory', 'signal-processing'],
    },
    tags: ['harmonic-analysis', 'group', 'duality'],
  },
  {
    id: 'littlewood-paley-theory',
    name: {
      ko: '리틀우드-페일리 이론',
      en: 'Littlewood-Paley Theory',
      ja: 'リトルウッド・ペイリー理論',
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 5,
    content: {
      ko: '함수를 주파수 대역별로 분해하는 이론입니다. 여러 함수 공간의 특성화와 조화해석에 필수적입니다.',
      en: 'Theory decomposing functions by frequency bands. Essential for characterizing function spaces and harmonic analysis.',
      ja: '関数を周波数帯域ごとに分解する理論です。様々な関数空間の特徴付けと調和解析に必須です。',
    },
    latex: '\\|f\\|_{L^p} \\sim \\left\\|\\left(\\sum_j |P_j f|^2\\right)^{1/2}\\right\\|_{L^p}',
    relations: {
      prerequisites: ['fourier-transform-advanced', 'functional-analysis'],
      nextTopics: ['besov-spaces', 'triebel-lizorkin'],
      related: ['dyadic-decomposition', 'square-function'],
      applications: ['pde', 'interpolation-theory'],
    },
    tags: ['harmonic-analysis', 'decomposition', 'function-spaces'],
  },
];
