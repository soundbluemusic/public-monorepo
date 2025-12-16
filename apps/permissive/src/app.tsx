import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { I18nProvider } from "@/i18n";

import "~/styles/global.css";

export default function App() {
  return (
    <I18nProvider>
      <Router
        root={(props) => (
          <MetaProvider>
            <Title>Permissive - Free Web Dev Resources</Title>
            <Suspense fallback={<div class="min-h-screen flex items-center justify-center">Loading...</div>}>
              {props.children}
            </Suspense>
          </MetaProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </I18nProvider>
  );
}
