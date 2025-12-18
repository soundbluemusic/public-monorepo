import { MathConcept } from '../types';

export const statisticsConcepts: MathConcept[] = [
  {
    id: 'hypothesis-testing',
    name: {
      ko: '가설검정',
      en: 'Hypothesis Testing',
      ja: '仮説検定'
    },
    field: 'statistics',
    subfield: 'inference',
    difficulty: 3,
    content: {
      ko: {
        definition: '표본 데이터를 사용하여 모집단에 대한 가설의 타당성을 검증하는 통계적 방법',
        formulas: ['귀무가설 H₀ vs 대립가설 H₁', '검정통계량 T', 'p-value = P(T ≥ t | H₀)', '유의수준 α (보통 0.05)'],
        examples: ['t-검정', 'χ²-검정', 'F-검정'],
        applications: ['의학 연구', '품질 관리', 'A/B 테스트']
      },
      en: {
        definition: 'Statistical method to test validity of hypotheses about population using sample data',
        formulas: ['Null H₀ vs Alternative H₁', 'Test statistic T', 'p-value = P(T ≥ t | H₀)', 'Significance level α (usually 0.05)'],
        examples: ['t-test', 'χ²-test', 'F-test'],
        applications: ['Medical research', 'Quality control', 'A/B testing']
      },
      ja: {
        definition: '標本データを使用して母集団についての仮説の妥当性を検証する統計的方法',
        formulas: ['帰無仮説 H₀ vs 対立仮説 H₁', '検定統計量 T', 'p値 = P(T ≥ t | H₀)', '有意水準 α (通常0.05)'],
        examples: ['t検定', 'χ²検定', 'F検定'],
        applications: ['医学研究', '品質管理', 'A/Bテスト']
      }
    },
    latex: 'p\\text{-value} = P(T \\geq t | H_0)',
    relations: {
      prerequisites: ['probability', 'normal-distribution'],
      nextTopics: ['confidence-interval', 'anova'],
      related: ['central-limit-theorem'],
      applications: ['research', 'data-science']
    },
    tags: ['가설검정', 'hypothesis', 'p-value', 'inference']
  },
  {
    id: 'confidence-interval',
    name: {
      ko: '신뢰구간',
      en: 'Confidence Interval',
      ja: '信頼区間'
    },
    field: 'statistics',
    subfield: 'inference',
    difficulty: 3,
    content: {
      ko: {
        definition: '모수가 포함될 것으로 예상되는 값의 범위. 95% 신뢰구간은 반복 표본에서 95%가 참값 포함',
        formulas: ['평균의 CI: x̄ ± z_{α/2} · σ/√n', 't-CI: x̄ ± t_{α/2,n-1} · s/√n', '비율의 CI: p̂ ± z_{α/2}√(p̂(1-p̂)/n)'],
        examples: ['95% CI for μ', '99% CI for proportion'],
        applications: ['여론조사', '의학 연구', '품질 추정']
      },
      en: {
        definition: 'Range of values expected to contain parameter. 95% CI means 95% of repeated samples contain true value',
        formulas: ['Mean CI: x̄ ± z_{α/2} · σ/√n', 't-CI: x̄ ± t_{α/2,n-1} · s/√n', 'Proportion CI: p̂ ± z_{α/2}√(p̂(1-p̂)/n)'],
        examples: ['95% CI for μ', '99% CI for proportion'],
        applications: ['Polling', 'Medical research', 'Quality estimation']
      },
      ja: {
        definition: '母数が含まれると予想される値の範囲。95%信頼区間は繰り返し標本の95%が真の値を含む',
        formulas: ['平均のCI: x̄ ± z_{α/2} · σ/√n', 't-CI: x̄ ± t_{α/2,n-1} · s/√n', '比率のCI: p̂ ± z_{α/2}√(p̂(1-p̂)/n)'],
        examples: ['95% CI for μ', '99% CI for proportion'],
        applications: ['世論調査', '医学研究', '品質推定']
      }
    },
    latex: '\\bar{x} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}',
    relations: {
      prerequisites: ['sampling-distribution', 'normal-distribution'],
      nextTopics: ['hypothesis-testing'],
      related: ['central-limit-theorem'],
      applications: ['estimation', 'research']
    },
    tags: ['신뢰구간', 'confidence', 'interval', 'estimation']
  },
  {
    id: 'regression-analysis',
    name: {
      ko: '회귀분석',
      en: 'Regression Analysis',
      ja: '回帰分析'
    },
    field: 'statistics',
    subfield: 'modeling',
    difficulty: 3,
    content: {
      ko: {
        definition: '변수들 간의 관계를 모델링하고 예측하는 통계적 방법',
        formulas: ['단순선형: y = β₀ + β₁x + ε', '다중선형: y = β₀ + Σβᵢxᵢ + ε', 'OLS: min Σ(yᵢ - ŷᵢ)²', 'R²: 결정계수'],
        examples: ['주가 예측', '매출 분석', '의료 예후'],
        applications: ['경제학', '마케팅', '과학 연구']
      },
      en: {
        definition: 'Statistical method for modeling and predicting relationships between variables',
        formulas: ['Simple linear: y = β₀ + β₁x + ε', 'Multiple: y = β₀ + Σβᵢxᵢ + ε', 'OLS: min Σ(yᵢ - ŷᵢ)²', 'R²: coefficient of determination'],
        examples: ['Stock prediction', 'Sales analysis', 'Medical prognosis'],
        applications: ['Economics', 'Marketing', 'Scientific research']
      },
      ja: {
        definition: '変数間の関係をモデル化し予測する統計的方法',
        formulas: ['単純線形: y = β₀ + β₁x + ε', '重回帰: y = β₀ + Σβᵢxᵢ + ε', 'OLS: min Σ(yᵢ - ŷᵢ)²', 'R²: 決定係数'],
        examples: ['株価予測', '売上分析', '医療予後'],
        applications: ['経済学', 'マーケティング', '科学研究']
      }
    },
    latex: 'y = \\beta_0 + \\beta_1 x + \\epsilon',
    relations: {
      prerequisites: ['correlation', 'linear-algebra'],
      nextTopics: ['logistic-regression', 'anova'],
      related: ['least-squares'],
      applications: ['prediction', 'inference']
    },
    tags: ['회귀', 'regression', 'prediction', 'modeling']
  },
  {
    id: 'anova',
    name: {
      ko: '분산분석 (ANOVA)',
      en: 'Analysis of Variance (ANOVA)',
      ja: '分散分析 (ANOVA)'
    },
    field: 'statistics',
    subfield: 'inference',
    difficulty: 4,
    content: {
      ko: {
        definition: '세 개 이상 그룹의 평균 차이를 검정하는 방법. 집단 간/내 분산 비교',
        formulas: ['F = MS_between / MS_within', 'SS_total = SS_between + SS_within', 'df_between = k-1, df_within = N-k'],
        examples: ['약물 효과 비교', '교수법 효과', '제품 품질 비교'],
        applications: ['실험 설계', '의학', '심리학']
      },
      en: {
        definition: 'Method for testing mean differences among three or more groups. Compares between/within variance',
        formulas: ['F = MS_between / MS_within', 'SS_total = SS_between + SS_within', 'df_between = k-1, df_within = N-k'],
        examples: ['Drug efficacy comparison', 'Teaching method effects', 'Product quality comparison'],
        applications: ['Experimental design', 'Medicine', 'Psychology']
      },
      ja: {
        definition: '3群以上の平均差を検定する方法。群間/群内分散を比較',
        formulas: ['F = MS_between / MS_within', 'SS_total = SS_between + SS_within', 'df_between = k-1, df_within = N-k'],
        examples: ['薬効比較', '教授法効果', '製品品質比較'],
        applications: ['実験計画', '医学', '心理学']
      }
    },
    latex: 'F = \\frac{MS_{between}}{MS_{within}}',
    relations: {
      prerequisites: ['hypothesis-testing', 'variance'],
      nextTopics: ['manova', 'post-hoc-tests'],
      related: ['t-test'],
      applications: ['experimental-research']
    },
    tags: ['ANOVA', '분산분석', 'F-test', 'comparison']
  },
  {
    id: 'bayesian-inference',
    name: {
      ko: '베이지안 추론',
      en: 'Bayesian Inference',
      ja: 'ベイズ推論'
    },
    field: 'statistics',
    subfield: 'bayesian',
    difficulty: 4,
    content: {
      ko: {
        definition: '사전 지식과 데이터를 결합하여 사후 확률을 계산하는 통계적 추론 방법',
        formulas: ['P(θ|data) ∝ P(data|θ) · P(θ)', '사후 ∝ 가능도 × 사전', '베이즈 인자: BF = P(data|M₁)/P(data|M₂)'],
        examples: ['스팸 필터', '의료 진단', '추천 시스템'],
        applications: ['기계학습', '의사결정', 'A/B 테스트']
      },
      en: {
        definition: 'Statistical inference combining prior knowledge with data to compute posterior probability',
        formulas: ['P(θ|data) ∝ P(data|θ) · P(θ)', 'Posterior ∝ Likelihood × Prior', 'Bayes factor: BF = P(data|M₁)/P(data|M₂)'],
        examples: ['Spam filter', 'Medical diagnosis', 'Recommendation systems'],
        applications: ['Machine learning', 'Decision making', 'A/B testing']
      },
      ja: {
        definition: '事前知識とデータを組み合わせて事後確率を計算する統計的推論方法',
        formulas: ['P(θ|data) ∝ P(data|θ) · P(θ)', '事後 ∝ 尤度 × 事前', 'ベイズファクター: BF = P(data|M₁)/P(data|M₂)'],
        examples: ['スパムフィルター', '医療診断', 'レコメンドシステム'],
        applications: ['機械学習', '意思決定', 'A/Bテスト']
      }
    },
    latex: 'P(\\theta|\\text{data}) \\propto P(\\text{data}|\\theta) \\cdot P(\\theta)',
    relations: {
      prerequisites: ['bayes-theorem', 'probability'],
      nextTopics: ['mcmc', 'conjugate-priors'],
      related: ['maximum-likelihood'],
      applications: ['machine-learning', 'statistics']
    },
    tags: ['베이지안', 'Bayesian', '사후확률', 'inference']
  },
  {
    id: 'maximum-likelihood',
    name: {
      ko: '최대가능도 추정',
      en: 'Maximum Likelihood Estimation',
      ja: '最尤推定'
    },
    field: 'statistics',
    subfield: 'estimation',
    difficulty: 4,
    content: {
      ko: {
        definition: '관측된 데이터를 가장 잘 설명하는 모수를 찾는 추정 방법',
        formulas: ['가능도: L(θ) = P(data|θ) = ∏P(xᵢ|θ)', '로그가능도: ℓ(θ) = Σlog P(xᵢ|θ)', 'MLE: θ̂ = argmax L(θ)'],
        examples: ['정규분포 MLE: μ̂=x̄, σ̂²=s²', '베르누이 MLE: p̂ = x̄'],
        applications: ['모수 추정', '기계학습', '통계 모델링']
      },
      en: {
        definition: 'Estimation method finding parameters that best explain observed data',
        formulas: ['Likelihood: L(θ) = P(data|θ) = ∏P(xᵢ|θ)', 'Log-likelihood: ℓ(θ) = Σlog P(xᵢ|θ)', 'MLE: θ̂ = argmax L(θ)'],
        examples: ['Normal MLE: μ̂=x̄, σ̂²=s²', 'Bernoulli MLE: p̂ = x̄'],
        applications: ['Parameter estimation', 'Machine learning', 'Statistical modeling']
      },
      ja: {
        definition: '観測データを最もよく説明するパラメータを見つける推定方法',
        formulas: ['尤度: L(θ) = P(data|θ) = ∏P(xᵢ|θ)', '対数尤度: ℓ(θ) = Σlog P(xᵢ|θ)', 'MLE: θ̂ = argmax L(θ)'],
        examples: ['正規分布 MLE: μ̂=x̄, σ̂²=s²', 'ベルヌーイ MLE: p̂ = x̄'],
        applications: ['パラメータ推定', '機械学習', '統計モデリング']
      }
    },
    latex: '\\hat{\\theta} = \\arg\\max_\\theta L(\\theta)',
    relations: {
      prerequisites: ['probability', 'calculus'],
      nextTopics: ['bayesian-inference', 'em-algorithm'],
      related: ['least-squares'],
      applications: ['estimation', 'machine-learning']
    },
    tags: ['MLE', '최대가능도', 'likelihood', 'estimation']
  },
  {
    id: 'time-series',
    name: {
      ko: '시계열 분석',
      en: 'Time Series Analysis',
      ja: '時系列分析'
    },
    field: 'statistics',
    subfield: 'modeling',
    difficulty: 4,
    content: {
      ko: {
        definition: '시간에 따라 관측된 데이터의 패턴을 분석하고 예측하는 방법',
        formulas: ['AR(p): Xₜ = Σφᵢ Xₜ₋ᵢ + εₜ', 'MA(q): Xₜ = εₜ + Σθⱼ εₜ₋ⱼ', 'ARIMA(p,d,q)', '정상성: E[Xₜ], Var[Xₜ] 일정'],
        examples: ['주가 예측', '기온 예측', '수요 예측'],
        applications: ['금융', '기상학', '경제학']
      },
      en: {
        definition: 'Methods for analyzing patterns and forecasting data observed over time',
        formulas: ['AR(p): Xₜ = Σφᵢ Xₜ₋ᵢ + εₜ', 'MA(q): Xₜ = εₜ + Σθⱼ εₜ₋ⱼ', 'ARIMA(p,d,q)', 'Stationarity: E[Xₜ], Var[Xₜ] constant'],
        examples: ['Stock forecasting', 'Temperature prediction', 'Demand forecasting'],
        applications: ['Finance', 'Meteorology', 'Economics']
      },
      ja: {
        definition: '時間に沿って観測されたデータのパターンを分析し予測する方法',
        formulas: ['AR(p): Xₜ = Σφᵢ Xₜ₋ᵢ + εₜ', 'MA(q): Xₜ = εₜ + Σθⱼ εₜ₋ⱼ', 'ARIMA(p,d,q)', '定常性: E[Xₜ], Var[Xₜ] 一定'],
        examples: ['株価予測', '気温予測', '需要予測'],
        applications: ['金融', '気象学', '経済学']
      }
    },
    latex: 'X_t = \\sum_{i=1}^{p} \\phi_i X_{t-i} + \\epsilon_t',
    relations: {
      prerequisites: ['regression-analysis', 'stochastic-processes'],
      nextTopics: ['garch', 'state-space-model'],
      related: ['forecasting'],
      applications: ['finance', 'forecasting']
    },
    tags: ['시계열', 'time-series', 'ARIMA', 'forecasting']
  },
  {
    id: 'chi-square-test',
    name: {
      ko: '카이제곱 검정',
      en: 'Chi-Square Test',
      ja: 'カイ二乗検定'
    },
    field: 'statistics',
    subfield: 'inference',
    difficulty: 3,
    content: {
      ko: {
        definition: '범주형 데이터의 독립성 또는 적합도를 검정하는 비모수적 방법',
        formulas: ['χ² = Σ(O-E)²/E', '독립성 검정: df = (r-1)(c-1)', '적합도 검정: df = k-1'],
        examples: ['성별과 선호도 독립성', '주사위 공정성', '유전 비율'],
        applications: ['설문조사', '품질관리', '유전학']
      },
      en: {
        definition: 'Non-parametric method for testing independence or goodness-of-fit of categorical data',
        formulas: ['χ² = Σ(O-E)²/E', 'Independence: df = (r-1)(c-1)', 'Goodness-of-fit: df = k-1'],
        examples: ['Gender and preference independence', 'Dice fairness', 'Genetic ratios'],
        applications: ['Surveys', 'Quality control', 'Genetics']
      },
      ja: {
        definition: 'カテゴリカルデータの独立性または適合度を検定するノンパラメトリック法',
        formulas: ['χ² = Σ(O-E)²/E', '独立性検定: df = (r-1)(c-1)', '適合度検定: df = k-1'],
        examples: ['性別と好みの独立性', 'サイコロの公平性', '遺伝比率'],
        applications: ['アンケート調査', '品質管理', '遺伝学']
      }
    },
    latex: '\\chi^2 = \\sum \\frac{(O - E)^2}{E}',
    relations: {
      prerequisites: ['probability', 'hypothesis-testing'],
      nextTopics: ['fishers-exact-test'],
      related: ['contingency-table'],
      applications: ['categorical-analysis']
    },
    tags: ['카이제곱', 'chi-square', '독립성', 'goodness-of-fit']
  }
];
