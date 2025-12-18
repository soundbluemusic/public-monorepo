import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { Layout } from "@/components/Layout";
import { useI18n } from "@/i18n";

export default function TermsPage() {
  const { locale, localePath } = useI18n();

  const getTitle = () => {
    if (locale() === "ko") return "이용약관";
    return "Terms of Service";
  };

  return (
    <Layout>
      <Title>{getTitle()} - Context</Title>
      <Meta name="description" content="Terms of Service" />

      <A href={localePath("/")} class="text-sm mb-8 inline-block" style={{ color: "var(--text-tertiary)" }}>
        ← {locale() === "ko" ? "홈으로" : "Back to home"}
      </A>

      <h1 class="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
        {getTitle()}
      </h1>

      <div class="space-y-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <p>
          {locale() === "ko"
            ? "Context는 한국어 학습자를 위한 무료 오픈소스 사전입니다. 이 서비스는 교육 목적으로 제공되며, 상업적 용도로 사용할 수 있습니다."
            : "Context is a free, open-source dictionary for Korean learners. This service is provided for educational purposes and may be used commercially."}
        </p>
        <p>
          {locale() === "ko"
            ? "콘텐츠의 정확성을 위해 노력하지만, 모든 정보의 완전성을 보장하지는 않습니다."
            : "While we strive for accuracy, we do not guarantee the completeness of all information."}
        </p>
      </div>
    </Layout>
  );
}
