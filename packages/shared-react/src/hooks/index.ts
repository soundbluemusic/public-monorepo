// Re-export useful hooks from react-use
export {
  useClickAway,
  useCopyToClipboard,
  useDebounce,
  useLocalStorage,
  useMount,
  usePrevious,
  useSessionStorage,
  useThrottle,
  useUnmount,
  useUpdateEffect,
  useWindowSize,
} from 'react-use';
export { useAutoAnimate } from './useAutoAnimate';
export { useIsMobile, useMediaQuery } from './useMediaQuery';
export { type UseOnlineStatusReturn, useOnlineStatus } from './useOnlineStatus';
export {
  type SearchIndexItem,
  type SearchResult,
  useSearchWorker,
} from './useSearchWorker';
export {
  startViewTransition,
  supportsViewTransitions,
  useViewTransition,
} from './useViewTransition';
