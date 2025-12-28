/**
 * createImmerStore - Zustand + Immer 통합 스토어 생성
 *
 * Immer를 통해 불변성을 자동 보장하면서 직관적인 상태 업데이트 가능
 *
 * 장점:
 * - state.items.push(item) 같은 직접 수정 문법 사용 가능
 * - 복잡한 중첩 객체 업데이트가 간단해짐
 * - 실수로 인한 직접 mutate 방지
 *
 * @example
 * ```tsx
 * import { createImmerStore } from '@soundblue/shared-react/stores';
 *
 * interface TodoState {
 *   todos: Array<{ id: string; text: string; done: boolean }>;
 *   addTodo: (text: string) => void;
 *   toggleTodo: (id: string) => void;
 *   removeTodo: (id: string) => void;
 * }
 *
 * const useTodoStore = createImmerStore<TodoState>((set) => ({
 *   todos: [],
 *
 *   addTodo: (text) => set((state) => {
 *     // Immer로 인해 직접 push 가능!
 *     state.todos.push({
 *       id: crypto.randomUUID(),
 *       text,
 *       done: false,
 *     });
 *   }),
 *
 *   toggleTodo: (id) => set((state) => {
 *     const todo = state.todos.find(t => t.id === id);
 *     if (todo) todo.done = !todo.done;
 *   }),
 *
 *   removeTodo: (id) => set((state) => {
 *     const index = state.todos.findIndex(t => t.id === id);
 *     if (index !== -1) state.todos.splice(index, 1);
 *   }),
 * }));
 * ```
 *
 * @example
 * ```tsx
 * // 복잡한 중첩 객체 업데이트
 * const useFormStore = createImmerStore((set) => ({
 *   form: {
 *     user: {
 *       profile: {
 *         name: '',
 *         settings: { theme: 'light', notifications: true }
 *       }
 *     }
 *   },
 *
 *   updateTheme: (theme) => set((state) => {
 *     // 깊은 중첩도 간단하게!
 *     state.form.user.profile.settings.theme = theme;
 *   }),
 * }));
 * ```
 */
import { produce } from 'immer';
import { create, type StateCreator } from 'zustand';

type ImmerStateCreator<T> = (set: (fn: (state: T) => void) => void, get: () => T) => T;

export function createImmerStore<T>(initializer: ImmerStateCreator<T>) {
  const stateCreator: StateCreator<T> = (set, get) =>
    initializer((fn) => set(produce(fn) as (state: T) => T), get);

  return create<T>(stateCreator);
}

/**
 * Immer produce function - 직접 사용 가능
 *
 * @example
 * ```tsx
 * import { produce } from '@soundblue/shared-react/stores';
 *
 * const nextState = produce(state, draft => {
 *   draft.items.push(newItem);
 * });
 * ```
 */
export { produce } from 'immer';
