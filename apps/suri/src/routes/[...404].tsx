import { A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { Layout } from "@/components/layout/Layout";
import { useI18n } from "@/i18n";

export default function NotFound() {
  const { t, localePath } = useI18n();

  return (
    <Layout>
      <Title>404 - Suri</Title>
      <div class="text-center py-16">
        <h1
          class="text-6xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          404
        </h1>
        <p
          class="text-xl mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Page not found
        </p>
        <A href={localePath("/")} class="btn btn-primary">
          {t("home")}
        </A>
      </div>
    </Layout>
  );
}
