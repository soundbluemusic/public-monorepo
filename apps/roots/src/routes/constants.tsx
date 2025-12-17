import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import { useI18n } from "@/i18n";
import { Layout } from "@/components/layout/Layout";

const mathConstants = [
  { symbol: "π", name: { ko: "원주율", en: "Pi", ja: "円周率" }, value: "3.14159265358979...", latex: "\\pi" },
  { symbol: "e", name: { ko: "자연상수", en: "Euler's number", ja: "ネイピア数" }, value: "2.71828182845904...", latex: "e" },
  { symbol: "φ", name: { ko: "황금비", en: "Golden ratio", ja: "黄金比" }, value: "1.61803398874989...", latex: "\\varphi" },
  { symbol: "√2", name: { ko: "루트2", en: "Square root of 2", ja: "√2" }, value: "1.41421356237309...", latex: "\\sqrt{2}" },
  { symbol: "γ", name: { ko: "오일러-마스케로니 상수", en: "Euler–Mascheroni constant", ja: "オイラー定数" }, value: "0.57721566490153...", latex: "\\gamma" },
  { symbol: "i", name: { ko: "허수 단위", en: "Imaginary unit", ja: "虚数単位" }, value: "√(-1)", latex: "i" },
];

export default function ConstantsPage() {
  const { locale, t } = useI18n();

  return (
    <Layout>
      <Title>{t("constants")} - Suri</Title>
      <Meta name="description" content="Mathematical constants" />

      <h1
        class="text-3xl font-bold mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        {t("constants")}
      </h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={mathConstants}>
          {(constant) => (
            <div class="card">
              <div class="flex items-center gap-4 mb-2">
                <span
                  class="text-3xl font-mono"
                  style={{ color: "var(--math-formula)" }}
                >
                  {constant.symbol}
                </span>
                <h3
                  class="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {constant.name[locale()] || constant.name.en}
                </h3>
              </div>
              <p
                class="font-mono text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {constant.value}
              </p>
            </div>
          )}
        </For>
      </div>
    </Layout>
  );
}
