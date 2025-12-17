/**
 * @fileoverview KaTeX LaTeX 렌더러 컴포넌트
 */
import { createMemo } from "solid-js";
import katex from "katex";

interface LaTeXProps {
  /** LaTeX 수식 문자열 */
  math: string;
  /** block (display) 모드 여부, 기본값 false (inline) */
  display?: boolean;
  /** 추가 CSS 클래스 */
  class?: string;
}

/**
 * LaTeX 수식을 렌더링하는 컴포넌트
 *
 * @example
 * ```tsx
 * // Inline math
 * <LaTeX math="x^2 + y^2 = z^2" />
 *
 * // Display (block) math
 * <LaTeX math="\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}" display />
 * ```
 */
export function LaTeX(props: LaTeXProps) {
  const html = createMemo(() => {
    try {
      return katex.renderToString(props.math, {
        displayMode: props.display ?? false,
        throwOnError: false,
        trust: false,
        strict: false,
      });
    } catch {
      return `<span class="text-red-500">[Math Error: ${props.math}]</span>`;
    }
  });

  return (
    <span
      class={props.class}
      innerHTML={html()}
      style={{
        display: props.display ? "block" : "inline",
        "text-align": props.display ? "center" : "inherit",
      }}
    />
  );
}

/**
 * 블록 수식용 래퍼 컴포넌트
 */
export function MathBlock(props: { math: string; class?: string }) {
  return (
    <div class={`formula-block my-4 ${props.class || ""}`}>
      <LaTeX math={props.math} display />
    </div>
  );
}
