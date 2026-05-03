/**
 * @fileoverview 수학 표현 렌더러 (KaTeX 기반)
 *
 * KaTeX로 LaTeX 수식을 SSR 안전한 HTML+MathML로 렌더링합니다.
 * - 시각: 정밀하게 조판된 HTML
 * - 보조기술: MathML(`output: 'htmlAndMathml'`)로 의미 전달
 * - 잘못된 LaTeX는 throwOnError: false 옵션으로 빨간색 표기 (페이지 깨짐 방지)
 *
 * 자체 메모이제이션 캐시로 동일 수식 반복 렌더링을 방지합니다.
 */

import 'katex/dist/katex.min.css';
import { cn } from '@soundblue/ui/utils';
import katex from 'katex';
import { useMemo } from 'react';

interface LaTeXProps {
  /** LaTeX 수식 소스 (예: '\\frac{1}{2}', 'x^2 + y^2 = r^2') */
  math: string;
  /** block(display) 모드 여부, 기본값 false (inline) */
  display?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

/** 렌더링 결과 캐시 — display 여부와 math 소스의 조합으로 키를 구성 */
const renderCache = new Map<string, string>();
const MAX_CACHE_SIZE = 1000;

/** KaTeX 렌더링 + 캐싱 */
function renderLatex(math: string, display: boolean): string {
  const key = `${display ? 'd' : 'i'}:${math}`;
  const cached = renderCache.get(key);
  if (cached !== undefined) return cached;

  const html = katex.renderToString(math, {
    displayMode: display,
    // 잘못된 LaTeX도 빨간색 fallback으로 렌더링 (페이지 전체가 깨지는 것 방지)
    throwOnError: false,
    errorColor: 'var(--color-error, #cc0000)',
    // HTML(시각) + MathML(보조기술) 양쪽 모두 출력
    output: 'htmlAndMathml',
    // 비표준/비호환 명령어 경고는 무시 (콘솔 노이즈 감소)
    strict: 'ignore',
    // SSR 안전: trust=false 로 외부 URL/href 매크로 차단
    trust: false,
  });

  // 캐시 크기 제한 (LRU에 가깝게 — 가장 오래된 항목부터 제거)
  if (renderCache.size >= MAX_CACHE_SIZE) {
    const firstKey = renderCache.keys().next().value;
    if (firstKey !== undefined) {
      renderCache.delete(firstKey);
    }
  }
  renderCache.set(key, html);
  return html;
}

/**
 * 수학 수식 렌더링 컴포넌트 (KaTeX)
 *
 * @example
 * ```tsx
 * <LaTeX math="x^2 + y^2 = r^2" />
 * <LaTeX math="\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}" display />
 * ```
 */
export function LaTeX({ math, display = false, className }: LaTeXProps) {
  const html = useMemo(() => renderLatex(math, display), [math, display]);

  return (
    <span
      role="math"
      // 보조기술이 KaTeX의 MathML 출력을 우선 사용하지만, 폴백으로 LaTeX 원문 노출
      aria-label={math}
      className={cn(
        'text-(--math-formula)',
        display ? 'block text-center my-2' : 'inline',
        className,
      )}
      // KaTeX는 throwOnError: false + trust: false 옵션으로 안전한 HTML을 생성
      // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX가 자체적으로 sanitize한 출력
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * 블록 수식용 래퍼 컴포넌트
 *
 * @example
 * ```tsx
 * <MathBlock math="\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}" />
 * ```
 */
export function MathBlock({ math, className }: { math: string; className?: string }) {
  return (
    <div
      className={cn(
        'my-4 p-4 rounded-lg bg-(--bg-secondary) border border-(--border-primary) overflow-x-auto',
        className,
      )}
    >
      <LaTeX math={math} display />
    </div>
  );
}
