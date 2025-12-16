import { A } from "@solidjs/router";
import { createSignal, onMount, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageToggle from "../ui/LanguageToggle";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

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
      class={`fixed top-0 left-0 right-0 z-header h-header flex items-center justify-between px-4 border-b transition-all duration-200 ${
        scrolled()
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-slate-200 dark:border-slate-800"
          : "bg-white dark:bg-slate-900 border-transparent"
      }`}
      style={{ "padding-top": "env(safe-area-inset-top, 0)" }}
    >
      {/* Left: Menu button (mobile) + Logo */}
      <div class="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={() => props.onMenuClick()}
          class="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={props.isSidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={props.isSidebarOpen}
        >
          <svg class="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {props.isSidebarOpen ? (
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Logo */}
        <A href="/" class="flex items-center gap-2 group">
          <span class="text-xl">✨</span>
          <span class="font-bold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
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
