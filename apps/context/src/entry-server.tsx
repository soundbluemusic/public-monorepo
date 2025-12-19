/**
 * @fileoverview 서버 엔트리 포인트
 *
 * SSG 빌드 시 HTML 문서 구조를 정의합니다.
 * - HTML 언어 설정 (ko)
 * - PWA 메타태그 및 매니페스트
 * - 아이콘 및 테마 색상
 *
 * @refresh reload - HMR 시 전체 새로고침 활성화
 */
import { StartServer, createHandler } from '@solidjs/start/server';

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="ko">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#3B82F6" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
