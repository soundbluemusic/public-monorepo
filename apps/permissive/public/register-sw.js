// Service Worker Registration Script
// Separated from inline script to avoid dangerouslySetInnerHTML security concerns
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js").catch(function(error) {
      console.error("[SW] Registration failed:", error);
    });
  });
}
