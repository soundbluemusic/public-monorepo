/**
 * @fileoverview 금융수학 개념 데이터
 */
import type { MathConcept } from '../types';

export const financeConcepts: MathConcept[] = [
  {
    id: 'compound-interest',
    name: {
      ko: '복리',
      en: 'Compound Interest',
    },
    field: 'applied-finance',
    subfield: 'basic-finance',
    difficulty: 2,
    content: {
      ko: {
        definition:
          "복리는 원금뿐만 아니라 이전에 발생한 이자에도 이자가 붙는 방식입니다. '이자에 이자가 붙는' 눈덩이 효과를 만듭니다.",
        formulas: [
          {
            latex: 'A = P(1 + r)^n',
            description: '복리 공식 (연 복리)',
          },
          {
            latex: 'A = P\\left(1 + \\frac{r}{m}\\right)^{mn}',
            description: 'm회 복리 (연 m회)',
          },
          {
            latex: 'A = Pe^{rt}',
            description: '연속 복리',
          },
          {
            latex: 't_{2x} = \\frac{\\ln 2}{\\ln(1+r)} \\approx \\frac{72}{100r} \\quad (r>0)',
            description:
              '연 복리 식을 연속 시간으로 확장한 2배 시간과 72의 법칙 근사 (r은 소수로 나타낸 연이율)',
          },
        ],
        examples: [
          {
            problem: '100만원을 연 5% 복리로 10년 예치하면?',
            solution: 'A = 1,000,000 × (1.05)^10 = 1,628,895원',
          },
          {
            problem: '연 6%일 때 원금이 2배가 되는 시간은?',
            solution:
              '72의 법칙: 약 12년. 연 복리 식을 연속 시간으로 확장하면 ln 2 / ln 1.06 ≈ 11.90년입니다. 이자가 매년 말에만 붙는다면 실제로 2배 이상이 되는 시점은 12년 말입니다.',
          },
        ],
        applications: [
          { field: '예금/대출', description: '이자 계산' },
          { field: '투자', description: '장기 수익 예측' },
          { field: '인플레이션', description: '화폐가치 변화' },
        ],
      },
      en: {
        definition:
          'Compound interest is when interest is added to principal, and future interest is earned on both. Creates a snowball effect.',
        formulas: [
          {
            latex: 'A = P(1 + r)^n',
            description: 'Compound interest formula (annual)',
          },
          {
            latex: 'A = P\\left(1 + \\frac{r}{m}\\right)^{mn}',
            description: 'm times compounding per year',
          },
          {
            latex: 'A = Pe^{rt}',
            description: 'Continuous compounding',
          },
          {
            latex: 't_{2x} = \\frac{\\ln 2}{\\ln(1+r)} \\approx \\frac{72}{100r} \\quad (r>0)',
            description:
              'Doubling time for the annual-compounding formula extended to real times, with Rule of 72 approximation (r is the annual rate as a decimal)',
          },
        ],
        examples: [
          {
            problem: 'Invest $10,000 at 5% for 10 years?',
            solution: 'A = 10,000 × (1.05)^10 = $16,288.95',
          },
          {
            problem: 'At 6%, how long to double?',
            solution:
              'Rule of 72: about 12 years. Extending the annual-compounding formula to real times gives ln 2 / ln 1.06 ≈ 11.90 years. If interest is credited only at year-end, the balance first reaches twice the principal at the end of year 12.',
          },
        ],
        applications: [
          { field: 'Banking', description: 'Interest calculation' },
          { field: 'Investment', description: 'Long-term return projection' },
          { field: 'Inflation', description: 'Purchasing power change' },
        ],
      },
    },
    relations: {
      prerequisites: ['exponents', 'logarithm'],
      nextTopics: ['present-value', 'annuity'],
      related: ['e-constant', 'exponential-growth'],
    },
    tags: ['복리', '이자', 'compound interest', 'finance'],
  },
  {
    id: 'moving-average',
    name: {
      ko: '이동평균',
      en: 'Moving Average',
    },
    field: 'applied-finance',
    subfield: 'technical-analysis',
    difficulty: 2,
    content: {
      ko: {
        definition:
          '이동평균은 일정 기간의 데이터 평균을 연속적으로 계산한 것입니다. 추세를 파악하고 노이즈를 제거하는 데 사용됩니다.',
        formulas: [
          {
            latex: 'SMA_n = \\frac{1}{n}\\sum_{i=0}^{n-1} P_{t-i}',
            description: '단순이동평균 (SMA)',
          },
          {
            latex: 'EMA_t = \\alpha P_t + (1-\\alpha)EMA_{t-1}',
            description: '지수이동평균 (EMA), α = 2/(n+1)',
          },
        ],
        examples: [
          {
            problem: '주가가 10, 11, 12, 13, 14일 때 5일 SMA는?',
            solution: 'SMA = (10+11+12+13+14)/5 = 12',
          },
          {
            problem: '20일 EMA의 가중치 α는?',
            solution: 'α = 2/(20+1) = 2/21 ≈ 0.095',
          },
        ],
        applications: [
          { field: '주식 분석', description: '추세 확인, 지지/저항선' },
          { field: '시계열 분석', description: '추세 추출' },
          { field: '신호 처리', description: '노이즈 필터링' },
        ],
      },
      en: {
        definition:
          'Moving average continuously calculates average over a fixed period. Used to identify trends and reduce noise.',
        formulas: [
          {
            latex: 'SMA_n = \\frac{1}{n}\\sum_{i=0}^{n-1} P_{t-i}',
            description: 'Simple Moving Average (SMA)',
          },
          {
            latex: 'EMA_t = \\alpha P_t + (1-\\alpha)EMA_{t-1}',
            description: 'Exponential Moving Average (EMA), α = 2/(n+1)',
          },
        ],
        examples: [
          {
            problem: "Prices: 10, 11, 12, 13, 14. What's 5-day SMA?",
            solution: 'SMA = (10+11+12+13+14)/5 = 12',
          },
          {
            problem: "What's the weight α for 20-day EMA?",
            solution: 'α = 2/(20+1) = 2/21 ≈ 0.095',
          },
        ],
        applications: [
          { field: 'Stock Analysis', description: 'Trend, support/resistance' },
          { field: 'Time Series', description: 'Trend extraction' },
          { field: 'Signal Processing', description: 'Noise filtering' },
        ],
      },
    },
    relations: {
      prerequisites: ['mean', 'summation-notation'],
      nextTopics: ['bollinger-bands', 'macd'],
      related: ['weighted-average'],
    },
    tags: ['이동평균', 'SMA', 'EMA', 'moving average', 'technical'],
  },
  {
    id: 'bollinger-bands',
    name: {
      ko: '볼린저 밴드',
      en: 'Bollinger Bands',
    },
    field: 'applied-finance',
    subfield: 'technical-analysis',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '볼린저 밴드는 이동평균 위아래에 표준편차 밴드를 그린 것입니다. 가격의 상대적 위치와 변동성을 동시에 보여줍니다.',
        formulas: [
          {
            latex: '\\text{Middle} = SMA_{20}',
            description: '중심선 (20일 이동평균)',
          },
          {
            latex: '\\text{Upper} = SMA_{20} + 2\\sigma',
            description: '상단 밴드',
          },
          {
            latex: '\\text{Lower} = SMA_{20} - 2\\sigma',
            description: '하단 밴드',
          },
          {
            latex: '\\%B = \\frac{P - Lower}{Upper - Lower}',
            description: '%B 지표 (Upper ≠ Lower일 때 밴드에 대한 상대 위치)',
          },
        ],
        examples: [
          {
            problem: 'SMA=100, σ=5일 때 볼린저 밴드는?',
            solution: '상단: 110, 중심: 100, 하단: 90',
          },
          {
            problem: '가격이 상단 밴드에 닿으면?',
            solution:
              '일부 분석가는 과매수 신호로 해석하지만, 가격 하락이나 수익을 보장하지는 않습니다.',
          },
        ],
        history: {
          discoveredBy: '존 볼린저',
          year: '1980년대',
          background: '볼린저가 개발한 대표적인 기술적 분석 도구입니다.',
        },
        applications: [
          { field: '주식 매매', description: '과매수/과매도 판단' },
          { field: '변동성 분석', description: '밴드 폭으로 변동성 측정' },
          { field: '추세 판단', description: '밴드 방향으로 추세 확인' },
        ],
      },
      en: {
        definition:
          'Bollinger Bands plot standard deviation bands around a moving average. Shows relative price position and volatility together.',
        formulas: [
          {
            latex: '\\text{Middle} = SMA_{20}',
            description: 'Middle band (20-day SMA)',
          },
          {
            latex: '\\text{Upper} = SMA_{20} + 2\\sigma',
            description: 'Upper band',
          },
          {
            latex: '\\text{Lower} = SMA_{20} - 2\\sigma',
            description: 'Lower band',
          },
          {
            latex: '\\%B = \\frac{P - Lower}{Upper - Lower}',
            description: '%B indicator (relative position to the bands when Upper ≠ Lower)',
          },
        ],
        examples: [
          {
            problem: 'If SMA=100, σ=5, what are the bands?',
            solution: 'Upper: 110, Middle: 100, Lower: 90',
          },
          {
            problem: 'What if price touches upper band?',
            solution:
              'Some analysts interpret this as an overbought signal, but it does not guarantee a price decline or profit.',
          },
        ],
        history: {
          discoveredBy: 'John Bollinger',
          year: '1980s',
          background: 'Developed by Bollinger as a technical analysis tool.',
        },
        applications: [
          { field: 'Trading', description: 'Overbought/oversold detection' },
          { field: 'Volatility', description: 'Measure via band width' },
          { field: 'Trend', description: 'Direction from band slope' },
        ],
      },
    },
    relations: {
      prerequisites: ['moving-average', 'standard-deviation'],
      nextTopics: ['keltner-channel'],
      related: ['rsi', 'macd'],
    },
    tags: ['볼린저', '밴드', 'Bollinger', 'technical analysis'],
  },
  {
    id: 'black-scholes',
    name: {
      ko: '블랙-숄즈 모형',
      en: 'Black-Scholes Model',
    },
    field: 'applied-finance',
    subfield: 'derivatives',
    difficulty: 5,
    content: {
      ko: {
        definition:
          '블랙-숄즈 모형은 일정한 이자율과 변동성 등 가정 아래 유럽형 옵션의 이론적 가격을 계산합니다. 아래 콜옵션 식은 배당이 없는 주식에 적용하며 S₀, K, T, σ는 양수입니다. T는 연 단위, r은 연속 복리 연 이자율, N은 표준정규분포의 누적분포함수입니다.',
        formulas: [
          {
            latex: 'C = S_0 N(d_1) - Ke^{-rT}N(d_2)',
            description: '콜옵션 가격',
          },
          {
            latex: 'd_1 = \\frac{\\ln(S_0/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}}',
            description: 'd₁ 계산',
          },
          {
            latex: 'd_2 = d_1 - \\sigma\\sqrt{T}',
            description: 'd₂ 계산',
          },
          {
            latex:
              '\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0',
            description: '블랙-숄즈 편미분방정식',
          },
        ],
        examples: [
          {
            problem: 'S=100달러, K=100달러, r=연 5%, σ=연 20%, T=1년일 때 콜옵션의 모형 가격은?',
            solution: 'd₁ ≈ 0.35, d₂ ≈ 0.15, C ≈ $10.45',
          },
        ],
        history: {
          discoveredBy: '피셔 블랙, 마이런 숄즈',
          year: '1973년',
          background: '숄즈와 머튼이 1997년 노벨 경제학상을 수상했습니다.',
        },
        applications: [
          { field: '파생상품', description: '옵션 가격 책정' },
          { field: '리스크 관리', description: '그릭스 계산' },
          { field: '변동성 분석', description: '내재변동성 추정' },
        ],
      },
      en: {
        definition:
          'The Black-Scholes model prices European options under assumptions including constant interest rate and volatility. The call formula below assumes a non-dividend-paying stock and positive S₀, K, T and σ. T is in years, r is the continuously compounded annual rate, and N is the standard normal cumulative distribution function.',
        formulas: [
          {
            latex: 'C = S_0 N(d_1) - Ke^{-rT}N(d_2)',
            description: 'Call option price',
          },
          {
            latex: 'd_1 = \\frac{\\ln(S_0/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}}',
            description: 'd₁ calculation',
          },
          {
            latex: 'd_2 = d_1 - \\sigma\\sqrt{T}',
            description: 'd₂ calculation',
          },
          {
            latex:
              '\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0',
            description: 'Black-Scholes PDE',
          },
        ],
        examples: [
          {
            problem:
              'S=$100, K=$100, r=5% per year, σ=20% per year, T=1 year. What is the model call price?',
            solution: 'd₁ ≈ 0.35, d₂ ≈ 0.15, C ≈ $10.45',
          },
        ],
        history: {
          discoveredBy: 'Fischer Black, Myron Scholes',
          year: '1973',
          background: 'Scholes and Merton won 1997 Nobel Prize in Economics.',
        },
        applications: [
          { field: 'Derivatives', description: 'Option pricing' },
          { field: 'Risk Management', description: 'Greeks calculation' },
          { field: 'Volatility', description: 'Implied volatility estimation' },
        ],
      },
    },
    relations: {
      prerequisites: [
        'normal-distribution',
        'partial-differential-equation',
        'stochastic-calculus',
      ],
      nextTopics: ['greeks', 'monte-carlo-simulation'],
      related: ['brownian-motion', 'ito-calculus'],
    },
    tags: ['블랙숄즈', '옵션', 'Black-Scholes', 'derivatives'],
  },
  {
    id: 'fibonacci-retracement',
    name: {
      ko: '피보나치 되돌림',
      en: 'Fibonacci Retracement',
    },
    field: 'applied-finance',
    subfield: 'technical-analysis',
    difficulty: 2,
    content: {
      ko: {
        definition:
          '피보나치 되돌림은 가격 변동 구간에 피보나치 수열과 관련된 비율로 참고선을 표시하는 기술적 분석 도구입니다. 미래 가격의 예측 효과는 보장되지 않습니다.',
        formulas: [
          {
            latex: '\\text{되돌림 수준} = 23.6\\%, 38.2\\%, 50\\%, 61.8\\%, 78.6\\%',
            description: '주요 되돌림 수준 (50%는 피보나치 비율이 아닙니다)',
          },
          {
            latex: '\\phi = \\frac{1+\\sqrt{5}}{2} \\approx 1.618',
            description: '황금비',
          },
          {
            latex: '\\frac{F_n}{F_{n+1}} \\to \\frac{1}{\\phi} \\approx 0.618',
            description: '피보나치 비율의 유래',
          },
        ],
        examples: [
          {
            problem: '주가가 100에서 150으로 상승 후 38.2% 되돌림 수준은?',
            solution: '150 - (50 × 0.382) = 150 - 19.1 = 130.9',
          },
          {
            problem: '61.8% 되돌림이 중요한 이유는?',
            solution:
              '피보나치 수열의 이웃한 항의 비가 가까워지는 황금비의 역수(1/φ)입니다. 이 수치의 시장 예측 효과는 보장되지 않습니다.',
          },
        ],
        applications: [
          { field: '주식/외환', description: '가격 변동의 참고선 표시' },
          { field: '진입점 결정', description: '매수/매도 검토 시 참고' },
          { field: '목표가 설정', description: '확장 수준 활용' },
        ],
      },
      en: {
        definition:
          'Fibonacci retracement is a technical analysis tool that marks reference levels using ratios related to the Fibonacci sequence. Its ability to predict future prices is not guaranteed.',
        formulas: [
          {
            latex: '\\text{Retracement levels} = 23.6\\%, 38.2\\%, 50\\%, 61.8\\%, 78.6\\%',
            description: 'Common retracement levels (50% is not a Fibonacci ratio)',
          },
          {
            latex: '\\phi = \\frac{1+\\sqrt{5}}{2} \\approx 1.618',
            description: 'Golden ratio',
          },
          {
            latex: '\\frac{F_n}{F_{n+1}} \\to \\frac{1}{\\phi} \\approx 0.618',
            description: 'Origin of Fibonacci ratios',
          },
        ],
        examples: [
          {
            problem: "Price rose from 100 to 150. What's 38.2% retracement?",
            solution: '150 - (50 × 0.382) = 150 - 19.1 = 130.9',
          },
          {
            problem: 'Why is 61.8% significant?',
            solution:
              'It is the inverse golden ratio (1/φ), approached by ratios of adjacent Fibonacci numbers. Its ability to predict markets is not guaranteed.',
          },
        ],
        applications: [
          { field: 'Stocks/Forex', description: 'Marking reference levels for price changes' },
          { field: 'Entry Points', description: 'A reference when considering buy/sell timing' },
          { field: 'Price Targets', description: 'Using extension levels' },
        ],
      },
    },
    relations: {
      prerequisites: ['fibonacci', 'golden-ratio'],
      nextTopics: ['fibonacci-extension', 'elliott-wave'],
      related: ['moving-average', 'support-resistance'],
    },
    tags: ['피보나치', '되돌림', 'Fibonacci', 'retracement'],
  },
  {
    id: 'ichimoku-cloud',
    name: {
      ko: '일목균형표',
      en: 'Ichimoku Cloud',
    },
    field: 'applied-finance',
    subfield: 'technical-analysis',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '일목균형표는 지지/저항, 추세, 모멘텀을 한눈에 보여주는 종합 지표입니다. 일본에서 개발되었습니다.',
        formulas: [
          {
            latex: '\\text{전환선} = \\frac{\\text{9일 고가} + \\text{9일 저가}}{2}',
            description: '전환선 (Tenkan-sen)',
          },
          {
            latex: '\\text{기준선} = \\frac{\\text{26일 고가} + \\text{26일 저가}}{2}',
            description: '기준선 (Kijun-sen)',
          },
          {
            latex: '\\text{선행스팬A} = \\frac{\\text{전환선} + \\text{기준선}}{2}',
            description: '선행스팬A (26일 선행)',
          },
          {
            latex: '\\text{선행스팬B} = \\frac{\\text{52일 고가} + \\text{52일 저가}}{2}',
            description: '선행스팬B (26일 선행)',
          },
          {
            latex: '\\text{후행스팬} = \\text{현재 종가 (26일 후행)}',
            description: '후행스팬 (Chikou Span)',
          },
        ],
        examples: [
          {
            problem: '가격이 구름 위에 있으면?',
            solution:
              '일부 분석가는 상승 추세나 지지 영역으로 해석하지만, 가격 방향이나 지지를 보장하지는 않습니다.',
          },
          {
            problem: '전환선이 기준선을 상향 돌파하면?',
            solution: '일부 분석가는 매수 신호로 해석하지만, 수익이나 상승을 보장하지는 않습니다.',
          },
        ],
        history: {
          discoveredBy: '호소다 고이치 (一目山人)',
          year: '1930년대 (발표 1969년)',
          background: '30년간 연구 끝에 개발한 일본의 대표적 기술적 분석 도구',
        },
        applications: [
          { field: '추세 분석', description: '구름 위/아래로 추세 판단' },
          { field: '지지/저항', description: '구름이 지지/저항 영역' },
          { field: '매매 신호', description: '선 교차로 진입/청산 시점' },
        ],
      },
      en: {
        definition:
          'Ichimoku Cloud is a comprehensive indicator showing support/resistance, trend, and momentum at a glance. Developed in Japan.',
        formulas: [
          {
            latex: '\\text{Tenkan-sen} = \\frac{\\text{9-day high} + \\text{9-day low}}{2}',
            description: 'Conversion Line',
          },
          {
            latex: '\\text{Kijun-sen} = \\frac{\\text{26-day high} + \\text{26-day low}}{2}',
            description: 'Base Line',
          },
          {
            latex: '\\text{Senkou A} = \\frac{\\text{Tenkan} + \\text{Kijun}}{2}',
            description: 'Leading Span A (26 periods ahead)',
          },
          {
            latex: '\\text{Senkou B} = \\frac{\\text{52-day high} + \\text{52-day low}}{2}',
            description: 'Leading Span B (26 periods ahead)',
          },
          {
            latex: '\\text{Chikou} = \\text{Current close (26 periods back)}',
            description: 'Lagging Span',
          },
        ],
        examples: [
          {
            problem: 'What if price is above the cloud?',
            solution:
              'Some analysts interpret this as an uptrend or support area, but neither is guaranteed.',
          },
          {
            problem: 'Tenkan crosses above Kijun?',
            solution:
              'Some analysts interpret this as a buy signal, but it does not guarantee a profit or price increase.',
          },
        ],
        history: {
          discoveredBy: 'Goichi Hosoda (Ichimoku Sanjin)',
          year: '1930s (published 1969)',
          background: 'Developed over 30 years of research, iconic Japanese technical tool',
        },
        applications: [
          { field: 'Trend Analysis', description: 'Above/below cloud for trend' },
          { field: 'Support/Resistance', description: 'Cloud as S/R zone' },
          { field: 'Trading Signals', description: 'Line crosses for entry/exit' },
        ],
      },
    },
    relations: {
      prerequisites: ['moving-average', 'support-resistance'],
      nextTopics: ['advanced-ichimoku'],
      related: ['bollinger-bands', 'macd'],
    },
    tags: ['일목균형표', '구름', 'Ichimoku', 'Japanese'],
  },
  {
    id: 'present-value',
    name: {
      ko: '현재가치',
      en: 'Present Value',
    },
    field: 'applied-finance',
    subfield: 'basic-finance',
    difficulty: 2,
    content: {
      ko: {
        definition:
          '현재가치(PV)는 미래 현금흐름의 현재 시점 가치입니다. 돈의 시간가치를 반영하여 할인합니다.',
        formulas: [
          {
            latex: 'PV = \\frac{FV}{(1+r)^n}',
            description: '현재가치 공식',
          },
          {
            latex: 'PV = \\sum_{t=1}^{n} \\frac{CF_t}{(1+r)^t}',
            description: '현금흐름의 현재가치 합',
          },
          {
            latex: 'NPV = \\sum_{t=0}^{n} \\frac{CF_t}{(1+r)^t}',
            description: '순현재가치 (NPV)',
          },
        ],
        examples: [
          {
            problem: '3년 후 100만원의 현재가치는? (할인율 5%)',
            solution: 'PV = 1,000,000 / (1.05)³ = 863,838원',
          },
          {
            problem: '매년 10만원을 3년간 받는다면? (할인율 5%)',
            solution: 'PV = 100,000/1.05 + 100,000/1.05² + 100,000/1.05³ = 272,325원',
          },
        ],
        applications: [
          { field: '투자 분석', description: '프로젝트 가치 평가' },
          { field: '채권 가격', description: '쿠폰 할인' },
          { field: '연금', description: '미래 지급액 현재가치' },
        ],
      },
      en: {
        definition:
          'Present Value (PV) is the current value of future cash flows. Discounts for time value of money.',
        formulas: [
          {
            latex: 'PV = \\frac{FV}{(1+r)^n}',
            description: 'Present value formula',
          },
          {
            latex: 'PV = \\sum_{t=1}^{n} \\frac{CF_t}{(1+r)^t}',
            description: 'PV of cash flow series',
          },
          {
            latex: 'NPV = \\sum_{t=0}^{n} \\frac{CF_t}{(1+r)^t}',
            description: 'Net Present Value (NPV)',
          },
        ],
        examples: [
          {
            problem: 'PV of $1M in 3 years at 5% discount?',
            solution: 'PV = 1,000,000 / (1.05)³ = $863,838',
          },
          {
            problem: 'PV of $100K/year for 3 years at 5%?',
            solution: 'PV = 100K/1.05 + 100K/1.05² + 100K/1.05³ = $272,325',
          },
        ],
        applications: [
          { field: 'Investment Analysis', description: 'Project valuation' },
          { field: 'Bond Pricing', description: 'Coupon discounting' },
          { field: 'Annuities', description: 'Future payment valuation' },
        ],
      },
    },
    relations: {
      prerequisites: ['compound-interest'],
      nextTopics: ['irr', 'bond-pricing'],
      related: ['future-value', 'discount-rate'],
    },
    tags: ['현재가치', '할인', 'present value', 'NPV'],
  },
  {
    id: 'sharpe-ratio',
    name: {
      ko: '샤프 비율',
      en: 'Sharpe Ratio',
    },
    field: 'applied-finance',
    subfield: 'portfolio',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '샤프 비율은 초과수익의 평균을 그 표준편차로 나눈 값입니다. 표준편차는 0보다 커야 합니다. 같은 기간과 기준으로 비교해야 하며, 투자 성과를 보장하지는 않습니다.',
        formulas: [
          {
            latex: 'SR = \\frac{\\mathbb{E}[R_p - R_f]}{\\sigma(R_p - R_f)}',
            description: '샤프 비율',
          },
          {
            latex: 'R_p = \\text{포트폴리오 수익률}',
            description: '같은 기간의 포트폴리오 수익률',
          },
          {
            latex: 'R_f = \\text{무위험 수익률}',
            description: '국채 등 무위험 자산',
          },
          {
            latex: '\\sigma(R_p-R_f) = \\text{초과수익률의 표준편차}',
            description: '변동성 (위험)',
          },
        ],
        examples: [
          {
            problem: '평균 수익률 12%, 무위험 수익률 2%, 초과수익률 표준편차 15%일 때 샤프 비율은?',
            solution: 'SR = (12% - 2%) / 15% = 0.67',
          },
          {
            problem: '샤프 비율이 1 이상이면?',
            solution:
              '1 이상이라는 수치만으로 좋은 투자라고 확정할 수 없습니다. 같은 기간과 기준의 다른 투자 및 위험을 함께 살펴야 합니다.',
          },
        ],
        history: {
          discoveredBy: '윌리엄 샤프',
          year: '1966년',
          background: 'CAPM 개발로 1990년 노벨 경제학상 수상',
        },
        applications: [
          { field: '펀드 평가', description: '펀드 성과 비교' },
          { field: '포트폴리오', description: '자산 배분 최적화' },
          { field: '리스크 관리', description: '위험조정 수익 평가' },
        ],
      },
      en: {
        definition:
          'The Sharpe ratio divides average excess return by its positive standard deviation. Comparisons require the same period and benchmark; the ratio does not guarantee future performance.',
        formulas: [
          {
            latex: 'SR = \\frac{\\mathbb{E}[R_p - R_f]}{\\sigma(R_p - R_f)}',
            description: 'Sharpe Ratio',
          },
          {
            latex: 'R_p = \\text{Portfolio return}',
            description: 'Portfolio return over the same period',
          },
          {
            latex: 'R_f = \\text{Risk-free rate}',
            description: 'Treasury bonds, etc.',
          },
          {
            latex: '\\sigma(R_p-R_f) = \\text{standard deviation of excess return}',
            description: 'Volatility (risk)',
          },
        ],
        examples: [
          {
            problem:
              'Average return 12%, risk-free rate 2%, excess-return standard deviation 15%. Sharpe ratio?',
            solution: 'SR = (12% - 2%) / 15% = 0.67',
          },
          {
            problem: 'Is Sharpe ratio > 1 good?',
            solution:
              'A ratio above 1 alone does not establish a good investment. Compare the same period and benchmark, and consider other risks.',
          },
        ],
        history: {
          discoveredBy: 'William Sharpe',
          year: '1966',
          background: 'Won 1990 Nobel Prize for CAPM development',
        },
        applications: [
          { field: 'Fund Evaluation', description: 'Comparing fund performance' },
          { field: 'Portfolio', description: 'Asset allocation optimization' },
          { field: 'Risk Management', description: 'Risk-adjusted return' },
        ],
      },
    },
    relations: {
      prerequisites: ['expected-value', 'standard-deviation'],
      nextTopics: ['sortino-ratio', 'capm'],
      related: ['treynor-ratio', 'information-ratio'],
    },
    tags: ['샤프', '위험조정수익', 'Sharpe', 'portfolio'],
  },
];
