import type { MathConcept } from '../types';

export const informationTheoryConcepts: MathConcept[] = [
  {
    id: 'shannon-entropy',
    name: {
      ko: '섀넌 엔트로피',
      en: 'Shannon Entropy',
    },
    field: 'information-theory',
    subfield: 'foundations',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '유한한 값을 갖는 이산 확률변수의 불확실성을 나타내는 정보량. 밑이 2인 로그를 쓰면 단위는 비트입니다.',
        formulas: [
          'H(X) = -Σ p(x) log₂ p(x) (0 log₂ 0 = 0)',
          'H(X) ≥ 0',
          '최대: H = log₂ n (균등분포)',
          '결합 엔트로피: H(X,Y)',
        ],
        examples: ['공정한 동전: H = 1 bit', '편향 동전: H < 1 bit'],
        applications: ['데이터 압축', '암호학', '기계학습'],
      },
      en: {
        definition:
          'A measure of uncertainty of a finite discrete random variable. With base-2 logarithms it is measured in bits.',
        formulas: [
          'H(X) = -Σ p(x) log₂ p(x) (0 log₂ 0 = 0)',
          'H(X) ≥ 0',
          'Maximum: H = log₂ n (uniform)',
          'Joint entropy: H(X,Y)',
        ],
        examples: ['Fair coin: H = 1 bit', 'Biased coin: H < 1 bit'],
        applications: ['Data compression', 'Cryptography', 'Machine learning'],
      },
    },
    latex: 'H(X) = -\\sum_{x} p(x) \\log_2 p(x)',
    relations: {
      prerequisites: ['probability', 'logarithm'],
      nextTopics: ['mutual-information', 'channel-capacity'],
      related: ['thermodynamic-entropy'],
      applications: ['compression', 'machine-learning'],
    },
    tags: ['섀넌', 'Shannon', '엔트로피', 'entropy'],
  },
  {
    id: 'mutual-information',
    name: {
      ko: '상호 정보량',
      en: 'Mutual Information',
    },
    field: 'information-theory',
    subfield: 'foundations',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '두 확률변수가 공유하는 정보량. 아래 식은 유한한 값을 갖는 이산 확률변수에 대해 비트 단위로 표시합니다.',
        formulas: [
          'I(X;Y) = H(X) + H(Y) - H(X,Y)',
          'I(X;Y) = H(X) - H(X|Y)',
          'I(X;Y) = Σ p(x,y) log₂(p(x,y)/(p(x)p(y))) (p(x,y) > 0)',
        ],
        examples: ['독립이면 I(X;Y) = 0', 'X가 Y로 결정되면 H(X|Y) = 0이므로 I(X;Y) = H(X)'],
        applications: ['특징 선택', '채널 용량', '인과 추론'],
      },
      en: {
        definition:
          'Information shared between two random variables. The formulas below use bits for finite discrete variables.',
        formulas: [
          'I(X;Y) = H(X) + H(Y) - H(X,Y)',
          'I(X;Y) = H(X) - H(X|Y)',
          'I(X;Y) = Σ p(x,y) log₂(p(x,y)/(p(x)p(y))) (p(x,y) > 0)',
        ],
        examples: [
          'Independent: I(X;Y) = 0',
          'If X is determined by Y, H(X|Y) = 0 and I(X;Y) = H(X)',
        ],
        applications: ['Feature selection', 'Channel capacity', 'Causal inference'],
      },
    },
    latex: 'I(X;Y) = H(X) + H(Y) - H(X,Y)',
    relations: {
      prerequisites: ['shannon-entropy'],
      nextTopics: ['channel-capacity'],
      related: ['correlation'],
      applications: ['feature-selection', 'causality'],
    },
    tags: ['상호정보', 'mutual', 'information', 'dependence'],
  },
  {
    id: 'channel-capacity',
    name: {
      ko: '채널 용량',
      en: 'Channel Capacity',
    },
    field: 'information-theory',
    subfield: 'communication',
    difficulty: 4,
    content: {
      ko: {
        definition: '잡음 채널을 통해 신뢰성 있게 전송 가능한 최대 정보량',
        formulas: [
          '유한 이산 무기억 채널: C = max_{p(x)} I(X;Y)',
          '섀넌 정리: 유한 이산 무기억 채널에서 R < C이면 긴 부호를 사용해 오류 확률을 임의로 작게 할 수 있음',
          '이진 대칭 채널: C = 1 - H₂(p) (사용당 비트)',
          '실수 가우스 잡음 채널, 평균 전력 제한: C = ½log₂(1 + S/N) (사용당 비트)',
        ],
        examples: ['이진 대칭 채널', '소거 채널', '가우시안 채널'],
        applications: ['통신 시스템', '데이터 저장', '네트워크'],
      },
      en: {
        definition: 'Maximum information rate reliably transmittable through noisy channel',
        formulas: [
          'Finite discrete memoryless channel: C = max_{p(x)} I(X;Y)',
          'Shannon theorem: for a finite discrete memoryless channel and R < C, sufficiently long codes make error probability arbitrarily small',
          'BSC: C = 1 - H₂(p) (bits per use)',
          'Real AWGN, average power constraint: C = ½log₂(1 + S/N) (bits per use)',
        ],
        examples: ['Binary symmetric channel', 'Erasure channel', 'Gaussian channel'],
        applications: ['Communication systems', 'Data storage', 'Networks'],
      },
    },
    latex: 'C = \\max_{p(x)} I(X;Y)',
    relations: {
      prerequisites: ['mutual-information', 'probability'],
      nextTopics: ['error-correcting-codes'],
      related: ['shannon-entropy'],
      applications: ['telecommunications', 'networking'],
    },
    tags: ['채널용량', 'channel', 'capacity', 'Shannon'],
  },
  {
    id: 'kl-divergence',
    name: {
      ko: 'KL 발산',
      en: 'KL Divergence',
    },
    field: 'information-theory',
    subfield: 'divergences',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '두 확률분포 사이의 차이를 측정하는 비대칭적 척도. 아래 합은 유한 이산 분포에 대한 식입니다.',
        formulas: [
          'D_KL(P||Q) = Σ P(x) log(P(x)/Q(x)) (P(x) > 0; Q(x)=0이면 +∞)',
          'D_KL ≥ 0, = 0 iff P = Q',
          '일반적으로 비대칭: D_KL(P||Q)와 D_KL(Q||P)는 다를 수 있음',
        ],
        examples: ['가우시안 간 KL', 'VAE 손실 함수'],
        applications: ['기계학습', '통계적 추론', '변분 추론'],
      },
      en: {
        definition:
          'An asymmetric measure of difference between probability distributions. The sum below is for finite discrete distributions.',
        formulas: [
          'D_KL(P||Q) = Σ P(x) log(P(x)/Q(x)) (P(x) > 0; +∞ if Q(x)=0)',
          'D_KL ≥ 0, = 0 iff P = Q',
          'Generally asymmetric: D_KL(P||Q) and D_KL(Q||P) can differ',
        ],
        examples: ['KL between Gaussians', 'VAE loss function'],
        applications: ['Machine learning', 'Statistical inference', 'Variational inference'],
      },
    },
    latex: 'D_{KL}(P||Q) = \\sum_x P(x) \\log \\frac{P(x)}{Q(x)}',
    relations: {
      prerequisites: ['probability', 'shannon-entropy'],
      nextTopics: ['cross-entropy', 'js-divergence'],
      related: ['mutual-information'],
      applications: ['machine-learning', 'statistics'],
    },
    tags: ['KL', '발산', 'divergence', 'Kullback-Leibler'],
  },
  {
    id: 'source-coding-theorem',
    name: {
      ko: '소스 부호화 정리',
      en: 'Source Coding Theorem',
    },
    field: 'information-theory',
    subfield: 'coding',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '유한한 이산 정보원의 단일 기호에 대한 최적 이진 접두 부호의 평균 길이는 엔트로피 이상이고 엔트로피보다 1비트 미만 더 깁니다.',
        formulas: [
          '최적 이진 접두 부호: H(X) ≤ L̄ < H(X) + 1',
          '크래프트 부등식: Σ 2^{-lᵢ} ≤ 1',
          '섀넌 부호의 길이: lᵢ = ⌈-log₂ p(xᵢ)⌉ (p(xᵢ) > 0)',
        ],
        examples: ['허프만 코드', '산술 코드', 'Lempel-Ziv'],
        applications: ['ZIP 압축', '이미지/비디오 압축', '통신'],
      },
      en: {
        definition:
          'For a finite discrete source, the optimal binary prefix code for individual symbols has an average length at least the entropy and less than one bit above it.',
        formulas: [
          'Optimal binary prefix code: H(X) ≤ L̄ < H(X) + 1',
          'Kraft inequality: Σ 2^{-lᵢ} ≤ 1',
          'Shannon code lengths: lᵢ = ⌈-log₂ p(xᵢ)⌉ (p(xᵢ) > 0)',
        ],
        examples: ['Huffman code', 'Arithmetic coding', 'Lempel-Ziv'],
        applications: ['ZIP compression', 'Image/video compression', 'Communication'],
      },
    },
    latex:
      'H(X) \\leq \\bar{L}_{\\mathrm{opt}} < H(X) + 1 \\quad (\\text{finite source, binary prefix code})',
    relations: {
      prerequisites: ['shannon-entropy', 'coding-theory'],
      nextTopics: ['huffman-coding', 'arithmetic-coding'],
      related: ['data-compression'],
      applications: ['compression'],
    },
    tags: ['소스부호화', 'source', 'coding', 'compression'],
  },
  {
    id: 'error-correcting-codes',
    name: {
      ko: '오류 정정 부호',
      en: 'Error-Correcting Codes',
    },
    field: 'information-theory',
    subfield: 'coding',
    difficulty: 4,
    content: {
      ko: {
        definition: '전송 중 발생한 오류를 감지하고 정정할 수 있는 부호화 방식',
        formulas: [
          '해밍 거리: d(x,y)',
          '최소 거리: d_min',
          't-오류 정정: d_min ≥ 2t+1',
          '싱글턴 한계: k ≤ n - d + 1',
        ],
        examples: ['해밍 코드', 'Reed-Solomon', 'LDPC', 'Turbo 코드'],
        applications: ['CD/DVD', 'QR 코드', '위성 통신', '저장장치'],
      },
      en: {
        definition: 'Coding schemes that can detect and correct errors during transmission',
        formulas: [
          'Hamming distance: d(x,y)',
          'Minimum distance: d_min',
          't-error correction: d_min ≥ 2t+1',
          'Singleton bound: k ≤ n - d + 1',
        ],
        examples: ['Hamming code', 'Reed-Solomon', 'LDPC', 'Turbo codes'],
        applications: ['CD/DVD', 'QR codes', 'Satellite communication', 'Storage'],
      },
    },
    latex: 'd_{min} \\geq 2t + 1',
    relations: {
      prerequisites: ['linear-algebra', 'channel-capacity'],
      nextTopics: ['ldpc-codes', 'turbo-codes'],
      related: ['coding-theory'],
      applications: ['storage', 'communications'],
    },
    tags: ['오류정정', 'error-correcting', 'Hamming', 'coding'],
  },
  {
    id: 'rate-distortion',
    name: {
      ko: '율-왜곡 이론',
      en: 'Rate-Distortion Theory',
    },
    field: 'information-theory',
    subfield: 'coding',
    difficulty: 5,
    content: {
      ko: {
        definition: '허용 가능한 왜곡 수준에서 필요한 최소 전송률',
        formulas: [
          'R(D) = inf_{p(x̂|x):E[d(X,X̂)]≤D} I(X;X̂)',
          'D: 허용 평균 왜곡, d: 왜곡 함수',
          '유한 이산 소스와 해밍 왜곡에서 R(0) = H(X)',
        ],
        examples: ['가우시안 소스', '이미지 압축', '비디오 코딩'],
        applications: ['손실 압축', '스트리밍', '이미지/비디오 코덱'],
      },
      en: {
        definition: 'Minimum rate required for given acceptable distortion level',
        formulas: [
          'R(D) = inf_{p(x̂|x):E[d(X,X̂)]≤D} I(X;X̂)',
          'D: allowed average distortion; d: distortion function',
          'R(0) = H(X) for a finite discrete source with Hamming distortion',
        ],
        examples: ['Gaussian source', 'Image compression', 'Video coding'],
        applications: ['Lossy compression', 'Streaming', 'Image/video codecs'],
      },
    },
    latex: 'R(D) = \\inf_{p(\\hat{x}|x):\\,\\mathbb{E}[d(X,\\hat{X})] \\le D} I(X;\\hat{X})',
    relations: {
      prerequisites: ['mutual-information', 'source-coding-theorem'],
      nextTopics: ['quantization'],
      related: ['lossy-compression'],
      applications: ['video-compression', 'audio-compression'],
    },
    tags: ['율왜곡', 'rate-distortion', '손실압축', 'lossy'],
  },
  {
    id: 'differential-entropy',
    name: {
      ko: '미분 엔트로피',
      en: 'Differential Entropy',
    },
    field: 'information-theory',
    subfield: 'continuous',
    difficulty: 4,
    content: {
      ko: {
        definition: '연속 확률변수의 엔트로피. 이산 엔트로피의 연속 확장',
        formulas: [
          'h(X) = -∫f(x) log f(x) dx',
          '정규분포: h(X) = ½log(2πeσ²)',
          '균등분포: h(X) = log(b-a)',
        ],
        examples: ['가우시안은 주어진 분산에서 최대 엔트로피', '지수분포'],
        applications: ['연속 채널', '아날로그 신호', '통계'],
      },
      en: {
        definition:
          'Entropy for continuous random variables. Continuous extension of discrete entropy',
        formulas: [
          'h(X) = -∫f(x) log f(x) dx',
          'Normal: h(X) = ½log(2πeσ²)',
          'Uniform: h(X) = log(b-a)',
        ],
        examples: ['Gaussian maximizes entropy for given variance', 'Exponential distribution'],
        applications: ['Continuous channels', 'Analog signals', 'Statistics'],
      },
    },
    latex: 'h(X) = -\\int f(x) \\log f(x) \\, dx',
    relations: {
      prerequisites: ['shannon-entropy', 'continuous-probability'],
      nextTopics: ['gaussian-channel'],
      related: ['entropy'],
      applications: ['continuous-communication'],
    },
    tags: ['미분', 'differential', 'continuous', 'entropy'],
  },
];
