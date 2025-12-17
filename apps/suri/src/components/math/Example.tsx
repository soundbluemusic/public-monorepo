/**
 * @fileoverview 예제 컴포넌트
 */
import { Show, For, createSignal } from "solid-js";
import { LaTeX } from "./LaTeX";
import { DifficultyStars } from "@/components/ui/DifficultyBadge";
import type { Example as ExampleType } from "@/data/types";

interface ExampleCardProps {
  example: ExampleType;
  index: number;
}

/**
 * 개별 예제 카드 컴포넌트
 */
export function ExampleCard(props: ExampleCardProps) {
  const [showSolution, setShowSolution] = createSignal(false);

  return (
    <div
      class="rounded-lg p-4"
      style={{
        "background-color": "var(--bg-secondary)",
        border: "1px solid var(--border-primary)",
      }}
    >
      {/* 예제 헤더 */}
      <div class="flex items-center justify-between mb-3">
        <span
          class="text-sm font-medium"
          style={{ color: "var(--text-tertiary)" }}
        >
          예제 {props.index + 1}
        </span>
        <Show when={props.example.difficulty}>
          <DifficultyStars level={props.example.difficulty!} />
        </Show>
      </div>

      {/* 문제 */}
      <div class="mb-3">
        <p style={{ color: "var(--text-primary)" }}>{props.example.problem}</p>
        <Show when={props.example.latex}>
          <div class="mt-2">
            <LaTeX math={props.example.latex!} display />
          </div>
        </Show>
      </div>

      {/* 풀이 토글 버튼 */}
      <button
        onClick={() => setShowSolution(!showSolution())}
        class="text-sm font-medium transition-colors"
        style={{ color: "var(--accent-primary)" }}
      >
        {showSolution() ? "▼ 풀이 숨기기" : "▶ 풀이 보기"}
      </button>

      {/* 풀이 */}
      <Show when={showSolution()}>
        <div
          class="mt-3 pt-3"
          style={{ "border-top": "1px solid var(--border-primary)" }}
        >
          <p
            class="whitespace-pre-wrap"
            style={{ color: "var(--text-secondary)" }}
          >
            {props.example.solution}
          </p>
        </div>
      </Show>
    </div>
  );
}

/**
 * 예제 목록 컴포넌트
 */
export function ExampleList(props: { examples: ExampleType[]; title?: string }) {
  return (
    <div class="space-y-4">
      <Show when={props.title}>
        <h3
          class="text-lg font-semibold flex items-center gap-2"
          style={{ color: "var(--text-primary)" }}
        >
          <span>✏️</span>
          {props.title}
        </h3>
      </Show>
      <div class="space-y-3">
        <For each={props.examples}>
          {(example, index) => <ExampleCard example={example} index={index()} />}
        </For>
      </div>
    </div>
  );
}
