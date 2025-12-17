/**
 * @fileoverview 앱 헤더 컴포넌트
 *
 * 모바일 메뉴 버튼, 로고, 테마/언어 토글을 포함합니다.
 * 스크롤 시 배경이 변경되는 효과가 있습니다.
 *
 * @example
 * ```tsx
 * // DocsLayout에서 사용
 * <Header
 *   onMenuClick={() => setSidebarOpen((v) => !v)}
 *   isSidebarOpen={sidebarOpen()}
 * />
 * ```
 */
import { A } from "@solidjs/router";
import { createSignal, onMount, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageToggle from "../ui/LanguageToggle";

/**
 * 헤더 Props
 * @property onMenuClick - 모바일 메뉴 버튼 클릭 핸들러
 * @property isSidebarOpen - 사이드바 열림 상태 (접근성용)
 */
interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

/**
 * 앱 헤더 컴포넌트
 * @component
 * @returns 고정 헤더 (모바일 메뉴 버튼, 로고, 테마/언어 토글 포함)
 */
export default function Header(props: HeaderProps) {
  const [scrolled, setScrolled] = createSignal(false);

  onMount(() => {
    if (isServer) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    onCleanup(() => window.removeEventListener("scroll", handleScroll));
  });

  return (
    <header
      class={`fixed top-0 left-0 right-0 z-header h-header flex items-center justify-between px-4 transition-all duration-200 ${
        scrolled()
          ? "backdrop-blur-md shadow-sm"
          : ""
      }`}
      style={{
        "padding-top": "env(safe-area-inset-top, 0)",
        "background-color": scrolled() ? "var(--bg-elevated)" : "var(--bg-primary)",
        "border-bottom": `1px solid ${scrolled() ? "var(--border-primary)" : "transparent"}`
      }}
    >
      {/* Left: Menu button (mobile) + Logo */}
      <div class="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={() => props.onMenuClick()}
          class="md:hidden p-2 -ml-2 rounded-lg hover-bg"
          style={{ color: "var(--text-secondary)" }}
          aria-label={props.isSidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={props.isSidebarOpen}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {props.isSidebarOpen ? (
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Logo */}
        <A href="/" class="flex items-center gap-2.5 group">
          <span class="text-lg">✨</span>
          <span
            class="font-semibold transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            Permissive
          </span>
        </A>
      </div>

      {/* Right: Controls */}
      <div class="flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
