// 오픈소스 라이브러리 타입 정의

// 기본 오픈소스 정보 (정적 데이터)
export interface OpenSourceBase {
  id: string;
  name: string;
  description: string;
  category: string;
  license: LicenseType;
  github: string;
  npm?: string;
  website?: string;
  tags: string[];
  compatible?: string[];

  // 이 사이트에서 사용 중인지
  usedInSite?: boolean;
}

// 측정 지표 (API에서 가져옴)
export interface OpenSourceMetrics {
  id: string;

  // npm 데이터
  weeklyDownloads: number;
  monthlyDownloads: number;
  lastPublish: string;
  dependencyCount: number;

  // GitHub 데이터
  stars: number;
  forks: number;
  openIssues: number;
  starsGrowth3m: number;

  // Bundlephobia 데이터
  bundleSizeMin: number;
  bundleSizeGzip: number;

  // 메타
  fetchedAt: string;
}

// 벤치마크 데이터 (수동 관리)
export interface OpenSourceBenchmark {
  id: string;
  category: string;
  score: number;
  source: string;
  measuredAt: string;
}

// 순위 정보 (계산됨)
export interface OpenSourceRankings {
  id: string;
  categoryId: string;

  // 카테고리 내 순위
  popularRank: number;
  downloadRank: number;
  lightweightRank: number;
  heavyweightRank: number;
  performanceRank: number;
  growthRank: number;
  stabilityRank: number;
  dependencyRank: number;

  // 전체 순위
  globalPopularRank: number;
  globalDownloadRank: number;

  // 종합 점수 (0-100)
  overallScore: number;
}

// 병합된 최종 데이터
export interface OpenSource extends OpenSourceBase {
  metrics?: OpenSourceMetrics;
  benchmarks?: OpenSourceBenchmark[];
  rankings?: OpenSourceRankings;
}

// 라이선스 타입
export type LicenseType =
  | "MIT"
  | "Apache-2.0"
  | "BSD-2-Clause"
  | "BSD-3-Clause"
  | "ISC"
  | "Unlicense"
  | "0BSD";

// 오픈소스 카테고리
export interface OpenSourceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: OpenSourceBase[];
}
