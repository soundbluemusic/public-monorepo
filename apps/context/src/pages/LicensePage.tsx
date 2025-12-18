import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { Layout } from "@/components/Layout";
import { useI18n } from "@/i18n";

export default function LicensePage() {
  const { locale, localePath } = useI18n();

  const getTitle = () => {
    if (locale() === "ko") return "라이선스";
    return "License";
  };

  return (
    <Layout>
      <Title>{getTitle()} - Context</Title>
      <Meta name="description" content="License Information" />

      <A href={localePath("/")} class="text-sm mb-8 inline-block" style={{ color: "var(--text-tertiary)" }}>
        ← {locale() === "ko" ? "홈으로" : "Back to home"}
      </A>

      <h1 class="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
        {getTitle()}
      </h1>

      <div class="space-y-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <p>
          {locale() === "ko"
            ? "Context는 Apache License 2.0 하에 배포되는 오픈소스 프로젝트입니다."
            : "Context is an open source project distributed under the Apache License 2.0."}
        </p>

        <div
          class="p-4 rounded-lg text-sm font-mono"
          style={{ "background-color": "var(--bg-tertiary)" }}
        >
          <p class="mb-4">Apache License, Version 2.0</p>
          <p class="mb-4">Copyright (c) 2025 SoundBlueMusic</p>
          <p>
            Licensed under the Apache License, Version 2.0 (the "License");
            you may not use this file except in compliance with the License.
            You may obtain a copy of the License at
          </p>
          <p class="mt-4">
            <a
              href="http://www.apache.org/licenses/LICENSE-2.0"
              target="_blank"
              rel="noopener noreferrer"
              class="underline"
              style={{ color: "var(--accent)" }}
            >
              http://www.apache.org/licenses/LICENSE-2.0
            </a>
          </p>
          <p class="mt-4">
            Unless required by applicable law or agreed to in writing, software
            distributed under the License is distributed on an "AS IS" BASIS,
            WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
            See the License for the specific language governing permissions and
            limitations under the License.
          </p>
        </div>
      </div>
    </Layout>
  );
}
