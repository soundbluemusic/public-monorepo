import { MathConcept } from '../types';

export const operationsResearchConcepts: MathConcept[] = [
  {
    id: 'linear-programming',
    name: {
      ko: '선형 계획법',
      en: 'Linear Programming',
      ja: '線形計画法'
    },
    field: 'operations-research',
    subfield: 'optimization',
    difficulty: 3,
    content: {
      ko: {
        definition: '선형 목적함수를 선형 제약조건 하에서 최적화하는 방법',
        formulas: ['max c^T x', 's.t. Ax ≤ b', 'x ≥ 0', '단체법 (Simplex Method)'],
        examples: ['생산 계획', '운송 문제', '자원 배분'],
        applications: ['제조업', '물류', '금융']
      },
      en: {
        definition: 'Method for optimizing linear objective function subject to linear constraints',
        formulas: ['max c^T x', 's.t. Ax ≤ b', 'x ≥ 0', 'Simplex Method'],
        examples: ['Production planning', 'Transportation problem', 'Resource allocation'],
        applications: ['Manufacturing', 'Logistics', 'Finance']
      },
      ja: {
        definition: '線形制約条件の下で線形目的関数を最適化する方法',
        formulas: ['max c^T x', 's.t. Ax ≤ b', 'x ≥ 0', 'シンプレックス法'],
        examples: ['生産計画', '輸送問題', '資源配分'],
        applications: ['製造業', '物流', '金融']
      }
    },
    latex: '\\max c^T x \\quad \\text{s.t.} \\quad Ax \\leq b, \\; x \\geq 0',
    relations: {
      prerequisites: ['linear-algebra', 'optimization-basics'],
      nextTopics: ['integer-programming', 'duality'],
      related: ['simplex-method'],
      applications: ['optimization', 'resource-allocation']
    },
    tags: ['LP', '선형계획', 'simplex', 'optimization']
  },
  {
    id: 'integer-programming',
    name: {
      ko: '정수 계획법',
      en: 'Integer Programming',
      ja: '整数計画法'
    },
    field: 'operations-research',
    subfield: 'optimization',
    difficulty: 4,
    content: {
      ko: {
        definition: '변수가 정수 값만 가질 수 있는 최적화 문제',
        formulas: ['max c^T x, s.t. Ax ≤ b, x ∈ ℤⁿ', 'MIP: 일부 변수만 정수', '분기한정법 (Branch & Bound)'],
        examples: ['스케줄링', '시설 위치 선정', '차량 경로'],
        applications: ['항공', '통신', '공급망']
      },
      en: {
        definition: 'Optimization where variables can only take integer values',
        formulas: ['max c^T x, s.t. Ax ≤ b, x ∈ ℤⁿ', 'MIP: some variables integer', 'Branch & Bound'],
        examples: ['Scheduling', 'Facility location', 'Vehicle routing'],
        applications: ['Airlines', 'Telecommunications', 'Supply chain']
      },
      ja: {
        definition: '変数が整数値のみを取る最適化問題',
        formulas: ['max c^T x, s.t. Ax ≤ b, x ∈ ℤⁿ', 'MIP: 一部の変数が整数', '分枝限定法'],
        examples: ['スケジューリング', '施設配置', '配送経路'],
        applications: ['航空', '通信', 'サプライチェーン']
      }
    },
    latex: '\\max c^T x \\quad \\text{s.t.} \\quad Ax \\leq b, \\; x \\in \\mathbb{Z}^n',
    relations: {
      prerequisites: ['linear-programming'],
      nextTopics: ['cutting-planes', 'column-generation'],
      related: ['combinatorial-optimization'],
      applications: ['scheduling', 'logistics']
    },
    tags: ['IP', 'MIP', '정수계획', 'integer']
  },
  {
    id: 'network-flow',
    name: {
      ko: '네트워크 흐름',
      en: 'Network Flow',
      ja: 'ネットワークフロー'
    },
    field: 'operations-research',
    subfield: 'networks',
    difficulty: 3,
    content: {
      ko: {
        definition: '그래프에서 흐름을 최적화하는 문제. 최대 흐름, 최소 비용 흐름 등',
        formulas: ['최대흐름-최소컷 정리: max flow = min cut', '흐름 보존: Σf_in = Σf_out', '포드-풀커슨 알고리즘'],
        examples: ['교통 흐름', '데이터 전송', '배관 시스템'],
        applications: ['통신', '운송', '공급망']
      },
      en: {
        definition: 'Optimization of flow in graphs. Maximum flow, minimum cost flow, etc.',
        formulas: ['Max-flow Min-cut: max flow = min cut', 'Flow conservation: Σf_in = Σf_out', 'Ford-Fulkerson algorithm'],
        examples: ['Traffic flow', 'Data transmission', 'Pipeline systems'],
        applications: ['Telecommunications', 'Transportation', 'Supply chain']
      },
      ja: {
        definition: 'グラフにおけるフローの最適化。最大フロー、最小費用フローなど',
        formulas: ['最大フロー最小カット定理: max flow = min cut', 'フロー保存: Σf_in = Σf_out', 'フォード・ファルカーソン法'],
        examples: ['交通フロー', 'データ伝送', 'パイプラインシステム'],
        applications: ['通信', '輸送', 'サプライチェーン']
      }
    },
    latex: '\\max f \\quad \\text{s.t. flow conservation}',
    relations: {
      prerequisites: ['graph-theory', 'linear-programming'],
      nextTopics: ['minimum-cost-flow', 'matching'],
      related: ['shortest-path'],
      applications: ['logistics', 'telecommunications']
    },
    tags: ['네트워크', 'flow', '최대흐름', 'max-flow']
  },
  {
    id: 'queueing-theory',
    name: {
      ko: '대기행렬 이론',
      en: 'Queueing Theory',
      ja: '待ち行列理論'
    },
    field: 'operations-research',
    subfield: 'stochastic',
    difficulty: 4,
    content: {
      ko: {
        definition: '대기열 시스템의 수학적 분석. 도착, 서비스, 대기 시간 모델링',
        formulas: ['M/M/1: λ < μ일 때 안정', '이용률: ρ = λ/μ', '평균 대기시간: W = L/λ (리틀의 법칙)', 'M/M/c: c개 서버'],
        examples: ['은행 창구', '콜센터', '서버 큐'],
        applications: ['서비스 설계', '용량 계획', '시스템 분석']
      },
      en: {
        definition: 'Mathematical analysis of waiting line systems. Modeling arrivals, service, waiting times',
        formulas: ['M/M/1: stable if λ < μ', 'Utilization: ρ = λ/μ', 'Mean wait: W = L/λ (Little\'s law)', 'M/M/c: c servers'],
        examples: ['Bank tellers', 'Call centers', 'Server queues'],
        applications: ['Service design', 'Capacity planning', 'System analysis']
      },
      ja: {
        definition: '待ち行列システムの数学的分析。到着、サービス、待ち時間のモデル化',
        formulas: ['M/M/1: λ < μなら安定', '利用率: ρ = λ/μ', '平均待ち時間: W = L/λ (リトルの法則)', 'M/M/c: c台のサーバー'],
        examples: ['銀行窓口', 'コールセンター', 'サーバーキュー'],
        applications: ['サービス設計', '容量計画', 'システム分析']
      }
    },
    latex: 'W = \\frac{L}{\\lambda}',
    relations: {
      prerequisites: ['probability', 'stochastic-processes'],
      nextTopics: ['markov-chains', 'simulation'],
      related: ['poisson-process'],
      applications: ['service-engineering', 'capacity-planning']
    },
    tags: ['큐잉', 'queue', '대기열', "Little's law"]
  },
  {
    id: 'dynamic-programming-or',
    name: {
      ko: '동적 계획법 (OR)',
      en: 'Dynamic Programming (OR)',
      ja: '動的計画法 (OR)'
    },
    field: 'operations-research',
    subfield: 'optimization',
    difficulty: 4,
    content: {
      ko: {
        definition: '복잡한 문제를 하위 문제로 분해하여 순차적으로 최적화',
        formulas: ['벨만 방정식: V(s) = max_a {r(s,a) + γV(s\')}', '최적 부분구조', '중복 부분문제'],
        examples: ['배낭 문제', '최단 경로', '재고 관리'],
        applications: ['자원 배분', '투자', '로봇공학']
      },
      en: {
        definition: 'Decomposing complex problems into subproblems for sequential optimization',
        formulas: ['Bellman equation: V(s) = max_a {r(s,a) + γV(s\')}', 'Optimal substructure', 'Overlapping subproblems'],
        examples: ['Knapsack problem', 'Shortest path', 'Inventory management'],
        applications: ['Resource allocation', 'Investment', 'Robotics']
      },
      ja: {
        definition: '複雑な問題を部分問題に分解して逐次的に最適化',
        formulas: ['ベルマン方程式: V(s) = max_a {r(s,a) + γV(s\')}', '最適部分構造', '重複部分問題'],
        examples: ['ナップサック問題', '最短経路', '在庫管理'],
        applications: ['資源配分', '投資', 'ロボット工学']
      }
    },
    latex: 'V(s) = \\max_a \\{r(s,a) + \\gamma V(s\')\\}',
    relations: {
      prerequisites: ['optimization-basics', 'recursion'],
      nextTopics: ['reinforcement-learning', 'markov-decision-process'],
      related: ['bellman-equation'],
      applications: ['control', 'ai']
    },
    tags: ['DP', '동적계획', 'Bellman', 'optimization']
  },
  {
    id: 'inventory-theory',
    name: {
      ko: '재고 이론',
      en: 'Inventory Theory',
      ja: '在庫理論'
    },
    field: 'operations-research',
    subfield: 'supply-chain',
    difficulty: 3,
    content: {
      ko: {
        definition: '재고 보유 비용과 주문 비용을 최소화하는 최적 재고 정책 결정',
        formulas: ['EOQ: Q* = √(2DK/h)', '재주문점: ROP = d × L', 'ABC 분석', '(s,S) 정책'],
        examples: ['제조업 원자재', '소매 재고', '창고 관리'],
        applications: ['공급망', '제조', '소매']
      },
      en: {
        definition: 'Determining optimal inventory policies minimizing holding and ordering costs',
        formulas: ['EOQ: Q* = √(2DK/h)', 'Reorder point: ROP = d × L', 'ABC analysis', '(s,S) policy'],
        examples: ['Manufacturing raw materials', 'Retail inventory', 'Warehouse management'],
        applications: ['Supply chain', 'Manufacturing', 'Retail']
      },
      ja: {
        definition: '在庫保有コストと注文コストを最小化する最適な在庫政策の決定',
        formulas: ['EOQ: Q* = √(2DK/h)', '再注文点: ROP = d × L', 'ABC分析', '(s,S)政策'],
        examples: ['製造業の原材料', '小売在庫', '倉庫管理'],
        applications: ['サプライチェーン', '製造', '小売']
      }
    },
    latex: 'Q^* = \\sqrt{\\frac{2DK}{h}}',
    relations: {
      prerequisites: ['optimization-basics', 'probability'],
      nextTopics: ['supply-chain-optimization'],
      related: ['queueing-theory'],
      applications: ['logistics', 'manufacturing']
    },
    tags: ['재고', 'inventory', 'EOQ', 'supply-chain']
  },
  {
    id: 'scheduling-theory',
    name: {
      ko: '스케줄링 이론',
      en: 'Scheduling Theory',
      ja: 'スケジューリング理論'
    },
    field: 'operations-research',
    subfield: 'scheduling',
    difficulty: 4,
    content: {
      ko: {
        definition: '작업들을 자원에 시간적으로 배정하여 목적함수 최적화',
        formulas: ['단일기계: 1||Σwⱼcⱼ', '병렬기계: P||Cmax', '흐름작업: F||Cmax', '작업장: J||Cmax'],
        examples: ['공장 스케줄링', '프로젝트 관리', 'CPU 스케줄링'],
        applications: ['제조', '컴퓨터 시스템', '항공']
      },
      en: {
        definition: 'Temporal assignment of jobs to resources to optimize objective function',
        formulas: ['Single machine: 1||Σwⱼcⱼ', 'Parallel: P||Cmax', 'Flow shop: F||Cmax', 'Job shop: J||Cmax'],
        examples: ['Factory scheduling', 'Project management', 'CPU scheduling'],
        applications: ['Manufacturing', 'Computer systems', 'Airlines']
      },
      ja: {
        definition: '作業を資源に時間的に割り当て目的関数を最適化',
        formulas: ['単一機械: 1||Σwⱼcⱼ', '並列機械: P||Cmax', 'フローショップ: F||Cmax', 'ジョブショップ: J||Cmax'],
        examples: ['工場スケジューリング', 'プロジェクト管理', 'CPUスケジューリング'],
        applications: ['製造', 'コンピュータシステム', '航空']
      }
    },
    latex: '\\min C_{max} = \\max_j C_j',
    relations: {
      prerequisites: ['graph-theory', 'combinatorial-optimization'],
      nextTopics: ['constraint-programming'],
      related: ['integer-programming'],
      applications: ['manufacturing', 'computing']
    },
    tags: ['스케줄링', 'scheduling', 'makespan', 'jobs']
  },
  {
    id: 'markov-decision-process',
    name: {
      ko: '마르코프 결정 과정',
      en: 'Markov Decision Process',
      ja: 'マルコフ決定過程'
    },
    field: 'operations-research',
    subfield: 'stochastic',
    difficulty: 5,
    content: {
      ko: {
        definition: '순차적 의사결정을 위한 확률적 모델. 상태, 행동, 보상, 전이확률',
        formulas: ['(S, A, P, R, γ)', '벨만 최적 방정식: V*(s) = max_a Σ P(s\'|s,a)[R + γV*(s\')]', '정책: π(s) → a'],
        examples: ['로봇 네비게이션', '게임 AI', '추천 시스템'],
        applications: ['강화학습', '로봇공학', '금융']
      },
      en: {
        definition: 'Stochastic model for sequential decision making. States, actions, rewards, transitions',
        formulas: ['(S, A, P, R, γ)', 'Bellman optimality: V*(s) = max_a Σ P(s\'|s,a)[R + γV*(s\')]', 'Policy: π(s) → a'],
        examples: ['Robot navigation', 'Game AI', 'Recommendation systems'],
        applications: ['Reinforcement learning', 'Robotics', 'Finance']
      },
      ja: {
        definition: '逐次的意思決定のための確率モデル。状態、行動、報酬、遷移確率',
        formulas: ['(S, A, P, R, γ)', 'ベルマン最適方程式: V*(s) = max_a Σ P(s\'|s,a)[R + γV*(s\')]', '政策: π(s) → a'],
        examples: ['ロボットナビゲーション', 'ゲームAI', 'レコメンドシステム'],
        applications: ['強化学習', 'ロボット工学', '金融']
      }
    },
    latex: 'V^*(s) = \\max_a \\sum_{s\'} P(s\'|s,a)[R(s,a,s\') + \\gamma V^*(s\')]',
    relations: {
      prerequisites: ['markov-chains', 'dynamic-programming-or'],
      nextTopics: ['reinforcement-learning', 'pomdp'],
      related: ['bellman-equation'],
      applications: ['ai', 'robotics', 'control']
    },
    tags: ['MDP', '마르코프', 'decision', 'reinforcement']
  }
];
