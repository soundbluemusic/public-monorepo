import { For } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useI18n } from "@/i18n";

const navItems = [
  {
    href: "/",
    label: "Home",
    labelKo: "홈",
    icon: (
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    href: "/web-api",
    label: "Web API",
    labelKo: "Web API",
    icon: (
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  {
    href: "/libraries",
    label: "Libraries",
    labelKo: "Libraries",
    icon: (
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
];

export default function BottomNav() {
  const { locale } = useI18n();
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav
      class="fixed bottom-0 left-0 right-0 h-bottom-nav bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-bottom-nav md:hidden"
      style={{ "padding-bottom": "env(safe-area-inset-bottom, 0)" }}
    >
      <div class="flex items-center justify-around h-full px-2">
        <For each={navItems}>
          {(item) => (
            <A
              href={item.href}
              class={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${
                isActive(item.href)
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <span class={isActive(item.href) ? "scale-110" : ""}>
                {item.icon}
              </span>
              <span class="text-xs font-medium">
                {locale() === "ko" ? item.labelKo : item.label}
              </span>
            </A>
          )}
        </For>
      </div>
    </nav>
  );
}
