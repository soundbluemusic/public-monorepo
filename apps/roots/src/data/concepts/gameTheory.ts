import type { MathConcept } from '../types';

export const gameTheoryConcepts: MathConcept[] = [
  {
    id: 'nash-equilibrium',
    name: {
      ko: '내쉬 균형',
      en: 'Nash Equilibrium',
    },
    field: 'game-theory',
    subfield: 'strategic-games',
    difficulty: 4,
    content: {
      ko: {
        definition: '모든 참여자가 자신의 전략을 바꿀 유인이 없는 전략 조합',
        formulas: [
          '∀i: u_i(s*_i, s*_{-i}) ≥ u_i(s_i, s*_{-i})',
          '최적 반응: BR_i(s_{-i}) = argmax u_i(s_i, s_{-i})',
        ],
        examples: ['죄수의 딜레마: (배신, 배신)', '사슴 사냥 게임'],
        applications: ['경제학', '정치학', '진화생물학'],
      },
      en: {
        definition: 'Strategy profile where no player has incentive to change their strategy',
        formulas: [
          '∀i: u_i(s*_i, s*_{-i}) ≥ u_i(s_i, s*_{-i})',
          'Best response: BR_i(s_{-i}) = argmax u_i(s_i, s_{-i})',
        ],
        examples: ["Prisoner's Dilemma: (Defect, Defect)", 'Stag Hunt Game'],
        applications: ['Economics', 'Political Science', 'Evolutionary Biology'],
      },
    },
    latex: 'u_i(s^*_i, s^*_{-i}) \\geq u_i(s_i, s^*_{-i})',
    relations: {
      prerequisites: ['game-theory-basics'],
      nextTopics: ['mixed-strategy', 'subgame-perfect'],
      related: ['pareto-efficiency'],
      applications: ['economics', 'strategy'],
    },
    tags: ['내쉬', 'Nash', '균형', 'equilibrium'],
  },
  {
    id: 'prisoners-dilemma',
    name: {
      ko: '죄수의 딜레마',
      en: "Prisoner's Dilemma",
    },
    field: 'game-theory',
    subfield: 'strategic-games',
    difficulty: 2,
    content: {
      ko: {
        definition: '개인의 합리적 선택이 집단 전체의 이익에 반하는 결과를 낳는 게임',
        formulas: [
          '보수 행렬: T > R > P > S',
          '배신 유혹(T) > 협력 보상(R) > 상호 배신(P) > 호구(S)',
        ],
        examples: ['군비 경쟁', '환경 오염', '가격 담합'],
        applications: ['국제관계', '기업 전략', '사회적 딜레마'],
      },
      en: {
        definition:
          'Game where individual rational choices lead to collectively suboptimal outcomes',
        formulas: [
          'Payoff matrix: T > R > P > S',
          'Temptation(T) > Reward(R) > Punishment(P) > Sucker(S)',
        ],
        examples: ['Arms race', 'Pollution', 'Price fixing'],
        applications: ['International relations', 'Business strategy', 'Social dilemmas'],
      },
    },
    latex: '\\begin{pmatrix} R,R & S,T \\\\ T,S & P,P \\end{pmatrix}',
    relations: {
      prerequisites: [],
      nextTopics: ['nash-equilibrium', 'repeated-games'],
      related: ['chicken-game', 'stag-hunt'],
      applications: ['social-science', 'economics'],
    },
    tags: ['죄수', 'prisoner', '딜레마', 'dilemma'],
  },
  {
    id: 'minimax-theorem',
    name: {
      ko: '미니맥스 정리',
      en: 'Minimax Theorem',
    },
    field: 'game-theory',
    subfield: 'zero-sum',
    difficulty: 4,
    content: {
      ko: {
        definition: '영합 게임에서 최선의 전략은 최대 손실을 최소화하는 것',
        formulas: [
          'max_x min_y u(x,y) = min_y max_x u(x,y)',
          '안장점: u(x*, y) ≤ u(x*, y*) ≤ u(x, y*)',
        ],
        examples: ['가위바위보', '체스', '틱택토'],
        applications: ['인공지능', '의사결정', '최적화'],
      },
      en: {
        definition: 'In zero-sum games, optimal strategy minimizes maximum loss',
        formulas: [
          'max_x min_y u(x,y) = min_y max_x u(x,y)',
          'Saddle point: u(x*, y) ≤ u(x*, y*) ≤ u(x, y*)',
        ],
        examples: ['Rock-Paper-Scissors', 'Chess', 'Tic-Tac-Toe'],
        applications: ['AI', 'Decision making', 'Optimization'],
      },
    },
    latex: '\\max_x \\min_y u(x,y) = \\min_y \\max_x u(x,y)',
    relations: {
      prerequisites: ['matrix-operations'],
      nextTopics: ['alpha-beta-pruning'],
      related: ['nash-equilibrium'],
      applications: ['game-ai', 'decision-theory'],
    },
    tags: ['미니맥스', 'minimax', '영합', 'zero-sum'],
  },
  {
    id: 'pareto-efficiency',
    name: {
      ko: '파레토 효율성',
      en: 'Pareto Efficiency',
    },
    field: 'game-theory',
    subfield: 'welfare',
    difficulty: 3,
    content: {
      ko: {
        definition: '다른 누군가의 상황을 악화시키지 않고는 누구의 상황도 개선할 수 없는 상태',
        formulas: ['파레토 개선: ∃ 배분 y: u_i(y) ≥ u_i(x) ∀i, 일부 j에서 >'],
        examples: ['자원 배분', '무역 이익', '계약 협상'],
        applications: ['경제학', '공공정책', '협상이론'],
      },
      en: {
        definition: 'State where no one can be made better off without making someone worse off',
        formulas: ['Pareto improvement: ∃ allocation y: u_i(y) ≥ u_i(x) ∀i, strict for some j'],
        examples: ['Resource allocation', 'Gains from trade', 'Contract negotiation'],
        applications: ['Economics', 'Public policy', 'Negotiation theory'],
      },
    },
    latex: '\\nexists y: u_i(y) \\geq u_i(x) \\; \\forall i, \\; u_j(y) > u_j(x) \\; \\exists j',
    relations: {
      prerequisites: ['utility-function'],
      nextTopics: ['welfare-theorems'],
      related: ['nash-equilibrium'],
      applications: ['welfare-economics'],
    },
    tags: ['파레토', 'Pareto', '효율', 'efficiency'],
  },
  {
    id: 'mixed-strategy',
    name: {
      ko: '혼합 전략',
      en: 'Mixed Strategy',
    },
    field: 'game-theory',
    subfield: 'strategic-games',
    difficulty: 3,
    content: {
      ko: {
        definition: '순수 전략들에 확률을 부여하여 무작위로 선택하는 전략',
        formulas: ['σ_i: S_i → [0,1], Σσ_i(s) = 1', '기대 보수: E[u_i] = Σ σ(s)·u_i(s)'],
        examples: ['가위바위보: (1/3, 1/3, 1/3)', '페널티킥 방향'],
        applications: ['스포츠 전략', '경매', '보안'],
      },
      en: {
        definition: 'Strategy assigning probabilities to pure strategies for random selection',
        formulas: ['σ_i: S_i → [0,1], Σσ_i(s) = 1', 'Expected payoff: E[u_i] = Σ σ(s)·u_i(s)'],
        examples: ['Rock-Paper-Scissors: (1/3, 1/3, 1/3)', 'Penalty kick direction'],
        applications: ['Sports strategy', 'Auctions', 'Security'],
      },
    },
    latex: '\\sigma_i: S_i \\rightarrow [0,1], \\; \\sum_{s \\in S_i} \\sigma_i(s) = 1',
    relations: {
      prerequisites: ['probability', 'expected-value'],
      nextTopics: ['nash-equilibrium'],
      related: ['pure-strategy'],
      applications: ['randomized-algorithms'],
    },
    tags: ['혼합', 'mixed', '전략', 'strategy'],
  },
  {
    id: 'auction-theory',
    name: {
      ko: '경매 이론',
      en: 'Auction Theory',
    },
    field: 'game-theory',
    subfield: 'mechanism-design',
    difficulty: 4,
    content: {
      ko: {
        definition: '경매의 전략적 행동과 최적 설계를 연구하는 분야',
        formulas: [
          '영국식: 공개 오름차순',
          '네덜란드식: 공개 내림차순',
          '밀봉 1가격: 최고가 지불',
          '밀봉 2가격 (비크리): 차점가 지불',
        ],
        examples: ['Google 광고 경매', '무선 주파수 경매', '예술품 경매'],
        applications: ['온라인 광고', '정부 입찰', '자원 배분'],
      },
      en: {
        definition: 'Study of strategic behavior and optimal design in auctions',
        formulas: [
          'English: Open ascending',
          'Dutch: Open descending',
          'First-price sealed',
          'Second-price sealed (Vickrey): Pay second highest',
        ],
        examples: ['Google Ad auction', 'Spectrum auction', 'Art auction'],
        applications: ['Online advertising', 'Government procurement', 'Resource allocation'],
      },
    },
    latex: 'b^*(v) = v - \\frac{\\int_0^v F(t)^{n-1} dt}{F(v)^{n-1}}',
    relations: {
      prerequisites: ['expected-value', 'game-theory-basics'],
      nextTopics: ['mechanism-design'],
      related: ['nash-equilibrium'],
      applications: ['market-design'],
    },
    tags: ['경매', 'auction', '입찰', 'bidding'],
  },
  {
    id: 'evolutionary-game',
    name: {
      ko: '진화 게임 이론',
      en: 'Evolutionary Game Theory',
    },
    field: 'game-theory',
    subfield: 'evolutionary',
    difficulty: 4,
    content: {
      ko: {
        definition: '자연선택과 적응을 게임 이론으로 모델링하는 분야',
        formulas: [
          '복제자 동역학: ẋ_i = x_i(f_i - φ)',
          '진화적 안정 전략(ESS): u(σ*, σ*) > u(σ, σ*) 또는 같으면 u(σ*, σ) > u(σ, σ)',
        ],
        examples: ['매-비둘기 게임', '틱-포-탯 전략', '성비 진화'],
        applications: ['진화생물학', '사회 규범', '문화 진화'],
      },
      en: {
        definition: 'Modeling natural selection and adaptation using game theory',
        formulas: [
          'Replicator dynamics: ẋ_i = x_i(f_i - φ)',
          'ESS: u(σ*, σ*) > u(σ, σ*) or if equal, u(σ*, σ) > u(σ, σ)',
        ],
        examples: ['Hawk-Dove game', 'Tit-for-Tat strategy', 'Sex ratio evolution'],
        applications: ['Evolutionary biology', 'Social norms', 'Cultural evolution'],
      },
    },
    latex: '\\dot{x}_i = x_i(f_i - \\bar{f})',
    relations: {
      prerequisites: ['nash-equilibrium', 'differential-equations'],
      nextTopics: ['population-dynamics'],
      related: ['prisoners-dilemma'],
      applications: ['biology', 'sociology'],
    },
    tags: ['진화', 'evolutionary', 'ESS', 'replicator'],
  },
  {
    id: 'cooperative-game',
    name: {
      ko: '협력 게임',
      en: 'Cooperative Game',
    },
    field: 'game-theory',
    subfield: 'cooperative',
    difficulty: 4,
    content: {
      ko: {
        definition: '참가자들이 연합을 형성하여 공동 이익을 추구하는 게임',
        formulas: [
          '특성함수: v: 2^N → ℝ',
          '섀플리 값: φ_i(v) = Σ |S|!(n-|S|-1)!/n! · [v(S∪{i}) - v(S)]',
          '핵: C(v) = {x: Σx_i = v(N), Σ_{i∈S} x_i ≥ v(S)}',
        ],
        examples: ['비용 분담', '투표 권력', '이익 배분'],
        applications: ['정치학', '기업 합병', '국제 협력'],
      },
      en: {
        definition: 'Games where players form coalitions to pursue joint benefits',
        formulas: [
          'Characteristic function: v: 2^N → ℝ',
          'Shapley value: φ_i(v) = Σ |S|!(n-|S|-1)!/n! · [v(S∪{i}) - v(S)]',
          'Core: C(v) = {x: Σx_i = v(N), Σ_{i∈S} x_i ≥ v(S)}',
        ],
        examples: ['Cost sharing', 'Voting power', 'Profit division'],
        applications: ['Political science', 'Corporate mergers', 'International cooperation'],
      },
    },
    latex:
      '\\phi_i(v) = \\sum_{S \\subseteq N \\setminus \\{i\\}} \\frac{|S|!(n-|S|-1)!}{n!} [v(S \\cup \\{i\\}) - v(S)]',
    relations: {
      prerequisites: ['set-theory', 'combinatorics'],
      nextTopics: ['shapley-value', 'core'],
      related: ['nash-equilibrium'],
      applications: ['fair-division'],
    },
    tags: ['협력', 'cooperative', '연합', 'coalition'],
  },
];
