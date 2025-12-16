import { Show, For } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useI18n } from "@/i18n";

interface SidebarProps {
  isOpen: boolean;        // Mobile: sidebar visible
  isCollapsed: boolean;   // Desktop: sidebar collapsed (icons only)
  isMobile: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const navItems = [
  { href: "/", label: "Home", labelKo: "홈", icon: "🏠" },
  { href: "/web-api", label: "Web API", labelKo: "Web API", icon: "🌐" },
  { href: "/libraries", label: "Libraries", labelKo: "Libraries", icon: "📦" },
];

const quickLinks = {
  webApi: [
    { name: "Fetch API", desc: "HTTP requests", descKo: "HTTP 요청", href: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", icon: "🌐" },
    { name: "localStorage", desc: "Persistent storage", descKo: "영구 저장소", href: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage", icon: "💾" },
    { name: "WebSocket", desc: "Real-time", descKo: "실시간 통신", href: "https://developer.mozilla.org/en-US/docs/Web/API/WebSocket", icon: "🔌" },
    { name: "Canvas", desc: "2D graphics", descKo: "2D 그래픽", href: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API", icon: "🎨" },
  ],
  libraries: [
    { name: "React", desc: "UI library", descKo: "UI 라이브러리", href: "https://github.com/facebook/react", icon: "⚛️" },
    { name: "Vue", desc: "Progressive", descKo: "프로그레시브", href: "https://github.com/vuejs/core", icon: "💚" },
    { name: "Vite", desc: "Build tool", descKo: "빌드 도구", href: "https://github.com/vitejs/vite", icon: "⚡" },
    { name: "Tailwind", desc: "Utility CSS", descKo: "유틸리티 CSS", href: "https://github.com/tailwindlabs/tailwindcss", icon: "🎐" },
  ],
};

export default function Sidebar(props: SidebarProps) {
  const { locale } = useI18n();
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  // Determine sidebar width based on state
  const getSidebarWidth = () => {
    if (props.isMobile) {
      return "var(--sidebar-width)"; // Always full width on mobile
    }
    return props.isCollapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)";
  };

  // Determine transform for mobile slide
  const getTransform = () => {
    if (props.isMobile) {
      return props.isOpen ? "translateX(0)" : "translateX(-100%)";
    }
    return "translateX(0)"; // Always visible on desktop
  };

  return (
    <>
      {/* Overlay (mobile only) */}
      <Show when={props.isMobile && props.isOpen}>
        <div
          class="fixed inset-0 bg-black/50 z-overlay transition-opacity duration-200"
          onClick={() => props.onClose()}
        />
      </Show>

      {/* Sidebar */}
      <aside
        class="fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-sidebar flex flex-col transition-all duration-200 ease-out"
        style={{
          width: getSidebarWidth(),
          transform: getTransform(),
          "padding-top": "env(safe-area-inset-top, 0)"
        }}
      >
        {/* Header */}
        <div class="h-header flex items-center justify-between px-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Show when={!props.isCollapsed || props.isMobile}>
            <A href="/" onClick={() => props.onClose()} class="flex items-center gap-2">
              <span class="text-xl">✨</span>
              <span class="font-semibold text-slate-900 dark:text-white">Permissive</span>
            </A>
          </Show>
          <Show when={props.isCollapsed && !props.isMobile}>
            <A href="/" class="flex items-center justify-center w-full">
              <span class="text-xl">✨</span>
            </A>
          </Show>

          {/* Close button (mobile) / Collapse button (desktop) */}
          <Show when={props.isMobile}>
            <button
              onClick={() => props.onClose()}
              class="p-2 -mr-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <svg class="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Show>
        </div>

        {/* Navigation */}
        <nav class="flex-1 p-2 space-y-4 overflow-y-auto">
          {/* Main Navigation */}
          <div class="space-y-1">
            <For each={navItems}>
              {(item) => (
                <A
                  href={item.href}
                  onClick={() => props.onClose()}
                  class={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title={props.isCollapsed && !props.isMobile ? (locale() === "ko" ? item.labelKo : item.label) : undefined}
                >
                  <span class="text-base shrink-0">{item.icon}</span>
                  <Show when={!props.isCollapsed || props.isMobile}>
                    <span>{locale() === "ko" ? item.labelKo : item.label}</span>
                  </Show>
                </A>
              )}
            </For>
          </div>

          {/* Quick Links - hidden when collapsed */}
          <Show when={!props.isCollapsed || props.isMobile}>
            {/* Divider */}
            <div class="border-t border-slate-200 dark:border-slate-800" />

            {/* Web API Quick Links */}
            <div>
              <h3 class="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {locale() === "ko" ? "인기 Web API" : "Popular Web API"}
              </h3>
              <div class="space-y-0.5">
                <For each={quickLinks.webApi}>
                  {(item) => (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                    >
                      <span class="w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-sm group-hover:scale-110 transition-transform shrink-0">
                        {item.icon}
                      </span>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {item.name}
                        </div>
                        <div class="text-xs text-slate-400 dark:text-slate-500 truncate">
                          {locale() === "ko" ? item.descKo : item.desc}
                        </div>
                      </div>
                      <svg class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </For>
              </div>
            </div>

            {/* Libraries Quick Links */}
            <div>
              <h3 class="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {locale() === "ko" ? "인기 Libraries" : "Popular Libraries"}
              </h3>
              <div class="space-y-0.5">
                <For each={quickLinks.libraries}>
                  {(item) => (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                    >
                      <span class="w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-sm group-hover:scale-110 transition-transform shrink-0">
                        {item.icon}
                      </span>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {item.name}
                        </div>
                        <div class="text-xs text-slate-400 dark:text-slate-500 truncate">
                          {locale() === "ko" ? item.descKo : item.desc}
                        </div>
                      </div>
                      <svg class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </nav>

        {/* Footer - Collapse toggle (desktop) + GitHub */}
        <div class="border-t border-slate-200 dark:border-slate-800 p-2 shrink-0">
          {/* Collapse Toggle Button (desktop only) */}
          <Show when={!props.isMobile}>
            <button
              onClick={() => props.onToggleCollapse()}
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title={props.isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                class={`w-5 h-5 transition-transform duration-200 ${props.isCollapsed ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <Show when={!props.isCollapsed}>
                <span>{locale() === "ko" ? "접기" : "Collapse"}</span>
              </Show>
            </button>
          </Show>

          {/* GitHub Link */}
          <a
            href="https://github.com/soundbluemusic/Permissive"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
            title={props.isCollapsed && !props.isMobile ? "GitHub" : undefined}
          >
            <span class="w-7 h-7 flex items-center justify-center rounded-md bg-slate-900 dark:bg-white shrink-0">
              <svg class="w-4 h-4 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </span>
            <Show when={!props.isCollapsed || props.isMobile}>
              <div class="flex-1">
                <div class="text-sm font-medium text-slate-700 dark:text-slate-200">GitHub</div>
                <div class="text-xs text-slate-400 dark:text-slate-500">View source</div>
              </div>
            </Show>
          </a>
        </div>
      </aside>
    </>
  );
}
