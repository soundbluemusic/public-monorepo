/**
 * @fileoverview 서버 엔트리 포인트
 *
 * SSG 빌드 시 HTML 문서 구조를 정의합니다.
 * - HTML 언어 설정 (en)
 * - PWA 메타태그 및 매니페스트
 * - SEO 메타 설명
 * - 다크모드 대응 body 스타일
 *
 * @refresh reload - HMR 시 전체 새로고침 활성화
 */
import { StartServer, createHandler } from '@solidjs/start/server';

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" class="scroll-smooth">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Free web development resources - Royalty-free Web Standard APIs and MIT-licensed open source libraries"
          />
          <meta name="theme-color" content="#3b82f6" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          {assets}
        </head>
        <body class="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
