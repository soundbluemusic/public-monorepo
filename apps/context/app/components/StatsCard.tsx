/**
 * @fileoverview 통계 카드 컴포넌트
 *
 * browse.tsx에서 중복되던 통계 카드 UI를 추출한 재사용 가능한 컴포넌트입니다.
 */
import { memo } from 'react';

interface StatsCardProps {
  /** 카드 제목 (라벨) */
  label: string;
  /** 메인 값 (큰 숫자 또는 텍스트) */
  value: string | number;
  /** 보조 설명 텍스트 */
  subtitle?: string;
}

/**
 * StatsCard - 통계 정보 표시 카드
 *
 * @example
 * ```tsx
 * <StatsCard
 *   label="전체 진행률"
 *   value="75%"
 *   subtitle="562/751 단어"
 * />
 * ```
 */
export const StatsCard = memo(function StatsCard({ label, value, subtitle }: StatsCardProps) {
  return (
    <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
      <div className="text-sm text-(--text-tertiary) mb-1">{label}</div>
      <div className="text-2xl font-bold text-(--text-primary)">{value}</div>
      {subtitle && <div className="text-xs text-(--text-secondary)">{subtitle}</div>}
    </div>
  );
});
