// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" class="scroll-smooth">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Free web development resources - Royalty-free Web Standard APIs and MIT-licensed open source libraries" />
          <meta name="theme-color" content="#3b82f6" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />
          {assets}
        </head>
        <body class="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
          <div id="app">{children}</div>
          {scripts}
          <script dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `
          }} />
        </body>
      </html>
    )}
  />
));
