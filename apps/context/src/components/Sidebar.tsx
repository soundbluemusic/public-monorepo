import { For, createMemo } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { categories, getCategoryColor } from "@/data/categories";
import { useI18n } from "@/i18n";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar(props: SidebarProps) {
  const location = useLocation();
  const { locale, t } = useI18n();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const sortedCategories = createMemo(() =>
    [...categories].sort((a, b) => a.order - b.order)
  );

  const getCategoryName = (category: typeof categories[0]) => {
    return category.name[locale()];
  };

  return (
    <aside
      class={`fixed top-16 left-0 bottom-0 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
        props.isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <nav class="h-full overflow-y-auto py-4 px-3">
        {/* Home link */}
        <div class="mb-4">
          <A
            href="/"
            class={`sidebar-link ${isActive("/") && location.pathname === "/" ? "sidebar-link-active" : ""}`}
            aria-current={location.pathname === "/" ? "page" : undefined}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{t("home")}</span>
          </A>
        </div>

        {/* Browse all */}
        <div class="mb-4">
          <A
            href="/browse"
            class={`sidebar-link ${isActive("/browse") ? "sidebar-link-active" : ""}`}
            aria-current={isActive("/browse") ? "page" : undefined}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>{t("browse")}</span>
          </A>
        </div>

        {/* Divider */}
        <div class="border-t border-gray-200 dark:border-gray-700 my-4" />

        {/* Categories section */}
        <div class="mb-2 px-4">
          <h3 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {t("category")}
          </h3>
        </div>

        {/* Category list */}
        <div class="space-y-1">
          <For each={sortedCategories()}>
            {(category) => (
              <A
                href={`/category/${category.id}`}
                class={`sidebar-link ${isActive(`/category/${category.id}`) ? "sidebar-link-active" : ""}`}
                aria-current={isActive(`/category/${category.id}`) ? "page" : undefined}
              >
                <span
                  class={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${getCategoryColor(category.color)}`}
                >
                  {category.icon}
                </span>
                <span class="flex-1 truncate">{getCategoryName(category)}</span>
              </A>
            )}
          </For>
        </div>

        {/* Divider */}
        <div class="border-t border-gray-200 dark:border-gray-700 my-4" />

        {/* Additional links */}
        <div class="space-y-1">
          <A
            href="/about"
            class={`sidebar-link ${isActive("/about") ? "sidebar-link-active" : ""}`}
            aria-current={isActive("/about") ? "page" : undefined}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t("about")}</span>
          </A>
        </div>
      </nav>
    </aside>
  );
}
