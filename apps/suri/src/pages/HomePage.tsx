/**
 * @fileoverview 홈페이지 컴포넌트
 */
import { For } from "solid-js";
import { A } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { useI18n } from "@/i18n";
import { fields } from "@/data/fields";
import { Layout } from "@/components/layout/Layout";

export default function HomePage() {
  const { locale, t, localePath } = useI18n();

  return (
    <Layout>
      <Title>{t("heroTitle")}</Title>
      <Meta name="description" content={t("heroSubtitle")} />

      {/* Hero Section */}
      <section class="text-center mb-12">
        <h1
          class="text-4xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {t("heroTitle")}
        </h1>
        <p
          class="text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("heroSubtitle")}
        </p>
      </section>

      {/* Browse by Field */}
      <section>
        <h2
          class="text-2xl font-semibold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          {t("browseByField")}
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <For each={fields}>
            {(field) => (
              <A
                href={localePath(`/field/${field.id}`)}
                class="card card-field flex flex-col items-center text-center p-4 hover:scale-[1.02] transition-transform"
                style={{ "--field-color": field.color }}
              >
                <span class="text-3xl mb-2">{field.icon}</span>
                <h3
                  class="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {field.name[locale()] || field.name.en}
                </h3>
              </A>
            )}
          </For>
        </div>
      </section>
    </Layout>
  );
}
