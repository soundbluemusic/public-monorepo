// 순위 관련 타입 정의

import type { OpenSource } from "./opensource";

// 순위 유형
export type RankingType =
  | "popular"
  | "downloads"
  | "lightweight"
  | "heavyweight"
  | "performance"
  | "growth"
  | "stability"
  | "dependency";

// 순위 유형 정보
export interface RankingTypeInfo {
  type: RankingType;
  label: string;
  labelKo: string;
  icon: string;
  description: string;
  descriptionKo: string;
}

export const RANKING_TYPES: RankingTypeInfo[] = [
  {
    type: "popular",
    label: "Popular",
    labelKo: "인기",
    icon: "trophy",
    description: "Ranked by GitHub stars",
    descriptionKo: "GitHub 스타 기준",
  },
  {
    type: "downloads",
    label: "Downloads",
    labelKo: "다운로드",
    icon: "download",
    description: "Ranked by weekly npm downloads",
    descriptionKo: "주간 npm 다운로드 기준",
  },
  {
    type: "lightweight",
    label: "Lightweight",
    labelKo: "경량",
    icon: "feather",
    description: "Ranked by smallest bundle size",
    descriptionKo: "번들 크기 작은 순",
  },
  {
    type: "heavyweight",
    label: "Heavyweight",
    labelKo: "중량",
    icon: "package",
    description: "Ranked by largest bundle size",
    descriptionKo: "번들 크기 큰 순",
  },
  {
    type: "performance",
    label: "Performance",
    labelKo: "성능",
    icon: "zap",
    description: "Ranked by benchmark scores",
    descriptionKo: "벤치마크 점수 기준",
  },
  {
    type: "growth",
    label: "Growing",
    labelKo: "성장",
    icon: "trending-up",
    description: "Ranked by 3-month star growth rate",
    descriptionKo: "최근 3개월 스타 증가율 기준",
  },
  {
    type: "stability",
    label: "Stability",
    labelKo: "안정성",
    icon: "clock",
    description: "Ranked by recent update frequency",
    descriptionKo: "최근 업데이트 기준",
  },
  {
    type: "dependency",
    label: "Dependency",
    labelKo: "의존성",
    icon: "git-branch",
    description: "Ranked by fewest dependencies",
    descriptionKo: "의존성 적은 순",
  },
];

// 순위 항목
export interface RankingItem {
  rank: number;
  previousRank?: number;
  item: OpenSource;
  score: number;
  rawValue: number;
}

// 카테고리별 순위
export interface CategoryRanking {
  categoryId: string;
  categoryName: string;
  type: RankingType;
  items: RankingItem[];
  updatedAt: string;
}

// 전체 순위
export interface GlobalRanking {
  type: RankingType;
  items: RankingItem[];
  updatedAt: string;
}
