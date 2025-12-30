/**
 * useAutoAnimate Hook
 * @environment client-only
 *
 * @formkit/auto-animate 래퍼 훅
 * 리스트 추가/삭제/정렬 시 부드러운 애니메이션 자동 적용
 *
 * 한 줄로 리스트 애니메이션 추가:
 * - 아이템 추가 시: fade-in + slide-down
 * - 아이템 삭제 시: fade-out + slide-up
 * - 순서 변경 시: smooth reorder
 *
 * @example
 * ```tsx
 * import { useAutoAnimate } from '@soundblue/ui/hooks';
 *
 * function TodoList({ items }) {
 *   const [parent] = useAutoAnimate();
 *
 *   return (
 *     <ul ref={parent}>
 *       {items.map(item => <li key={item.id}>{item.text}</li>)}
 *     </ul>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 애니메이션 옵션 커스터마이징
 * const [parent] = useAutoAnimate({
 *   duration: 250,
 *   easing: 'ease-in-out',
 *   disrespectUserMotionPreference: false, // 접근성 - reduced motion 존중
 * });
 * ```
 */
import autoAnimate, { type AutoAnimateOptions } from '@formkit/auto-animate';
import { useCallback, useRef, useState } from 'react';

type AutoAnimateRef<T extends HTMLElement> = (node: T | null) => void;

export function useAutoAnimate<T extends HTMLElement = HTMLElement>(
  options?: Partial<AutoAnimateOptions>,
): [AutoAnimateRef<T>, (enabled: boolean) => void] {
  const [isEnabled, setIsEnabled] = useState(true);
  const animationController = useRef<ReturnType<typeof autoAnimate> | null>(null);

  const setRef: AutoAnimateRef<T> = useCallback(
    (node: T | null) => {
      if (node && isEnabled) {
        animationController.current = autoAnimate(node, options);
      } else if (animationController.current) {
        animationController.current.disable();
        animationController.current = null;
      }
    },
    [isEnabled, options],
  );

  const setEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
    if (!enabled && animationController.current) {
      animationController.current.disable();
    } else if (enabled && animationController.current) {
      animationController.current.enable();
    }
  }, []);

  return [setRef, setEnabled];
}
