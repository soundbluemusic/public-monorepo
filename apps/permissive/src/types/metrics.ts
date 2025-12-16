// 지표 관련 타입 정의

export interface MetricDisplay {
  key: string;
  label: string;
  labelKo: string;
  icon: string;
  format: "number" | "bytes" | "date" | "percentage";
  higherIsBetter: boolean;
}

// 지표 목록
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
