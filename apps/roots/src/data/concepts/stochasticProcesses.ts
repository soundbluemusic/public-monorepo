import { MathConcept } from '../types';

export const stochasticProcessesConcepts: MathConcept[] = [
  {
    id: 'markov-chain',
    name: {
      ko: '마르코프 체인',
      en: 'Markov Chain',
      ja: 'マルコフ連鎖'
    },
    field: 'stochastic-processes',
    subfield: 'discrete',
    difficulty: 3,
    content: {
      ko: {
        definition: '미래 상태가 현재 상태에만 의존하는 확률 과정 (무기억성)',
        formulas: ['P(Xₙ₊₁|Xₙ,...,X₀) = P(Xₙ₊₁|Xₙ)', '전이 행렬: P = (pᵢⱼ)', '정상 분포: πP = π'],
        examples: ['랜덤 워크', '날씨 모델', '페이지랭크'],
        applications: ['금융', '유전학', '자연어처리']
      },
      en: {
        definition: 'Stochastic process where future depends only on present state (memoryless)',
        formulas: ['P(Xₙ₊₁|Xₙ,...,X₀) = P(Xₙ₊₁|Xₙ)', 'Transition matrix: P = (pᵢⱼ)', 'Stationary: πP = π'],
        examples: ['Random walk', 'Weather model', 'PageRank'],
        applications: ['Finance', 'Genetics', 'NLP']
      },
      ja: {
        definition: '未来の状態が現在の状態のみに依存する確率過程（無記憶性）',
        formulas: ['P(Xₙ₊₁|Xₙ,...,X₀) = P(Xₙ₊₁|Xₙ)', '遷移行列: P = (pᵢⱼ)', '定常分布: πP = π'],
        examples: ['ランダムウォーク', '天気モデル', 'ページランク'],
        applications: ['金融', '遺伝学', '自然言語処理']
      }
    },
    latex: 'P(X_{n+1}|X_n) = P_{X_n, X_{n+1}}',
    relations: {
      prerequisites: ['probability', 'matrix-operations'],
      nextTopics: ['markov-decision-process', 'hidden-markov-model'],
      related: ['random-walk'],
      applications: ['machine-learning', 'finance']
    },
    tags: ['마르코프', 'Markov', '체인', 'chain']
  },
  {
    id: 'brownian-motion',
    name: {
      ko: '브라운 운동',
      en: 'Brownian Motion',
      ja: 'ブラウン運動'
    },
    field: 'stochastic-processes',
    subfield: 'continuous',
    difficulty: 4,
    content: {
      ko: {
        definition: '연속 시간, 연속 상태의 기본 확률 과정. 위너 과정이라고도 함',
        formulas: ['W(0) = 0', 'W(t) - W(s) ~ N(0, t-s)', '독립 증분', '연속 경로'],
        examples: ['주가 모델', '입자 확산', '열 방정식'],
        applications: ['금융 수학', '물리학', '생물학']
      },
      en: {
        definition: 'Fundamental continuous-time, continuous-state stochastic process. Also called Wiener process',
        formulas: ['W(0) = 0', 'W(t) - W(s) ~ N(0, t-s)', 'Independent increments', 'Continuous paths'],
        examples: ['Stock price model', 'Particle diffusion', 'Heat equation'],
        applications: ['Financial math', 'Physics', 'Biology']
      },
      ja: {
        definition: '連続時間・連続状態の基本確率過程。ウィーナー過程とも呼ぶ',
        formulas: ['W(0) = 0', 'W(t) - W(s) ~ N(0, t-s)', '独立増分', '連続経路'],
        examples: ['株価モデル', '粒子拡散', '熱方程式'],
        applications: ['金融数学', '物理学', '生物学']
      }
    },
    latex: 'W(t) - W(s) \\sim N(0, t-s)',
    relations: {
      prerequisites: ['normal-distribution', 'limits'],
      nextTopics: ['ito-calculus', 'stochastic-differential-equations'],
      related: ['random-walk'],
      applications: ['finance', 'physics']
    },
    tags: ['브라운', 'Brownian', '위너', 'Wiener']
  },
  {
    id: 'poisson-process',
    name: {
      ko: '포아송 과정',
      en: 'Poisson Process',
      ja: 'ポアソン過程'
    },
    field: 'stochastic-processes',
    subfield: 'counting',
    difficulty: 3,
    content: {
      ko: {
        definition: '사건이 일정한 평균 비율로 독립적으로 발생하는 계수 과정',
        formulas: ['N(0) = 0', 'P(N(t) = k) = (λt)^k e^{-λt}/k!', '독립 증분', 'E[N(t)] = λt'],
        examples: ['고객 도착', '방사선 붕괴', '웹사이트 방문'],
        applications: ['대기행렬', '보험', '통신']
      },
      en: {
        definition: 'Counting process where events occur independently at constant average rate',
        formulas: ['N(0) = 0', 'P(N(t) = k) = (λt)^k e^{-λt}/k!', 'Independent increments', 'E[N(t)] = λt'],
        examples: ['Customer arrivals', 'Radioactive decay', 'Website visits'],
        applications: ['Queueing', 'Insurance', 'Telecommunications']
      },
      ja: {
        definition: '事象が一定の平均率で独立に発生する計数過程',
        formulas: ['N(0) = 0', 'P(N(t) = k) = (λt)^k e^{-λt}/k!', '独立増分', 'E[N(t)] = λt'],
        examples: ['顧客到着', '放射性崩壊', 'ウェブサイト訪問'],
        applications: ['待ち行列', '保険', '通信']
      }
    },
    latex: 'P(N(t) = k) = \\frac{(\\lambda t)^k e^{-\\lambda t}}{k!}',
    relations: {
      prerequisites: ['poisson-distribution', 'exponential-distribution'],
      nextTopics: ['compound-poisson', 'renewal-process'],
      related: ['queueing-theory'],
      applications: ['queueing', 'insurance']
    },
    tags: ['포아송', 'Poisson', '계수과정', 'counting']
  },
  {
    id: 'ito-calculus',
    name: {
      ko: '이토 적분',
      en: 'Itô Calculus',
      ja: '伊藤積分'
    },
    field: 'stochastic-processes',
    subfield: 'stochastic-calculus',
    difficulty: 5,
    content: {
      ko: {
        definition: '확률 과정에 대한 적분 이론. 확률미분방정식의 기초',
        formulas: ['∫f dW (이토 적분)', '이토 공식: df = (∂f/∂t + ½σ²∂²f/∂x²)dt + σ∂f/∂x dW', '(dW)² = dt'],
        examples: ['기하 브라운 운동', '옵션 가격 결정', '확률 미분방정식'],
        applications: ['금융 공학', '물리학', '생물학']
      },
      en: {
        definition: 'Integration theory for stochastic processes. Foundation of SDEs',
        formulas: ['∫f dW (Itô integral)', 'Itô formula: df = (∂f/∂t + ½σ²∂²f/∂x²)dt + σ∂f/∂x dW', '(dW)² = dt'],
        examples: ['Geometric Brownian motion', 'Option pricing', 'SDEs'],
        applications: ['Financial engineering', 'Physics', 'Biology']
      },
      ja: {
        definition: '確率過程に対する積分理論。確率微分方程式の基礎',
        formulas: ['∫f dW (伊藤積分)', '伊藤の公式: df = (∂f/∂t + ½σ²∂²f/∂x²)dt + σ∂f/∂x dW', '(dW)² = dt'],
        examples: ['幾何ブラウン運動', 'オプション価格決定', '確率微分方程式'],
        applications: ['金融工学', '物理学', '生物学']
      }
    },
    latex: 'df = \\left(\\frac{\\partial f}{\\partial t} + \\frac{1}{2}\\sigma^2\\frac{\\partial^2 f}{\\partial x^2}\\right)dt + \\sigma\\frac{\\partial f}{\\partial x}dW',
    relations: {
      prerequisites: ['brownian-motion', 'calculus'],
      nextTopics: ['black-scholes', 'sde'],
      related: ['measure-theory'],
      applications: ['finance', 'physics']
    },
    tags: ['이토', 'Itô', '확률적분', 'stochastic']
  },
  {
    id: 'martingale',
    name: {
      ko: '마팅게일',
      en: 'Martingale',
      ja: 'マルチンゲール'
    },
    field: 'stochastic-processes',
    subfield: 'theory',
    difficulty: 4,
    content: {
      ko: {
        definition: '조건부 기댓값이 현재 값과 같은 확률 과정 (공정한 게임)',
        formulas: ['E[Xₙ₊₁|ℱₙ] = Xₙ', '서브마팅게일: E[Xₙ₊₁|ℱₙ] ≥ Xₙ', '슈퍼마팅게일: ≤'],
        examples: ['공정한 도박', '브라운 운동', '주가 (위험중립 측도)'],
        applications: ['금융', '최적 정지', '확률론']
      },
      en: {
        definition: 'Stochastic process where conditional expectation equals current value (fair game)',
        formulas: ['E[Xₙ₊₁|ℱₙ] = Xₙ', 'Submartingale: E[Xₙ₊₁|ℱₙ] ≥ Xₙ', 'Supermartingale: ≤'],
        examples: ['Fair gambling', 'Brownian motion', 'Stock prices (risk-neutral)'],
        applications: ['Finance', 'Optimal stopping', 'Probability']
      },
      ja: {
        definition: '条件付き期待値が現在の値と等しい確率過程（公平なゲーム）',
        formulas: ['E[Xₙ₊₁|ℱₙ] = Xₙ', 'サブマルチンゲール: E[Xₙ₊₁|ℱₙ] ≥ Xₙ', 'スーパーマルチンゲール: ≤'],
        examples: ['公平な賭け', 'ブラウン運動', '株価（リスク中立測度）'],
        applications: ['金融', '最適停止', '確率論']
      }
    },
    latex: 'E[X_{n+1}|\\mathcal{F}_n] = X_n',
    relations: {
      prerequisites: ['conditional-expectation', 'filtration'],
      nextTopics: ['optional-stopping', 'doob-martingale'],
      related: ['brownian-motion'],
      applications: ['finance', 'gambling']
    },
    tags: ['마팅게일', 'martingale', '공정', 'fair']
  },
  {
    id: 'ergodic-theory',
    name: {
      ko: '에르고딕 이론',
      en: 'Ergodic Theory',
      ja: 'エルゴード理論'
    },
    field: 'stochastic-processes',
    subfield: 'theory',
    difficulty: 5,
    content: {
      ko: {
        definition: '동역학계의 장기 평균 행동 연구. 시간 평균 = 공간 평균',
        formulas: ['lim (1/n)Σf(Tⁱx) = ∫f dμ (a.e.)', '에르고딕: 불변 집합이 자명', '혼합: 상관관계 소멸'],
        examples: ['회전 변환', '베르누이 이동', '빵 반죽 변환'],
        applications: ['통계역학', '정수론', '카오스']
      },
      en: {
        definition: 'Study of long-term average behavior of dynamical systems. Time average = Space average',
        formulas: ['lim (1/n)Σf(Tⁱx) = ∫f dμ (a.e.)', 'Ergodic: invariant sets trivial', 'Mixing: correlations decay'],
        examples: ['Rotation', 'Bernoulli shift', 'Baker\'s map'],
        applications: ['Statistical mechanics', 'Number theory', 'Chaos']
      },
      ja: {
        definition: '力学系の長期平均挙動の研究。時間平均 = 空間平均',
        formulas: ['lim (1/n)Σf(Tⁱx) = ∫f dμ (a.e.)', 'エルゴード: 不変集合が自明', '混合: 相関が減衰'],
        examples: ['回転変換', 'ベルヌーイシフト', 'パン生地変換'],
        applications: ['統計力学', '整数論', 'カオス']
      }
    },
    latex: '\\lim_{n\\to\\infty} \\frac{1}{n}\\sum_{i=0}^{n-1} f(T^i x) = \\int f \\, d\\mu',
    relations: {
      prerequisites: ['measure-theory', 'dynamical-systems'],
      nextTopics: ['entropy-dynamics'],
      related: ['chaos-theory'],
      applications: ['statistical-mechanics', 'number-theory']
    },
    tags: ['에르고딕', 'ergodic', '동역학', 'dynamics']
  },
  {
    id: 'stochastic-differential-equations',
    name: {
      ko: '확률미분방정식 (SDE)',
      en: 'Stochastic Differential Equations',
      ja: '確率微分方程式'
    },
    field: 'stochastic-processes',
    subfield: 'stochastic-calculus',
    difficulty: 5,
    content: {
      ko: {
        definition: '무작위 노이즈 항을 포함하는 미분방정식',
        formulas: ['dX = μ(X,t)dt + σ(X,t)dW', '기하 브라운: dS = μS dt + σS dW', '해: S(t) = S(0)exp((μ-σ²/2)t + σW(t))'],
        examples: ['주가 모델', '이자율 모델', '인구 동역학'],
        applications: ['금융', '물리학', '생물학']
      },
      en: {
        definition: 'Differential equations with random noise term',
        formulas: ['dX = μ(X,t)dt + σ(X,t)dW', 'Geometric Brownian: dS = μS dt + σS dW', 'Solution: S(t) = S(0)exp((μ-σ²/2)t + σW(t))'],
        examples: ['Stock price model', 'Interest rate model', 'Population dynamics'],
        applications: ['Finance', 'Physics', 'Biology']
      },
      ja: {
        definition: 'ランダムノイズ項を含む微分方程式',
        formulas: ['dX = μ(X,t)dt + σ(X,t)dW', '幾何ブラウン: dS = μS dt + σS dW', '解: S(t) = S(0)exp((μ-σ²/2)t + σW(t))'],
        examples: ['株価モデル', '金利モデル', '人口動態'],
        applications: ['金融', '物理学', '生物学']
      }
    },
    latex: 'dX_t = \\mu(X_t, t)dt + \\sigma(X_t, t)dW_t',
    relations: {
      prerequisites: ['ito-calculus', 'differential-equations'],
      nextTopics: ['black-scholes', 'feynman-kac'],
      related: ['brownian-motion'],
      applications: ['finance', 'physics']
    },
    tags: ['SDE', '확률미분', 'stochastic', 'differential']
  },
  {
    id: 'hidden-markov-model',
    name: {
      ko: '은닉 마르코프 모델 (HMM)',
      en: 'Hidden Markov Model',
      ja: '隠れマルコフモデル'
    },
    field: 'stochastic-processes',
    subfield: 'models',
    difficulty: 4,
    content: {
      ko: {
        definition: '관측되지 않는 마르코프 체인에서 관측값이 생성되는 모델',
        formulas: ['상태 전이: P(zₜ|zₜ₋₁)', '방출: P(xₜ|zₜ)', '전방-후방 알고리즘', '비터비 알고리즘'],
        examples: ['음성 인식', '품사 태깅', 'DNA 서열 분석'],
        applications: ['자연어처리', '생물정보학', '금융']
      },
      en: {
        definition: 'Model where observations are generated from unobserved Markov chain',
        formulas: ['State transition: P(zₜ|zₜ₋₁)', 'Emission: P(xₜ|zₜ)', 'Forward-backward algorithm', 'Viterbi algorithm'],
        examples: ['Speech recognition', 'POS tagging', 'DNA sequence analysis'],
        applications: ['NLP', 'Bioinformatics', 'Finance']
      },
      ja: {
        definition: '観測されないマルコフ連鎖から観測値が生成されるモデル',
        formulas: ['状態遷移: P(zₜ|zₜ₋₁)', '放出: P(xₜ|zₜ)', '前向き後ろ向きアルゴリズム', 'ビタビアルゴリズム'],
        examples: ['音声認識', '品詞タギング', 'DNA配列解析'],
        applications: ['自然言語処理', 'バイオインフォマティクス', '金融']
      }
    },
    latex: 'P(x_{1:T}, z_{1:T}) = P(z_1)\\prod_{t=2}^T P(z_t|z_{t-1})\\prod_{t=1}^T P(x_t|z_t)',
    relations: {
      prerequisites: ['markov-chain', 'bayesian-inference'],
      nextTopics: ['kalman-filter', 'particle-filter'],
      related: ['graphical-models'],
      applications: ['speech', 'nlp', 'bioinformatics']
    },
    tags: ['HMM', '은닉', 'hidden', 'Markov']
  }
];
