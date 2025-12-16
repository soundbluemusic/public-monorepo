import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { Layout } from "@/components/Layout";
import { useI18n } from "@/i18n";

export default function LicensePage() {
  const { locale, localePath } = useI18n();

  const getTitle = () => {
    if (locale() === "ko") return "라이선스";
    if (locale() === "ja") return "ライセンス";
    return "License";
  };

  return (
    <Layout>
      <Title>{getTitle()} - Context</Title>
      <Meta name="description" content="License Information" />

      <A href={localePath("/")} class="text-sm mb-8 inline-block" style={{ color: "var(--text-tertiary)" }}>
        ← {locale() === "ko" ? "홈으로" : locale() === "ja" ? "ホームへ" : "Back to home"}
      </A>

      <h1 class="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
        {getTitle()}
      </h1>

      <div class="space-y-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <p>
          {locale() === "ko"
            ? "Context는 MIT 라이선스 하에 배포되는 오픈소스 프로젝트입니다."
            : locale() === "ja"
            ? "ContextはMITライセンスの下で配布されるオープンソースプロジェクトです。"
            : "Context is an open source project distributed under the MIT License."}
        </p>

        <div
          class="p-4 rounded-lg text-sm font-mono"
          style={{ "background-color": "var(--bg-tertiary)" }}
        >
          <p class="mb-4">MIT License</p>
          <p class="mb-4">Copyright (c) 2025 SoundBlueMusic</p>
          <p>
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </p>
          <p class="mt-4">
            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.
          </p>
          <p class="mt-4">
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>
        </div>
      </div>
    </Layout>
  );
}
