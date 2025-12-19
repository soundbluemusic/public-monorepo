/**
 * @fileoverview 오픈소스 라이브러리 타입 정의
 *
 * 오픈소스 라이브러리의 정적 정보, 동적 지표, 벤치마크, 순위를 정의합니다.
 *
 * @example
 * ```ts
 * import type { OpenSource, OpenSourceMetrics } from '@/types/opensource';
 *
 * const library: OpenSource = {
 *   id: 'react',
 *   name: 'React',
 *   description: 'A JavaScript library for building user interfaces',
 *   category: 'ui-framework',
 *   license: 'MIT',
 *   github: 'https://github.com/facebook/react',
 *   npm: 'react',
 *   tags: ['ui', 'framework', 'virtual-dom'],
 *   metrics: { stars: 200000, weeklyDownloads: 20000000, ... },
 * };
 * ```
 */

/**
 * 기본 오픈소스 정보 (정적 데이터)
 * @property id - 고유 식별자 (예: 'react', 'vue', 'lodash')
 * @property name - 표시용 이름
 * @property description - 라이브러리 설명
 * @property category - 소속 카테고리 ID
 * @property license - 라이선스 유형
 * @property github - GitHub 저장소 URL
 * @property npm - npm 패키지명 (선택)
 * @property website - 공식 웹사이트 URL (선택)
 * @property tags - 검색/필터링용 태그
 * @property compatible - 호환 라이브러리 ID 목록 (선택)
 * @property usedInSite - 이 사이트에서 사용 중인지 여부 (선택)
 */
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
  usedInSite?: boolean;
}

/**
 * 오픈소스 측정 지표 (외부 API에서 수집)
 *
 * npm, GitHub, Bundlephobia에서 가져온 동적 데이터입니다.
 *
 * @property id - 라이브러리 ID (OpenSourceBase.id와 매핑)
 * @property weeklyDownloads - npm 주간 다운로드 수
 * @property monthlyDownloads - npm 월간 다운로드 수
 * @property lastPublish - 마지막 npm 배포 일시 (ISO 8601)
 * @property dependencyCount - 프로덕션 의존성 개수
 * @property stars - GitHub 스타 수
 * @property forks - GitHub 포크 수
 * @property openIssues - 열린 이슈 수
 * @property starsGrowth3m - 최근 3개월 스타 증가율 (0.0~1.0)
 * @property bundleSizeMin - 번들 크기 (minified, bytes)
 * @property bundleSizeGzip - 번들 크기 (gzipped, bytes)
 * @property fetchedAt - 데이터 수집 일시 (ISO 8601)
 */
export interface OpenSourceMetrics {
  id: string;
  weeklyDownloads: number;
  monthlyDownloads: number;
  lastPublish: string;
  dependencyCount: number;
  stars: number;
  forks: number;
  openIssues: number;
  starsGrowth3m: number;
  bundleSizeMin: number;
  bundleSizeGzip: number;
  fetchedAt: string;
}

/**
 * 벤치마크 데이터 (수동 관리)
 *
 * 외부 벤치마크 결과를 수동으로 기록합니다.
 * score는 0-100 범위로 정규화됩니다.
 *
 * @property id - 라이브러리 ID
 * @property category - 벤치마크 카테고리 (예: 'render', 'bundle')
 * @property score - 정규화된 점수 (0-100, 높을수록 우수)
 * @property source - 벤치마크 출처 URL
 * @property measuredAt - 측정 일시 (ISO 8601)
 */
export interface OpenSourceBenchmark {
  id: string;
  category: string;
  score: number;
  source: string;
  measuredAt: string;
}

/**
 * 순위 정보 (metrics 기반 자동 계산)
 *
 * 카테고리 내 순위와 전체 순위를 제공합니다.
 * 순위는 1부터 시작하며, 숫자가 작을수록 상위입니다.
 *
 * @property id - 라이브러리 ID
 * @property categoryId - 소속 카테고리 ID
 * @property popularRank - 카테고리 내 인기 순위 (stars 기준)
 * @property downloadRank - 카테고리 내 다운로드 순위
 * @property lightweightRank - 카테고리 내 경량 순위 (작은 번들)
 * @property heavyweightRank - 카테고리 내 중량 순위 (큰 번들)
 * @property performanceRank - 카테고리 내 성능 순위 (벤치마크)
 * @property growthRank - 카테고리 내 성장 순위 (스타 증가율)
 * @property stabilityRank - 카테고리 내 안정성 순위 (최근 업데이트)
 * @property dependencyRank - 카테고리 내 의존성 순위 (적은 의존성)
 * @property globalPopularRank - 전체 인기 순위
 * @property globalDownloadRank - 전체 다운로드 순위
 * @property overallScore - 종합 점수 (0-100)
 */
export interface OpenSourceRankings {
  id: string;
  categoryId: string;
  popularRank: number;
  downloadRank: number;
  lightweightRank: number;
  heavyweightRank: number;
  performanceRank: number;
  growthRank: number;
  stabilityRank: number;
  dependencyRank: number;
  globalPopularRank: number;
  globalDownloadRank: number;
  overallScore: number;
}

/**
 * 병합된 오픈소스 데이터 (최종 렌더링용)
 *
 * 기본 정보에 지표, 벤치마크, 순위를 결합한 완전한 데이터입니다.
 */
export interface OpenSource extends OpenSourceBase {
  metrics?: OpenSourceMetrics;
  benchmarks?: OpenSourceBenchmark[];
  rankings?: OpenSourceRankings;
}

/**
 * 지원 라이선스 유형
 * - MIT: 가장 관대한 오픈소스 라이선스
 * - Apache-2.0: 특허 보호 포함
 * - BSD-2-Clause: 2조항 BSD
 * - BSD-3-Clause: 3조항 BSD
 * - ISC: MIT와 유사
 * - Unlicense: 퍼블릭 도메인
 * - 0BSD: 제로 조항 BSD (퍼블릭 도메인과 유사)
 */
export type LicenseType =
  | 'MIT'
  | 'Apache-2.0'
  | 'BSD-2-Clause'
  | 'BSD-3-Clause'
  | 'ISC'
  | 'Unlicense'
  | '0BSD';

/**
 * 오픈소스 카테고리
 * @property id - 고유 식별자 (예: 'ui-framework', 'state-management')
 * @property name - 표시용 카테고리명
 * @property icon - Lucide 아이콘 이름
 * @property description - 카테고리 설명
 * @property items - 소속 라이브러리 목록
 */
export interface OpenSourceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: OpenSourceBase[];
}
