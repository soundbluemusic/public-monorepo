/**
 * @fileoverview 반응형 사이드바 컴포넌트
 *
 * 모바일과 데스크톱에서 다른 동작을 합니다:
 * - 모바일: 슬라이드 오버레이 (isOpen으로 제어)
 * - 데스크톱: 접기/펼치기 (isCollapsed로 제어)
 *
 * @example
 * ```tsx
 * <Sidebar
 *   isOpen={sidebarOpen()}
 *   isCollapsed={sidebarCollapsed()}
 *   isMobile={isMobile()}
 *   isReady={isReady()}
 *   onClose={() => setSidebarOpen(false)}
 *   onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
 * />
 * ```
 */
import { Show, For } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useI18n } from "@/i18n";

/**
 * 사이드바 Props
 * @property isOpen - 모바일에서 사이드바 표시 여부
 * @property isCollapsed - 데스크톱에서 접힘 상태 (아이콘만 표시)
 * @property isMobile - 모바일 뷰포트 여부
 * @property isReady - 하이드레이션 완료 여부 (트랜지션 활성화용)
 * @property onClose - 사이드바 닫기 콜백 (모바일)
 * @property onToggleCollapse - 접기/펼치기 토글 콜백 (데스크톱)
 */
interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  isReady: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

interface NavItem {
  href: string;
  label: string;
  labelKo: string;
  icon: string;
}

interface QuickLink {
  name: string;
  desc: string;
  descKo: string;
  href: string;
  icon: string;
}

interface QuickLinksConfig {
  webApi: readonly QuickLink[];
  libraries: readonly QuickLink[];
}

const navItems: readonly NavItem[] = [
  { href: "/", label: "Home", labelKo: "홈", icon: "🏠" },
  { href: "/web-api", label: "Web API", labelKo: "Web API", icon: "🌐" },
  { href: "/libraries", label: "Libraries", labelKo: "Libraries", icon: "📦" },
] as const;

const quickLinks: QuickLinksConfig = {
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
} as const;

/**
 * 반응형 사이드바 컴포넌트
 * @component
 * @returns 모바일에서는 오버레이 사이드바, 데스크톱에서는 고정 사이드바
 */
