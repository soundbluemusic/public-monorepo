import type { MathConcept } from '../types';

export const statisticsConcepts: MathConcept[] = [
  {
    id: 'hypothesis-testing',
    name: {
      ko: '가설검정',
      en: 'Hypothesis Testing',
    },
    field: 'statistics',
    subfield: 'inference',
    difficulty: 3,
    content: {
      ko: {
        definition: '표본 데이터를 사용하여 모집단에 대한 가설의 타당성을 검증하는 통계적 방법',
        formulas: [
          '귀무가설 H₀ vs 대립가설 H₁',
          '검정통계량 T',
          '오른쪽 단측 검정의 p값: P(T ≥ t | H₀). 방향과 검정 방식에 따라 달라짐',
          '유의수준 α (보통 0.05)',
        ],
        examples: ['t-검정', 'χ²-검정', 'F-검정'],
        applications: ['의학 연구', '품질 관리', 'A/B 테스트'],
      },
      en: {
        definition:
          'Statistical method to test validity of hypotheses about population using sample data',
        formulas: [
          'Null H₀ vs Alternative H₁',
          'Test statistic T',
          'Upper-tailed test: p-value = P(T ≥ t | H₀). The tail depends on the alternative',
          'Significance level α (usually 0.05)',
        ],
        examples: ['t-test', 'χ²-test', 'F-test'],
        applications: ['Medical research', 'Quality control', 'A/B testing'],
      },
    },
    latex: 'p_{\\text{upper}} = P(T \\geq t \\mid H_0)',
    relations: {
      prerequisites: ['probability', 'normal-distribution'],
      nextTopics: ['confidence-interval', 'anova'],
      related: ['central-limit-theorem'],
      applications: ['research', 'data-science'],
    },
    tags: ['가설검정', 'hypothesis', 'p-value', 'inference'],
  },
  {
    id: 'confidence-interval',
    name: {
      ko: '신뢰구간',
      en: 'Confidence Interval',
    },
    field: 'statistics',
    subfield: 'inference',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '표본으로 모수를 추정하는 구간. 같은 조건에서 표본을 반복 추출해 95% 신뢰구간을 만들면, 장기적으로 그 구간 중 95%가 참 모수를 포함합니다. 근사 방법은 이 비율이 대략 95%입니다.',
        formulas: [
          '평균의 z-구간: x̄ ± z_{α/2} · σ/√n (독립 정규표본, σ를 아는 경우)',
          't-구간: x̄ ± t_{α/2,n-1} · s/√n (독립 정규표본, σ를 모르는 경우)',
          '비율의 근사 구간: p̂ ± z_{α/2}√(p̂(1-p̂)/n) (독립 베르누이 표본, np와 n(1-p)가 충분히 클 때)',
        ],
        examples: ['95% CI for μ', '99% CI for proportion'],
        applications: ['여론조사', '의학 연구', '품질 추정'],
      },
      en: {
        definition:
          'An interval estimated from a sample. Under the same conditions, 95% of intervals constructed from repeated samples contain the true parameter in the long run; approximate methods achieve approximately 95%.',
        formulas: [
          'Mean z-interval: x̄ ± z_{α/2} · σ/√n (independent normal sample, known σ)',
          't-interval: x̄ ± t_{α/2,n-1} · s/√n (independent normal sample, unknown σ)',
          'Approximate proportion interval: p̂ ± z_{α/2}√(p̂(1-p̂)/n) (independent Bernoulli sample, np and n(1-p) sufficiently large)',
        ],
        examples: ['95% CI for μ', '99% CI for proportion'],
        applications: ['Polling', 'Medical research', 'Quality estimation'],
      },
    },
    latex: '\\bar{x} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}',
    relations: {
      prerequisites: ['sampling-distribution', 'normal-distribution'],
      nextTopics: ['hypothesis-testing'],
      related: ['central-limit-theorem'],
      applications: ['estimation', 'research'],
    },
    tags: ['신뢰구간', 'confidence', 'interval', 'estimation'],
  },
  {
    id: 'regression-analysis',
    name: {
      ko: '회귀분석',
      en: 'Regression Analysis',
    },
    field: 'statistics',
    subfield: 'modeling',
    difficulty: 3,
    content: {
      ko: {
        definition: '변수들 간의 관계를 모델링하고 예측하는 통계적 방법',
        formulas: [
          '단순선형: y = β₀ + β₁x + ε',
          '다중선형: y = β₀ + Σβᵢxᵢ + ε',
          'OLS: min Σ(yᵢ - ŷᵢ)²',
          'R²: 결정계수',
        ],
        examples: ['주가 예측', '매출 분석', '의료 예후'],
        applications: ['경제학', '마케팅', '과학 연구'],
      },
      en: {
        definition:
          'Statistical method for modeling and predicting relationships between variables',
        formulas: [
          'Simple linear: y = β₀ + β₁x + ε',
          'Multiple: y = β₀ + Σβᵢxᵢ + ε',
          'OLS: min Σ(yᵢ - ŷᵢ)²',
          'R²: coefficient of determination',
        ],
        examples: ['Stock prediction', 'Sales analysis', 'Medical prognosis'],
        applications: ['Economics', 'Marketing', 'Scientific research'],
      },
    },
    latex: 'y = \\beta_0 + \\beta_1 x + \\epsilon',
    relations: {
      prerequisites: ['correlation', 'linear-algebra'],
      nextTopics: ['logistic-regression', 'anova'],
      related: ['least-squares'],
      applications: ['prediction', 'inference'],
    },
    tags: ['회귀', 'regression', 'prediction', 'modeling'],
  },
  {
    id: 'anova',
    name: {
      ko: '분산분석 (ANOVA)',
      en: 'Analysis of Variance (ANOVA)',
    },
    field: 'statistics',
    subfield: 'inference',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '두 개 이상 그룹의 평균 차이를 검정하는 방법. 일원 분산분석의 표준 F 검정은 독립성, 정규성, 등분산을 가정한다',
        formulas: [
          'F = MS_between / MS_within',
          'SS_total = SS_between + SS_within',
          'df_between = k-1, df_within = N-k',
        ],
        examples: ['약물 효과 비교', '교수법 효과', '제품 품질 비교'],
        applications: ['실험 설계', '의학', '심리학'],
      },
      en: {
        definition:
          'Method for testing mean differences among two or more groups. The standard one-way F test assumes independence, normality, and equal variances',
        formulas: [
          'F = MS_between / MS_within',
          'SS_total = SS_between + SS_within',
          'df_between = k-1, df_within = N-k',
        ],
        examples: [
          'Drug efficacy comparison',
          'Teaching method effects',
          'Product quality comparison',
        ],
        applications: ['Experimental design', 'Medicine', 'Psychology'],
      },
    },
    latex: 'F = \\frac{MS_{between}}{MS_{within}}',
    relations: {
      prerequisites: ['hypothesis-testing', 'variance'],
      nextTopics: ['manova', 'post-hoc-tests'],
      related: ['t-test'],
      applications: ['experimental-research'],
    },
    tags: ['ANOVA', '분산분석', 'F-test', 'comparison'],
  },
  {
    id: 'bayesian-inference',
    name: {
      ko: '베이지안 추론',
      en: 'Bayesian Inference',
    },
    field: 'statistics',
    subfield: 'bayesian',
    difficulty: 4,
    content: {
      ko: {
        definition: '사전 지식과 데이터를 결합하여 사후 확률을 계산하는 통계적 추론 방법',
        formulas: [
          'P(θ|data) ∝ P(data|θ) · P(θ)',
          '사후 ∝ 가능도 × 사전',
          '베이즈 인자: BF = P(data|M₁)/P(data|M₂)',
        ],
        examples: ['스팸 필터', '의료 진단', '추천 시스템'],
        applications: ['기계학습', '의사결정', 'A/B 테스트'],
      },
      en: {
        definition:
          'Statistical inference combining prior knowledge with data to compute posterior probability',
        formulas: [
          'P(θ|data) ∝ P(data|θ) · P(θ)',
          'Posterior ∝ Likelihood × Prior',
          'Bayes factor: BF = P(data|M₁)/P(data|M₂)',
        ],
        examples: ['Spam filter', 'Medical diagnosis', 'Recommendation systems'],
        applications: ['Machine learning', 'Decision making', 'A/B testing'],
      },
    },
    latex: 'P(\\theta|\\text{data}) \\propto P(\\text{data}|\\theta) \\cdot P(\\theta)',
    relations: {
      prerequisites: ['bayes-theorem', 'probability'],
      nextTopics: ['mcmc', 'conjugate-priors'],
      related: ['maximum-likelihood'],
      applications: ['machine-learning', 'statistics'],
    },
    tags: ['베이지안', 'Bayesian', '사후확률', 'inference'],
  },
  {
    id: 'maximum-likelihood',
    name: {
      ko: '최대가능도 추정',
      en: 'Maximum Likelihood Estimation',
    },
    field: 'statistics',
    subfield: 'estimation',
    difficulty: 4,
    content: {
      ko: {
        definition: '관측된 데이터를 가장 잘 설명하는 모수를 찾는 추정 방법',
        formulas: [
          '가능도: L(θ) = ∏f(xᵢ|θ) (독립 표본; f는 확률질량함수 또는 확률밀도함수)',
          '로그가능도: ℓ(θ) = Σlog f(xᵢ|θ)',
          'MLE: θ̂ = argmax L(θ)',
        ],
        examples: [
          '독립 정규표본의 MLE: μ̂=x̄, σ̂²=Σ(xᵢ-x̄)²/n (표본이 모두 같지 않을 때)',
          '독립 베르누이 표본의 MLE: p̂ = x̄',
        ],
        applications: ['모수 추정', '기계학습', '통계 모델링'],
      },
      en: {
        definition: 'Estimation method finding parameters that best explain observed data',
        formulas: [
          'Likelihood: L(θ) = ∏f(xᵢ|θ) (independent sample; f is a probability mass or density function)',
          'Log-likelihood: ℓ(θ) = Σlog f(xᵢ|θ)',
          'MLE: θ̂ = argmax L(θ)',
        ],
        examples: [
          'MLE for an independent normal sample: μ̂=x̄, σ̂²=Σ(xᵢ-x̄)²/n (when observations are not all equal)',
          'MLE for an independent Bernoulli sample: p̂ = x̄',
        ],
        applications: ['Parameter estimation', 'Machine learning', 'Statistical modeling'],
      },
    },
    latex: '\\hat{\\theta} = \\arg\\max_\\theta L(\\theta)',
    relations: {
      prerequisites: ['probability', 'calculus'],
      nextTopics: ['bayesian-inference', 'em-algorithm'],
      related: ['least-squares'],
      applications: ['estimation', 'machine-learning'],
    },
    tags: ['MLE', '최대가능도', 'likelihood', 'estimation'],
  },
  {
    id: 'time-series',
    name: {
      ko: '시계열 분석',
      en: 'Time Series Analysis',
    },
    field: 'statistics',
    subfield: 'modeling',
    difficulty: 4,
    content: {
      ko: {
        definition: '시간에 따라 관측된 데이터의 패턴을 분석하고 예측하는 방법',
        formulas: [
          'AR(p): Xₜ = Σφᵢ Xₜ₋ᵢ + εₜ',
          'MA(q): Xₜ = εₜ + Σθⱼ εₜ₋ⱼ',
          'ARIMA(p,d,q)',
          '약한 정상성: 유한한 2차 모멘트, 일정한 평균, Cov(Xₜ,Xₜ₊ₕ)가 시차 h에만 의존',
        ],
        examples: ['주가 예측', '기온 예측', '수요 예측'],
        applications: ['금융', '기상학', '경제학'],
      },
      en: {
        definition: 'Methods for analyzing patterns and forecasting data observed over time',
        formulas: [
          'AR(p): Xₜ = Σφᵢ Xₜ₋ᵢ + εₜ',
          'MA(q): Xₜ = εₜ + Σθⱼ εₜ₋ⱼ',
          'ARIMA(p,d,q)',
          'Weak stationarity: finite second moments, constant mean, and Cov(Xₜ,Xₜ₊ₕ) depending only on lag h',
        ],
        examples: ['Stock forecasting', 'Temperature prediction', 'Demand forecasting'],
        applications: ['Finance', 'Meteorology', 'Economics'],
      },
    },
    latex: 'X_t = \\sum_{i=1}^{p} \\phi_i X_{t-i} + \\epsilon_t',
    relations: {
      prerequisites: ['regression-analysis', 'stochastic-processes'],
      nextTopics: ['garch', 'state-space-model'],
      related: ['forecasting'],
      applications: ['finance', 'forecasting'],
    },
    tags: ['시계열', 'time-series', 'ARIMA', 'forecasting'],
  },
  {
    id: 'chi-square-test',
    name: {
      ko: '카이제곱 검정',
      en: 'Chi-Square Test',
    },
    field: 'statistics',
    subfield: 'inference',
    difficulty: 3,
    content: {
      ko: {
        definition: '범주형 데이터의 독립성 또는 적합도를 검정하는 비모수적 방법',
        formulas: ['χ² = Σ(O-E)²/E', '독립성 검정: df = (r-1)(c-1)', '적합도 검정: df = k-1'],
        examples: ['성별과 선호도 독립성', '주사위 공정성', '유전 비율'],
        applications: ['설문조사', '품질관리', '유전학'],
      },
      en: {
        definition:
          'Non-parametric method for testing independence or goodness-of-fit of categorical data',
        formulas: ['χ² = Σ(O-E)²/E', 'Independence: df = (r-1)(c-1)', 'Goodness-of-fit: df = k-1'],
        examples: ['Gender and preference independence', 'Dice fairness', 'Genetic ratios'],
        applications: ['Surveys', 'Quality control', 'Genetics'],
      },
    },
    latex: '\\chi^2 = \\sum \\frac{(O - E)^2}{E}',
    relations: {
      prerequisites: ['probability', 'hypothesis-testing'],
      nextTopics: ['fishers-exact-test'],
      related: ['contingency-table'],
      applications: ['categorical-analysis'],
    },
    tags: ['카이제곱', 'chi-square', '독립성', 'goodness-of-fit'],
  },
];
