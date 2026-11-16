import type { MathConcept } from '../types';

export const harmonicAnalysisConcepts: MathConcept[] = [
  {
    id: 'fourier-series-advanced',
    name: {
      ko: '푸리에 급수 심화',
      en: 'Fourier Series (Advanced)',
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 4,
    content: {
      ko: '주기함수를 삼각함수의 급수로 전개합니다. 제곱 적분 가능한 함수의 푸리에 급수는 L² 의미로 수렴하지만, 모든 점에서 수렴하는 것은 아닙니다.',
      en: 'Expands periodic functions in trigonometric series. For square-integrable functions, the Fourier series converges in L², but not necessarily at every point.',
    },
    latex:
      'f = \\sum_{n\\in\\mathbb Z} c_n e^{inx}\\ (L^2), \\quad \\sum_{n\\in\\mathbb Z}|c_n|^2 = \\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi}|f(x)|^2 dx \\quad (f\\in L^2([-\\pi,\\pi]))',
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
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 4,
    content: {
      ko: '함수를 주파수 영역으로 변환합니다. 아래 적분식과 플랑슈렐 등식은 예를 들어 f가 L¹과 L²에 모두 속할 때 성립합니다. 변환은 L² 전체로 확장할 수 있습니다.',
      en: 'Transforms functions to the frequency domain. The integral formula and Plancherel identity below hold, for example, when f belongs to both L¹ and L²; the transform extends to all of L².',
    },
    latex:
      '\\hat{f}(\\xi) = \\int_{\\mathbb{R}^n} f(x)e^{-2\\pi i x \\cdot \\xi}dx, \\quad \\|\\hat{f}\\|_2 = \\|f\\|_2 \\quad (f\\in L^1\\cap L^2)',
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
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 5,
    content: {
      ko: '시험함수 공간 위의 연속 선형 범함수입니다. 디랙 델타 같은 특이 객체를 미분 가능하게 다룹니다.',
      en: 'Continuous linear functionals on test function spaces. Allows differentiation of singular objects like Dirac delta.',
    },
    latex:
      "\\langle T',\\phi\\rangle=-\\langle T,\\phi'\\rangle,\\quad \\frac{1}{\\epsilon}\\rho(x/\\epsilon)\\xrightarrow[\\epsilon\\to0^+]{}\\delta\\ \\text{in distributions}\\quad(\\rho\\in C_c^\\infty(\\mathbb{R}),\\ \\int\\rho=1)",
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
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 4,
    content: {
      ko: '국소화된 진동 함수의 족입니다. 시간-주파수 분석에서 푸리에 분석의 한계를 보완합니다.',
      en: 'A family of localized oscillating functions. Complements limitations of Fourier analysis in time-frequency analysis.',
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
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 4,
    content: {
      ko: '구면 위 라플라시안의 고유함수입니다. 적절히 고른 정규직교 구면 조화 함수들은 구면 위 제곱 적분 가능 함수 공간의 기저를 이룹니다.',
      en: 'Eigenfunctions of the Laplacian on the sphere. A suitable orthonormal choice forms a basis for the square-integrable functions on the sphere.',
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
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 5,
    content: {
      ko: '커널이 특이점을 갖는 적분 연산자입니다. 힐베르트 변환과 칼데론-지그문트 이론이 핵심입니다.',
      en: 'Integral operators with singular kernels. Hilbert transform and Calderón-Zygmund theory are central.',
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
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 5,
    content: {
      ko: '국소 콤팩트 아벨 군 위에서 푸리에 해석을 일반화합니다. 폰트랴긴 쌍대성이 핵심 정리입니다.',
      en: 'Generalizes Fourier analysis to locally compact abelian groups. Pontryagin duality is the key theorem.',
    },
    latex: '\\hat{G} = \\text{Hom}_{\\mathrm{cont}}(G, S^1), \\quad \\hat{\\hat{G}} \\cong G',
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
    },
    field: 'analysis',
    subfield: 'harmonic-analysis',
    difficulty: 5,
    content: {
      ko: '함수를 주파수 대역별로 분해하는 이론입니다. 아래 비교식은 표준 리틀우드-페일리 분해에서 1<p<∞일 때 성립합니다.',
      en: 'A theory decomposing functions into frequency bands. The comparison below holds for a standard Littlewood–Paley decomposition when 1<p<∞.',
    },
    latex:
      '\\|f\\|_{L^p} \\sim \\left\\|\\left(\\sum_j |P_j f|^2\\right)^{1/2}\\right\\|_{L^p}, \\quad 1<p<\\infty',
    relations: {
      prerequisites: ['fourier-transform-advanced', 'functional-analysis'],
      nextTopics: ['besov-spaces', 'triebel-lizorkin'],
      related: ['dyadic-decomposition', 'square-function'],
      applications: ['pde', 'interpolation-theory'],
    },
    tags: ['harmonic-analysis', 'decomposition', 'function-spaces'],
  },
];
