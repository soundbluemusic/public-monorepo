/**
 * @fileoverview 난이도 표시 뱃지 컴포넌트
 */
import { useI18n } from "@/i18n";
import type { DifficultyLevel } from "@/data/types";
import { difficultyLabels } from "@/data/types";

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  /** 레이블 텍스트 표시 여부 */
  showLabel?: boolean;
  /** 크기 */
  size?: "sm" | "md" | "lg";
}

/**
 * 난이도를 별(★)과 레이블로 표시하는 뱃지 컴포넌트
 *
 * @example
 * ```tsx
 * <DifficultyBadge level={3} />           // ★★★☆☆
 * <DifficultyBadge level={3} showLabel /> // ★★★☆☆ 고등
 * ```
 */
export function DifficultyBadge(props: DifficultyBadgeProps) {
  const { locale } = useI18n();

  const stars = () => {
    const filled = "★".repeat(props.level);
    const empty = "☆".repeat(5 - props.level);
    return filled + empty;
  };

  const label = () => {
    const labels = difficultyLabels[props.level];
    return labels[locale()] || labels.en;
  };

  const sizeClasses = () => {
    switch (props.size) {
      case "sm":
        return "text-xs px-1.5 py-0.5";
      case "lg":
        return "text-base px-3 py-1.5";
      default:
        return "text-sm px-2 py-1";
    }
  };

  return (
    <span class={`badge-difficulty badge-difficulty-${props.level} ${sizeClasses()}`}>
      <span class="tracking-tight">{stars()}</span>
      {props.showLabel !== false && (
        <span class="ml-1 font-medium">{label()}</span>
      )}
    </span>
  );
}

/**
 * 난이도만 간단히 표시 (별만)
 */
export function DifficultyStars(props: { level: DifficultyLevel }) {
  return (
    <span
      class="tracking-tight"
      style={{ color: `var(--difficulty-${props.level})` }}
    >
      {"★".repeat(props.level)}
      {"☆".repeat(5 - props.level)}
    </span>
  );
}
