// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const appElement = document.getElementById("app");
if (!appElement) {
  throw new Error("App container element #app not found");
}
mount(() => <StartClient />, appElement);
