/**
 * @fileoverview 복소해석학 개념 데이터
 */
import type { MathConcept } from '../types';

export const complexAnalysisConcepts: MathConcept[] = [
  {
    id: 'complex-functions',
    name: {
      ko: '복소함수',
      en: 'Complex Functions',
    },
    field: 'complex-analysis',
    subfield: 'functions',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '복소함수는 복소수에서 복소수로의 함수입니다. f(z) = u(x,y) + iv(x,y)로 실수부와 허수부로 분해됩니다.',
        formulas: [
          {
            latex: 'f(z) = f(x + iy) = u(x,y) + iv(x,y)',
            description: '복소함수의 분해',
          },
          {
            latex: 'e^z = e^x(\\cos y + i\\sin y)',
            description: '복소 지수함수',
          },
          {
            latex:
              '\\sin z = \\frac{e^{iz} - e^{-iz}}{2i}, \\quad \\cos z = \\frac{e^{iz} + e^{-iz}}{2}',
            description: '복소 삼각함수',
          },
        ],
        examples: [
          {
            problem: 'f(z) = z²의 실수부와 허수부를 구하세요.',
            solution:
              'z = x + iy일 때, z² = (x+iy)² = x² - y² + 2ixy. u(x,y) = x² - y², v(x,y) = 2xy.',
          },
          {
            problem: 'e^(iπ)의 값은?',
            solution: 'e^(iπ) = cos(π) + i·sin(π) = -1 + 0i = -1 (오일러 등식)',
          },
        ],
        history: {
          discoveredBy: '레온하르트 오일러',
          year: '1748년',
          background:
            '오일러가 e^(iθ) = cos θ + i sin θ를 발견하며 복소해석학의 기초를 놓았습니다.',
        },
        applications: [
          { field: '전자공학', description: 'AC 회로 분석' },
          { field: '신호처리', description: '푸리에 변환' },
          { field: '양자역학', description: '파동함수' },
        ],
      },
      en: {
        definition:
          'A complex function maps complex numbers to complex numbers. f(z) = u(x,y) + iv(x,y) decomposes into real and imaginary parts.',
        formulas: [
          {
            latex: 'f(z) = f(x + iy) = u(x,y) + iv(x,y)',
            description: 'Decomposition of complex function',
          },
          {
            latex: 'e^z = e^x(\\cos y + i\\sin y)',
            description: 'Complex exponential',
          },
          {
            latex:
              '\\sin z = \\frac{e^{iz} - e^{-iz}}{2i}, \\quad \\cos z = \\frac{e^{iz} + e^{-iz}}{2}',
            description: 'Complex trigonometric functions',
          },
        ],
        examples: [
          {
            problem: 'Find real and imaginary parts of f(z) = z².',
            solution:
              'For z = x + iy, z² = (x+iy)² = x² - y² + 2ixy. u(x,y) = x² - y², v(x,y) = 2xy.',
          },
          {
            problem: 'What is e^(iπ)?',
            solution: "e^(iπ) = cos(π) + i·sin(π) = -1 + 0i = -1 (Euler's identity)",
          },
        ],
        history: {
          discoveredBy: 'Leonhard Euler',
          year: '1748',
          background:
            'Euler discovered e^(iθ) = cos θ + i sin θ, laying foundations for complex analysis.',
        },
        applications: [
          { field: 'Electrical Engineering', description: 'AC circuit analysis' },
          { field: 'Signal Processing', description: 'Fourier transform' },
          { field: 'Quantum Mechanics', description: 'Wave functions' },
        ],
      },
    },
    relations: {
      prerequisites: ['complex-numbers', 'functions'],
      nextTopics: ['cauchy-riemann', 'analytic-functions'],
      related: ['euler-formula'],
    },
    tags: ['복소함수', '오일러', 'complex function', 'Euler'],
  },
  {
    id: 'cauchy-riemann',
    name: {
      ko: '코시-리만 방정식',
      en: 'Cauchy-Riemann Equations',
    },
    field: 'complex-analysis',
    subfield: 'analyticity',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '복소함수가 한 점에서 미분 가능하면 코시-리만 방정식이 성립합니다. 편미분이 그 점 주변에서 연속이고 방정식이 그 점에서 성립하면 미분 가능합니다. 주변 모든 점에서 미분 가능해야 해석적입니다.',
        formulas: [
          {
            latex: '\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}',
            description: '첫 번째 코시-리만 방정식',
          },
          {
            latex: '\\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}',
            description: '두 번째 코시-리만 방정식',
          },
          {
            latex: "f'(z) = \\frac{\\partial u}{\\partial x} + i\\frac{\\partial v}{\\partial x}",
            description: '복소 미분',
          },
        ],
        examples: [
          {
            problem: 'f(z) = z²이 해석적임을 코시-리만 방정식으로 확인하세요.',
            solution:
              'u = x² - y², v = 2xy의 편미분은 연속이고 모든 점에서 ∂u/∂x = ∂v/∂y, ∂u/∂y = -∂v/∂x이므로 해석적입니다.',
          },
          {
            problem: 'f(z) = |z|²가 해석적이지 않음을 보이세요.',
            solution:
              'u = x² + y², v = 0입니다. 코시-리만 방정식은 원점에서만 성립합니다. 원점에서는 미분 가능하지만 어느 근방에서도 모든 점에서 미분 가능하지 않으므로 해석적이지 않습니다.',
          },
        ],
        history: {
          discoveredBy: '오귀스탱 루이 코시, 베른하르트 리만',
          year: '1851년',
          background: '코시가 먼저 유도했고, 리만이 일반화하여 복소해석학의 기초가 되었습니다.',
        },
        applications: [
          { field: '유체역학', description: '비압축성 유동' },
          { field: '전자기학', description: '정전기 퍼텐셜' },
          { field: '탄성학', description: '2D 응력 해석' },
        ],
      },
      en: {
        definition:
          'Complex differentiability at a point requires the Cauchy-Riemann equations. They are sufficient at a point if the partial derivatives are continuous in a neighborhood. Analyticity requires differentiability throughout a neighborhood.',
        formulas: [
          {
            latex: '\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}',
            description: 'First Cauchy-Riemann equation',
          },
          {
            latex: '\\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}',
            description: 'Second Cauchy-Riemann equation',
          },
          {
            latex: "f'(z) = \\frac{\\partial u}{\\partial x} + i\\frac{\\partial v}{\\partial x}",
            description: 'Complex derivative',
          },
        ],
        examples: [
          {
            problem: 'Verify f(z) = z² is analytic using Cauchy-Riemann.',
            solution:
              'The partial derivatives of u = x² - y² and v = 2xy are continuous and satisfy both Cauchy-Riemann equations everywhere, so the function is analytic.',
          },
          {
            problem: 'Show f(z) = |z|² is not analytic.',
            solution:
              'For u = x² + y², v = 0, the equations hold only at the origin. The function is differentiable there but is not differentiable throughout any neighborhood, so it is not analytic.',
          },
        ],
        history: {
          discoveredBy: 'Augustin-Louis Cauchy, Bernhard Riemann',
          year: '1851',
          background:
            'Cauchy first derived them; Riemann generalized, forming basis of complex analysis.',
        },
        applications: [
          { field: 'Fluid Mechanics', description: 'Incompressible flow' },
          { field: 'Electromagnetism', description: 'Electrostatic potential' },
          { field: 'Elasticity', description: '2D stress analysis' },
        ],
      },
    },
    relations: {
      prerequisites: ['complex-functions', 'partial-derivative'],
      nextTopics: ['analytic-functions', 'harmonic-functions'],
      related: ['laplace-equation'],
    },
    tags: ['코시리만', '해석적', 'Cauchy-Riemann', 'analytic'],
  },
  {
    id: 'analytic-functions',
    name: {
      ko: '해석함수',
      en: 'Analytic Functions',
    },
    field: 'complex-analysis',
    subfield: 'analyticity',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '해석함수(정칙함수)는 열린 정의역의 모든 점에서 복소미분가능한 함수입니다. 각 점의 충분히 작은 주변에서 테일러 급수로 표현됩니다.',
        formulas: [
          {
            latex: 'f(z) = \\sum_{n=0}^{\\infty} a_n (z - z_0)^n',
            description: '테일러 급수 전개',
          },
          {
            latex:
              'a_n = \\frac{f^{(n)}(z_0)}{n!} = \\frac{1}{2\\pi i}\\oint_C \\frac{f(z)}{(z-z_0)^{n+1}}dz',
            description: '테일러 계수 (C는 z₀를 반시계 방향으로 둘러싸며, C와 내부에서 f가 정칙)',
          },
        ],
        examples: [
          {
            problem: 'e^z의 테일러 급수를 z₀ = 0에서 구하세요.',
            solution: 'e^z = Σ(z^n/n!) = 1 + z + z²/2! + z³/3! + ... 수렴반경은 무한대입니다.',
          },
          {
            problem: 'sin z의 급수 전개는?',
            solution: 'sin z = z - z³/3! + z⁵/5! - z⁷/7! + ... = Σ((-1)^n z^(2n+1)/(2n+1)!)',
          },
        ],
        applications: [
          { field: '물리학', description: '양자역학, 통계역학' },
          { field: '공학', description: '신호 처리, 제어 이론' },
          { field: '수학', description: '정수론, 조합론' },
        ],
      },
      en: {
        definition:
          'An analytic (holomorphic) function is complex differentiable at every point of its open domain. It has a Taylor series in a sufficiently small neighborhood of each point.',
        formulas: [
          {
            latex: 'f(z) = \\sum_{n=0}^{\\infty} a_n (z - z_0)^n',
            description: 'Taylor series expansion',
          },
          {
            latex:
              'a_n = \\frac{f^{(n)}(z_0)}{n!} = \\frac{1}{2\\pi i}\\oint_C \\frac{f(z)}{(z-z_0)^{n+1}}dz',
            description:
              'Taylor coefficients (C encloses z₀ counterclockwise and f is holomorphic on and inside C)',
          },
        ],
        examples: [
          {
            problem: 'Find Taylor series of e^z at z₀ = 0.',
            solution:
              'e^z = Σ(z^n/n!) = 1 + z + z²/2! + z³/3! + ... Radius of convergence is infinite.',
          },
          {
            problem: 'What is the series expansion of sin z?',
            solution: 'sin z = z - z³/3! + z⁵/5! - z⁷/7! + ... = Σ((-1)^n z^(2n+1)/(2n+1)!)',
          },
        ],
        applications: [
          { field: 'Physics', description: 'Quantum mechanics, statistical mechanics' },
          { field: 'Engineering', description: 'Signal processing, control theory' },
          { field: 'Mathematics', description: 'Number theory, combinatorics' },
        ],
      },
    },
    relations: {
      prerequisites: ['cauchy-riemann', 'taylor-series'],
      nextTopics: ['residue-theorem', 'laurent-series'],
      related: ['power-series'],
    },
    tags: ['해석함수', '정칙함수', 'analytic', 'holomorphic'],
  },
  {
    id: 'residue-theorem',
    name: {
      ko: '유수 정리',
      en: 'Residue Theorem',
    },
    field: 'complex-analysis',
    subfield: 'integration',
    difficulty: 5,
    content: {
      ko: {
        definition:
          '반시계 방향의 단순 닫힌 경로 C와 그 내부에서 유한 개의 고립 특이점을 제외하고 f가 정칙이면, C를 따른 적분은 내부 특이점의 유수 합에 2πi를 곱한 값입니다. 특이점은 C 위에 없어야 합니다.',
        formulas: [
          {
            latex: '\\oint_C f(z) dz = 2\\pi i \\sum_{k} \\text{Res}(f, z_k)',
            description: '유수 정리',
          },
          {
            latex: '\\text{Res}(f, z_0) = \\lim_{z \\to z_0} (z - z_0)f(z)',
            description: '단순극에서의 유수',
          },
          {
            latex:
              '\\text{Res}(f, z_0) = \\frac{1}{(n-1)!}\\lim_{z \\to z_0}\\frac{d^{n-1}}{dz^{n-1}}[(z-z_0)^n f(z)]',
            description: 'n차 극에서의 유수',
          },
        ],
        examples: [
          {
            problem: '∮ 1/(z²+1) dz를 |z| = 2 위에서 계산하세요.',
            solution:
              '특이점: z = ±i (모두 내부). Res(f, i) = 1/(2i), Res(f, -i) = -1/(2i). 적분 = 2πi(1/(2i) - 1/(2i)) = 0',
          },
          {
            problem: '∫₀^∞ dx/(x²+1)을 유수로 계산하세요.',
            solution:
              '상반면 반원 경로. z = i만 내부. Res(f, i) = 1/(2i). ∮ = 2πi·(1/(2i)) = π. 실수축 기여만 남아 ∫₀^∞ = π/2',
          },
        ],
        history: {
          discoveredBy: '오귀스탱 루이 코시',
          year: '1825년',
          background: '코시가 복소적분론을 개발하면서 유수 정리를 증명했습니다.',
        },
        applications: [
          { field: '물리학', description: '전파함수, 그린함수' },
          { field: '공학', description: '라플라스 역변환' },
          { field: '정수론', description: '소수 분포' },
        ],
      },
      en: {
        definition:
          'If f is holomorphic on and inside a positively oriented simple closed contour C except at finitely many isolated interior singularities, its integral around C is 2πi times the sum of their residues.',
        formulas: [
          {
            latex: '\\oint_C f(z) dz = 2\\pi i \\sum_{k} \\text{Res}(f, z_k)',
            description: 'Residue theorem',
          },
          {
            latex: '\\text{Res}(f, z_0) = \\lim_{z \\to z_0} (z - z_0)f(z)',
            description: 'Residue at simple pole',
          },
          {
            latex:
              '\\text{Res}(f, z_0) = \\frac{1}{(n-1)!}\\lim_{z \\to z_0}\\frac{d^{n-1}}{dz^{n-1}}[(z-z_0)^n f(z)]',
            description: 'Residue at pole of order n',
          },
        ],
        examples: [
          {
            problem: 'Compute ∮ 1/(z²+1) dz over |z| = 2.',
            solution:
              'Singularities: z = ±i (both inside). Res(f, i) = 1/(2i), Res(f, -i) = -1/(2i). Integral = 2πi(1/(2i) - 1/(2i)) = 0',
          },
          {
            problem: 'Compute ∫₀^∞ dx/(x²+1) using residues.',
            solution:
              'Upper semicircle contour. Only z = i inside. Res(f, i) = 1/(2i). ∮ = 2πi·(1/(2i)) = π. Real axis contribution: ∫₀^∞ = π/2',
          },
        ],
        history: {
          discoveredBy: 'Augustin-Louis Cauchy',
          year: '1825',
          background:
            'Cauchy proved the residue theorem while developing complex integration theory.',
        },
        applications: [
          { field: 'Physics', description: "Propagators, Green's functions" },
          { field: 'Engineering', description: 'Inverse Laplace transform' },
          { field: 'Number Theory', description: 'Prime distribution' },
        ],
      },
    },
    relations: {
      prerequisites: ['analytic-functions', 'laurent-series'],
      nextTopics: ['argument-principle'],
      related: ['contour-integration'],
    },
    tags: ['유수', '복소적분', 'residue', 'contour integral'],
  },
  {
    id: 'conformal-mapping',
    name: {
      ko: '등각사상',
      en: 'Conformal Mapping',
    },
    field: 'complex-analysis',
    subfield: 'geometric',
    difficulty: 5,
    content: {
      ko: {
        definition:
          "등각사상은 각도를 보존하는 변환입니다. 해석함수는 f'(z) ≠ 0인 점에서 등각입니다. 복잡한 영역을 단순한 영역으로 변환합니다.",
        formulas: [
          {
            latex: "w = f(z), \\quad f'(z_0) \\neq 0",
            description: '등각사상의 조건',
          },
          {
            latex: 'w = \\frac{az + b}{cz + d}, \\quad ad - bc \\neq 0',
            description: '뫼비우스 변환 (선형분수변환)',
          },
          {
            latex: 'w = e^z',
            description: '띠 영역을 쐐기 영역으로',
          },
          {
            latex: 'w = \\frac{z - i}{z + i}',
            description: '카일리 변환 (상반면 → 단위원)',
          },
        ],
        examples: [
          {
            problem: 'w = z²이 제1사분면을 어떤 영역으로 사상하는지 설명하세요.',
            solution:
              'z = re^(iθ), 0 < θ < π/2일 때, w = r²e^(2iθ), 0 < 2θ < π. 제1사분면이 상반면으로 사상됩니다.',
          },
          {
            problem: '뫼비우스 변환이 원이나 직선을 어떻게 사상하는지 설명하세요.',
            solution:
              '뫼비우스 변환은 원과 직선을 원과 직선으로 사상합니다. 직선은 무한대를 지나는 원으로 볼 수 있습니다.',
          },
        ],
        history: {
          discoveredBy: '베른하르트 리만',
          year: '1851년',
          background:
            '리만 사상 정리: 복소평면 전체가 아닌 단순 연결 영역은 단위 원판과 등각동형입니다.',
        },
        applications: [
          { field: '유체역학', description: '날개 주위 유동 (주코프스키)' },
          { field: '전자기학', description: '정전기 문제' },
          { field: '지도학', description: '지도 투영법' },
        ],
      },
      en: {
        definition:
          "A conformal mapping preserves angles. Analytic functions are conformal where f'(z) ≠ 0. It transforms complex regions to simpler ones.",
        formulas: [
          {
            latex: "w = f(z), \\quad f'(z_0) \\neq 0",
            description: 'Condition for conformality',
          },
          {
            latex: 'w = \\frac{az + b}{cz + d}, \\quad ad - bc \\neq 0',
            description: 'Möbius transformation (LFT)',
          },
          {
            latex: 'w = e^z',
            description: 'Strip to wedge',
          },
          {
            latex: 'w = \\frac{z - i}{z + i}',
            description: 'Cayley transform (half-plane → unit disk)',
          },
        ],
        examples: [
          {
            problem: 'Describe how w = z² maps first quadrant.',
            solution:
              'For z = re^(iθ), 0 < θ < π/2, w = r²e^(2iθ), 0 < 2θ < π. First quadrant maps to upper half-plane.',
          },
          {
            problem: 'Explain how Möbius maps transform circles and lines.',
            solution:
              'Möbius transformations map circles and lines to circles and lines. Lines are circles passing through infinity.',
          },
        ],
        history: {
          discoveredBy: 'Bernhard Riemann',
          year: '1851',
          background:
            'Riemann Mapping Theorem: A simply connected region other than the entire complex plane is conformally equivalent to the unit disk.',
        },
        applications: [
          { field: 'Fluid Mechanics', description: 'Airfoil flow (Joukowski)' },
          { field: 'Electromagnetism', description: 'Electrostatic problems' },
          { field: 'Cartography', description: 'Map projections' },
        ],
      },
    },
    relations: {
      prerequisites: ['analytic-functions', 'cauchy-riemann'],
      nextTopics: ['riemann-surfaces'],
      related: ['geometry'],
    },
    tags: ['등각사상', '뫼비우스', 'conformal', 'Möbius'],
  },
];
