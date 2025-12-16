import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { Layout } from "@/components/Layout";
import { useI18n } from "@/i18n";

export default function PrivacyPage() {
  const { locale, localePath } = useI18n();

  const getTitle = () => {
    if (locale() === "ko") return "개인정보 처리방침";
    if (locale() === "ja") return "プライバシーポリシー";
    return "Privacy Policy";
  };

  return (
    <Layout>
      <Title>{getTitle()} - Context</Title>
      <Meta name="description" content="Privacy Policy" />

      <A href={localePath("/")} class="text-sm mb-8 inline-block" style={{ color: "var(--text-tertiary)" }}>
        ← {locale() === "ko" ? "홈으로" : locale() === "ja" ? "ホームへ" : "Back to home"}
      </A>

      <h1 class="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
        {getTitle()}
      </h1>

      <div class="space-y-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <p>
          {locale() === "ko"
            ? "Context는 사용자의 개인정보를 수집하지 않습니다. 이 사이트는 정적 웹 애플리케이션으로, 서버에 데이터를 저장하지 않습니다."
            : locale() === "ja"
            ? "Contextはユーザーの個人情報を収集しません。このサイトは静的Webアプリケーションであり、サーバーにデータを保存しません。"
            : "Context does not collect any personal information. This site is a static web application and does not store any data on servers."}
        </p>
        <p>
          {locale() === "ko"
            ? "다크 모드 설정은 브라우저의 로컬 스토리지에만 저장되며, 외부로 전송되지 않습니다."
            : locale() === "ja"
            ? "ダークモード設定はブラウザのローカルストレージにのみ保存され、外部に送信されません。"
            : "Dark mode preferences are stored only in your browser's local storage and are not transmitted externally."}
        </p>
      </div>
    </Layout>
  );
}
