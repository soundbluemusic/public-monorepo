/**
 * @fileoverview 순위 관련 타입 정의
 *
 * 오픈소스 라이브러리 순위 시스템을 위한 타입을 정의합니다.
 * 8가지 기준으로 카테고리별/전체 순위를 제공합니다.
 */
import type { OpenSource } from "./opensource";

/**
 * 순위 기준 유형
 * - popular: GitHub 스타 기준 인기도
 * - downloads: npm 주간 다운로드 기준
 * - lightweight: 번들 크기 작은 순 (경량)
 * - heavyweight: 번들 크기 큰 순 (중량)
 * - performance: 벤치마크 점수 기준
 * - growth: 최근 3개월 스타 증가율
 * - stability: 최근 업데이트 빈도 (안정성)
 * - dependency: 의존성 적은 순
 */
export type RankingType =
  | "popular"
  | "downloads"
  | "lightweight"
  | "heavyweight"
  | "performance"
  | "growth"
  | "stability"
  | "dependency";

/**
 * 순위 유형 메타데이터
 * @property type - 순위 유형 식별자
 * @property label - 영문 레이블
 * @property labelKo - 한글 레이블
 * @property icon - Lucide 아이콘 이름
 * @property description - 영문 설명
 * @property descriptionKo - 한글 설명
 */
export interface RankingTypeInfo {
  type: RankingType;
  label: string;
  labelKo: string;
  icon: string;
  description: string;
  descriptionKo: string;
}

/**
 * 순위 유형 목록
 *
 * UI에서 순위 필터/탭을 렌더링할 때 사용합니다.
 */
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

/**
 * 개별 순위 항목
 * @property rank - 현재 순위 (1부터 시작)
 * @property previousRank - 이전 순위 (순위 변동 표시용, 선택)
 * @property item - 라이브러리 데이터
 * @property score - 정규화된 점수 (0-100)
 * @property rawValue - 정규화 전 원본 값 (예: 스타 수, 다운로드 수)
 */
export interface RankingItem {
  rank: number;
  previousRank?: number;
  item: OpenSource;
  score: number;
  rawValue: number;
}

/**
 * 카테고리별 순위
 * @property categoryId - 카테고리 ID
 * @property categoryName - 카테고리 표시명
 * @property type - 순위 기준 유형
 * @property items - 순위 항목 목록 (순위순 정렬)
 * @property updatedAt - 순위 갱신 일시 (ISO 8601)
 */
export interface CategoryRanking {
  categoryId: string;
  categoryName: string;
  type: RankingType;
  items: RankingItem[];
  updatedAt: string;
}

/**
 * 전체 순위
 * @property type - 순위 기준 유형
 * @property items - 순위 항목 목록 (순위순 정렬)
 * @property updatedAt - 순위 갱신 일시 (ISO 8601)
 */
export interface GlobalRanking {
  type: RankingType;
  items: RankingItem[];
  updatedAt: string;
}
