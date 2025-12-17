/**
 * @fileoverview 확률과 통계 개념 데이터
 */
import type { MathConcept } from "../types";

export const probabilityConcepts: MathConcept[] = [
  {
    id: "probability-basics",
    name: {
      ko: "확률의 기초",
      en: "Probability Basics",
      ja: "確率の基礎",
    },
    field: "probability",
    subfield: "probability-theory",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "확률은 사건이 일어날 가능성을 0과 1 사이의 수로 나타낸 것입니다. 0은 불가능, 1은 확실함을 의미합니다.",
        formulas: [
          {
            latex: "P(A) = \\frac{\\text{A가 일어나는 경우의 수}}{\\text{전체 경우의 수}}",
            description: "고전적 확률의 정의",
          },
          {
            latex: "0 \\leq P(A) \\leq 1",
            description: "확률의 범위",
          },
          {
            latex: "P(A^c) = 1 - P(A)",
            description: "여사건의 확률",
          },
        ],
        examples: [
          {
            problem: "주사위를 던져 3 이하가 나올 확률을 구하세요.",
            solution: "3 이하: {1, 2, 3}, 전체: {1, 2, 3, 4, 5, 6}, P = 3/6 = 1/2",
          },
          {
            problem: "동전을 두 번 던져 적어도 한 번 앞면이 나올 확률을 구하세요.",
            solution:
              "여사건(둘 다 뒷면) = 1/4, 따라서 P = 1 - 1/4 = 3/4",
          },
        ],
        history: {
          discoveredBy: "파스칼과 페르마",
          year: "1654년",
          background:
            "도박 문제에서 시작된 서신 교환으로 확률론의 기초가 세워졌습니다.",
        },
        applications: [
          { field: "보험", description: "리스크 평가" },
          { field: "기상학", description: "날씨 예측" },
          { field: "의학", description: "진단 테스트 정확도" },
        ],
      },
      en: {
        definition:
          "Probability is a number between 0 and 1 representing the likelihood of an event occurring. 0 means impossible, 1 means certain.",
        formulas: [
          {
            latex: "P(A) = \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}",
            description: "Classical probability definition",
          },
          {
            latex: "0 \\leq P(A) \\leq 1",
            description: "Probability range",
          },
          {
            latex: "P(A^c) = 1 - P(A)",
            description: "Complement probability",
          },
        ],
        examples: [
          {
            problem: "Find the probability of rolling 3 or less on a die.",
            solution: "3 or less: {1, 2, 3}, Total: {1, 2, 3, 4, 5, 6}, P = 3/6 = 1/2",
          },
          {
            problem: "Find P(at least one head) when flipping a coin twice.",
            solution: "Complement (both tails) = 1/4, so P = 1 - 1/4 = 3/4",
          },
        ],
        history: {
          discoveredBy: "Pascal and Fermat",
          year: "1654",
          background:
            "Correspondence about gambling problems led to the foundations of probability theory.",
        },
        applications: [
          { field: "Insurance", description: "Risk assessment" },
          { field: "Meteorology", description: "Weather forecasting" },
          { field: "Medicine", description: "Diagnostic test accuracy" },
        ],
      },
    },
    relations: {
      prerequisites: ["fractions", "ratios"],
      nextTopics: ["conditional-probability", "expected-value"],
      related: ["combinatorics"],
    },
    tags: ["확률", "기초", "probability", "basics"],
  },
  {
    id: "conditional-probability",
    name: {
      ko: "조건부 확률",
      en: "Conditional Probability",
      ja: "条件付き確率",
    },
    field: "probability",
    subfield: "probability-theory",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "조건부 확률 P(A|B)는 사건 B가 일어났을 때 사건 A가 일어날 확률입니다.",
        formulas: [
          {
            latex: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}",
            description: "조건부 확률의 정의",
          },
          {
            latex: "P(A \\cap B) = P(A|B) \\cdot P(B)",
            description: "곱셈 법칙",
          },
          {
            latex: "P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}",
            description: "베이즈 정리",
          },
        ],
        examples: [
          {
            problem:
              "52장의 카드에서 하트가 나왔을 때 그것이 킹일 확률을 구하세요.",
            solution:
              "P(킹|하트) = P(하트 킹) / P(하트) = (1/52) / (13/52) = 1/13",
          },
        ],
        applications: [
          { field: "의학", description: "질병 진단, 검사 결과 해석" },
          { field: "스팸 필터", description: "베이지안 스팸 분류" },
          { field: "기계학습", description: "나이브 베이즈 분류기" },
        ],
      },
      en: {
        definition:
          "Conditional probability P(A|B) is the probability of event A occurring given that event B has occurred.",
        formulas: [
          {
            latex: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}",
            description: "Definition of conditional probability",
          },
          {
            latex: "P(A \\cap B) = P(A|B) \\cdot P(B)",
            description: "Multiplication rule",
          },
          {
            latex: "P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}",
            description: "Bayes' theorem",
          },
        ],
        examples: [
          {
            problem:
              "From 52 cards, given that a heart was drawn, find P(it's a King).",
            solution:
              "P(King|Heart) = P(King of Hearts) / P(Heart) = (1/52) / (13/52) = 1/13",
          },
        ],
        applications: [
          { field: "Medicine", description: "Disease diagnosis, test interpretation" },
          { field: "Spam Filtering", description: "Bayesian spam classification" },
          { field: "Machine Learning", description: "Naive Bayes classifier" },
        ],
      },
    },
    relations: {
      prerequisites: ["probability-basics"],
      nextTopics: ["bayes-theorem", "independence"],
      related: ["total-probability"],
    },
    tags: ["조건부확률", "베이즈", "conditional", "probability"],
  },
  {
    id: "expected-value",
    name: {
      ko: "기댓값",
      en: "Expected Value",
      ja: "期待値",
    },
    field: "probability",
    subfield: "probability-theory",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "기댓값(평균)은 확률변수의 가능한 값들을 각 확률로 가중 평균한 것입니다. 장기적인 평균을 나타냅니다.",
        formulas: [
          {
            latex: "E[X] = \\sum_{i} x_i \\cdot P(X = x_i)",
            description: "이산 확률변수의 기댓값",
          },
          {
            latex: "E[X] = \\int_{-\\infty}^{\\infty} x \\cdot f(x) \\, dx",
            description: "연속 확률변수의 기댓값",
          },
          {
            latex: "E[aX + b] = aE[X] + b",
            description: "기댓값의 선형성",
          },
        ],
        examples: [
          {
            problem: "주사위를 던졌을 때 나오는 수의 기댓값을 구하세요.",
            solution:
              "E[X] = (1+2+3+4+5+6)/6 = 21/6 = 3.5",
          },
          {
            problem:
              "복권이 1/1000 확률로 1000원, 999/1000 확률로 0원일 때 기댓값은?",
            solution: "E[X] = 1000 × (1/1000) + 0 × (999/1000) = 1원",
          },
        ],
        applications: [
          { field: "보험", description: "보험료 산정" },
          { field: "투자", description: "예상 수익률 계산" },
          { field: "게임 이론", description: "전략 평가" },
        ],
      },
      en: {
        definition:
          "Expected value (mean) is the probability-weighted average of all possible values. It represents the long-run average.",
        formulas: [
          {
            latex: "E[X] = \\sum_{i} x_i \\cdot P(X = x_i)",
            description: "Expected value (discrete)",
          },
          {
            latex: "E[X] = \\int_{-\\infty}^{\\infty} x \\cdot f(x) \\, dx",
            description: "Expected value (continuous)",
          },
          {
            latex: "E[aX + b] = aE[X] + b",
            description: "Linearity of expectation",
          },
        ],
        examples: [
          {
            problem: "Find the expected value when rolling a die.",
            solution: "E[X] = (1+2+3+4+5+6)/6 = 21/6 = 3.5",
          },
          {
            problem:
              "A lottery wins $1000 with P=1/1000, else $0. Find E[X].",
            solution: "E[X] = 1000 × (1/1000) + 0 × (999/1000) = $1",
          },
        ],
        applications: [
          { field: "Insurance", description: "Premium calculation" },
          { field: "Investment", description: "Expected return calculation" },
          { field: "Game Theory", description: "Strategy evaluation" },
        ],
      },
    },
    relations: {
      prerequisites: ["probability-basics"],
      nextTopics: ["variance", "law-of-large-numbers"],
      related: ["weighted-average"],
    },
    tags: ["기댓값", "평균", "expected value", "mean"],
  },
  {
    id: "variance",
    name: {
      ko: "분산과 표준편차",
      en: "Variance and Standard Deviation",
      ja: "分散と標準偏差",
    },
    field: "probability",
    subfield: "statistics",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "분산은 데이터가 평균으로부터 얼마나 퍼져 있는지를 측정합니다. 표준편차는 분산의 제곱근입니다.",
        formulas: [
          {
            latex: "\\text{Var}(X) = E[(X - \\mu)^2] = E[X^2] - (E[X])^2",
            description: "분산의 정의",
          },
          {
            latex: "\\sigma = \\sqrt{\\text{Var}(X)}",
            description: "표준편차",
          },
          {
            latex: "\\text{Var}(aX + b) = a^2 \\text{Var}(X)",
            description: "분산의 성질",
          },
        ],
        examples: [
          {
            problem: "데이터 {1, 2, 3, 4, 5}의 분산을 구하세요.",
            solution:
              "평균 μ = 3, Var = [(1-3)² + (2-3)² + (3-3)² + (4-3)² + (5-3)²]/5 = 10/5 = 2",
          },
        ],
        applications: [
          { field: "금융", description: "투자 리스크 측정" },
          { field: "품질 관리", description: "제품 일관성 평가" },
          { field: "실험 과학", description: "측정 오차 분석" },
        ],
      },
      en: {
        definition:
          "Variance measures how spread out data is from the mean. Standard deviation is the square root of variance.",
        formulas: [
          {
            latex: "\\text{Var}(X) = E[(X - \\mu)^2] = E[X^2] - (E[X])^2",
            description: "Variance definition",
          },
          {
            latex: "\\sigma = \\sqrt{\\text{Var}(X)}",
            description: "Standard deviation",
          },
          {
            latex: "\\text{Var}(aX + b) = a^2 \\text{Var}(X)",
            description: "Variance property",
          },
        ],
        examples: [
          {
            problem: "Find the variance of {1, 2, 3, 4, 5}.",
            solution:
              "Mean μ = 3, Var = [(1-3)² + (2-3)² + (3-3)² + (4-3)² + (5-3)²]/5 = 10/5 = 2",
          },
        ],
        applications: [
          { field: "Finance", description: "Investment risk measurement" },
          { field: "Quality Control", description: "Product consistency" },
          { field: "Experimental Science", description: "Measurement error analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["expected-value"],
      nextTopics: ["normal-distribution", "central-limit-theorem"],
      related: ["standard-score"],
    },
    tags: ["분산", "표준편차", "variance", "standard deviation"],
  },
  {
    id: "normal-distribution",
    name: {
      ko: "정규분포",
      en: "Normal Distribution",
      ja: "正規分布",
    },
    field: "probability",
    subfield: "distributions",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "정규분포(가우스 분포)는 평균을 중심으로 좌우 대칭인 종 모양의 연속 확률분포입니다. 자연현상과 사회현상에서 널리 나타납니다.",
        formulas: [
          {
            latex: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",
            description: "정규분포의 확률밀도함수",
          },
          {
            latex: "Z = \\frac{X - \\mu}{\\sigma}",
            description: "표준화 (Z-점수)",
          },
        ],
        examples: [
          {
            problem:
              "평균 170cm, 표준편차 10cm인 키 분포에서 180cm 이상일 확률은?",
            solution:
              "Z = (180-170)/10 = 1, P(Z > 1) ≈ 0.1587 (약 15.87%)",
          },
        ],
        history: {
          discoveredBy: "카를 프리드리히 가우스",
          year: "1809년",
          background:
            "가우스가 천문학적 측정 오차를 분석하면서 정규분포를 발견했습니다.",
        },
        applications: [
          { field: "품질 관리", description: "6 시그마" },
          { field: "금융", description: "주가 변동 모델링" },
          { field: "자연과학", description: "측정 오차 분석" },
        ],
      },
      en: {
        definition:
          "The normal (Gaussian) distribution is a continuous probability distribution with a bell-shaped curve symmetric around the mean. It appears widely in nature and society.",
        formulas: [
          {
            latex: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",
            description: "Normal distribution PDF",
          },
          {
            latex: "Z = \\frac{X - \\mu}{\\sigma}",
            description: "Standardization (Z-score)",
          },
        ],
        examples: [
          {
            problem:
              "Heights have mean 170cm, SD 10cm. Find P(height > 180cm).",
            solution:
              "Z = (180-170)/10 = 1, P(Z > 1) ≈ 0.1587 (about 15.87%)",
          },
        ],
        history: {
          discoveredBy: "Carl Friedrich Gauss",
          year: "1809",
          background:
            "Gauss discovered the normal distribution while analyzing astronomical measurement errors.",
        },
        applications: [
          { field: "Quality Control", description: "Six Sigma" },
          { field: "Finance", description: "Stock price modeling" },
          { field: "Natural Sciences", description: "Measurement error analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["variance", "expected-value"],
      nextTopics: ["central-limit-theorem", "hypothesis-testing"],
      related: ["binomial-distribution"],
    },
    tags: ["정규분포", "가우스", "normal distribution", "Gaussian"],
  },
  {
    id: "binomial-distribution",
    name: {
      ko: "이항분포",
      en: "Binomial Distribution",
      ja: "二項分布",
    },
    field: "probability",
    subfield: "distributions",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "이항분포는 성공 확률이 p인 독립 시행을 n번 반복할 때 성공 횟수의 분포입니다.",
        formulas: [
          {
            latex: "P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}",
            description: "이항분포 확률질량함수",
          },
          {
            latex: "E[X] = np",
            description: "이항분포의 기댓값",
          },
          {
            latex: "\\text{Var}(X) = np(1-p)",
            description: "이항분포의 분산",
          },
        ],
        examples: [
          {
            problem: "동전을 10번 던져 정확히 6번 앞면이 나올 확률은?",
            solution:
              "P(X=6) = C(10,6) × (1/2)⁶ × (1/2)⁴ = 210 × (1/1024) ≈ 0.205",
          },
        ],
        applications: [
          { field: "품질 검사", description: "불량률 분석" },
          { field: "의학", description: "약물 효과 분석" },
          { field: "선거", description: "여론조사 분석" },
        ],
      },
      en: {
        definition:
          "The binomial distribution models the number of successes in n independent trials, each with success probability p.",
        formulas: [
          {
            latex: "P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}",
            description: "Binomial PMF",
          },
          {
            latex: "E[X] = np",
            description: "Expected value of binomial",
          },
          {
            latex: "\\text{Var}(X) = np(1-p)",
            description: "Variance of binomial",
          },
        ],
        examples: [
          {
            problem: "Find P(exactly 6 heads) when flipping a coin 10 times.",
            solution:
              "P(X=6) = C(10,6) × (1/2)⁶ × (1/2)⁴ = 210 × (1/1024) ≈ 0.205",
          },
        ],
        applications: [
          { field: "Quality Control", description: "Defect rate analysis" },
          { field: "Medicine", description: "Drug efficacy analysis" },
          { field: "Elections", description: "Poll analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["probability-basics", "combinations"],
      nextTopics: ["poisson-distribution", "normal-distribution"],
      related: ["bernoulli-trial"],
    },
    tags: ["이항분포", "확률분포", "binomial", "distribution"],
  },
  {
    id: "central-limit-theorem",
    name: {
      ko: "중심극한정리",
      en: "Central Limit Theorem",
      ja: "中心極限定理",
    },
    field: "probability",
    subfield: "statistics",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "중심극한정리는 표본 크기가 충분히 크면, 표본 평균의 분포가 원래 분포와 관계없이 정규분포에 가까워진다는 정리입니다.",
        formulas: [
          {
            latex: "\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)",
            description: "표본 평균의 분포 (n이 클 때)",
          },
          {
            latex: "\\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}} \\to N(0, 1)",
            description: "표준화된 표본 평균",
          },
        ],
        examples: [
          {
            problem:
              "주사위를 100번 던졌을 때 평균이 3.3 이상 3.7 이하일 확률은?",
            solution:
              "μ=3.5, σ²=35/12, 표본평균의 σ = √(35/12)/10 ≈ 0.171. Z 변환 후 정규분포표 사용.",
          },
        ],
        history: {
          discoveredBy: "피에르시몽 라플라스",
          year: "1810년",
          background:
            "라플라스가 이항분포의 정규 근사를 연구하면서 발견했습니다.",
        },
        applications: [
          { field: "통계적 추론", description: "신뢰구간, 가설검정" },
          { field: "품질 관리", description: "표본 검사" },
          { field: "여론조사", description: "선거 예측" },
        ],
      },
      en: {
        definition:
          "The Central Limit Theorem states that with sufficient sample size, the distribution of sample means approaches a normal distribution regardless of the original distribution.",
        formulas: [
          {
            latex: "\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)",
            description: "Distribution of sample mean (large n)",
          },
          {
            latex: "\\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}} \\to N(0, 1)",
            description: "Standardized sample mean",
          },
        ],
        examples: [
          {
            problem:
              "When rolling a die 100 times, find P(3.3 ≤ mean ≤ 3.7).",
            solution:
              "μ=3.5, σ²=35/12, SE = √(35/12)/10 ≈ 0.171. Use Z-transform and normal table.",
          },
        ],
        history: {
          discoveredBy: "Pierre-Simon Laplace",
          year: "1810",
          background:
            "Laplace discovered it while studying normal approximation to binomial distribution.",
        },
        applications: [
          { field: "Statistical Inference", description: "Confidence intervals, hypothesis testing" },
          { field: "Quality Control", description: "Sampling inspection" },
          { field: "Polling", description: "Election prediction" },
        ],
      },
    },
    relations: {
      prerequisites: ["normal-distribution", "expected-value", "variance"],
      nextTopics: ["hypothesis-testing", "confidence-interval"],
      related: ["law-of-large-numbers"],
    },
    tags: ["중심극한정리", "정규분포", "central limit theorem", "CLT"],
  },

  // ===== 7.4 추가 분포 (Additional Distributions) =====
  {
    id: "poisson-distribution",
    name: {
      ko: "포아송 분포",
      en: "Poisson Distribution",
      ja: "ポアソン分布",
    },
    field: "probability",
    subfield: "distributions",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "포아송 분포는 단위 시간 또는 공간에서 드물게 발생하는 사건의 횟수를 모델링합니다. 평균 발생률 λ를 매개변수로 합니다.",
        formulas: [
          {
            latex: "P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}",
            description: "포아송 분포 확률질량함수",
          },
          {
            latex: "E[X] = \\lambda, \\quad \\text{Var}(X) = \\lambda",
            description: "평균과 분산이 동일",
          },
        ],
        examples: [
          {
            problem: "시간당 평균 2건의 전화가 오는 콜센터에서 한 시간에 정확히 3건의 전화가 올 확률은?",
            solution: "P(X=3) = (2³ × e⁻²)/3! = 8e⁻²/6 ≈ 0.180",
          },
        ],
        history: {
          discoveredBy: "시메옹 드니 푸아송",
          year: "1837년",
          background: "희귀 사건의 발생을 연구하면서 발견되었습니다.",
        },
        applications: [
          { field: "통신", description: "네트워크 트래픽 모델링" },
          { field: "품질 관리", description: "결함 발생률 분석" },
          { field: "보험", description: "사고 발생 예측" },
        ],
      },
      en: {
        definition:
          "The Poisson distribution models the number of rare events occurring in a fixed interval of time or space. It has parameter λ (average rate).",
        formulas: [
          {
            latex: "P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}",
            description: "Poisson PMF",
          },
          {
            latex: "E[X] = \\lambda, \\quad \\text{Var}(X) = \\lambda",
            description: "Mean equals variance",
          },
        ],
        examples: [
          {
            problem: "If a call center receives 2 calls/hour on average, find P(exactly 3 calls in one hour).",
            solution: "P(X=3) = (2³ × e⁻²)/3! = 8e⁻²/6 ≈ 0.180",
          },
        ],
        applications: [
          { field: "Telecommunications", description: "Network traffic modeling" },
          { field: "Quality Control", description: "Defect rate analysis" },
          { field: "Insurance", description: "Accident prediction" },
        ],
      },
    },
    relations: {
      prerequisites: ["probability-basics", "expected-value"],
      nextTopics: ["exponential-distribution"],
      related: ["binomial-distribution"],
    },
    tags: ["포아송분포", "확률분포", "Poisson", "distribution"],
  },
  {
    id: "exponential-distribution",
    name: {
      ko: "지수분포",
      en: "Exponential Distribution",
      ja: "指数分布",
    },
    field: "probability",
    subfield: "distributions",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "지수분포는 포아송 과정에서 사건 사이의 대기 시간을 모델링하는 연속 확률분포입니다. 무기억성을 가집니다.",
        formulas: [
          {
            latex: "f(x) = \\lambda e^{-\\lambda x}, \\quad x \\geq 0",
            description: "지수분포 확률밀도함수",
          },
          {
            latex: "E[X] = \\frac{1}{\\lambda}, \\quad \\text{Var}(X) = \\frac{1}{\\lambda^2}",
            description: "평균과 분산",
          },
          {
            latex: "P(X > s + t | X > s) = P(X > t)",
            description: "무기억성",
          },
        ],
        examples: [
          {
            problem: "전구 수명이 평균 1000시간인 지수분포를 따를 때, 500시간 이상 작동할 확률은?",
            solution: "P(X > 500) = e^(-500/1000) = e^(-0.5) ≈ 0.607",
          },
        ],
        applications: [
          { field: "신뢰성 공학", description: "고장 시간 분석" },
          { field: "대기열 이론", description: "서비스 시간 모델링" },
          { field: "방사선", description: "반감기 계산" },
        ],
      },
      en: {
        definition:
          "The exponential distribution models waiting times between events in a Poisson process. It has the memoryless property.",
        formulas: [
          {
            latex: "f(x) = \\lambda e^{-\\lambda x}, \\quad x \\geq 0",
            description: "Exponential PDF",
          },
          {
            latex: "P(X > s + t | X > s) = P(X > t)",
            description: "Memoryless property",
          },
        ],
        examples: [
          {
            problem: "Light bulb lifetime is exponential with mean 1000 hours. Find P(lasts > 500 hours).",
            solution: "P(X > 500) = e^(-500/1000) = e^(-0.5) ≈ 0.607",
          },
        ],
        applications: [
          { field: "Reliability Engineering", description: "Failure time analysis" },
          { field: "Queuing Theory", description: "Service time modeling" },
          { field: "Radioactivity", description: "Half-life calculations" },
        ],
      },
    },
    relations: {
      prerequisites: ["poisson-distribution"],
      nextTopics: ["gamma-distribution"],
      related: ["geometric-distribution"],
    },
    tags: ["지수분포", "연속분포", "exponential", "continuous"],
  },

  // ===== 7.5 통계적 추론 (Statistical Inference) =====
  {
    id: "hypothesis-testing",
    name: {
      ko: "가설 검정",
      en: "Hypothesis Testing",
      ja: "仮説検定",
    },
    field: "probability",
    subfield: "inference",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "가설 검정은 표본 데이터를 사용하여 모집단에 대한 주장(귀무가설)을 기각할지 결정하는 통계적 방법입니다.",
        formulas: [
          {
            latex: "H_0: \\mu = \\mu_0 \\quad \\text{vs} \\quad H_1: \\mu \\neq \\mu_0",
            description: "양측 검정의 가설",
          },
          {
            latex: "Z = \\frac{\\bar{X} - \\mu_0}{\\sigma / \\sqrt{n}}",
            description: "Z-검정 통계량",
          },
          {
            latex: "p\\text{-value} < \\alpha \\Rightarrow H_0 \\text{ 기각}",
            description: "유의수준과 p-값 비교",
          },
        ],
        examples: [
          {
            problem: "표본 평균 52, 모평균 가설 50, 모표준편차 10, n=100일 때 Z-검정을 수행하세요.",
            solution:
              "Z = (52-50)/(10/10) = 2. 유의수준 0.05에서 |Z| > 1.96이면 기각. |2| > 1.96이므로 H₀ 기각.",
          },
        ],
        applications: [
          { field: "의학", description: "약물 효과 검증" },
          { field: "품질 관리", description: "제품 규격 검사" },
          { field: "A/B 테스트", description: "웹사이트 최적화" },
        ],
      },
      en: {
        definition:
          "Hypothesis testing is a statistical method that uses sample data to decide whether to reject a claim (null hypothesis) about a population.",
        formulas: [
          {
            latex: "H_0: \\mu = \\mu_0 \\quad \\text{vs} \\quad H_1: \\mu \\neq \\mu_0",
            description: "Two-tailed test hypotheses",
          },
          {
            latex: "Z = \\frac{\\bar{X} - \\mu_0}{\\sigma / \\sqrt{n}}",
            description: "Z-test statistic",
          },
        ],
        examples: [
          {
            problem: "Sample mean 52, null μ=50, σ=10, n=100. Perform Z-test.",
            solution:
              "Z = (52-50)/(10/10) = 2. At α=0.05, reject if |Z| > 1.96. Since |2| > 1.96, reject H₀.",
          },
        ],
        applications: [
          { field: "Medicine", description: "Drug efficacy testing" },
          { field: "Quality Control", description: "Product specification testing" },
          { field: "A/B Testing", description: "Website optimization" },
        ],
      },
    },
    relations: {
      prerequisites: ["normal-distribution", "central-limit-theorem"],
      nextTopics: ["t-test", "chi-square-test"],
      related: ["confidence-interval"],
    },
    tags: ["가설검정", "통계추론", "hypothesis testing", "inference"],
  },
  {
    id: "confidence-interval",
    name: {
      ko: "신뢰구간",
      en: "Confidence Interval",
      ja: "信頼区間",
    },
    field: "probability",
    subfield: "inference",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "신뢰구간은 모수가 포함될 것으로 추정되는 구간입니다. 95% 신뢰구간은 표본을 반복 추출할 때 95%의 구간이 모수를 포함함을 의미합니다.",
        formulas: [
          {
            latex: "\\bar{X} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}",
            description: "평균의 신뢰구간 (σ 알려짐)",
          },
          {
            latex: "\\bar{X} \\pm t_{\\alpha/2, n-1} \\cdot \\frac{s}{\\sqrt{n}}",
            description: "평균의 신뢰구간 (σ 모름)",
          },
        ],
        examples: [
          {
            problem: "표본 평균 100, 표준편차 15, n=36일 때 95% 신뢰구간을 구하세요.",
            solution: "100 ± 1.96 × (15/6) = 100 ± 4.9 = (95.1, 104.9)",
          },
        ],
        applications: [
          { field: "여론조사", description: "오차범위 계산" },
          { field: "임상시험", description: "효과 크기 추정" },
          { field: "공학", description: "측정 불확실성" },
        ],
      },
      en: {
        definition:
          "A confidence interval is a range within which a parameter is estimated to lie. A 95% CI means 95% of such intervals from repeated samples would contain the true parameter.",
        formulas: [
          {
            latex: "\\bar{X} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}",
            description: "CI for mean (σ known)",
          },
          {
            latex: "\\bar{X} \\pm t_{\\alpha/2, n-1} \\cdot \\frac{s}{\\sqrt{n}}",
            description: "CI for mean (σ unknown)",
          },
        ],
        examples: [
          {
            problem: "Sample mean 100, SD 15, n=36. Find 95% CI.",
            solution: "100 ± 1.96 × (15/6) = 100 ± 4.9 = (95.1, 104.9)",
          },
        ],
        applications: [
          { field: "Polling", description: "Margin of error" },
          { field: "Clinical Trials", description: "Effect size estimation" },
          { field: "Engineering", description: "Measurement uncertainty" },
        ],
      },
    },
    relations: {
      prerequisites: ["normal-distribution", "central-limit-theorem"],
      nextTopics: ["hypothesis-testing"],
      related: ["standard-error"],
    },
    tags: ["신뢰구간", "추정", "confidence interval", "estimation"],
  },
  {
    id: "regression",
    name: {
      ko: "회귀분석",
      en: "Regression Analysis",
      ja: "回帰分析",
    },
    field: "probability",
    subfield: "statistics",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "회귀분석은 독립변수와 종속변수 사이의 관계를 모델링합니다. 선형 회귀는 가장 기본적인 형태입니다.",
        formulas: [
          {
            latex: "y = \\beta_0 + \\beta_1 x + \\epsilon",
            description: "단순 선형 회귀 모델",
          },
          {
            latex: "\\hat{\\beta}_1 = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2}",
            description: "최소제곱 추정량",
          },
          {
            latex: "R^2 = 1 - \\frac{SS_{res}}{SS_{tot}}",
            description: "결정계수 (설명력)",
          },
        ],
        examples: [
          {
            problem: "x = [1, 2, 3, 4], y = [2, 4, 5, 4]일 때 회귀선을 구하세요.",
            solution:
              "x̄=2.5, ȳ=3.75. β₁ = Σ(xᵢ-x̄)(yᵢ-ȳ)/Σ(xᵢ-x̄)² = 2.5/5 = 0.5. β₀ = 3.75 - 0.5(2.5) = 2.5. y = 2.5 + 0.5x",
          },
        ],
        applications: [
          { field: "경제학", description: "수요 예측" },
          { field: "기계학습", description: "예측 모델의 기초" },
          { field: "사회과학", description: "변수 간 관계 분석" },
        ],
      },
      en: {
        definition:
          "Regression analysis models the relationship between independent and dependent variables. Linear regression is the most basic form.",
        formulas: [
          {
            latex: "y = \\beta_0 + \\beta_1 x + \\epsilon",
            description: "Simple linear regression model",
          },
          {
            latex: "\\hat{\\beta}_1 = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2}",
            description: "Least squares estimator",
          },
          {
            latex: "R^2 = 1 - \\frac{SS_{res}}{SS_{tot}}",
            description: "Coefficient of determination",
          },
        ],
        examples: [
          {
            problem: "For x = [1, 2, 3, 4], y = [2, 4, 5, 4], find the regression line.",
            solution: "x̄=2.5, ȳ=3.75. β₁ = 0.5, β₀ = 2.5. y = 2.5 + 0.5x",
          },
        ],
        applications: [
          { field: "Economics", description: "Demand forecasting" },
          { field: "Machine Learning", description: "Foundation for prediction models" },
          { field: "Social Sciences", description: "Relationship analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["variance", "correlation"],
      nextTopics: ["multiple-regression", "logistic-regression"],
      related: ["least-squares"],
    },
    tags: ["회귀분석", "선형회귀", "regression", "linear regression"],
  },

  // ===== 7.6 베이즈 통계 (Bayesian Statistics) =====
  {
    id: "bayes-theorem",
    name: {
      ko: "베이즈 정리",
      en: "Bayes' Theorem",
      ja: "ベイズの定理",
    },
    field: "probability",
    subfield: "bayesian",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "베이즈 정리는 새로운 증거를 바탕으로 사전 확률을 업데이트하여 사후 확률을 계산합니다.",
        formulas: [
          {
            latex: "P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}",
            description: "베이즈 정리",
          },
          {
            latex: "P(B) = \\sum_i P(B|A_i) P(A_i)",
            description: "전체 확률의 법칙",
          },
          {
            latex: "\\text{posterior} \\propto \\text{likelihood} \\times \\text{prior}",
            description: "사후 확률의 비례 관계",
          },
        ],
        examples: [
          {
            problem:
              "질병 유병률 1%, 검사 양성일 때 실제 양성 99%, 음성일 때 거짓 양성 5%. 양성일 때 실제 질병일 확률은?",
            solution:
              "P(질병|양성) = P(양성|질병)P(질병) / P(양성)\n= (0.99 × 0.01) / (0.99×0.01 + 0.05×0.99)\n= 0.0099 / 0.0594 ≈ 16.7%",
          },
        ],
        history: {
          discoveredBy: "토머스 베이즈",
          year: "1763년",
          background:
            "베이즈 사후 리처드 프라이스가 발표했습니다.",
        },
        applications: [
          { field: "의학", description: "진단 검사 해석" },
          { field: "기계학습", description: "나이브 베이즈 분류기" },
          { field: "스팸 필터", description: "이메일 분류" },
        ],
      },
      en: {
        definition:
          "Bayes' theorem calculates posterior probability by updating prior probability based on new evidence.",
        formulas: [
          {
            latex: "P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}",
            description: "Bayes' Theorem",
          },
          {
            latex: "\\text{posterior} \\propto \\text{likelihood} \\times \\text{prior}",
            description: "Posterior proportionality",
          },
        ],
        examples: [
          {
            problem:
              "Disease prevalence 1%, test sensitivity 99%, false positive rate 5%. If positive, what's P(disease)?",
            solution:
              "P(disease|positive) = (0.99 × 0.01) / (0.99×0.01 + 0.05×0.99) ≈ 16.7%",
          },
        ],
        history: {
          discoveredBy: "Thomas Bayes",
          year: "1763",
          background: "Published posthumously by Richard Price.",
        },
        applications: [
          { field: "Medicine", description: "Diagnostic test interpretation" },
          { field: "Machine Learning", description: "Naive Bayes classifier" },
          { field: "Spam Filtering", description: "Email classification" },
        ],
      },
    },
    relations: {
      prerequisites: ["conditional-probability"],
      nextTopics: ["bayesian-inference"],
      related: ["likelihood"],
    },
    tags: ["베이즈정리", "조건부확률", "Bayes theorem", "Bayesian"],
  },
  {
    id: "law-of-large-numbers",
    name: {
      ko: "큰 수의 법칙",
      en: "Law of Large Numbers",
      ja: "大数の法則",
    },
    field: "probability",
    subfield: "probability-theory",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "큰 수의 법칙은 표본 크기가 커질수록 표본 평균이 모평균에 가까워진다는 정리입니다.",
        formulas: [
          {
            latex: "\\lim_{n \\to \\infty} P\\left(|\\bar{X}_n - \\mu| > \\epsilon\\right) = 0",
            description: "약한 큰 수의 법칙",
          },
          {
            latex: "\\bar{X}_n \\to \\mu \\quad \\text{a.s.}",
            description: "강한 큰 수의 법칙",
          },
        ],
        examples: [
          {
            problem: "동전을 많이 던질수록 앞면 비율이 0.5에 가까워지는 이유를 설명하세요.",
            solution:
              "큰 수의 법칙에 의해 n→∞일 때 표본 비율(앞면 횟수/n)이 모비율 0.5에 수렴합니다.",
          },
        ],
        history: {
          discoveredBy: "야콥 베르누이",
          year: "1713년",
          background:
            "베르누이가 '추측술'에서 약한 큰 수의 법칙을 증명했습니다.",
        },
        applications: [
          { field: "보험", description: "리스크 풀링의 수학적 기초" },
          { field: "도박", description: "카지노가 장기적으로 이기는 이유" },
          { field: "몬테카를로", description: "시뮬레이션 수렴 보장" },
        ],
      },
      en: {
        definition:
          "The Law of Large Numbers states that as sample size increases, the sample mean converges to the population mean.",
        formulas: [
          {
            latex: "\\lim_{n \\to \\infty} P\\left(|\\bar{X}_n - \\mu| > \\epsilon\\right) = 0",
            description: "Weak law of large numbers",
          },
          {
            latex: "\\bar{X}_n \\to \\mu \\quad \\text{a.s.}",
            description: "Strong law of large numbers",
          },
        ],
        examples: [
          {
            problem: "Explain why coin flip heads ratio approaches 0.5 with more flips.",
            solution:
              "By LLN, as n→∞, the sample proportion (heads/n) converges to the true probability 0.5.",
          },
        ],
        history: {
          discoveredBy: "Jacob Bernoulli",
          year: "1713",
          background: "Bernoulli proved the weak LLN in 'Ars Conjectandi'.",
        },
        applications: [
          { field: "Insurance", description: "Mathematical basis of risk pooling" },
          { field: "Gambling", description: "Why casinos win long-term" },
          { field: "Monte Carlo", description: "Simulation convergence guarantee" },
        ],
      },
    },
    relations: {
      prerequisites: ["expected-value", "variance"],
      nextTopics: ["central-limit-theorem"],
      related: ["chebyshev-inequality"],
    },
    tags: ["큰수의법칙", "수렴", "law of large numbers", "LLN"],
  },
];