export default function Sidebar(props: SidebarProps) {
  const { locale, localePath } = useI18n();
  const location = useLocation();

  const isActive = (href: string) => location.pathname === localePath(href);

  /**
   * 상태에 따른 사이드바 너비 계산
   * - 모바일: 항상 전체 너비 (--sidebar-width)
   * - 데스크톱 펼침: --sidebar-width
   * - 데스크톱 접힘: --sidebar-collapsed-width
   */
  const getSidebarWidth = () => {
    if (props.isMobile) {
      return "var(--sidebar-width)";
    }
    return props.isCollapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)";
  };

  /**
   * 모바일 슬라이드 애니메이션용 transform 계산
   * - 모바일 열림: translateX(0)
   * - 모바일 닫힘: translateX(-100%)
   * - 데스크톱: 항상 translateX(0)
   */
  const getTransform = () => {
    if (props.isMobile) {
      return props.isOpen ? "translateX(0)" : "translateX(-100%)";
    }
    return "translateX(0)";
  };

  return (
    <>
      {/* Overlay (mobile only) */}
      <Show when={props.isMobile && props.isOpen}>
        <div
          class={`fixed inset-0 z-overlay ${props.isReady ? "transition-opacity duration-200" : ""}`}
          style={{ "background-color": "rgba(15, 23, 22, 0.5)" }}
          onClick={() => props.onClose()}
        />
      </Show>

      {/* Sidebar */}
      <aside
        class={`fixed top-0 left-0 h-full z-sidebar flex flex-col ${props.isReady ? "transition-all duration-200 ease-out" : ""}`}
        style={{
          width: getSidebarWidth(),
          transform: getTransform(),
          "padding-top": "env(safe-area-inset-top, 0)",
          "background-color": "var(--bg-elevated)",
          "border-right": "1px solid var(--border-primary)"
        }}
      >
        {/* Header */}
        <div
          class="h-header flex items-center justify-between px-3 shrink-0"
          style={{ "border-bottom": "1px solid var(--border-primary)" }}
        >
          <Show when={!props.isCollapsed || props.isMobile}>
            <A href={localePath("/")} onClick={() => props.onClose()} class="flex items-center gap-2.5">
              <span class="text-lg">✨</span>
              <span class="font-semibold" style={{ color: "var(--text-primary)" }}>Permissive</span>
            </A>
          </Show>
          <Show when={props.isCollapsed && !props.isMobile}>
            <A href={localePath("/")} class="flex items-center justify-center w-full">
              <span class="text-lg">✨</span>
            </A>
          </Show>

          {/* Close button (mobile) */}
          <Show when={props.isMobile}>
            <button
              onClick={() => props.onClose()}
              class="p-2 -mr-1 rounded-lg hover-bg"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Close menu"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  href={localePath(item.href)}
                  onClick={() => props.onClose()}
                  class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    "background-color": isActive(item.href) ? "var(--bg-tertiary)" : "transparent",
                    color: isActive(item.href) ? "var(--accent-primary)" : "var(--text-secondary)"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  title={props.isCollapsed && !props.isMobile ? (locale() === "ko" ? item.labelKo : item.label) : undefined}
                  aria-current={isActive(item.href) ? "page" : undefined}
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
            <div style={{ "border-top": "1px solid var(--border-primary)" }} />

            {/* Web API Quick Links */}
            <div>
              <h3
                class="px-3 mb-2 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {locale() === "ko" ? "인기 Web API" : "Popular Web API"}
              </h3>
              <div class="space-y-0.5">
                <For each={quickLinks.webApi}>
                  {(item) => (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-3 px-3 py-2 rounded-lg hover-bg-secondary group"
                    >
                      <span
                        class="w-7 h-7 flex items-center justify-center rounded-md text-sm group-hover:scale-110 transition-transform shrink-0"
                        style={{ "background-color": "var(--bg-tertiary)" }}
                      >
                        {item.icon}
                      </span>
                      <div class="flex-1 min-w-0">
                        <div
                          class="text-sm font-medium transition-colors"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {item.name}
                        </div>
                        <div
                          class="text-xs truncate"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {locale() === "ko" ? item.descKo : item.desc}
                        </div>
                      </div>
                      <svg
                        class="w-3.5 h-3.5 transition-colors shrink-0"
                        style={{ color: "var(--text-tertiary)" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </For>
              </div>
            </div>

            {/* Libraries Quick Links */}
            <div>
              <h3
                class="px-3 mb-2 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {locale() === "ko" ? "인기 Libraries" : "Popular Libraries"}
              </h3>
              <div class="space-y-0.5">
                <For each={quickLinks.libraries}>
                  {(item) => (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-3 px-3 py-2 rounded-lg hover-bg-secondary group"
                    >
                      <span
                        class="w-7 h-7 flex items-center justify-center rounded-md text-sm group-hover:scale-110 transition-transform shrink-0"
                        style={{ "background-color": "var(--bg-tertiary)" }}
                      >
                        {item.icon}
                      </span>
                      <div class="flex-1 min-w-0">
                        <div
                          class="text-sm font-medium transition-colors"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {item.name}
                        </div>
                        <div
                          class="text-xs truncate"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {locale() === "ko" ? item.descKo : item.desc}
                        </div>
                      </div>
                      <svg
                        class="w-3.5 h-3.5 transition-colors shrink-0"
                        style={{ color: "var(--text-tertiary)" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
        <div class="p-2 shrink-0" style={{ "border-top": "1px solid var(--border-primary)" }}>
          {/* Collapse Toggle Button (desktop only) */}
          <Show when={!props.isMobile}>
            <button
              onClick={() => props.onToggleCollapse()}
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover-bg"
              style={{ color: "var(--text-secondary)" }}
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
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover-bg-secondary group"
            title={props.isCollapsed && !props.isMobile ? "GitHub" : undefined}
          >
            <span
              class="w-7 h-7 flex items-center justify-center rounded-md shrink-0"
              style={{ "background-color": "var(--text-primary)" }}
            >
              <svg class="w-4 h-4" style={{ color: "var(--bg-elevated)" }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </span>
            <Show when={!props.isCollapsed || props.isMobile}>
              <div class="flex-1">
                <div class="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>GitHub</div>
                <div class="text-xs" style={{ color: "var(--text-tertiary)" }}>View source</div>
              </div>
            </Show>
          </a>
        </div>
      </aside>
    </>
  );
}
