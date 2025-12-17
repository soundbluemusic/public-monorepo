/**
 * @fileoverview 지표 표시 관련 타입 정의
 *
 * 오픈소스 라이브러리의 지표를 UI에 표시하기 위한 설정을 정의합니다.
 * 포맷팅 방식과 정렬 방향을 결정하는 데 사용됩니다.
 */

/**
 * 지표 표시 설정
 * @property key - 지표 키 (OpenSourceMetrics의 필드명)
 * @property label - 영문 레이블
 * @property labelKo - 한글 레이블
 * @property icon - Lucide 아이콘 이름
 * @property format - 포맷 유형
 *   - 'number': 숫자 (천 단위 구분자 적용, 예: 1,234,567)
 *   - 'bytes': 바이트 크기 (KB/MB 변환, 예: 45.2 KB)
 *   - 'date': 날짜 (상대적 표시, 예: 3일 전)
 *   - 'percentage': 백분율 (예: +12.5%)
 * @property higherIsBetter - 정렬 방향 결정
 *   - true: 높을수록 좋음 (내림차순 정렬)
 *   - false: 낮을수록 좋음 (오름차순 정렬)
 */
export interface MetricDisplay {
  key: string;
  label: string;
  labelKo: string;
  icon: string;
  format: "number" | "bytes" | "date" | "percentage";
  higherIsBetter: boolean;
}

/**
 * 표시 가능한 지표 목록
 *
 * UI에서 지표 카드/테이블을 렌더링할 때 사용합니다.
 * higherIsBetter 값에 따라 정렬 방향과 색상(좋음/나쁨)이 결정됩니다.
 */
export const METRIC_DISPLAYS: MetricDisplay[] = [
  {
    key: "stars",
    label: "GitHub Stars",
    labelKo: "GitHub 스타",
    icon: "star",
    format: "number",
    higherIsBetter: true,
  },
  {
    key: "weeklyDownloads",
    label: "Weekly Downloads",
    labelKo: "주간 다운로드",
    icon: "download",
    format: "number",
    higherIsBetter: true,
  },
  {
    key: "bundleSizeGzip",
    label: "Bundle Size",
    labelKo: "번들 크기",
    icon: "package",
    format: "bytes",
    higherIsBetter: false,
  },
  {
    key: "dependencyCount",
    label: "Dependencies",
    labelKo: "의존성",
    icon: "git-branch",
    format: "number",
    higherIsBetter: false,
  },
  {
    key: "lastPublish",
    label: "Last Update",
    labelKo: "마지막 업데이트",
    icon: "clock",
    format: "date",
    higherIsBetter: true,
  },
  {
    key: "starsGrowth3m",
    label: "3-Month Growth",
    labelKo: "3개월 성장",
    icon: "trending-up",
    format: "percentage",
    higherIsBetter: true,
  },
];
